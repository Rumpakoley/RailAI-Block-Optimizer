import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Layers, Train, Radio, ShieldCheck, Check } from 'lucide-react';
import { Corridor } from '../types';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: Corridor;
  onNavigateTab: (tab: 'STRING_GRAPH' | 'OPTIMIZER' | 'CONSENSUS' | 'APPROVAL') => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  corridor,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "1. The Real-World Railway Problem",
      subtitle: "Uncoordinated Multi-Departmental Track Shutdowns",
      icon: <Layers className="w-6 h-6 text-[#C53030]" />,
      content: (
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#181816]">
          <p>
            In Indian Railways, three separate engineering departments maintain the same physical track corridor:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E0D4]">
              <strong className="text-[#181816] block">1. P-Way (Track)</strong>
              <span className="text-[#636059]">Heavy track tamping & weld testing (TMS).</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E0D4]">
              <strong className="text-[#2B5C8F] block">2. TRD (Traction)</strong>
              <span className="text-[#636059]">25kV OHE wire renewal (TDMS).</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E0D4]">
              <strong className="text-[#2D7A4D] block">3. S&T (Signaling)</strong>
              <span className="text-[#636059]">Point machine & track circuit overhaul (SMMS).</span>
            </div>
          </div>
          <p className="bg-[#FDF2F2] p-2.5 rounded-xl border border-[#F8D7D7] text-[#C53030]">
            ❌ <strong>Problem</strong>: Without AI coordination, each team stops train operations at different times, shutting down the track for <strong>7.5+ hours</strong> and causing cascading delays.
          </p>
        </div>
      ),
      actionLabel: "See How RailAI Bundles This ➔",
      action: () => {
        onNavigateTab('OPTIMIZER');
        setCurrentStep(2);
      }
    },
    {
      step: 2,
      title: "2. The AI Innovation: CP-SAT Shadow Bundler",
      subtitle: "Synthesizes 1 Single Coordinated Window",
      icon: <Sparkles className="w-6 h-6 text-[#C87428]" />,
      content: (
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#181816]">
          <p>
            RailAI's <strong>Constraint Programming (CP-SAT)</strong> engine correlates these disconnected requests and automatically bundles them into a single <strong>3-hour shadow possession</strong> (01:30–04:30).
          </p>
          <div className="p-3 rounded-xl bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D] text-[11px] flex flex-col gap-1">
            <strong>✅ Realized Operational Gains:</strong>
            <span>• <strong>+28.5% Gain</strong> in track availability for commercial train operations.</span>
            <span>• <strong>120 minutes saved</strong> per corridor daily.</span>
            <span>• <strong>96% Feasibility Score</strong> with verified electrical and safety isolation.</span>
          </div>
        </div>
      ),
      actionLabel: "Verify on Time-Space Diagram ➔",
      action: () => {
        onNavigateTab('STRING_GRAPH');
        setCurrentStep(3);
      }
    },
    {
      step: 3,
      title: "3. Time-Space Graph & Conflict Avoidance",
      subtitle: "Zero Passenger Train Delay Guarantee",
      icon: <Train className="w-6 h-6 text-[#2563eb]" />,
      content: (
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#181816]">
          <p>
            On the 24-hour Time-Space string diagram, the shaded rectangular block (<strong>BLK-NCR-2025-001</strong>) is automatically positioned in the natural night traffic trough:
          </p>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6E0D4] text-[11px] flex flex-col gap-1.5 text-[#636059]">
            <div>🚆 <strong>Howrah Rajdhani 12301</strong>: Safely passes at 01:40 hrs with 0 minute delay.</div>
            <div>⚡ <strong>Vande Bharat 22436</strong>: 20-minute safety buffer strictly enforced.</div>
            <div>📦 <strong>Freight Coal Rake</strong>: Conveniently regulated on Sirathu loop without blocking mainline.</div>
          </div>
        </div>
      ),
      actionLabel: "See Inter-Station Approval Workflow ➔",
      action: () => {
        onNavigateTab('CONSENSUS');
        setCurrentStep(4);
      }
    },
    {
      step: 4,
      title: "4. Digital Inter-Station Consensus & Approval",
      subtitle: "Seamless Real-Time Coordination Between Field Station Masters",
      icon: <Radio className="w-6 h-6 text-[#2D7A4D]" />,
      content: (
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#181816]">
          <p>
            When any station master proposes an alteration, all concerned stations (Prayagraj, Sirathu, Fatehpur, Kanpur) receive real-time notifications:
          </p>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6E0D4] text-[11px] flex flex-col gap-1.5 text-[#181816]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D7A4D]" />
              <span><strong>Station Master Consensus</strong>: Only sanctioned when all stations agree.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D7A4D]" />
              <span><strong>Official Paper Authority</strong>: Generates pre-filled Form T/409 caution orders.</span>
            </div>
          </div>
          <p className="text-[11px] text-[#2D7A4D] font-semibold bg-[#EBF5EE] p-2.5 rounded-xl border border-[#C6E7D2]">
            🎉 You have completed the 60-second walkthrough! You can now freely explore the live prototype.
          </p>
        </div>
      ),
      actionLabel: "Finish Demo Tour & Explore",
      action: () => {
        onClose();
      }
    }
  ];

  const activeStepData = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-[#181816] flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EDE7DC] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
              {activeStepData.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#181816] text-white">
                Step {currentStep} of {steps.length}
              </span>
              <h3 className="text-sm font-bold text-[#181816] mt-1 font-cinzel">
                {activeStepData.title}
              </h3>
              <p className="text-[11px] text-[#636059]">
                {activeStepData.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8F8A80] hover:text-[#181816] hover:bg-[#F3EEE7] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body Content */}
        <div className="min-h-[160px]">
          {activeStepData.content}
        </div>

        {/* Step Progress Dots & Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EDE7DC]">
          <div className="flex items-center gap-1.5">
            {steps.map(s => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(s.step);
                  if (s.step === 1 || s.step === 2) onNavigateTab('OPTIMIZER');
                  if (s.step === 3) onNavigateTab('STRING_GRAPH');
                  if (s.step === 4) onNavigateTab('CONSENSUS');
                }}
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  currentStep === s.step ? 'bg-[#181816] w-6' : 'bg-[#E6E0D4] hover:bg-[#8F8A80]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-1.5 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#181816] text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <button
              onClick={activeStepData.action}
              className="px-4 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{activeStepData.actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
