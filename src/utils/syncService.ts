import { Property } from '../types';

export class SyncService {
  private static eventSource: EventSource | null = null;
  private static pollTimer: number | null = null;

  // Save properties to server (broadcasts to all TVs worldwide in real-time)
  static async saveToServer(properties: Property[]): Promise<boolean> {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save properties to server:', err);
      return false;
    }
  }

  // Fetch current properties from server
  static async fetchFromServer(): Promise<Property[] | null> {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.properties) && data.properties.length > 0) {
          return data.properties;
        }
      }
    } catch (err) {
      console.error('Failed to fetch from server:', err);
    }
    return null;
  }

  // Subscribe to real-time updates (via Server-Sent Events with polling fallback for TVs)
  static subscribeToUpdates(onUpdate: (properties: Property[]) => void): () => void {
    let isSubscribed = true;

    // 1. Initial fetch
    this.fetchFromServer().then((data) => {
      if (isSubscribed && data) {
        onUpdate(data);
      }
    });

    // 2. Connect to SSE
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        this.eventSource = new EventSource('/api/properties/stream');

        this.eventSource.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(event.data);
            if (data && data.payload && Array.isArray(data.payload)) {
              onUpdate(data.payload);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        };

        this.eventSource.onerror = () => {
          // SSE connection dropped; polling will handle it
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }
        };
      }
    } catch {
      // EventSource not supported or blocked
    }

    // 3. Robust Polling fallback every 3.5 seconds (ensures 100% reliability on any Smart TV browser)
    this.pollTimer = window.setInterval(async () => {
      if (!isSubscribed) return;
      const data = await this.fetchFromServer();
      if (isSubscribed && data) {
        onUpdate(data);
      }
    }, 3500);

    // Return cleanup unsubscribe function
    return () => {
      isSubscribed = false;
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      if (this.pollTimer !== null) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    };
  }
}
