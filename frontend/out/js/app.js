/**
 * Main Application Orchestrator & State Controller for CleanPulse / HaoKeep
 */
window.HaoKeepApp = {
    init() {
        console.log('Initializing CleanPulse (HaoKeep) Platform...');
        window.HaoKeepSync.loadOutboxFromLocalStorage();
        this.bindGlobalControls();
        this.updateNotifBadge();
        this.renderActiveView();
        
        // Initial toast notification
        this.showToast('CleanPulse Operations Platform initialized! Multi-persona active.', 'info');

        // Handle PWA Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPWAInstallPrompt = e;
            this.showPWAInstallToast();
        });
    },

    showPWAInstallToast() {
        if (!window.deferredPWAInstallPrompt) return;
        this.showToast('📱 Install CleanPulse App on your home screen for quick offline access!', 'info');
    },

    bindGlobalControls() {
        const store = window.HaoKeepStore;

        // Role Access / Sign In Dropdown
        const personaSelect = document.getElementById('persona-select');
        if (personaSelect) {
            personaSelect.addEventListener('change', (e) => {
                const targetPersona = e.target.value;
                if (targetPersona === 'landing') {
                    store.context.persona = 'landing';
                    this.renderActiveView();
                    return;
                }

                const currentUser = window.HaoKeepAuth?.currentUser;
                // If user is already logged in with matching role or admin, allow direct navigation
                if (currentUser && (currentUser.persona === targetPersona || currentUser.persona === 'admin')) {
                    store.context.persona = targetPersona;
                    this.addAuditLog(`Switched Role View to ${targetPersona.toUpperCase()} (${currentUser.name})`);
                    this.renderActiveView();
                } else {
                    // Prompt Login Modal for selected role level
                    window.HaoKeepAuth?.showLoginModal(targetPersona);
                    // Reset dropdown selection until authenticated
                    personaSelect.value = store.context.persona || '';
                }
            });
        }

        // Offline / Online Network Status Toggle
        const offlineBtn = document.getElementById('offline-toggle-btn');
        if (offlineBtn) {
            offlineBtn.addEventListener('click', () => {
                store.context.isOnline = !store.context.isOnline;
                const statusText = document.getElementById('network-status-text');
                
                if (store.context.isOnline) {
                    offlineBtn.className = 'status-pill status-online';
                    if (statusText) statusText.innerText = 'Online';
                    window.HaoKeepSync.flushOutbox();
                } else {
                    offlineBtn.className = 'status-pill status-offline';
                    if (statusText) statusText.innerText = 'Simulated Offline';
                    this.showToast('App is now running in Simulated Offline Mode.', 'warning');
                }
            });
        }

        // Market Selector
        document.getElementById('market-selector')?.addEventListener('change', (e) => {
            store.context.market = e.target.value;
            // Auto update currency
            const marketCurrency = { KE: 'KES', US: 'USD', UK: 'GBP', NG: 'KES', ZA: 'USD' }[e.target.value] || 'USD';
            store.context.currency = marketCurrency;
            const currSelect = document.getElementById('currency-selector');
            if (currSelect) currSelect.value = marketCurrency;

            this.showToast(`Market switched to ${e.target.value} (${marketCurrency})`, 'info');
            this.renderActiveView();
        });

        // Currency Selector
        document.getElementById('currency-selector')?.addEventListener('change', (e) => {
            store.context.currency = e.target.value;
            this.renderActiveView();
        });

        // Language Selector
        document.getElementById('lang-selector')?.addEventListener('change', (e) => {
            store.context.language = e.target.value;
            this.showToast(`Language toggled to ${e.target.value === 'sw' ? 'Kiswahili' : 'English'}`, 'info');
            this.renderActiveView();
        });

        // Header Log In / Auth Button
        document.getElementById('header-btn-login')?.addEventListener('click', () => {
            const user = window.HaoKeepAuth?.currentUser;
            if (user) {
                // Show options modal or logout directly
                const isSwahili = store.context.language === 'sw';
                const content = `
                    <div class="p-3 text-center">
                        <div class="avatar-lg bg-primary text-dark font-bold text-xl rounded-circle mx-auto mb-2" style="width:60px; height:60px; line-height:60px; border-radius:50%; background: #e09f3e; color:#0a0806;">
                            ${user.avatar}
                        </div>
                        <h3 class="font-bold text-lg mb-1">${user.name}</h3>
                        <div class="badge badge-primary mb-2">${user.roleTitle}</div>
                        <p class="text-xs text-dim mb-3">
                            Email: <strong>${user.email}</strong><br>
                            Access Code: <code class="text-accent">${user.accessCode}</code><br>
                            Phone: <strong>${user.phone}</strong>
                        </p>
                        <div class="flex gap-2 justify-center">
                            <button id="btn-user-logout-confirm" class="btn btn-danger btn-block p-2">
                                <i data-lucide="log-out"></i> ${isSwahili ? 'Kutoka (Log Out)' : 'Sign Out / Log Out'}
                            </button>
                        </div>
                    </div>
                `;
                this.showModal(isSwahili ? 'Akaunti Yako' : 'Logged In User Profile', content);
                document.getElementById('btn-user-logout-confirm')?.addEventListener('click', () => {
                    this.closeModal();
                    window.HaoKeepAuth.logout();
                });
            } else {
                window.HaoKeepAuth?.showLoginModal(store.context.persona);
            }
        });

        // Header Subscribe Button
        document.getElementById('header-btn-subscribe')?.addEventListener('click', () => {
            window.HaoKeepSubscription.openSubscriptionModal('pro');
        });

        // Header Register Account Button
        document.getElementById('header-btn-register')?.addEventListener('click', () => {
            window.HaoKeepEnroll.showRegistrationModal();
        });

        // Hero Register Account Button
        document.getElementById('hero-btn-register')?.addEventListener('click', () => {
            window.HaoKeepEnroll.showRegistrationModal();
        });

        // Notification Center Bell Modal
        document.getElementById('notif-center-btn')?.addEventListener('click', () => {
            this.openNotificationCenterModal();
        });
    },

    openNotificationCenterModal() {
        const store = window.HaoKeepStore;
        const notifs = store.notifications || [];
        
        // Mark all as read
        notifs.forEach(n => n.unread = false);
        this.updateNotifBadge();

        const notifHTML = `
            <div class="p-2">
                <div class="flex-between mb-3 border-b border-gray pb-2">
                    <div>
                        <h4 class="font-bold text-lg"><i data-lucide="bell" class="text-primary"></i> Operations Alert & Notification Center</h4>
                        <p class="text-xs text-muted">Real-time push alerts, iCal dispatches, M-Pesa payouts & GPS check-ins</p>
                    </div>
                    <button class="btn btn-xs btn-secondary" onclick="window.HaoKeepApp.showToast('Test Notification Triggered!', 'info')">
                        <i data-lucide="send"></i> Test Alert
                    </button>
                </div>

                <div class="notif-list" style="max-height:340px; overflow-y:auto;">
                    ${notifs.length ? notifs.map(n => `
                        <div class="notif-item ${n.unread ? 'unread' : ''}">
                            <div class="notif-title">
                                <span>${n.title}</span>
                                <span class="notif-time">${n.timestamp}</span>
                            </div>
                            <div class="notif-msg">${n.message}</div>
                        </div>
                    `).join('') : '<div class="p-4 text-center text-muted">No alerts in inbox.</div>'}
                </div>
            </div>
        `;

        this.showModal('Notification & Push Alert Inbox', notifHTML);
    },

    updateNotifBadge() {
        const store = window.HaoKeepStore;
        const badge = document.getElementById('notif-badge-count');
        const unreadCount = (store.notifications || []).filter(n => n.unread).length;
        if (badge) {
            badge.innerText = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    },

    // Toast Manager & Alert Dispatcher
    showToast(message, type = 'info') {
        const store = window.HaoKeepStore;
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Push to real-time notification store
        if (store.notifications) {
            store.notifications.unshift({
                id: 'NOTIF-' + Date.now(),
                type: type.toUpperCase(),
                title: `${type === 'success' ? '✅ Operational Success' : (type === 'warning' ? '⚠️ Alert Warning' : 'ℹ️ System Push Alert')}`,
                message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: true
            });
            this.updateNotifBadge();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info')}"></i>
            <div>${message}</div>
        `;
        container.appendChild(toast);

        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.remove();
        }, 4000);
    },

    renderActiveView() {
        const store = window.HaoKeepStore;
        const persona = store.context.persona;

        // Hide all surfaces
        document.querySelectorAll('.surface-view').forEach(el => el.classList.remove('active'));

        // Show active surface container
        const targetSurface = document.getElementById(`surface-${persona}`);
        if (targetSurface) {
            targetSurface.classList.add('active');

            // Render view component
            switch (persona) {
                case 'landing':
                    targetSurface.innerHTML = window.HaoKeepLandingView.render();
                    window.HaoKeepLandingView.bindEvents();
                    break;
                case 'housekeeper':
                    window.HaoKeepHousekeeperView.render(targetSurface);
                    break;
                case 'owner':
                    window.HaoKeepOwnerView.render(targetSurface);
                    break;
                case 'agency':
                    window.HaoKeepAgencyView.render(targetSurface);
                    break;
                case 'finance':
                    window.HaoKeepFinanceView.render(targetSurface);
                    break;
                case 'admin':
                    window.HaoKeepAdminView.render(targetSurface);
                    break;
            }
        }

        // Update Persona Select Dropdown state
        const personaSelectEl = document.getElementById('persona-select');
        if (personaSelectEl) {
            const user = window.HaoKeepAuth?.currentUser;
            if (user) {
                personaSelectEl.value = user.persona;
            } else {
                personaSelectEl.value = store.context.persona || '';
            }
        }

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Modal Manager
    showModal(title, htmlContent) {
        const backdrop = document.getElementById('modal-backdrop');
        const container = document.getElementById('modal-container');
        if (!backdrop || !container) return;

        container.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn" onclick="window.HaoKeepApp.closeModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">${htmlContent}</div>
        `;

        backdrop.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    },

    closeModal() {
        const backdrop = document.getElementById('modal-backdrop');
        if (backdrop) backdrop.classList.add('hidden');
    },

    // Cryptographic Audit Hash Chain Appender
    addAuditLog(eventDescription, actor = null) {
        const store = window.HaoKeepStore;
        const prevItem = store.auditLog[store.auditLog.length - 1];
        const prevHash = prevItem ? prevItem.hash : '0000000000000000';
        
        const timestamp = new Date().toISOString();
        const actorName = actor || store.context.persona.toUpperCase();

        // Pseudo SHA-256 hash generator
        const rawString = `${prevHash}-${timestamp}-${actorName}-${eventDescription}`;
        let hashVal = 0;
        for (let i = 0; i < rawString.length; i++) {
            hashVal = ((hashVal << 5) - hashVal) + rawString.charCodeAt(i);
            hashVal |= 0;
        }
        const hash = Math.abs(hashVal).toString(16).padStart(64, 'a7f93e');

        const newLog = {
            index: store.auditLog.length + 1,
            timestamp,
            actor: actorName,
            event: eventDescription,
            prevHash,
            hash
        };

        store.auditLog.push(newLog);
    }
};

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.HaoKeepApp.init();
});
