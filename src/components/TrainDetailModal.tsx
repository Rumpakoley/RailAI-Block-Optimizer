import React from 'react';
import { Train } from '../types';
import { X, Train as TrainIcon, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 backdrop-blur-md">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md"
              style={{ backgroundColor: train.routeColor }}
            >
              <TrainIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">
                  {train.number}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {train.type}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono border border-indigo-700/50">
                  {train.direction} Line
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-200 mt-0.5">
                {train.name}
              </h3>
            </div>
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
          {/* Status & Priority Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-center shadow-inner">
            <div>
              <div className="text-[10px] text-slate-400">Current Status</div>
              <div className={`font-bold mt-0.5 ${train.currentDelayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {train.currentDelayMinutes > 0 ? `Late (+${train.currentDelayMinutes}m)` : 'On Time'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Speed (Km/h)</div>
              <div className="font-bold text-slate-200 mt-0.5 font-mono">
                {train.averageSpeedKmH} km/h
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Priority Tier</div>
              <div className="font-bold text-indigo-400 mt-0.5">
                Tier {train.priorityTier} {train.priorityTier === 1 ? '(High Right-of-Way)' : ''}
              </div>
            </div>
          </div>

          {/* Timetable Stops */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Corridor Schedule & Passing Times
            </h4>

            <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-48 overflow-y-auto shadow-inner">
              {train.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-1.5 border-b border-slate-900 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-300">
                      {stop.stationCode}
                    </span>
                    <span className="text-slate-400">{stop.stationName}</span>
                    {stop.platform && (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                        {stop.platform}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-slate-300">
                    {stop.scheduledArrival} → {stop.scheduledDeparture}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Delay Injection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Simulate Delay for {train.number}
            </h4>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => onAddDelay(train.id, mins)}
                  className="flex-1 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                >
                  +{mins}m
                </button>
              ))}
              {train.currentDelayMinutes > 0 && (
                <button
                  onClick={() => onAddDelay(train.id, 0)}
                  className="py-2 px-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 font-semibold text-xs hover:bg-emerald-900 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
