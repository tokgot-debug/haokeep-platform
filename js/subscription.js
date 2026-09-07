/**
 * Subscription Engine & Billing Manager for CleanPulse / HaoKeep
 * Handles plan tier selection, multi-cadence pricing (1, 3, 6, 12 Months),
 * discount calculations, M-Pesa STK Push / Card checkout integration,
 * and user subscription state persistence.
 */
window.HaoKeepSubscription = {

    plans: {
        starter: {
            id: 'starter',
            name: 'Solo Host & Small Agency',
            tagline: 'Ideal for independent hosts & agencies managing up to 5 Housekeepers / Units.',
            monthlyPriceUSD: 50, // $50/month base rate for subscribers outside Kenya
            monthlyPriceKES: 7600,
            maxUnits: 5,
            featuresOwner: [
                'Up to 5 Active Property Units',
                'iCal Calendar Auto-Sync (Airbnb/Booking)',
                'AI Turnover Inspection & QC Vision',
                'M-Pesa & Card Auto-Payouts',
                'KRA eTIMS Auto Tax Invoicing',
                'Standard Mobile & Web App Access'
            ],
            featuresAgency: [
                'Up to 5 Active Housekeepers Roster',
                'Automated GPS Housekeeper Tracking',
                'AI Turnover Inspection & QC Vision',
                'M-Pesa & Card Auto-Payouts',
                'KRA eTIMS Auto Tax Invoicing',
                'Agency Dispatch & Territory Control'
            ]
        },
        pro: {
            id: 'pro',
            name: 'Turnover Operations Pro',
            popular: true,
            tagline: 'Built for fast-growing rental managers & professional cleaning agencies.',
            monthlyPriceUSD: 120,
            monthlyPriceKES: 19600,
            maxUnits: 20,
            featuresOwner: [
                'Up to 20 Active Property Units',
                'Unlimited Housekeeper Roster & Dispatch',
                'Automated GPS Route Optimization',
                'SHA-256 Cryptographic Audit Chain',
                'Multi-Currency Settlement (KES, USD, GBP, EUR)',
                'Escrow Smart Hold & Dispute Protection',
                'Priority 24/7 Whatsapp & Phone Support'
            ],
            featuresAgency: [
                'Up to 20 Active Housekeepers Roster',
                'Unlimited Housekeeper Roster & Dispatch',
                'Automated GPS Route Optimization',
                'SHA-256 Cryptographic Audit Chain',
                'Multi-Currency Settlement (KES, USD, GBP, EUR)',
                'Escrow Smart Hold & Dispute Protection',
                'Priority 24/7 Whatsapp & Phone Support'
            ]
        },
        enterprise: {
            id: 'enterprise',
            name: 'Agency & Territory Enterprise',
            tagline: 'Complete command center for enterprise property groups & cleaning franchises.',
            monthlyPriceUSD: 280,
            monthlyPriceKES: 49000,
            maxUnits: 'Unlimited',
            featuresOwner: [
                'Unlimited Property Units & Roster',
                'Custom Agency White-Label Branding',
                'Dedicated eTIMS ESD Tax Box Integration',
                'API & Webhook Access for PMS / Channel Managers',
                'Sub-Tenant Admin Role Access Control',
                'Dedicated Account Manager & On-Site Training',
                'SLA Guarantee & Custom Contracts'
            ],
            featuresAgency: [
                'Unlimited Housekeepers Roster',
                'Custom Agency White-Label Branding',
                'Dedicated eTIMS ESD Tax Box Integration',
                'API & Webhook Access for PMS / Channel Managers',
                'Sub-Tenant Admin Role Access Control',
                'Dedicated Account Manager & On-Site Training',
                'SLA Guarantee & Custom Contracts'
            ]
        }
    },

    // Cadence Billing Modifiers & Discounts
    cadences: {
        '1m': { label: 'Monthly', months: 1, discount: 0, tag: 'Standard Rate' },
        '3m': { label: '3 Months', months: 3, discount: 0.10, tag: 'Save 10%' },
        '6m': { label: '6 Months', months: 6, discount: 0.20, tag: 'Save 20%' },
        '12m': { label: 'Annual (12M)', months: 12, discount: 0.35, tag: 'Best Value — Save 35%' }
    },

    activeCadence: '12m', // Default to highest discount for best conversion

    // Calculate Price for Plan & Cadence
    calculatePrice(planId, cadenceKey, currency = 'KES') {
        const plan = this.plans[planId];
        const cadence = this.cadences[cadenceKey];
        if (!plan || !cadence) return null;

        const isKES = currency === 'KES';
        const baseMonthly = isKES ? plan.monthlyPriceKES : plan.monthlyPriceUSD;
        const discountedMonthly = Math.round(baseMonthly * (1 - cadence.discount));
        const totalBilled = discountedMonthly * cadence.months;
        const fullPriceNoDiscount = baseMonthly * cadence.months;
        const totalSavings = fullPriceNoDiscount - totalBilled;

        const symbols = { KES: 'KSh ', USD: '$', EUR: '€', GBP: '£' };
        const currencySymbol = symbols[currency] || (isKES ? 'KSh ' : '$');

        return {
            baseMonthly,
            discountedMonthly,
            totalBilled,
            cadenceMonths: cadence.months,
            discountPercentage: Math.round(cadence.discount * 100),
            totalSavings,
            currencySymbol
        };
    },

    // Show Subscription Modal / Drawer
    openSubscriptionModal(selectedPlanId = 'pro') {
        const store = window.HaoKeepStore;
        const currency = store ? store.context.currency : 'KES';
        const modalContainer = document.getElementById('modal-container');
        const modalBackdrop = document.getElementById('modal-backdrop');

        if (!modalContainer || !modalBackdrop) return;

        modalContainer.innerHTML = this.renderSubscriptionModalHTML(selectedPlanId, currency);
        modalBackdrop.classList.remove('hidden');

        // Re-initialize Lucide icons inside modal
        if (window.lucide) window.lucide.createIcons();

        // Bind Modal Event Listeners
        this.bindModalEvents(selectedPlanId, currency);
    },

    renderSubscriptionModalHTML(selectedPlanId, currency) {
        const activeSub = window.HaoKeepStore?.subscription || { status: 'trial', plan: 'none' };
        const starterUSD = this.calculatePrice('starter', this.activeCadence, 'USD');
        const cadence = this.cadences[this.activeCadence];

        const currentCategory = window.HaoKeepStore?.userAccount?.category || window.HaoKeepStore?.context?.persona || 'owner';
        const isAgencyCategory = currentCategory === 'agency';

        return `
            <div class="modal-header">
                <div>
                    <div class="badge badge-accent mb-1"><i data-lucide="crown"></i> Vanbransa CleanPulse Subscription & Membership</div>
                    <h3 style="font-size:1.4rem; font-weight:700;">Choose Your Operations Plan</h3>
                    <p class="text-sm text-dim">Unlock automated turnover dispatch, AI inspection, and eTIMS tax compliance.</p>
                </div>
                <button class="btn-icon" onclick="document.getElementById('modal-backdrop').classList.add('hidden')">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <div class="modal-body">
                <!-- User Category Selector Bar -->
                <div class="p-3 bg-darker rounded mb-3 border flex-between align-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="users" class="text-primary"></i>
                        <span class="text-xs text-muted">Account Category:</span>
                    </div>
                    <select id="sub-modal-category-select" class="select-sm bg-darker p-2 border rounded font-bold text-xs">
                        <option value="owner" ${!isAgencyCategory ? 'selected' : ''}>🏠 Homeowner / Short-Let Host (Units Managed)</option>
                        <option value="agency" ${isAgencyCategory ? 'selected' : ''}>🏢 Cleaning Agency (Housekeepers Roster)</option>
                        <option value="housekeeper">📱 Housekeeper / Field Staff (Free Access)</option>
                    </select>
                </div>

                <!-- International Subscribers Pricing Banner Note -->
                <div class="p-3 bg-darker rounded mb-3 border text-xs" style="background: rgba(212, 163, 115, 0.1); border: 1px solid rgba(212, 163, 115, 0.35) !important;">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="badge badge-green">🌐 International Pricing</span>
                        <strong class="text-primary">Subscribers Outside Kenya (${cadence.label}):</strong>
                    </div>
                    <div class="text-muted">
                        Subscribers outside Kenya (USD, EUR, GBP) pay a base rate of <strong class="text-primary">$50/month</strong>. 
                        Selected Cycle (<strong>${cadence.label}</strong>): <strong class="text-primary">$${starterUSD.discountedMonthly}/mo</strong> (Billed <strong>$${starterUSD.totalBilled}</strong> every ${starterUSD.cadenceMonths} month(s)${starterUSD.discountPercentage > 0 ? ` — <span class="text-success font-bold">Save ${starterUSD.discountPercentage}% ($${starterUSD.totalSavings} saved)</span>` : ''}).
                    </div>
                </div>

                <!-- Cadence Toggle Tabs -->
                <div class="sub-cadence-selector">
                    <span class="cadence-label">Billing Cycle:</span>
                    <div class="cadence-pills">
                        ${Object.keys(this.cadences).map(key => {
                            const c = this.cadences[key];
                            const isActive = key === this.activeCadence ? 'active' : '';
                            return `
                                <button class="cadence-btn ${isActive}" data-cadence="${key}">
                                    <span>${c.label}</span>
                                    <span class="cadence-badge">${c.tag}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Plans Grid -->
                <div class="plans-grid">
                    ${Object.keys(this.plans).map(planKey => {
                        const plan = this.plans[planKey];
                        const pricing = this.calculatePrice(planKey, this.activeCadence, currency);
                        const isSelected = planKey === selectedPlanId;
                        const isPopular = plan.popular;
                        const featureList = isAgencyCategory ? plan.featuresAgency : plan.featuresOwner;

                        return `
                            <div class="plan-card ${isSelected ? 'selected' : ''} ${isPopular ? 'popular' : ''}" data-plan="${planKey}">
                                ${isPopular ? '<div class="popular-ribbon"><i data-lucide="sparkles"></i> MOST POPULAR</div>' : ''}
                                <div class="plan-header">
                                    <h4 class="plan-title">${plan.name}</h4>
                                    <p class="plan-tagline">${plan.tagline}</p>
                                </div>
                                <div class="plan-price-box">
                                    <div class="price-amount">
                                        <span class="curr">${pricing.currencySymbol}</span>
                                        <span class="amt">${pricing.discountedMonthly.toLocaleString()}</span>
                                        <span class="per">/ mo</span>
                                    </div>
                                    ${pricing.discountPercentage > 0 ? `
                                        <div class="price-discount-note">
                                            <span class="strike">${pricing.currencySymbol} ${pricing.baseMonthly.toLocaleString()}/mo</span>
                                            <span class="save-tag">Save ${pricing.discountPercentage}%</span>
                                        </div>
                                    ` : ''}
                                    <div class="total-billed-note">
                                        Billed ${pricing.currencySymbol} ${pricing.totalBilled.toLocaleString()} every ${pricing.cadenceMonths} month(s)
                                    </div>
                                </div>
                                <ul class="plan-features">
                                    ${featureList.map(f => `<li><i data-lucide="check-circle-2" class="text-success"></i> ${f}</li>`).join('')}
                                </ul>
                                <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-block select-plan-btn" data-plan="${planKey}">
                                    ${isSelected ? '<i data-lucide="credit-card"></i> Proceed to Checkout' : 'Select Plan'}
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- User Category & Registration Details in Subscription -->
                <div class="card p-3 border mb-3" style="background: rgba(10,8,6,0.6);">
                    <div class="card-title-sm font-bold text-xs text-primary mb-2">
                        <i data-lucide="users"></i> Account Holder Category & Access Credentials
                    </div>
                    <div class="form-row flex gap-2">
                        <div class="w-50">
                            <label class="text-xs text-muted">User Category</label>
                            <select id="sub-user-category" class="select-sm w-full bg-darker p-2 border rounded text-xs font-bold">
                                <option value="owner">🏠 Homeowner / Short-Let Host</option>
                                <option value="agency">🏢 Cleaning Agency Manager</option>
                                <option value="housekeeper">📱 Housekeeper / Field Staff</option>
                            </select>
                        </div>
                        <div class="w-50">
                            <label class="text-xs text-muted">Registered Name / Company</label>
                            <input type="text" id="sub-user-name" class="input-field p-2 text-xs" placeholder="e.g. Wanjiku Investments" value="${window.HaoKeepStore?.userAccount?.name || ''}">
                        </div>
                    </div>
                </div>

                <!-- Payment Method Selector Drawer -->
                <div id="checkout-drawer" class="checkout-drawer hidden mt-4">
                    <div class="card p-3 border-glow">
                        <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:12px;" class="flex align-center gap-2">
                            <i data-lucide="shield-check" class="text-accent"></i> Instant Activation Checkout
                        </h4>
                        
                        <div class="payment-tabs flex gap-2 mb-3">
                            <button class="pay-tab-btn active" data-method="mpesa">
                                🟢 M-Pesa STK Push (Kenya)
                            </button>
                            <button class="pay-tab-btn" data-method="card">
                                💳 Visa / Mastercard / Amex
                            </button>
                            <button class="pay-tab-btn" data-method="bank">
                                🏦 Bank Transfer / Pesalink
                            </button>
                        </div>

                        <!-- M-Pesa Form -->
                        <div id="pay-form-mpesa" class="pay-form-block">
                            <div class="form-group mb-2">
                                <label>M-Pesa Registered Phone Number</label>
                                <input type="tel" id="pay-mpesa-phone" class="input-field" value="254712345678" placeholder="2547XXXXXXXX">
                                <small class="text-dim">An prompt will be sent directly to your phone to confirm payment.</small>
                            </div>
                            <button id="btn-submit-sub-payment" class="btn btn-primary btn-block">
                                <i data-lucide="smartphone"></i> Send M-Pesa STK Push Prompt
                            </button>
                        </div>

                        <!-- Card Form -->
                        <div id="pay-form-card" class="pay-form-block hidden">
                            <div class="form-group mb-2">
                                <label>Cardholder Name</label>
                                <input type="text" class="input-field" placeholder="e.g. Sarah Jenkins">
                            </div>
                            <div class="form-group mb-2">
                                <label>Card Number</label>
                                <input type="text" class="input-field" placeholder="4532 •••• •••• 8901">
                            </div>
                            <div class="form-row flex gap-2 mb-2">
                                <div class="w-50">
                                    <label>Expiry (MM/YY)</label>
                                    <input type="text" class="input-field" placeholder="12/28">
                                </div>
                                <div class="w-50">
                                    <label>CVC / CVV</label>
                                    <input type="text" class="input-field" placeholder="382">
                                </div>
                            </div>
                            <button id="btn-submit-card-payment" class="btn btn-primary btn-block">
                                <i data-lucide="lock"></i> Pay Securely via Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindModalEvents(selectedPlanId, currency) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        // User Category Change in Modal Header
        document.getElementById('sub-modal-category-select')?.addEventListener('change', (e) => {
            const cat = e.target.value;
            if (window.HaoKeepStore) {
                if (!window.HaoKeepStore.userAccount) window.HaoKeepStore.userAccount = {};
                window.HaoKeepStore.userAccount.category = cat;
            }
            const catSelectInForm = document.getElementById('sub-user-category');
            if (catSelectInForm) catSelectInForm.value = cat;

            this.openSubscriptionModal(selectedPlanId);
        });

        // Cadence Button Clicks
        modalContainer.querySelectorAll('.cadence-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cadenceKey = e.currentTarget.dataset.cadence;
                this.activeCadence = cadenceKey;
                this.openSubscriptionModal(selectedPlanId);
            });
        });

        // Plan Selection
        modalContainer.querySelectorAll('.select-plan-btn, .plan-card').forEach(elem => {
            elem.addEventListener('click', (e) => {
                const planKey = e.currentTarget.dataset.plan;
                if (!planKey) return;
                
                // Show Checkout Drawer
                const drawer = document.getElementById('checkout-drawer');
                if (drawer) {
                    drawer.classList.remove('hidden');
                    drawer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Payment Tab Switcher
        modalContainer.querySelectorAll('.pay-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                modalContainer.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const method = e.currentTarget.dataset.method;
                const mpesaForm = document.getElementById('pay-form-mpesa');
                const cardForm = document.getElementById('pay-form-card');
                
                if (method === 'mpesa') {
                    mpesaForm?.classList.remove('hidden');
                    cardForm?.classList.add('hidden');
                } else {
                    mpesaForm?.classList.add('hidden');
                    cardForm?.classList.remove('hidden');
                }
            });
        });

        // Submit Payment Action
        const submitBtn = document.getElementById('btn-submit-sub-payment');
        const submitCardBtn = document.getElementById('btn-submit-card-payment');

        const processSub = () => {
            const plan = this.plans[selectedPlanId];
            const pricing = this.calculatePrice(selectedPlanId, this.activeCadence, currency);
            const userCategory = document.getElementById('sub-user-category')?.value || 'owner';
            const userName = document.getElementById('sub-user-name')?.value.trim() || 'Subscribed Member';

            // Generate Cryptographic Access Code
            const catPrefix = userCategory === 'agency' ? 'AGN' : (userCategory === 'housekeeper' ? 'CLN' : 'HST');
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const uniqueAccessCode = `VP-${catPrefix}-${randomCode}`;

            window.HaoKeepApp.showToast(`Simulating payment for ${plan.name} (${this.cadences[this.activeCadence].label})...`, 'info');
            
            setTimeout(() => {
                // Update Global App Store Subscription state & Persona
                if (window.HaoKeepStore) {
                    window.HaoKeepStore.subscription = {
                        status: 'active',
                        plan: selectedPlanId,
                        planName: plan.name,
                        cadence: this.activeCadence,
                        cadenceLabel: this.cadences[this.activeCadence].label,
                        renewsAt: new Date(Date.now() + pricing.cadenceMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        amountPaid: pricing.totalBilled,
                        currency
                    };

                    window.HaoKeepStore.userAccount = {
                        category: userCategory,
                        categoryLabel: userCategory === 'agency' ? 'Cleaning Agency' : (userCategory === 'housekeeper' ? 'Housekeeper' : 'Homeowner / Host'),
                        name: userName,
                        uniqueAccessCode,
                        registeredAt: new Date().toISOString()
                    };

                    window.HaoKeepStore.context.persona = userCategory;
                    const personaSelect = document.getElementById('persona-select');
                    if (personaSelect) personaSelect.value = userCategory;

                    window.HaoKeepApp.addAuditLog(`Subscription & Category Activated: [${userCategory.toUpperCase()}] ${userName} — Unique Access Code: ${uniqueAccessCode}`);
                }

                // Close subscription drawer and show Unique Access Code Modal
                const isSwahili = window.HaoKeepStore?.context?.language === 'sw';
                const successModal = `
                    <div class="text-center p-3">
                        <div class="badge badge-green p-2 text-sm mb-3">🎉 Subscription & Category Activated</div>
                        <h3 class="font-bold text-xl text-primary mb-1">${userName}</h3>
                        <p class="text-xs text-muted mb-4">Plan: <strong>${plan.name}</strong> (${this.cadences[this.activeCadence].label})</p>

                        <div class="p-4 bg-darker rounded mb-4 border text-center" style="border: 2px dashed #d4a373 !important;">
                            <div class="text-xs text-muted mb-1">${isSwahili ? 'Nambari Yako Maalum ya Kuingilia (Your Unique Access Code):' : 'Your Unique Platform Entry Access Code:'}</div>
                            <div class="font-mono font-bold text-2xl text-primary tracking-widest my-2" id="copy-sub-code-text">${uniqueAccessCode}</div>
                            <div class="text-xxs text-success"><i data-lucide="shield-check"></i> Active Membership Code for Platform Access</div>
                        </div>

                        <div class="grid-2col gap-2">
                            <button id="btn-copy-sub-code" class="btn btn-secondary btn-block">
                                📋 ${isSwahili ? 'Kopisha Nambari' : 'Copy Access Code'}
                            </button>
                            <button id="btn-enter-sub-workspace" class="btn btn-primary btn-block" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                                🚀 ${isSwahili ? 'Ingia Mfomoni Sasa' : 'Enter Workspace'}
                            </button>
                        </div>
                    </div>
                `;

                window.HaoKeepApp?.showModal('Membership & Unique Access Code', successModal);

                document.getElementById('btn-copy-sub-code')?.addEventListener('click', () => {
                    navigator.clipboard.writeText(uniqueAccessCode);
                    window.HaoKeepApp?.showToast('📋 Unique Access Code copied to clipboard!', 'info');
                });

                document.getElementById('btn-enter-sub-workspace')?.addEventListener('click', () => {
                    window.HaoKeepApp?.closeModal();
                    window.HaoKeepApp?.showToast(`🔑 Access Code Verified! Welcome to Vanbransa CleanPulse.`, 'success');
                    window.HaoKeepApp?.renderActiveView();
                });
            }, 1800);
        };

        submitBtn?.addEventListener('click', processSub);
        submitCardBtn?.addEventListener('click', processSub);
    }
};
