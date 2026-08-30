import React from 'react';
import { Corridor } from '../types';
import { minutesToTime } from '../utils/timeUtils';
import { Sparkles, Play, Pause, FastForward, Shield, Layers, RefreshCw, Train, Activity, Bell, Radio, Users } from 'lucide-react';

interface HeaderProps {
  corridors: Corridor[];
  selectedCorridor: Corridor;
  onSelectCorridor: (corridor: Corridor) => void;
  activeTab: 'STRING_GRAPH' | 'OPTIMIZER' | 'WHAT_IF' | 'CONSENSUS' | 'APPROVAL' | 'ANALYTICS';
  onChangeTab: (tab: 'STRING_GRAPH' | 'OPTIMIZER' | 'WHAT_IF' | 'CONSENSUS' | 'APPROVAL' | 'ANALYTICS') => void;
  currentSimMinutes: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  simSpeed: number;
  onOpenCopilot: () => void;
  conflictCount: number;
  pendingProposalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  corridors,
  selectedCorridor,
  onSelectCorridor,
  activeTab,
  onChangeTab,
  currentSimMinutes,
  isPlaying,
  onTogglePlay,
  onSpeedChange,
  simSpeed,
  onOpenCopilot,
  conflictCount,
  pendingProposalCount
}) => {
  return (
    <header id="app-header" className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
        {/* Brand & Team ID */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/20 border border-indigo-500/30 ring-1 ring-white/10">
            <Train className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                RailAI Block Optimizer
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
                SIH 2025 PS-26027
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Team NeuralNerds
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways
            </p>
          </div>
        </div>

        {/* Right Tools: Corridor Selector & Live Clock */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Corridor Dropdown */}
          <div className="flex items-center bg-slate-900/90 rounded-xl border border-slate-800 px-3 py-1.5 text-xs shadow-inner">
            <span className="text-slate-400 mr-2 text-[11px] font-semibold tracking-wide uppercase">Corridor:</span>
            <select
              value={selectedCorridor.id}
              onChange={e => {
                const found = corridors.find(c => c.id === e.target.value);
                if (found) onSelectCorridor(found);
              }}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {corridors.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Clock & Controls */}
          <div className="flex items-center bg-slate-900/90 rounded-xl border border-slate-800 p-1 gap-1 text-xs shadow-inner">
            <button
              onClick={onTogglePlay}
              className={`p-1.5 rounded-lg transition ${
                isPlaying ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Pause simulation clock' : 'Start simulation clock'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="px-2.5 py-0.5 font-mono font-bold text-indigo-300 text-xs">
              {minutesToTime(currentSimMinutes)} IST
            </div>

            <div className="flex items-center gap-0.5 bg-slate-950/80 px-1 py-0.5 rounded-md border border-slate-800/80">
              {[1, 5, 15].map(speed => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                    simSpeed === speed ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* AI Copilot Trigger Button */}
          <button
            id="btn-open-copilot"
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 border border-indigo-400/30 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>RailAI Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1.5 py-2.5 text-xs font-semibold">
          <button
            id="nav-tab-string-graph"
            onClick={() => onChangeTab('STRING_GRAPH')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'STRING_GRAPH'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Time-Space String Graph</span>
          </button>

          <button
            id="nav-tab-optimizer"
            onClick={() => onChangeTab('OPTIMIZER')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'OPTIMIZER'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>AI Optimizer & Bundler</span>
          </button>

          <button
            id="nav-tab-what-if"
            onClick={() => onChangeTab('WHAT_IF')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'WHAT_IF'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Dynamic What-If Simulator</span>
            {conflictCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            id="nav-tab-consensus"
            onClick={() => onChangeTab('CONSENSUS')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 relative ${
              activeTab === 'CONSENSUS'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Inter-Station Consensus</span>
            {pendingProposalCount && pendingProposalCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] font-mono animate-bounce">
                {pendingProposalCount}
              </span>
            ) : null}
          </button>

          <button
            id="nav-tab-approval"
            onClick={() => onChangeTab('APPROVAL')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'APPROVAL'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Advisory Sanctions & Governance</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => onChangeTab('ANALYTICS')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'ANALYTICS'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>KPIs & Audit Trail</span>
          </button>
        </div>

        {/* Real-time Status Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            TMS / TDMS / SMMS Integrated
          </div>
        </div>
      </div>
    </header>
  );
};
