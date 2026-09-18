import React from 'react';
import { Corridor, ManualModeState, NavigationTab, OfficialUser } from '../types';
import { minutesToTime } from '../utils/timeUtils';
import { Sparkles, Play, Pause, Train, Layers, RefreshCw, Shield, Activity, Radio, AlertTriangle, Power, Compass, SlidersHorizontal, Eye, Calendar, HardHat, UserCheck } from 'lucide-react';

interface HeaderProps {
  corridors: Corridor[];
  selectedCorridor: Corridor;
  onSelectCorridor: (corridor: Corridor) => void;
  activeTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  currentSimMinutes: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  simSpeed: number;
  onOpenCopilot: () => void;
  conflictCount: number;
  pendingProposalCount?: number;
  manualMode?: ManualModeState;
  onOpenManualMode?: () => void;
  isSimpleMode: boolean;
  onToggleSimpleMode: () => void;
  onStartTour: () => void;
  currentUser?: OfficialUser | null;
  onOpenAuth?: () => void;
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
  pendingProposalCount,
  manualMode,
  onOpenManualMode,
  isSimpleMode,
  onToggleSimpleMode,
  onStartTour,
  currentUser,
  onOpenAuth
}) => {
  return (
    <header id="app-header" className="bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E0D4] sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3.5 border-b border-[#EDE7DC]">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#181816] flex items-center justify-center text-[#FAF7F2] font-black shadow-sm">
            <Train className="w-4 h-4 text-[#FAF7F2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-cinzel font-bold tracking-widest text-[#181816] uppercase">
                RailAI Block Optimizer
              </h1>
            </div>
            <p className="text-[10.5px] text-[#636059] font-medium tracking-wide hidden sm:block">
              AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations
            </p>
          </div>
        </div>

        {/* Right Tools: Corridor, Clock, Mode Switch, Guided Tour, Copilot, Official Profile */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Corridor Dropdown */}
          <div className="flex items-center bg-white rounded-full border border-[#E6E0D4] px-3 py-1 text-xs shadow-xs">
            <span className="text-[#8F8A80] mr-1.5 text-[9.5px] font-bold tracking-wider uppercase">Section:</span>
            <select
              value={selectedCorridor.id}
              onChange={e => {
                const found = corridors.find(c => c.id === e.target.value);
                if (found) onSelectCorridor(found);
              }}
              className="bg-transparent text-[#181816] font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {corridors.map(c => (
                <option key={c.id} value={c.id} className="bg-white text-[#181816]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simple vs Advanced View Toggle */}
          <button
            onClick={onToggleSimpleMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition shadow-xs cursor-pointer ${
              isSimpleMode
                ? 'bg-[#181816] text-white border-[#181816]'
                : 'bg-white text-[#636059] hover:text-[#181816] border-[#E6E0D4]'
            }`}
            title="Switch between simplified view for judges and advanced technical view"
          >
            <Eye className="w-3.5 h-3.5 text-[#C87428]" />
            <span>{isSimpleMode ? 'Simple View' : 'Advanced View'}</span>
          </button>

          {/* 60s Tour Button */}
          <button
            onClick={onStartTour}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5EE] hover:bg-[#D9EFE0] text-[#2D7A4D] font-bold text-xs border border-[#C6E7D2] transition shadow-xs cursor-pointer"
            title="Start 60-Second Guided Tour for Judges"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">60s Demo</span>
          </button>

          {/* Official Profile Badge / Switcher */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-white border border-[#E6E0D4] shadow-xs">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${currentUser.badgeColor}`}>
                {currentUser.avatarInitials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#181816] leading-tight line-clamp-1 max-w-[110px] sm:max-w-[150px]">
                  {currentUser.name}
                </span>
                <span className="text-[8.5px] text-[#C87428] font-mono leading-none">
                  {currentUser.hrmsId}
                </span>
              </div>
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="ml-1 px-2 py-0.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE7] text-[#181816] text-[10px] font-bold border border-[#E6E0D4] transition cursor-pointer"
                  title="Switch Official Role / Verify Identity"
                >
                  Switch
                </button>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D7A4D] hover:bg-[#24633E] text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Official Login</span>
              </button>
            )
          )}

          {/* AI Copilot Trigger Button */}
          <button
            id="btn-open-copilot"
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-[#FAF7F2] font-semibold text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C87428]" />
            <span>Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1.5 py-2 text-xs font-semibold whitespace-nowrap">
          {/* 1. Live Overview & String Graph */}
          <button
            id="nav-tab-string-graph"
            onClick={() => onChangeTab('STRING_GRAPH')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'STRING_GRAPH'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>{isSimpleMode ? '1. Live Graph' : 'Time-Space Graph'}</span>
          </button>

          {/* 2. Railway Routine & Timetable */}
          <button
            id="nav-tab-routine"
            onClick={() => onChangeTab('ROUTINE')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ROUTINE'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>{isSimpleMode ? '2. Railway Routine' : 'Timetable Routine'}</span>
          </button>

          {/* 3. Department Demands & Concerns */}
          <button
            id="nav-tab-departments"
            onClick={() => onChangeTab('DEPARTMENTS')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'DEPARTMENTS'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-[#C87428]" />
            <span>{isSimpleMode ? '3. Dept Concerns' : 'Dept Demands (TMS/TDMS/SMMS)'}</span>
          </button>

          {/* 4. AI Optimizer & Bundler */}
          <button
            id="nav-tab-optimizer"
            onClick={() => onChangeTab('OPTIMIZER')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'OPTIMIZER'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isSimpleMode ? '4. AI Optimizer' : 'AI Optimizer & Bundler'}</span>
          </button>

          {/* 5. Inter-Station Consensus & Approval */}
          <button
            id="nav-tab-consensus"
            onClick={() => onChangeTab('CONSENSUS')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 relative cursor-pointer ${
              activeTab === 'CONSENSUS'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isSimpleMode ? '5. Consensus' : 'Inter-Station Consensus'}</span>
            {pendingProposalCount && pendingProposalCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C87428] text-white font-bold text-[9px] font-mono">
                {pendingProposalCount}
              </span>
            ) : null}
          </button>

          {/* Advanced Tabs (Shown if not simple mode or if active) */}
          {(!isSimpleMode || activeTab === 'WHAT_IF') && (
            <button
              id="nav-tab-what-if"
              onClick={() => onChangeTab('WHAT_IF')}
              className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'WHAT_IF'
                  ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                  : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
              {conflictCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C87428] animate-ping"></span>
              )}
            </button>
          )}

          {(!isSimpleMode || activeTab === 'APPROVAL') && (
            <button
              id="nav-tab-approval"
              onClick={() => onChangeTab('APPROVAL')}
              className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'APPROVAL'
                  ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                  : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Sanctions</span>
            </button>
          )}

          <button
            id="nav-tab-analytics"
            onClick={() => onChangeTab('ANALYTICS')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#181816] text-[#FAF7F2] font-bold shadow-xs'
                : 'text-[#636059] hover:text-[#181816] hover:bg-[#F3EEE7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isSimpleMode ? '6. KPIs' : 'KPIs & Audit'}</span>
          </button>
        </div>

        {/* Operating Mode Status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#2D7A4D] font-mono text-[10px] bg-[#EBF5EE] px-2.5 py-0.5 rounded-full border border-[#C6E7D2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D] animate-pulse"></span>
            <span>Live TMS / TDMS / SMMS Integrated</span>
          </div>
        </div>
      </div>
    </header>
  );
};
