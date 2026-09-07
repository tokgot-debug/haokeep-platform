/**
 * Exports Engine for CleanPulse / HaoKeep
 * Provides downloadable CSV reports & print-friendly HTML tax invoices/receipts.
 */
window.HaoKeepExport = {

    exportCSV(filename, rows) {
        if (!rows || !rows.length) return;
        const separator = ',';
        const keys = Object.keys(rows[0]);
        const csvContent =
            keys.join(separator) +
            '\n' +
            rows.map(row => {
                return keys.map(k => {
                    let cell = row[k] === null || row[k] === undefined ? '' : row[k].toString();
                    cell = cell.replace(/"/g, '""');
                    if (cell.search(/("|,|\n)/g) >= 0) {
                        cell = `"${cell}"`;
                    }
                    return cell;
                }).join(separator);
            }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    exportJobsCSV() {
        const jobs = window.HaoKeepStore.jobs || [];
        const exportData = jobs.map(j => ({
            JobID: j.id,
            Unit: j.unitName,
            Cleaner: j.cleanerName,
            Status: j.status,
            Payout: j.payoutAmount,
            WindowStart: j.windowStart,
            WindowEnd: j.windowEnd,
            CheckIn: j.checkInTime || 'N/A',
            CheckOut: j.checkOutTime || 'N/A'
        }));
        this.exportCSV(`CleanPulse_Jobs_Report_${new Date().toISOString().slice(0, 10)}.csv`, exportData);
        window.HaoKeepApp?.showToast('📊 Jobs CSV exported successfully!', 'success');
    },

    exportETIMSCSV() {
        const invoices = window.HaoKeepStore.etimsInvoices || [];
        const exportData = invoices.map(inv => ({
            InvoiceNum: inv.invoiceNum,
            CUSerial: inv.cuSerial,
            DateTime: inv.dateTime,
            CustomerName: inv.customerName,
            CustomerPIN: inv.customerPIN,
            TotalAmount: inv.totalAmount,
            VAT16: inv.vatAmount,
            WHT5: inv.whtAmount,
            Status: inv.status
        }));
        this.exportCSV(`KRA_eTIMS_Invoices_${new Date().toISOString().slice(0, 10)}.csv`, exportData);
        window.HaoKeepApp?.showToast('📄 KRA eTIMS Tax CSV exported successfully!', 'success');
    },

    printTaxInvoice(invoiceNum) {
        const inv = window.HaoKeepStore.etimsInvoices.find(i => i.invoiceNum === invoiceNum) || window.HaoKeepStore.etimsInvoices[0];
        if (!inv) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>KRA eTIMS Fiscal Invoice — ${inv.invoiceNum}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; color: #111; line-height: 1.5; }
                    .header { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; }
                    .kra-badge { background: #ce1126; color: #fff; padding: 4px 8px; font-weight: bold; border-radius: 4px; font-size: 12px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #f4f4f4; }
                    .qr-box { text-align: center; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h2>CleanPulse Operations Kenya Ltd</h2>
                        <p>KRA PIN: P051982736Z | Nairobi, Kenya</p>
                    </div>
                    <div>
                        <span class="kra-badge">KRA eTIMS VERIFIED</span>
                        <h3 style="margin-top:5px;">ELECTRONIC TAX INVOICE</h3>
                    </div>
                </div>

                <p><strong>Invoice Number:</strong> ${inv.invoiceNum}</p>
                <p><strong>Control Unit Serial:</strong> ${inv.cuSerial}</p>
                <p><strong>Date & Time:</strong> ${inv.dateTime}</p>
                <p><strong>Billed To:</strong> ${inv.customerName} (PIN: ${inv.customerPIN})</p>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price (KES)</th>
                            <th>Total (KES)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Short-Let Turnover Housekeeping & Linen Dispatch</td>
                            <td>1</td>
                            <td>${inv.totalAmount.toLocaleString()}</td>
                            <td>${inv.totalAmount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="text-align: right;">
                    <p>Subtotal (Excl VAT): KES ${(inv.totalAmount - inv.vatAmount).toFixed(2)}</p>
                    <p>VAT (16% Inclusive): KES ${inv.vatAmount.toFixed(2)}</p>
                    <p>Withholding Tax (5%): KES ${inv.whtAmount.toFixed(2)}</p>
                    <h3>Total Paid: KES ${inv.totalAmount.toLocaleString()}</h3>
                </div>

                <div class="qr-box">
                    <p style="font-size:12px;">Scan QR Code to Verify Tax Stamp on KRA iTax Portal:</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inv.qrCodeData)}" alt="KRA QR Code">
                </div>

                <script>window.print();</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};
