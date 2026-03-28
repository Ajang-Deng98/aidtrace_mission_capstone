import React, { useState, useEffect } from 'react';
import { getTotalPendingCount } from '../utils/offlineDB';
import { syncOfflineData } from '../utils/syncQueue';

function OfflineBanner({ onSyncComplete }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      loadPendingCount();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    loadPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      handleSync();
    }
  }, [isOnline]);

  const loadPendingCount = async () => {
    const count = await getTotalPendingCount();
    setPendingCount(count);
  };

  const handleSync = async () => {
    if (syncing || !isOnline) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncOfflineData();
      const count = await getTotalPendingCount();
      setPendingCount(count);
      setSyncResult(result);
      if (result.synced > 0 && onSyncComplete) onSyncComplete();
      setTimeout(() => setSyncResult(null), 5000);
    } catch (e) {
      console.error('Sync error:', e);
    } finally {
      setSyncing(false);
    }
  };

  // Online with nothing pending — show nothing
  if (isOnline && pendingCount === 0 && !syncResult) return null;

  return (
    <div style={{
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontWeight: '500',
      background: isOnline ? '#d1fae5' : '#fef3c7',
      borderBottom: `1px solid ${isOnline ? '#6ee7b7' : '#fde68a'}`,
      color: isOnline ? '#065f46' : '#92400e'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: isOnline ? '#10b981' : '#f59e0b'
        }} />
        {isOnline
          ? syncResult
            ? `✓ Synced ${syncResult.synced} action${syncResult.synced !== 1 ? 's' : ''} successfully${syncResult.failed > 0 ? ` (${syncResult.failed} failed)` : ''}`
            : pendingCount > 0
              ? `Online — ${pendingCount} action${pendingCount !== 1 ? 's' : ''} pending sync`
              : null
          : `Offline mode — ${pendingCount} action${pendingCount !== 1 ? 's' : ''} queued`
        }
      </div>

      {isOnline && pendingCount > 0 && !syncing && (
        <button onClick={handleSync} style={{
          padding: '4px 12px', background: '#065f46', color: '#ffffff',
          border: 'none', borderRadius: '4px', fontSize: '12px',
          fontWeight: '600', cursor: 'pointer'
        }}>
          Sync Now
        </button>
      )}
      {syncing && <span style={{ fontSize: '12px' }}>Syncing...</span>}
    </div>
  );
}

export default OfflineBanner;
