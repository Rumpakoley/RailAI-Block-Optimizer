import React, { useState, useRef } from 'react';
import { Corridor, Train, BlockWindow } from '../types';
import { timeToMinutes, minutesToTime, getTrainPositionAtTime } from '../utils/timeUtils';
import { Train as TrainIcon, AlertTriangle, ShieldCheck, Clock, Layers, ZoomIn, ZoomOut, Filter, Info } from 'lucide-react';

interface StringDiagramProps {
  corridor: Corridor;
  trains: Train[];
  blocks: BlockWindow[];
  currentSimulationMinutes: number;
  onSelectBlock: (block: BlockWindow) => void;
  onSelectTrain: (train: Train) => void;
}

export const StringDiagram: React.FC<StringDiagramProps> = ({
  corridor,
  trains,
  blocks,
  currentSimulationMinutes,
  onSelectBlock,
  onSelectTrain
}) => {
  const [timeRange, setTimeRange] = useState<{ start: number; end: number }>({ start: 0, end: 480 }); // default 00:00 - 08:00 (Night & Morning Block Window)
  const [trackFilter, setTrackFilter] = useState<'ALL' | 'UP' | 'DOWN'>('ALL');
  const [trainTypeFilter, setTrainTypeFilter] = useState<'ALL' | 'PASSENGER' | 'FREIGHT'>('ALL');
  const [hoveredTrain, setHoveredTrain] = useState<Train | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<BlockWindow | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const stations = corridor.stations;
  const minKm = stations[0]?.kmMarker || 800;
  const maxKm = stations[stations.length - 1]?.kmMarker || 1300;
  const kmSpan = maxKm - minKm || 1;

  // Visual dimensions
  const svgWidth = 1000;
  const svgHeight = 560;
  const padding = { top: 30, right: 40, bottom: 40, left: 120 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Conversion functions
  const getX = (minutes: number) => {
    const clamped = Math.max(timeRange.start, Math.min(timeRange.end, minutes));
    return padding.left + ((clamped - timeRange.start) / (timeRange.end - timeRange.start)) * plotWidth;
  };

  const getY = (km: number) => {
    return padding.top + ((km - minKm) / kmSpan) * plotHeight;
  };

  // Filtered trains
  const filteredTrains = trains.filter(t => {
    if (trackFilter === 'UP' && t.direction !== 'UP') return false;
    if (trackFilter === 'DOWN' && t.direction !== 'DOWN') return false;
    if (trainTypeFilter === 'PASSENGER' && (t.type.includes('Freight') || t.type.includes('Material'))) return false;
    if (trainTypeFilter === 'FREIGHT' && !t.type.includes('Freight') && !t.type.includes('Material')) return false;
    return true;
  });

  // Calculate conflicts between train trajectories and active blocks
  const conflicts: { train: Train; block: BlockWindow; conflictTime: string; conflictKm: number }[] = [];

  blocks.forEach(blk => {
    const blkStartMins = timeToMinutes(blk.startTime);
    const blkEndMins = timeToMinutes(blk.endTime);

    filteredTrains.forEach(train => {
      // Check track compatibility
      const isTrackMatch = (blk.lineType === 'BOTH LINES') || 
                           (blk.lineType === 'UP MAIN' && train.direction === 'UP') ||
                           (blk.lineType === 'DOWN MAIN' && train.direction === 'DOWN');

      if (!isTrackMatch) return;

      // Check if train passes through block section during block hours
      const stops = train.stops;
      for (let i = 0; i < stops.length - 1; i++) {
        const s1 = stations.find(st => st.code === stops[i].stationCode);
        const s2 = stations.find(st => st.code === stops[i + 1].stationCode);
        if (!s1 || !s2) continue;

        const t1 = timeToMinutes(stops[i].scheduledDeparture) + train.currentDelayMinutes;
        const t2 = timeToMinutes(stops[i + 1].scheduledArrival) + train.currentDelayMinutes;

        const trainMinKm = Math.min(s1.kmMarker, s2.kmMarker);
        const trainMaxKm = Math.max(s1.kmMarker, s2.kmMarker);

        const isKmOverlap = !(trainMaxKm < blk.startKm || trainMinKm > blk.endKm);
        const isTimeOverlap = !(t2 < blkStartMins || t1 > blkEndMins);

        if (isKmOverlap && isTimeOverlap) {
          conflicts.push({
            train,
            block: blk,
            conflictTime: minutesToTime((Math.max(t1, blkStartMins) + Math.min(t2, blkEndMins)) / 2),
            conflictKm: (blk.startKm + blk.endKm) / 2
          });
        }
      }
    });
  });

  // Time ticks calculation (every 1 hour)
  const hourTicks: number[] = [];
  const startHour = Math.floor(timeRange.start / 60);
  const endHour = Math.ceil(timeRange.end / 60);
  for (let h = startHour; h <= endHour; h++) {
    const mins = h * 60;
    if (mins >= timeRange.start && mins <= timeRange.end) {
      hourTicks.push(mins);
    }
  }

  return (
    <div id="string-diagram-container" className="bg-white border border-[#E6E0D4] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EDE7DC] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#F3EEE7] border border-[#E6E0D4] text-[#181816]">
            <Layers className="w-5 h-5 text-[#C87428]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#181816] flex items-center gap-2">
              Indian Railways Time-Space String Diagram
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F3EEE7] text-[#181816] font-mono border border-[#E6E0D4]">
                {corridor.name}
              </span>
            </h3>
            <p className="text-xs text-[#636059]">
              Interactive 24-Hour Train Path Graph & Corridor Block Occupancy Projection
            </p>
          </div>
        </div>

        {/* Filters & Range Presets */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset time windows */}
          <div className="flex items-center bg-[#F3EEE7] p-1 rounded-full border border-[#E6E0D4] text-xs shadow-xs">
            <button
              id="time-preset-night"
              onClick={() => setTimeRange({ start: 0, end: 360 })}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                timeRange.start === 0 && timeRange.end === 360 ? 'bg-[#181816] text-[#FAF7F2] shadow-xs' : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              00:00–06:00 (Trough)
            </button>
            <button
              id="time-preset-morning"
              onClick={() => setTimeRange({ start: 360, end: 720 })}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                timeRange.start === 360 && timeRange.end === 720 ? 'bg-[#181816] text-[#FAF7F2] shadow-xs' : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              06:00–12:00 (Peak)
            </button>
            <button
              id="time-preset-afternoon"
              onClick={() => setTimeRange({ start: 720, end: 1080 })}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                timeRange.start === 720 && timeRange.end === 1080 ? 'bg-[#181816] text-[#FAF7F2] shadow-xs' : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              12:00–18:00
            </button>
            <button
              id="time-preset-evening"
              onClick={() => setTimeRange({ start: 1080, end: 1440 })}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                timeRange.start === 1080 && timeRange.end === 1440 ? 'bg-[#181816] text-[#FAF7F2] shadow-xs' : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              18:00–24:00
            </button>
            <button
              id="time-preset-full"
              onClick={() => setTimeRange({ start: 0, end: 1440 })}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                timeRange.start === 0 && timeRange.end === 1440 ? 'bg-[#181816] text-[#FAF7F2] shadow-xs' : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              24h Overview
            </button>
          </div>

          {/* Track Filter */}
          <div className="flex items-center bg-[#F3EEE7] p-1 rounded-full border border-[#E6E0D4] text-xs shadow-xs">
            <span className="text-[#8F8A80] px-2 flex items-center gap-1"><Filter className="w-3 h-3" /> Track:</span>
            <button
              id="track-filter-all"
              onClick={() => setTrackFilter('ALL')}
              className={`px-3 py-1 rounded-full font-medium transition ${trackFilter === 'ALL' ? 'bg-[#181816] text-white' : 'text-[#636059]'}`}
            >
              All
            </button>
            <button
              id="track-filter-up"
              onClick={() => setTrackFilter('UP')}
              className={`px-3 py-1 rounded-full font-medium transition ${trackFilter === 'UP' ? 'bg-[#2D7A4D] text-white' : 'text-[#636059]'}`}
            >
              UP Line
            </button>
            <button
              id="track-filter-down"
              onClick={() => setTrackFilter('DOWN')}
              className={`px-3 py-1 rounded-full font-medium transition ${trackFilter === 'DOWN' ? 'bg-[#2B5C8F] text-white' : 'text-[#636059]'}`}
            >
              DOWN Line
            </button>
          </div>
        </div>
      </div>

      {/* Conflicts Banner if any */}
      {conflicts.length > 0 && (
        <div className="bg-[#FDF2F2] border border-[#F8D7D7] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-[#C53030] shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#C53030] shrink-0 animate-pulse" />
            <span>
              <strong>Train-Block Conflict Detected:</strong> Train <strong>{conflicts[0].train.number} ({conflicts[0].train.name})</strong> overlaps with <strong>{conflicts[0].block.code}</strong> around {conflicts[0].conflictTime} hrs.
            </span>
          </div>
          <span className="bg-[#C53030] text-white font-bold px-3 py-1 rounded-full text-[11px] shadow-xs">
            AI Re-Plan Suggested
          </span>
        </div>
      )}

      {/* SVG Canvas */}
      <div ref={containerRef} className="relative overflow-x-auto bg-[#FAF7F2] rounded-2xl border border-[#E6E0D4] p-3 shadow-inner">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[750px] select-none"
        >
          <defs>
            {/* Diagonal hatching pattern for maintenance block */}
            <pattern id="block-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#C87428" strokeWidth="2.5" strokeOpacity="0.3" />
            </pattern>
            <pattern id="conflict-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#C53030" strokeWidth="3" strokeOpacity="0.5" />
            </pattern>
            {/* Glow filters */}
            <filter id="train-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid - Vertical Hour lines */}
          {hourTicks.map(mins => {
            const x = getX(mins);
            return (
              <g key={`hour-${mins}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#E6E0D4"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 20}
                  fill="#8F8A80"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {minutesToTime(mins)}
                </text>
              </g>
            );
          })}

          {/* Horizontal Station Lines & Labels */}
          {stations.map(st => {
            const y = getY(st.kmMarker);
            return (
              <g key={`st-${st.code}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="#E6E0D4"
                  strokeWidth={st.isJunction ? '1.5' : '0.8'}
                  opacity={st.isJunction ? '0.9' : '0.6'}
                />
                {/* Station Label on Y Axis */}
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  fill={st.isJunction ? '#181816' : '#636059'}
                  fontSize={st.isJunction ? '11' : '10'}
                  fontWeight={st.isJunction ? '700' : '500'}
                  textAnchor="end"
                >
                  {st.code} ({st.name})
                </text>
                <text
                  x={padding.left - 12}
                  y={y + 14}
                  fill="#8F8A80"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="end"
                >
                  Km {st.kmMarker}
                </text>
              </g>
            );
          })}

          {/* Proposed & Active Maintenance Blocks (Shaded Boxes) */}
          {blocks.map(blk => {
            const startMins = timeToMinutes(blk.startTime);
            const endMins = timeToMinutes(blk.endTime);

            // Check if within time range
            if (endMins < timeRange.start || startMins > timeRange.end) return null;

            const x1 = getX(startMins);
            const x2 = getX(endMins);
            const width = Math.max(4, x2 - x1);

            const y1 = getY(blk.startKm);
            const y2 = getY(blk.endKm);
            const yTop = Math.min(y1, y2);
            const height = Math.max(12, Math.abs(y2 - y1));

            const isHovered = hoveredBlock?.id === blk.id;
            const hasConflict = conflicts.some(c => c.block.id === blk.id);

            return (
              <g
                key={blk.id}
                id={`block-box-${blk.id}`}
                className="cursor-pointer transition-opacity"
                onClick={() => onSelectBlock(blk)}
                onMouseEnter={() => setHoveredBlock(blk)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                {/* Shaded Box */}
                <rect
                  x={x1}
                  y={yTop}
                  width={width}
                  height={height}
                  fill={hasConflict ? 'rgba(239, 68, 68, 0.25)' : 'rgba(99, 102, 241, 0.25)'}
                  stroke={hasConflict ? '#ef4444' : '#6366f1'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  strokeDasharray={blk.status === 'candidate' ? '4 2' : undefined}
                  rx="6"
                />
                {/* Pattern fill */}
                <rect
                  x={x1}
                  y={yTop}
                  width={width}
                  height={height}
                  fill={hasConflict ? 'url(#conflict-hatch)' : 'url(#block-hatch)'}
                  rx="6"
                  opacity="0.8"
                />

                {/* Block Header Text inside or adjacent */}
                <rect
                  x={x1 + 4}
                  y={yTop + 4}
                  width={Math.min(width - 8, 140)}
                  height={18}
                  fill="#0f172a"
                  rx="4"
                  opacity="0.9"
                />
                <text
                  x={x1 + 8}
                  y={yTop + 16}
                  fill={hasConflict ? '#f87171' : '#a5b4fc'}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ⚡ {blk.code} ({blk.lineType})
                </text>

                {/* Duration badge */}
                <text
                  x={x1 + 8}
                  y={yTop + 30}
                  fill="#cbd5e1"
                  fontSize="8.5"
                >
                  {blk.bundledRequisitions.length} Tasks Bundled ({blk.departmentsInvolved.join('+')})
                </text>
              </g>
            );
          })}

          {/* Train Trajectories (Diagonal string lines) */}
          {filteredTrains.map(train => {
            const isHovered = hoveredTrain?.id === train.id;

            // Generate points along train route
            const points: { x: number; y: number; stationCode: string; time: string }[] = [];
            train.stops.forEach(stop => {
              const st = stations.find(s => s.code === stop.stationCode);
              if (!st) return;

              const arrivalMins = timeToMinutes(stop.scheduledArrival) + train.currentDelayMinutes;
              const depMins = timeToMinutes(stop.scheduledDeparture) + train.currentDelayMinutes;

              const y = getY(st.kmMarker);

              // Add arrival point
              points.push({ x: getX(arrivalMins), y, stationCode: stop.stationCode, time: stop.scheduledArrival });
              // If stopping, add dwell point
              if (stop.isStopping && arrivalMins !== depMins) {
                points.push({ x: getX(depMins), y, stationCode: stop.stationCode, time: stop.scheduledDeparture });
              }
            });

            if (points.length < 2) return null;

            // Construct SVG path string
            const pathData = points.reduce((acc, pt, index) => {
              return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
            }, '');

            // Determine line appearance
            let strokeColor = train.routeColor;
            let strokeWidth = isHovered ? 3.5 : (train.priorityTier === 1 ? 2.5 : 1.8);
            let strokeDash = train.type.includes('Freight') ? '6 3' : undefined;

            return (
              <g
                key={train.id}
                id={`train-path-${train.number}`}
                className="cursor-pointer group"
                onClick={() => onSelectTrain(train)}
                onMouseEnter={() => setHoveredTrain(train)}
                onMouseLeave={() => setHoveredTrain(null)}
              >
                {/* Transparent thick hit area for easy hover/click */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                />

                {/* Visible Trajectory Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isHovered ? 1 : 0.85}
                  filter={isHovered ? 'url(#train-glow)' : undefined}
                />

                {/* Train number label at midpoint or origin */}
                {points[0] && (
                  <g transform={`translate(${points[0].x + 4}, ${points[0].y - 6})`}>
                    <rect
                      x="0"
                      y="-10"
                      width="54"
                      height="14"
                      fill="#020617"
                      fillOpacity="0.85"
                      rx="3"
                      stroke={strokeColor}
                      strokeWidth="0.8"
                    />
                    <text
                      x="4"
                      y="0"
                      fill="#f8fafc"
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {train.number}
                    </text>
                  </g>
                )}

                {/* Train Stop Dots */}
                {points.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4 : 2.5}
                    fill={strokeColor}
                    stroke="#0f172a"
                    strokeWidth="1"
                  />
                ))}
              </g>
            );
          })}

          {/* Current Simulation Time Scrub Line */}
          {currentSimulationMinutes >= timeRange.start && currentSimulationMinutes <= timeRange.end && (
            <g id="sim-time-scrub">
              <line
                x1={getX(currentSimulationMinutes)}
                y1={padding.top}
                x2={getX(currentSimulationMinutes)}
                y2={padding.top + plotHeight}
                stroke="#C87428"
                strokeWidth="2"
              />
              {/* Top pointer badge */}
              <polygon
                points={`${getX(currentSimulationMinutes) - 6},${padding.top - 8} ${getX(currentSimulationMinutes) + 6},${padding.top - 8} ${getX(currentSimulationMinutes)},${padding.top}`}
                fill="#C87428"
              />
              <text
                x={getX(currentSimulationMinutes)}
                y={padding.top - 12}
                fill="#C87428"
                fontSize="10"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                LIVE {minutesToTime(currentSimulationMinutes)}
              </text>
            </g>
          )}

          {/* Axes labels */}
          <text
            x={padding.left / 2}
            y={padding.top - 10}
            fill="#8F8A80"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            STATION / KM
          </text>
          <text
            x={padding.left + plotWidth / 2}
            y={padding.top + plotHeight + 35}
            fill="#8F8A80"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            TIME (HOURS IST)
          </text>
        </svg>
      </div>

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#636059] bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D4]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-[#181816]">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
            <span>Vande Bharat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-600 inline-block"></span>
            <span>Rajdhani / Premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span>
            <span>Mail / Express</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-600 inline-block"></span>
            <span>Freight (BOXN/Container)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#C87428]/20 border border-[#C87428] rounded-xs inline-block"></span>
            <span>Bundled Shadow Block</span>
          </div>
        </div>

        <div className="text-[11px] text-[#8F8A80] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#636059]" />
          Click on any train line or block rectangle to inspect details & approval flow.
        </div>
      </div>
    </div>
  );
};
