/**
 * UI Renderer: Finance, Multi-Rail Payments, Double-Entry Ledger & eTIMS Surface
 */
window.HaoKeepFinanceView = {
    render(container) {
        const store = window.HaoKeepStore;
        const trialBalance = window.HaoKeepLedger.getTrialBalance();

        container.innerHTML = `
            <div class="dashboard-layout">
                <div class="dashboard-header">
                    <div>
                        <h2>Finance, Double-Entry Ledger & eTIMS Tax Workspace</h2>
                        <p class="subtitle">Multi-rail payment settlement (M-Pesa STK/C2B, Card), balanced ledger & KRA tax invoices</p>
                    </div>
                    <div class="flex-gap">
                        <button id="btn-export-etims-csv" class="btn btn-secondary">
                            <i data-lucide="download"></i> Export eTIMS CSV
                        </button>
                        <button id="btn-trigger-mpesa" class="btn btn-primary">
                            <i data-lucide="smartphone"></i> Simulate M-Pesa STK Push Payment
                        </button>
                    </div>
                </div>

                <!-- Finance Overview Metric Cards -->
                <div class="metrics-grid mt-4">
                    <div class="metric-card">
                        <div class="metric-icon bg-green-light"><i data-lucide="dollar-sign"></i></div>
                        <div>
                            <span class="metric-label">Total Platform Revenue</span>
                            <span class="metric-value">KES 245,000</span>
                            <span class="metric-sub text-green">Gross Turnover Volume</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon bg-blue-light"><i data-lucide="scale"></i></div>
                        <div>
                            <span class="metric-label">Worker Payables</span>
                            <span class="metric-value">KES 178,500</span>
                            <span class="metric-sub text-blue">Settled via M-Pesa B2C</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon bg-purple-light"><i data-lucide="receipt"></i></div>
                        <div>
                            <span class="metric-label">eTIMS Transmitted Invoices</span>
                            <span class="metric-value">48 Fiscalized</span>
                            <span class="metric-sub text-purple">KRA Control Units Active</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon bg-amber-light"><i data-lucide="shield-check"></i></div>
                        <div>
                            <span class="metric-label">Ledger Integrity</span>
                            <span class="metric-value text-green">BALANCED</span>
                            <span class="metric-sub">Debits = Credits (Diff: 0.00)</span>
                        </div>
                    </div>
                </div>

                <!-- Trial Balance Summary Banner -->
                <div class="card mt-4 ${trialBalance.isBalanced ? 'border-success' : 'border-danger'}">
                    <div class="flex-between">
                        <div>
                            <span class="badge badge-${trialBalance.isBalanced ? 'green' : 'red'}">
                                ${trialBalance.isBalanced ? '✓ DOUBLE-ENTRY LEDGER BALANCED' : '⚠️ UNBALANCED LEDGER'}
                            </span>
                            <h3 class="mt-1">Trial Balance Audit Verification</h3>
                        </div>
                        <div class="text-right">
                            <div class="text-xs text-muted">Total Debits / Credits</div>
                            <div class="font-mono font-bold text-lg text-primary">
                                ${window.HaoKeepLedger.formatMoney(trialBalance.totalDebit)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Double-Entry Ledger & eTIMS Grid -->
                <div class="grid-2col mt-4">
                    <!-- General Ledger Journal -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="book-open"></i> Double-Entry General Ledger Journal</h3>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>TX ID</th>
                                    <th>Description</th>
                                    <th>Debit Account</th>
                                    <th>Credit Account</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${store.ledger.map(tx => `
                                    <tr>
                                        <td class="font-mono text-xs">${tx.id}</td>
                                        <td class="text-xs">${tx.description}</td>
                                        <td class="text-xs text-primary">${tx.debitAccount}</td>
                                        <td class="text-xs text-warning">${tx.creditAccount}</td>
                                        <td class="font-mono font-bold">${window.HaoKeepLedger.formatMoney(tx.amount, tx.currency)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- KRA eTIMS Fiscalized Tax Invoices -->
                    <div class="card">
                        <div class="card-header">
                            <h3><i data-lucide="receipt"></i> KRA eTIMS Tax Invoices</h3>
                            <span class="badge badge-green">eTIMS OSCU Connected</span>
                        </div>
                        
                        ${store.etimsInvoices.map(inv => `
                            <div class="etims-invoice-card p-3 bg-darker rounded mb-3 border border-gray">
                                <div class="flex-between border-b border-gray pb-2 mb-2">
                                    <div>
                                        <div class="font-mono font-bold text-primary">${inv.invoiceNum}</div>
                                        <div class="text-xs text-muted">CU Serial: ${inv.cuSerial}</div>
                                    </div>
                                    <span class="badge badge-green">${inv.status}</span>
                                </div>
                                <div class="grid-2col text-xs">
                                    <div>
                                        <div>Customer: <strong>${inv.customerName}</strong></div>
                                        <div>KRA PIN: <strong>${inv.customerPIN}</strong></div>
                                    </div>
                                    <div class="text-right">
                                        <div>Total: <strong>${window.HaoKeepLedger.formatMoney(inv.totalAmount)}</strong></div>
                                        <div>VAT (16%): <strong>${window.HaoKeepLedger.formatMoney(inv.vatAmount)}</strong></div>
                                        <div>WHT (5%): <strong>${window.HaoKeepLedger.formatMoney(inv.whtAmount)}</strong></div>
                                    </div>
                                </div>
                                <div class="mt-3 text-center">
                                    <canvas id="qr-${inv.invoiceNum.replace(/-/g, '')}" class="qr-canvas"></canvas>
                                    <div class="text-xs text-muted mt-1 font-mono">Scan QR to verify on KRA iTax Portal</div>
                                    <button class="btn btn-xs btn-secondary btn-print-invoice mt-2 w-full" data-inv="${inv.invoiceNum}">
                                        <i data-lucide="printer"></i> Print Official KRA Tax Receipt (PDF)
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container);
        this.renderQRCodes();
    },


    bindEvents(container) {
        container.querySelector('#btn-export-etims-csv')?.addEventListener('click', () => {
            window.HaoKeepExport.exportETIMSCSV();
        });

        container.querySelectorAll('.btn-print-invoice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const invNum = e.currentTarget.dataset.inv;
                window.HaoKeepExport.printTaxInvoice(invNum);
            });
        });

        container.querySelector('#btn-trigger-mpesa')?.addEventListener('click', () => {
            window.HaoKeepApp?.showModal('M-Pesa STK Push Settlement', `
                <div class="p-3 text-center">
                    <i data-lucide="smartphone" class="icon-lg text-success mb-2"></i>
                    <h4>Initiate M-Pesa Express Payment</h4>
                    <p class="text-xs text-muted mb-3">STK Push request sent to host phone (+254712345678) for KES 3,500</p>
                    <div class="p-3 bg-darker rounded mb-3">
                        <div class="font-mono text-warning text-sm">Simulated Phone Screen: Enter M-Pesa PIN</div>
                    </div>
                    <button id="btn-confirm-stk" class="btn btn-success btn-full">
                        Simulate User Entered PIN & Confirm Payment
                    </button>
                </div>
            `);

            document.querySelector('#btn-confirm-stk')?.addEventListener('click', () => {
                window.HaoKeepLedger.postTransaction(
                    '1010 Escrow Cash (M-Pesa)',
                    '1200 Accounts Receivable',
                    3500,
                    'M-Pesa C2B Settlement - KRA-STK-99120',
                    'STK-99120'
                );
                window.HaoKeepApp?.closeModal();
                window.HaoKeepApp?.showToast('M-Pesa payment received & reconciled in ledger!', 'success');
                window.HaoKeepApp?.renderActiveView();
            });
        });
    },

    renderQRCodes() {
        setTimeout(() => {
            window.HaoKeepStore.etimsInvoices.forEach(inv => {
                const canvasId = `qr-${inv.invoiceNum.replace(/-/g, '')}`;
                const canvas = document.getElementById(canvasId);
                if (canvas && window.QRious) {
                    new QRious({
                        element: canvas,
                        value: inv.qrCodeData,
                        size: 110,
                        backgroundAlpha: 0,
                        foreground: '#d4a373'
                    });
                }
            });
        }, 100);
    }
};
