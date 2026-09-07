/**
 * UI Renderer: Property Owner & Host Operational Surface
 */
window.HaoKeepOwnerView = {
    render(container) {
        const store = window.HaoKeepStore;
        const isSwahili = store.context.language === 'sw';

        container.innerHTML = `
            <div class="dashboard-layout">
                <div class="dashboard-header">
                    <div>
                        <h2>${isSwahili ? 'Kituo cha Usimamizi cha Mwenye Nyumba & Maelezo ya Usafi' : 'Property Owner & Host Turnover Dashboard'}</h2>
                        <p class="subtitle">${isSwahili ? 'Hali halisi ya usafi wa nyumba, usawazishaji wa iCal, na uthibitisho wa picha' : 'Real-time property readiness, iCal turnovers, and inspection photo verification'}</p>
                    </div>
                    <div class="flex-gap">
                        <button id="btn-batch-dispatch" class="btn btn-primary" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                            <i data-lucide="zap"></i> ${isSwahili ? 'Tuma Wafanyakazi Nyumba Zote Chafu kwa Mbofyo 1' : '1-Click Batch Dispatch All Dirty Units'}
                        </button>
                        <button class="btn btn-secondary" onclick="window.HaoKeepEnroll.showAddCleanerForm()">
                            <i data-lucide="user-plus"></i> ${isSwahili ? 'Ongeza Mfanyakazi' : 'Add Housekeeper'}
                        </button>
                        <button id="btn-trigger-ical" class="btn btn-secondary">
                            <i data-lucide="refresh-cw"></i> ${isSwahili ? 'Chukua Kalenda ya iCal' : 'Ingest iCal Feed'}
                        </button>
                        <button class="btn btn-secondary" onclick="window.HaoKeepEnroll.showAddUnitForm()">
                            <i data-lucide="building"></i> ${isSwahili ? 'Ongeza Nyumba' : 'Add Unit'}
                        </button>
                    </div>
                </div>

                <!-- Units Overview Cards Grid -->
                <div class="grid-3col mt-4">
                    ${store.units.map(unit => `
                        <div class="card">
                            <div class="card-header">
                                <h3><i data-lucide="building"></i> ${unit.name}</h3>
                                <span class="badge badge-${unit.status === 'CLEAN' ? 'green' : (unit.status === 'DIRTY' ? 'red' : 'blue')}">
                                    ${unit.status}
                                </span>
                            </div>
                            <div class="text-xs text-muted mb-2"><i data-lucide="map-pin"></i> ${unit.address}</div>
                            
                            <div class="unit-stats grid-2col p-2 bg-darker rounded mt-2">
                                <div>
                                    <div class="text-xs text-muted">Turnover Window</div>
                                    <div class="font-bold text-sm">${unit.turnoverTime}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-muted">Par Linen Stock</div>
                                    <div class="font-bold text-sm text-success">100% Ready</div>
                                </div>
                            </div>

                            <div class="mt-3 flex-between text-xs">
                                <button class="btn btn-xs btn-primary btn-assign-duty" data-unit="${unit.id}" data-unitname="${unit.name}" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important; font-weight:700;">
                                    <i data-lucide="user-check"></i> Assign Duty
                                </button>
                                <a href="#" class="text-primary btn-view-photos" data-unit="${unit.id}">View Quality Photos &rarr;</a>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Action Bar & Tip Jar -->
                <div class="grid-2col gap-3 mt-4">
                    <!-- Consumables Stock & Restock Dashboard -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="package-check"></i> Property Consumables & Low-Stock Alerts</h3>
                            <button id="btn-dispatch-restock" class="btn btn-sm btn-primary">
                                <i data-lucide="truck"></i> 1-Click Vendor Restock Dispatch
                            </button>
                        </div>
                        <div class="inv-grid mt-2">
                            ${(store.inventory || []).map(inv => `
                                <div class="inv-item-row">
                                    <div>
                                        <div class="font-bold text-xs text-primary">${inv.name} (${inv.unitName})</div>
                                        <div class="text-xs text-muted">Stock: ${inv.currentCount} ${inv.unit} • Threshold: ${inv.minThreshold}</div>
                                    </div>
                                    <div>
                                        ${inv.currentCount <= inv.minThreshold ? 
                                            `<span class="badge badge-red">⚠️ REORDER NEEDED</span>` : 
                                            `<span class="badge badge-green">OK</span>`
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Live OTA iCal Calendar Feeds & Digital Tip Jar -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="calendar"></i> OTA iCal Calendar Feeds</h3>
                            <button id="btn-open-tip-jar" class="btn btn-sm btn-secondary" style="background: linear-gradient(135deg, #dda15e, #bc6c25) !important; color:#0a0806 !important; font-weight:800;">
                                🎁 Cleaner Tip Jar (${store.tips ? store.tips.length : 0} Tips)
                            </button>
                        </div>
                        <div class="inv-grid mt-2">
                            ${(store.iCalFeeds || []).map(feed => `
                                <div class="inv-item-row">
                                    <div>
                                        <div class="font-bold text-xs text-primary">${feed.platform} — ${feed.unitName}</div>
                                        <div class="text-xs text-muted font-mono">${feed.url.substring(0, 32)}...</div>
                                    </div>
                                    <div class="text-right">
                                        <span class="badge badge-green">${feed.status}</span>
                                        <div class="text-xs text-muted mt-1">Synced ${feed.lastSync}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Assigned Housekeepers & Field Cleaners Roster Card -->
                <div class="card mt-4">
                    <div class="card-header flex-between">
                        <h3><i data-lucide="users" class="text-primary"></i> ${isSwahili ? 'Wafanyakazi Wako Wa Usafi (Housekeepers)' : 'Assigned Housekeepers & Staff Roster'}</h3>
                        <button class="btn btn-sm btn-primary" onclick="window.HaoKeepEnroll.showAddCleanerForm()">
                            <i data-lucide="user-plus"></i> ${isSwahili ? 'Ongeza Mfanyakazi Mpya' : 'Add New Housekeeper'}
                        </button>
                    </div>
                    <div class="grid-3col gap-3 mt-3">
                        ${(store.cleaners || []).map(cleaner => `
                            <div class="card p-3 border bg-darker rounded">
                                <div class="flex-between mb-2">
                                    <div class="flex align-center gap-2">
                                        <div class="avatar-sm" style="width:36px; height:36px; border-radius:50%; background:#e09f3e; color:#0a0806; font-weight:800; display:flex; align-items:center; justify-content:center;">
                                            ${cleaner.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <strong class="text-sm text-primary display-block">${cleaner.name}</strong>
                                            <span class="text-xxs text-muted">${cleaner.assignedTerritory || 'Nairobi Central'}</span>
                                        </div>
                                    </div>
                                    <span class="badge badge-${cleaner.status === 'AVAILABLE' ? 'green' : 'purple'}">${cleaner.status}</span>
                                </div>
                                <div class="text-xs text-dim mb-2">
                                    📞 <strong>${cleaner.phone}</strong><br>
                                    💵 M-Pesa: <code>${cleaner.mpesaNumber}</code>
                                </div>
                                <div class="flex-between text-xs pt-2 border-top">
                                    <span class="text-muted">Rating: ⭐ ${cleaner.rating || '4.9'}</span>
                                    <button class="btn btn-xs btn-secondary" onclick="window.HaoKeepEnroll.showEditCleanerForm('${cleaner.id}')">
                                        <i data-lucide="edit"></i> ${isSwahili ? 'Hariri' : 'Edit'}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Recent Jobs & Inspection History Table -->
                <div class="card mt-4">
                    <div class="card-header">
                        <h3><i data-lucide="history"></i> Turnover Job Log & Quality Scores</h3>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Job ID</th>
                                <th>Unit</th>
                                <th>Housekeeper</th>
                                <th>Status</th>
                                <th>Check-In</th>
                                <th>AI Quality</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${store.jobs.map(job => `
                                <tr>
                                    <td class="font-mono">${job.id}</td>
                                    <td>${job.unitName}</td>
                                    <td>${job.cleanerName}</td>
                                    <td><span class="badge badge-purple">${job.status}</span></td>
                                    <td>${job.checkInTime ? job.checkInTime.substring(11, 16) : 'Pending'}</td>
                                    <td><span class="badge badge-green">96% Passed</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary btn-chat-job" data-job="${job.id}">
                                            <i data-lucide="message-square"></i> Chat & Voice Notes (${(store.messages || []).length})
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Maintenance & Repair Work Orders Card -->
                <div class="card mt-4">
                    <div class="card-header flex-between">
                        <h3><i data-lucide="wrench" class="text-warning"></i> Maintenance & Repair Work Orders</h3>
                        <button id="btn-create-work-order" class="btn btn-sm btn-primary">
                            <i data-lucide="plus-circle"></i> Create Maintenance Work Order
                        </button>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>WO ID</th>
                                <th>Unit</th>
                                <th>Issue / Title</th>
                                <th>Severity</th>
                                <th>Assigned Handyman</th>
                                <th>Est. Cost</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(store.workOrders || []).map(wo => `
                                <tr>
                                    <td class="font-mono text-xs">${wo.id}</td>
                                    <td>${wo.unitName}</td>
                                    <td><strong>${wo.title}</strong></td>
                                    <td><span class="badge badge-${wo.severity === 'URGENT' ? 'red' : 'yellow'}">${wo.severity}</span></td>
                                    <td><span class="text-primary">${wo.assignedHandyman}</span></td>
                                    <td class="font-mono font-bold">${window.HaoKeepLedger.formatMoney(wo.estimatedCost)}</td>
                                    <td><span class="badge badge-${wo.status === 'REPAIRED' ? 'green' : 'blue'}">${wo.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.bindEvents(container);
    },

    bindEvents(container) {
        const store = window.HaoKeepStore;

        // Assign Housekeeper Duty Modal Trigger
        container.querySelectorAll('.btn-assign-duty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unitId = e.currentTarget.dataset.unit;
                const unitName = e.currentTarget.dataset.unitname;
                
                const assignModalContent = `
                    <div class="p-2">
                        <h4 class="font-bold text-lg text-primary mb-1">Assign Housekeeper Duty</h4>
                        <p class="text-xs text-muted mb-3">Select a housekeeper to dispatch for <strong>${unitName}</strong></p>
                        
                        <div class="form-group mb-3">
                            <label class="font-bold text-xs">Select Housekeeper *</label>
                            <select id="assign-cleaner-select" class="form-input bg-darker" style="padding:10px;">
                                ${store.cleaners.map(c => `
                                    <option value="${c.id}" ${c.name.includes('Guardian') ? 'selected' : ''}>
                                        ${c.name} (${c.assignedTerritory || 'Kilimani'}) — ⭐ ${c.rating || 5.0} (${c.status})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group mb-3">
                            <label class="font-bold text-xs">Scheduled Turnover Window</label>
                            <input type="text" id="assign-window-input" class="form-input bg-darker" value="11:00 - 15:00" placeholder="e.g. 11:00 - 15:00">
                        </div>

                        <div class="form-group mb-4">
                            <label class="font-bold text-xs">Housekeeper Payout Rate (KES)</label>
                            <input type="number" id="assign-payout-input" class="form-input bg-darker" value="2500">
                        </div>

                        <button id="btn-confirm-assign-duty" class="btn btn-primary btn-block p-3 font-bold" style="background: linear-gradient(135deg, #e09f3e, #b88054) !important; color:#0a0806 !important;">
                            <i data-lucide="check-circle"></i> Confirm Duty Assignment
                        </button>
                    </div>
                `;

                window.HaoKeepApp?.showModal(`Assign Duty: ${unitName}`, assignModalContent);

                document.getElementById('btn-confirm-assign-duty')?.addEventListener('click', () => {
                    const cleanerId = document.getElementById('assign-cleaner-select')?.value;
                    const cleaner = store.cleaners.find(c => c.id === cleanerId) || store.cleaners[0];
                    const payout = parseInt(document.getElementById('assign-payout-input')?.value, 10) || 2500;
                    const windowTime = document.getElementById('assign-window-input')?.value || '11:00 - 15:00';

                    // Update unit status to dirty / assigned
                    const unit = store.units.find(u => u.id === unitId);
                    if (unit) unit.status = 'DIRTY';

                    // Create assigned job
                    const newJob = {
                        id: 'JOB-' + Date.now().toString().substring(7),
                        unitId: unitId,
                        unitName: unitName,
                        cleanerId: cleaner.id,
                        cleanerName: cleaner.name,
                        scheduledDate: new Date().toISOString().substring(0, 10),
                        windowStart: windowTime.split('-')[0]?.trim() || '11:00',
                        windowEnd: windowTime.split('-')[1]?.trim() || '15:00',
                        payoutAmount: payout,
                        status: 'ASSIGNED',
                        geofenceVerified: false,
                        checklist: [
                            { room: 'Living Room', task: 'Make sofa bed & fluff cushions', photoRequired: true, completed: false },
                            { room: 'Master Bedroom', task: 'Change linen & hotel hospital corners', photoRequired: true, completed: false },
                            { room: 'Bathroom', task: 'Disinfect tiles & restock amenities', photoRequired: true, completed: false }
                        ]
                    };

                    store.jobs.unshift(newJob);
                    cleaner.status = 'ASSIGNED';

                    window.HaoKeepApp?.showToast(`📋 Duty successfully assigned to ${cleaner.name} for ${unitName}!`, 'success');
                    window.HaoKeepApp?.addAuditLog(`Job Assigned: ${newJob.id} to ${cleaner.name} for ${unitName}`);
                    window.HaoKeepApp?.closeModal();
                    window.HaoKeepApp?.renderActiveView();
                });
            });
        });

        container.querySelector('#btn-trigger-ical')?.addEventListener('click', () => {
            const newJob = window.HaoKeepDispatch.ingestICalFeed('UNIT-101');
            window.HaoKeepApp?.showToast(`iCal Sync complete! Job ${newJob.id} dispatched to ${newJob.cleanerName}`, 'success');
            window.HaoKeepApp?.renderActiveView();
        });

        // View Quality Photos & Share Gallery Modal
        container.querySelectorAll('.btn-view-photos').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const unitId = e.currentTarget.dataset.unit;
                const unit = store.units.find(u => u.id === unitId) || store.units[0];
                const activeJob = store.jobs.find(j => j.unitId === unitId) || store.jobs[0];

                const galleryHTML = `
                    <div class="p-2">
                        <div class="mb-3">
                            <h4 class="font-bold text-lg">${unit.name} — Quality Evidence Photos</h4>
                            <p class="text-xs text-muted">Uploaded by ${activeJob.cleanerName} | AI Inspection Verified</p>
                        </div>
                        
                        <div class="grid-2col gap-3">
                            ${activeJob.checklist.map(item => `
                                <div class="card p-2 border">
                                    <div class="flex-between mb-1">
                                        <span class="font-bold text-sm text-primary">${item.room}</span>
                                        <span class="badge badge-green">${item.aiScore ? item.aiScore + '% AI Score' : 'Verified'}</span>
                                    </div>
                                    <p class="text-xs text-muted mb-2">${item.task}</p>
                                    ${item.mediaType === 'video' ? `
                                        <video src="${item.photoUrl}" controls style="width:100%; height:140px; object-fit:cover; border-radius:8px;" class="mb-2"></video>
                                    ` : `
                                        <img src="${item.photoUrl || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80'}" alt="${item.room}" style="width:100%; height:140px; object-fit:cover; border-radius:8px;" class="mb-2">
                                    `}
                                    <button class="btn btn-xs btn-secondary btn-share-gallery-item w-full" data-room="${item.room}">
                                        <i data-lucide="share-2"></i> Share Inspection Link
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                window.HaoKeepApp?.showModal(`Turnover Inspection Gallery: ${unit.name}`, galleryHTML);

                // Share link event
                document.querySelectorAll('.btn-share-gallery-item').forEach(shareBtn => {
                    shareBtn.addEventListener('click', (ev) => {
                        const roomName = ev.currentTarget.dataset.room;
                        const text = `CleanPulse Turnover Proof - ${unit.name} (${roomName}) passed AI inspection!`;
                        if (navigator.share) {
                            navigator.share({ title: unit.name, text, url: window.location.href });
                        } else {
                            navigator.clipboard.writeText(`${text} - ${window.location.href}`);
                            window.HaoKeepApp?.showToast('📋 Inspection share link copied to clipboard!', 'info');
                        }
                    });
                });
            });
        });

        // Chat & Voice Notes Modal Trigger
        container.querySelectorAll('.btn-chat-job').forEach(btn => {
            btn.addEventListener('click', () => {
                const renderChatModal = () => {
                    const msgs = window.HaoKeepStore.messages || [];
                    const content = `
                        <div class="msg-thread p-3 bg-darker rounded mb-3" style="max-height: 240px; overflow-y: auto;">
                            ${msgs.map(m => `
                                <div class="msg-bubble p-2 rounded mb-2 text-xs border border-gray">
                                    <div class="flex-between font-bold text-muted mb-1">
                                        <span class="text-primary">${m.senderName}</span>
                                        <span>${m.timestamp}</span>
                                    </div>
                                    <div class="text-main">${m.text}</div>
                                    ${m.translatedText ? `<div class="text-xs text-warning mt-1 font-italic">🌐 AI Swahili-English Translation: "${m.translatedText}"</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex-gap">
                            <input type="text" id="owner-msg-input" class="select-sm bg-darker w-full p-2 border rounded" placeholder="Type message to cleaner...">
                            <button id="owner-send-btn" class="btn btn-primary"><i data-lucide="send"></i> Send</button>
                        </div>
                    `;
                    window.HaoKeepApp?.showModal('Job Instructions & Voice Note Thread', content);

                    document.querySelector('#owner-send-btn')?.addEventListener('click', () => {
                        const val = document.querySelector('#owner-msg-input')?.value.trim();
                        if (!val) return;

                        window.HaoKeepStore.messages.push({
                            id: 'MSG-' + Date.now(),
                            jobId: 'JOB-2026-001',
                            senderRole: 'owner',
                            senderName: 'Wanjiku (Host)',
                            text: val,
                            audioUrl: null,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            translatedText: null
                        });

                        window.HaoKeepApp?.addAuditLog(`Host Message Sent: "${val}"`);
                        renderChatModal();
                    });
                };

                renderChatModal();
            });
        });
        // Vendor Restock Dispatch Button
        container.querySelector('#btn-dispatch-restock')?.addEventListener('click', () => {
            const lowStockItems = (store.inventory || []).filter(i => i.currentCount <= i.minThreshold);
            if (lowStockItems.length === 0) {
                window.HaoKeepApp?.showToast('All consumable stock levels are healthy!', 'info');
                return;
            }

            // Replenish stock
            lowStockItems.forEach(i => i.currentCount = i.minThreshold + 6);
            window.HaoKeepApp?.showToast(`📦 Vendor Auto-Restock Order Dispatched for ${lowStockItems.length} items!`, 'success');
            window.HaoKeepApp?.addAuditLog(`Vendor Restock Dispatched: ${lowStockItems.map(i => i.name).join(', ')}`);
            window.HaoKeepApp?.renderActiveView();
        });

        // Digital Tip Jar Modal Trigger
        container.querySelector('#btn-open-tip-jar')?.addEventListener('click', () => {
            const cleaner = store.cleaners[0];
            const tipModal = `
                <div class="text-center p-2">
                    <div class="avatar-sm m-auto mb-2" style="width:48px; height:48px; border-radius:50%; background:#dda15e; color:#0a0806; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                        👑
                    </div>
                    <h3 class="font-bold text-lg text-primary mb-1">Send Digital Tip to ${cleaner.name}</h3>
                    <p class="text-xs text-muted mb-3">Show appreciation for 98% AI cleanliness & spotless turnovers.</p>
                    
                    <div class="tip-chips-grid">
                        <div class="tip-chip" data-amt="200">KSh 200</div>
                        <div class="tip-chip active" data-amt="500">KSh 500</div>
                        <div class="tip-chip" data-amt="1000">KSh 1,000</div>
                        <div class="tip-chip" data-amt="2000">KSh 2,000</div>
                    </div>

                    <input type="text" id="tip-msg-input" class="select-sm bg-darker w-full p-2 border rounded mb-3 text-xs" placeholder="Add a thank you note (optional)...">
                    
                    <button id="btn-pay-tip" class="btn btn-primary btn-full p-3 font-bold">
                        🟢 Disburse Tip via M-Pesa / Card (KSh 500)
                    </button>
                </div>
            `;

            window.HaoKeepApp?.showModal('Digital Housekeeper Tip Jar', tipModal);

            let selectedAmount = 500;
            document.querySelectorAll('.tip-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    document.querySelectorAll('.tip-chip').forEach(c => c.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    selectedAmount = parseInt(e.currentTarget.dataset.amt, 10);
                    const payBtn = document.querySelector('#btn-pay-tip');
                    if (payBtn) payBtn.innerText = `🟢 Disburse Tip via M-Pesa / Card (KSh ${selectedAmount})`;
                });
            });

            document.querySelector('#btn-pay-tip')?.addEventListener('click', () => {
                const msg = document.querySelector('#tip-msg-input')?.value.trim() || 'Great turnover job!';
                store.tips.push({
                    id: 'TIP-' + Date.now(),
                    cleanerId: cleaner.id,
                    cleanerName: cleaner.name,
                    amount: selectedAmount,
                    currency: 'KES',
                    hostName: 'Wanjiku (Host)',
                    unitName: 'Kilimani Heights #4B',
                    message: msg,
                    timestamp: new Date().toLocaleString()
                });

                window.HaoKeepApp?.showToast(`🎉 KSh ${selectedAmount} tip sent to ${cleaner.name} via M-Pesa B2C!`, 'success');
                window.HaoKeepApp?.addAuditLog(`Digital Tip Disbursed: KSh ${selectedAmount} to ${cleaner.name}`);
                window.HaoKeepApp?.renderActiveView();
            });
        });

        // 1-Click Multi-Unit Batch Turnover Dispatcher
        container.querySelector('#btn-batch-dispatch')?.addEventListener('click', () => {
            const dirtyUnits = store.units.filter(u => u.status === 'DIRTY' || u.status === 'IN_PROGRESS');
            dirtyUnits.forEach(u => {
                window.HaoKeepDispatch.ingestICalFeed(u.id);
            });
            window.HaoKeepApp?.showToast(`⚡ Batch Turnover Dispatch complete! Dispatched ${dirtyUnits.length} turnover jobs across roster.`, 'success');
            window.HaoKeepApp?.addAuditLog(`Batch Dispatch Triggered for ${dirtyUnits.length} units`);
            window.HaoKeepApp?.renderActiveView();
        });

        // Create Maintenance Work Order Modal Trigger
        container.querySelector('#btn-create-work-order')?.addEventListener('click', () => {
            const woForm = `
                <div class="p-2">
                    <h3 class="font-bold text-lg text-primary mb-2">Create Maintenance & Repair Work Order</h3>
                    <div class="form-group mb-2">
                        <label>Property Unit</label>
                        <select id="wo-unit-select" class="form-input bg-darker">
                            ${store.units.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group mb-2">
                        <label>Issue Title</label>
                        <input type="text" id="wo-title-input" class="form-input bg-darker" placeholder="e.g. Broken AC Compressor, Leaking Faucet">
                    </div>
                    <div class="form-group mb-2">
                        <label>Handyman Service</label>
                        <input type="text" id="wo-handyman-input" class="form-input bg-darker" value="Juma Plumbing & HVAC">
                    </div>
                    <button id="btn-submit-wo" class="btn btn-primary btn-full mt-3">
                        <i data-lucide="wrench"></i> Dispatch Work Order
                    </button>
                </div>
            `;

            window.HaoKeepApp?.showModal('Dispatch Maintenance Work Order', woForm);

            document.querySelector('#btn-submit-wo')?.addEventListener('click', () => {
                const unitId = document.querySelector('#wo-unit-select')?.value;
                const unit = store.units.find(u => u.id === unitId) || store.units[0];
                const title = document.querySelector('#wo-title-input')?.value.trim() || 'General Property Repair';
                const handyman = document.querySelector('#wo-handyman-input')?.value.trim() || 'FastFix Handyman Services';
                const cost = 3500;

                store.workOrders.push({
                    id: 'WO-' + Math.floor(500 + Math.random() * 500),
                    unitId: unit.id,
                    unitName: unit.name,
                    title: title,
                    severity: 'URGENT',
                    estimatedCost: cost,
                    assignedHandyman: handyman,
                    status: 'OPEN',
                    timestamp: new Date().toLocaleString()
                });

                window.HaoKeepApp?.showToast(`🛠️ Work order dispatched to ${handyman}!`, 'success');
                window.HaoKeepApp?.addAuditLog(`Maintenance Work Order Created: "${title}" for ${unit.name}`);
                window.HaoKeepApp?.renderActiveView();
            });
        });
    }
};
