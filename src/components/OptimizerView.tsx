import React, { useState } from 'react';
import { Corridor, Requisition, BlockWindow, Department } from '../types';
import { Sparkles, Cpu, ShieldAlert, CheckCircle2, Clock, Zap, Wrench, Radio, Layers, Plus, ArrowRight, TrendingUp, AlertCircle, X } from 'lucide-react';
import { formatDuration } from '../utils/timeUtils';

interface OptimizerViewProps {
  corridor: Corridor;
  requisitions: Requisition[];
  blocks: BlockWindow[];
  onAddRequisition: (req: Requisition) => void;
  onApplyOptimization: () => void;
  onSelectBlock: (blk: BlockWindow) => void;
}

export const OptimizerView: React.FC<OptimizerViewProps> = ({
  corridor,
  requisitions,
  blocks,
  onAddRequisition,
  onApplyOptimization,
  onSelectBlock
}) => {
  const [selectedDept, setSelectedDept] = useState<'ALL' | Department>('ALL');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Requisition Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState<Department>('P-Way');
  const [newSubsystem, setNewSubsystem] = useState('Track Tamping');
  const [newDuration, setNewDuration] = useState(120);
  const [newTrack, setNewTrack] = useState<'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES'>('UP MAIN');
  const [newStartKm, setNewStartKm] = useState(960);
  const [newEndKm, setNewEndKm] = useState(970);
  const [newUrgency, setNewUrgency] = useState<'Emergency' | 'High' | 'Medium' | 'Low'>('High');

  const filteredReqs = requisitions.filter(r => selectedDept === 'ALL' || r.department === selectedDept);

  const pendingReqs = filteredReqs.filter(r => r.status === 'pending');
  const bundledReqs = filteredReqs.filter(r => r.status === 'bundled');

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    setOptimizationStep(1);

    // Step 1: Prioritize
    await new Promise(r => setTimeout(r, 600));
    setOptimizationStep(2);

    // Step 2: Match compatible
    await new Promise(r => setTimeout(r, 600));
    setOptimizationStep(3);

    // Step 3: Constraint solving
    await new Promise(r => setTimeout(r, 700));
    setOptimizationStep(4);

    // Step 4: Pareto Ranking
    await new Promise(r => setTimeout(r, 500));
    setIsOptimizing(false);
    onApplyOptimization();
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newReq: Requisition = {
      id: `req-custom-${Date.now()}`,
      code: `${newDept === 'P-Way' ? 'TMS' : newDept === 'TRD' ? 'TDMS' : 'SMMS'}-NCR-2025-${Math.floor(100 + Math.random() * 900)}`,
      department: newDept,
      subsystem: newSubsystem,
      title: newTitle,
      sectionId: 'sec-custom',
      sectionName: `${corridor.stations[1]?.name || 'Fatehpur'} Section`,
      startKm: Number(newStartKm),
      endKm: Number(newEndKm),
      track: newTrack,
      urgency: newUrgency,
      safetyPriority: newUrgency === 'Emergency' ? 1 : newUrgency === 'High' ? 2 : 3,
      durationMinutes: Number(newDuration),
      requiresPowerBlock: newDept === 'TRD',
      requiresTrafficBlock: true,
      requiresDisconnectMemo: newDept === 'S&T' || newDept === 'P-Way',
      requiredResources: [`${newDept} Special Team No. 4`, 'Field Equipment Unit'],
      sourceSystem: newDept === 'P-Way' ? 'TMS' : newDept === 'TRD' ? 'TDMS' : 'SMMS',
      status: 'pending',
      defectDetails: `Manual operator log for ${newTitle} at Km ${newStartKm}-${newEndKm}`
    };

    onAddRequisition(newReq);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div id="optimizer-view" className="flex flex-col gap-6 text-[#181816]">
      {/* SIH Decision Support Flow Pipeline Banner */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#C87428] text-white">
                Core Decision Engine
              </span>
              <span className="text-xs text-[#636059] font-mono bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E6E0D4]">Hybrid ML + CP-SAT Solver</span>
            </div>
            <h2 className="text-lg font-bold text-[#181816] mt-1.5 font-cinzel">
              Multi-Departmental Activity Bundler & Block Optimizer
            </h2>
            <p className="text-xs text-[#636059]">
              Correlates uncoordinated maintenance requisitions across TMS (P-Way), TDMS (TRD), and SMMS (S&T) to synthesize single integrated shadow possession windows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-add-requisition"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] text-xs font-semibold border border-[#E6E0D4] transition"
            >
              <Plus className="w-4 h-4 text-[#2D7A4D]" />
              New Requisition
            </button>

            <button
              id="btn-run-ai-optimizer"
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-sm transition disabled:opacity-50 active:scale-95"
            >
              {isOptimizing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-white" />
                  Solving CP-SAT Constraints...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C87428]" />
                  Run AI Optimizer
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div className={`p-4 rounded-2xl border transition ${optimizationStep === 1 || (!isOptimizing && blocks.length > 0) ? 'bg-[#FAF7F2] border-[#181816] text-[#181816] shadow-xs' : 'bg-[#FAF7F2]/50 border-[#E6E0D4] text-[#636059]'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>1. Prioritize Critical Work</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6E0D4] text-[#181816] font-mono">Safety &gt; Urgency</span>
            </div>
            <p className="text-[11px] text-[#636059]">Ranks TMS/TDMS/SMMS backlogs by track fatigue, OHE wear & USFD defects.</p>
          </div>

          <div className={`p-4 rounded-2xl border transition ${optimizationStep === 2 || (!isOptimizing && blocks.length > 0) ? 'bg-[#EBF5EE] border-[#C6E7D2] text-[#2D7A4D] shadow-xs' : 'bg-[#FAF7F2]/50 border-[#E6E0D4] text-[#636059]'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>2. Match Compatible Tasks</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6E7D2] text-[#2D7A4D] font-mono">Shadow Blocking</span>
            </div>
            <p className="text-[11px] text-[#636059]">Bundles P-Way tamping with OHE de-energizing and S&T point overhaul.</p>
          </div>

          <div className={`p-4 rounded-2xl border transition ${optimizationStep === 3 || (!isOptimizing && blocks.length > 0) ? 'bg-[#EFF5FB] border-[#CCE0F5] text-[#2B5C8F] shadow-xs' : 'bg-[#FAF7F2]/50 border-[#E6E0D4] text-[#636059]'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>3. Optimize Constraints</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CCE0F5] text-[#2B5C8F] font-mono">CP-SAT Engine</span>
            </div>
            <p className="text-[11px] text-[#636059]">Respects high-priority passenger train headways and freight siding regulation.</p>
          </div>

          <div className={`p-4 rounded-2xl border transition ${optimizationStep === 4 || (!isOptimizing && blocks.length > 0) ? 'bg-[#FDF3EA] border-[#F7D4B8] text-[#C87428] shadow-xs' : 'bg-[#FAF7F2]/50 border-[#E6E0D4] text-[#636059]'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>4. Rank Feasible Options</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7D4B8] text-[#C87428] font-mono">Confidence Score</span>
            </div>
            <p className="text-[11px] text-[#636059]">Advisory recommendations for Section Controller validation.</p>
          </div>
        </div>
      </div>

      {/* Main Content: Requisitions Table & Candidate Block Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requisitions Inbox (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#181816]">
                  Maintenance Requisitions Feed
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F3EEE7] text-[#181816] border border-[#E6E0D4] font-mono font-bold">
                  {requisitions.length} Total ({pendingReqs.length} Unbundled)
                </span>
              </div>

              {/* Department Filter */}
              <div className="flex items-center bg-[#F3EEE7] p-1 rounded-full border border-[#E6E0D4] text-xs shadow-xs">
                <button
                  id="dept-filter-all"
                  onClick={() => setSelectedDept('ALL')}
                  className={`px-3 py-1 rounded-full font-medium transition ${selectedDept === 'ALL' ? 'bg-[#181816] text-white' : 'text-[#636059] hover:text-[#181816]'}`}
                >
                  All ({requisitions.length})
                </button>
                <button
                  id="dept-filter-pway"
                  onClick={() => setSelectedDept('P-Way')}
                  className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 transition ${selectedDept === 'P-Way' ? 'bg-[#181816] text-white' : 'text-[#636059] hover:text-[#181816]'}`}
                >
                  <Wrench className="w-3 h-3" /> P-Way
                </button>
                <button
                  id="dept-filter-trd"
                  onClick={() => setSelectedDept('TRD')}
                  className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 transition ${selectedDept === 'TRD' ? 'bg-[#2B5C8F] text-white' : 'text-[#636059] hover:text-[#181816]'}`}
                >
                  <Zap className="w-3 h-3" /> TRD
                </button>
                <button
                  id="dept-filter-st"
                  onClick={() => setSelectedDept('S&T')}
                  className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 transition ${selectedDept === 'S&T' ? 'bg-[#2D7A4D] text-white' : 'text-[#636059] hover:text-[#181816]'}`}
                >
                  <Radio className="w-3 h-3" /> S&T
                </button>
              </div>
            </div>

            {/* Requisition Cards List */}
            <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredReqs.map(req => {
                const isBundled = req.status === 'bundled';

                return (
                  <div
                    key={req.id}
                    id={`req-card-${req.id}`}
                    className={`p-4 rounded-2xl border transition ${
                      isBundled
                        ? 'bg-[#FAF7F2] border-[#E6E0D4] opacity-80'
                        : 'bg-white border-[#E6E0D4] hover:border-[#181816]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              req.department === 'P-Way'
                                ? 'bg-[#F3EEE7] text-[#181816] border border-[#E6E0D4]'
                                : req.department === 'TRD'
                                ? 'bg-[#EFF5FB] text-[#2B5C8F] border border-[#CCE0F5]'
                                : 'bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]'
                            }`}
                          >
                            {req.sourceSystem} • {req.department}
                          </span>
                          <span className="text-xs font-semibold text-[#181816]">
                            {req.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#636059] mt-1.5">
                          {req.defectDetails || req.subsystem}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            req.urgency === 'Emergency'
                              ? 'bg-[#C53030] text-white shadow-xs'
                              : req.urgency === 'High'
                              ? 'bg-[#FDF3EA] text-[#C87428] border border-[#F7D4B8]'
                              : 'bg-[#F3EEE7] text-[#636059]'
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <div className="text-[11px] font-mono text-[#8F8A80] mt-1">
                          {formatDuration(req.durationMinutes)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#EDE7DC] text-[11px] text-[#636059]">
                      <div className="flex items-center gap-3">
                        <span>📍 Km {req.startKm}–{req.endKm} ({req.track})</span>
                        {req.requiresPowerBlock && (
                          <span className="text-[#2B5C8F] flex items-center gap-0.5 font-medium">
                            <Zap className="w-3 h-3" /> Power Block Req.
                          </span>
                        )}
                        {req.requiresDisconnectMemo && (
                          <span className="text-[#2D7A4D] flex items-center gap-0.5 font-medium">
                            <ShieldAlert className="w-3 h-3" /> S&T Memo
                          </span>
                        )}
                      </div>

                      <span className={`font-mono text-[10px] font-bold ${isBundled ? 'text-[#2D7A4D]' : 'text-[#C87428]'}`}>
                        {isBundled ? `✓ Bundled in ${req.assignedBlockId}` : '⏳ Pending Optimization'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Synthesized Block Windows (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#181816]">
                  AI Integrated Block Proposals
                </h3>
                <p className="text-[11px] text-[#636059]">
                  Multi-objective CP-SAT solution candidates
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#EBF5EE] text-[#2D7A4D] px-2.5 py-1 rounded-full border border-[#C6E7D2]">
                {blocks.length} Active Plan
              </span>
            </div>

            {/* Block Cards List */}
            <div className="flex flex-col gap-4">
              {blocks.map(blk => (
                <div
                  key={blk.id}
                  id={`block-card-${blk.id}`}
                  onClick={() => onSelectBlock(blk)}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] hover:border-[#181816]/50 cursor-pointer transition shadow-xs flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#181816] bg-white px-2 py-0.5 rounded border border-[#E6E0D4]">
                          {blk.code}
                        </span>
                        <span className="text-xs font-bold text-[#181816] group-hover:text-[#C87428] transition">
                          {blk.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#636059] mt-1">
                        {blk.sectionName} ({blk.lineType})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#181816] bg-white px-2.5 py-1 rounded-full border border-[#E6E0D4] block">
                        {blk.startTime} – {blk.endTime}
                      </span>
                      <span className="text-[10px] text-[#8F8A80] mt-0.5 block">
                        {blk.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Bundled Requisitions Badges */}
                  <div className="bg-white p-3 rounded-xl border border-[#E6E0D4] flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider">
                      Bundled Department Requisitions ({blk.bundledRequisitions.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {blk.bundledRequisitions.map(r => (
                        <span
                          key={r.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3EEE7] text-[#181816] border border-[#E6E0D4]"
                        >
                          {r.department}: {r.subsystem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EDE7DC] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#8F8A80] block">Asset Availability</span>
                      <strong className="text-[#2D7A4D] font-mono">+{blk.metrics.assetAvailabilityGainPercent}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8F8A80] block">Possession Saved</span>
                      <strong className="text-[#181816] font-mono">{blk.metrics.possessionHoursSavedMinutes} mins</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8F8A80] block">Confidence</span>
                      <strong className="text-[#C87428] font-mono">{blk.confidenceScore}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#181816] pt-1 font-semibold">
                    <span className="flex items-center gap-1 text-[11px] text-[#636059]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A4D]" /> Multi-Dept Pre-Checked
                    </span>
                    <span className="flex items-center gap-1 text-[#181816] group-hover:translate-x-1 transition text-[11px]">
                      Advisory Sanctions <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE REQUISITION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-3 mb-4">
              <h4 className="text-sm font-bold text-[#181816]">
                Ingest Maintenance Requisition into Optimizer
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8F8A80] hover:text-[#181816] p-1 rounded-full hover:bg-[#F3EEE7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequisition} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[#636059] font-medium mb-1">Requisition Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Ultrasonic Flaw Detection (USFD) & Rail Grinding"
                  className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none focus:ring-2 focus:ring-[#181816]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#636059] font-medium mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={e => setNewDept(e.target.value as Department)}
                    className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  >
                    <option value="P-Way">P-Way (Permanent Way)</option>
                    <option value="TRD">TRD (Traction Distribution)</option>
                    <option value="S&T">S&T (Signal & Telecom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#636059] font-medium mb-1">Urgency</label>
                  <select
                    value={newUrgency}
                    onChange={e => setNewUrgency(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#636059] font-medium mb-1">Track</label>
                  <select
                    value={newTrack}
                    onChange={e => setNewTrack(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  >
                    <option value="UP MAIN">UP MAIN</option>
                    <option value="DOWN MAIN">DOWN MAIN</option>
                    <option value="BOTH LINES">BOTH LINES</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#636059] font-medium mb-1">Start Km</label>
                  <input
                    type="number"
                    value={newStartKm}
                    onChange={e => setNewStartKm(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#636059] font-medium mb-1">End Km</label>
                  <input
                    type="number"
                    value={newEndKm}
                    onChange={e => setNewEndKm(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE7DC]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F3EEE7] text-[#636059] hover:bg-[#EAE4D9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#181816] text-white font-bold hover:bg-[#2C2B27]"
                >
                  Save & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
