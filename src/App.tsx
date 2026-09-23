/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Property } from './types';
import { DEFAULT_PROPERTIES } from './data/defaultProperties';
import { TVKiosk } from './components/TVKiosk';
import { MobileGuestView } from './components/MobileGuestView';
import { AdminDashboard } from './components/AdminDashboard';
import { TVSetupGuideModal } from './components/TVSetupGuideModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { TVTesterModal } from './components/TVTesterModal';
import { SyncService } from './utils/syncService';

const STORAGE_KEY = 'saan_degree_genesis_v3';

export default function App() {
  // Load saved properties or default
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(p => p.id.includes('saan'))) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROPERTIES;
  });

  // URL Query param handling
  const [viewMode, setViewMode] = useState<'admin' | 'kiosk' | 'guest'>('admin');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(DEFAULT_PROPERTIES[0].id);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [isSheetSyncOpen, setIsSheetSyncOpen] = useState(false);
  const [isTVTesterOpen, setIsTVTesterOpen] = useState(false);

  // Initialize view mode from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Support ultra-short params: ?tv, ?kiosk, ?genesis, ?tv=genesis, ?p=1, #tv, #genesis
    const kioskParam = params.get('kiosk');
    const tvParam = params.get('tv');
    const modeParam = params.get('mode');
    const propIdParam = params.get('propId') || params.get('p') || params.get('id');
    const hash = window.location.hash.toLowerCase();

    // Check if URL specifies Genesis or specific property
    const isGenesisRequested = 
      params.has('genesis') || 
      tvParam === 'genesis' || 
      tvParam === '1' || 
      propIdParam === 'genesis' ||
      hash.includes('genesis');

    if (isGenesisRequested) {
      const genesisProp = properties.find(p => p.id.includes('genesis')) || properties[0];
      if (genesisProp) {
        setSelectedPropertyId(genesisProp.id);
      }
    } else if (propIdParam) {
      const found = properties.find(p => p.id === propIdParam || p.id.includes(propIdParam) || p.slug.includes(propIdParam));
      if (found) {
        setSelectedPropertyId(found.id);
      }
    }

    // Activate TV Kiosk mode if ?tv, ?kiosk, #tv, or if genesis is passed
    const isTvMode = 
      kioskParam === 'true' || 
      params.has('tv') || 
      tvParam !== null || 
      params.has('kiosk') || 
      params.has('genesis') || 
      hash.includes('tv');

    if (isTvMode) {
      setViewMode('kiosk');
    } else if (modeParam === 'guest' || params.has('guest')) {
      setViewMode('guest');
    }
  }, [properties]);

  // Persist properties locally, on backend server, and broadcast to all TVs
  const updateProperties = (newProperties: Property[]) => {
    setProperties(newProperties);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProperties));
      // Broadcast via WebSocket/SSE to all connected Smart TVs worldwide
      SyncService.saveToServer(newProperties);
      // Notify other tabs/screens locally
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('lodgecast_sync_channel');
        bc.postMessage({ type: 'UPDATE_PROPERTIES', payload: newProperties });
        bc.close();
      }
    } catch (err) {
      console.error('Failed to persist properties', err);
    }
  };

  // Real-time synchronization across devices (Manager phone/PC <-> Smart TV in apartment)
  useEffect(() => {
    // 1. Subscribe to server push (SSE + polling fallback)
    const unsubscribe = SyncService.subscribeToUpdates((serverProperties) => {
      if (Array.isArray(serverProperties) && serverProperties.length > 0) {
        setProperties(serverProperties);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverProperties));
        } catch {
          // Ignored
        }
      }
    });

    // 2. Same-device local BroadcastChannel
    let bc: BroadcastChannel | null = null;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('lodgecast_sync_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'UPDATE_PROPERTIES' && Array.isArray(event.data.payload)) {
          setProperties(event.data.payload);
        }
      };
    }

    return () => {
      unsubscribe();
      if (bc) bc.close();
    };
  }, []);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const handleUpdateProperty = (updated: Property) => {
    const newList = properties.map(p => p.id === updated.id ? updated : p);
    updateProperties(newList);
  };

  const handleAddProperty = (newProp: Property) => {
    const newList = [...properties, newProp];
    updateProperties(newList);
    setSelectedPropertyId(newProp.id);
  };

  const handleOpenTVKiosk = (propId: string) => {
    setSelectedPropertyId(propId);
    setViewMode('kiosk');
    // Update URL without reload
    const newUrl = `${window.location.origin}${window.location.pathname}?kiosk=true&propId=${propId}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleOpenMobileView = (propId: string) => {
    setSelectedPropertyId(propId);
    setViewMode('guest');
    const newUrl = `${window.location.origin}${window.location.pathname}?mode=guest&propId=${propId}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleExitKiosk = () => {
    setViewMode('admin');
    window.history.pushState({}, '', window.location.pathname);
  };

  // RENDER MODES

  // 1. TV KIOSK FULL SCREEN DISPLAY
  if (viewMode === 'kiosk' && selectedProperty) {
    return (
      <TVKiosk
        property={selectedProperty}
        onExitKiosk={handleExitKiosk}
        isStandalone={new URLSearchParams(window.location.search).get('standalone') === 'true'}
      />
    );
  }

  // 2. GUEST MOBILE COMPANION BOOKLET
  if (viewMode === 'guest' && selectedProperty) {
    return (
      <MobileGuestView
        property={selectedProperty}
        onOpenDashboard={handleExitKiosk}
      />
    );
  }

  // 3. OWNER / CONCIERGE MANAGEMENT DASHBOARD
  return (
    <>
      <AdminDashboard
        properties={properties}
        selectedProperty={selectedProperty}
        onSelectProperty={(prop) => setSelectedPropertyId(prop.id)}
        onUpdateProperty={handleUpdateProperty}
        onAddProperty={handleAddProperty}
        onOpenTVKiosk={handleOpenTVKiosk}
        onOpenMobileView={handleOpenMobileView}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
        onOpenSheetSync={() => setIsSheetSyncOpen(true)}
        onOpenTVTester={() => setIsTVTesterOpen(true)}
      />

      {isSetupGuideOpen && selectedProperty && (
        <TVSetupGuideModal
          property={selectedProperty}
          onClose={() => setIsSetupGuideOpen(false)}
        />
      )}

      {isSheetSyncOpen && (
        <GoogleSheetSyncModal
          properties={properties}
          onApplySync={(updatedList) => updateProperties(updatedList)}
          onClose={() => setIsSheetSyncOpen(false)}
        />
      )}

      {isTVTesterOpen && (
        <TVTesterModal
          onClose={() => setIsTVTesterOpen(false)}
        />
      )}
    </>
  );
}
