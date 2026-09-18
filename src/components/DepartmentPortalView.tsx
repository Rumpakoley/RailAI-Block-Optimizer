import React, { useState } from 'react';
import { Corridor, Requisition, Department, UrgencyLevel } from '../types';
import { 
  Wrench, 
  Zap, 
  Radio, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Filter, 
  Search, 
  Trash2,
  HardHat,
  Cpu,
  Sparkles,
  Check
} from 'lucide-react';

interface DepartmentPortalViewProps {
  corridor: Corridor;
  requisitions: Requisition[];
  onAddRequisition: (req: Requisition) => void;
  onRemoveRequisition?: (reqId: string) => void;
  onGoToOptimizer: () => void;
}

export const DepartmentPortalView: React.FC<DepartmentPortalViewProps> = ({
  corridor,
  requisitions,
  onAddRequisition,
  onRemoveRequisition,
  onGoToOptimizer
}) => {
  const [selectedDeptTab, setSelectedDeptTab] = useState<Department | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formDept, setFormDept] = useState<Department>('P-Way');
  const [formSubsystem, setFormSubsystem] = useState('Plain Track Tamping & Alignment');
  const [formTitle, setFormTitle] = useState('');
  const [formSectionName, setFormSectionName] = useState(
    corridor.stations.length >= 2 
      ? `${corridor.stations[0].name} – ${corridor.stations[1].name} Section` 
      : 'Mainline Block Section'
  );
  const [formStartKm, setFormStartKm] = useState<number>(corridor.stations[0]?.kmMarker || 850);
  const [formEndKm, setFormEndKm] = useState<number>((corridor.stations[0]?.kmMarker || 850) + 15);
  const [formTrack, setFormTrack] = useState<'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES' | 'YARD LOOP'>('UP MAIN');
  const [formDurationMinutes, setFormDurationMinutes] = useState<number>(180);
  const [formUrgency, setFormUrgency] = useState<UrgencyLevel>('High');
  const [formSafetyPriority, setFormSafetyPriority] = useState<1 | 2 | 3 | 4>(1);
  const [formRequiresTrafficBlock, setFormRequiresTrafficBlock] = useState<boolean>(true);
  const [formRequiresPowerBlock, setFormRequiresPowerBlock] = useState<boolean>(false);
  const [formRequiresDisconnectMemo, setFormRequiresDisconnectMemo] = useState<boolean>(true);
  const [formDefectDetails, setFormDefectDetails] = useState('');
  const [formResources, setFormResources] = useState<string>('P-Way Gang 4, Ultrasonic Testing Kit');

  // Subsystem options mapped by department
  const departmentSubsystems: Record<Department, string[]> = {
    'P-Way': [
      'Plain Track Tamping & Alignment (CSM/Duomatic)',
      'Turnout & Switch Point Tamping (Unimat)',
      'Deep Ballast Screening & Cleaning (BCM)',
      'Ultrasonic Flaw Detection (USFD) Defect Rectification',
      'Continuous Welded Rail (CWR) De-stressing',
      'High-Speed Curve Rail Grinding',
      'Glued Joint Replacement & Fishplate Oiling'
    ],
    'TRD': [
      '25kV AC OHE Contact & Catenary Wire Renewal',
      'Section Insulator & Neutral Section Calibration',
      'OHE Stagger Adjustment & Height Measurement',
      'Tower Wagon Cantilever & Dropper Overhaul',
      'Traction Substation (TSS) Feeder Switch Testing',
      'Tree Trimming & Electrical Safe Clearance'
    ],
    'S&T': [
      'Point Machine 104A/B Drive & Lock Overhaul',
      'Track Circuit Joint Resistance & Voltage Calibration',
      'Electronic Interlocking (EI) Diagnostic & Logic Check',
      'Digital Axle Counter (DAC) Head Alignment',
      'Signal Aspect LED & Route Indicator Testing',
      'Level Crossing (LC) Interlocking & Boom Verification'
    ]
  };

  // Handle department change in form
  const handleDeptChange = (dept: Department) => {
    setFormDept(dept);
    const subsystems = departmentSubsystems[dept];
    if (subsystems && subsystems.length > 0) {
      setFormSubsystem(subsystems[0]);
    }
    if (dept === 'TRD') {
      setFormRequiresPowerBlock(true);
      setFormRequiresTrafficBlock(true);
      setFormRequiresDisconnectMemo(false);
      setFormResources('Tower Wagon TW-402, TRD High-Voltage Power Crew');
    } else if (dept === 'S&T') {
      setFormRequiresPowerBlock(false);
      setFormRequiresTrafficBlock(true);
      setFormRequiresDisconnectMemo(true);
      setFormResources('Signal Inspector Gang, Electronic Multimeter Kit');
    } else {
      setFormRequiresPowerBlock(false);
      setFormRequiresTrafficBlock(true);
      setFormRequiresDisconnectMemo(true);
      setFormResources('Plasser 08-32 Tamping Machine, P-Way Gang 6');
    }
  };

  // Filtered Requisitions
  const filteredRequisitions = requisitions.filter(r => {
    const matchesDept = selectedDeptTab === 'ALL' || r.department === selectedDeptTab;
    const matchesUrgency = filterUrgency === 'ALL' || r.urgency === filterUrgency;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.defectDetails && r.defectDetails.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDept && matchesUrgency && matchesStatus && matchesSearch;
  });

  const pendingCount = requisitions.filter(r => r.status === 'pending').length;
  const bundledCount = requisitions.filter(r => r.status === 'bundled').length;

  // Handle form submission
  const handleSubmitRequisition = (e: React.FormEvent) => {
    e.preventDefault();

    const deptPrefix: Record<Department, 'TMS' | 'TDMS' | 'SMMS'> = {
      'P-Way': 'TMS',
      'TRD': 'TDMS',
      'S&T': 'SMMS'
    };

    const sourceSystem = deptPrefix[formDept];
    const newCode = `${sourceSystem}-${corridor.id.split('-')[0].toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const title = formTitle || `${formDept} Maintenance: ${formSubsystem} at Km ${formStartKm}-${formEndKm}`;

    const newReq: Requisition = {
      id: `req-${Date.now()}`,
      code: newCode,
      department: formDept,
      subsystem: formSubsystem,
      title,
      sectionId: `sec-${formStartKm}`,
      sectionName: formSectionName,
      startKm: formStartKm,
      endKm: formEndKm,
      track: formTrack,
      urgency: formUrgency,
      safetyPriority: formSafetyPriority,
      durationMinutes: formDurationMinutes,
      requiresPowerBlock: formRequiresPowerBlock,
      requiresTrafficBlock: formRequiresTrafficBlock,
      requiresDisconnectMemo: formRequiresDisconnectMemo,
      requiredResources: formResources.split(',').map(s => s.trim()).filter(Boolean),
      sourceSystem,
      defectDetails: formDefectDetails || 'Routine preventive asset overhaul & calibration.',
      status: 'pending'
    };

    onAddRequisition(newReq);
    setIsFormOpen(false);
    setSuccessToast(`Successfully raised requisition ${newReq.code} for ${formDept}. Registered for CP-SAT bundling.`);
    
    // Reset form fields
    setFormTitle('');
    setFormDefectDetails('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Card */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#181816] flex items-center justify-center text-[#FAF7F2] shrink-0 shadow-xs">
              <HardHat className="w-5 h-5 text-[#C87428]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2] uppercase tracking-wider font-mono">
                  Multi-Department Asset Management
                </span>
                <span className="text-xs text-[#636059] font-mono">
                  • TMS / TDMS / SMMS Integrated
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#181816] mt-0.5">
                Departmental Maintenance & Block Demands Portal
              </h2>
              <p className="text-xs text-[#636059] mt-0.5">
                Raise track defects, 25kV OHE possessions, and signalling disconnects. Automatically bundle cross-departmental works into integrated shadow blocks.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                handleDeptChange(selectedDeptTab === 'ALL' ? 'P-Way' : selectedDeptTab);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C87428]" />
              <span>Raise Maintenance Concern</span>
            </button>

            <button
              onClick={onGoToOptimizer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D7A4D] hover:bg-[#24633E] text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Run CP-SAT Optimizer ({pendingCount} Pending)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="mt-4 p-3 rounded-2xl bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D] flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D7A4D]" />
              <span>{successToast}</span>
            </div>
            <button 
              onClick={() => setSuccessToast(null)}
              className="text-[#2D7A4D] hover:underline font-bold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Department Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#EDE7DC]">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EFF5FB] text-[#2563eb] shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
                P-Way Track (TMS)
              </span>
              <span className="text-base font-bold text-[#181816] font-mono mt-0.5 block">
                {requisitions.filter(r => r.department === 'P-Way').length} Demands
              </span>
              <span className="text-[10.5px] text-[#636059]">Tamping, USFD, Rails</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FDF3EA] text-[#C87428] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
                TRD Electrical (TDMS)
              </span>
              <span className="text-base font-bold text-[#181816] font-mono mt-0.5 block">
                {requisitions.filter(r => r.department === 'TRD').length} Demands
              </span>
              <span className="text-[10.5px] text-[#636059]">25kV OHE, Droppers</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EBF5EE] text-[#2D7A4D] shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
                S&T Signalling (SMMS)
              </span>
              <span className="text-base font-bold text-[#181816] font-mono mt-0.5 block">
                {requisitions.filter(r => r.department === 'S&T').length} Demands
              </span>
              <span className="text-[10.5px] text-[#636059]">Points, Axle Counters</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF0F5] text-[#9333ea] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
                AI Bundling Status
              </span>
              <span className="text-base font-bold text-[#9333ea] font-mono mt-0.5 block">
                {bundledCount} / {requisitions.length} Bundled
              </span>
              <span className="text-[10.5px] text-[#2D7A4D] font-bold">120+ mins saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Department Tabs & Table Card */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        {/* Department Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#EDE7DC] pb-3">
          <button
            onClick={() => setSelectedDeptTab('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedDeptTab === 'ALL'
                ? 'bg-[#181816] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#636059] hover:text-[#181816] border border-[#E6E0D4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Departments ({requisitions.length})</span>
          </button>

          <button
            onClick={() => setSelectedDeptTab('P-Way')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedDeptTab === 'P-Way'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[#EFF5FB] text-[#2563eb] hover:bg-[#DCEBF9] border border-[#D0E2F5]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>P-Way / Engineering (TMS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-mono">
              {requisitions.filter(r => r.department === 'P-Way').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedDeptTab('TRD')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedDeptTab === 'TRD'
                ? 'bg-[#C87428] text-white shadow-xs'
                : 'bg-[#FDF3EA] text-[#C87428] hover:bg-[#F9E2CF] border border-[#F7D4B8]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TRD / Electrical (TDMS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-mono">
              {requisitions.filter(r => r.department === 'TRD').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedDeptTab('S&T')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedDeptTab === 'S&T'
                ? 'bg-[#2D7A4D] text-white shadow-xs'
                : 'bg-[#EBF5EE] text-[#2D7A4D] hover:bg-[#DCF0E2] border border-[#C6E7D2]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>S&T / Signalling (SMMS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-mono">
              {requisitions.filter(r => r.department === 'S&T').length}
            </span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#8F8A80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, defect, section, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs text-[#181816] focus:outline-none focus:border-[#181816]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterUrgency}
              onChange={e => setFilterUrgency(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs font-medium text-[#181816] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Urgency Tiers</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs font-medium text-[#181816] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Bundling Status</option>
              <option value="pending">Pending Bundling</option>
              <option value="bundled">Bundled in Block</option>
              <option value="scheduled">Scheduled / Sanctioned</option>
            </select>
          </div>
        </div>

        {/* Requisitions Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EDE7DC]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EDE7DC] text-[#636059] font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3 pl-4">Requisition ID</th>
                <th className="p-3">Department</th>
                <th className="p-3">Asset Work Title</th>
                <th className="p-3">Section & Line</th>
                <th className="p-3">Possession Needed</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Status</th>
                {onRemoveRequisition && <th className="p-3 text-right pr-4">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE7DC]">
              {filteredRequisitions.map(req => (
                <tr key={req.id} className="hover:bg-[#FAF7F2]/60 transition">
                  {/* Code */}
                  <td className="p-3 pl-4">
                    <span className="font-mono font-bold text-[#181816] text-xs block">
                      {req.code}
                    </span>
                    <span className="text-[10px] text-[#8F8A80] font-mono">
                      Source: {req.sourceSystem}
                    </span>
                  </td>

                  {/* Dept Badge */}
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      req.department === 'P-Way'
                        ? 'bg-[#EFF5FB] text-[#2563eb] border border-[#D0E2F5]'
                        : req.department === 'TRD'
                        ? 'bg-[#FDF3EA] text-[#C87428] border border-[#F7D4B8]'
                        : 'bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]'
                    }`}>
                      {req.department === 'P-Way' && <Wrench className="w-3 h-3" />}
                      {req.department === 'TRD' && <Zap className="w-3 h-3" />}
                      {req.department === 'S&T' && <Radio className="w-3 h-3" />}
                      <span>{req.department}</span>
                    </span>
                  </td>

                  {/* Title & Defect */}
                  <td className="p-3 max-w-xs">
                    <span className="font-bold text-[#181816] block line-clamp-1">
                      {req.title}
                    </span>
                    <span className="text-[11px] text-[#636059] line-clamp-1">
                      {req.defectDetails || req.subsystem}
                    </span>
                  </td>

                  {/* Section & Line */}
                  <td className="p-3 text-[11px]">
                    <div className="font-medium text-[#181816]">{req.sectionName}</div>
                    <div className="text-[#8F8A80] font-mono text-[10px]">
                      Km {req.startKm}–{req.endKm} • <span className="font-bold text-[#181816]">{req.track}</span>
                    </div>
                  </td>

                  {/* Possession Needed Badges */}
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {req.requiresTrafficBlock && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#EFF5FB] text-[#2563eb] border border-[#D0E2F5]" title="Traffic Block">
                          Traffic
                        </span>
                      )}
                      {req.requiresPowerBlock && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#FDF3EA] text-[#C87428] border border-[#F7D4B8]" title="Power Block 25kV OHE">
                          25kV OHE
                        </span>
                      )}
                      {req.requiresDisconnectMemo && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#FAF7F2] text-[#636059] border border-[#E6E0D4]" title="S&T Disconnect Memo">
                          Disconnect Memo
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration & Urgency */}
                  <td className="p-3">
                    <span className="font-mono font-bold text-[#181816] block">
                      {req.durationMinutes} mins
                    </span>
                    <span className={`text-[10px] font-bold uppercase font-mono ${
                      req.urgency === 'Emergency'
                        ? 'text-[#DC2626]'
                        : req.urgency === 'High'
                        ? 'text-[#C87428]'
                        : 'text-[#2D7A4D]'
                    }`}>
                      {req.urgency} Urgency
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold font-mono inline-flex items-center gap-1 ${
                      req.status === 'bundled'
                        ? 'bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]'
                        : req.status === 'scheduled'
                        ? 'bg-[#EFF5FB] text-[#2563eb] border border-[#D0E2F5]'
                        : 'bg-[#FDF3EA] text-[#C87428] border border-[#F7D4B8]'
                    }`}>
                      {req.status === 'bundled' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#2D7A4D]" />
                          <span>Bundled in Block</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-[#C87428]" />
                          <span>Pending Bundling</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Action */}
                  {onRemoveRequisition && (
                    <td className="p-3 text-right pr-4">
                      <button
                        onClick={() => onRemoveRequisition(req.id)}
                        className="p-1.5 rounded-lg text-[#8F8A80] hover:text-[#DC2626] hover:bg-[#FDF2F2] transition cursor-pointer"
                        title="Delete requisition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raise Maintenance Concern Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6E0D4] max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#181816] text-white">
                  <Wrench className="w-4 h-4 text-[#C87428]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181816]">
                    Raise Maintenance Concern / Block Requisition
                  </h3>
                  <p className="text-xs text-[#636059]">
                    Submit departmental demand to CP-SAT multi-departmental bundling engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F3EEE7] text-[#636059] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequisition} className="mt-4 flex flex-col gap-4 text-xs">
              {/* Department Selection */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Originating Department *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeptChange('P-Way')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      formDept === 'P-Way'
                        ? 'bg-[#EFF5FB] border-[#2563eb] text-[#2563eb]'
                        : 'bg-[#FAF7F2] border-[#E6E0D4] text-[#636059]'
                    }`}
                  >
                    🏗️ P-Way (TMS)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeptChange('TRD')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      formDept === 'TRD'
                        ? 'bg-[#FDF3EA] border-[#C87428] text-[#C87428]'
                        : 'bg-[#FAF7F2] border-[#E6E0D4] text-[#636059]'
                    }`}
                  >
                    ⚡ TRD (TDMS)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeptChange('S&T')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      formDept === 'S&T'
                        ? 'bg-[#EBF5EE] border-[#2D7A4D] text-[#2D7A4D]'
                        : 'bg-[#FAF7F2] border-[#E6E0D4] text-[#636059]'
                    }`}
                  >
                    🚦 S&T (SMMS)
                  </button>
                </div>
              </div>

              {/* Subsystem / Asset Work Type */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Asset Subsystem / Work Category</label>
                <select
                  value={formSubsystem}
                  onChange={e => setFormSubsystem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none"
                >
                  {departmentSubsystems[formDept].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Requisition Title (Optional)</label>
                <input
                  type="text"
                  placeholder={`e.g. ${formDept} Emergency Maintenance at ${formSectionName}`}
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#181816]"
                />
              </div>

              {/* Section, Km and Track */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="font-bold text-[#181816] block mb-1">Target Section</label>
                  <input
                    type="text"
                    value={formSectionName}
                    onChange={e => setFormSectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Km Range</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={formStartKm}
                      onChange={e => setFormStartKm(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs text-center"
                      placeholder="Start"
                    />
                    <span className="text-[#8F8A80]">-</span>
                    <input
                      type="number"
                      value={formEndKm}
                      onChange={e => setFormEndKm(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs text-center"
                      placeholder="End"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Track</label>
                  <select
                    value={formTrack}
                    onChange={e => setFormTrack(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                  >
                    <option value="UP MAIN">UP MAIN</option>
                    <option value="DOWN MAIN">DOWN MAIN</option>
                    <option value="BOTH LINES">BOTH LINES</option>
                    <option value="YARD LOOP">YARD LOOP</option>
                  </select>
                </div>
              </div>

              {/* Duration and Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Duration Required (Mins)</label>
                  <input
                    type="number"
                    value={formDurationMinutes}
                    onChange={e => setFormDurationMinutes(parseInt(e.target.value, 10) || 120)}
                    min={30}
                    max={480}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Urgency Level</label>
                  <select
                    value={formUrgency}
                    onChange={e => setFormUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none"
                  >
                    <option value="High">High Urgency</option>
                    <option value="Emergency">Emergency (Safety Critical)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low / Routine</option>
                  </select>
                </div>
              </div>

              {/* Possession Checkboxes */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Possession & Isolation Requirements</label>
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formRequiresTrafficBlock}
                      onChange={e => setFormRequiresTrafficBlock(e.target.checked)}
                      className="rounded text-[#181816] focus:ring-0"
                    />
                    <span>Traffic Block</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formRequiresPowerBlock}
                      onChange={e => setFormRequiresPowerBlock(e.target.checked)}
                      className="rounded text-[#181816] focus:ring-0"
                    />
                    <span>25kV OHE Power Block</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formRequiresDisconnectMemo}
                      onChange={e => setFormRequiresDisconnectMemo(e.target.checked)}
                      className="rounded text-[#181816] focus:ring-0"
                    />
                    <span>S&T Disconnect Memo</span>
                  </label>
                </div>
              </div>

              {/* Defect Specifics */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Defect Specifics / Field Report</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ultrasonic inspection detected weld fatigue flaw at Km 964.5 requiring urgent clamp possession."
                  value={formDefectDetails}
                  onChange={e => setFormDefectDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#181816]"
                />
              </div>

              {/* Machinery & Resources */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">Required Machinery & Resources</label>
                <input
                  type="text"
                  value={formResources}
                  onChange={e => setFormResources(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none"
                  placeholder="e.g. Plasser Duomatic Tamper, P-Way Gang 4"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EDE7DC]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] hover:bg-[#F3EEE7] text-[#636059] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
