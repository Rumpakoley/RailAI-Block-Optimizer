import React from 'react';
import { BlockWindow } from '../types';
import { X, ShieldCheck, Clock, Zap, Wrench, Radio, Layers, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 backdrop-blur-md">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-700/50">
                {block.code}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-800">
                {block.confidenceScore}% Feasibility Score
              </span>
              <span className="text-xs font-bold font-mono text-slate-300">
                {block.lineType}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1.5">
              {block.title}
            </h3>
            <p className="text-xs text-slate-400">
              📍 {block.sectionName} (Km {block.startKm} to Km {block.endKm})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Timing & Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center shadow-inner">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Window Time</div>
              <div className="text-sm font-bold font-mono text-indigo-300 mt-0.5">
                {block.startTime} – {block.endTime}
              </div>
              <div className="text-[10px] text-slate-500">{block.durationMinutes} mins</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Availability Gain</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                +{block.metrics.assetAvailabilityGainPercent}%
              </div>
              <div className="text-[10px] text-slate-500">Asset Uptime</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Possession Saved</div>
              <div className="text-sm font-bold font-mono text-indigo-400 mt-0.5">
                {block.metrics.possessionHoursSavedMinutes} Mins
              </div>
              <div className="text-[10px] text-slate-500">Eliminated Clashes</div>
            </div>
          </div>

          {/* Bundled Requisitions Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Bundled Tasks ({block.bundledRequisitions.length} Activities Synchronized)
              </h4>
              <span className="text-[10px] text-slate-400">
                Multi-Department Coordination
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {block.bundledRequisitions.map(req => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          req.department === 'P-Way'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : req.department === 'TRD'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {req.department}
                      </span>
                      <span className="font-semibold text-slate-200">{req.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Resources: {req.requiredResources.join(', ')}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {req.durationMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Impact Details */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Train Regulation & Punctuality Impact
            </h4>
            <p className="text-slate-400 text-[11px]">
              {block.punctualityImpact.speedRestrictionsImposed}
            </p>
            {block.punctualityImpact.regulatedTrains.length > 0 && (
              <div className="mt-2 text-[11px] text-indigo-300">
                Regulated Freight: {block.punctualityImpact.regulatedTrains.map(t => `${t.trainNumber} (${t.delayMinutes}m at ${t.station})`).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onProceedToApproval(block);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <span>Proceed to Advisory Sanction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
