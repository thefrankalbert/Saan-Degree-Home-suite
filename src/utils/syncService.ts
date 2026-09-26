import { Property } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export class SyncService {
  private static eventSource: EventSource | null = null;
  private static pollTimer: number | null = null;
  private static realtimeChannel: unknown = null;

  // Save properties to Supabase DB and local server API
  static async saveToServer(properties: Property[]): Promise<boolean> {
    try {
      // 1. Persist to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        for (const prop of properties) {
          await supabase.from('property').upsert(
            {
              id: prop.id,
              name: prop.name,
              slug: prop.slug,
              data: prop,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        }
      }

      // 2. Broadcast via local backend API
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save properties:', err);
      return false;
    }
  }

  // Fetch current properties from Supabase or server
  static async fetchFromServer(): Promise<Property[] | null> {
    try {
      // 1. Try Supabase first
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('property')
          .select('data')
          .order('updated_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((row: { data: Property }) => row.data);
        }
      }

      // 2. Fallback to server API
      const res = await fetch('/api/properties');
      if (res.ok) {
        const result = await res.json();
        if (result && Array.isArray(result.properties) && result.properties.length > 0) {
          return result.properties;
        }
      }
    } catch (err) {
      console.error('Failed to fetch from server:', err);
    }
    return null;
  }

  // Subscribe to real-time updates (Supabase Realtime + SSE + Polling fallback)
  static subscribeToUpdates(onUpdate: (properties: Property[]) => void): () => void {
    let isSubscribed = true;

    // Initial load
    this.fetchFromServer().then((data) => {
      if (isSubscribed && data) {
        onUpdate(data);
      }
    });

    // 1. Connect Supabase Realtime if configured
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:property')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'property' },
          async () => {
            if (!isSubscribed) return;
            const freshData = await this.fetchFromServer();
            if (freshData && isSubscribed) {
              onUpdate(freshData);
            }
          }
        )
        .subscribe();

      this.realtimeChannel = channel;
    }

    // 2. SSE fallback
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
          } catch {
            // Ignored
          }
        };

        this.eventSource.onerror = () => {
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }
        };
      }
    } catch {
      // Ignored
    }

    // 3. Fallback Polling every 4 seconds for TVs
    this.pollTimer = window.setInterval(async () => {
      if (!isSubscribed) return;
      const data = await this.fetchFromServer();
      if (isSubscribed && data) {
        onUpdate(data);
      }
    }, 4000);

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
      if (this.realtimeChannel && supabase) {
        supabase.removeChannel(this.realtimeChannel as any);
        this.realtimeChannel = null;
      }
    };
  }
}
