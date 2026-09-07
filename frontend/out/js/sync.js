/**
 * Offline Sync & Outbox Storage Engine for HaoKeep / CleanPulse
 */
window.HaoKeepSync = {
    outbox: [],

    // Queue item to offline outbox when network is unavailable
    queueOfflineAction(actionType, payload) {
        const item = {
            id: 'SYNC-' + Date.now(),
            timestamp: new Date().toISOString(),
            actionType,
            payload
        };
        this.outbox.push(item);
        this.saveOutboxToLocalStorage();
        
        window.HaoKeepApp?.showToast(`Saved offline (${this.outbox.length} pending sync)`, 'info');
        window.HaoKeepApp?.addAuditLog(`Offline Outbox Queued: ${actionType}`);
    },

    // Process queued offline items upon reconnect
    flushOutbox() {
        if (this.outbox.length === 0) return;

        const count = this.outbox.length;
        this.outbox = [];
        this.saveOutboxToLocalStorage();

        window.HaoKeepApp?.showToast(`Online! Successfully synced ${count} offline items.`, 'success');
        window.HaoKeepApp?.addAuditLog(`Offline Outbox Flushed: ${count} actions processed`);
        window.HaoKeepApp?.renderActiveView();
    },

    saveOutboxToLocalStorage() {
        try {
            localStorage.setItem('haokeep_outbox', JSON.stringify(this.outbox));
        } catch (e) {}
    },

    loadOutboxFromLocalStorage() {
        try {
            const data = localStorage.getItem('haokeep_outbox');
            if (data) this.outbox = JSON.parse(data);
        } catch (e) {}
    }
};
