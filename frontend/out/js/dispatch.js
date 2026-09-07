/**
 * iCal Ingestion & Automated Dispatch Assignment Algorithm
 */
window.HaoKeepDispatch = {
    // Ingest mock iCal checkout and trigger job creation
    ingestICalFeed(unitId) {
        const store = window.HaoKeepStore;
        const unit = store.units.find(u => u.id === unitId);
        if (!unit) return null;

        unit.status = 'DIRTY';

        // Auto-assign best housekeeper using weighted scoring algorithm
        const bestCleaner = this.calculateAutoAssignScore(unit);

        const newJob = {
            id: 'JOB-2026-' + Math.floor(100 + Math.random() * 900),
            unitId: unit.id,
            unitName: unit.name,
            cleanerId: bestCleaner ? bestCleaner.id : 'CLN-001',
            cleanerName: bestCleaner ? bestCleaner.name : 'Achieng Mary',
            scheduledDate: new Date().toISOString().substring(0, 10),
            windowStart: '11:00',
            windowEnd: '14:00',
            payoutAmount: unit.type.includes('Studio') ? 1800 : (unit.type.includes('3BR') ? 3800 : 2500),
            status: 'ASSIGNED',
            geofenceVerified: false,
            checkInTime: null,
            checkOutTime: null,
            checklist: [
                { room: 'Living Room', task: 'Make sofa bed & fluff cushions', photoRequired: true, completed: false, photoUrl: null, aiScore: null },
                { room: 'Bedroom', task: 'Change linen & hospital corners', photoRequired: true, completed: false, photoUrl: null, aiScore: null },
                { room: 'Bathroom', task: 'Disinfect tiles & restock amenities', photoRequired: true, completed: false, photoUrl: null, aiScore: null }
            ],
            linenInventory: { duvetCoverKing: 1, fittedSheetKing: 1, pillowcases: 2, bathTowels: 2 },
            damagesReported: []
        };

        store.jobs.unshift(newJob);
        window.HaoKeepApp?.addAuditLog(`iCal Dispatch Triggered: New turnover ${newJob.id} assigned to ${newJob.cleanerName}`);
        return newJob;
    },

    // Weighted Scoring Algorithm (FR-4.4 / SR-2.1)
    calculateAutoAssignScore(unit) {
        const cleaners = window.HaoKeepStore.cleaners;
        let bestCleaner = null;
        let highestScore = -1;

        cleaners.forEach(cleaner => {
            // Distance calculation
            const dLat = (cleaner.currentLocation.lat - unit.coordinates.lat);
            const dLng = (cleaner.currentLocation.lng - unit.coordinates.lng);
            const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

            // Score components (Weights: Distance 30%, Quality 30%, Reliability 20%, Workload 20%)
            const distanceScore = Math.max(0, 100 - (distanceKm * 20));
            const qualityScore = cleaner.qualityScore;
            const reliabilityScore = cleaner.rating * 20;
            const workloadScore = cleaner.status === 'AVAILABLE' ? 100 : 50;

            const totalScore = (distanceScore * 0.3) + (qualityScore * 0.3) + (reliabilityScore * 0.2) + (workloadScore * 0.2);

            if (totalScore > highestScore) {
                highestScore = totalScore;
                bestCleaner = cleaner;
            }
        });

        return bestCleaner;
    }
};
