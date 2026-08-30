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
  Sparkles, 
  Users, 
  ArrowRight, 
  AlertTriangle, 
  RotateCcw, 
  Radio, 
  Check, 
  X, 
  ThumbsUp, 
  ThumbsDown,
  Clock
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
    <div className="flex flex-col gap-6 text-[#181816]">
      {/* Top Banner & Mode Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E0D4] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F3EEE7] border border-[#E6E0D4] text-[#181816]">
            <Radio className="w-6 h-6 text-[#C87428] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-cinzel font-bold text-[#181816] tracking-wider uppercase">
                Controller Emergency Alterations & Inter-Station Consensus
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#636059] border border-[#E6E0D4] font-mono">
                IR-Consensus Protocol
              </span>
            </div>
            <p className="text-xs text-[#636059] mt-0.5">
              Empowers Controllers & Station Masters to suggest emergency alterations. AI evaluates candidate re-schedules, and changes are committed <strong>strictly upon unanimous inter-station verification</strong>.
            </p>
          </div>
        </div>

        <button
          id="btn-propose-alteration"
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-sm transition transform active:scale-95 whitespace-nowrap"
        >
          <ShieldAlert className="w-4 h-4 text-[#C87428]" />
          <span>{isCreatingNew ? 'View Active Proposals' : 'Propose Emergency Alteration'}</span>
        </button>
      </div>

      {/* NEW PROPOSAL CREATOR FORM MODAL / DRAWER */}
      {isCreatingNew && (
        <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FDF3EA] border border-[#F7D4B8] text-[#C87428]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#181816]">
                  Submit Operational Alteration / Emergency Shift Request
                </h3>
                <p className="text-xs text-[#636059]">
                  Input field constraints or emergency factors. RailAI will synthesize conflict-free multi-option re-schedules for station voting.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-[#8F8A80] hover:text-[#181816] p-1.5 rounded-full hover:bg-[#F3EEE7]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleGenerateAIProposal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Proposing Unit / Station Master
              </label>
              <select
                value={formProposingUnit}
                onChange={e => setFormProposingUnit(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
              >
                <option value="Station Master Unit — Sirathu (SRO)">Station Master Unit — Sirathu (SRO)</option>
                <option value="Station Master Unit — Fatehpur (FTP)">Station Master Unit — Fatehpur (FTP)</option>
                <option value="Section Controller (Prayagraj Control Office)">Section Controller (Prayagraj Control Office)</option>
                <option value="Traction Foreman Unit — TRD/Fatehpur">Traction Foreman Unit — TRD/Fatehpur</option>
                <option value="Signal Inspector Unit — S&T/Kanpur">Signal Inspector Unit — S&T/Kanpur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Proposing Officer Name & Designation
              </label>
              <input
                type="text"
                value={formProposingOfficer}
                onChange={e => setFormProposingOfficer(e.target.value)}
                placeholder="e.g. D. K. Mishra (Station Master)"
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Alteration Category / Reason
              </label>
              <select
                value={formReasonType}
                onChange={e => setFormReasonType(e.target.value as ProposalReasonType)}
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
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
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Target Section
              </label>
              <select
                value={formTargetSection}
                onChange={e => setFormTargetSection(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
              >
                <option value="Sirathu – Khaga Section (Km 920 to 945)">Sirathu – Khaga Section (Km 920 to 945)</option>
                <option value="Sirathu – Fatehpur Section (Km 915 to 945)">Sirathu – Fatehpur Section (Km 915 to 945)</option>
                <option value="Fatehpur – Malwan Section (Km 945 to 970)">Fatehpur – Malwan Section (Km 945 to 970)</option>
                <option value="Kanpur Central – Rura Section (Km 1040 to 1053)">Kanpur Central – Rura Section (Km 1040 to 1053)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Line Track Allocation
              </label>
              <select
                value={formTargetLine}
                onChange={e => setFormTargetLine(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
              >
                <option value="UP MAIN">UP MAIN Line</option>
                <option value="DOWN MAIN">DOWN MAIN Line</option>
                <option value="BOTH LINES">BOTH LINES (Simultaneous Shadow Block)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
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
                        ? 'bg-[#181816] text-white border-[#181816]'
                        : 'bg-[#FAF7F2] text-[#636059] border-[#E6E0D4] hover:bg-[#F3EEE7]'
                    }`}
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-[#636059] mb-1.5">
                Operational Title & Specific Alteration Details
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Urgent S&T Point machine re-alignment at Sirathu Yard Point 14B"
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl px-3 py-2 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none mb-2"
              />
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={2}
                placeholder="Describe why this manual alteration is necessary and specific safety / siding constraints..."
                className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-3 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none"
              ></textarea>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-5 py-2.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#636059] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C87428]" />
                <span>Synthesize AI Re-Schedules & Broadcast</span>
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
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2.5 transition whitespace-nowrap border ${
                  selectedProposalId === p.id
                    ? 'bg-[#181816] border-[#181816] text-white shadow-xs'
                    : 'bg-white border-[#E6E0D4] text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  isApproved ? 'bg-[#2D7A4D]' : hasRejection ? 'bg-[#C53030]' : 'bg-[#C87428] animate-pulse'
                }`}></span>
                <span className="font-mono font-bold">{p.proposalCode}</span>
                <span className="truncate max-w-[200px] opacity-80">{p.title}</span>
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
            <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE7DC] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-[#181816] bg-[#F3EEE7] px-3 py-1 rounded-full border border-[#E6E0D4]">
                    {currentProposal.proposalCode}
                  </span>
                  <span className="text-xs text-[#636059] font-medium">
                    Created: <span className="text-[#181816] font-mono">{currentProposal.createdAt}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono border ${
                    isFullyApproved
                      ? 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]'
                      : isRejected
                      ? 'bg-[#FDF2F2] text-[#C53030] border-[#F8D7D7]'
                      : 'bg-[#FDF3EA] text-[#C87428] border-[#F7D4B8]'
                  }`}>
                    {isFullyApproved
                      ? '✓ Fully Approved by All Stations'
                      : isRejected
                      ? '✗ Rejected — Base AI Schedule Maintained'
                      : '⏳ Pending Station Consensus'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#181816] mb-1.5">
                {currentProposal.title}
              </h3>
              <p className="text-xs text-[#636059] leading-relaxed mb-4">
                {currentProposal.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6E0D4] text-xs">
                <div>
                  <span className="text-[10px] text-[#8F8A80] block uppercase font-bold tracking-wider">Proposing Unit</span>
                  <strong className="text-[#181816] text-[11px] truncate block">{currentProposal.proposingUnit}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#8F8A80] block uppercase font-bold tracking-wider">Section</span>
                  <strong className="text-[#181816] text-[11px] truncate block">{currentProposal.targetSection}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#8F8A80] block uppercase font-bold tracking-wider">Line Track</span>
                  <strong className="text-[#181816] text-[11px] block">{currentProposal.targetLine}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#8F8A80] block uppercase font-bold tracking-wider">Requested Shift</span>
                  <strong className="text-[#C87428] font-mono text-[11px] block">+{currentProposal.requestedShiftMinutes} mins</strong>
                </div>
              </div>
            </div>

            {/* AI Multi-Option Rescheduler Section */}
            <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F3EEE7] border border-[#E6E0D4] text-[#181816]">
                    <Sparkles className="w-4 h-4 text-[#C87428]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#181816]">
                      AI Dynamic Multi-Option Reschedule Engine
                    </h4>
                    <p className="text-[11px] text-[#636059]">
                      RailAI analyzed conflicting paths and generated {currentProposal.aiOptions.length} optimal re-plan candidates.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#636059] bg-[#F3EEE7] px-2.5 py-1 rounded-full border border-[#E6E0D4]">
                  CP-SAT Solved in 28ms
                </span>
              </div>

              {/* Option Selector Cards */}
              <div className="flex flex-col gap-3">
                {currentProposal.aiOptions.map((opt) => {
                  const isSelected = currentProposal.selectedOptionId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => onSelectAIOption(currentProposal.id, opt.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#181816] ring-1 ring-[#181816] shadow-xs'
                          : 'bg-white border-[#E6E0D4] hover:border-[#181816]/40 hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#181816] bg-[#181816] text-white' : 'border-[#8F8A80]'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <h5 className="text-xs font-bold text-[#181816]">{opt.title}</h5>
                          {opt.recommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]">
                              Recommended
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono font-bold text-[#181816] bg-[#F3EEE7] px-2.5 py-0.5 rounded-full border border-[#E6E0D4]">
                          {opt.revisedBlockWindow.newStartTime} – {opt.revisedBlockWindow.newEndTime} ({opt.revisedBlockWindow.durationMinutes}m)
                        </span>
                      </div>

                      <p className="text-xs text-[#636059] mb-3">
                        {opt.description}
                      </p>

                      {/* Metrics comparison pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EDE7DC]">
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E6E0D4]">
                          <span className="text-[10px] text-[#8F8A80] block uppercase font-bold">Punctuality</span>
                          <span className="text-xs font-mono font-bold text-[#2D7A4D]">{opt.metrics.punctualityIndex}%</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E6E0D4]">
                          <span className="text-[10px] text-[#8F8A80] block uppercase font-bold">Avg Delay</span>
                          <span className="text-xs font-mono font-bold text-[#C87428]">{opt.metrics.avgDelayMinutes} mins</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E6E0D4]">
                          <span className="text-[10px] text-[#8F8A80] block uppercase font-bold">Possession</span>
                          <span className="text-xs font-mono font-bold text-[#181816]">+{opt.metrics.possessionTimeSavedMinutes}m</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E6E0D4]">
                          <span className="text-[10px] text-[#8F8A80] block uppercase font-bold">Safety Index</span>
                          <span className="text-xs font-mono font-bold text-[#2B5C8F]">{opt.metrics.safetyComplianceScore}/100</span>
                        </div>
                      </div>

                      {/* Train Impacts Pill */}
                      <div className="mt-3 pt-2 border-t border-[#EDE7DC] flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-[#8F8A80] uppercase font-bold">Affected Trains:</span>
                        {opt.trainImpacts.map(ti => (
                          <span
                            key={ti.trainNumber}
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                              ti.delayMinutes === 0
                                ? 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]'
                                : 'bg-[#FDF3EA] text-[#C87428] border-[#F7D4B8]'
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
            <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F3EEE7] border border-[#E6E0D4] text-[#181816]">
                    <Users className="w-4 h-4 text-[#2D7A4D]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#181816]">
                      Concerned Stations Consensus Matrix
                    </h4>
                    <p className="text-[11px] text-[#636059]">
                      Unanimous approval required from all corridor units.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#2D7A4D]">
                    {approvedCount} / {totalCount}
                  </span>
                  <span className="text-[10px] text-[#8F8A80] block uppercase font-bold">Endorsed</span>
                </div>
              </div>

              {/* Consensus Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-[#636059] mb-1.5">
                  <span>Consensus Threshold</span>
                  <span className="font-mono font-bold text-[#181816]">
                    {Math.round((approvedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#F3EEE7] h-2.5 rounded-full overflow-hidden border border-[#E6E0D4] flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isRejected ? 'bg-[#C53030]' : isFullyApproved ? 'bg-[#2D7A4D]' : 'bg-[#C87428]'
                    }`}
                    style={{ width: `${(approvedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {isFullyApproved && (
                <div className="p-4 rounded-2xl bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D] text-xs flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-[#2D7A4D] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#181816] font-bold">100% Inter-Station Consensus Achieved!</strong>
                    The manual alteration and AI re-schedule have been formally committed to the Network Master Schedule. String Graph and active blocks updated.
                  </div>
                </div>
              )}

              {isRejected && (
                <div className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F8D7D7] text-[#C53030] text-xs flex items-start gap-2.5 animate-in fade-in">
                  <XCircle className="w-5 h-5 text-[#C53030] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#181816] font-bold">Alteration Rejected by Concerned Unit</strong>
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
                      className={`p-4 rounded-2xl border transition-all ${
                        isApproved
                          ? 'bg-[#F9FCFA] border-[#C6E7D2] text-[#181816]'
                          : isStationRejected
                          ? 'bg-[#FEF9F9] border-[#F8D7D7] text-[#181816]'
                          : 'bg-[#FAF7F2] border-[#E6E0D4] text-[#181816]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#181816] bg-white px-2.5 py-0.5 rounded-md border border-[#E6E0D4]">
                              {station.stationCode}
                            </span>
                            <span className="text-xs font-bold text-[#181816]">{station.stationName}</span>
                          </div>
                          <span className="text-[11px] text-[#636059] block mt-0.5">
                            {station.role} • <em>{station.officerName}</em>
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                          isApproved
                            ? 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]'
                            : isStationRejected
                            ? 'bg-[#FDF2F2] text-[#C53030] border-[#F8D7D7]'
                            : 'bg-[#F3EEE7] text-[#636059] border-[#E6E0D4]'
                        }`}>
                          {station.status}
                        </span>
                      </div>

                      {station.remarks && (
                        <p className="text-[11px] text-[#636059] bg-white p-2.5 rounded-xl border border-[#E6E0D4] mt-2.5 italic">
                          "{station.remarks}"
                        </p>
                      )}

                      {station.votedAt && (
                        <span className="text-[10px] text-[#8F8A80] font-mono block mt-1.5">
                          Timestamp: {station.votedAt}
                        </span>
                      )}

                      {/* Interactive Voting Actions */}
                      {isPending && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#EDE7DC]">
                          <button
                            onClick={() => onStationVote(
                              currentProposal.id, 
                              station.stationCode, 
                              'approved',
                              `Verified by ${station.officerName}. Siding and track line conditions clear.`
                            )}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#2D7A4D] hover:bg-[#25633E] text-white text-xs font-bold transition shadow-xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Verify & Approve</span>
                          </button>

                          <button
                            onClick={() => {
                              setRejectStationCode(station.stationCode);
                              setRejectReason('Platform occupancy conflict / loop line capacity constraint');
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#FDF2F2] hover:bg-[#F8D7D7] text-[#C53030] border border-[#F8D7D7] text-xs font-bold transition"
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
                  className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] text-xs font-semibold border border-[#E6E0D4] transition"
                >
                  <RotateCcw className="w-4 h-4 text-[#C87428]" />
                  <span>Re-open Consensus / Restore Initial Proposal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {rejectStationCode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-[#C53030] mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-[#181816]">
                Reject Alteration Proposal as {rejectStationCode}
              </h4>
            </div>

            <p className="text-xs text-[#636059] mb-3">
              Rejecting this proposal will automatically discard the manual change and preserve the baseline AI schedule. Please specify the operational reason:
            </p>

            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-2xl p-3 text-xs text-[#181816] font-medium focus:ring-2 focus:ring-[#181816] focus:outline-none mb-4"
              placeholder="e.g. Siding loop occupied by late running coal rake; cannot regulate freight."
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectStationCode(null)}
                className="px-4 py-2 rounded-full bg-[#F3EEE7] text-[#636059] text-xs font-medium hover:bg-[#EAE4D9]"
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
                className="px-5 py-2 rounded-full bg-[#C53030] text-white text-xs font-bold hover:bg-[#A82525]"
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
