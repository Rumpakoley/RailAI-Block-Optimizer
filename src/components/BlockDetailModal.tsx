import React from 'react';
import { BlockWindow } from '../types';
import { X, Layers, AlertTriangle, ArrowRight } from 'lucide-react';

interface BlockDetailModalProps {
  block: BlockWindow | null;
  onClose: () => void;
  onProceedToApproval: (block: BlockWindow) => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({
  block,
  onClose,
  onProceedToApproval
}) => {
  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 text-[#181816]">
        {/* Header */}
        <div className="p-6 border-b border-[#EDE7DC] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[#181816] bg-[#F3EEE7] px-3 py-1 rounded-full border border-[#E6E0D4]">
                {block.code}
              </span>
              <span className="text-xs font-semibold text-[#2D7A4D] bg-[#EBF5EE] px-3 py-1 rounded-full border border-[#C6E7D2]">
                {block.confidenceScore}% Feasibility Score
              </span>
              <span className="text-xs font-bold font-mono text-[#636059]">
                {block.lineType}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#181816] mt-2">
              {block.title}
            </h3>
            <p className="text-xs text-[#636059]">
              📍 {block.sectionName} (Km {block.startKm} to Km {block.endKm})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8F8A80] hover:text-[#181816] hover:bg-[#F3EEE7] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Timing & Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D4] text-center">
            <div>
              <div className="text-[10px] text-[#8F8A80] uppercase tracking-wider font-bold">Window Time</div>
              <div className="text-sm font-bold font-mono text-[#181816] mt-0.5">
                {block.startTime} – {block.endTime}
              </div>
              <div className="text-[10px] text-[#636059]">{block.durationMinutes} mins</div>
            </div>

            <div>
              <div className="text-[10px] text-[#8F8A80] uppercase tracking-wider font-bold">Availability Gain</div>
              <div className="text-sm font-bold font-mono text-[#2D7A4D] mt-0.5">
                +{block.metrics.assetAvailabilityGainPercent}%
              </div>
              <div className="text-[10px] text-[#636059]">Asset Uptime</div>
            </div>

            <div>
              <div className="text-[10px] text-[#8F8A80] uppercase tracking-wider font-bold">Possession Saved</div>
              <div className="text-sm font-bold font-mono text-[#C87428] mt-0.5">
                {block.metrics.possessionHoursSavedMinutes} Mins
              </div>
              <div className="text-[10px] text-[#636059]">Eliminated Clashes</div>
            </div>
          </div>

          {/* Bundled Requisitions Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[#181816] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C87428]" />
                Bundled Tasks ({block.bundledRequisitions.length} Activities Synchronized)
              </h4>
              <span className="text-[10px] text-[#8F8A80]">
                Multi-Department Coordination
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {block.bundledRequisitions.map(req => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          req.department === 'P-Way'
                            ? 'bg-[#F3EEE7] text-[#181816] border border-[#E6E0D4]'
                            : req.department === 'TRD'
                            ? 'bg-[#EFF5FB] text-[#2B5C8F] border border-[#CCE0F5]'
                            : 'bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]'
                        }`}
                      >
                        {req.department}
                      </span>
                      <span className="font-semibold text-[#181816]">{req.title}</span>
                    </div>
                    <div className="text-[10px] text-[#636059] mt-0.5">
                      Resources: {req.requiredResources.join(', ')}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[#181816] text-[11px] bg-white px-2.5 py-0.5 rounded-full border border-[#E6E0D4]">
                      {req.durationMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Impact Details */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D4]">
            <h4 className="font-bold text-[#C53030] mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Train Regulation & Punctuality Impact
            </h4>
            <p className="text-[#636059] text-[11px]">
              {block.punctualityImpact.speedRestrictionsImposed}
            </p>
            {block.punctualityImpact.regulatedTrains.length > 0 && (
              <div className="mt-2 text-[11px] text-[#181816]">
                Regulated Freight: {block.punctualityImpact.regulatedTrains.map(t => `${t.trainNumber} (${t.delayMinutes}m at ${t.station})`).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EDE7DC] bg-[#FAF7F2] flex items-center justify-between rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#F3EEE7] hover:bg-[#EAE4D9] text-[#636059] font-medium text-xs transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onProceedToApproval(block);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <span>Proceed to Advisory Sanction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
