import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'properties-data.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Connected SSE clients for instant TV real-time push
const sseClients: express.Response[] = [];

// Helper to read data
function getPropertiesData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading properties data:', err);
  }
  return null;
}

// Helper to save data
function savePropertiesData(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Broadcast instantly to all connected Smart TVs and open tabs
    sseClients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify({ type: 'PROPERTIES_UPDATED', payload: data })}\n\n`);
      } catch {
        // Ignored
      }
    });
  } catch (err) {
    console.error('Error saving properties data:', err);
  }
}

// REST API routes
app.get('/api/properties', (_req, res) => {
  const data = getPropertiesData();
  res.json({ properties: data });
});

app.post('/api/properties', (req, res) => {
  const { properties } = req.body;
  if (!properties || !Array.isArray(properties)) {
    return res.status(400).json({ error: 'Invalid properties array' });
  }
  savePropertiesData(properties);
  res.json({ success: true, count: properties.length });
});

// SSE endpoint for sub-second real-time push to all Smart TVs
app.get('/api/properties/stream', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send current data immediately on connection
  const initialData = getPropertiesData();
  if (initialData) {
    res.write(`data: ${JSON.stringify({ type: 'INITIAL_STATE', payload: initialData })}\n\n`);
  }

  sseClients.push(res);

  _req.on('close', () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Sãan Degree TV Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
