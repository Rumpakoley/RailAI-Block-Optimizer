import React from 'react';
import { Train } from '../types';
import { X, Train as TrainIcon, Clock, MapPin } from 'lucide-react';

interface TrainDetailModalProps {
  train: Train | null;
  onClose: () => void;
  onAddDelay: (trainId: string, delayMinutes: number) => void;
}

export const TrainDetailModal: React.FC<TrainDetailModalProps> = ({
  train,
  onClose,
  onAddDelay
}) => {
  if (!train) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 text-[#181816]">
        {/* Header */}
        <div className="p-6 border-b border-[#EDE7DC] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs"
              style={{ backgroundColor: train.routeColor }}
            >
              <TrainIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#181816] text-sm">
                  {train.number}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-[#F3EEE7] text-[#636059] border border-[#E6E0D4]">
                  {train.type}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#181816] font-mono border border-[#E6E0D4]">
                  {train.direction} Line
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#181816] mt-0.5">
                {train.name}
              </h3>
            </div>
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
          {/* Status & Priority Bar */}
          <div className="grid grid-cols-3 gap-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D4] text-center">
            <div>
              <div className="text-[10px] text-[#8F8A80] font-bold uppercase">Status</div>
              <div className={`font-bold mt-0.5 ${train.currentDelayMinutes > 0 ? 'text-[#C53030]' : 'text-[#2D7A4D]'}`}>
                {train.currentDelayMinutes > 0 ? `Late (+${train.currentDelayMinutes}m)` : 'On Time'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8F8A80] font-bold uppercase">Speed</div>
              <div className="font-bold text-[#181816] mt-0.5 font-mono">
                {train.averageSpeedKmH} km/h
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8F8A80] font-bold uppercase">Priority</div>
              <div className="font-bold text-[#C87428] mt-0.5">
                Tier {train.priorityTier} {train.priorityTier === 1 ? '(High)' : ''}
              </div>
            </div>
          </div>

          {/* Timetable Stops */}
          <div>
            <h4 className="font-bold text-[#181816] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C87428]" />
              Corridor Schedule & Passing Times
            </h4>

            <div className="flex flex-col gap-1.5 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6E0D4] max-h-48 overflow-y-auto">
              {train.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#EDE7DC] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#181816]">
                      {stop.stationCode}
                    </span>
                    <span className="text-[#636059]">{stop.stationName}</span>
                    {stop.platform && (
                      <span className="text-[9px] bg-white text-[#8F8A80] px-1.5 py-0.2 rounded border border-[#E6E0D4] font-mono">
                        {stop.platform}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-[#181816]">
                    {stop.scheduledArrival} → {stop.scheduledDeparture}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Delay Injection */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D4]">
            <h4 className="font-bold text-[#181816] mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C87428]" />
              Simulate Delay for {train.number}
            </h4>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => onAddDelay(train.id, mins)}
                  className="flex-1 py-2 rounded-full bg-white hover:bg-[#F3EEE7] text-[#181816] font-semibold text-xs border border-[#E6E0D4] transition"
                >
                  +{mins}m
                </button>
              ))}
              {train.currentDelayMinutes > 0 && (
                <button
                  onClick={() => onAddDelay(train.id, 0)}
                  className="py-2 px-4 rounded-full bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D] font-bold text-xs hover:bg-[#D5EEDD] transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDE7DC] bg-[#FAF7F2] rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
