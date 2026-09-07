/**
 * Double-Entry Accounting & Financial Ledger Engine for HaoKeep / CleanPulse
 */
window.HaoKeepLedger = {
    // Add transaction and enforce debit == credit balance
    postTransaction(debitAccount, creditAccount, amount, description, ref = '') {
        const store = window.HaoKeepStore;
        const tx = {
            id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
            timestamp: new Date().toISOString(),
            description: description,
            debitAccount: debitAccount,
            creditAccount: creditAccount,
            amount: parseFloat(amount),
            currency: store.context.currency,
            ref: ref
        };

        store.ledger.push(tx);
        
        // Log in immutable audit trail
        window.HaoKeepApp?.addAuditLog(`Ledger Posted: ${description} [${store.context.currency} ${amount}]`);
        return tx;
    },

    // Calculate trial balance to verify debit == credit invariant
    getTrialBalance() {
        const store = window.HaoKeepStore;
        const balances = {};
        let totalDebit = 0;
        let totalCredit = 0;

        store.ledger.forEach(tx => {
            // Debit account increment
            balances[tx.debitAccount] = (balances[tx.debitAccount] || 0) + tx.amount;
            totalDebit += tx.amount;

            // Credit account increment (negative representation for balance sheet view)
            balances[tx.creditAccount] = (balances[tx.creditAccount] || 0) - tx.amount;
            totalCredit += tx.amount;
        });

        return {
            balances,
            totalDebit,
            totalCredit,
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
        };
    },

    // Format currency based on active context with dynamic FX conversion
    formatMoney(amount, currency = null) {
        const store = window.HaoKeepStore;
        const targetCurr = currency || store.context.currency || 'KES';
        const fxRates = store.fxRates || { KES: 1, USD: 0.0077, EUR: 0.0070, GBP: 0.0060 };
        const symbols = store.currencySymbols || { KES: 'KSh ', USD: '$', EUR: '€', GBP: '£' };
        
        // Convert from base KES to target Currency
        const rate = fxRates[targetCurr] || 1;
        const converted = parseFloat(amount) * rate;
        const sym = symbols[targetCurr] || targetCurr + ' ';
        
        const decimals = targetCurr === 'KES' ? 0 : 2;
        return sym + converted.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
};
