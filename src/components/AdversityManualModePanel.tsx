import React, { useState } from 'react';
import { ManualModeState, Corridor, BlockWindow, Train } from '../types';
import { ShieldAlert, AlertTriangle, Cpu, Radio, Zap, Clock, CheckCircle2, RotateCcw, FileText, Ban, Power, ShieldCheck, X } from 'lucide-react';

interface AdversityManualModePanelProps {
  manualMode: ManualModeState;
  corridor: Corridor;
  blocks: BlockWindow[];
  trains: Train[];
  onToggleManualMode: (enable: boolean, reason?: string, contingency?: string) => void;
  onEmergencySuspendBlocks: () => void;
  onToggleGlobalCautionOrder: () => void;
  onManualShiftBlock: (blockId: string, newStart: string, newEnd: string, newLine: 'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES') => void;
  onGeneratePaperAuthority: () => void;
}

export const AdversityManualModePanel: React.FC<AdversityManualModePanelProps> = ({
  manualMode,
  corridor,
  blocks,
  trains,
  onToggleManualMode,
  onEmergencySuspendBlocks,
  onToggleGlobalCautionOrder,
  onManualShiftBlock,
  onGeneratePaperAuthority
}) => {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Major Signalling & Telecommunication (S&T) Failures / Route Relay Breakdown');
  const [selectedContingency, setSelectedContingency] = useState('Manual Station Dispatching & Paper Line Clear Authority (T/A 912)');
  const [controllerName, setControllerName] = useState('R. K. Sharma (Chief Controller - Prayagraj Division)');

  // Direct manual block adjustment state
  const [manualBlockStart, setManualBlockStart] = useState(blocks[0]?.startTime || '02:00');
  const [manualBlockEnd, setManualBlockEnd] = useState(blocks[0]?.endTime || '05:00');
  const [manualBlockLine, setManualBlockLine] = useState<'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES'>('UP MAIN');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const adversityReasons = [
    {
      title: 'Major S&T / Point Machine Failure',
      desc: 'Automatic signals dark / Electronic Interlocking glitch',
      contingency: 'Manual Station Dispatching & Paper Authority T/A 912'
    },
    {
      title: 'Dense Fog / Zero-Visibility Weather',
      desc: 'Severe fog in Northern Zone, speed cap 30-60 km/h',
      contingency: 'Universal Caution Order T/409 & Fog Pass Schedule'
    },
    {
      title: 'Emergency Rail Fracture / Mainline Obstruction',
      desc: 'Track defect detected, immediate manual possession required',
      contingency: 'Suspend All Traffic & Deploy Emergency P-Way Gang'
    },
    {
      title: 'Derailment / Breakdown Crane Movement',
      desc: 'Accident Relief Medical Van (ARMV) priority right-of-way',
      contingency: 'Emergency Line Clearance & Regulate All Other Trains'
    },
    {
      title: 'Grid Power Tripping / 25kV OHE Breakdown',
      desc: 'Traction substation failure, electric locomotives disabled',
      contingency: 'Diesel Rake Rescue & De-energize Sector'
    }
  ];

  const handleActivateManual = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleManualMode(true, selectedReason, selectedContingency);
    setShowOverrideModal(false);
  };

  const handleApplyManualBlockShift = () => {
    if (blocks[0]) {
      onManualShiftBlock(blocks[0].id, manualBlockStart, manualBlockEnd, manualBlockLine);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Banner Indicator */}
      {manualMode.isManualMode ? (
        <div className="bg-[#FDF2F2] border border-[#F8D7D7] rounded-3xl p-5 shadow-xs text-[#181816] animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-[#C53030] text-white shrink-0 mt-0.5 shadow-xs animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-3 py-0.5 rounded-full bg-[#C53030] text-white">
                    ADVERSITY CONTINGENCY • MANUAL OVERRIDE ACTIVE
                  </span>
                  <span className="text-xs font-mono text-[#8F8A80]">
                    Since {manualMode.activatedAt}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#181816] mt-1 font-cinzel">
                  Controller Direct Manual Dispatch & Intervention Active
                </h3>
                <p className="text-xs text-[#636059] mt-0.5">
                  <strong>Adversity Trigger:</strong> {manualMode.adversityReason} • <strong>Authorizing Controller:</strong> {manualMode.activatedBy}
                </p>
              </div>
            </div>

            {/* Actions in Manual Mode */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onEmergencySuspendBlocks}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition ${
                  manualMode.manualBlocksSuspended
                    ? 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]'
                    : 'bg-white hover:bg-[#F3EEE7] text-[#C53030] border-[#E6E0D4]'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                {manualMode.manualBlocksSuspended ? 'Blocks Suspended (Mainline Clear)' : 'Suspend Maintenance Blocks'}
              </button>

              <button
                onClick={onToggleGlobalCautionOrder}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition ${
                  manualMode.manualCautionOrderActive
                    ? 'bg-[#FDF3EA] text-[#C87428] border-[#F7D4B8]'
                    : 'bg-white hover:bg-[#F3EEE7] text-[#181816] border-[#E6E0D4]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {manualMode.manualCautionOrderActive ? 'Caution Order Active (30 km/h)' : 'Impose Caution Order T/409'}
              </button>

              <button
                onClick={onGeneratePaperAuthority}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F3EEE7] text-[#181816] text-xs font-bold border border-[#E6E0D4] transition"
              >
                <FileText className="w-3.5 h-3.5 text-[#C87428]" />
                Paper Authority (T/A 912)
              </button>

              <button
                onClick={() => onToggleManualMode(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#2D7A4D]" />
                Hand Back to AI Automation
              </button>
            </div>
          </div>

          {/* Quick Manual Block Modifier in Manual Mode */}
          <div className="mt-4 pt-4 border-t border-[#F8D7D7] grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
            <div className="lg:col-span-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C87428]" />
              <span className="font-bold text-[#181816]">Manual Block Window Customizer:</span>
            </div>
            <div className="lg:col-span-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#636059]">Start:</span>
                <input
                  type="time"
                  value={manualBlockStart}
                  onChange={e => setManualBlockStart(e.target.value)}
                  className="bg-white border border-[#E6E0D4] rounded-lg px-2.5 py-1 text-xs text-[#181816] font-mono focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#636059]">End:</span>
                <input
                  type="time"
                  value={manualBlockEnd}
                  onChange={e => setManualBlockEnd(e.target.value)}
                  className="bg-white border border-[#E6E0D4] rounded-lg px-2.5 py-1 text-xs text-[#181816] font-mono focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#636059]">Track:</span>
                <select
                  value={manualBlockLine}
                  onChange={e => setManualBlockLine(e.target.value as any)}
                  className="bg-white border border-[#E6E0D4] rounded-lg px-2.5 py-1 text-xs text-[#181816] focus:outline-none"
                >
                  <option value="UP MAIN">UP MAIN</option>
                  <option value="DOWN MAIN">DOWN MAIN</option>
                  <option value="BOTH LINES">BOTH LINES</option>
                </select>
              </div>
              <button
                onClick={handleApplyManualBlockShift}
                className="px-4 py-1.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold transition shadow-xs text-xs"
              >
                Force Apply Manual Schedule
              </button>
              {showSuccessToast && (
                <span className="text-[#2D7A4D] font-bold text-xs flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Manual Schedule Applied!
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Standby State — Ability to trigger Manual Mode during Adversity */
        <div className="bg-white border border-[#E6E0D4] rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#181816] flex items-center gap-2">
                Operating State: Autonomous AI CP-SAT Solver Active
                <span className="w-2 h-2 rounded-full bg-[#2D7A4D] animate-ping"></span>
              </span>
              <span className="text-[#636059] block text-[11px]">
                Continuous optimization running. In case of emergency or severe adversity, switch to Section Controller Manual Override.
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowOverrideModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] font-bold text-xs border border-[#E6E0D4] transition"
          >
            <Power className="w-3.5 h-3.5 text-[#C87428]" />
            Switch to Manual Override Mode
          </button>
        </div>
      )}

      {/* ADVERSITY OVERRIDE MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 text-[#181816]">
            <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FDF2F2] text-[#C53030]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181816]">
                    Activate Section Controller Manual Override
                  </h3>
                  <p className="text-xs text-[#636059]">
                    Adversity Contingency Protocol for {corridor.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="p-1.5 rounded-full text-[#8F8A80] hover:text-[#181816] hover:bg-[#F3EEE7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleActivateManual} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[#636059] font-bold mb-1.5 uppercase text-[10px]">
                  Select Operational Adversity Scenario
                </label>
                <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                  {adversityReasons.map((item, idx) => (
                    <label
                      key={idx}
                      onClick={() => {
                        setSelectedReason(item.title);
                        setSelectedContingency(item.contingency);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-2 ${
                        selectedReason === item.title
                          ? 'bg-[#FAF7F2] border-[#181816] shadow-xs ring-1 ring-[#181816]'
                          : 'bg-white border-[#E6E0D4] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#181816]">{item.title}</div>
                        <div className="text-[11px] text-[#636059] mt-0.5">{item.desc}</div>
                      </div>
                      <input
                        type="radio"
                        name="adversityReason"
                        checked={selectedReason === item.title}
                        onChange={() => {}}
                        className="mt-1 text-[#181816]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#636059] font-bold mb-1 uppercase text-[10px]">
                  Active Contingency Protocol
                </label>
                <input
                  type="text"
                  value={selectedContingency}
                  onChange={e => setSelectedContingency(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#636059] font-bold mb-1 uppercase text-[10px]">
                  Authorizing Section Controller Name
                </label>
                <input
                  type="text"
                  value={controllerName}
                  onChange={e => setControllerName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E6E0D4] rounded-xl p-2.5 text-[#181816] focus:outline-none"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] text-[11px] text-[#636059]">
                <strong className="text-[#181816]">Legal & Audit Declaration:</strong> All automated block algorithms will be placed under Section Controller direct command. Disconnected signals or manually altered blocks will be logged immutably.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE7DC]">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F3EEE7] text-[#636059] hover:bg-[#EAE4D9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#C53030] text-white font-bold hover:bg-[#A82828] shadow-xs"
                >
                  Engage Manual Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
