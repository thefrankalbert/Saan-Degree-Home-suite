-- Migration Supabase pour Sãan Degree Home Suite
-- Stocke les propriétés, les séjours en cours et permet la synchronisation Realtime instantanée avec la Smart TV

CREATE TABLE IF NOT EXISTS property (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active le temps réel Supabase sur la table property
ALTER PUBLICATION supabase_realtime ADD TABLE property;

-- Active la sécurité niveau ligne (RLS)
ALTER TABLE property ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour la TV et le smartphone du voyageur
CREATE POLICY "Public read on property" ON property
  FOR SELECT USING (true);

-- Politique d'écriture pour l'administration
CREATE POLICY "Public write on property" ON property
  FOR ALL USING (true) WITH CHECK (true);
