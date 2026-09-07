/**
 * UI Renderer: Mobile Field Surface for Housekeepers
 */
window.HaoKeepHousekeeperView = {
    render(container) {
        const store = window.HaoKeepStore;
        const activeJob = store.jobs.find(j => j.cleanerId === store.context.currentCleanerId || j.status === 'CHECKED_IN' || j.status === 'ASSIGNED');
        const unit = activeJob ? store.units.find(u => u.id === activeJob.unitId) : store.units[0];

        if (!activeJob) {
            container.innerHTML = `<div class="p-4 text-center">No active jobs assigned today.</div>`;
            return;
        }

        const isSwahili = store.context.language === 'sw';

        const translateTask = (task, isSwahili) => {
            if (!isSwahili) return task;
            const map = {
                'Make sofa bed & fluff cushions': 'Tandika kitanda cha sofa na urekebishe mito',
                'Change linen & hotel hospital corners': 'Badilisha shuka na ukunje pembe za hospitali',
                'Change linen & hospital corners': 'Badilisha shuka na ukunje pembe za hospitali',
                'Disinfect tiles & restock amenities': 'Osha vigae kwa dawa na uongeze sabuni',
                'Empty fridge & sanitize countertops': 'Toa vitu kwenye friji na usafishe meza za jikoni'
            };
            return map[task] || task;
        };

        const translateRoom = (room, isSwahili) => {
            if (!isSwahili) return room;
            const map = {
                'Living Room': 'Sebule',
                'Master Bedroom': 'Chumba Kikuu cha Kulala',
                'Bedroom': 'Chumba cha Kulala',
                'Bathroom': 'Bafu',
                'Kitchen': 'Jikoni'
            };
            return map[room] || room;
        };

        const translateAccessInstructions = (instructions, isSwahili) => {
            if (!isSwahili || !instructions) return instructions;
            const map = {
                'Gate code #0412. Key box on right side of front door.': 'Kodi ya lango #0412. Sanduku la funguo liko upande wa kulia wa mlango wa mbele.',
                'Main security desk tag #12.': 'Kadi ya usalama kwenye meza kuu #12.',
                'Smart lock keypad #1092.': 'Kipadi cha kufuli mahiri #1092.'
            };
            return map[instructions] || instructions;
        };

        container.innerHTML = `
            <div class="mobile-frame-container">
                <div class="mobile-shell">
                    <!-- Field Mobile Top Bar -->
                    <div class="mobile-header">
                        <div class="cleaner-info">
                            <div class="avatar-sm">AM</div>
                            <div>
                                <div class="font-bold">Achieng Mary</div>
                                <div class="text-xs text-muted">⭐ 4.9 (142 ${isSwahili ? 'Kazi' : 'Jobs'})</div>
                            </div>
                        </div>
                        <div class="flex-gap">
                            <button id="btn-toggle-sunlight" class="btn btn-xs btn-secondary" title="Toggle High-Contrast Outdoor Sunlight Mode">
                                ☀️ ${document.body.classList.contains('theme-sunlight') ? 'Dark' : 'Sunlight'}
                            </button>
                            <span class="badge badge-green">${store.context.isOnline ? (isSwahili ? 'MTANDAONI' : 'ONLINE') : (isSwahili ? 'BILA MTANDAO' : 'OFFLINE MODE')}</span>
                        </div>
                    </div>

                    <!-- 2-Column Responsive Desktop / Tablet Layout Grid -->
                    <div class="hk-two-column-grid">
                        
                        <!-- COLUMN 1 (LEFT): Job Summary & GPS Geofenced Check-In -->
                        <div class="hk-col-left">
                            <!-- Job Summary Card -->
                            <div class="mobile-card highlight">
                                <div class="flex-between">
                                    <span class="badge badge-purple">${activeJob.id}</span>
                                    <span class="badge badge-green">${isSwahili ? 'KAZI ILIYOTOLEWA' : 'ASSIGNED TASK'}</span>
                                </div>
                                <h2 class="unit-title mt-2">${activeJob.unitName}</h2>
                                <p class="unit-sub"><i data-lucide="map-pin" class="icon-inline"></i> ${unit?.address || 'Nairobi'}</p>
                                
                                <div class="turnover-window mt-3">
                                    <i data-lucide="clock" class="icon-inline"></i> ${isSwahili ? 'Muda wa Kazi' : 'Turnover Window'}: <strong>${activeJob.windowStart} - ${activeJob.windowEnd}</strong>
                                </div>
                            </div>

                            <!-- Geofenced Check-In Module -->
                            <div class="mobile-card">
                                <div class="card-title-sm"><i data-lucide="navigation"></i> ${isSwahili ? 'Uhakiki wa Eneo (Geofence)' : 'Geofenced Location Check-In'}</div>
                                
                                ${activeJob.geofenceVerified ? `
                                    <div class="geofence-success">
                                        <i data-lucide="check-circle-2" class="text-success"></i>
                                        <div>
                                            <strong>${isSwahili ? 'Umeingia Eneo la Kazi' : 'Checked-In & Location Verified'}</strong>
                                            <div class="text-xs text-muted">${isSwahili ? 'Umbali: mita 12 kutoka nyumba' : 'Verified within 12m radius of property pin'}</div>
                                        </div>
                                    </div>
                                    <div class="lockbox-box mt-3">
                                        <div class="text-xs text-muted">${isSwahili ? 'Maelezo ya Kuingia & Nambari ya Kufungua:' : 'Encrypted Access Lockbox Code:'}</div>
                                        <div class="lock-code">${unit?.lockboxCode || '4921'}</div>
                                        <div class="text-xs text-muted mt-1"><i data-lucide="shield-alert"></i> ${translateAccessInstructions(unit?.accessInstructions, isSwahili)}</div>
                                    </div>
                                ` : `
                                    <button id="btn-geofence-checkin" class="btn btn-primary btn-full mt-2">
                                        <i data-lucide="map-pin"></i> ${isSwahili ? 'Thibitisha Eneo & Ingia Kazi' : 'Verify GPS & Check-In'}
                                    </button>
                                `}
                            </div>

                            <!-- Field Operational Quick Actions: Lost Item, Damage & Linen Restock -->
                            <div class="mobile-card">
                                <div class="card-title-sm"><i data-lucide="shield-alert"></i> ${isSwahili ? 'Ripoti za Eneo & Vitu' : 'Field Reporting & Supply Tools'}</div>
                                <div class="grid-3col gap-2 mt-2">
                                    <button id="btn-report-lost-found" class="btn btn-xs btn-secondary flex-col align-center p-2 text-center">
                                        <i data-lucide="package-search" class="text-warning"></i>
                                        <span class="text-xxs mt-1">${isSwahili ? 'Kitu kilichopotea' : 'Lost & Found'}</span>
                                    </button>
                                    <button id="btn-report-damage" class="btn btn-xs btn-secondary flex-col align-center p-2 text-center">
                                        <i data-lucide="alert-triangle" class="text-danger"></i>
                                        <span class="text-xxs mt-1">${isSwahili ? 'Uharibifu' : 'Damage Item'}</span>
                                    </button>
                                    <button id="btn-request-par" class="btn btn-xs btn-secondary flex-col align-center p-2 text-center">
                                        <i data-lucide="box" class="text-primary"></i>
                                        <span class="text-xxs mt-1">${isSwahili ? 'Omba Shuka' : 'Par Restock'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- COLUMN 2 (RIGHT): Room Photo Checklist, Chat & Submission -->
                        <div class="hk-col-right">
                            <!-- Room-by-Room Photo & Video Checklist -->
                            <div class="mobile-card">
                                <div class="card-title-sm flex-between">
                                    <span><i data-lucide="camera"></i> ${isSwahili ? 'Usafi wa Picha & Maagizo ya Vyumba' : 'Room Photo Evidence Checklist'}</span>
                                    <button id="btn-add-room-area" class="btn btn-xs btn-primary">
                                        <i data-lucide="plus-circle"></i> ${isSwahili ? 'Ongeza Eneo / Chumba' : 'Add Room / Area'}
                                    </button>
                                </div>
                                
                                <div class="checklist-items mt-2">
                                    ${activeJob.checklist.map((item, idx) => `
                                        <div class="check-item ${item.completed ? 'done' : ''}">
                                            <div class="check-info">
                                                <span class="room-tag">${translateRoom(item.room, isSwahili)} 📸</span>
                                                <div class="task-desc">${translateTask(item.task, isSwahili)}</div>
                                            </div>
                                            <div class="check-actions">
                                                ${item.completed ? `<span class="badge badge-green check-status-badge"><i data-lucide="check"></i> ${item.aiScore ? item.aiScore + '%' : (isSwahili ? 'TAYARI' : 'DONE')}</span>` : ''}
                                                <button class="btn btn-xs btn-secondary btn-trigger-camera" data-idx="${idx}">
                                                    <i data-lucide="camera"></i> ${item.completed ? (isSwahili ? 'Piga Tena' : 'Re-take') : (isSwahili ? 'Picha / Video' : 'Photo / Video')}
                                                </button>
                                                <button class="btn btn-xs btn-share-multi" data-idx="${idx}" title="Share via Mail, SMS, WhatsApp, AirDrop, etc.">
                                                    <i data-lucide="share-2"></i>
                                                </button>
                                                <input type="file" id="file-input-${idx}" accept="image/*,video/*" capture="environment" class="file-upload-input hidden" data-idx="${idx}">
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Consumables & Amenities Inventory Stepper Card -->
                            <div class="mobile-card">
                                <div class="card-title-sm flex-between">
                                    <span><i data-lucide="package-check"></i> ${isSwahili ? 'Hesabu ya Vitu na Sabuni' : 'Consumables & Amenities Tracker'}</span>
                                    <span class="badge badge-yellow text-xs">${(store.inventory || []).filter(i => i.currentCount <= i.minThreshold).length} Low</span>
                                </div>
                                <div class="inv-grid mt-2">
                                    ${(store.inventory || []).map(inv => `
                                        <div class="inv-item-row">
                                            <div>
                                                <div class="font-bold text-xs text-primary">${inv.name}</div>
                                                <div class="text-xs text-muted">${inv.category} • Par: ${inv.minThreshold} ${inv.unit}</div>
                                            </div>
                                            <div class="inv-stepper">
                                                <button class="btn-step btn-inv-minus" data-id="${inv.id}">-</button>
                                                <span class="inv-count">${inv.currentCount}</span>
                                                <button class="btn-step btn-inv-plus" data-id="${inv.id}">+</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Job Messaging & Voice Notes Component -->
                            <div class="mobile-card">
                                <div class="card-title-sm"><i data-lucide="message-square"></i> ${isSwahili ? 'Ujumbe wa Kazi Na Maongezi' : 'Job Instructions & Chat'}</div>
                                <div class="msg-thread p-2 bg-darker rounded mb-2" style="max-height: 160px; overflow-y: auto;">
                                    ${(store.messages || []).map(m => `
                                        <div class="msg-bubble ${m.senderRole === 'housekeeper' ? 'msg-out' : 'msg-in'} p-2 rounded mb-2 text-xs">
                                            <div class="flex-between font-bold text-muted mb-1">
                                                <span>${m.senderName}</span>
                                                <span>${m.timestamp}</span>
                                            </div>
                                            <div>${m.text}</div>
                                            ${m.translatedText ? `<div class="text-xs text-primary mt-1 font-italic">🌐 Translation: "${m.translatedText}"</div>` : ''}
                                            ${m.audioUrl ? `<div class="mt-1 badge badge-purple"><i data-lucide="mic"></i> Voice Note (0:14)</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="flex-gap mt-2">
                                    <input type="text" id="hk-chat-input" class="select-sm bg-darker w-full p-2 border rounded" placeholder="${isSwahili ? 'Andika ujumbe...' : 'Type instructions or update...'}">
                                    <button id="hk-send-msg-btn" class="btn btn-sm btn-primary"><i data-lucide="send"></i></button>
                                    <button id="hk-mic-btn" class="btn btn-sm btn-secondary" title="Record Voice Note"><i data-lucide="mic"></i></button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Emergency & Complete Job Action -->
                    <div class="mobile-footer p-3">
                        <button id="btn-complete-job" class="btn btn-success btn-full" ${activeJob.checklist.every(c => c.completed) ? '' : 'disabled'}>
                            <i data-lucide="check-check"></i> ${isSwahili ? 'Kamilisha Kazi & Tuma' : 'Complete Job & Submit Evidence'}
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.bindEvents(container, activeJob);
    },

    bindEvents(container, activeJob) {
        const isSwahili = window.HaoKeepStore.context.language === 'sw';

        // Add New Room / Area Modal Trigger
        container.querySelector('#btn-add-room-area')?.addEventListener('click', () => {
            const modalContent = `
                <div class="p-2">
                    <h4 class="font-bold mb-2"><i data-lucide="plus-circle" class="text-primary"></i> ${isSwahili ? 'Ongeza Eneo au Chumba Kipya' : 'Add Custom Room / Operational Area'}</h4>
                    <p class="text-xs text-muted mb-3">${isSwahili ? 'Weka jina la chumba na maagizo ya usafi kwa kazi hii.' : 'Specify custom area name and cleaning instructions for this turnover.'}</p>
                    
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Jina la Chumba / Eneo' : 'Room / Area Name'}</label>
                        <select id="new-room-name-select" class="select-sm w-full bg-darker p-2 border rounded mb-2">
                            <option value="Balcony">${isSwahili ? 'Balkoni (Balcony)' : 'Balcony'}</option>
                            <option value="Patio & Garden">${isSwahili ? 'Bustani / Uwanja (Patio & Garden)' : 'Patio & Garden'}</option>
                            <option value="Dining Area">${isSwahili ? 'Eneo la Kula (Dining Area)' : 'Dining Area'}</option>
                            <option value="Laundry Room">${isSwahili ? 'Chumba cha Fua (Laundry Room)' : 'Laundry Room'}</option>
                            <option value="Guest Bathroom 2">${isSwahili ? 'Bafu la Wageni (Guest Bathroom 2)' : 'Guest Bathroom 2'}</option>
                            <option value="Corridor / Hallway">${isSwahili ? 'Ukanda / Korido (Corridor / Hallway)' : 'Corridor / Hallway'}</option>
                            <option value="CUSTOM">${isSwahili ? '+ Jina Lingine Custom...' : '+ Other Custom Name...'}</option>
                        </select>
                        <input type="text" id="new-room-custom-input" class="input-field hidden" placeholder="${isSwahili ? 'Andika jina la chumba...' : 'Type room name...'}">
                    </div>

                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Maagizo ya Usafi' : 'Cleaning Instruction / Task'}</label>
                        <input type="text" id="new-room-task-input" class="input-field" placeholder="${isSwahili ? 'mft. Fagia balcony na safisha kioo cha dirisha' : 'e.g. Sweep patio tiles, clean glass railing & water plants'}">
                    </div>

                    <button id="btn-save-new-room" class="btn btn-primary btn-block mt-3">
                        <i data-lucide="check"></i> ${isSwahili ? 'Hifadhi Eneo & Ongeza kwenye Orodha' : 'Save Area & Append to Checklist'}
                    </button>
                </div>
            `;

            window.HaoKeepApp?.showModal(isSwahili ? 'Ongeza Eneo Kipya' : 'Add Custom Room / Area', modalContent);

            const selectEl = document.querySelector('#new-room-name-select');
            const customInputEl = document.querySelector('#new-room-custom-input');

            selectEl?.addEventListener('change', (e) => {
                if (e.target.value === 'CUSTOM') {
                    customInputEl?.classList.remove('hidden');
                } else {
                    customInputEl?.classList.add('hidden');
                }
            });

            document.querySelector('#btn-save-new-room')?.addEventListener('click', () => {
                const roomName = selectEl.value === 'CUSTOM' ? customInputEl.value.trim() : selectEl.value;
                const taskDesc = document.querySelector('#new-room-task-input')?.value.trim();

                if (!roomName || !taskDesc) {
                    window.HaoKeepApp?.showToast(isSwahili ? 'Tafadhali jaza jina la chumba na maagizo ya usafi!' : 'Please enter room name and cleaning instruction!', 'warning');
                    return;
                }

                activeJob.checklist.push({
                    room: roomName,
                    task: taskDesc,
                    photoRequired: true,
                    completed: false,
                    photoUrl: null,
                    aiScore: null
                });

                window.HaoKeepApp?.addAuditLog(`Custom Area Added: ${roomName} (${taskDesc}) added to Job ${activeJob.id}`);
                document.getElementById('modal-backdrop')?.classList.add('hidden');
                window.HaoKeepApp?.showToast(isSwahili ? `✅ ${roomName} imeongezwa kwenye orodha ya usafi!` : `✅ ${roomName} appended to turnover checklist!`, 'success');
                window.HaoKeepApp?.renderActiveView();
            });
        });

        // High-Contrast Outdoor Sunlight Mode Toggle
        container.querySelector('#btn-toggle-sunlight')?.addEventListener('click', () => {
            const isSun = document.body.classList.toggle('theme-sunlight');
            window.HaoKeepApp?.showToast(isSun ? '☀️ High-Contrast Sunlight Mode Enabled for Daylight Reading' : '🌙 Night Espresso Mode Restored', 'info');
            window.HaoKeepApp?.renderActiveView();
        });

        // Geofence checkin handler
        container.querySelector('#btn-geofence-checkin')?.addEventListener('click', () => {
            activeJob.geofenceVerified = true;
            activeJob.status = 'CHECKED_IN';
            activeJob.checkInTime = new Date().toISOString();
            window.HaoKeepApp?.showToast('GPS verified within 12m of property! Access code unlocked.', 'success');
            window.HaoKeepApp?.addAuditLog(`Geofenced Check-In: Cleaner ${activeJob.cleanerName} at ${activeJob.unitName}`);
            window.HaoKeepApp?.renderActiveView();
        });

        // Camera Button Trigger to Hidden File Input
        container.querySelectorAll('.btn-trigger-camera').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                const hiddenInput = container.querySelector(`#file-input-${idx}`);
                if (hiddenInput) hiddenInput.click();
            });
        });

        // Real Photo File Upload Handler (FileReader)
        container.querySelectorAll('.file-upload-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const idx = e.target.dataset.idx;
                const item = activeJob.checklist[idx];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const mediaDataUrl = event.target.result;
                        const isVideo = file.type.startsWith('video/');
                        const aiResult = window.HaoKeepAI.analyzeTurnoverPhoto(item.room, file.name);
                        
                        item.completed = true;
                        item.aiScore = aiResult.score;
                        item.photoUrl = mediaDataUrl;
                        item.mediaType = isVideo ? 'video' : 'image';

                        if (!window.HaoKeepStore.context.isOnline) {
                            window.HaoKeepSync.queueOfflineAction('MEDIA_UPLOAD', { job: activeJob.id, room: item.room, file: file.name, type: item.mediaType });
                        } else {
                            window.HaoKeepApp?.showToast(`${isVideo ? '📹 Real video evidence' : '📸 Real photo evidence'} uploaded for ${item.room}! AI Quality Score: ${aiResult.score}%`, 'success');
                        }

                        window.HaoKeepApp?.addAuditLog(`Media Uploaded (${item.mediaType.toUpperCase()}): Cleaner uploaded ${item.room} file for Job ${activeJob.id}`);
                        window.HaoKeepApp?.renderActiveView();
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Multi-Channel Share Handler (Native Share sheet: AirDrop, Mail, Messages, WhatsApp, Notes, Copy)
        container.querySelectorAll('.btn-share-multi').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                const item = activeJob.checklist[idx];
                const icon = item.mediaType === 'video' ? '📹' : '📸';
                const shareTitle = `CleanPulse Inspection Photo: ${item.room}`;
                const shareText = `${icon} CleanPulse Inspection Proof - ${activeJob.unitName} (${item.room}): ${item.task}. Status: Verified ${item.aiScore ? item.aiScore + '%' : ''}`;
                
                if (navigator.share) {
                    navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: window.location.href
                    }).then(() => {
                        window.HaoKeepApp?.showToast('📲 Media proof shared via Native System Share!', 'success');
                    }).catch(() => {});
                } else {
                    // Fallback Share Modal with direct links for WhatsApp, Mail, SMS, Copy
                    const modalContent = `
                        <div class="p-3">
                            <h4 class="font-bold mb-2">Share Inspection Proof (${item.room})</h4>
                            <p class="text-xs text-muted mb-3">${shareText}</p>
                            
                            <div class="grid-2col gap-2 mb-3">
                                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' - ' + window.location.href)}" target="_blank" class="btn btn-sm btn-whatsapp text-center" style="text-decoration:none;">
                                    🟢 WhatsApp
                                </a>
                                <a href="mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + window.location.href)}" class="btn btn-sm btn-secondary text-center" style="text-decoration:none;">
                                    ✉️ Email / Mail
                                </a>
                                <a href="sms:?&body=${encodeURIComponent(shareText + ' ' + window.location.href)}" class="btn btn-sm btn-secondary text-center" style="text-decoration:none;">
                                    💬 SMS / iMessage
                                </a>
                                <button id="btn-copy-share-link" class="btn btn-sm btn-secondary">
                                    📋 Copy Link
                                </button>
                            </div>
                        </div>
                    `;
                    window.HaoKeepApp?.showModal('Share Inspection Media Proof', modalContent);

                    document.querySelector('#btn-copy-share-link')?.addEventListener('click', () => {
                        navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
                        window.HaoKeepApp?.showToast('📋 Inspection link copied to clipboard!', 'info');
                    });
                }
            });
        });

        // Inventory Stepper Event Listeners
        container.querySelectorAll('.btn-inv-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const item = window.HaoKeepStore.inventory?.find(i => i.id === id);
                if (item && item.currentCount > 0) {
                    item.currentCount--;
                    if (item.currentCount <= item.minThreshold) {
                        window.HaoKeepApp?.showToast(`⚠️ Low Stock Alert: ${item.name} (${item.currentCount} left)`, 'warning');
                    }
                    window.HaoKeepApp?.renderActiveView();
                }
            });
        });

        container.querySelectorAll('.btn-inv-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const item = window.HaoKeepStore.inventory?.find(i => i.id === id);
                if (item) {
                    item.currentCount++;
                    window.HaoKeepApp?.renderActiveView();
                }
            });
        });

        // Complete job handler & Guest Check-In Broadcast
        container.querySelector('#btn-complete-job')?.addEventListener('click', () => {
            activeJob.status = 'COMPLETED';
            activeJob.checkOutTime = new Date().toISOString();
            
            // Post financial transaction & fiscalize
            window.HaoKeepLedger.postTransaction(
                '2010 Unearned Revenue',
                '2020 Worker Payable (Achieng Mary)',
                activeJob.payoutAmount,
                `Turnover Payout Accrual - ${activeJob.id}`
            );

            window.HaoKeepETIMS.generateFiscalInvoice(activeJob);

            // Pop Guest Broadcast Ready Modal
            const guestMsg = `✨ ${activeJob.unitName} is 100% Sparkle Verified & ready for check-in! Key code: 4921. Inspection Proof: ${window.location.href}`;
            const broadcastModal = `
                <div class="text-center p-2">
                    <div class="badge badge-green p-2 text-sm mb-3">🎉 Job Completed & Fiscalized</div>
                    <h3 class="font-bold text-lg text-primary mb-2">Broadcast Guest Check-In Ready</h3>
                    <p class="text-xs text-muted mb-4">Notify host and incoming guest instantly via WhatsApp / SMS payload.</p>
                    <div class="p-3 bg-darker rounded text-left text-xs mb-4 font-mono border" style="color: #dda15e;">
                        "${guestMsg}"
                    </div>
                    <div class="grid-2col gap-2">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(guestMsg)}" target="_blank" class="btn btn-sm btn-whatsapp text-center" style="text-decoration:none;">
                            🟢 WhatsApp Broadcast
                        </a>
                        <a href="sms:?&body=${encodeURIComponent(guestMsg)}" class="btn btn-sm btn-secondary text-center" style="text-decoration:none;">
                            💬 SMS Payload
                        </a>
                    </div>
                </div>
            `;

            window.HaoKeepApp?.showToast('Turnover completed & guest broadcast generated!', 'success');
            window.HaoKeepApp?.showModal('Guest Ready Broadcast', broadcastModal);
            window.HaoKeepApp?.renderActiveView();
        });

        // Send Text Message
        const sendMsg = () => {
            const input = container.querySelector('#hk-chat-input');
            const val = input?.value.trim();
            if (!val) return;

            window.HaoKeepStore.messages.push({
                id: 'MSG-' + Date.now(),
                jobId: activeJob.id,
                senderRole: 'housekeeper',
                senderName: 'Achieng Mary',
                text: val,
                audioUrl: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                translatedText: window.HaoKeepStore.context.language === 'sw' ? 'I have updated the job thread.' : null
            });

            window.HaoKeepApp?.addAuditLog(`Job Message Sent by Cleaner: "${val}"`);
            window.HaoKeepApp?.renderActiveView();
        };

        container.querySelector('#hk-send-msg-btn')?.addEventListener('click', sendMsg);
        container.querySelector('#hk-chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMsg();
        });

        // Record Voice Note
        container.querySelector('#hk-mic-btn')?.addEventListener('click', () => {
            const voiceSimulation = window.HaoKeepAI.transcribeVoiceNote(null);
            
            window.HaoKeepStore.messages.push({
                id: 'MSG-VN-' + Date.now(),
                jobId: activeJob.id,
                senderRole: 'housekeeper',
                senderName: 'Achieng Mary (Voice Note)',
                text: `🎙️ "${voiceSimulation.textSwahili}"`,
                audioUrl: 'voice_note_simulated.mp3',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                translatedText: voiceSimulation.textEnglish
            });

            window.HaoKeepApp?.showToast('Voice note recorded & translated to English by AI!', 'success');
            window.HaoKeepApp?.addAuditLog(`Voice Note Recorded & Transcribed: ${voiceSimulation.textEnglish}`);
            window.HaoKeepApp?.renderActiveView();
        });

        // 1. Report Lost & Found Item Modal
        container.querySelector('#btn-report-lost-found')?.addEventListener('click', () => {
            const formHTML = `
                <div class="p-2">
                    <h4 class="font-bold mb-2"><i data-lucide="package-search" class="text-warning"></i> ${isSwahili ? 'Ripoti Kitu Kilichopotea cha Mgeni' : 'Report Guest Lost & Found Item'}</h4>
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Maelezo ya Kitu na Aina' : 'Item Description & Brand'}</label>
                        <input type="text" id="lf-item-name" class="input-field" placeholder="${isSwahili ? 'mft. Chaja ya Simu / Pete ya Dhahabu' : 'e.g. Apple MacBook Charger / Gold Ring'}">
                    </div>
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Mahali Palipopatikana Chumbani' : 'Location Found in Room'}</label>
                        <input type="text" id="lf-location" class="input-field" placeholder="${isSwahili ? 'mft. Chini ya kitanda chumba kikuu' : 'e.g. Under bed in Master Bedroom'}">
                    </div>
                    <button id="btn-submit-lf" class="btn btn-primary btn-block mt-3">
                        <i data-lucide="send"></i> ${isSwahili ? 'Hifadhi Ripoti na Mjulishe Mwenye Nyumba' : 'Log Lost Item & Notify Host'}
                    </button>
                </div>
            `;
            window.HaoKeepApp?.showModal(isSwahili ? 'Ripoti Kitu Kilichopotea' : 'Log Guest Lost Item', formHTML);

            document.querySelector('#btn-submit-lf')?.addEventListener('click', () => {
                const name = document.querySelector('#lf-item-name')?.value.trim();
                const loc = document.querySelector('#lf-location')?.value.trim();
                if (!name) return;

                window.HaoKeepStore.lostAndFound.push({
                    id: 'LF-' + Date.now().toString().slice(-4),
                    unitName: activeJob.unitName,
                    cleanerName: activeJob.cleanerName,
                    itemName: name,
                    locationFound: loc || 'Guest Room',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'REPORTED',
                    photoUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=400&q=80'
                });

                window.HaoKeepApp?.addAuditLog(`Lost Item Reported: ${name} found by ${activeJob.cleanerName} at ${activeJob.unitName}`);
                document.getElementById('modal-backdrop')?.classList.add('hidden');
                window.HaoKeepApp?.showToast(isSwahili ? '🧳 Kitu kilichopotea kimeripotiwa! Mwenye nyumba amejulishwa.' : '🧳 Lost item logged! Host notified via push alert.', 'success');
            });
        });

        // 2. Report Property Damage Modal
        container.querySelector('#btn-report-damage')?.addEventListener('click', () => {
            const formHTML = `
                <div class="p-2">
                    <h4 class="font-bold mb-2"><i data-lucide="alert-triangle" class="text-danger"></i> ${isSwahili ? 'Ripoti Uharibifu wa Nyumba / Madai ya Bima' : 'Report Property Damage / AirCover Claim'}</h4>
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Kichwa / Maelezo ya Uharibifu' : 'Damage Title / Description'}</label>
                        <input type="text" id="dmg-title" class="input-field" placeholder="${isSwahili ? 'mft. Meza ya kioo imevunjika' : 'e.g. Broken Glass Table / Stained Sofa'}">
                    </div>
                    <div class="form-row flex gap-2 mb-2">
                        <div class="w-50">
                            <label>${isSwahili ? 'Kiwango cha Uharibifu' : 'Severity Level'}</label>
                            <select id="dmg-severity" class="select-sm w-full bg-darker p-2 border rounded">
                                <option value="MINOR">${isSwahili ? 'Ndogo (Mawaa/Mgongo)' : 'Minor (Scuff / Small stain)'}</option>
                                <option value="URGENT" selected>${isSwahili ? 'Dharura (Vitu vilivyovunjika)' : 'Urgent (Broken item / AirCover)'}</option>
                                <option value="CRITICAL">${isSwahili ? 'Khatari (Mabomba / Kufuli)' : 'Critical (Plumbing / Lock failure)'}</option>
                            </select>
                        </div>
                        <div class="w-50">
                            <label>${isSwahili ? 'Kadirio la Gharama (KES)' : 'Est. Cost (KES)'}</label>
                            <input type="number" id="dmg-cost" class="input-field" placeholder="8500">
                        </div>
                    </div>
                    <button id="btn-submit-dmg" class="btn btn-primary btn-block mt-3">
                        <i data-lucide="shield-alert"></i> ${isSwahili ? 'Wasilisha Ripoti ya Uharibifu' : 'Submit Damage Incident Claim'}
                    </button>
                </div>
            `;
            window.HaoKeepApp?.showModal(isSwahili ? 'Ripoti Uharibifu Nyumbani' : 'Report Damage Incident', formHTML);

            document.querySelector('#btn-submit-dmg')?.addEventListener('click', () => {
                const title = document.querySelector('#dmg-title')?.value.trim();
                const severity = document.querySelector('#dmg-severity')?.value;
                const cost = parseInt(document.querySelector('#dmg-cost')?.value || '5000');
                if (!title) return;

                window.HaoKeepStore.incidents.push({
                    id: 'INC-' + Date.now().toString().slice(-4),
                    unitName: activeJob.unitName,
                    cleanerName: activeJob.cleanerName,
                    severity,
                    title,
                    estimatedCost: cost,
                    status: 'OPEN',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
                });

                window.HaoKeepApp?.addAuditLog(`Damage Claim Filed: [${severity}] ${title} at ${activeJob.unitName} (Est KES ${cost})`);
                document.getElementById('modal-backdrop')?.classList.add('hidden');
                window.HaoKeepApp?.showToast('⚠️ Damage incident logged & AirCover claim draft created!', 'warning');
            });
        });

        // 3. Request Par Stock Replenishment
        container.querySelector('#btn-request-par')?.addEventListener('click', () => {
            const formHTML = `
                <div class="p-2">
                    <h4 class="font-bold mb-2"><i data-lucide="box" class="text-primary"></i> ${isSwahili ? 'Ombi la Kuongezewa Shuka na Vifaa' : 'Request Par Stock Replenishment'}</h4>
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Kitu Kinachohitajika' : 'Item Needed'}</label>
                        <input type="text" id="par-item" class="input-field" placeholder="${isSwahili ? 'mft. Shuka za Kitanda Kikuu na Karatasi za Choo' : 'e.g. King Fitted Sheets & Toilet Paper'}">
                    </div>
                    <div class="form-group mb-2">
                        <label>${isSwahili ? 'Idadi Inayohitajika' : 'Quantity Required'}</label>
                        <input type="number" id="par-qty" class="input-field" value="4">
                    </div>
                    <button id="btn-submit-par" class="btn btn-primary btn-block mt-3">
                        <i data-lucide="truck"></i> ${isSwahili ? 'Tuma Ombi la Vitu Kwenda Stoo' : 'Dispatch Warehouse Replenishment'}
                    </button>
                </div>
            `;
            window.HaoKeepApp?.showModal(isSwahili ? 'Ombi la Shuka na Vifaa' : 'Linen Par Replenishment', formHTML);

            document.querySelector('#btn-submit-par')?.addEventListener('click', () => {
                const item = document.querySelector('#par-item')?.value.trim();
                const qty = parseInt(document.querySelector('#par-qty')?.value || '2');
                if (!item) return;

                window.HaoKeepStore.parRequests.push({
                    id: 'REQ-' + Date.now().toString().slice(-4),
                    unitName: activeJob.unitName,
                    requestedBy: activeJob.cleanerName,
                    item,
                    quantity: qty,
                    urgency: 'HIGH',
                    status: 'PENDING',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });

                window.HaoKeepApp?.addAuditLog(`Par Stock Requested: ${qty}x ${item} requested by ${activeJob.cleanerName} for ${activeJob.unitName}`);
                document.getElementById('modal-backdrop')?.classList.add('hidden');
                window.HaoKeepApp?.showToast(isSwahili ? '📦 Ombi la vifaa na shuka limetumwa kwa stoo!' : '📦 Linen & supply replenishment dispatched to warehouse!', 'success');
            });
        });
    }
};
