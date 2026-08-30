import React, { useState } from 'react';
import { Corridor, Requisition, BlockWindow, Department } from '../types';
import { Sparkles, Cpu, ShieldAlert, CheckCircle2, Clock, Zap, Wrench, Radio, Layers, Plus, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
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
    <div id="optimizer-view" className="flex flex-col gap-6">
      {/* SIH Decision Support Flow Pipeline Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                SIH PS-26027 Core Decision Engine
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Hybrid ML + CP-SAT Solver</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5">
              Multi-Departmental Activity Bundler & Block Optimizer
            </h2>
            <p className="text-xs text-slate-400">
              Correlates uncoordinated maintenance requisitions across TMS (P-Way), TDMS (TRD), and SMMS (S&T) to synthesize single integrated shadow possession windows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-add-requisition"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              New Requisition
            </button>

            <button
              id="btn-run-ai-optimizer"
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 border border-indigo-400/30 transition disabled:opacity-50 active:scale-95"
            >
              {isOptimizing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-white" />
                  Solving CP-SAT Constraints...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Run AI Optimizer
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div className={`p-3.5 rounded-xl border transition ${optimizationStep === 1 || (!isOptimizing && blocks.length > 0) ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 shadow-sm' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>1. Prioritize Critical Work</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono">Safety &gt; Urgency</span>
            </div>
            <p className="text-[11px] text-slate-400">Ranks TMS/TDMS/SMMS backlogs by track fatigue, OHE wear & USFD defects.</p>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${optimizationStep === 2 || (!isOptimizing && blocks.length > 0) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>2. Match Compatible Tasks</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono">Shadow Blocking</span>
            </div>
            <p className="text-[11px] text-slate-400">Bundles P-Way tamping with OHE de-energizing and S&T point overhaul.</p>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${optimizationStep === 3 || (!isOptimizing && blocks.length > 0) ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 shadow-sm' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>3. Optimize Constraints</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono">CP-SAT Engine</span>
            </div>
            <p className="text-[11px] text-slate-400">Respects high-priority passenger train headways and freight siding regulation.</p>
          </div>

          <div className={`p-3.5 rounded-xl border transition ${optimizationStep === 4 || (!isOptimizing && blocks.length > 0) ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 shadow-sm' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>4. Rank Feasible Options</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono">Confidence Score</span>
            </div>
            <p className="text-[11px] text-slate-400">Advisory recommendations for Section Controller validation.</p>
          </div>
        </div>
      </div>

      {/* Main Content: Requisitions Table & Candidate Block Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requisitions Inbox (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Maintenance Requisitions Feed
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-indigo-400 border border-slate-800 font-mono font-bold">
                  {requisitions.length} Total ({pendingReqs.length} Unbundled)
                </span>
              </div>

              {/* Department Filter */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
                <button
                  id="dept-filter-all"
                  onClick={() => setSelectedDept('ALL')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${selectedDept === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  All ({requisitions.length})
                </button>
                <button
                  id="dept-filter-pway"
                  onClick={() => setSelectedDept('P-Way')}
                  className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${selectedDept === 'P-Way' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Wrench className="w-3 h-3" /> P-Way
                </button>
                <button
                  id="dept-filter-trd"
                  onClick={() => setSelectedDept('TRD')}
                  className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${selectedDept === 'TRD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Zap className="w-3 h-3" /> TRD (OHE)
                </button>
                <button
                  id="dept-filter-st"
                  onClick={() => setSelectedDept('S&T')}
                  className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${selectedDept === 'S&T' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
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
                    className={`p-4 rounded-xl border transition ${
                      isBundled
                        ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        : 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                              req.department === 'P-Way'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : req.department === 'TRD'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {req.sourceSystem} • {req.department}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {req.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          {req.defectDetails || req.subsystem}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                            req.urgency === 'Emergency'
                              ? 'bg-rose-500 text-white shadow-sm'
                              : req.urgency === 'High'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          {formatDuration(req.durationMinutes)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>📍 Km {req.startKm}–{req.endKm} ({req.track})</span>
                        {req.requiresPowerBlock && (
                          <span className="text-blue-400 flex items-center gap-0.5 font-medium">
                            <Zap className="w-3 h-3" /> Power Block Req.
                          </span>
                        )}
                        {req.requiresDisconnectMemo && (
                          <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                            <ShieldAlert className="w-3 h-3" /> S&T Memo
                          </span>
                        )}
                      </div>

                      <div>
                        {isBundled ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Bundled in {req.assignedBlockId}
                          </span>
                        ) : (
                          <span className="text-indigo-400 text-[10px] bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-medium">
                            Awaiting AI Bundler
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Proposed Integrated Blocks (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Ranked Integrated Block Plans
              </h3>
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {blocks.length} Option{blocks.length > 1 ? 's' : ''} Feasible
              </span>
            </div>

            {blocks.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-dashed border-slate-800 text-slate-400">
                <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
                <p className="text-xs">No integrated blocks generated yet.</p>
                <button
                  onClick={handleRunOptimizer}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md transition"
                >
                  Run Solver Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {blocks.map(blk => (
                  <div
                    key={blk.id}
                    id={`candidate-block-${blk.id}`}
                    onClick={() => onSelectBlock(blk)}
                    className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 hover:border-indigo-400 transition cursor-pointer shadow-lg group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-indigo-300">
                            {blk.code}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {blk.confidenceScore}% Confidence Score
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {blk.title}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-indigo-200 bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800">
                          {blk.startTime} – {blk.endTime}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {blk.durationMinutes} mins
                        </div>
                      </div>
                    </div>

                    {/* Section details */}
                    <div className="text-xs text-slate-400 mt-2">
                      📍 {blk.sectionName} ({blk.lineType})
                    </div>

                    {/* Bundled Activities preview */}
                    <div className="mt-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>Coordinated Departments:</span>
                        <div className="flex items-center gap-1">
                          {blk.departmentsInvolved.map(dept => (
                            <span
                              key={dept}
                              className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                                dept === 'P-Way'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : dept === 'TRD'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Simultaneously executing <strong>{blk.bundledRequisitions.length} tasks</strong> under single 25kV power & traffic isolation window.
                      </p>
                    </div>

                    {/* Value Metrics Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Asset Availability</div>
                        <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{blk.metrics.assetAvailabilityGainPercent}% Gain
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Possession Saved</div>
                        <div className="text-sm font-bold text-indigo-300 mt-0.5">
                          {blk.metrics.possessionHoursSavedMinutes} Mins Saved
                        </div>
                      </div>
                    </div>

                    {/* Train Impact Note */}
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Passenger Trains Delayed: <strong className="text-emerald-400">{blk.punctualityImpact.totalDelayMinutes === 0 ? '0 mins' : `${blk.punctualityImpact.totalDelayMinutes} mins`}</strong>
                      </span>
                      <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        Inspect & Validate <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Requisition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Create Maintenance Requisition
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter track maintenance, OHE electrical, or signaling demand parameters for AI corridor planning.
            </p>

            <form onSubmit={handleCreateRequisition} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Requisition Title / Activity Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Turnout 102B Point Machine Overhaul & Lubrication"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={e => {
                      const dept = e.target.value as Department;
                      setNewDept(dept);
                      setNewSubsystem(dept === 'P-Way' ? 'Track Tamping' : dept === 'TRD' ? 'OHE Inspection' : 'Point Overhaul');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="P-Way">Engineering (P-Way)</option>
                    <option value="TRD">Electrical Traction (TRD)</option>
                    <option value="S&T">Signaling & Telecom (S&T)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Urgency
                  </label>
                  <select
                    value={newUrgency}
                    onChange={e => setNewUrgency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Emergency">Emergency (Immediate)</option>
                    <option value="High">High (Within 24 hrs)</option>
                    <option value="Medium">Medium (Scheduled)</option>
                    <option value="Low">Low (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="480"
                    step="15"
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Start Km
                  </label>
                  <input
                    type="number"
                    value={newStartKm}
                    onChange={e => setNewStartKm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    End Km
                  </label>
                  <input
                    type="number"
                    value={newEndKm}
                    onChange={e => setNewEndKm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                >
                  Add to Optimization Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
