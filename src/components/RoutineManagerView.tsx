import React, { useState, useRef, useEffect } from 'react';
import { Corridor, Train, TrainType, TrainScheduleStop } from '../types';
import { 
  Train as TrainIcon, 
  Upload, 
  FileText, 
  Plus, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Filter, 
  Search,
  Check,
  Calendar,
  Layers
} from 'lucide-react';
import { CORRIDOR_TRAINS } from '../data/mockData';

const MAJOR_JUNCTIONS = [
  { name: 'New Delhi', code: 'NDLS' },
  { name: 'Howrah Jn.', code: 'HWH' },
  { name: 'Mumbai Central', code: 'MMCT' },
  { name: 'Varanasi Jn.', code: 'BSB' },
  { name: 'Patna Jn.', code: 'PNBE' },
  { name: 'Ahmedabad Jn.', code: 'ADI' },
  { name: 'Chennai Central', code: 'MAS' },
  { name: 'KSR Bengaluru', code: 'SBC' },
  { name: 'Sealdah', code: 'SDAH' },
  { name: 'Kanpur Central', code: 'CNB' },
  { name: 'Prayagraj Jn.', code: 'PRYJ' },
  { name: 'Pt. Deen Dayal Upadhyaya Jn.', code: 'DDU' },
  { name: 'Gorakhpur Jn.', code: 'GKP' },
  { name: 'Amritsar Jn.', code: 'ASR' },
  { name: 'Guwahati', code: 'GHY' },
  { name: 'Secunderabad Jn.', code: 'SC' }
];

interface RoutineManagerViewProps {
  corridor: Corridor;
  trains: Train[];
  onUpdateTrains: (newTrains: Train[]) => void;
  onAddTrain: (train: Train) => void;
  onRemoveTrain: (trainId: string) => void;
  onGoToStringDiagram: () => void;
}

export const RoutineManagerView: React.FC<RoutineManagerViewProps> = ({
  corridor,
  trains,
  onUpdateTrains,
  onAddTrain,
  onRemoveTrain,
  onGoToStringDiagram
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterDirection, setFilterDirection] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [selectedAIRoutineOption, setSelectedAIRoutineOption] = useState<'OPTION_A' | 'OPTION_B' | 'OPTION_C'>('OPTION_A');
  const [lastInjectedTrainId, setLastInjectedTrainId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3 AI Generated Routine Candidates Definition
  const aiRoutineOptions = [
    {
      id: 'OPTION_A',
      badge: 'Recommended • Passenger Priority',
      badgeColor: 'bg-[#EBF5EE] text-[#2D7A4D] border-[#C6E7D2]',
      title: 'Option 1: Passenger Punctuality Focus & Dynamic Loop Siding',
      description: 'Zero delay on Vande Bharat & Rajdhani express trains. Coal freight rakes regulated in loop sidings during the 01:30–04:30 shadow block window.',
      windowTiming: '01:30 – 04:30 (180 mins)',
      metrics: {
        punctuality: '99.2%',
        freightThroughput: '96.5%',
        trackGain: '+28.5%',
        avgDelay: '1.1 min'
      },
      trainImpactSummary: 'Rajdhani (0m delay) • Vande Bharat (0m delay) • Freight BOXN (Regulate 22m at Loop)',
      applyChanges: () => {
        const updated = trains.map(t => {
          if (t.type.includes('Freight')) {
            return { ...t, currentDelayMinutes: 22, currentStatus: 'Regulated at Siding' as const, regulatedAtStation: corridor.stations[1]?.name || 'Loop' };
          }
          return { ...t, currentDelayMinutes: 0, currentStatus: 'On Time' as const, regulatedAtStation: undefined };
        });
        onUpdateTrains(updated);
        setSelectedAIRoutineOption('OPTION_A');
        setUploadSuccessMessage('Applied AI Routine Option 1: Passenger Punctuality Priority (Zero passenger conflict).');
      }
    },
    {
      id: 'OPTION_B',
      badge: 'Freight Throughput Priority',
      badgeColor: 'bg-[#EFF5FB] text-[#2563eb] border-[#D0E2F5]',
      title: 'Option 2: Continuous Freight Corridor & Thermal Coal Delivery',
      description: 'Shifts maintenance possession to 02:15–05:15. Heavy coal rakes pass through without loop regulation; minor 4-min caution on Mail/Express trains.',
      windowTiming: '02:15 – 05:15 (180 mins)',
      metrics: {
        punctuality: '97.4%',
        freightThroughput: '99.8%',
        trackGain: '+26.0%',
        avgDelay: '3.2 min'
      },
      trainImpactSummary: 'Freight BOXN (0m delay) • Rajdhani (0m delay) • Mail/Express (+4m caution buffer)',
      applyChanges: () => {
        const updated = trains.map(t => {
          if (t.type === 'Mail / Express') {
            return { ...t, currentDelayMinutes: 4, currentStatus: 'Running Late' as const, regulatedAtStation: undefined };
          }
          return { ...t, currentDelayMinutes: 0, currentStatus: 'On Time' as const, regulatedAtStation: undefined };
        });
        onUpdateTrains(updated);
        setSelectedAIRoutineOption('OPTION_B');
        setUploadSuccessMessage('Applied AI Routine Option 2: Continuous Freight Throughput Priority.');
      }
    },
    {
      id: 'OPTION_C',
      badge: 'Mega Engineering Possession',
      badgeColor: 'bg-[#FDF3EA] text-[#C87428] border-[#F7D4B8]',
      title: 'Option 3: Maximum Engineering Clearance (210-Min Mega Window)',
      description: 'Expands possession window to 210 mins (01:45–05:15) to clear 100% of P-Way + TRD + S&T backlog in a single night. 30 km/h caution order on adjacent line.',
      windowTiming: '01:45 – 05:15 (210 mins)',
      metrics: {
        punctuality: '94.8%',
        freightThroughput: '92.0%',
        trackGain: '+38.5%',
        avgDelay: '4.6 min'
      },
      trainImpactSummary: 'Mega 210m Shadow Block • Universal 30 km/h Caution Order • +6m buffer on 2 trains',
      applyChanges: () => {
        const updated = trains.map((t, idx) => {
          if (idx >= 2) {
            return { ...t, currentDelayMinutes: 8, currentStatus: 'Running Late' as const, regulatedAtStation: undefined };
          }
          return { ...t, currentDelayMinutes: 0, currentStatus: 'On Time' as const, regulatedAtStation: undefined };
        });
        onUpdateTrains(updated);
        setSelectedAIRoutineOption('OPTION_C');
        setUploadSuccessMessage('Applied AI Routine Option 3: Mega 210-Min Engineering Window.');
      }
    }
  ];

  // Helper to compute progressive default stop timings
  const getDefaultStops = (dir: 'UP' | 'DOWN') => {
    const initial: { [code: string]: { arr: string; dep: string; stop: boolean } } = {};
    const stationsList = dir === 'UP' ? [...corridor.stations].reverse() : corridor.stations;
    stationsList.forEach((st, idx) => {
      const baseHour = (6 + idx * 2) % 24;
      const hourStr = baseHour < 10 ? `0${baseHour}` : `${baseHour}`;
      initial[st.code] = {
        arr: `${hourStr}:00`,
        dep: `${hourStr}:05`,
        stop: idx === 0 || idx === stationsList.length - 1
      };
    });
    return initial;
  };

  // New Train Form State
  const [newTrainNumber, setNewTrainNumber] = useState('');
  const [newTrainName, setNewTrainName] = useState('');
  const [newTrainType, setNewTrainType] = useState<TrainType>('Mail / Express');
  const [newTrainDirection, setNewTrainDirection] = useState<'UP' | 'DOWN'>('DOWN');
  const [newTrainPriority, setNewTrainPriority] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [newTrainSpeed, setNewTrainSpeed] = useState<number>(100);
  const [newTrainOrigin, setNewTrainOrigin] = useState(corridor.stations[0]?.name || 'Origin');
  const [newTrainDestination, setNewTrainDestination] = useState(corridor.stations[corridor.stations.length - 1]?.name || 'Destination');
  const [newTrainStops, setNewTrainStops] = useState<{ [code: string]: { arr: string; dep: string; stop: boolean } }>(() => getDefaultStops('DOWN'));

  useEffect(() => {
    if (corridor.stations.length > 0) {
      if (newTrainDirection === 'DOWN') {
        setNewTrainOrigin(corridor.stations[0].name);
        setNewTrainDestination(corridor.stations[corridor.stations.length - 1].name);
      } else {
        setNewTrainOrigin(corridor.stations[corridor.stations.length - 1].name);
        setNewTrainDestination(corridor.stations[0].name);
      }
      setNewTrainStops(getDefaultStops(newTrainDirection));
    }
  }, [corridor.id, newTrainDirection]);

  // Filtered trains
  const filteredTrains = trains.filter(t => {
    const matchesSearch = 
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesDirection = filterDirection === 'ALL' || t.direction === filterDirection;

    return matchesSearch && matchesType && matchesDirection;
  });

  // Handle JSON/CSV File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].number && parsed[0].stops) {
            onUpdateTrains(parsed);
            setUploadSuccessMessage(`Successfully loaded ${parsed.length} train routines from ${file.name}`);
            setUploadErrorMessage(null);
          } else {
            throw new Error('Invalid JSON format. Expected array of Train objects with stops.');
          }
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parsing (Header: number,name,type,direction,speed,origin,destination)
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length < 2) throw new Error('CSV file is empty or missing headers.');
          
          const newParsedTrains: Train[] = [];
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
            if (parts.length >= 5) {
              const [number, name, type, direction, speedStr, origin, destination] = parts;
              const trainType = (type as TrainType) || 'Mail / Express';
              const isUp = direction?.toUpperCase() === 'UP';
              
              // Generate synthetic stops across corridor stations
              const stops: TrainScheduleStop[] = corridor.stations.map((st, idx) => {
                const hour = 4 + (isUp ? (corridor.stations.length - 1 - idx) : idx) * 2;
                const hStr = (hour % 24).toString().padStart(2, '0');
                return {
                  stationCode: st.code,
                  stationName: st.name,
                  scheduledArrival: `${hStr}:00`,
                  scheduledDeparture: `${hStr}:05`,
                  isStopping: idx === 0 || idx === corridor.stations.length - 1 || idx % 2 === 0
                };
              });

              newParsedTrains.push({
                id: `tr-csv-${Date.now()}-${i}`,
                number: number || `EXP-${1000 + i}`,
                name: name || `Corridor Special ${i}`,
                type: trainType,
                priorityTier: trainType.includes('Vande') || trainType.includes('Rajdhani') ? 1 : 3,
                direction: isUp ? 'UP' : 'DOWN',
                origin: origin || corridor.stations[0].name,
                destination: destination || corridor.stations[corridor.stations.length - 1].name,
                stops,
                currentDelayMinutes: 0,
                averageSpeedKmH: parseInt(speedStr, 10) || 90,
                routeColor: isUp ? '#dc2626' : '#2563eb',
                currentStatus: 'On Time'
              });
            }
          }

          if (newParsedTrains.length > 0) {
            onUpdateTrains(newParsedTrains);
            setUploadSuccessMessage(`Successfully ingested ${newParsedTrains.length} train routines from CSV.`);
            setUploadErrorMessage(null);
          } else {
            throw new Error('Could not parse any valid train records from CSV.');
          }
        } else {
          throw new Error('Unsupported file format. Please upload .json or .csv Working Time Table files.');
        }
      } catch (err: any) {
        setUploadErrorMessage(err.message || 'Failed to parse file.');
        setUploadSuccessMessage(null);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load standard template for current corridor
  const handleLoadCorridorTemplate = () => {
    const baseTrains = CORRIDOR_TRAINS[corridor.id] || CORRIDOR_TRAINS['ncr-hdn-1'];
    onUpdateTrains(baseTrains);
    setUploadSuccessMessage(`Loaded Official Indian Railways WTT for ${corridor.name} (${baseTrains.length} trains).`);
    setUploadErrorMessage(null);
  };

  // Export current routine
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trains, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IR_WTT_${corridor.id}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Submit Add Train
  const handleCreateTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainNumber || !newTrainName) return;

    // Order stations along the direction of travel
    const orderedStations = newTrainDirection === 'UP' ? [...corridor.stations].reverse() : corridor.stations;

    const stops: TrainScheduleStop[] = orderedStations.map((st) => {
      const stopInfo = newTrainStops[st.code] || { arr: '08:00', dep: '08:05', stop: true };
      return {
        stationCode: st.code,
        stationName: st.name,
        scheduledArrival: stopInfo.arr,
        scheduledDeparture: stopInfo.dep,
        isStopping: stopInfo.stop
      };
    });

    const colors: { [key in TrainType]: string } = {
      'Vande Bharat': '#2563eb',
      'Rajdhani / Shatabdi': '#dc2626',
      'Mail / Express': '#16a34a',
      'Suburban EMU': '#0284c7',
      'Freight (Coal Rake)': '#9333ea',
      'Freight (Container)': '#d97706',
      'Departmental Material': '#475569'
    };

    const newTrain: Train = {
      id: `tr-custom-${Date.now()}`,
      number: newTrainNumber,
      name: newTrainName,
      type: newTrainType,
      priorityTier: newTrainPriority,
      direction: newTrainDirection,
      origin: newTrainOrigin,
      destination: newTrainDestination,
      stops,
      currentDelayMinutes: 0,
      averageSpeedKmH: newTrainSpeed,
      routeColor: colors[newTrainType] || '#2563eb',
      currentStatus: 'On Time'
    };

    onAddTrain(newTrain);
    setLastInjectedTrainId(newTrain.id);
    setIsAddModalOpen(false);
    setUploadSuccessMessage(`Successfully injected Train ${newTrain.number} (${newTrain.name}) into ${corridor.name} schedule.`);
    
    // Auto scroll down to schedule table so the user immediately sees it
    setTimeout(() => {
      const tableElem = document.getElementById('routine-schedule-table');
      if (tableElem) {
        tableElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);

    // Reset Form
    setNewTrainNumber('');
    setNewTrainName('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#181816] flex items-center justify-center text-[#FAF7F2] shrink-0 shadow-xs">
              <Calendar className="w-5 h-5 text-[#C87428]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2] uppercase tracking-wider font-mono">
                  Operational Working Time Table (WTT)
                </span>
                <span className="text-xs text-[#636059] font-mono">
                  • {corridor.division}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#181816] mt-0.5">
                Railway Timetable & Routine Schedule Manager
              </h2>
              <p className="text-xs text-[#636059] mt-0.5">
                Ingest official IR timetables, inject special train paths, and synchronize corridor train movements with the CP-SAT optimizer.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadCorridorTemplate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE7] text-[#181816] border border-[#E6E0D4] text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
              title="Reload the standard Working Time Table for this corridor"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C87428]" />
              <span>Load Corridor WTT</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#C87428]" />
              <span>Upload WTT (.json/.csv)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.csv,.txt"
              className="hidden"
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2D7A4D] hover:bg-[#24633E] text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Train</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE7] text-[#636059] hover:text-[#181816] border border-[#E6E0D4] transition cursor-pointer shadow-xs"
              title="Export active timetable as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Messages */}
        {uploadSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#EBF5EE] border border-[#C6E7D2] text-[#2D7A4D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D7A4D]" />
              <span>{uploadSuccessMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const tableElem = document.getElementById('routine-schedule-table');
                  if (tableElem) tableElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-3 py-1 rounded-full bg-[#2D7A4D] text-white hover:bg-[#24633E] font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
              >
                <span>↓ View in Schedule Below</span>
              </button>
              <button
                type="button"
                onClick={onGoToStringDiagram}
                className="px-3 py-1 rounded-full bg-[#181816] text-white hover:bg-[#2C2B27] font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
              >
                <span>📈 Live Graph</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setUploadSuccessMessage(null)}
                className="text-[#2D7A4D] hover:underline font-bold text-xs px-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {uploadErrorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#DC2626] flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
              <span>{uploadErrorMessage}</span>
            </div>
            <button 
              onClick={() => setUploadErrorMessage(null)}
              className="text-[#DC2626] hover:underline font-bold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Corridor Timetable Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#EDE7DC]">
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
            <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
              Total Active Trains
            </span>
            <span className="text-base font-bold text-[#181816] font-mono mt-0.5 block">
              {trains.length} Scheduled Paths
            </span>
            <span className="text-[10.5px] text-[#636059]">Across 24-hr cycle</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
            <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
              High-Priority Express
            </span>
            <span className="text-base font-bold text-[#2563eb] font-mono mt-0.5 block">
              {trains.filter(t => t.priorityTier === 1).length} Rakes (Tier-1)
            </span>
            <span className="text-[10.5px] text-[#636059]">Vande Bharat / Rajdhani</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
            <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
              Freight & Material
            </span>
            <span className="text-base font-bold text-[#9333ea] font-mono mt-0.5 block">
              {trains.filter(t => t.type.includes('Freight') || t.type.includes('Material')).length} Paths
            </span>
            <span className="text-[10.5px] text-[#636059]">Stabled in loop sidings</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4]">
            <span className="text-[10px] uppercase font-bold text-[#8F8A80] tracking-wider block">
              Time-Space Sync
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#2D7A4D] animate-pulse"></span>
              <span className="text-xs font-bold text-[#2D7A4D]">100% Synchronized</span>
            </div>
            <button
              onClick={onGoToStringDiagram}
              className="text-[10.5px] text-[#C87428] font-bold hover:underline inline-flex items-center gap-0.5 mt-0.5"
            >
              <span>View String Graph</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 AI-GENERATED ROUTINE CANDIDATES (Choose between 3 AI Options) */}
      <div className="bg-white border border-[#E6E0D4] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE7DC] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#181816] text-[#FAF7F2]">
              <Sparkles className="w-4 h-4 text-[#C87428]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181816]">
                AI Routine Candidate Options (Select Preferred Policy)
              </h3>
              <p className="text-xs text-[#636059]">
                RailAI synthesized 3 viable timetable & block possession options for officials to evaluate.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-[#FAF7F2] text-[#181816] px-3 py-1 rounded-full border border-[#E6E0D4] self-start sm:self-auto">
            Active Selection: <strong className="text-[#2D7A4D]">{selectedAIRoutineOption === 'OPTION_A' ? 'Option 1' : selectedAIRoutineOption === 'OPTION_B' ? 'Option 2' : 'Option 3'}</strong>
          </span>
        </div>

        {/* 3 Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {aiRoutineOptions.map(opt => {
            const isSelected = selectedAIRoutineOption === opt.id;
            return (
              <div
                key={opt.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-[#181816] ring-2 ring-[#181816] shadow-sm'
                    : 'bg-[#FAF7F2] border-[#E6E0D4] hover:bg-white hover:border-[#181816]/40'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold font-mono bg-[#181816] text-white px-2 py-0.5 rounded-full">
                        ✓ Active
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-[#181816] text-xs">
                    {opt.title}
                  </h4>
                  <p className="text-[11px] text-[#636059] leading-relaxed">
                    {opt.description}
                  </p>

                  <div className="p-2 rounded-xl bg-white border border-[#E6E0D4] flex flex-col gap-1 text-[10.5px]">
                    <span className="font-mono text-[#8F8A80] text-[9.5px] uppercase font-bold">
                      Block Window: <strong className="text-[#181816]">{opt.windowTiming}</strong>
                    </span>
                    <span className="text-[#636059] text-[10.5px]">
                      {opt.trainImpactSummary}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-[#EDE7DC] text-center font-mono text-[10.5px]">
                    <div>
                      <span className="text-[8.5px] text-[#8F8A80] block">Punctuality</span>
                      <strong className="text-[#2D7A4D]">{opt.metrics.punctuality}</strong>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-[#8F8A80] block">Freight</span>
                      <strong className="text-[#181816]">{opt.metrics.freightThroughput}</strong>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-[#8F8A80] block">Track Gain</span>
                      <strong className="text-[#2563eb]">{opt.metrics.trackGain}</strong>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-[#8F8A80] block">Avg Delay</span>
                      <strong className="text-[#C87428]">{opt.metrics.avgDelay}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={opt.applyChanges}
                  className={`w-full py-2 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#2D7A4D] text-white hover:bg-[#24633E]'
                      : 'bg-[#181816] text-white hover:bg-[#2C2B27]'
                  }`}
                >
                  {isSelected ? '✓ Routine Currently Applied' : 'Apply This AI Routine'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Table & Filters */}
      <div id="routine-schedule-table" className="bg-white border border-[#E6E0D4] rounded-3xl p-5 shadow-sm flex flex-col gap-4 scroll-mt-24">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#8F8A80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search train by number, name, origin, destination..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs text-[#181816] focus:outline-none focus:border-[#181816]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs font-medium text-[#181816] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Train Types ({trains.length})</option>
              <option value="Vande Bharat">Vande Bharat</option>
              <option value="Rajdhani / Shatabdi">Rajdhani / Shatabdi</option>
              <option value="Mail / Express">Mail / Express</option>
              <option value="Suburban EMU">Suburban EMU / Local</option>
              <option value="Freight (Coal Rake)">Freight (Coal)</option>
              <option value="Freight (Container)">Freight (Container)</option>
              <option value="Departmental Material">Departmental Material</option>
            </select>

            <select
              value={filterDirection}
              onChange={e => setFilterDirection(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] text-xs font-medium text-[#181816] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Directions</option>
              <option value="UP">UP Direction (Towards Terminus / Delhi)</option>
              <option value="DOWN">DOWN Direction (Away from Delhi)</option>
            </select>
          </div>
        </div>

        {/* Master Timetable Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EDE7DC]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EDE7DC] text-[#636059] font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3 pl-4">Train No. & Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Dir</th>
                <th className="p-3">Origin → Destination</th>
                <th className="p-3">Route Station Timings</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE7DC]">
              {filteredTrains.map(train => {
                const isNewlyInjected = train.id === lastInjectedTrainId || train.id.startsWith('tr-custom-') || train.id.startsWith('tr-csv-');
                return (
                <tr 
                  key={train.id} 
                  className={`transition ${
                    isNewlyInjected 
                      ? 'bg-[#EBF5EE]/50 hover:bg-[#EBF5EE]/80' 
                      : 'hover:bg-[#FAF7F2]/60'
                  }`}
                >
                  {/* Number & Name */}
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: train.routeColor }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#181816] text-xs">
                            {train.number}
                          </span>
                          {isNewlyInjected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#2D7A4D] text-white font-mono uppercase tracking-wide">
                              Injected
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#636059] line-clamp-1">
                          {train.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Tier */}
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                      train.priorityTier === 1 
                        ? 'bg-[#EFF5FB] text-[#2563eb] border border-[#D0E2F5]'
                        : train.priorityTier === 2
                        ? 'bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2]'
                        : 'bg-[#FAF7F2] text-[#636059] border border-[#E6E0D4]'
                    }`}>
                      Tier-{train.priorityTier} • {train.type}
                    </span>
                  </td>

                  {/* Direction */}
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      train.direction === 'UP' ? 'bg-[#FDF2F2] text-[#DC2626]' : 'bg-[#EFF5FB] text-[#2563eb]'
                    }`}>
                      {train.direction}
                    </span>
                  </td>

                  {/* Origin -> Dest */}
                  <td className="p-3 text-[#181816] font-medium text-[11px]">
                    <div>{train.origin}</div>
                    <div className="text-[#8F8A80] text-[10px]">↓ {train.destination}</div>
                  </td>

                  {/* Station Timings chips */}
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-1 max-w-xs">
                      {train.stops.map(st => (
                        <span 
                          key={st.stationCode}
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono border ${
                            st.isStopping 
                              ? 'bg-white border-[#C87428]/40 text-[#181816] font-bold'
                              : 'bg-[#FAF7F2] border-[#EDE7DC] text-[#8F8A80]'
                          }`}
                          title={`${st.stationName}: Arr ${st.scheduledArrival} / Dep ${st.scheduledDeparture} (${st.isStopping ? 'Halt' : 'Pass'})`}
                        >
                          {st.stationCode}:{st.scheduledArrival}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Speed */}
                  <td className="p-3 font-mono text-[#181816] font-semibold text-[11px]">
                    {train.averageSpeedKmH} km/h
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      train.currentStatus === 'On Time'
                        ? 'bg-[#EBF5EE] text-[#2D7A4D]'
                        : train.currentStatus === 'Regulated at Siding'
                        ? 'bg-[#FDF3EA] text-[#C87428]'
                        : 'bg-[#FDF2F2] text-[#DC2626]'
                    }`}>
                      {train.currentStatus}
                      {train.currentDelayMinutes > 0 && ` (+${train.currentDelayMinutes}m)`}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 text-right pr-4">
                    <button
                      onClick={() => onRemoveTrain(train.id)}
                      className="p-1.5 rounded-lg hover:bg-[#FDF2F2] text-[#8F8A80] hover:text-[#DC2626] transition cursor-pointer"
                      title="Withdraw / Cancel Train from Timetable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Train Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6E0D4] max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#181816] text-white">
                  <TrainIcon className="w-4 h-4 text-[#C87428]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181816]">Inject Custom Train Routine</h3>
                  <p className="text-xs text-[#636059]">Add a special rake, festival train, or departmental movement</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F3EEE7] text-[#636059] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrainSubmit} className="mt-4 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Train Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09415"
                    value={newTrainNumber}
                    onChange={e => setNewTrainNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs focus:outline-none focus:border-[#181816]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Train Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festival Superfast Special"
                    value={newTrainName}
                    onChange={e => setNewTrainName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#181816]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Train Category</label>
                  <select
                    value={newTrainType}
                    onChange={e => setNewTrainType(e.target.value as TrainType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none"
                  >
                    <option value="Mail / Express">Mail / Express</option>
                    <option value="Suburban EMU">Suburban EMU / Local</option>
                    <option value="Vande Bharat">Vande Bharat</option>
                    <option value="Rajdhani / Shatabdi">Rajdhani / Shatabdi</option>
                    <option value="Freight (Coal Rake)">Freight (Coal)</option>
                    <option value="Freight (Container)">Freight (Container)</option>
                    <option value="Departmental Material">Departmental Material</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Direction</label>
                  <select
                    value={newTrainDirection}
                    onChange={e => setNewTrainDirection(e.target.value as 'UP' | 'DOWN')}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none font-mono"
                  >
                    <option value="UP">UP Line (Towards Terminus)</option>
                    <option value="DOWN">DOWN Line (Away from Delhi/HWH)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Avg Speed (km/h)</label>
                  <input
                    type="number"
                    value={newTrainSpeed}
                    onChange={e => setNewTrainSpeed(parseInt(e.target.value, 10) || 80)}
                    min={30}
                    max={160}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Origin Station</label>
                  <select
                    value={newTrainOrigin}
                    onChange={e => setNewTrainOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#181816] cursor-pointer"
                  >
                    <optgroup label={`Corridor Stations (${corridor.name})`}>
                      {corridor.stations.map((st) => (
                        <option key={`origin-st-${st.code}`} value={st.name}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Major Junctions & Terminals">
                      {MAJOR_JUNCTIONS.filter(j => !corridor.stations.some(s => s.code === j.code)).map((j) => (
                        <option key={`origin-maj-${j.code}`} value={j.name}>
                          {j.name} ({j.code})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Destination Station</label>
                  <select
                    value={newTrainDestination}
                    onChange={e => setNewTrainDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#181816] cursor-pointer"
                  >
                    <optgroup label={`Corridor Stations (${corridor.name})`}>
                      {corridor.stations.map((st) => (
                        <option key={`dest-st-${st.code}`} value={st.name}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Major Junctions & Terminals">
                      {MAJOR_JUNCTIONS.filter(j => !corridor.stations.some(s => s.code === j.code)).map((j) => (
                        <option key={`dest-maj-${j.code}`} value={j.name}>
                          {j.name} ({j.code})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Station Stop Timings */}
              <div>
                <label className="font-bold text-[#181816] block mb-1">
                  Corridor Station Schedule (24-Hour Format • Ordered along direction of travel)
                </label>
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E0D4] flex flex-col gap-2 max-h-44 overflow-y-auto">
                  {(newTrainDirection === 'UP' ? [...corridor.stations].reverse() : corridor.stations).map((st) => {
                    const current = newTrainStops[st.code] || { arr: '08:00', dep: '08:05', stop: true };
                    return (
                      <div key={st.code} className="flex items-center justify-between gap-2 py-1 border-b border-[#EDE7DC] last:border-b-0">
                        <div className="w-28 font-mono font-bold text-[#181816] text-xs">
                          {st.code} ({st.name.split(' ')[0]})
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-[#8F8A80]">Arr:</label>
                          <input
                            type="time"
                            value={current.arr}
                            onChange={e => {
                              setNewTrainStops(prev => ({
                                ...prev,
                                [st.code]: { ...current, arr: e.target.value }
                              }));
                            }}
                            className="px-2 py-1 rounded-lg border border-[#E6E0D4] bg-white text-xs font-mono"
                          />
                          <label className="text-[10px] text-[#8F8A80]">Dep:</label>
                          <input
                            type="time"
                            value={current.dep}
                            onChange={e => {
                              setNewTrainStops(prev => ({
                                ...prev,
                                [st.code]: { ...current, dep: e.target.value }
                              }));
                            }}
                            className="px-2 py-1 rounded-lg border border-[#E6E0D4] bg-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EDE7DC]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E0D4] bg-[#FAF7F2] hover:bg-[#F3EEE7] text-[#636059] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                >
                  Inject Train into Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
