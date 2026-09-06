import { Corridor, Train, Requisition, BlockWindow, WhatIfScenario, AuditLogEntry, ControllerAlterationProposal } from '../types';

export const INITIAL_CORRIDORS: Corridor[] = [
  {
    id: 'ncr-hdn-1',
    name: 'Prayagraj – Kanpur – Tundla (NCR HDN-1)',
    zone: 'North Central Railway (NCR)',
    division: 'Prayagraj Division',
    routeLengthKm: 425,
    lines: 'Double Line',
    electrification: '25kV AC 50Hz OHE',
    signalingType: 'Automatic Block Signaling (ABS)',
    stations: [
      { id: 'st-1', code: 'PRYJ', name: 'Prayagraj Jn.', kmMarker: 820, loopTracks: 8, platforms: 10, isJunction: true },
      { id: 'st-2', code: 'FTP', name: 'Fatehpur', kmMarker: 938, loopTracks: 4, platforms: 4, isJunction: false },
      { id: 'st-3', code: 'CNB', name: 'Kanpur Central', kmMarker: 1014, loopTracks: 12, platforms: 10, isJunction: true },
      { id: 'st-4', code: 'ETW', name: 'Etawah Jn.', kmMarker: 1152, loopTracks: 5, platforms: 5, isJunction: true },
      { id: 'st-5', code: 'TDL', name: 'Tundla Jn.', kmMarker: 1245, loopTracks: 6, platforms: 6, isJunction: true }
    ]
  },
  {
    id: 'er-grand-chord',
    name: 'Howrah – Barddhaman – Asansol (ER Chord)',
    zone: 'Eastern Railway (ER)',
    division: 'Howrah & Asansol Divisions',
    routeLengthKm: 200,
    lines: 'Quadruple Line',
    electrification: '25kV AC 50Hz OHE',
    signalingType: 'Automatic Block Signaling (ABS)',
    stations: [
      { id: 'er-1', code: 'HWH', name: 'Howrah Jn.', kmMarker: 0, loopTracks: 14, platforms: 23, isJunction: true },
      { id: 'er-2', code: 'BWN', name: 'Barddhaman Jn.', kmMarker: 95, loopTracks: 8, platforms: 8, isJunction: true },
      { id: 'er-3', code: 'DGR', name: 'Durgapur', kmMarker: 158, loopTracks: 4, platforms: 5, isJunction: false },
      { id: 'er-4', code: 'ASN', name: 'Asansol Jn.', kmMarker: 200, loopTracks: 9, platforms: 7, isJunction: true }
    ]
  },
  {
    id: 'wr-mumbai-vadodara',
    name: 'Vadodara – Surat – Mumbai Central (WR Super HDN)',
    zone: 'Western Railway (WR)',
    division: 'Vadodara & Mumbai Central Divisions',
    routeLengthKm: 392,
    lines: 'Double Line',
    electrification: '25kV AC 50Hz OHE',
    signalingType: 'Automatic Block Signaling (ABS)',
    stations: [
      { id: 'wr-1', code: 'MMCT', name: 'Mumbai Central', kmMarker: 0, loopTracks: 10, platforms: 8, isJunction: true },
      { id: 'wr-2', code: 'VAPI', name: 'Vapi', kmMarker: 168, loopTracks: 3, platforms: 3, isJunction: false },
      { id: 'wr-3', code: 'ST', name: 'Surat', kmMarker: 263, loopTracks: 6, platforms: 4, isJunction: true },
      { id: 'wr-4', code: 'BH', name: 'Bharuch Jn.', kmMarker: 321, loopTracks: 4, platforms: 4, isJunction: true },
      { id: 'wr-5', code: 'BRC', name: 'Vadodara Jn.', kmMarker: 392, loopTracks: 8, platforms: 7, isJunction: true }
    ]
  }
];

// ==========================================
// 1. NCR HDN-1 CORRIDOR DATA (Prayagraj-Kanpur-Tundla)
// ==========================================
export const NCR_TRAINS: Train[] = [
  {
    id: 'tr-1',
    number: '22436',
    name: 'Vande Bharat Express (NDLS-PRYJ)',
    type: 'Vande Bharat',
    priorityTier: 1,
    direction: 'DOWN',
    origin: 'New Delhi (NDLS)',
    destination: 'Varanasi (BSB)',
    stops: [
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '08:10', scheduledDeparture: '08:12', isStopping: false },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '09:05', scheduledDeparture: '09:07', isStopping: false },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '10:10', scheduledDeparture: '10:15', isStopping: true, platform: 'PF-1' },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '11:08', scheduledDeparture: '11:10', isStopping: false },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '12:08', scheduledDeparture: '12:15', isStopping: true, platform: 'PF-6' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 125,
    routeColor: '#2563eb',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-2',
    number: '12301',
    name: 'Howrah Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Howrah (HWH)',
    destination: 'New Delhi (NDLS)',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '00:45', scheduledDeparture: '00:50', isStopping: true, platform: 'PF-1' },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '01:40', scheduledDeparture: '01:42', isStopping: false },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '02:35', scheduledDeparture: '02:40', isStopping: true, platform: 'PF-2' },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '03:45', scheduledDeparture: '03:47', isStopping: false },
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '04:50', scheduledDeparture: '04:52', isStopping: false }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 110,
    routeColor: '#dc2626',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-3',
    number: '12423',
    name: 'Dibrugarh Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Dibrugarh',
    destination: 'New Delhi',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '01:10', scheduledDeparture: '01:15', isStopping: true, platform: 'PF-2' },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '02:05', scheduledDeparture: '02:07', isStopping: false },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '03:00', scheduledDeparture: '03:05', isStopping: true, platform: 'PF-3' },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '04:10', scheduledDeparture: '04:12', isStopping: false },
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '05:15', scheduledDeparture: '05:17', isStopping: false }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 105,
    routeColor: '#ea580c',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-4',
    number: '12417',
    name: 'Prayagraj Express',
    type: 'Mail / Express',
    priorityTier: 2,
    direction: 'UP',
    origin: 'Prayagraj Jn.',
    destination: 'New Delhi',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '22:10', scheduledDeparture: '22:10', isStopping: true, platform: 'PF-1' },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '23:15', scheduledDeparture: '23:17', isStopping: true },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '00:25', scheduledDeparture: '00:30', isStopping: true, platform: 'PF-1' },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '02:15', scheduledDeparture: '02:17', isStopping: false },
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '03:40', scheduledDeparture: '03:42', isStopping: false }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 90,
    routeColor: '#16a34a',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-5',
    number: 'BOXN-9821',
    name: 'Coal Freight Rake (Chandauli to Dadri NTPC)',
    type: 'Freight (Coal Rake)',
    priorityTier: 4,
    direction: 'UP',
    origin: 'Mughalsarai Yard',
    destination: 'Dadri Power Plant',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '01:30', scheduledDeparture: '01:35', isStopping: false },
      { stationCode: 'FTP', stationName: 'Fatehpur (Loop)', scheduledArrival: '03:15', scheduledDeparture: '04:45', isStopping: true },
      { stationCode: 'CNB', stationName: 'Kanpur Goods Yard', scheduledArrival: '06:10', scheduledDeparture: '06:30', isStopping: true },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '08:45', scheduledDeparture: '08:50', isStopping: false },
      { stationCode: 'TDL', stationName: 'Tundla Yard', scheduledArrival: '10:50', scheduledDeparture: '11:00', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 55,
    routeColor: '#9333ea',
    currentStatus: 'On Time'
  }
];

export const NCR_BLOCKS: BlockWindow[] = [
  {
    id: 'blk-ncr-01',
    code: 'BLK-NCR-2025-001',
    title: 'Integrated Night Corridor Shadow Possession Window',
    corridorId: 'ncr-hdn-1',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur – Sirathu (Km 960–970)',
    startKm: 955,
    endKm: 970,
    lineType: 'UP MAIN',
    startTime: '01:30',
    endTime: '04:30',
    durationMinutes: 180,
    status: 'recommended',
    confidenceScore: 96,
    bundledRequisitions: [
      {
        id: 'req-ncr-1',
        code: 'TMS-NCR-2025-089',
        department: 'P-Way',
        subsystem: 'Track Tamping (CSM)',
        title: 'CSM 09-32 Heavy Track Tamping & Alignment',
        sectionId: 'sec-pryj-ftp',
        sectionName: 'Fatehpur – Sirathu Section',
        startKm: 955,
        endKm: 968,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 1,
        durationMinutes: 180,
        requiresPowerBlock: false,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: true,
        requiredResources: ['CSM Tamping Machine 09-32', 'P-Way Gang 12', 'Track Master (SSE/P-Way)'],
        sourceSystem: 'TMS',
        defectDetails: 'Track quality index (TQI) degraded to 34.2.',
        status: 'bundled',
        assignedBlockId: 'blk-ncr-01'
      },
      {
        id: 'req-ncr-2',
        code: 'TDMS-NCR-2025-044',
        department: 'TRD',
        subsystem: 'OHE Contact Wire Stagger Inspection',
        title: '25kV AC OHE Cantilever & Contact Wire Stagger Inspection',
        sectionId: 'sec-pryj-ftp',
        sectionName: 'Fatehpur – Sirathu Section',
        startKm: 955,
        endKm: 970,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 2,
        durationMinutes: 150,
        requiresPowerBlock: true,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: false,
        requiredResources: ['Tower Wagon TW-402', 'TRD Power Crew Unit 3'],
        sourceSystem: 'TDMS',
        defectDetails: 'Carbon pan wear detected on contact wire.',
        status: 'bundled',
        assignedBlockId: 'blk-ncr-01'
      }
    ],
    departmentsInvolved: ['P-Way', 'TRD', 'S&T'],
    metrics: {
      assetAvailabilityGainPercent: 28.5,
      possessionHoursSavedMinutes: 120,
      shadowBundleEfficiency: 94,
      passengerPunctualityImpactMinutes: 0,
      freightThroughputPreservedPercent: 96.5
    },
    safetyChecklist: {
      oheIsolated: true,
      earthDischarged: true,
      stMemoReceived: true,
      cautionOrderIssued: true,
      adjacentLineProtection: true
    },
    approvals: {
      pwayApproved: true,
      trdApproved: true,
      stApproved: true,
      chiefControllerApproved: false
    },
    punctualityImpact: {
      speedRestrictionsImposed: '30 km/h on DOWN Main adjacent line during heavy tamping',
      delayedTrainsCount: 0,
      regulatedTrains: [
        { trainNumber: 'BOXN-9821', trainName: 'Coal Freight Rake', delayMinutes: 45, station: 'Fatehpur Loop Track' }
      ]
    },
    algorithmNotes: 'Optimal CP-SAT solution utilizing 01:30–04:30 traffic trough between Howrah Rajdhani and early morning commuter services.'
  }
];

export const NCR_REQUISITIONS: Requisition[] = [
  {
    id: 'req-1',
    code: 'TMS-NCR-2025-089',
    department: 'P-Way',
    subsystem: 'Track Tamping (CSM)',
    title: 'CSM 09-32 Heavy Track Tamping & Alignment',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur – Sirathu Section',
    startKm: 955,
    endKm: 968,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 1,
    durationMinutes: 180,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['CSM Tamping Machine 09-32', 'P-Way Gang 12', 'Track Master (SSE/P-Way)'],
    sourceSystem: 'TMS',
    defectDetails: 'Track quality index (TQI) degraded to 34.2.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-2',
    code: 'TDMS-NCR-2025-044',
    department: 'TRD',
    subsystem: 'OHE Contact Wire Stagger Inspection',
    title: '25kV AC OHE Cantilever & Contact Wire Stagger Inspection',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur – Sirathu Section',
    startKm: 955,
    endKm: 970,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 2,
    durationMinutes: 150,
    requiresPowerBlock: true,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: false,
    requiredResources: ['Tower Wagon TW-402', 'TRD Power Crew Unit 3'],
    sourceSystem: 'TDMS',
    defectDetails: 'Carbon pan wear detected on contact wire.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-3',
    code: 'SMMS-NCR-2025-031',
    department: 'S&T',
    subsystem: 'Point Machine 104A Overhaul',
    title: 'Point Machine & Interlocking Circuit Testing',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Sirathu Interlocking Yard',
    startKm: 960,
    endKm: 962,
    track: 'UP MAIN',
    urgency: 'Medium',
    safetyPriority: 3,
    durationMinutes: 120,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['Signal Testing Engineer Gang', 'Electronic Multi-meter Kit'],
    sourceSystem: 'SMMS',
    defectDetails: 'Quarterly track circuit resistance check overdue.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  }
];

// ==========================================
// 2. ER CHORD CORRIDOR DATA (Howrah-Barddhaman-Asansol)
// ==========================================
export const ER_TRAINS: Train[] = [
  {
    id: 'er-tr-1',
    number: '22301',
    name: 'Howrah – NJP Vande Bharat Express',
    type: 'Vande Bharat',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Howrah (HWH)',
    destination: 'New Jalpaiguri (NJP)',
    stops: [
      { stationCode: 'HWH', stationName: 'Howrah Jn.', scheduledArrival: '05:55', scheduledDeparture: '05:55', isStopping: true, platform: 'PF-8' },
      { stationCode: 'BWN', stationName: 'Barddhaman Jn.', scheduledArrival: '07:00', scheduledDeparture: '07:02', isStopping: false },
      { stationCode: 'DGR', stationName: 'Durgapur', scheduledArrival: '07:48', scheduledDeparture: '07:50', isStopping: false },
      { stationCode: 'ASN', stationName: 'Asansol Jn.', scheduledArrival: '08:28', scheduledDeparture: '08:30', isStopping: true, platform: 'PF-3' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 120,
    routeColor: '#2563eb',
    currentStatus: 'On Time'
  },
  {
    id: 'er-tr-2',
    number: '12301',
    name: 'Howrah Rajdhani Express (via ASN)',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Howrah (HWH)',
    destination: 'New Delhi (NDLS)',
    stops: [
      { stationCode: 'HWH', stationName: 'Howrah Jn.', scheduledArrival: '16:50', scheduledDeparture: '16:50', isStopping: true, platform: 'PF-9' },
      { stationCode: 'BWN', stationName: 'Barddhaman Jn.', scheduledArrival: '17:58', scheduledDeparture: '18:00', isStopping: false },
      { stationCode: 'DGR', stationName: 'Durgapur', scheduledArrival: '18:52', scheduledDeparture: '18:54', isStopping: false },
      { stationCode: 'ASN', stationName: 'Asansol Jn.', scheduledArrival: '19:35', scheduledDeparture: '19:40', isStopping: true, platform: 'PF-2' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 110,
    routeColor: '#dc2626',
    currentStatus: 'On Time'
  },
  {
    id: 'er-tr-3',
    number: '12314',
    name: 'Sealdah Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'DOWN',
    origin: 'New Delhi (NDLS)',
    destination: 'Sealdah (SDAH)',
    stops: [
      { stationCode: 'ASN', stationName: 'Asansol Jn.', scheduledArrival: '06:20', scheduledDeparture: '06:25', isStopping: true, platform: 'PF-1' },
      { stationCode: 'DGR', stationName: 'Durgapur', scheduledArrival: '07:05', scheduledDeparture: '07:07', isStopping: false },
      { stationCode: 'BWN', stationName: 'Barddhaman Jn.', scheduledArrival: '08:00', scheduledDeparture: '08:02', isStopping: false },
      { stationCode: 'HWH', stationName: 'Howrah / SDAH', scheduledArrival: '10:10', scheduledDeparture: '10:10', isStopping: true, platform: 'PF-12' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 105,
    routeColor: '#ea580c',
    currentStatus: 'On Time'
  },
  {
    id: 'er-tr-4',
    number: 'BOXN-ER-5512',
    name: 'Raniganj Coal Rake to Kolaghat Thermal',
    type: 'Freight (Coal Rake)',
    priorityTier: 4,
    direction: 'DOWN',
    origin: 'Asansol Coalfield Yard',
    destination: 'Kolaghat Thermal Power',
    stops: [
      { stationCode: 'ASN', stationName: 'Asansol Yard', scheduledArrival: '00:30', scheduledDeparture: '00:35', isStopping: false },
      { stationCode: 'DGR', stationName: 'Durgapur (Loop)', scheduledArrival: '02:00', scheduledDeparture: '03:45', isStopping: true },
      { stationCode: 'BWN', stationName: 'Barddhaman Yard', scheduledArrival: '05:15', scheduledDeparture: '05:30', isStopping: true },
      { stationCode: 'HWH', stationName: 'Howrah Freight Link', scheduledArrival: '07:45', scheduledDeparture: '08:00', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 50,
    routeColor: '#9333ea',
    currentStatus: 'On Time'
  },
  {
    id: 'er-tr-5',
    number: '12303',
    name: 'Poorva Superfast Express',
    type: 'Mail / Express',
    priorityTier: 2,
    direction: 'UP',
    origin: 'Howrah (HWH)',
    destination: 'New Delhi',
    stops: [
      { stationCode: 'HWH', stationName: 'Howrah Jn.', scheduledArrival: '08:00', scheduledDeparture: '08:00', isStopping: true, platform: 'PF-9' },
      { stationCode: 'BWN', stationName: 'Barddhaman Jn.', scheduledArrival: '09:15', scheduledDeparture: '09:18', isStopping: true },
      { stationCode: 'DGR', stationName: 'Durgapur', scheduledArrival: '10:10', scheduledDeparture: '10:12', isStopping: true },
      { stationCode: 'ASN', stationName: 'Asansol Jn.', scheduledArrival: '10:55', scheduledDeparture: '11:00', isStopping: true, platform: 'PF-4' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 85,
    routeColor: '#16a34a',
    currentStatus: 'On Time'
  }
];

export const ER_BLOCKS: BlockWindow[] = [
  {
    id: 'blk-er-01',
    code: 'BLK-ER-2025-002',
    title: 'Barddhaman–Durgapur Quad Track Integrated Shadow Block',
    corridorId: 'er-grand-chord',
    sectionId: 'sec-bwn-dgr',
    sectionName: 'Barddhaman – Durgapur (Km 110–125)',
    startKm: 110,
    endKm: 125,
    lineType: 'UP MAIN',
    startTime: '01:00',
    endTime: '04:00',
    durationMinutes: 180,
    status: 'recommended',
    confidenceScore: 95,
    bundledRequisitions: [
      {
        id: 'req-er-1',
        code: 'TMS-ER-2025-401',
        department: 'P-Way',
        subsystem: 'Continuous Welded Rail (CWR) De-Stressing',
        title: 'Deep Screening & Track Relaying on UP Line',
        sectionId: 'sec-bwn-dgr',
        sectionName: 'Barddhaman – Durgapur Section',
        startKm: 110,
        endKm: 125,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 1,
        durationMinutes: 180,
        requiresPowerBlock: false,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: true,
        requiredResources: ['BCM Machine (Plasser)', 'Track Gang 8 (Asansol)'],
        sourceSystem: 'TMS',
        defectDetails: 'Ballast cushion fouled; deep screening urgently needed.',
        status: 'bundled',
        assignedBlockId: 'blk-er-01'
      },
      {
        id: 'req-er-2',
        code: 'TDMS-ER-2025-302',
        department: 'TRD',
        subsystem: '25kV AC OHE Contact Wire Renewal',
        title: 'OHE Section Isolator & Stagger Calibration',
        sectionId: 'sec-bwn-dgr',
        sectionName: 'Barddhaman – Durgapur Section',
        startKm: 110,
        endKm: 122,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 2,
        durationMinutes: 150,
        requiresPowerBlock: true,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: false,
        requiredResources: ['Tower Wagon TW-ER-12', 'Electrical Safety Gang'],
        sourceSystem: 'TDMS',
        defectDetails: 'Contact wire diameter reduced to 10.8mm.',
        status: 'bundled',
        assignedBlockId: 'blk-er-01'
      }
    ],
    departmentsInvolved: ['P-Way', 'TRD', 'S&T'],
    metrics: {
      assetAvailabilityGainPercent: 31.2,
      possessionHoursSavedMinutes: 140,
      shadowBundleEfficiency: 95,
      passengerPunctualityImpactMinutes: 0,
      freightThroughputPreservedPercent: 97.8
    },
    safetyChecklist: {
      oheIsolated: true,
      earthDischarged: true,
      stMemoReceived: true,
      cautionOrderIssued: true,
      adjacentLineProtection: true
    },
    approvals: {
      pwayApproved: true,
      trdApproved: true,
      stApproved: true,
      chiefControllerApproved: false
    },
    punctualityImpact: {
      speedRestrictionsImposed: '30 km/h caution order near Panagarh yard',
      delayedTrainsCount: 0,
      regulatedTrains: [
        { trainNumber: 'BOXN-ER-5512', trainName: 'Raniganj Coal Rake', delayMinutes: 40, station: 'Durgapur Loop' }
      ]
    },
    algorithmNotes: 'Leverages night trough on Eastern Railway Quadruple Line with zero interruption to Howrah Rajdhani.'
  }
];

export const ER_REQUISITIONS: Requisition[] = [
  {
    id: 'req-er-1',
    code: 'TMS-ER-2025-401',
    department: 'P-Way',
    subsystem: 'Continuous Welded Rail (CWR) De-Stressing',
    title: 'Deep Screening & Track Relaying on UP Line',
    sectionId: 'sec-bwn-dgr',
    sectionName: 'Barddhaman – Durgapur Section',
    startKm: 110,
    endKm: 125,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 1,
    durationMinutes: 180,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['BCM Machine (Plasser)', 'Track Gang 8 (Asansol)'],
    sourceSystem: 'TMS',
    defectDetails: 'Ballast cushion fouled; deep screening urgently needed.',
    status: 'bundled',
    assignedBlockId: 'blk-er-01'
  },
  {
    id: 'req-er-2',
    code: 'TDMS-ER-2025-302',
    department: 'TRD',
    subsystem: '25kV AC OHE Contact Wire Renewal',
    title: 'OHE Section Isolator & Stagger Calibration',
    sectionId: 'sec-bwn-dgr',
    sectionName: 'Barddhaman – Durgapur Section',
    startKm: 110,
    endKm: 122,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 2,
    durationMinutes: 150,
    requiresPowerBlock: true,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: false,
    requiredResources: ['Tower Wagon TW-ER-12', 'Electrical Safety Gang'],
    sourceSystem: 'TDMS',
    defectDetails: 'Contact wire diameter reduced to 10.8mm.',
    status: 'bundled',
    assignedBlockId: 'blk-er-01'
  }
];

// ==========================================
// 3. WR SUPER HDN CORRIDOR DATA (Mumbai-Surat-Vadodara)
// ==========================================
export const WR_TRAINS: Train[] = [
  {
    id: 'wr-tr-1',
    number: '20901',
    name: 'Mumbai Central – Gandhinagar Vande Bharat',
    type: 'Vande Bharat',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Mumbai Central (MMCT)',
    destination: 'Gandhinagar Capital (GNC)',
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', scheduledArrival: '06:00', scheduledDeparture: '06:00', isStopping: true, platform: 'PF-5' },
      { stationCode: 'VAPI', stationName: 'Vapi', scheduledArrival: '07:45', scheduledDeparture: '07:47', isStopping: false },
      { stationCode: 'ST', stationName: 'Surat', scheduledArrival: '08:35', scheduledDeparture: '08:38', isStopping: true, platform: 'PF-1' },
      { stationCode: 'BH', stationName: 'Bharuch Jn.', scheduledArrival: '09:15', scheduledDeparture: '09:17', isStopping: false },
      { stationCode: 'BRC', stationName: 'Vadodara Jn.', scheduledArrival: '09:55', scheduledDeparture: '10:00', isStopping: true, platform: 'PF-2' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 125,
    routeColor: '#2563eb',
    currentStatus: 'On Time'
  },
  {
    id: 'wr-tr-2',
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'UP',
    origin: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', scheduledArrival: '17:00', scheduledDeparture: '17:00', isStopping: true, platform: 'PF-1' },
      { stationCode: 'VAPI', stationName: 'Vapi', scheduledArrival: '18:35', scheduledDeparture: '18:37', isStopping: false },
      { stationCode: 'ST', stationName: 'Surat', scheduledArrival: '19:30', scheduledDeparture: '19:35', isStopping: true, platform: 'PF-1' },
      { stationCode: 'BH', stationName: 'Bharuch Jn.', scheduledArrival: '20:15', scheduledDeparture: '20:17', isStopping: false },
      { stationCode: 'BRC', stationName: 'Vadodara Jn.', scheduledArrival: '21:05', scheduledDeparture: '21:10', isStopping: true, platform: 'PF-2' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 115,
    routeColor: '#dc2626',
    currentStatus: 'On Time'
  },
  {
    id: 'wr-tr-3',
    number: '12952',
    name: 'NDLS – Mumbai Central Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    priorityTier: 1,
    direction: 'DOWN',
    origin: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    stops: [
      { stationCode: 'BRC', stationName: 'Vadodara Jn.', scheduledArrival: '03:15', scheduledDeparture: '03:20', isStopping: true, platform: 'PF-3' },
      { stationCode: 'BH', stationName: 'Bharuch Jn.', scheduledArrival: '03:55', scheduledDeparture: '03:57', isStopping: false },
      { stationCode: 'ST', stationName: 'Surat', scheduledArrival: '04:50', scheduledDeparture: '04:55', isStopping: true, platform: 'PF-3' },
      { stationCode: 'VAPI', stationName: 'Vapi', scheduledArrival: '05:55', scheduledDeparture: '05:57', isStopping: false },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', scheduledArrival: '08:35', scheduledDeparture: '08:35', isStopping: true, platform: 'PF-1' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 110,
    routeColor: '#ea580c',
    currentStatus: 'On Time'
  },
  {
    id: 'wr-tr-4',
    number: 'CONCOR-WR-9081',
    name: 'JNPT Port Container Freight Rake',
    type: 'Freight (Container)',
    priorityTier: 4,
    direction: 'UP',
    origin: 'JNPT Navi Mumbai',
    destination: 'Khatuwas Multi-Modal ICD',
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Goods Link', scheduledArrival: '00:15', scheduledDeparture: '00:20', isStopping: false },
      { stationCode: 'VAPI', stationName: 'Vapi Yard', scheduledArrival: '02:00', scheduledDeparture: '02:10', isStopping: false },
      { stationCode: 'ST', stationName: 'Surat (Siding)', scheduledArrival: '03:30', scheduledDeparture: '05:00', isStopping: true },
      { stationCode: 'BH', stationName: 'Bharuch Jn.', scheduledArrival: '06:15', scheduledDeparture: '06:20', isStopping: false },
      { stationCode: 'BRC', stationName: 'Vadodara Marshalling', scheduledArrival: '07:50', scheduledDeparture: '08:10', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 55,
    routeColor: '#9333ea',
    currentStatus: 'On Time'
  },
  {
    id: 'wr-tr-5',
    number: '12925',
    name: 'Paschim Superfast Express',
    type: 'Mail / Express',
    priorityTier: 2,
    direction: 'UP',
    origin: 'Mumbai Central (MMCT)',
    destination: 'Amritsar Jn.',
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', scheduledArrival: '11:25', scheduledDeparture: '11:25', isStopping: true, platform: 'PF-2' },
      { stationCode: 'VAPI', stationName: 'Vapi', scheduledArrival: '13:40', scheduledDeparture: '13:42', isStopping: true },
      { stationCode: 'ST', stationName: 'Surat', scheduledArrival: '14:45', scheduledDeparture: '14:50', isStopping: true, platform: 'PF-1' },
      { stationCode: 'BH', stationName: 'Bharuch Jn.', scheduledArrival: '15:35', scheduledDeparture: '15:37', isStopping: true },
      { stationCode: 'BRC', stationName: 'Vadodara Jn.', scheduledArrival: '16:25', scheduledDeparture: '16:30', isStopping: true, platform: 'PF-2' }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 85,
    routeColor: '#16a34a',
    currentStatus: 'On Time'
  }
];

export const WR_BLOCKS: BlockWindow[] = [
  {
    id: 'blk-wr-01',
    code: 'BLK-WR-2025-003',
    title: 'Surat–Bharuch High-Density Shadow Window',
    corridorId: 'wr-mumbai-vadodara',
    sectionId: 'sec-st-bh',
    sectionName: 'Surat – Bharuch Section (Km 280–295)',
    startKm: 280,
    endKm: 295,
    lineType: 'UP MAIN',
    startTime: '01:15',
    endTime: '04:15',
    durationMinutes: 180,
    status: 'recommended',
    confidenceScore: 97,
    bundledRequisitions: [
      {
        id: 'req-wr-1',
        code: 'TMS-WR-2025-501',
        department: 'P-Way',
        subsystem: 'Heavy Rail Grinding & Tamping',
        title: 'High-Speed Curve Rail Grinding & Track Alignment',
        sectionId: 'sec-st-bh',
        sectionName: 'Surat – Bharuch Section',
        startKm: 280,
        endKm: 295,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 1,
        durationMinutes: 180,
        requiresPowerBlock: false,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: true,
        requiredResources: ['Loramer Rail Grinder (RG-02)', 'P-Way Gang 4 (Surat)'],
        sourceSystem: 'TMS',
        defectDetails: 'Gauge corner cracking detected on 130 km/h section.',
        status: 'bundled',
        assignedBlockId: 'blk-wr-01'
      },
      {
        id: 'req-wr-2',
        code: 'TDMS-WR-2025-602',
        department: 'TRD',
        subsystem: 'OHE Pantograph Pan Testing',
        title: '25kV High-Speed OHE Tension & Isolator Overhaul',
        sectionId: 'sec-st-bh',
        sectionName: 'Surat – Bharuch Section',
        startKm: 280,
        endKm: 292,
        track: 'UP MAIN',
        urgency: 'High',
        safetyPriority: 2,
        durationMinutes: 150,
        requiresPowerBlock: true,
        requiresTrafficBlock: true,
        requiresDisconnectMemo: false,
        requiredResources: ['Tower Wagon TW-WR-09', 'TRD Power Crew Unit 2'],
        sourceSystem: 'TDMS',
        defectDetails: 'High-speed pantograph bounce measured at 85mm.',
        status: 'bundled',
        assignedBlockId: 'blk-wr-01'
      }
    ],
    departmentsInvolved: ['P-Way', 'TRD', 'S&T'],
    metrics: {
      assetAvailabilityGainPercent: 29.8,
      possessionHoursSavedMinutes: 135,
      shadowBundleEfficiency: 96,
      passengerPunctualityImpactMinutes: 0,
      freightThroughputPreservedPercent: 98.2
    },
    safetyChecklist: {
      oheIsolated: true,
      earthDischarged: true,
      stMemoReceived: true,
      cautionOrderIssued: true,
      adjacentLineProtection: true
    },
    approvals: {
      pwayApproved: true,
      trdApproved: true,
      stApproved: true,
      chiefControllerApproved: false
    },
    punctualityImpact: {
      speedRestrictionsImposed: '30 km/h on adjacent track during heavy grinding',
      delayedTrainsCount: 0,
      regulatedTrains: [
        { trainNumber: 'CONCOR-WR-9081', trainName: 'JNPT Port Container Rake', delayMinutes: 45, station: 'Surat Siding' }
      ]
    },
    algorithmNotes: 'Optimal CP-SAT solution utilizing Western Railway overnight freight trough between 01:15 and 04:15.'
  }
];

export const WR_REQUISITIONS: Requisition[] = [
  {
    id: 'req-wr-1',
    code: 'TMS-WR-2025-501',
    department: 'P-Way',
    subsystem: 'Heavy Rail Grinding & Tamping',
    title: 'High-Speed Curve Rail Grinding & Track Alignment',
    sectionId: 'sec-st-bh',
    sectionName: 'Surat – Bharuch Section',
    startKm: 280,
    endKm: 295,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 1,
    durationMinutes: 180,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['Loramer Rail Grinder (RG-02)', 'P-Way Gang 4 (Surat)'],
    sourceSystem: 'TMS',
    defectDetails: 'Gauge corner cracking detected on 130 km/h section.',
    status: 'bundled',
    assignedBlockId: 'blk-wr-01'
  },
  {
    id: 'req-wr-2',
    code: 'TDMS-WR-2025-602',
    department: 'TRD',
    subsystem: 'OHE Pantograph Pan Testing',
    title: '25kV High-Speed OHE Tension & Isolator Overhaul',
    sectionId: 'sec-st-bh',
    sectionName: 'Surat – Bharuch Section',
    startKm: 280,
    endKm: 292,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 2,
    durationMinutes: 150,
    requiresPowerBlock: true,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: false,
    requiredResources: ['Tower Wagon TW-WR-09', 'TRD Power Crew Unit 2'],
    sourceSystem: 'TDMS',
    defectDetails: 'High-speed pantograph bounce measured at 85mm.',
    status: 'bundled',
    assignedBlockId: 'blk-wr-01'
  }
];

// Master Corridor Map Lookup
export const CORRIDOR_TRAINS: Record<string, Train[]> = {
  'ncr-hdn-1': NCR_TRAINS,
  'er-grand-chord': ER_TRAINS,
  'wr-mumbai-vadodara': WR_TRAINS
};

export const CORRIDOR_BLOCKS: Record<string, BlockWindow[]> = {
  'ncr-hdn-1': NCR_BLOCKS,
  'er-grand-chord': ER_BLOCKS,
  'wr-mumbai-vadodara': WR_BLOCKS
};

export const CORRIDOR_REQUISITIONS: Record<string, Requisition[]> = {
  'ncr-hdn-1': NCR_REQUISITIONS,
  'er-grand-chord': ER_REQUISITIONS,
  'wr-mumbai-vadodara': WR_REQUISITIONS
};

export const INITIAL_TRAINS = NCR_TRAINS;
export const INITIAL_BLOCKS = NCR_BLOCKS;
export const INITIAL_REQUISITIONS = NCR_REQUISITIONS;

export const INITIAL_WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'sc-1',
    title: 'Superfast Express 12301 Delayed (+45 Mins)',
    description: 'Howrah Rajdhani runs 45 minutes late upstream due to fog/signal delay near Pt. Deen Dayal Upadhyaya Jn.',
    type: 'train_delay',
    severity: 'High',
    triggerDetails: {
      trainNumber: '12301',
      delayMinutes: 45,
      cause: 'Dense fog speed restriction in upstream division'
    },
    impactSummary: 'Train 12301 passing time shifted from 01:40 to 02:25. DIRECT CONFLICT with proposed maintenance block BLK-NCR-2025-001 (01:30 - 04:30).',
    isApplied: false
  },
  {
    id: 'sc-2',
    title: 'Emergency Rail Fracture at Km 962.4',
    description: 'Acoustic track sensor detects rail flaw on DOWN line requiring immediate 90-minute emergency clamp possession.',
    type: 'rail_fracture',
    severity: 'Critical',
    triggerDetails: {
      sectionId: 'sec-pryj-ftp',
      kmMarker: 962.4,
      track: 'DOWN MAIN',
      requiredPossessionMinutes: 90
    },
    impactSummary: 'Immediate emergency possession needed. Cascading regulation of Train 22436 and freight trains.',
    isApplied: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '22:15:30 IST',
    user: 'AI Solver (CP-SAT v9.8)',
    action: 'Integrated Shadow Block Generated',
    category: 'OPTIMIZATION',
    details: 'Bundled TMS (Track Tamping) + TDMS (25kV OHE) + SMMS (Point Overhaul) into single 180-min shadow window.',
    blockId: 'blk-ncr-01'
  }
];

export const INITIAL_PROPOSALS: ControllerAlterationProposal[] = [
  {
    id: 'prop-001',
    proposalCode: 'PR-NCR-2026-089',
    proposingUnit: 'Sirathu Station Master Unit (SRO)',
    proposingOfficer: 'R. K. Sharma (Station Master)',
    proposingRole: 'Station Master / Field Operations Unit',
    reasonType: 'Track Defect / Rail Grinding Emergency',
    title: 'Emergency Shift of Night Maintenance Block BLK-NCR-2025-001',
    description: 'Sirathu SSE reported urgent Ultrasonic Flaw Detection (USFD) weld defect at Km 964.5 requiring 45-minute start shift to clear late-running Rajdhani Express.',
    corridorId: 'ncr-hdn-1',
    targetSection: 'Fatehpur – Sirathu (Km 955–970)',
    targetLine: 'UP MAIN',
    requestedShiftMinutes: 45,
    urgency: 'High',
    createdAt: '01:15 IST',
    status: 'pending_consensus',
    aiOptions: [
      {
        id: 'opt-1',
        title: 'Option 1: 45-Min Shift Window (Recommended)',
        strategyBadge: 'Zero Passenger Conflict',
        description: 'Shifts Block Window from 01:30–04:30 to 02:15–05:15. Gives delayed Rajdhani 12301 right of way.',
        revisedBlockWindow: {
          blockId: 'blk-ncr-01',
          code: 'BLK-NCR-2025-001',
          newStartTime: '02:15',
          newEndTime: '05:15',
          durationMinutes: 180,
          sectionName: 'Fatehpur – Sirathu (Km 955–970)',
          lineType: 'UP MAIN'
        },
        trainImpacts: [
          { trainNumber: '12301', trainName: 'Howrah Rajdhani', action: 'Clear with Right of Way', delayMinutes: 0 },
          { trainNumber: 'BOXN-9821', trainName: 'Coal Freight Rake', action: 'Regulate at Siding', delayMinutes: 30, regulatedStation: 'Fatehpur Loop' }
        ],
        metrics: {
          punctualityIndex: 98.5,
          avgDelayMinutes: 4.2,
          possessionTimeSavedMinutes: 120,
          safetyComplianceScore: 100,
          throughputPreservedPercent: 96.2
        },
        recommended: true
      }
    ],
    selectedOptionId: 'opt-1',
    concernedStations: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', role: 'Originating Junction Dispatcher', status: 'approved', remarks: 'Approved. Line clear synchronized.' },
      { stationCode: 'SRO', stationName: 'Sirathu', role: 'Field Block Station Master', status: 'approved', remarks: 'Site team ready.' },
      { stationCode: 'FTP', stationName: 'Fatehpur', role: 'Adjacent Control Station Master', status: 'pending' },
      { stationCode: 'CNB', stationName: 'Kanpur Central', role: 'Downstream Terminal Controller', status: 'pending' }
    ]
  }
];
