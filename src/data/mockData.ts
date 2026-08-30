import { Corridor, Train, Requisition, BlockWindow, WhatIfScenario, AuditLogEntry } from '../types';

export const INITIAL_CORRIDORS: Corridor[] = [
  {
    id: 'ncr-hdn-1',
    name: 'Prayagraj – Kanpur – Tundla (NCR HDN-1)',
    zone: 'North Central Railway (NCR)',
    division: 'Prayagraj Division',
    routeLengthKm: 280,
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
    routeLengthKm: 390,
    lines: 'Double Line',
    electrification: '25kV AC 50Hz OHE',
    signalingType: 'Automatic Block Signaling (ABS)',
    stations: [
      { id: 'wr-1', code: 'BRC', name: 'Vadodara Jn.', kmMarker: 392, loopTracks: 8, platforms: 7, isJunction: true },
      { id: 'wr-2', code: 'BH', name: 'Bharuch Jn.', kmMarker: 321, loopTracks: 4, platforms: 4, isJunction: true },
      { id: 'wr-3', code: 'ST', name: 'Surat', kmMarker: 263, loopTracks: 6, platforms: 4, isJunction: true },
      { id: 'wr-4', code: 'VAPI', name: 'Vapi', kmMarker: 168, loopTracks: 3, platforms: 3, isJunction: false },
      { id: 'wr-5', code: 'MMCT', name: 'Mumbai Central', kmMarker: 0, loopTracks: 10, platforms: 8, isJunction: true }
    ]
  }
];

export const INITIAL_TRAINS: Train[] = [
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
    routeColor: '#3b82f6',
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
    routeColor: '#ef4444',
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
    routeColor: '#f97316',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-4',
    number: '12801',
    name: 'Purushottam Superfast Express',
    type: 'Mail / Express',
    priorityTier: 2,
    direction: 'UP',
    origin: 'Puri (PURI)',
    destination: 'New Delhi (NDLS)',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '19:20', scheduledDeparture: '19:30', isStopping: true, platform: 'PF-4' },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '20:38', scheduledDeparture: '20:40', isStopping: true, platform: 'PF-3' },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '21:55', scheduledDeparture: '22:05', isStopping: true, platform: 'PF-1' },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '23:30', scheduledDeparture: '23:32', isStopping: true, platform: 'PF-2' },
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '01:00', scheduledDeparture: '01:05', isStopping: false }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 80,
    routeColor: '#10b981',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-5',
    number: 'BOXN-9821',
    name: 'Coal Freight Rake (Singrauli - Dadri Thermal)',
    type: 'Freight (Coal Rake)',
    priorityTier: 4,
    direction: 'UP',
    origin: 'Singrauli Coalfields',
    destination: 'NTPC Dadri Plant',
    stops: [
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '01:30', scheduledDeparture: '01:35', isStopping: false },
      { stationCode: 'FTP', stationName: 'Fatehpur (Loop)', scheduledArrival: '03:15', scheduledDeparture: '04:45', isStopping: true },
      { stationCode: 'CNB', stationName: 'Kanpur Goods Yard', scheduledArrival: '06:10', scheduledDeparture: '06:30', isStopping: true },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '08:45', scheduledDeparture: '08:50', isStopping: false },
      { stationCode: 'TDL', stationName: 'Tundla Yard', scheduledArrival: '10:50', scheduledDeparture: '11:00', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 55,
    routeColor: '#8b5cf6',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-6',
    number: 'CONCOR-771',
    name: 'Container Rake (JNPT - Tuglakabad ICD)',
    type: 'Freight (Container)',
    priorityTier: 4,
    direction: 'DOWN',
    origin: 'ICD Dadri',
    destination: 'Kolkata Port',
    stops: [
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '02:00', scheduledDeparture: '02:05', isStopping: false },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '03:40', scheduledDeparture: '03:45', isStopping: false },
      { stationCode: 'CNB', stationName: 'Kanpur Goods', scheduledArrival: '05:30', scheduledDeparture: '06:00', isStopping: true },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '07:45', scheduledDeparture: '07:50', isStopping: false },
      { stationCode: 'PRYJ', stationName: 'Prayagraj', scheduledArrival: '09:30', scheduledDeparture: '09:40', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 60,
    routeColor: '#ec4899',
    currentStatus: 'On Time'
  },
  {
    id: 'tr-7',
    number: '12555',
    name: 'Gorakhdham Superfast Express',
    type: 'Mail / Express',
    priorityTier: 2,
    direction: 'DOWN',
    origin: 'Hisar',
    destination: 'Gorakhpur',
    stops: [
      { stationCode: 'TDL', stationName: 'Tundla', scheduledArrival: '00:15', scheduledDeparture: '00:20', isStopping: false },
      { stationCode: 'ETW', stationName: 'Etawah', scheduledArrival: '01:25', scheduledDeparture: '01:30', isStopping: true },
      { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '02:55', scheduledDeparture: '03:05', isStopping: true },
      { stationCode: 'FTP', stationName: 'Fatehpur', scheduledArrival: '04:15', scheduledDeparture: '04:17', isStopping: false },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn.', scheduledArrival: '05:40', scheduledDeparture: '05:45', isStopping: true }
    ],
    currentDelayMinutes: 0,
    averageSpeedKmH: 85,
    routeColor: '#eab308',
    currentStatus: 'On Time'
  }
];

export const INITIAL_REQUISITIONS: Requisition[] = [
  // Engineering (P-Way)
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
    requiredResources: ['CSM Tamping Machine 09-32', 'P-Way Gang 12 (16 crew)', 'Track Master (SSE/P-Way)'],
    sourceSystem: 'TMS',
    defectDetails: 'Track quality index (TQI) degraded to 34.2 (Threshold: 36). Urgent tamping required.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-2',
    code: 'TMS-NCR-2025-092',
    department: 'P-Way',
    subsystem: 'USFD Rail Flaw Inspection',
    title: 'Ultrasonic Flaw Detection (USFD) & Rail Weld Testing',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur – Sirathu Section',
    startKm: 958,
    endKm: 965,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 2,
    durationMinutes: 120,
    requiresPowerBlock: false,
    requiresTrafficBlock: false,
    requiresDisconnectMemo: false,
    requiredResources: ['Digital USFD Trolley Tester (DRT-04)', 'USFD Certified Inspector'],
    sourceSystem: 'TMS',
    defectDetails: 'Periodic USFD test overdue on 60kg 90UTS welded joints.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-3',
    code: 'TMS-NCR-2025-104',
    department: 'P-Way',
    subsystem: 'Ballast Cleaning (BCM)',
    title: 'BCM Ballast Screening & Deep Cushioning',
    sectionId: 'sec-cnb-etw',
    sectionName: 'Kanpur – Rura Section',
    startKm: 1040,
    endKm: 1048,
    track: 'DOWN MAIN',
    urgency: 'Medium',
    safetyPriority: 3,
    durationMinutes: 240,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['BCM Machine 08-32', 'Hopper Rake (20 Wagons)', 'SSE P-Way Unit'],
    sourceSystem: 'TMS',
    defectDetails: 'Ballast caking and drainage choked at Km 1044/12.',
    status: 'pending'
  },

  // Electrical Traction (TRD - OHE)
  {
    id: 'req-4',
    code: 'TDMS-NCR-2025-044',
    department: 'TRD',
    subsystem: 'OHE Contact Wire Stagger & Height Check',
    title: 'OHE Contact Wire Stagger & Height Inspection via Tower Wagon',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur – Sirathu Section',
    startKm: 955,
    endKm: 968,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 1,
    durationMinutes: 180,
    requiresPowerBlock: true,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: false,
    requiredResources: ['8-Wheeler TRD Tower Wagon (TW-402)', 'TRD Gang 06', 'Discharge Rod Earthing Kits (4 Nos)'],
    sourceSystem: 'TDMS',
    defectDetails: 'Contact wire diameter reduced to 11.2mm; section insulator alignment required.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-5',
    code: 'TDMS-NCR-2025-051',
    department: 'TRD',
    subsystem: 'OHE Neutral Section Overhaul',
    title: 'PTFE Type Short Neutral Section Overhaul & Isolator Servicing',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur Substation Area',
    startKm: 960,
    endKm: 962,
    track: 'UP MAIN',
    urgency: 'Medium',
    safetyPriority: 3,
    durationMinutes: 150,
    requiresPowerBlock: true,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: false,
    requiredResources: ['TRD Line Truck', 'OHE Inspector Team'],
    sourceSystem: 'TDMS',
    defectDetails: 'Isolator blade burn marks observed during thermal imaging scan.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },

  // Signal & Telecommunication (S&T)
  {
    id: 'req-6',
    code: 'SMMS-NCR-2025-078',
    department: 'S&T',
    subsystem: 'Point Machine Overhaul',
    title: 'Point Machine 104A Overhaul & Ground Connection Testing',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur Interlocking Yard',
    startKm: 956,
    endKm: 957,
    track: 'UP MAIN',
    urgency: 'High',
    safetyPriority: 1,
    durationMinutes: 120,
    requiresPowerBlock: false,
    requiresTrafficBlock: true,
    requiresDisconnectMemo: true,
    requiredResources: ['Point Maintenance Kit', 'Signal Maintainer Gang', 'JE/Signal'],
    sourceSystem: 'SMMS',
    defectDetails: 'Operating current fluctuating between 3.8A to 5.2A. Motor commutator brush replacement.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-7',
    code: 'SMMS-NCR-2025-083',
    department: 'S&T',
    subsystem: 'Digital Axle Counter (DAC) Calibration',
    title: 'High Availability Dual Axle Counter (HA-SSDAC) Validation',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Sirathu – Fatehpur Block Section',
    startKm: 962,
    endKm: 968,
    track: 'UP MAIN',
    urgency: 'Medium',
    safetyPriority: 3,
    durationMinutes: 90,
    requiresPowerBlock: false,
    requiresTrafficBlock: false,
    requiresDisconnectMemo: true,
    requiredResources: ['DAC Diagnostic Terminal', 'Signal Telecom Supervisor'],
    sourceSystem: 'SMMS',
    defectDetails: 'Transient wheel sensor jitter logged during heavy freight passage.',
    status: 'bundled',
    assignedBlockId: 'blk-ncr-01'
  },
  {
    id: 'req-8',
    code: 'SMMS-NCR-2025-095',
    department: 'S&T',
    subsystem: 'Electronic Interlocking (EI) Health Check',
    title: 'Kyosan Electronic Interlocking VDU & Standby Processor Switchover Test',
    sectionId: 'sec-cnb-etw',
    sectionName: 'Rura Station Yard',
    startKm: 1052,
    endKm: 1053,
    track: 'BOTH LINES',
    urgency: 'Low',
    safetyPriority: 4,
    durationMinutes: 90,
    requiresPowerBlock: false,
    requiresTrafficBlock: false,
    requiresDisconnectMemo: true,
    requiredResources: ['OEM Interlocking Specialist', 'SSE/Signal/CNB'],
    sourceSystem: 'SMMS',
    defectDetails: 'Quarterly standby processor diagnostic audit.',
    status: 'pending'
  }
];

export const INITIAL_BLOCKS: BlockWindow[] = [
  {
    id: 'blk-ncr-01',
    code: 'BLK-NCR-2025-001',
    title: 'Integrated Shadow Corridor Block (P-Way + TRD + S&T)',
    corridorId: 'ncr-hdn-1',
    sectionId: 'sec-pryj-ftp',
    sectionName: 'Fatehpur (FTP) – Sirathu Section (Km 955 to 968)',
    startKm: 955,
    endKm: 968,
    lineType: 'UP MAIN',
    startTime: '01:30',
    endTime: '04:30',
    durationMinutes: 180,
    bundledRequisitions: [
      INITIAL_REQUISITIONS[0], // CSM Tamping (P-Way)
      INITIAL_REQUISITIONS[1], // USFD Testing (P-Way)
      INITIAL_REQUISITIONS[3], // Tower Wagon OHE Check (TRD)
      INITIAL_REQUISITIONS[4], // Neutral Section (TRD)
      INITIAL_REQUISITIONS[5], // Point Machine 104A (S&T)
      INITIAL_REQUISITIONS[6], // DAC Validation (S&T)
    ],
    departmentsInvolved: ['P-Way', 'TRD', 'S&T'],
    status: 'recommended',
    confidenceScore: 96,
    punctualityImpact: {
      delayedTrainsCount: 1,
      totalDelayMinutes: 18,
      regulatedTrains: [
        {
          trainNumber: 'BOXN-9821',
          trainName: 'Coal Freight Rake',
          station: 'Fatehpur Loop Line',
          delayMinutes: 18
        }
      ],
      speedRestrictionsImposed: 'Caution Order 30 km/h on adjacent DOWN Line for Tower Wagon safety buffer'
    },
    metrics: {
      assetAvailabilityGainPercent: 28.5,
      possessionHoursSavedMinutes: 240,
      shadowBundleEfficiency: 92.4,
      passengerPunctualityImpactMinutes: 0,
      freightThroughputPreservedPercent: 97.2
    },
    safetyChecklist: {
      oheIsolated: true,
      earthDischarged: true,
      stMemoReceived: true,
      cautionOrderIssued: true,
      flaggerPosted: true
    },
    approvals: {
      pwayApproved: true,
      trdApproved: true,
      stApproved: true,
      chiefControllerApproved: false,
      approverName: 'Section Controller (Prayagraj)',
      timestamp: '2026-08-30 06:30 IST',
      comments: 'Recommended optimal traffic trough window between Rajdhani 12423 departure and morning Vande Bharat 22436.'
    },
    algorithmNotes: 'Selected via CP-SAT Multi-Objective Constraint Optimizer. 6 requisitions bundled into 1 joint 3-hour window, eliminating 4 separate isolated block requests.'
  }
];

export const INITIAL_WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'sc-1',
    title: 'High-Priority Rajdhani 12301 Delayed (+45 Mins)',
    type: 'train_delay',
    severity: 'Major',
    description: 'Upstream signal delay near Mughalsarai causes 12301 Howrah Rajdhani to run 45 minutes behind schedule, entering Prayagraj-Fatehpur section right at scheduled block inception.',
    triggerDetails: {
      trainNumber: '12301',
      addedDelayMinutes: 45
    },
    impactSummary: 'Direct overlap with initial block start at 01:30. AI suggests shifting block start to 02:15 to preserve Rajdhani right-of-way without cancelling maintenance.',
    isApplied: false
  },
  {
    id: 'sc-2',
    title: 'Emergency Rail Fracture Detected at Km 964/18',
    type: 'emergency_fault',
    severity: 'Critical',
    description: 'Track acoustic monitoring and USFD trolley trigger critical IMR (Immediate Measurement Required) fracture alert on UP Main line.',
    triggerDetails: {
      faultKmMarker: 964.18,
      faultDepartment: 'P-Way',
      faultDescription: 'Transverse rail fracture near welded joint on UP track. Requires emergency clamp plate & cut-rail replacement.'
    },
    impactSummary: 'Safety hierarchy level 1 override. Immediate 90-minute emergency block required. Diverts following freight rakes to Loop Lines.',
    isApplied: false
  },
  {
    id: 'sc-3',
    title: 'TRD Tower Wagon Machine Unavailability',
    type: 'machine_breakdown',
    severity: 'Moderate',
    description: 'Tower Wagon TW-402 reports hydraulic mast failure during pre-block depot inspection at Prayagraj.',
    triggerDetails: {
      unavailableMachine: 'Tower Wagon TW-402'
    },
    impactSummary: 'OHE overhead stagger inspection decoupled; P-Way tamping and S&T Point machine block continue uninterrupted, saving 180 min possession window.',
    isApplied: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-30 05:15:22 IST',
    user: 'RailAI CP-SAT Optimization Engine',
    action: 'Auto-Generated Block Candidates',
    category: 'OPTIMIZATION',
    details: 'Bundled 6 requisitions across P-Way, TRD, and S&T into Block BLK-NCR-2025-001 with 96% Feasibility Score.',
    blockId: 'blk-ncr-01'
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-30 06:10:45 IST',
    user: 'SSE/P-Way (Prayagraj)',
    action: 'Department Clearance Endorsed',
    category: 'APPROVAL',
    details: 'Endorsed CSM 09-32 tamping crew allocation for Section Km 955-968.',
    blockId: 'blk-ncr-01'
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-30 06:22:18 IST',
    user: 'CTFO/TRD (Fatehpur)',
    action: 'Power Block Isolation Validated',
    category: 'SAFETY_OVERRIDE',
    details: 'Power block 25kV OHE isolation scheme approved with earthing discharge rod placement.',
    blockId: 'blk-ncr-01'
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-30 06:30:00 IST',
    user: 'Section Controller (NCR Control Room)',
    action: 'Controller Shadow Review Completed',
    category: 'APPROVAL',
    details: 'Advisory window 01:30 - 04:30 validated. Forwarded to Chief Controller for operations final approval.',
    blockId: 'blk-ncr-01'
  }
];
