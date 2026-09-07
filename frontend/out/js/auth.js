/**
 * Authentication Engine & User Session Controller for Vanbransa CleanPulse
 * Multi-Persona Role Access: Housekeeper, Property Owner, Agency Admin, Finance Manager, Platform Admin
 */
window.HaoKeepAuth = {
    // Seed Credentials Database
    seededUsers: [
        {
            email: 'housekeeper@vanbransa.com',
            password: 'cleaner123',
            persona: 'housekeeper',
            name: 'Achieng Mary',
            roleTitle: 'Lead Housekeeper & Field Cleaner',
            accessCode: 'VP-CLN-102934',
            avatar: 'AM',
            phone: '+254 711 987 654'
        },
        {
            email: 'owner@vanbransa.com',
            password: 'host123',
            persona: 'owner',
            name: 'Wanjiku Stays Ltd',
            roleTitle: 'Property Owner & Airbnb Host',
            accessCode: 'VP-HST-492019',
            avatar: 'WS',
            phone: '+254 712 345 678'
        },
        {
            email: 'agency@vanbransa.com',
            password: 'agency123',
            persona: 'agency',
            name: 'Sparkle Clean Services Ltd',
            roleTitle: 'Cleaning Agency Manager',
            accessCode: 'VP-AGN-819204',
            avatar: 'SC',
            phone: '+254 722 998 877'
        },
        {
            email: 'finance@vanbransa.com',
            password: 'finance123',
            persona: 'finance',
            name: 'Karanja David',
            roleTitle: 'Finance & eTIMS Manager',
            accessCode: 'VP-FIN-992103',
            avatar: 'KD',
            phone: '+254 733 112 233'
        },
        {
            email: 'admin@vanbransa.com',
            password: 'admin123',
            persona: 'admin',
            name: 'Vanbransa Ops Command',
            roleTitle: 'Super Admin & Auditor',
            accessCode: 'VP-ADM-000001',
            avatar: 'VA',
            phone: '+254 700 000 000'
        }
    ],

    currentUser: null,

    init() {
        this.loadSession();
    },

    loadSession() {
        try {
            const saved = localStorage.getItem('haokeep_auth_user');
            if (saved) {
                this.currentUser = JSON.parse(saved);
                if (window.HaoKeepStore) {
                    window.HaoKeepStore.context.persona = this.currentUser.persona;
                }
            } else {
                // Default to logged out
                this.currentUser = null;
            }
        } catch (e) {
            this.currentUser = null;
        }
    },

    saveSession(user) {
        this.currentUser = user;
        try {
            localStorage.setItem('haokeep_auth_user', JSON.stringify(user));
        } catch (e) {}
    },

    clearSession() {
        this.currentUser = null;
        try {
            localStorage.removeItem('haokeep_auth_user');
        } catch (e) {}
    },

    login(identifier, password) {
        const query = identifier.trim().toLowerCase();
        const found = this.seededUsers.find(u => 
            (u.email.toLowerCase() === query || u.accessCode.toLowerCase() === query) && u.password === password
        );

        if (found) {
            this.saveSession(found);
            if (window.HaoKeepStore) {
                window.HaoKeepStore.context.persona = found.persona;
            }
            window.HaoKeepApp?.addAuditLog(`User Logged In: [${found.persona.toUpperCase()}] ${found.name}`);
            return { success: true, user: found };
        }
        return { success: false, error: 'Invalid Email/Access Code or Password' };
    },

    logout() {
        if (this.currentUser) {
            window.HaoKeepApp?.addAuditLog(`User Logged Out: ${this.currentUser.name}`);
        }
        this.clearSession();
        if (window.HaoKeepStore) {
            window.HaoKeepStore.context.persona = 'landing';
        }
        window.HaoKeepApp?.renderActiveView();
        window.HaoKeepApp?.showToast('👋 You have been logged out successfully.', 'info');
    },

    showLoginModal(preselectPersona = 'housekeeper') {
        const isSwahili = window.HaoKeepStore?.context?.language === 'sw';
        const modalContent = `
            <div class="p-2">
                <div class="badge badge-accent mb-2">
                    <i data-lucide="lock flex-inline"></i> ${isSwahili ? 'Uthibitisho wa Mtumiaji' : 'Platform User Authentication'}
                </div>
                <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:4px;">
                    ${isSwahili ? 'Ingia Kwenye Vanbransa Operations OS' : 'Log In to Vanbransa Operations OS'}
                </h3>
                <p class="text-xs text-muted mb-3">
                    ${isSwahili ? 'Chagua akaunti au tumia nambari yako maalum ya kuingia.' : 'Select a demo persona or sign in with your email / access code.'}
                </p>

                <!-- Seed Credentials Quick Switch Chips -->
                <div class="card p-2 bg-darker rounded mb-3 border">
                    <div class="text-xxs text-primary font-bold mb-2 uppercase tracking-wider flex-between">
                        <span>⚡ ${isSwahili ? 'Akaunti za Kuingia (Seed Credentials)' : 'Quick-Demo Seed Credentials'}</span>
                        <span class="text-dim">1-Click Auto-Fill</span>
                    </div>
                    <div class="grid-2col gap-2">
                        ${this.seededUsers.map(u => `
                            <button type="button" class="btn btn-xs btn-secondary text-left flex items-center justify-between btn-quick-seed" data-email="${u.email}" data-pass="${u.password}">
                                <div>
                                    <strong class="text-xs text-primary">${u.name}</strong>
                                    <div class="text-xxs text-dim">${u.roleTitle}</div>
                                </div>
                                <span class="badge badge-purple text-xxs">${u.persona}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <form id="form-user-login">
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Barua Pepe au Access Code *' : 'Email Address or Unique Access Code *'}</label>
                        <input type="text" id="login-identifier" class="input-field" placeholder="e.g. housekeeper@vanbransa.com or VP-CLN-102934" required>
                    </div>

                    <div class="form-group mb-3">
                        <label>${isSwahili ? 'Nambari ya Siri (Password) *' : 'Password *'}</label>
                        <input type="password" id="login-password" class="input-field" placeholder="••••••••" required>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block p-3 font-bold" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                        <i data-lucide="log-in"></i> ${isSwahili ? 'Ingia Sasa' : 'Authenticate & Log In'}
                    </button>
                </form>
            </div>
        `;

        window.HaoKeepApp?.showModal(isSwahili ? 'Ingia Mfomoni' : 'User Login & Access', modalContent);

        // Bind quick seed buttons
        document.querySelectorAll('.btn-quick-seed').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.currentTarget.dataset.email;
                const pass = e.currentTarget.dataset.pass;
                document.getElementById('login-identifier').value = email;
                document.getElementById('login-password').value = pass;
            });
        });

        // Auto pre-fill with first seed user matching persona
        const matched = this.seededUsers.find(u => u.persona === preselectPersona) || this.seededUsers[0];
        if (matched) {
            document.getElementById('login-identifier').value = matched.email;
            document.getElementById('login-password').value = matched.password;
        }

        // Form Submit
        document.getElementById('form-user-login')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = document.getElementById('login-identifier').value;
            const password = document.getElementById('login-password').value;

            const res = this.login(identifier, password);
            if (res.success) {
                window.HaoKeepApp?.closeModal();
                window.HaoKeepApp?.showToast(`🔑 Welcome back, ${res.user.name}! Logged in as ${res.user.roleTitle}.`, 'success');
                
                // Update persona selector in header
                const personaSelect = document.getElementById('persona-select');
                if (personaSelect) personaSelect.value = res.user.persona;

                window.HaoKeepApp?.renderActiveView();
            } else {
                window.HaoKeepApp?.showToast(`❌ ${res.error}`, 'error');
            }
        });
    }
};

window.HaoKeepAuth.init();
