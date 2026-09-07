/**
 * Futuristic Landing Page View Renderer for CleanPulse / HaoKeep
 */
window.HaoKeepLandingView = {

    render() {
        return `
            <div class="landing-page-wrapper">
                <!-- Hero Section -->
                <section class="landing-hero">
                    <div class="hero-bg-overlay" style="background-image: url('assets/landing_hero.jpg');"></div>
                    <div class="hero-content">
                        <div class="badge badge-accent mb-2">
                            <i data-lucide="sparkles"></i> Autonomous Housekeeping & Turnover Operations
                        </div>
                        <h1 class="hero-title">
                            The Vanbransa Operations OS for <span class="text-gradient">Short-Let Hosts & Agencies</span>
                        </h1>
                        <p class="hero-subtitle">
                            Automate turnover dispatch, iCal calendar ingestion, AI vision quality inspections, KRA eTIMS compliance, and instant M-Pesa payouts across Kenya & global markets.
                        </p>
                        
                        <div class="hero-cta-group">
                            <button id="hero-btn-register" class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, #dda15e, #bc6c25) !important; color:#0a0806 !important; font-weight:800; box-shadow: 0 6px 20px rgba(221, 161, 94, 0.4);">
                                <i data-lucide="user-check"></i> Register Account & Get Unique Access Code
                            </button>
                            <button id="hero-btn-subscribe" class="btn btn-secondary btn-lg" style="background: rgba(255, 255, 255, 0.15) !important; color:#ffffff !important; border: 1.5px solid rgba(255, 255, 255, 0.4) !important; font-weight:700; backdrop-filter: blur(8px);">
                                <i data-lucide="crown" style="color:#e09f3e;"></i> Subscribe & Pricing Plans
                            </button>
                            <button id="hero-btn-demo" class="btn btn-secondary btn-lg" style="background: rgba(255, 255, 255, 0.15) !important; color:#ffffff !important; border: 1.5px solid rgba(255, 255, 255, 0.4) !important; font-weight:700; backdrop-filter: blur(8px);">
                                <i data-lucide="play-circle" style="color:#e09f3e;"></i> Launch Live Platform Demo
                            </button>
                        </div>

                        <!-- Stats Bar -->
                        <div class="hero-stats-bar mt-5">
                            <div class="stat-item">
                                <span class="stat-num">99.8%</span>
                                <span class="stat-lbl">Turnover On-Time SLA</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <span class="stat-num">&lt; 3 Sec</span>
                                <span class="stat-lbl">Instant M-Pesa Settlement</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <span class="stat-num">100%</span>
                                <span class="stat-lbl">KRA eTIMS Tax Compliance</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <span class="stat-num">SHA-256</span>
                                <span class="stat-lbl">Cryptographic Audit Chain</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Interactive Features Showcase Grid -->
                <section class="landing-features py-5">
                    <div class="section-header text-center mb-4">
                        <div class="badge badge-outline mb-1">Architecture</div>
                        <h2 class="section-title">Engineered for Flawless Operations</h2>
                        <p class="section-desc">Designed to replace spreadsheets, manual WhatsApp dispatches, and lost receipts.</p>
                    </div>

                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="calendar"></i></div>
                            <h3>iCal Auto-Ingest & Dispatch</h3>
                            <p>Connect Airbnb, VRBO, or Booking.com iCal feeds. The moment a guest checks out, a turnover clean is auto-created and assigned to the nearest available housekeeper.</p>
                        </div>

                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="eye"></i></div>
                            <h3>AI Vision QC Inspection</h3>
                            <p>Housekeepers upload photo evidence of bed linen, bathrooms, and kitchen setups. CleanPulse AI validates room condition and flags missing inventory instantly.</p>
                        </div>

                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="smartphone"></i></div>
                            <h3>M-Pesa & Multi-Rail Settlement</h3>
                            <p>Pay cleaners automatically upon job verification with M-Pesa B2C or bank transfers. Multi-currency support for KES, USD, and GBP.</p>
                        </div>

                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="file-check-2"></i></div>
                            <h3>Automated KRA eTIMS Invoicing</h3>
                            <p>Generate compliant electronic tax invoices (eTIMS) with verifiable QR codes for every transaction automatically for Kenya KRA compliance.</p>
                        </div>

                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="shield"></i></div>
                            <h3>SHA-256 Cryptographic Audit Log</h3>
                            <p>Every status change, payment, and photo upload is hashed into an immutable log chain, ensuring zero fraud and 100% dispute protection.</p>
                        </div>

                        <div class="feature-card">
                            <div class="feat-icon"><i data-lucide="wifi-off"></i></div>
                            <h3>Offline-First PWA Support</h3>
                            <p>Cleaners working in underground basements or poor network zones can complete checklists offline. Operations auto-sync once connection returns.</p>
                        </div>
                    </div>
                </section>

                <!-- Pricing Preview Section -->
                <section class="landing-pricing py-5">
                    <div class="section-header text-center mb-4">
                        <div class="badge badge-accent mb-1">Subscription Plans</div>
                        <h2 class="section-title">Flexible Pricing for Every Scale</h2>
                        <p class="section-desc">Choose monthly, 3-month, 6-month, or annual plans with up to 35% savings.</p>
                    </div>

                    <div class="text-center">
                        <button id="landing-open-plans-btn" class="btn btn-primary btn-lg">
                            <i data-lucide="layers"></i> View All Plans & Subscribe Now
                        </button>
                    </div>
                </section>
            </div>
        `;
    },

    bindEvents() {
        document.getElementById('hero-btn-subscribe')?.addEventListener('click', () => {
            window.HaoKeepSubscription.openSubscriptionModal('pro');
        });

        document.getElementById('hero-btn-demo')?.addEventListener('click', () => {
            const store = window.HaoKeepStore;
            store.context.persona = 'agency';
            const personaSelect = document.getElementById('persona-select');
            if (personaSelect) personaSelect.value = 'agency';
            window.HaoKeepApp.renderActiveView();
        });

        document.getElementById('landing-open-plans-btn')?.addEventListener('click', () => {
            window.HaoKeepSubscription.openSubscriptionModal('pro');
        });
    }
};
