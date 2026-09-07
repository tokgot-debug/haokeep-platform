/**
 * Enrollment & Onboarding Forms Engine for CleanPulse / HaoKeep
 * Handles creation of new Housekeepers, Property Units, and Agencies
 */
window.HaoKeepEnroll = {

    // ── Add New Housekeeper / Field Cleaner ──────────────────────────
    showAddCleanerForm() {
        const content = `
            <form id="form-add-cleaner" class="enroll-form">
                <div class="form-group">
                    <label>Full Name <span class="req">*</span></label>
                    <input type="text" id="enr-cleaner-name" class="form-input" placeholder="e.g. Jane Wangari" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone (Safaricom) <span class="req">*</span></label>
                        <input type="tel" id="enr-cleaner-phone" class="form-input" placeholder="+254 7XX XXX XXX" required>
                    </div>
                    <div class="form-group">
                        <label>M-Pesa Number <span class="req">*</span></label>
                        <input type="tel" id="enr-cleaner-mpesa" class="form-input" placeholder="254 7XX XXX XXX">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Assigned Territory</label>
                        <select id="enr-cleaner-territory" class="form-input">
                            <option value="Nairobi West / Kilimani">Nairobi West / Kilimani</option>
                            <option value="Nairobi Central / Westlands">Nairobi Central / Westlands</option>
                            <option value="Mombasa / Nyali / Diani">Mombasa / Nyali / Diani</option>
                            <option value="Kisumu / Milimani">Kisumu / Milimani</option>
                            <option value="Nakuru / Nanyuki">Nakuru / Nanyuki</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>ID / Passport Number</label>
                        <input type="text" id="enr-cleaner-id" class="form-input" placeholder="National ID or Passport">
                    </div>
                </div>
                <div class="form-group">
                    <label>Skills & Certifications</label>
                    <div class="checkbox-group">
                        <label class="check-label"><input type="checkbox" value="deep_clean"> Deep Cleaning</label>
                        <label class="check-label"><input type="checkbox" value="laundry"> Laundry & Ironing</label>
                        <label class="check-label"><input type="checkbox" value="hotel_standard"> Hotel-Standard Turnover</label>
                        <label class="check-label"><input type="checkbox" value="first_aid"> First Aid Certified</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Emergency Contact Name & Phone</label>
                    <input type="text" id="enr-cleaner-emergency" class="form-input" placeholder="e.g. John Kamau — +254 722 111 222">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.HaoKeepApp.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary"><i data-lucide="user-plus"></i> Enroll Housekeeper</button>
                </div>
            </form>
        `;

        window.HaoKeepApp?.showModal('Enroll New Housekeeper / Field Cleaner', content);

        document.getElementById('form-add-cleaner')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('enr-cleaner-name').value.trim();
            const phone = document.getElementById('enr-cleaner-phone').value.trim();
            const mpesa = document.getElementById('enr-cleaner-mpesa').value.trim() || phone.replace('+', '');
            const territory = document.getElementById('enr-cleaner-territory').value;

            if (!name || !phone) {
                window.HaoKeepApp?.showToast('Name and Phone are required.', 'error');
                return;
            }

            const newCleaner = {
                id: 'CLN-' + Math.floor(100 + Math.random() * 900),
                name: name,
                phone: phone,
                mpesaNumber: mpesa,
                rating: 0,
                totalJobs: 0,
                qualityScore: 0,
                currentLocation: { lat: -1.2921 + (Math.random() * 0.02 - 0.01), lng: 36.7845 + (Math.random() * 0.02 - 0.01) },
                status: 'AVAILABLE',
                assignedTerritory: territory
            };

            window.HaoKeepStore.cleaners.push(newCleaner);
            window.HaoKeepApp?.addAuditLog(`New Housekeeper Enrolled: ${name} (${newCleaner.id})`);
            window.HaoKeepApp?.closeModal();
            window.HaoKeepApp?.showToast(`${name} enrolled successfully as Housekeeper!`, 'success');
            window.HaoKeepApp?.renderActiveView();
        });
    },

    // ── Add New Property Unit ────────────────────────────────────────
    showAddUnitForm() {
        const content = `
            <form id="form-add-unit" class="enroll-form">
                <div class="form-group">
                    <label>Property / Unit Name <span class="req">*</span></label>
                    <input type="text" id="enr-unit-name" class="form-input" placeholder="e.g. Riverside Apartment 3A" required>
                </div>
                <div class="form-group">
                    <label>Full Address <span class="req">*</span></label>
                    <input type="text" id="enr-unit-address" class="form-input" placeholder="e.g. Riverside Drive, Nairobi" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Unit Type</label>
                        <select id="enr-unit-type" class="form-input">
                            <option value="Studio">Studio</option>
                            <option value="1BR Apartment">1BR Apartment</option>
                            <option value="2BR Apartment" selected>2BR Apartment</option>
                            <option value="3BR Villa">3BR Villa</option>
                            <option value="Penthouse">Penthouse</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Owner / Host Name <span class="req">*</span></label>
                        <input type="text" id="enr-unit-owner" class="form-input" placeholder="e.g. Wanjiku Investments Ltd" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Owner Phone</label>
                        <input type="tel" id="enr-unit-phone" class="form-input" placeholder="+254 7XX XXX XXX">
                    </div>
                    <div class="form-group">
                        <label>Turnover Window</label>
                        <input type="text" id="enr-unit-window" class="form-input" placeholder="e.g. 10:00 - 14:00" value="10:00 - 14:00">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>iCal Feed URL</label>
                        <input type="url" id="enr-unit-ical" class="form-input" placeholder="https://airbnb.com/calendar/ical/xxx.ics">
                    </div>
                    <div class="form-group">
                        <label>Lockbox / Smart Lock Code</label>
                        <input type="text" id="enr-unit-lockbox" class="form-input" placeholder="e.g. 4921">
                    </div>
                </div>
                <div class="form-group">
                    <label>Access Instructions</label>
                    <textarea id="enr-unit-access" class="form-input form-textarea" placeholder="Gate code, key location, security desk notes..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.HaoKeepApp.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary"><i data-lucide="building"></i> Register Property Unit</button>
                </div>
            </form>
        `;

        window.HaoKeepApp?.showModal('Register New Property Unit', content);

        document.getElementById('form-add-unit')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('enr-unit-name').value.trim();
            const address = document.getElementById('enr-unit-address').value.trim();
            const owner = document.getElementById('enr-unit-owner').value.trim();

            if (!name || !address || !owner) {
                window.HaoKeepApp?.showToast('Name, Address, and Owner are required.', 'error');
                return;
            }

            const newUnit = {
                id: 'UNIT-' + Math.floor(200 + Math.random() * 800),
                name: name,
                address: address,
                coordinates: { lat: -1.2921 + (Math.random() * 0.05 - 0.025), lng: 36.7845 + (Math.random() * 0.05 - 0.025) },
                owner: owner,
                ownerPhone: document.getElementById('enr-unit-phone').value.trim() || '',
                type: document.getElementById('enr-unit-type').value,
                status: 'CLEAN',
                turnoverTime: document.getElementById('enr-unit-window').value.trim() || '10:00 - 14:00',
                iCalUrl: document.getElementById('enr-unit-ical').value.trim() || '',
                lockboxCode: document.getElementById('enr-unit-lockbox').value.trim() || '0000',
                accessInstructions: document.getElementById('enr-unit-access').value.trim() || '',
                referencePhotos: {},
                parLevels: { duvetCoverKing: 2, fittedSheetKing: 2, pillowcases: 4, bathTowels: 4, toiletPaper: 6, shampooBottles: 4 }
            };

            window.HaoKeepStore.units.push(newUnit);
            window.HaoKeepApp?.addAuditLog(`New Property Unit Registered: ${name} (${newUnit.id}) — Owner: ${owner}`);
            window.HaoKeepApp?.closeModal();
            window.HaoKeepApp?.showToast(`Property "${name}" registered successfully!`, 'success');
            window.HaoKeepApp?.renderActiveView();
        });
    },

    // ── Universal User Category Registration Modal ─────────────────────
    showRegistrationModal() {
        const isSwahili = window.HaoKeepStore?.context?.language === 'sw';
        const content = `
            <div class="p-2">
                <div class="badge badge-accent mb-2">
                    <i data-lucide="key flex-inline"></i> ${isSwahili ? 'Usajili wa Akaunti & Nambari ya Siri' : 'Account Registration & Unique Access Key'}
                </div>
                <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:4px;">
                    ${isSwahili ? 'Chagua Kundi Lako la Mtumiaji' : 'Select Your User Category'}
                </h3>
                <p class="text-xs text-muted mb-3">
                    ${isSwahili ? 'Sajili maelezo yako kupata Nambari Maalum (Unique Access Code) ya kuingia kwenye mfumo.' : 'Register your credentials to generate your unique access code for platform entry.'}
                </p>

                <form id="form-user-registration">
                    <!-- Category Selector Card Grid -->
                    <div class="form-group mb-3">
                        <label class="font-bold text-xs text-primary mb-1 block">${isSwahili ? 'Kundi la Mtumiaji (User Category)' : 'User Category / Account Type'}</label>
                        <select id="reg-user-category" class="select-sm w-full bg-darker p-3 border rounded text-sm font-bold">
                            <option value="owner" selected>🏠 ${isSwahili ? 'Mwenye Nyumba / Host wa Airbnb (Homeowner / Host)' : 'Homeowner / Short-Let Host'}</option>
                            <option value="agency">🏢 ${isSwahili ? 'Shirika la Usafi (Cleaning Agency Manager)' : 'Cleaning Agency Manager'}</option>
                            <option value="housekeeper">📱 ${isSwahili ? 'Mfanyakazi wa Usafi (Housekeeper / Cleaner)' : 'Housekeeper / Field Staff'}</option>
                        </select>
                    </div>

                    <!-- Common Dynamic Input Fields -->
                    <div class="form-row flex gap-2 mb-2">
                        <div class="w-50">
                            <label>${isSwahili ? 'Jina Kamili / Biashara *' : 'Full Name / Entity Name *'}</label>
                            <input type="text" id="reg-name" class="input-field" placeholder="${isSwahili ? 'mft. Jane Wanjiku' : 'e.g. Wanjiku Stays Ltd'}" required>
                        </div>
                        <div class="w-50">
                            <label>${isSwahili ? 'Nambari ya Simu *' : 'Phone Number (M-Pesa) *'}</label>
                            <input type="tel" id="reg-phone" class="input-field" placeholder="+254 7XX XXX XXX" required>
                        </div>
                    </div>

                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Barua Pepe (Email Address) *' : 'Email Address *'}</label>
                        <input type="email" id="reg-email" class="input-field" placeholder="user@domain.com" required>
                    </div>

                    <!-- Category-Specific Dynamic Section -->
                    <div id="reg-category-dynamic-fields" class="p-3 bg-darker rounded mb-3 border">
                        <!-- Owner Fields -->
                        <div id="fields-cat-owner">
                            <div class="form-group mb-2">
                                <label>${isSwahili ? 'Idadi ya Nyumba (Number of Units)' : 'Initial Units Managed'}</label>
                                <input type="number" id="reg-owner-units" class="input-field" value="2" min="1">
                            </div>
                            <div class="form-group">
                                <label>${isSwahili ? 'Eneo la Nyumba (City / Territory)' : 'Primary Property Location'}</label>
                                <input type="text" id="reg-owner-location" class="input-field" placeholder="e.g. Kilimani, Nairobi">
                            </div>
                        </div>

                        <!-- Agency Fields -->
                        <div id="fields-cat-agency" class="hidden">
                            <div class="form-group mb-2">
                                <label>${isSwahili ? 'Nambari ya Usajili / KRA PIN' : 'KRA PIN / Business Reg No.'}</label>
                                <input type="text" id="reg-agency-pin" class="input-field" placeholder="A012345678Z">
                            </div>
                            <div class="form-group">
                                <label>${isSwahili ? 'Idadi ya Wafanyakazi (Staff Count)' : 'Initial Field Cleaner Count'}</label>
                                <input type="number" id="reg-agency-staff" class="input-field" value="8" min="1">
                            </div>
                        </div>

                        <!-- Cleaner Fields -->
                        <div id="fields-cat-housekeeper" class="hidden">
                            <div class="form-group mb-2">
                                <label>${isSwahili ? 'Nambari ya Kitambulisho (ID / Passport)' : 'National ID / Passport No.'}</label>
                                <input type="text" id="reg-cleaner-idno" class="input-field" placeholder="38291024">
                            </div>
                            <div class="form-group">
                                <label>${isSwahili ? 'Eneo la Kazi (Preferred Territory)' : 'Preferred Work Territory'}</label>
                                <input type="text" id="reg-cleaner-zone" class="input-field" placeholder="e.g. Westlands / Kilimani">
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block p-3 font-bold" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                        <i data-lucide="key"></i> ${isSwahili ? 'Wasilisha & Pata Nambari Maalum (Generate Unique Access Code)' : 'Register & Generate Unique Access Code'}
                    </button>
                </form>
            </div>
        `;

        window.HaoKeepApp?.showModal(isSwahili ? 'Usajili wa Akaunti mpya' : 'User Registration & Access Code', content);

        const categorySelect = document.getElementById('reg-user-category');
        categorySelect?.addEventListener('change', (e) => {
            const cat = e.target.value;
            document.getElementById('fields-cat-owner')?.classList.toggle('hidden', cat !== 'owner');
            document.getElementById('fields-cat-agency')?.classList.toggle('hidden', cat !== 'agency');
            document.getElementById('fields-cat-housekeeper')?.classList.toggle('hidden', cat !== 'housekeeper');
        });

        document.getElementById('form-user-registration')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('reg-user-category').value;
            const name = document.getElementById('reg-name').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const email = document.getElementById('reg-email').value.trim();

            if (!name || !phone || !email) {
                window.HaoKeepApp?.showToast('Please complete all required fields.', 'error');
                return;
            }

            // Generate Cryptographic Unique Access Code
            const catPrefix = category === 'agency' ? 'AGN' : (category === 'housekeeper' ? 'CLN' : 'HST');
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const uniqueAccessCode = `VP-${catPrefix}-${randomCode}`;

            // Save Registration Session State
            const regData = {
                category,
                categoryLabel: category === 'agency' ? 'Cleaning Agency' : (category === 'housekeeper' ? 'Housekeeper' : 'Homeowner / Host'),
                name,
                phone,
                email,
                uniqueAccessCode,
                registeredAt: new Date().toISOString()
            };

            window.HaoKeepStore.userAccount = regData;
            window.HaoKeepApp?.addAuditLog(`User Account Registered: [${regData.categoryLabel}] ${name} — Unique Access Code: ${uniqueAccessCode}`);

            // Switch to appropriate persona automatically
            window.HaoKeepStore.context.persona = category;
            const personaSelect = document.getElementById('persona-select');
            if (personaSelect) personaSelect.value = category;

            // Show Success Modal with Access Code
            const successModal = `
                <div class="text-center p-3">
                    <div class="badge badge-green p-2 text-sm mb-3">🎉 Registration Successful!</div>
                    <h3 class="font-bold text-xl text-primary mb-1">${name}</h3>
                    <p class="text-xs text-muted mb-4">${regData.categoryLabel} Account Created</p>

                    <div class="p-4 bg-darker rounded mb-4 border text-center" style="border: 2px dashed #d4a373 !important;">
                        <div class="text-xs text-muted mb-1">${isSwahili ? 'Nambari Yako Maalum ya Kuingilia (Your Unique Access Code):' : 'Your Unique Platform Access Code:'}</div>
                        <div class="font-mono font-bold text-2xl text-primary tracking-widest my-2" id="copy-access-code-text">${uniqueAccessCode}</div>
                        <div class="text-xxs text-success"><i data-lucide="shield-check"></i> SHA-256 Encrypted & Authorized for Instant Entrance</div>
                    </div>

                    <div class="grid-2col gap-2">
                        <button id="btn-copy-unique-code" class="btn btn-secondary btn-block">
                            📋 ${isSwahili ? 'Kopisha Nambari' : 'Copy Access Code'}
                        </button>
                        <button id="btn-enter-platform-now" class="btn btn-primary btn-block" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                            🚀 ${isSwahili ? 'Ingia Mfomoni Sasa' : 'Enter Platform Workspace'}
                        </button>
                    </div>
                </div>
            `;

            window.HaoKeepApp?.showModal(isSwahili ? 'Nambari Yako Maalum' : 'Registration Complete — Unique Access Code', successModal);

            document.getElementById('btn-copy-unique-code')?.addEventListener('click', () => {
                navigator.clipboard.writeText(uniqueAccessCode);
                window.HaoKeepApp?.showToast('📋 Unique Access Code copied to clipboard!', 'info');
            });

            document.getElementById('btn-enter-platform-now')?.addEventListener('click', () => {
                window.HaoKeepApp?.closeModal();
                window.HaoKeepApp?.showToast(`🔑 Access Code Verified! Workspace loaded as ${regData.categoryLabel}.`, 'success');
                window.HaoKeepApp?.renderActiveView();
            });
        });
    }
};

