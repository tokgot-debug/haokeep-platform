/**
 * CleanPulse (HaoKeep) — Global Data Store & Domain Model
 */
window.HaoKeepStore = {
    // Current Global Context
    context: {
        persona: 'landing', // landing | housekeeper | owner | agency | finance | admin
        market: 'KE',           // KE | US | UK | NG | ZA
        currency: 'KES',        // KES | USD | EUR | GBP
        language: 'en',         // en | sw
        isOnline: true,
        operatingModel: 'MODEL_A', // MODEL_A (Direct) | MODEL_B (Agency) | MODEL_C (Marketplace)
        currentCleanerId: 'CLN-003'
    },

    // Units / Properties
    units: [
        {
            id: 'UNIT-101',
            name: 'Kilimani Heights #4B',
            address: 'Kindaruma Road, Kilimani, Nairobi',
            coordinates: { lat: -1.2921, lng: 36.7845 },
            owner: 'Wanjiku Investments Ltd',
            ownerPhone: '+254712345678',
            type: '2BR Apartment',
            status: 'DIRTY', // CLEAN | DIRTY | IN_PROGRESS | AT_RISK | OCCUPIED
            turnoverTime: '11:00 - 15:00',
            iCalUrl: 'https://airbnb.com/calendar/ical/101.ics',
            lockboxCode: '4921',
            accessInstructions: 'Gate code #0412. Key box on right side of front door.',
            referencePhotos: {
                livingRoom: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
                bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
                bathroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
            },
            parLevels: {
                duvetCoverKing: 2,
                fittedSheetKing: 2,
                pillowcases: 4,
                bathTowels: 4,
                toiletPaper: 6,
                shampooBottles: 4
            }
        },
        {
            id: 'UNIT-102',
            name: 'Nyali Ocean Breeze Penthouse',
            address: 'Links Road, Nyali, Mombasa',
            coordinates: { lat: -4.0321, lng: 39.6912 },
            owner: 'Mombasa Luxury Stays',
            ownerPhone: '+254722998877',
            type: '3BR Villa',
            status: 'CLEAN',
            turnoverTime: '10:00 - 14:00',
            iCalUrl: 'https://booking.com/ical/102.ics',
            lockboxCode: '8812',
            accessInstructions: 'Main security desk tag #12.',
            referencePhotos: {
                livingRoom: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
                bedroom: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
                bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80'
            },
            parLevels: {
                duvetCoverKing: 3,
                fittedSheetKing: 3,
                pillowcases: 6,
                bathTowels: 6,
                toiletPaper: 8,
                shampooBottles: 6
            }
        },
        {
            id: 'UNIT-103',
            name: 'Westlands Urban Studio 12A',
            address: 'Westlands Road, Nairobi',
            coordinates: { lat: -1.2678, lng: 36.8042 },
            owner: 'Capital Homes Kenya',
            ownerPhone: '+254733112233',
            type: 'Studio',
            status: 'IN_PROGRESS',
            turnoverTime: '12:00 - 14:00',
            iCalUrl: 'https://vrbo.com/ical/103.ics',
            lockboxCode: '1092',
            accessInstructions: 'Smart lock keypad #1092.',
            referencePhotos: {},
            parLevels: { duvetCoverKing: 1, fittedSheetKing: 1, pillowcases: 2, bathTowels: 2, toiletPaper: 4, shampooBottles: 2 }
        }
    ],

    // Cleaners / Field Staff
    cleaners: [
        {
            id: 'CLN-001',
            name: 'Achieng Mary',
            phone: '+254711987654',
            mpesaNumber: '254711987654',
            rating: 4.9,
            totalJobs: 142,
            qualityScore: 98,
            currentLocation: { lat: -1.2915, lng: 36.7839 },
            status: 'ACTIVE_JOB',
            assignedTerritory: 'Nairobi West / Kilimani'
        },
        {
            id: 'CLN-002',
            name: 'Kipchumba David',
            phone: '+254722554433',
            mpesaNumber: '254722554433',
            rating: 4.8,
            totalJobs: 89,
            qualityScore: 95,
            currentLocation: { lat: -1.2690, lng: 36.8050 },
            status: 'AVAILABLE',
            assignedTerritory: 'Nairobi Central / Westlands'
        },
        {
            id: 'CLN-003',
            name: 'Guardian Angel',
            phone: '+254700778899',
            mpesaNumber: '254700778899',
            rating: 5.0,
            totalJobs: 34,
            qualityScore: 99,
            currentLocation: { lat: -1.2850, lng: 36.8200 },
            status: 'AVAILABLE',
            assignedTerritory: 'Nairobi West / Kilimani'
        }
    ],

    // Active & Past Jobs
    jobs: [
        {
            id: 'JOB-2026-001',
            unitId: 'UNIT-101',
            unitName: 'Kilimani Heights #4B',
            cleanerId: 'CLN-003',
            cleanerName: 'Guardian Angel',
            scheduledDate: '2026-09-04',
            windowStart: '11:00',
            windowEnd: '15:00',
            payoutAmount: 2500, // in KES
            status: 'CHECKED_IN', // ASSIGNED | CHECKED_IN | IN_PROGRESS | COMPLETED | VERIFIED
            geofenceVerified: true,
            checkInTime: '2026-09-04T11:15:00Z',
            checkOutTime: null,
            checklist: [
                { room: 'Living Room', task: 'Make sofa bed & fluff cushions', photoRequired: true, completed: true, photoUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80', aiScore: 96 },
                { room: 'Master Bedroom', task: 'Change linen & hotel hospital corners', photoRequired: true, completed: false, photoUrl: null, aiScore: null },
                { room: 'Bathroom', task: 'Disinfect tiles & restock amenities', photoRequired: true, completed: false, photoUrl: null, aiScore: null },
                { room: 'Kitchen', task: 'Empty fridge & sanitize countertops', photoRequired: false, completed: true, photoUrl: null, aiScore: null }
            ],
            linenInventory: { duvetCoverKing: 1, fittedSheetKing: 1, pillowcases: 2, bathTowels: 2 },
            damagesReported: []
        }
    ],

    // Double-Entry Financial Ledger
    ledger: [
        { id: 'TX-1001', timestamp: '2026-09-04T10:00:00Z', description: 'Escrow Booking Deposit - UNIT-101', debitAccount: '1010 Escrow Cash (M-Pesa)', creditAccount: '2010 Unearned Revenue', amount: 3500, currency: 'KES', ref: 'MPESA-QK91238' },
        { id: 'TX-1002', timestamp: '2026-09-04T11:15:00Z', description: 'Turnover Service Fee Accrual - JOB-2026-001', debitAccount: '1200 Accounts Receivable', creditAccount: '4010 Platform Turnover Revenue', amount: 3500, currency: 'KES', ref: 'JOB-2026-001' }
    ],

    // KRA eTIMS Tax Invoices
    etimsInvoices: [
        {
            invoiceNum: 'CU-INV-2026-0089',
            cuSerial: 'KRA009182391',
            dateTime: '2026-09-04 11:20:15',
            customerName: 'Wanjiku Investments Ltd',
            customerPIN: 'A019283746Z',
            totalAmount: 3500,
            vatAmount: 482.76, // 16% VAT inclusive
            whtAmount: 125.00, // 5% WHT
            status: 'TRANSMITTED',
            qrCodeData: 'https://itax.kra.go.ke/KRA-Portal/qrVerification.htm?inv=CU-INV-2026-0089&pin=A019283746Z'
        }
    ],

    // Job-Anchored Chat & Voice Messaging Thread
    messages: [
        {
            id: 'MSG-001',
            jobId: 'JOB-2026-001',
            senderRole: 'owner',
            senderName: 'Wanjiku (Host)',
            text: 'Hello Mary! Please ensure extra bath towels are placed in the master suite.',
            audioUrl: null,
            timestamp: '11:20 AM',
            translatedText: null
        },
        {
            id: 'MSG-002',
            jobId: 'JOB-2026-001',
            senderRole: 'housekeeper',
            senderName: 'Achieng Mary',
            text: 'Sawa kabisa mama, nitazihifadhi zote tano kwa mto.',
            audioUrl: 'simulated_voice_note.mp3',
            timestamp: '11:22 AM',
            translatedText: 'Understood ma\'am, I will store all five by the cushion.'
        }
    ],

    // Audit Log Hash Chain
    auditLog: [
        { index: 1, timestamp: '2026-09-04T08:00:00Z', actor: 'SYSTEM', event: 'iCal Sync: Auto-created Turnover JOB-2026-001', prevHash: '0000000000000000', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        { index: 2, timestamp: '2026-09-04T11:15:00Z', actor: 'CLN-001 (Achieng Mary)', event: 'Geofenced Check-In at Kilimani Heights #4B (Distance: 12m)', prevHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069' }
    ],

    // Lost & Found Items Log
    lostAndFound: [
        {
            id: 'LF-101',
            unitName: 'Kilimani Heights #4B',
            cleanerName: 'Achieng Mary',
            itemName: 'Apple MacBook Pro Charger & AirPods Case',
            locationFound: 'Master Suite Nightstand',
            timestamp: '2026-09-04 11:30 AM',
            status: 'REPORTED', // REPORTED | HOST_NOTIFIED | RETURNED
            photoUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=400&q=80'
        }
    ],

    // Damage & Maintenance Incidents
    incidents: [
        {
            id: 'INC-201',
            unitName: 'Kilimani Heights #4B',
            cleanerName: 'Achieng Mary',
            severity: 'URGENT', // MINOR | URGENT | CRITICAL
            title: 'Stained Master Suite Rug & Cracked Mirror',
            estimatedCost: 14500,
            status: 'OPEN', // OPEN | CLAIM_FILED | RESOLVED
            timestamp: '2026-09-04 11:35 AM',
            photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
        }
    ],

    // Linen & Par Supply Replenishment Requests
    parRequests: [
        {
            id: 'REQ-301',
            unitName: 'Kilimani Heights #4B',
            requestedBy: 'Achieng Mary',
            item: 'King Duvet Covers & Bath Towels',
            quantity: 4,
            urgency: 'HIGH',
            status: 'DISPATCHED', // PENDING | DISPATCHED | DELIVERED
            timestamp: '2026-09-04 11:40 AM'
        }
    ],

    // Real-Time System & WhatsApp Alerts Store
    notifications: [
        {
            id: 'NOTIF-001',
            type: 'DISPATCH',
            title: '📅 New iCal Turnover Dispatched',
            message: 'Kilimani Heights #4B assigned to cleaner Achieng Mary for 11:00 AM window.',
            timestamp: '11:00 AM',
            unread: true
        },
        {
            id: 'NOTIF-002',
            type: 'GEOFENCE',
            title: '📍 GPS Location Verified',
            message: 'Cleaner checked in within 12m radius pin of property.',
            timestamp: '11:15 AM',
            unread: true
        },
        {
            id: 'NOTIF-003',
            type: 'PAYMENT',
            title: '🟢 M-Pesa Payout Auto-Triggered',
            message: 'KSh 3,500 disbursed via B2C to Achieng Mary upon job completion.',
            timestamp: '11:25 AM',
            unread: false
        }
    ],

    // Consumables & Amenities Inventory Store
    inventory: [
        { id: 'INV-101', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', category: 'Bathroom', name: 'Luxury Toilet Paper Rolls', currentCount: 4, minThreshold: 6, unit: 'rolls', lastRestocked: '2026-09-01' },
        { id: 'INV-102', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', category: 'Kitchen', name: 'Nespresso Coffee Pods', currentCount: 3, minThreshold: 10, unit: 'pods', lastRestocked: '2026-09-02' },
        { id: 'INV-103', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', category: 'Bathroom', name: 'Organic Body Wash & Shampoo', currentCount: 2, minThreshold: 4, unit: 'bottles', lastRestocked: '2026-08-28' },
        { id: 'INV-104', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', category: 'Kitchen', name: 'Welcome Wine & Water Bottles', currentCount: 1, minThreshold: 2, unit: 'bottles', lastRestocked: '2026-09-03' },
        { id: 'INV-105', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', category: 'General', name: 'Heavy-Duty Trash Bags', currentCount: 5, minThreshold: 8, unit: 'bags', lastRestocked: '2026-09-01' }
    ],

    // Housekeeper Digital Tip Jar Ledger
    tips: [
        { id: 'TIP-901', cleanerId: 'CLN-001', cleanerName: 'Achieng Mary', amount: 500, currency: 'KES', hostName: 'Wanjiku (Host)', unitName: 'Kilimani Heights #4B', message: 'Outstanding work on the sofa bed!', timestamp: '2026-09-04 11:30 AM' },
        { id: 'TIP-902', cleanerId: 'CLN-001', cleanerName: 'Achieng Mary', amount: 1000, currency: 'KES', hostName: 'Guest Check-In', unitName: 'Nyali Ocean Breeze', message: 'Spotless bathroom & early check-in ready!', timestamp: '2026-09-03 04:15 PM' }
    ],

    // OTA iCal Calendar Sync Feeds
    iCalFeeds: [
        { id: 'FEED-01', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', platform: 'Airbnb', url: 'https://www.airbnb.com/calendar/ical/101.ics', status: 'ACTIVE', lastSync: '2 mins ago', autoDispatch: true },
        { id: 'FEED-02', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', platform: 'VRBO', url: 'https://www.vrbo.com/ical/101.ics', status: 'ACTIVE', lastSync: '5 mins ago', autoDispatch: true },
        { id: 'FEED-03', unitId: 'UNIT-102', unitName: 'Nyali Ocean Breeze Penthouse', platform: 'Booking.com', url: 'https://admin.booking.com/ical/102.ics', status: 'ACTIVE', lastSync: '10 mins ago', autoDispatch: false }
    ],

    // Cleaner Performance & Leaderboard Metrics
    cleanerLeaderboard: [
        { rank: 1, cleanerId: 'CLN-001', name: 'Achieng Mary', qualityScore: 98, jobsCompleted: 142, damageDiligence: '100%', tipsEarned: 8500, badge: '👑 Master Housekeeper' },
        { rank: 2, cleanerId: 'CLN-002', name: 'Kipchumba David', qualityScore: 95, jobsCompleted: 89, damageDiligence: '96%', tipsEarned: 4200, badge: '⚡ Speed Specialist' }
    ],

    // FX Conversion Rates (Base: KES)
    fxRates: { KES: 1, USD: 0.0077, EUR: 0.0070, GBP: 0.0060 },
    currencySymbols: { KES: 'KSh ', USD: '$', EUR: '€', GBP: '£' },

    // Maintenance Work Orders Store
    workOrders: [
        { id: 'WO-501', unitId: 'UNIT-101', unitName: 'Kilimani Heights #4B', title: 'Fix Leaking Master Sink Pipe', severity: 'URGENT', estimatedCost: 4500, assignedHandyman: 'Juma Plumbing Services', status: 'IN_PROGRESS', timestamp: '2026-09-04 11:35 AM' },
        { id: 'WO-502', unitId: 'UNIT-102', unitName: 'Nyali Ocean Breeze Penthouse', title: 'Replace Balcony Sliding Door Latch', severity: 'MINOR', estimatedCost: 2800, assignedHandyman: 'Coast Glass & Locks Ltd', status: 'OPEN', timestamp: '2026-09-03 02:10 PM' }
    ]
};
