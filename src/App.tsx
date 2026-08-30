import React, { useState, useEffect, useRef } from 'react';
import { 
  Corridor, 
  Train, 
  Requisition, 
  BlockWindow, 
  WhatIfScenario, 
  AuditLogEntry, 
  Approvals, 
  SafetyChecklist, 
  ControllerAlterationProposal,
  AIRescheduleOption,
  ManualModeState 
} from './types';
import { 
  INITIAL_CORRIDORS, 
  INITIAL_TRAINS, 
  INITIAL_REQUISITIONS, 
  INITIAL_BLOCKS, 
  INITIAL_WHAT_IF_SCENARIOS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_PROPOSALS
} from './data/mockData';
import { Header } from './components/Header';
import { AdversityManualModePanel } from './components/AdversityManualModePanel';
import { StringDiagram } from './components/StringDiagram';
import { OptimizerView } from './components/OptimizerView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ControllerConsensusView } from './components/ControllerConsensusView';
import { StationNotificationBanner } from './components/StationNotificationBanner';
import { ApprovalWorkflow } from './components/ApprovalWorkflow';
import { AnalyticsView } from './components/AnalyticsView';
import { CopilotModal } from './components/CopilotModal';
import { BlockDetailModal } from './components/BlockDetailModal';
import { TrainDetailModal } from './components/TrainDetailModal';
import { timeToMinutes } from './utils/timeUtils';

export default function App() {
  const [corridors] = useState<Corridor[]>(INITIAL_CORRIDORS);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor>(INITIAL_CORRIDORS[0]);

  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [requisitions, setRequisitions] = useState<Requisition[]>(INITIAL_REQUISITIONS);
  const [blocks, setBlocks] = useState<BlockWindow[]>(INITIAL_BLOCKS);
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(INITIAL_WHAT_IF_SCENARIOS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [proposals, setProposals] = useState<ControllerAlterationProposal[]>(INITIAL_PROPOSALS);

  const [activeTab, setActiveTab] = useState<'STRING_GRAPH' | 'OPTIMIZER' | 'WHAT_IF' | 'CONSENSUS' | 'APPROVAL' | 'ANALYTICS'>('STRING_GRAPH');

  // Simulation Clock (starts at 02:15 = 135 minutes)
  const [currentSimMinutes, setCurrentSimMinutes] = useState<number>(135);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Modals & Drawers
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockWindow | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

  // Clock ticker effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSimMinutes(prev => (prev + simSpeed * 0.25) % 1440);
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Conflict calculation
  const conflictCount = trains.filter(t => {
    if (t.currentDelayMinutes === 0) return false;
    return blocks.some(b => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      // check if any stop is within block time
      return t.stops.some(st => {
        const arrival = timeToMinutes(st.scheduledArrival) + t.currentDelayMinutes;
        return arrival >= bStart && arrival <= bEnd;
      });
    });
  }).length;

  // Add new requisition
  const handleAddRequisition = (newReq: Requisition) => {
    setRequisitions(prev => [newReq, ...prev]);
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'Operations Controller',
      action: 'New Requisition Ingested',
      category: 'OPTIMIZATION',
      details: `Added ${newReq.department} request: "${newReq.title}" at Km ${newReq.startKm}-${newReq.endKm}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Run CP-SAT multi-departmental bundling
  const handleApplyOptimization = () => {
    // Group unassigned requisitions into new block or bundle them
    const pending = requisitions.filter(r => r.status === 'pending');

    if (pending.length > 0) {
      // Create second integrated block for Kanpur-Etawah section
      const newBlock: BlockWindow = {
        id: `blk-ncr-02-${Date.now()}`,
        code: `BLK-NCR-2025-002`,
        title: 'Integrated Afternoon Track & Signalling Window',
        corridorId: selectedCorridor.id,
        sectionId: 'sec-cnb-etw',
        sectionName: 'Kanpur Central – Rura Section (Km 1040 to 1053)',
        startKm: 1040,
        endKm: 1053,
        lineType: 'DOWN MAIN',
        startTime: '12:15',
        endTime: '15:15',
        durationMinutes: 180,
        bundledRequisitions: pending,
        departmentsInvolved: Array.from(new Set(pending.map(p => p.department))),
        status: 'recommended',
        confidenceScore: 94,
        punctualityImpact: {
          delayedTrainsCount: 0,
          totalDelayMinutes: 0,
          regulatedTrains: [],
          speedRestrictionsImposed: 'Caution Order 45 km/h during BCM ballast screening'
        },
        metrics: {
          assetAvailabilityGainPercent: 24.2,
          possessionHoursSavedMinutes: 180,
          shadowBundleEfficiency: 88.5,
          passengerPunctualityImpactMinutes: 0,
          freightThroughputPreservedPercent: 98.0
        },
        safetyChecklist: {
          oheIsolated: false,
          earthDischarged: false,
          stMemoReceived: true,
          cautionOrderIssued: true,
          flaggerPosted: true
        },
        approvals: {
          pwayApproved: true,
          trdApproved: false,
          stApproved: true,
          chiefControllerApproved: false,
          approverName: 'Section Controller (Kanpur Area)'
        }
      };

      // Mark pending as bundled
      setRequisitions(prev => prev.map(r => ({ ...r, status: 'bundled', assignedBlockId: newBlock.code })));
      setBlocks(prev => [...prev, newBlock]);

      const log: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        user: 'RailAI CP-SAT Optimizer',
        action: 'Synthesized Integrated Block 002',
        category: 'OPTIMIZATION',
        details: `Bundled ${pending.length} requisitions into BLK-NCR-2025-002 (12:15 - 15:15). Asset availability index increased by +24.2%.`,
        blockId: newBlock.id
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  // What-If scenario injection
  const handleApplyScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => {
      if (s.id === scenarioId) {
        return { ...s, isApplied: true };
      }
      return s;
    }));

    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    if (scenario.triggerDetails.trainNumber) {
      setTrains(prev => prev.map(t => {
        if (t.number === scenario.triggerDetails.trainNumber) {
          return {
            ...t,
            currentDelayMinutes: scenario.triggerDetails.addedDelayMinutes || 45,
            currentStatus: 'Running Late'
          };
        }
        return t;
      }));
    }

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'Dynamic Dispatch Simulator',
      action: `Injected Disruption: ${scenario.title}`,
      category: 'WHAT_IF_SIMULATION',
      details: scenario.impactSummary
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Reset disruptions
  const handleResetScenarios = () => {
    setScenarios(prev => prev.map(s => ({ ...s, isApplied: false })));
    setTrains(prev => prev.map(t => ({ ...t, currentDelayMinutes: 0, currentStatus: 'On Time' })));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'Operations Controller',
      action: 'Reset Disruption Scenarios',
      category: 'WHAT_IF_SIMULATION',
      details: 'All simulated train delays & fault triggers restored to base timetable.'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Dynamic Re-Plan applied
  const handleDynamicReplan = (scenario: WhatIfScenario, replanResult: any) => {
    // Shift block 1 from 01:30 to 02:15 to accommodate delayed Rajdhani
    setBlocks(prev => prev.map((b, idx) => {
      if (idx === 0) {
        return {
          ...b,
          startTime: '02:15',
          endTime: '05:15',
          confidenceScore: 98,
          algorithmNotes: 'Dynamic Re-Plan shifted start by +45 mins to clear delayed Superfast 12301 right-of-way.'
        };
      }
      return b;
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'RailAI Dynamic Re-Plan Engine',
      action: 'Schedule Dynamic Shift Executed',
      category: 'RE_PLAN',
      details: `Shifted Block BLK-NCR-2025-001 start window from 01:30 to 02:15. Zero passenger train conflicts.`,
      blockId: blocks[0]?.id
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Approvals and Safety checklist update
  const handleUpdateApprovals = (blockId: string, approvals: Approvals, checklist: SafetyChecklist) => {
    const isFullyApproved = approvals.pwayApproved && approvals.trdApproved && approvals.stApproved && approvals.chiefControllerApproved;

    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          approvals,
          safetyChecklist: checklist,
          status: isFullyApproved ? 'operations_approved' : 'controller_validated'
        };
      }
      return b;
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: approvals.approverName || 'Section Controller',
      action: isFullyApproved ? 'Legal Sanction Granted' : 'Safety Checklist Updated',
      category: 'APPROVAL',
      details: isFullyApproved
        ? `Block ${blockId} formally sanctioned. Digital Circular Notice published.`
        : `Safety checklist updated for Block ${blockId}.`,
      blockId
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Add delay to train
  const handleAddTrainDelay = (trainId: string, delayMinutes: number) => {
    setTrains(prev => prev.map(t => {
      if (t.id === trainId) {
        return {
          ...t,
          currentDelayMinutes: delayMinutes,
          currentStatus: delayMinutes > 0 ? 'Running Late' : 'On Time'
        };
      }
      return t;
    }));
  };

  // Create new Controller Alteration Proposal
  const handleCreateProposal = (newProposal: ControllerAlterationProposal) => {
    setProposals(prev => [newProposal, ...prev]);

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: newProposal.proposingUnit,
      action: 'Emergency Alteration Broadcasted',
      category: 'STATION_CONSENSUS',
      details: `Submitted proposal ${newProposal.proposalCode}: "${newProposal.title}". Sent to ${newProposal.concernedStations.length} concerned stations for verification.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Select AI Option for Proposal
  const handleSelectProposalOption = (proposalId: string, optionId: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return { ...p, selectedOptionId: optionId };
      }
      return p;
    }));
  };

  // Cast vote by Station Master / Department unit with consensus resolution
  const handleStationVote = (
    proposalId: string, 
    stationCode: string, 
    status: 'approved' | 'rejected', 
    remarks?: string
  ) => {
    setProposals(prev => {
      return prev.map(prop => {
        if (prop.id !== proposalId) return prop;

        const updatedStations = prop.concernedStations.map(st => {
          if (st.stationCode === stationCode) {
            return {
              ...st,
              status,
              votedAt: new Date().toLocaleTimeString('en-IN') + ' IST',
              remarks: remarks || st.remarks
            };
          }
          return st;
        });

        const allApproved = updatedStations.every(s => s.status === 'approved');
        const hasRejection = updatedStations.some(s => s.status === 'rejected');

        let nextStatus = prop.status;
        if (hasRejection) {
          nextStatus = 'rejected_retained_original';
        } else if (allApproved) {
          nextStatus = 'approved_and_applied';
        } else {
          nextStatus = 'pending_consensus';
        }

        // IF 100% UNANIMOUS CONSENSUS ACHIEVED: APPLY REVISED AI SCHEDULE
        if (allApproved) {
          const selectedOption = prop.aiOptions.find(o => o.id === prop.selectedOptionId) || prop.aiOptions[0];
          
          if (selectedOption) {
            // Apply revised block timing
            setBlocks(prevBlocks => prevBlocks.map((b, idx) => {
              if (idx === 0 || b.id === selectedOption.revisedBlockWindow.blockId) {
                return {
                  ...b,
                  startTime: selectedOption.revisedBlockWindow.newStartTime,
                  endTime: selectedOption.revisedBlockWindow.newEndTime,
                  durationMinutes: selectedOption.revisedBlockWindow.durationMinutes,
                  algorithmNotes: `Schedule updated via 100% Inter-Station Consensus under ${prop.proposalCode}.`
                };
              }
              return b;
            }));

            // Regulate trains based on option impacts
            setTrains(prevTrains => prevTrains.map(tr => {
              const impact = selectedOption.trainImpacts.find(ti => ti.trainNumber === tr.number);
              if (impact) {
                return {
                  ...tr,
                  currentDelayMinutes: impact.delayMinutes,
                  currentStatus: impact.action === 'Regulate at Siding' 
                    ? 'Regulated at Siding' 
                    : impact.delayMinutes > 0 ? 'Running Late' : 'On Time',
                  regulatedAtStation: impact.regulatedStation
                };
              }
              return tr;
            }));

            const successLog: AuditLogEntry = {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
              user: 'IR Multi-Station Consensus System',
              action: 'Consensus Achieved — Schedule Committed',
              category: 'STATION_CONSENSUS',
              details: `All ${updatedStations.length} concerned stations approved ${prop.proposalCode}. Applied ${selectedOption.title} (Block shifted to ${selectedOption.revisedBlockWindow.newStartTime} - ${selectedOption.revisedBlockWindow.newEndTime}).`,
              blockId: selectedOption.revisedBlockWindow.blockId
            };
            setAuditLogs(prevLogs => [successLog, ...prevLogs]);
          }
        }

        // IF ANY STATION REJECTS: RESTORE BASELINE AI SCHEDULE UNTOUCHED
        if (hasRejection) {
          // Restore base block schedule
          setBlocks(prevBlocks => prevBlocks.map((b, idx) => {
            if (idx === 0) {
              return {
                ...b,
                startTime: '01:30',
                endTime: '04:30',
                durationMinutes: 180,
                algorithmNotes: 'Base AI Schedule strictly maintained after proposal rejection.'
              };
            }
            return b;
          }));

          // Restore trains to normal
          setTrains(prevTrains => prevTrains.map(tr => ({
            ...tr,
            currentDelayMinutes: 0,
            currentStatus: 'On Time',
            regulatedAtStation: undefined
          })));

          const rejectLog: AuditLogEntry = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
            user: stationCode,
            action: 'Proposal Rejected — Base AI Schedule Maintained',
            category: 'STATION_CONSENSUS',
            details: `Station unit ${stationCode} rejected ${prop.proposalCode} ("${remarks || 'Capacity restriction'}"). Alteration discarded; automated AI schedule preserved.`
          };
          setAuditLogs(prevLogs => [rejectLog, ...prevLogs]);
        }

        return {
          ...prop,
          status: nextStatus,
          concernedStations: updatedStations,
          resolvedAt: (allApproved || hasRejection) ? new Date().toLocaleTimeString('en-IN') + ' IST' : undefined
        };
      });
    });
  };

  // Restore proposal to pending consensus
  const handleResetProposalToOriginal = (proposalId: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'pending_consensus',
          concernedStations: p.concernedStations.map((s, idx) => ({
            ...s,
            status: idx < 2 ? 'approved' : 'pending',
            votedAt: idx < 2 ? s.votedAt : undefined,
            remarks: idx < 2 ? s.remarks : undefined
          }))
        };
      }
      return p;
    }));

    // Reset blocks and trains to initial state
    setBlocks(INITIAL_BLOCKS);
    setTrains(INITIAL_TRAINS);

    const resetLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'Operations Controller',
      action: 'Consensus Proposal Re-opened',
      category: 'STATION_CONSENSUS',
      details: `Re-opened inter-station consensus review for proposal ${proposalId}.`
    };
    setAuditLogs(prev => [resetLog, ...prev]);
  };

  // Manual Adversity Mode State
  const [manualMode, setManualMode] = useState<ManualModeState>({
    isManualMode: false,
    manualBlocksSuspended: false,
    manualCautionOrderActive: false
  });

  const handleToggleManualMode = (enable: boolean, reason?: string, contingency?: string) => {
    if (enable) {
      setManualMode({
        isManualMode: true,
        activatedAt: new Date().toLocaleTimeString('en-IN') + ' IST',
        activatedBy: 'R. K. Sharma (Section Controller)',
        adversityReason: reason || 'Adversity & Contingency Event',
        activeContingencyRule: contingency || 'Manual Dispatch & Verbal Authority',
        manualBlocksSuspended: false,
        manualCautionOrderActive: false
      });

      const log: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        user: 'R. K. Sharma (Section Controller)',
        action: 'Adversity Manual Override Engaged',
        category: 'OPTIMIZATION',
        details: `Automated AI block planning suspended due to adversity: "${reason}". Direct Section Controller dispatch active.`
      };
      setAuditLogs(prev => [log, ...prev]);
    } else {
      setManualMode({
        isManualMode: false,
        manualBlocksSuspended: false,
        manualCautionOrderActive: false
      });

      // Restore base blocks & trains
      setBlocks(INITIAL_BLOCKS);
      setTrains(INITIAL_TRAINS);

      const log: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        user: 'R. K. Sharma (Section Controller)',
        action: 'Handed Back to AI Automatic Mode',
        category: 'OPTIMIZATION',
        details: 'Adversity cleared. Resumed autonomous CP-SAT block planning and train schedule synchronization.'
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const handleEmergencySuspendBlocks = () => {
    const nextSuspended = !manualMode.manualBlocksSuspended;
    setManualMode(prev => ({ ...prev, manualBlocksSuspended: nextSuspended }));

    if (nextSuspended) {
      // Clear all active blocks to free up mainline tracks
      setBlocks(prev => prev.map(b => ({
        ...b,
        status: 'candidate',
        durationMinutes: 0,
        algorithmNotes: 'EMERGENCY SUSPENDED: Mainline completely cleared for relief/contingency train passage.'
      })));
    } else {
      setBlocks(INITIAL_BLOCKS);
    }

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'R. K. Sharma (Section Controller)',
      action: nextSuspended ? 'Emergency Mainline Clearance Ordered' : 'Block Suspension Rescinded',
      category: 'OPTIMIZATION',
      details: nextSuspended 
        ? 'All maintenance possessions immediately suspended. Track cleared for emergency/rescue movements.'
        : 'Maintenance block readiness restored.'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleToggleGlobalCautionOrder = () => {
    const nextCaution = !manualMode.manualCautionOrderActive;
    setManualMode(prev => ({ ...prev, manualCautionOrderActive: nextCaution }));

    if (nextCaution) {
      // Impose 30 km/h and +25 min buffer on all trains
      setTrains(prev => prev.map(t => ({
        ...t,
        averageSpeedKmH: 30,
        currentDelayMinutes: t.currentDelayMinutes + 25,
        currentStatus: 'Running Late'
      })));
    } else {
      setTrains(INITIAL_TRAINS);
    }

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'R. K. Sharma (Section Controller)',
      action: nextCaution ? 'Universal Caution Order T/409 Imposed' : 'Caution Order T/409 Cancelled',
      category: 'APPROVAL',
      details: nextCaution 
        ? '30 km/h maximum speed restriction imposed across entire corridor due to operational adversity.'
        : 'Normal section sectional speeds restored.'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleManualShiftBlock = (blockId: string, newStart: string, newEnd: string, newLine: 'UP MAIN' | 'DOWN MAIN' | 'BOTH LINES') => {
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId || prev[0]?.id === blockId) {
        return {
          ...b,
          startTime: newStart,
          endTime: newEnd,
          lineType: newLine,
          durationMinutes: 180,
          confidenceScore: 100,
          algorithmNotes: `Direct manual schedule shift by Section Controller during adversity (${newStart}-${newEnd} on ${newLine}).`
        };
      }
      return b;
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      user: 'R. K. Sharma (Section Controller)',
      action: 'Direct Manual Block Adjustment Applied',
      category: 'OPTIMIZATION',
      details: `Shifted Block ${blockId} manually to ${newStart} - ${newEnd} on ${newLine}. Manual override committed.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleGeneratePaperAuthority = () => {
    setActiveTab('APPROVAL');
  };

  const pendingProposalCount = proposals.filter(p => p.status === 'pending_consensus').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181816] flex flex-col font-sans selection:bg-[#181816] selection:text-[#FAF7F2] antialiased">
      {/* Top Header */}
      <Header
        corridors={corridors}
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        currentSimMinutes={currentSimMinutes}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(p => !p)}
        onSpeedChange={setSimSpeed}
        simSpeed={simSpeed}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        conflictCount={conflictCount}
        pendingProposalCount={pendingProposalCount}
        manualMode={manualMode}
        onOpenManualMode={() => handleToggleManualMode(!manualMode.isManualMode, 'Adverse Operations / Signalling Breakdown')}
      />

      {/* Global Inter-Station Notification Banner */}
      <StationNotificationBanner
        proposals={proposals}
        onOpenProposal={(propId) => {
          setActiveTab('CONSENSUS');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Adversity & Manual Mode Control Panel */}
        <AdversityManualModePanel
          manualMode={manualMode}
          corridor={selectedCorridor}
          blocks={blocks}
          trains={trains}
          onToggleManualMode={handleToggleManualMode}
          onEmergencySuspendBlocks={handleEmergencySuspendBlocks}
          onToggleGlobalCautionOrder={handleToggleGlobalCautionOrder}
          onManualShiftBlock={handleManualShiftBlock}
          onGeneratePaperAuthority={handleGeneratePaperAuthority}
        />
        {activeTab === 'STRING_GRAPH' && (
          <StringDiagram
            corridor={selectedCorridor}
            trains={trains}
            blocks={blocks}
            currentSimulationMinutes={currentSimMinutes}
            onSelectBlock={(b) => setSelectedBlock(b)}
            onSelectTrain={(t) => setSelectedTrain(t)}
          />
        )}

        {activeTab === 'OPTIMIZER' && (
          <OptimizerView
            corridor={selectedCorridor}
            requisitions={requisitions}
            blocks={blocks}
            onAddRequisition={handleAddRequisition}
            onApplyOptimization={handleApplyOptimization}
            onSelectBlock={(b) => {
              setSelectedBlock(b);
              setActiveTab('APPROVAL');
            }}
          />
        )}

        {activeTab === 'WHAT_IF' && (
          <WhatIfSimulator
            corridor={selectedCorridor}
            trains={trains}
            blocks={blocks}
            scenarios={scenarios}
            onApplyScenario={handleApplyScenario}
            onResetScenarios={handleResetScenarios}
            onDynamicReplan={handleDynamicReplan}
          />
        )}

        {activeTab === 'CONSENSUS' && (
          <ControllerConsensusView
            corridor={selectedCorridor}
            blocks={blocks}
            trains={trains}
            proposals={proposals}
            onCreateProposal={handleCreateProposal}
            onSelectAIOption={handleSelectProposalOption}
            onStationVote={handleStationVote}
            onResetProposalToOriginal={handleResetProposalToOriginal}
          />
        )}

        {activeTab === 'APPROVAL' && (
          <ApprovalWorkflow
            corridor={selectedCorridor}
            activeBlock={selectedBlock || blocks[0] || null}
            onUpdateApprovals={handleUpdateApprovals}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsView
            corridor={selectedCorridor}
            blocks={blocks}
            requisitions={requisitions}
            auditLogs={auditLogs}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EDE7DC] bg-[#FAF7F2] py-5 text-center text-xs text-[#636059]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C87428]"></span>
            <span className="font-semibold text-[#181816]">
              Smart India Hackathon 2025 • PS-26027: AI-Powered Automatic Block Planning for Indian Railways
            </span>
          </div>
          <span className="font-mono text-[#181816] text-[11px] bg-white px-3 py-1 rounded-full border border-[#E6E0D4]">
            RailAI Multi-Department Decision Support System • Morphiq Edition
          </span>
        </div>
      </footer>

      {/* Modals */}
      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
          onProceedToApproval={(b) => {
            setSelectedBlock(b);
            setActiveTab('APPROVAL');
          }}
        />
      )}

      {selectedTrain && (
        <TrainDetailModal
          train={selectedTrain}
          onClose={() => setSelectedTrain(null)}
          onAddDelay={handleAddTrainDelay}
        />
      )}

      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        corridor={selectedCorridor}
        blocks={blocks}
        trains={trains}
        requisitions={requisitions}
      />
    </div>
  );
}
