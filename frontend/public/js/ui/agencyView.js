/**
 * UI Renderer: Cleaning Agency Operations Surface
 */
window.HaoKeepAgencyView = {
    render(container) {
        const store = window.HaoKeepStore;
        const isSwahili = store.context.language === 'sw';

        container.innerHTML = `
            <div class="dashboard-layout">
                <div class="dashboard-header">
                    <div>
                        <h2>${isSwahili ? 'Kituo cha Usimamizi wa Shirika la Usafi & Ratiba ya Kazi' : 'Cleaning Agency Dispatch & Territory Command'}</h2>
                        <p class="subtitle">${isSwahili ? 'Usimamizi wa wafanyakazi, upangaji bora wa njia, na ufuatiliaji wa live GPS' : 'Roster management, automated route optimization, and live GPS tracking'}</p>
                    </div>
                    <div class="flex-gap">
                        <button class="btn btn-primary" onclick="window.HaoKeepEnroll.showAddCleanerForm()"><i data-lucide="user-plus"></i> ${isSwahili ? 'Sajili Mfanyakazi Mpya' : 'Enroll New Housekeeper'}</button>
                        <span class="badge badge-purple">${isSwahili ? 'Mfumo B (Shirika la Usafi Direct)' : 'Operating Model B (Agency Direct)'}</span>
                    </div>
                </div>

                <!-- Agency Overview Metrics -->
                <div class="grid-4col mt-4">
                    <div class="card">
                        <div class="text-xs text-muted">Active Field Staff</div>
                        <div class="metric-val text-primary">18 Cleaners</div>
                    </div>
                    <div class="card">
                        <div class="text-xs text-muted">Today's Turnovers</div>
                        <div class="metric-val text-success">12 Completed / 3 Active</div>
                    </div>
                    <div class="card">
                        <div class="text-xs text-muted">Maintenance Orders</div>
                        <div class="metric-val text-warning">${(store.workOrders || []).length} Active Orders</div>
                    </div>
                    <div class="card">
                        <div class="text-xs text-muted">Agency Quality Avg</div>
                        <div class="metric-val text-purple">97.4%</div>
                    </div>
                </div>

                <!-- Cleaner Roster & Live Status Grid -->
                <div class="grid-2col mt-4">
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="users"></i> Field Staff Roster & Scoring</h3>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Cleaner</th>
                                    <th>Status</th>
                                    <th>Rating</th>
                                    <th>Quality Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${store.cleaners.map(c => `
                                    <tr>
                                        <td><strong>${c.name}</strong><br><small class="text-muted">${c.assignedTerritory}</small></td>
                                        <td><span class="badge badge-${c.status === 'AVAILABLE' ? 'green' : 'blue'}">${c.status}</span></td>
                                        <td>⭐ ${c.rating}</td>
                                        <td><strong class="text-success">${c.qualityScore}%</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Dispatch Scoring Simulator Card -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="cpu"></i> Auto-Dispatch Weighted Score Simulator</h3>
                        </div>
                        <p class="text-xs text-muted">Algorithm weights: Distance (30%), Quality (30%), Reliability (20%), Workload (20%)</p>
                        
                        <div class="p-3 bg-darker rounded mt-3">
                            <div class="text-sm font-bold mb-2">Simulated Candidate Rankings for UNIT-101 (Kilimani):</div>
                            <ol class="scoring-list text-xs">
                                <li class="flex-between p-2 border-b border-gray">
                                    <span>1. <strong>Achieng Mary</strong> (Dist: 0.4km, Score: 98%)</span>
                                    <span class="badge badge-green">96.8 / 100</span>
                                </li>
                                <li class="flex-between p-2 border-b border-gray">
                                    <span>2. <strong>Kipchumba David</strong> (Dist: 3.2km, Score: 95%)</span>
                                    <span class="badge badge-yellow">88.4 / 100</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
                <!-- Cleaner Performance & Tip Earnings Leaderboard -->
                <div class="card mt-4">
                    <div class="card-header flex-between">
                        <h3><i data-lucide="trophy" class="text-warning"></i> Housekeeper Performance & Digital Tip Earnings Leaderboard</h3>
                        <span class="badge badge-yellow">Top Cleaners Recognized</span>
                    </div>
                    <div class="grid-2col gap-3 mt-3">
                        ${(store.cleanerLeaderboard || []).map(lb => `
                            <div class="leaderboard-row">
                                <div class="flex-gap">
                                    <div class="rank-badge">#${lb.rank}</div>
                                    <div>
                                        <div class="font-bold text-sm text-primary">${lb.name}</div>
                                        <div class="text-xs text-muted">${lb.badge} • ${lb.jobsCompleted} Jobs Completed</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-success text-sm">${lb.qualityScore}% Quality</div>
                                    <div class="text-xs text-warning mt-1">🎁 KSh ${lb.tipsEarned.toLocaleString()} Tips</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Live GPS Fleet Tracking Map & Route Command -->
                <div class="card mt-4">
                    <div class="card-header flex-between">
                        <h3><i data-lucide="navigation" class="text-primary"></i> Live GPS Field Fleet Radar & Territory Map</h3>
                        <div class="flex-gap">
                            <span class="badge badge-green"><span class="status-dot"></span> Live Telemetry Active</span>
                            <button id="btn-export-jobs-csv" class="btn btn-sm btn-secondary"><i data-lucide="download"></i> Export Jobs CSV</button>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-darker rounded mt-2 border" style="min-height: 200px; background: linear-gradient(135deg, rgba(14, 11, 8, 0.95), rgba(28, 22, 17, 0.9)); position: relative;">
                        <div class="flex-between mb-3">
                            <div class="text-xs text-dim"><i data-lucide="map-pin"></i> Nairobi Territory Radar: Kilimani | Westlands | Lavington</div>
                            <div class="text-xs text-primary font-mono">GPS Ping: Every 15s (Accuracy 4m)</div>
                        </div>

                        <div class="grid-3col gap-3 mt-2">
                            ${store.cleaners.map(c => `
                                <div class="card p-3 border" style="background: rgba(20, 15, 11, 0.8);">
                                    <div class="flex-between mb-2">
                                        <span class="font-bold text-sm text-main">${c.name}</span>
                                        <span class="badge badge-${c.status === 'AVAILABLE' ? 'green' : 'purple'}">${c.status}</span>
                                    </div>
                                    <div class="text-xs text-muted mb-1"><i data-lucide="map-pin"></i> GPS Pin: [${c.currentLocation.lat}, ${c.currentLocation.lng}]</div>
                                    <div class="text-xs text-muted mb-2">Assigned: ${c.assignedTerritory}</div>
                                    <div class="progress-bar-bg" style="height:6px; background:rgba(212,163,115,0.2); border-radius:4px; overflow:hidden;">
                                        <div style="width: ${c.qualityScore}%; height:100%; background:var(--primary);"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Lost & Found + Damage Incidents Log Table -->
                <div class="grid-2col mt-4">
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="package-search" class="text-warning"></i> Guest Lost & Found Items Log</h3>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Unit</th>
                                    <th>Item</th>
                                    <th>Location Found</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(store.lostAndFound || []).map(lf => `
                                    <tr>
                                        <td><strong>${lf.unitName}</strong></td>
                                        <td>${lf.itemName}</td>
                                        <td>${lf.locationFound}</td>
                                        <td><span class="badge badge-yellow">${lf.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="alert-triangle" class="text-danger"></i> Damage & AirCover Claims</h3>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Unit</th>
                                    <th>Incident Title</th>
                                    <th>Severity</th>
                                    <th>Est. Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(store.incidents || []).map(inc => `
                                    <tr>
                                        <td><strong>${inc.unitName}</strong></td>
                                        <td>${inc.title}</td>
                                        <td><span class="badge badge-${inc.severity === 'CRITICAL' ? 'red' : 'yellow'}">${inc.severity}</span></td>
                                        <td><strong>KES ${inc.estimatedCost.toLocaleString()}</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container);
    },

    bindEvents(container) {
        container.querySelector('#btn-export-jobs-csv')?.addEventListener('click', () => {
            window.HaoKeepExport.exportJobsCSV();
        });
    }
};
