/**
 * KRA eTIMS Tax Engine & Fiscalization Simulator for HaoKeep / CleanPulse
 */
window.HaoKeepETIMS = {
    // Tax Rates Table
    taxRules: {
        KE: { vatRate: 0.16, whtRate: 0.05, name: 'KRA eTIMS (Kenya)', cuPrefix: 'CU-INV-KE' },
        US: { vatRate: 0.07, whtRate: 0.00, name: 'US State Sales Tax', cuPrefix: 'US-TAX' },
        UK: { vatRate: 0.20, whtRate: 0.00, name: 'UK HMRC VAT', cuPrefix: 'UK-VAT' },
        NG: { vatRate: 0.075, whtRate: 0.05, name: 'FIRS VAT (Nigeria)', cuPrefix: 'NG-FIRS' },
        ZA: { vatRate: 0.15, whtRate: 0.00, name: 'SARS VAT (South Africa)', cuPrefix: 'ZA-SARS' }
    },

    // Fiscalize invoice with eTIMS transmission simulation
    generateFiscalInvoice(jobOrOrder) {
        const store = window.HaoKeepStore;
        const market = store.context.market;
        const rule = this.taxRules[market] || this.taxRules.KE;

        const totalAmount = jobOrOrder.payoutAmount ? jobOrOrder.payoutAmount * 1.4 : 3500;
        const netAmount = totalAmount / (1 + rule.vatRate);
        const vatAmount = totalAmount - netAmount;
        const whtAmount = totalAmount * rule.whtRate;

        const invoiceNum = rule.cuPrefix + '-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        const cuSerial = 'KRA' + Math.floor(100000000 + Math.random() * 900000000);
        
        const invoice = {
            invoiceNum,
            cuSerial,
            dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            customerName: jobOrOrder.unitName ? 'Owner of ' + jobOrOrder.unitName : 'Client Customer Ltd',
            customerPIN: 'A' + Math.floor(10000000 + Math.random() * 90000000) + 'Z',
            totalAmount: totalAmount,
            netAmount: netAmount,
            vatAmount: vatAmount,
            whtAmount: whtAmount,
            status: 'TRANSMITTED',
            qrCodeData: `https://itax.kra.go.ke/verify?inv=${invoiceNum}&cu=${cuSerial}&amt=${totalAmount}`
        };

        store.etimsInvoices.unshift(invoice);

        // Also post double-entry ledger entry for tax payable
        window.HaoKeepLedger.postTransaction(
            '1200 Accounts Receivable',
            '2200 KRA VAT Payable',
            vatAmount,
            `VAT 16% Accrual on ${invoiceNum}`,
            invoiceNum
        );

        window.HaoKeepApp?.addAuditLog(`eTIMS Fiscalization Transmitted to KRA: ${invoiceNum}`);
        return invoice;
    }
};
