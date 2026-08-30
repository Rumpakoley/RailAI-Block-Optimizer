import React, { useState } from 'react';
import { 
  Corridor, 
  BlockWindow, 
  Train, 
  ControllerAlterationProposal, 
  AIRescheduleOption, 
  StationVote, 
  ProposalReasonType,
  UrgencyLevel
} from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Users, 
  Send, 
  FileText, 
  Layers, 
  ArrowRight, 
  AlertTriangle, 
  RotateCcw, 
  Radio, 
  ChevronRight, 
  Check, 
  X, 
  Building2, 
  CalendarClock, 
  Gauge, 
  TrainTrack,
  BadgeAlert,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

interface ControllerConsensusViewProps {
  corridor: Corridor;
  blocks: BlockWindow[];
  trains: Train[];
  proposals: ControllerAlterationProposal[];
  onCreateProposal: (newProposal: ControllerAlterationProposal) => void;
  onSelectAIOption: (proposalId: string, optionId: string) => void;
  onStationVote: (proposalId: string, stationCode: string, status: 'approved' | 'rejected', remarks?: string) => void;
  onResetProposalToOriginal: (proposalId: string) => void;
}

export const ControllerConsensusView: React.FC<ControllerConsensusViewProps> = ({
  corridor,
  blocks,
  trains,
  proposals,
  onCreateProposal,
  onSelectAIOption,
  onStationVote,
  onResetProposalToOriginal
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals[0]?.id || ''
  );
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // New Proposal Form State
  const [formProposingUnit, setFormProposingUnit] = useState<string>('Station Master Unit — Sirathu (SRO)');
  const [formProposingOfficer, setFormProposingOfficer] = useState<string>('D. K. Mishra (Station Master)');
  const [formReasonType, setFormReasonType] = useState<ProposalReasonType>('emergency_track_defect');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formTargetSection, setFormTargetSection] = useState<string>('Sirathu – Khaga Section (Km 920 to 945)');
  const [formTargetLine, setFormTargetLine] = useState<'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES'>('UP MAIN');
  const [formShiftMinutes, setFormShiftMinutes] = useState<number>(45);
  const [formUrgency, setFormUrgency] = useState<UrgencyLevel>('High');

  // Custom reject comment modal / popover
  const [rejectStationCode, setRejectStationCode] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const currentProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Helper to handle creation
  const handleGenerateAIProposal = (e: React.FormEvent) => {
    e.preventDefault();

    const title = formTitle || `Emergency Alteration: ${formReasonType.replace(/_/g, ' ').toUpperCase()} at ${formTargetSection}`;
    const desc = formDescription || `Manual operational request submitted by ${formProposingUnit}. Requires dynamic re-scheduling and multi-station consensus.`;

    const newPropId = `prop-ncr-${Date.now()}`;
    const propCode = `PROP-NCR-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Generate AI candidate options dynamically based on form shift
    const option1: AIRescheduleOption = {
      id: `opt-1-${Date.now()}`,
      title: 'Option A: Punctuality Protection & Dynamic Siding Regulation (Recommended)',
      strategyBadge: 'Zero Passenger Delay • Dynamic Loop Stabling',
      description: `Shift Scheduled Block BLK-NCR-2025-001 by +${formShiftMinutes} mins (02:15 to 05:15). Higher priority passenger trains (Rajdhani & Vande Bharat) pass with clear speed. Freight trains stabled in loop siding.`,
      revisedBlockWindow: {
        blockId: blocks[0]?.id || 'blk-ncr-01',
        code: blocks[0]?.code || 'BLK-NCR-2025-001',
        newStartTime: '02:15',
        newEndTime: '05:15',
        durationMinutes: 180,
        sectionName: formTargetSection,
        lineType: formTargetLine
      },
      trainImpacts: [
        {
          trainNumber: '12301',
          trainName: 'Howrah - New Delhi Rajdhani Express',
          action: 'Clear with Right of Way',
          delayMinutes: 0
        },
        {
          trainNumber: 'BOXN-8842',
          trainName: 'DDU - Dadri Coal Freight Rake',
          action: 'Regulate at Siding',
          delayMinutes: 22,
          regulatedStation: 'Sirathu (SRO)'
        },
        {
          trainNumber: '22436',
          trainName: 'Vande Bharat Express',
          action: 'Clear with Right of Way',
          delayMinutes: 0
        }
      ],
      metrics: {
        punctualityIndex: 99.2,
        avgDelayMinutes: 1.1,
        possessionTimeSavedMinutes: 180,
        safetyComplianceScore: 98,
        throughputPreservedPercent: 96.5
      },
      recommended: true
    };

    const option2: AIRescheduleOption = {
      id: `opt-2-${Date.now()}`,
      title: 'Option B: Extended Window with Speed Restriction Caution Order',
      strategyBadge: 'Full 210 Min Window • Joint Multi-Dept Possession',
      description: `Expand window to 210 mins (02:00 to 05:30) combining P-Way switch repairs with OHE inspection. Temporary 30 km/h caution imposed on adjacent line.`,
      revisedBlockWindow: {
        blockId: blocks[0]?.id || 'blk-ncr-01',
        code: blocks[0]?.code || 'BLK-NCR-2025-001',
        newStartTime: '02:00',
        newEndTime: '05:30',
        durationMinutes: 210,
        sectionName: formTargetSection,
        lineType: 'BOTH LINES'
      },
      trainImpacts: [
        {
          trainNumber: '12301',
          trainName: 'Howrah - New Delhi Rajdhani Express',
          action: 'Minor Speed Restriction',
          delayMinutes: 4
        },
        {
          trainNumber: 'BOXN-8842',
          trainName: 'DDU - Dadri Coal Freight Rake',
          action: 'Regulate at Siding',
          delayMinutes: 38,
          regulatedStation: 'Fatehpur (FTP)'
        }
      ],
      metrics: {
        punctualityIndex: 94.8,
        avgDelayMinutes: 4.6,
        possessionTimeSavedMinutes: 210,
        safetyComplianceScore: 99,
        throughputPreservedPercent: 91.2
      },
      recommended: false
    };

    // Concerned stations list for the corridor
    const concerned: StationVote[] = [
      {
        stationCode: 'SRO',
        stationName: 'Sirathu Station',
        role: 'Station Master',
        officerName: 'D. K. Mishra',
        status: formProposingUnit.includes('Sirathu') ? 'approved' : 'pending',
        votedAt: formProposingUnit.includes('Sirathu') ? new Date().toLocaleTimeString('en-IN') + ' IST' : undefined,
        remarks: formProposingUnit.includes('Sirathu') ? 'Initiated proposal. Verified siding track capacity.' : undefined,
        required: true
      },
      {
        stationCode: 'FTP',
        stationName: 'Fatehpur Junction',
        role: 'Station Master',
        officerName: 'S. N. Tripathi',
        status: 'pending',
        required: true
      },
      {
        stationCode: 'PRYJ-CTRL',
        stationName: 'Prayagraj Control Office',
        role: 'Section Controller (PRYJ-CNB Section)',
        officerName: 'A. K. Verma',
        status: 'pending',
        required: true
      },
      {
        stationCode: 'TRD-FTP',
        stationName: 'TRD Traction Substation (Fatehpur)',
        role: 'Chief Traction Foreman (TRD)',
        officerName: 'R. P. Singh',
        status: 'pending',
        required: true
      },
      {
        stationCode: 'ST-CNB',
        stationName: 'S&T Maintenance Depot (Kanpur Area)',
        role: 'Signal Inspector (S&T)',
        officerName: 'Vikram Joshi',
        status: 'pending',
        required: true
      }
    ];

    const newProposal: ControllerAlterationProposal = {
      id: newPropId,
      proposalCode: propCode,
      proposingUnit: formProposingUnit,
      proposingOfficer: formProposingOfficer,
      proposingRole: 'Operational Controller / SM',
      reasonType: formReasonType,
      title,
      description: desc,
      corridorId: corridor.id,
      targetSection: formTargetSection,
      targetLine: formTargetLine,
      requestedShiftMinutes: formShiftMinutes,
      urgency: formUrgency,
      createdAt: new Date().toLocaleTimeString('en-IN') + ' IST',
      status: 'pending_consensus',
      selectedOptionId: option1.id,
      aiOptions: [option1, option2],
      concernedStations: concerned
    };

    onCreateProposal(newProposal);
    setSelectedProposalId(newProposal.id);
    setIsCreatingNew(false);
  };

  const selectedAIOption = currentProposal?.aiOptions.find(
    o => o.id === currentProposal.selectedOptionId
  ) || currentProposal?.aiOptions[0];

  const approvedCount = currentProposal ? currentProposal.concernedStations.filter(s => s.status === 'approved').length : 0;
  const rejectedCount = currentProposal ? currentProposal.concernedStations.filter(s => s.status === 'rejected').length : 0;
  const totalCount = currentProposal ? currentProposal.concernedStations.length : 0;
  const isFullyApproved = totalCount > 0 && approvedCount === totalCount;
  const isRejected = rejectedCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Mode Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Controller Emergency Alterations & Multi-Station Consensus Console
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                IR-Consensus Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empowers Controllers & Station Masters to suggest emergency alterations. AI evaluates candidate re-schedules, and changes are committed <strong>strictly upon unanimous inter-station verification</strong>.
            </p>
          </div>
        </div>

        <button
          id="btn-propose-alteration"
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition transform active:scale-95 whitespace-nowrap"
        >
          <ShieldAlert className="w-4 h-4 text-indigo-200" />
          <span>{isCreatingNew ? 'View Active Proposals' : 'Propose Emergency / Manual Alteration'}</span>
        </button>
      </div>

      {/* NEW PROPOSAL CREATOR FORM MODAL / DRAWER */}
      {isCreatingNew && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Submit Operational Alteration / Emergency Shift Request
                </h3>
                <p className="text-xs text-slate-400">
                  Input field constraints or emergency factors. RailAI will synthesize conflict-free multi-option re-schedules for station voting.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleGenerateAIProposal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proposing Unit / Station Master
              </label>
              <select
                value={formProposingUnit}
                onChange={e => setFormProposingUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Station Master Unit — Sirathu (SRO)">Station Master Unit — Sirathu (SRO)</option>
                <option value="Station Master Unit — Fatehpur (FTP)">Station Master Unit — Fatehpur (FTP)</option>
                <option value="Section Controller (Prayagraj Control Office)">Section Controller (Prayagraj Control Office)</option>
                <option value="Traction Foreman Unit — TRD/Fatehpur">Traction Foreman Unit — TRD/Fatehpur</option>
                <option value="Signal Inspector Unit — S&T/Kanpur">Signal Inspector Unit — S&T/Kanpur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proposing Officer Name & Designation
              </label>
              <input
                type="text"
                value={formProposingOfficer}
                onChange={e => setFormProposingOfficer(e.target.value)}
                placeholder="e.g. D. K. Mishra (Station Master)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alteration Category / Reason
              </label>
              <select
                value={formReasonType}
                onChange={e => setFormReasonType(e.target.value as ProposalReasonType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="emergency_track_defect">🚨 Emergency Track Defect / Rail Fracture</option>
                <option value="ohe_power_fault">⚡ 25kV OHE Overhead Dropper Fault</option>
                <option value="signal_failure">🛑 Signal & Point Interlocking Glitch</option>
                <option value="vip_train_precedence">🚄 Delayed Superfast / VIP Train Right-of-Way</option>
                <option value="machine_breakdown">🚜 Track Machine / Tower Wagon Delay</option>
                <option value="weather_monsoon">🌧️ Monsoon / Severe Weather Precaution</option>
                <option value="manual_operational_shift">⏱️ Manual Operational Window Adjustment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Section
              </label>
              <select
                value={formTargetSection}
                onChange={e => setFormTargetSection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Sirathu – Khaga Section (Km 920 to 945)">Sirathu – Khaga Section (Km 920 to 945)</option>
                <option value="Sirathu – Fatehpur Section (Km 915 to 945)">Sirathu – Fatehpur Section (Km 915 to 945)</option>
                <option value="Fatehpur – Malwan Section (Km 945 to 970)">Fatehpur – Malwan Section (Km 945 to 970)</option>
                <option value="Kanpur Central – Rura Section (Km 1040 to 1053)">Kanpur Central – Rura Section (Km 1040 to 1053)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Line Track Allocation
              </label>
              <select
                value={formTargetLine}
                onChange={e => setFormTargetLine(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="UP MAIN">UP MAIN Line</option>
                <option value="DOWN MAIN">DOWN MAIN Line</option>
                <option value="BOTH LINES">BOTH LINES (Simultaneous Shadow Block)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Requested Window Time Shift
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormShiftMinutes(m)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition ${
                      formShiftMinutes === m
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Operational Title & Specific Alteration Details
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Urgent S&T Point machine re-alignment at Sirathu Yard Point 14B"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-2"
              />
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={2}
                placeholder="Describe why this manual alteration is necessary and specific safety / siding constraints..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Synthesize AI Re-Schedules & Broadcast to Stations</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROPOSAL SELECTOR TABS IF MULTIPLE */}
      {proposals.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {proposals.map(p => {
            const isApproved = p.concernedStations.every(s => s.status === 'approved');
            const hasRejection = p.concernedStations.some(s => s.status === 'rejected');

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProposalId(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap border ${
                  selectedProposalId === p.id
                    ? 'bg-slate-900 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  isApproved ? 'bg-emerald-400' : hasRejection ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'
                }`}></span>
                <span className="font-mono font-bold text-slate-200">{p.proposalCode}</span>
                <span className="text-slate-400 truncate max-w-[200px]">{p.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVE PROPOSAL MAIN WORKBENCH */}
      {currentProposal && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: PROPOSAL SUMMARY & AI RE-SCHEDULE COMPARATOR (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Proposal Details Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    {currentProposal.proposalCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Created: <span className="text-slate-200 font-mono">{currentProposal.createdAt}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border ${
                    isFullyApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isRejected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  }`}>
                    {isFullyApproved
                      ? '✓ Fully Approved by All Stations'
                      : isRejected
                      ? '✗ Rejected — Base AI Schedule Maintained'
                      : '⏳ Pending Station Consensus'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">
                {currentProposal.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {currentProposal.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Proposing Unit</span>
                  <strong className="text-slate-200 text-[11px] truncate block">{currentProposal.proposingUnit}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Section</span>
                  <strong className="text-slate-200 text-[11px] truncate block">{currentProposal.targetSection}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Line Track</span>
                  <strong className="text-indigo-300 text-[11px] block">{currentProposal.targetLine}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Requested Shift</span>
                  <strong className="text-amber-300 font-mono text-[11px] block">+{currentProposal.requestedShiftMinutes} mins</strong>
                </div>
              </div>
            </div>

            {/* AI Multi-Option Rescheduler Section */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      AI Dynamic Multi-Option Reschedule Engine
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      RailAI analyzed conflicting paths and generated {currentProposal.aiOptions.length} optimal re-plan candidates.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  CP-SAT Solved in 28ms
                </span>
              </div>

              {/* Option Selector Cards */}
              <div className="flex flex-col gap-3">
                {currentProposal.aiOptions.map((opt, idx) => {
                  const isSelected = currentProposal.selectedOptionId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => onSelectAIOption(currentProposal.id, opt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <h5 className="text-xs font-bold text-white">{opt.title}</h5>
                          {opt.recommended && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Recommended
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900">
                          {opt.revisedBlockWindow.newStartTime} – {opt.revisedBlockWindow.newEndTime} ({opt.revisedBlockWindow.durationMinutes}m)
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mb-3">
                        {opt.description}
                      </p>

                      {/* Metrics comparison pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                        <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Punctuality Index</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{opt.metrics.punctualityIndex}%</span>
                        </div>
                        <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Avg Train Delay</span>
                          <span className="text-xs font-mono font-bold text-amber-300">{opt.metrics.avgDelayMinutes} mins</span>
                        </div>
                        <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Saved Possession</span>
                          <span className="text-xs font-mono font-bold text-indigo-300">+{opt.metrics.possessionTimeSavedMinutes}m</span>
                        </div>
                        <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Safety Score</span>
                          <span className="text-xs font-mono font-bold text-cyan-300">{opt.metrics.safetyComplianceScore}/100</span>
                        </div>
                      </div>

                      {/* Train Impacts Pill */}
                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Affected Trains:</span>
                        {opt.trainImpacts.map(ti => (
                          <span
                            key={ti.trainNumber}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              ti.delayMinutes === 0
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            }`}
                          >
                            {ti.trainNumber}: {ti.action} {ti.delayMinutes > 0 ? `(+${ti.delayMinutes}m)` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MULTI-STATION CONSENSUS MATRIX & VOTING (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Concerned Stations Consensus Matrix
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Unanimous approval required from all corridor units.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {approvedCount} / {totalCount}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Endorsed</span>
                </div>
              </div>

              {/* Consensus Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>Consensus Threshold</span>
                  <span className="font-mono font-bold text-slate-200">
                    {Math.round((approvedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isRejected ? 'bg-rose-500' : isFullyApproved ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${(approvedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {isFullyApproved && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">100% Inter-Station Consensus Achieved!</strong>
                    The manual alteration and AI re-schedule have been formally committed to the Network Master Schedule. String Graph and active blocks updated.
                  </div>
                </div>
              )}

              {isRejected && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">Alteration Rejected by Concerned Unit</strong>
                    Consensus failed. To protect network punctuality and avoid cascading train delays, <strong>the schedule strictly remains the baseline generated by AI</strong>.
                  </div>
                </div>
              )}

              {/* Station Vote Cards */}
              <div className="flex flex-col gap-3">
                {currentProposal.concernedStations.map(station => {
                  const isApproved = station.status === 'approved';
                  const isStationRejected = station.status === 'rejected';
                  const isPending = station.status === 'pending';

                  return (
                    <div
                      key={station.stationCode}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                          : isStationRejected
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-100'
                          : 'bg-slate-950/70 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {station.stationCode}
                            </span>
                            <span className="text-xs font-bold text-slate-100">{station.stationName}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {station.role} • <em>{station.officerName}</em>
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isStationRejected
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {station.status}
                        </span>
                      </div>

                      {station.remarks && (
                        <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 mt-2.5 italic">
                          "{station.remarks}"
                        </p>
                      )}

                      {station.votedAt && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-1.5">
                          Timestamp: {station.votedAt}
                        </span>
                      )}

                      {/* Interactive Voting Actions for Station Official Simulation */}
                      {isPending && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => onStationVote(
                              currentProposal.id, 
                              station.stationCode, 
                              'approved',
                              `Verified by ${station.officerName}. Siding and track line conditions clear.`
                            )}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Verify & Approve</span>
                          </button>

                          <button
                            onClick={() => {
                              setRejectStationCode(station.stationCode);
                              setRejectReason('Platform occupancy conflict / loop line capacity constraint');
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition shadow-sm"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reset to Original Base AI Schedule Button */}
              {(isFullyApproved || isRejected) && (
                <button
                  onClick={() => onResetProposalToOriginal(currentProposal.id)}
                  className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4 text-indigo-400" />
                  <span>Re-open Consensus / Restore Initial Proposal State</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {rejectStationCode && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">
                Reject Alteration Proposal as {rejectStationCode}
              </h4>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Rejecting this proposal will automatically discard the manual change and preserve the baseline AI schedule. Please specify the operational reason:
            </p>

            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none mb-4"
              placeholder="e.g. Siding loop occupied by late running coal rake; cannot regulate freight."
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectStationCode(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentProposal && rejectStationCode) {
                    onStationVote(currentProposal.id, rejectStationCode, 'rejected', rejectReason);
                  }
                  setRejectStationCode(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
