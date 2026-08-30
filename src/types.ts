export type Department = 'P-Way' | 'TRD' | 'S&T';

export type UrgencyLevel = 'Emergency' | 'High' | 'Medium' | 'Low';

export type BlockStatus = 
  | 'candidate' 
  | 'recommended' 
  | 'controller_validated' 
  | 'operations_approved' 
  | 'active' 
  | 'completed'
  | 'rejected';

export type TrainType = 
  | 'Vande Bharat' 
  | 'Rajdhani / Shatabdi' 
  | 'Mail / Express' 
  | 'Suburban EMU' 
  | 'Freight (Coal Rake)' 
  | 'Freight (Container)' 
  | 'Departmental Material';

export interface Station {
  id: string;
  code: string;
  name: string;
  kmMarker: number;
  loopTracks: number;
  platforms: number;
  isJunction: boolean;
}

export interface Corridor {
  id: string;
  name: string;
  zone: string;
  division: string;
  routeLengthKm: number;
  lines: 'Double Line' | 'Triple Line' | 'Quadruple Line';
  electrification: '25kV AC 50Hz OHE';
  signalingType: 'Automatic Block Signaling (ABS)' | 'Electronic Interlocking (EI)';
  stations: Station[];
}

export interface TrainScheduleStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string; // "HH:MM"
  scheduledDeparture: string;
  isStopping: boolean;
  platform?: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  priorityTier: 1 | 2 | 3 | 4 | 5; // 1 = highest (Vande Bharat/Rajdhani), 5 = lowest (slow freight)
  direction: 'UP' | 'DOWN';
  origin: string;
  destination: string;
  stops: TrainScheduleStop[];
  currentDelayMinutes: number;
  averageSpeedKmH: number;
  routeColor: string;
  currentStatus: 'On Time' | 'Running Late' | 'Regulated at Siding' | 'Completed';
  regulatedAtStation?: string;
}

export interface Requisition {
  id: string;
  code: string;
  department: Department;
  subsystem: string; // e.g. "Track Tamping", "Point Machine Overhaul", "OHE Contact Wire Stagger"
  title: string;
  sectionId: string;
  sectionName: string;
  startKm: number;
  endKm: number;
  track: 'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES' | 'YARD LOOP';
  urgency: UrgencyLevel;
  safetyPriority: 1 | 2 | 3 | 4; // 1=Safety, 2=Urgency, 3=Availability, 4=Disruption
  durationMinutes: number;
  requiresPowerBlock: boolean;
  requiresTrafficBlock: boolean;
  requiresDisconnectMemo: boolean;
  requiredResources: string[];
  sourceSystem: 'TMS' | 'SMMS' | 'TDMS';
  defectDetails?: string;
  status: 'pending' | 'bundled' | 'scheduled' | 'completed';
  assignedBlockId?: string;
}

export interface OptimizationMetrics {
  assetAvailabilityGainPercent: number;
  possessionHoursSavedMinutes: number;
  shadowBundleEfficiency: number;
  passengerPunctualityImpactMinutes: number;
  freightThroughputPreservedPercent: number;
}

export interface PunctualityImpact {
  delayedTrainsCount: number;
  totalDelayMinutes: number;
  regulatedTrains: { trainNumber: string; trainName: string; station: string; delayMinutes: number }[];
  speedRestrictionsImposed: string;
}

export interface SafetyChecklist {
  oheIsolated: boolean;
  earthDischarged: boolean;
  stMemoReceived: boolean;
  cautionOrderIssued: boolean;
  flaggerPosted: boolean;
}

export interface Approvals {
  pwayApproved: boolean;
  trdApproved: boolean;
  stApproved: boolean;
  chiefControllerApproved: boolean;
  approverName?: string;
  timestamp?: string;
  comments?: string;
}

export interface BlockWindow {
  id: string;
  code: string;
  title: string;
  corridorId: string;
  sectionId: string;
  sectionName: string;
  startKm: number;
  endKm: number;
  lineType: 'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES';
  startTime: string; // "01:30"
  endTime: string;   // "04:30"
  durationMinutes: number;
  bundledRequisitions: Requisition[];
  departmentsInvolved: Department[];
  status: BlockStatus;
  confidenceScore: number; // 0 to 100
  punctualityImpact: PunctualityImpact;
  metrics: OptimizationMetrics;
  safetyChecklist: SafetyChecklist;
  approvals: Approvals;
  officialNoticeMemo?: string;
  algorithmNotes?: string;
}

export interface WhatIfScenario {
  id: string;
  title: string;
  type: 'train_delay' | 'emergency_fault' | 'machine_breakdown' | 'monsoon_precaution';
  severity: 'Critical' | 'Major' | 'Moderate';
  description: string;
  triggerDetails: {
    trainNumber?: string;
    addedDelayMinutes?: number;
    faultKmMarker?: number;
    faultDepartment?: Department;
    faultDescription?: string;
    unavailableMachine?: string;
  };
  impactSummary: string;
  isApplied: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'OPTIMIZATION' | 'APPROVAL' | 'SAFETY_OVERRIDE' | 'WHAT_IF_SIMULATION' | 'RE_PLAN';
  details: string;
  blockId?: string;
}
