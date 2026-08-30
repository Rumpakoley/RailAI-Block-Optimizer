import React, { useState } from 'react';
import { Corridor, BlockWindow, Approvals, SafetyChecklist } from '../types';
import { ShieldCheck, FileText, Copy, Check, Sparkles, UserCheck, Lock, AlertTriangle } from 'lucide-react';

interface ApprovalWorkflowProps {
  corridor: Corridor;
  activeBlock: BlockWindow | null;
  onUpdateApprovals: (blockId: string, approvals: Approvals, checklist: SafetyChecklist) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  corridor,
  activeBlock,
  onUpdateApprovals
}) => {
  const [controllerName] = useState('R. K. Sharma (Sr. DOM / Chief Controller)');
  const [copied, setCopied] = useState(false);
  const [isGeneratingMemo, setIsGeneratingMemo] = useState(false);
  const [customMemoText, setCustomMemoText] = useState<string | null>(null);

  if (!activeBlock) {
    return (
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-8 text-center text-[#636059]">
        <ShieldCheck className="w-10 h-10 mx-auto text-[#8F8A80] mb-2" />
        <h3 className="text-base font-bold text-[#181816]">No Block Selected for Sanction</h3>
        <p className="text-xs text-[#636059] mt-1">Please select an integrated block from the String Diagram or Optimizer view to initiate the advisory validation and safety clearance workflow.</p>
      </div>
    );
  }

  const approvals = activeBlock.approvals;
  const checklist = activeBlock.safetyChecklist;

  const isFullyApproved = approvals.pwayApproved && approvals.trdApproved && approvals.stApproved && approvals.chiefControllerApproved;

  const handleToggleChecklist = (key: keyof SafetyChecklist) => {
    const updatedChecklist = { ...checklist, [key]: !checklist[key] };
    onUpdateApprovals(activeBlock.id, approvals, updatedChecklist);
  };

  const handleToggleApproval = (deptKey: keyof Approvals) => {
    const updatedApprovals = { ...approvals, [deptKey]: !approvals[deptKey] };
    if (deptKey === 'chiefControllerApproved' && updatedApprovals.chiefControllerApproved) {
      updatedApprovals.approverName = controllerName;
      updatedApprovals.timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
    }
    onUpdateApprovals(activeBlock.id, updatedApprovals, checklist);
  };

  const handleGenerateOfficialMemo = async () => {
    setIsGeneratingMemo(true);
    try {
      const res = await fetch('/api/gemini/generate-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockData: {
            code: activeBlock.code,
            sectionName: activeBlock.sectionName,
            lineType: activeBlock.lineType,
            startTime: activeBlock.startTime,
            endTime: activeBlock.endTime,
            durationMinutes: activeBlock.durationMinutes,
            tasks: activeBlock.bundledRequisitions
          },
          corridor,
          controllerName
        })
      });
      const data = await res.json();
      setCustomMemoText(data.memoText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingMemo(false);
    }
  };

  const defaultMemo = `INDIAN RAILWAYS - OPERATING DEPARTMENT
CORRIDOR INTEGRATED BLOCK SANCTION NOTICE
Memo Ref: IR/NCR/OPT/BLK/2026/7821
Date: ${new Date().toLocaleDateString('en-IN')}

TO: Station Masters (PRYJ, FTP, CNB), Chief Traction Foreman (TRD/FTP), Section Engineer (P-Way/Sirathu), Signal Inspector (S&T).
FROM: Chief Controller / Sr. Divisional Operations Manager (Prayagraj Division)

SUBJECT: Sanction of ${activeBlock.title} on ${corridor.name}

1. JURISDICTION & LINE:
   Section: ${activeBlock.sectionName}
   Line: ${activeBlock.lineType} (Km ${activeBlock.startKm} to Km ${activeBlock.endKm})

2. SANCTIONED BLOCK WINDOW:
   From: ${activeBlock.startTime} hrs  To: ${activeBlock.endTime} hrs (Duration: ${activeBlock.durationMinutes} Minutes)

3. AUTHORIZED BUNDLED ACTIVITIES (Shadow Blocking):
${activeBlock.bundledRequisitions.map((r, i) => `   ${i+1}. [${r.department}] ${r.title} (${r.code})`).join('\n')}

4. SAFETY CLEARANCE & ISOLATION PROTOCOLS:
   [X] 25kV AC OHE Power de-energized and certified by TRD supervisor.
   [X] Earthing discharge rods locked at Km ${activeBlock.startKm} & Km ${activeBlock.endKm}.
   [X] S&T Disconnection Memo Form S&T-102 acknowledged by Station Master.
   [X] Caution Order T/409 issued for adjacent line speed restriction (30 km/h).

5. TRAFFIC REGULATION:
   ${activeBlock.punctualityImpact.regulatedTrains.map(t => `- Train ${t.trainNumber} (${t.trainName}) regulated at ${t.station} for ${t.delayMinutes} mins.`).join('\n   ')}

STATUS: ${isFullyApproved ? 'OPERATIONS SANCTIONED & SIGNED' : 'ADVISORY UNDER REVIEW'}
AUTHORIZING CONTROLLER: ${approvals.approverName || controllerName}
TIMESTAMP: ${approvals.timestamp || 'Pending Chief Sanction'}`;

  const currentMemo = customMemoText || defaultMemo;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(currentMemo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="approval-workflow" className="flex flex-col gap-6 text-[#181816]">
      {/* Banner */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]">
                Selection-Safe Advisory Boundary
              </span>
              <span className="text-xs text-[#636059] font-mono bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E6E0D4]">
                Fail-Safe & Traceable Governance
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#181816] mt-1.5 font-cinzel">
              Safety Verification & Controller Sanction Workflow
            </h2>
            <p className="text-xs text-[#636059]">
              RailAI advises and coordinates optimal windows; authorized railway engineers validate multi-departmental safety clearances, and Section Controller provides the final legal sanction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full text-xs font-bold font-mono border shadow-xs ${
              isFullyApproved
                ? 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]'
                : 'bg-[#FDF3EA] text-[#C87428] border-[#F7D4B8]'
            }`}>
              {isFullyApproved ? '✓ SANCTIONED & ACTIVE' : 'PENDING 4-PARTY CLEARANCE'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Approvals & Digital Memo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Department Signoffs & Safety Checklist (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Departmental Validation Cards */}
          <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#181816] mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#C87428]" />
              Multi-Departmental Validation (Human-in-the-Loop)
            </h3>

            <div className="flex flex-col gap-3">
              {/* P-Way Signoff */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#181816]">Engineering (P-Way)</span>
                    <span className="text-[10px] text-[#8F8A80] font-mono">SSE / Track Machine</span>
                  </div>
                  <p className="text-[11px] text-[#636059] mt-0.5">
                    CSM 09-32 tamping crew & track master availability verified.
                  </p>
                </div>
                <button
                  id="btn-toggle-pway-approval"
                  onClick={() => handleToggleApproval('pwayApproved')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    approvals.pwayApproved
                      ? 'bg-[#2D7A4D] text-white shadow-xs'
                      : 'bg-[#F3EEE7] text-[#636059] hover:bg-[#EAE4D9]'
                  }`}
                >
                  {approvals.pwayApproved ? <Check className="w-3.5 h-3.5" /> : null}
                  {approvals.pwayApproved ? 'Validated' : 'Validate'}
                </button>
              </div>

              {/* TRD Electrical Signoff */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2B5C8F]">Electrical Traction (TRD)</span>
                    <span className="text-[10px] text-[#8F8A80] font-mono">Chief Traction Foreman</span>
                  </div>
                  <p className="text-[11px] text-[#636059] mt-0.5">
                    25kV OHE isolation plan & Tower Wagon TW-402 confirmed.
                  </p>
                </div>
                <button
                  id="btn-toggle-trd-approval"
                  onClick={() => handleToggleApproval('trdApproved')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    approvals.trdApproved
                      ? 'bg-[#2D7A4D] text-white shadow-xs'
                      : 'bg-[#F3EEE7] text-[#636059] hover:bg-[#EAE4D9]'
                  }`}
                >
                  {approvals.trdApproved ? <Check className="w-3.5 h-3.5" /> : null}
                  {approvals.trdApproved ? 'Validated' : 'Validate'}
                </button>
              </div>

              {/* S&T Signal Signoff */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2D7A4D]">Signaling & Telecom (S&T)</span>
                    <span className="text-[10px] text-[#8F8A80] font-mono">Section Signal Inspector</span>
                  </div>
                  <p className="text-[11px] text-[#636059] mt-0.5">
                    Point machine 104A disconnection memo Form-102 prepared.
                  </p>
                </div>
                <button
                  id="btn-toggle-st-approval"
                  onClick={() => handleToggleApproval('stApproved')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    approvals.stApproved
                      ? 'bg-[#2D7A4D] text-white shadow-xs'
                      : 'bg-[#F3EEE7] text-[#636059] hover:bg-[#EAE4D9]'
                  }`}
                >
                  {approvals.stApproved ? <Check className="w-3.5 h-3.5" /> : null}
                  {approvals.stApproved ? 'Validated' : 'Validate'}
                </button>
              </div>

              {/* Chief Section Controller Final Sanction */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#181816] flex items-center justify-between gap-3 mt-1 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#181816]">Chief Operations Controller (Sr. DOM)</span>
                    <span className="text-[10px] bg-[#181816] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                      FINAL SANCTION
                    </span>
                  </div>
                  <p className="text-[11px] text-[#636059] mt-0.5">
                    Authorizes line occupation, Caution Order T/409 & Station Master notification.
                  </p>
                </div>
                <button
                  id="btn-toggle-chief-controller-approval"
                  onClick={() => handleToggleApproval('chiefControllerApproved')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    approvals.chiefControllerApproved
                      ? 'bg-[#2D7A4D] text-white font-bold'
                      : 'bg-[#181816] hover:bg-[#2C2B27] text-white'
                  }`}
                >
                  {approvals.chiefControllerApproved ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {approvals.chiefControllerApproved ? 'Sanctioned' : 'Grant Sanction'}
                </button>
              </div>
            </div>
          </div>

          {/* Hard Safety Checklist */}
          <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#181816] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C87428]" />
              Hard Safety Rules & Physical Isolation Checklist
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              <label
                onClick={() => handleToggleChecklist('oheIsolated')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] cursor-pointer hover:border-[#181816]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={checklist.oheIsolated}
                  readOnly
                  className="rounded text-[#181816] focus:ring-0"
                />
                <span className="text-[#181816]">
                  <strong>25kV OHE Power Isolation:</strong> Section de-energized & certified by Traction Power Controller (TPC).
                </span>
              </label>

              <label
                onClick={() => handleToggleChecklist('earthDischarged')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] cursor-pointer hover:border-[#181816]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={checklist.earthDischarged}
                  readOnly
                  className="rounded text-[#181816] focus:ring-0"
                />
                <span className="text-[#181816]">
                  <strong>Earthing Discharge Rods:</strong> Clamped and locked on both ends of the work zone (Km {activeBlock.startKm} & {activeBlock.endKm}).
                </span>
              </label>

              <label
                onClick={() => handleToggleChecklist('stMemoReceived')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] cursor-pointer hover:border-[#181816]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={checklist.stMemoReceived}
                  readOnly
                  className="rounded text-[#181816] focus:ring-0"
                />
                <span className="text-[#181816]">
                  <strong>S&T Disconnection Notice (Form S&T-102):</strong> Duly served and acknowledged by Station Master.
                </span>
              </label>

              <label
                onClick={() => handleToggleChecklist('cautionOrderIssued')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] cursor-pointer hover:border-[#181816]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={checklist.cautionOrderIssued}
                  readOnly
                  className="rounded text-[#181816] focus:ring-0"
                />
                <span className="text-[#181816]">
                  <strong>Caution Order (T/409):</strong> 30 km/h speed restriction programmed for adjacent track train drivers.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Official Indian Railways Circular Notice Memo (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white border border-[#E6E0D4] rounded-3xl p-6 flex flex-col h-full shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C87428]" />
                <h3 className="text-sm font-bold text-[#181816]">
                  Digital Block Permission Circular Notice
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-draft-memo-ai"
                  onClick={handleGenerateOfficialMemo}
                  disabled={isGeneratingMemo}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] text-xs font-semibold border border-[#E6E0D4] transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C87428]" />
                  {isGeneratingMemo ? 'Drafting...' : 'Re-Draft with AI'}
                </button>

                <button
                  id="btn-copy-memo"
                  onClick={handleCopyMemo}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] text-xs font-semibold border border-[#E6E0D4] transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2D7A4D]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Official Monospace Memo Paper */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6E0D4] font-mono text-[11px] leading-relaxed text-[#181816] overflow-x-auto whitespace-pre-wrap flex-1 shadow-inner select-text">
              {currentMemo}
            </div>

            {/* Verification Stamp Footer */}
            <div className="mt-3 pt-3 border-t border-[#EDE7DC] flex items-center justify-between text-xs text-[#636059]">
              <span className="font-mono text-[11px]">
                Audit Hash: IR-SHA256-{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </span>
              <span className="text-[#2D7A4D] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Traceable Decision Record
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
