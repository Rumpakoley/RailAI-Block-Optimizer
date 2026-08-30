import React from 'react';
import { ControllerAlterationProposal } from '../types';
import { AlertTriangle, Clock, CheckCircle2, XCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface StationNotificationBannerProps {
  proposals: ControllerAlterationProposal[];
  onOpenProposal: (proposalId: string) => void;
}

export const StationNotificationBanner: React.FC<StationNotificationBannerProps> = ({
  proposals,
  onOpenProposal,
}) => {
  const pendingProposal = proposals.find(p => p.status === 'pending_consensus');

  if (!pendingProposal) return null;

  const approvedCount = pendingProposal.concernedStations.filter(s => s.status === 'approved').length;
  const totalCount = pendingProposal.concernedStations.length;
  const isUrgent = pendingProposal.urgency === 'Emergency' || pendingProposal.urgency === 'High';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
        isUrgent
          ? 'bg-amber-950/40 border-amber-500/50 shadow-amber-950/20 text-amber-100'
          : 'bg-indigo-950/40 border-indigo-500/50 shadow-indigo-950/20 text-indigo-100'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
            isUrgent 
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse' 
              : 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                isUrgent
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {pendingProposal.proposalCode} • Inter-Station Review Required
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Initiated by: <strong className="text-white">{pendingProposal.proposingUnit}</strong>
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              {pendingProposal.title}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {pendingProposal.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Consensus:</span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {approvedCount} / {totalCount} Stations
            </span>
          </div>

          <button
            onClick={() => onOpenProposal(pendingProposal.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-900/30 border border-amber-400/30 transition transform active:scale-95 whitespace-nowrap"
          >
            <span>Review & Cast Vote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
