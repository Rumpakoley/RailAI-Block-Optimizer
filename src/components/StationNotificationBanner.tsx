import React from 'react';
import { ControllerAlterationProposal } from '../types';
import { CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

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
      <div className="p-4 rounded-2xl border border-[#E6E0D4] bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#FDF3EA] border border-[#F7D4B8] text-[#C87428] flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono bg-[#C87428] text-white">
                {pendingProposal.proposalCode} • Inter-Station Review Required
              </span>
              <span className="text-xs text-[#636059] font-mono">
                Initiated by: <strong className="text-[#181816]">{pendingProposal.proposingUnit}</strong>
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#181816] mt-1">
              {pendingProposal.title}
            </h4>
            <p className="text-xs text-[#636059] line-clamp-1 mt-0.5">
              {pendingProposal.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#EDE7DC] pt-3 md:pt-0">
          <div className="flex items-center gap-2 bg-[#F3EEE7] px-3.5 py-1.5 rounded-full border border-[#E6E0D4] text-xs">
            <span className="text-[#636059] text-[11px]">Consensus:</span>
            <span className="font-mono font-bold text-[#2D7A4D] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A4D]" />
              {approvedCount} / {totalCount} Stations
            </span>
          </div>

          <button
            onClick={() => onOpenProposal(pendingProposal.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold shadow-xs transition transform active:scale-95 whitespace-nowrap"
          >
            <span>Review & Cast Vote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
