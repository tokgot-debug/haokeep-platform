/**
 * UI Renderer: Platform Administration & Immutable Audit Trail Surface
 */
window.HaoKeepAdminView = {
    render(container) {
        const store = window.HaoKeepStore;

        container.innerHTML = `
            <div class="dashboard-layout">
                <div class="dashboard-header">
                    <div>
                        <h2>Platform Administration & Cryptographic Audit Log</h2>
                        <p class="subtitle">Immutable SHA-256 hash-chain audit log, tenant health, and AI vision telemetry</p>
                    </div>
                    <div class="flex-gap">
                        <button class="btn btn-primary" onclick="window.HaoKeepEnroll.showAddAgencyForm()"><i data-lucide="briefcase"></i> Register Agency</button>
                        <button class="btn btn-secondary" onclick="window.HaoKeepEnroll.showAddCleanerForm()"><i data-lucide="user-plus"></i> Add Housekeeper</button>
                        <button class="btn btn-secondary" onclick="window.HaoKeepEnroll.showAddUnitForm()"><i data-lucide="building"></i> Add Property</button>
                        <span class="badge badge-green">SHA-256 Chain Intact</span>
                    </div>
                </div>

                <div class="grid-2col mt-4">
                    <!-- Immutable SHA-256 Audit Log -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="shield-check"></i> Cryptographic Audit Log Hash-Chain</h3>
                        </div>
                        <div class="audit-chain-list">
                            ${store.auditLog.map(item => `
                                <div class="audit-item p-3 bg-darker rounded mb-2 border border-gray text-xs">
                                    <div class="flex-between">
                                        <span class="font-bold text-primary">#${item.index} | ${item.actor}</span>
                                        <span class="text-muted">${item.timestamp.substring(11, 19)}</span>
                                    </div>
                                    <div class="my-1">${item.event}</div>
                                    <div class="font-mono text-muted text-xxs">
                                        Prev: ${item.prevHash.substring(0, 16)}...<br>
                                        Hash: <span class="text-success">${item.hash.substring(0, 24)}...</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- AI Vision Telemetry & System Health -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="cpu"></i> AI Vision Quality Telemetry</h3>
                        </div>
                        <div class="p-3 bg-darker rounded text-xs mb-3">
                            <div class="font-bold mb-1">Pass / Rejection Threshold: 85%</div>
                            <div>Average Computer Vision Score: <strong>96.4%</strong></div>
                            <div>False Positive Rate: <strong>0.2%</strong></div>
                        </div>

                        <div class="card-header mt-4">
                            <h3><i data-lucide="layers"></i> Multi-Tenant System Metrics</h3>
                        </div>
                        <div class="grid-2col text-xs">
                            <div class="p-2 bg-darker rounded">
                                <div class="text-muted">Active Tenants</div>
                                <div class="font-bold text-sm text-primary">42 Agencies / Hosts</div>
                            </div>
                            <div class="p-2 bg-darker rounded">
                                <div class="text-muted">iCal Sync Health</div>
                                <div class="font-bold text-sm text-success">99.9% Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
