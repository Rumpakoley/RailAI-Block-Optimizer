import React from 'react';
import { Corridor } from '../types';
import { minutesToTime } from '../utils/timeUtils';
import { Sparkles, Play, Pause, Train, Layers, RefreshCw, Shield, Activity, Radio, Users } from 'lucide-react';

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
    <header id="app-header" className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E0D4] sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#EDE7DC]">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#181816] flex items-center justify-center text-[#FAF7F2] font-black shadow-sm">
            <Train className="w-5 h-5 text-[#FAF7F2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-cinzel font-bold tracking-widest text-[#181816] uppercase">
                RailAI Block Optimizer
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C87428] text-white tracking-wider uppercase font-mono shadow-xs">
                SIH 2025 PS-26027
              </span>
              <span className="text-[10px] text-[#636059] font-mono hidden sm:inline-block bg-[#F3EEE7] px-2.5 py-0.5 rounded-full border border-[#E6E0D4]">
                Team NeuralNerds
              </span>
            </div>
            <p className="text-[11px] text-[#636059] font-medium tracking-wide">
              AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways
            </p>
          </div>
        </div>

        {/* Right Tools: Corridor Selector, Live Clock, Copilot */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Corridor Dropdown */}
          <div className="flex items-center bg-white rounded-full border border-[#E6E0D4] px-3.5 py-1.5 text-xs shadow-xs">
            <span className="text-[#8F8A80] mr-2 text-[10px] font-bold tracking-wider uppercase">Corridor:</span>
            <select
              value={selectedCorridor.id}
              onChange={e => {
                const found = corridors.find(c => c.id === e.target.value);
                if (found) onSelectCorridor(found);
              }}
              className="bg-transparent text-[#181816] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {corridors.map(c => (
                <option key={c.id} value={c.id} className="bg-white text-[#181816]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Clock & Controls */}
          <div className="flex items-center bg-white rounded-full border border-[#E6E0D4] p-1 gap-1 text-xs shadow-xs">
            <button
              onClick={onTogglePlay}
              className={`p-1.5 rounded-full transition ${
                isPlaying ? 'bg-[#181816] text-[#FAF7F2]' : 'bg-[#F3EEE7] text-[#181816] hover:bg-[#EAE4D9]'
              }`}
              title={isPlaying ? 'Pause simulation clock' : 'Start simulation clock'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="px-2.5 py-0.5 font-mono font-bold text-[#181816] text-xs">
              {minutesToTime(currentSimMinutes)} IST
            </div>

            <div className="flex items-center gap-0.5 bg-[#FAF7F2] px-1 py-0.5 rounded-full border border-[#E6E0D4]">
              {[1, 5, 15].map(speed => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition ${
                    simSpeed === speed ? 'bg-[#181816] text-white font-bold' : 'text-[#636059] hover:text-[#181816]'
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-[#FAF7F2] font-semibold text-xs shadow-sm transition active:scale-95 tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C87428]" />
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
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              activeTab === 'STRING_GRAPH'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Time-Space String Graph</span>
          </button>

          <button
            id="nav-tab-optimizer"
            onClick={() => onChangeTab('OPTIMIZER')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              activeTab === 'OPTIMIZER'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Optimizer & Bundler</span>
          </button>

          <button
            id="nav-tab-what-if"
            onClick={() => onChangeTab('WHAT_IF')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              activeTab === 'WHAT_IF'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Dynamic What-If Simulator</span>
            {conflictCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#C87428] animate-ping"></span>
            )}
          </button>

          <button
            id="nav-tab-consensus"
            onClick={() => onChangeTab('CONSENSUS')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 relative ${
              activeTab === 'CONSENSUS'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Inter-Station Consensus</span>
            {pendingProposalCount && pendingProposalCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C87428] text-white font-bold text-[10px] font-mono">
                {pendingProposalCount}
              </span>
            ) : null}
          </button>

          <button
            id="nav-tab-approval"
            onClick={() => onChangeTab('APPROVAL')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              activeTab === 'APPROVAL'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Advisory Sanctions & Governance</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => onChangeTab('ANALYTICS')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>KPIs & Audit Trail</span>
          </button>
        </div>

        {/* Real-time Status Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#2D7A4D] font-mono text-[11px] bg-[#EBF5EE] px-3 py-1 rounded-full border border-[#C6E7D2]">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4D] animate-pulse"></span>
            TMS / TDMS / SMMS Integrated
          </div>
        </div>
      </div>
    </header>
  );
};
