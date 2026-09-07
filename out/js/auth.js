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
            <div class="p-3">
                <div class="badge badge-accent mb-2">
                    <i data-lucide="lock flex-inline"></i> ${isSwahili ? 'Uthibitisho wa Mtumiaji' : 'Firebase Authenticated Access'}
                </div>
                <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:4px;">
                    ${isSwahili ? 'Ingia Kwenye Vanbransa Operations OS' : 'Log In to Vanbransa Operations OS'}
                </h3>
                <p class="text-xs text-muted mb-4">
                    ${isSwahili ? 'Ingiza barua pepe au nambari yako maalum ya kuingia.' : 'Enter your registered email address or access code and password.'}
                </p>

                <form id="form-user-login">
                    <div class="form-group mb-3">
                        <label class="font-bold text-xs">${isSwahili ? 'Barua Pepe au Access Code *' : 'Email Address or Access Code *'}</label>
                        <input type="text" id="login-identifier" class="input-field" placeholder="e.g. housekeeper@vanbransa.com or VP-CLN-102934" required style="background: rgba(0,0,0,0.4); border: 1px solid rgba(224,159,62,0.3); padding:10px; color:#fff; width:100%; border-radius:6px;">
                    </div>

                    <div class="form-group mb-4">
                        <label class="font-bold text-xs">${isSwahili ? 'Nambari ya Siri (Password) *' : 'Password *'}</label>
                        <input type="password" id="login-password" class="input-field" placeholder="••••••••" required style="background: rgba(0,0,0,0.4); border: 1px solid rgba(224,159,62,0.3); padding:10px; color:#fff; width:100%; border-radius:6px;">
                    </div>

                    <button type="submit" class="btn btn-primary btn-block p-3 font-bold flex align-center justify-center gap-2" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                        <i data-lucide="log-in"></i> ${isSwahili ? 'Ingia Sasa' : 'Authenticate & Log In'}
                    </button>
                </form>
            </div>
        `;

        window.HaoKeepApp?.showModal(isSwahili ? 'Ingia Mfomoni' : 'User Login & Access', modalContent);

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
