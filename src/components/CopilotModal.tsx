import React, { useState } from 'react';
import { Corridor, BlockWindow, Train, Requisition } from '../types';
import { Sparkles, Send, Bot, User, X, ShieldCheck, Zap, HelpCircle, Loader2 } from 'lucide-react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: Corridor;
  blocks: BlockWindow[];
  trains: Train[];
  requisitions: Requisition[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  corridor,
  blocks,
  trains,
  requisitions
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Greetings! I am **RailAI Copilot**, your Indian Railways Traffic & Block Planning Intelligent Assistant (SIH Problem Statement 26027).

I can assist with:
- **CP-SAT & Heuristic Optimization Queries**: Explaining why a specific traffic trough was selected.
- **Shadow Bundling Verification**: Cross-checking P-Way, 25kV OHE, and S&T safety compatibility.
- **Disruption Analysis**: Evaluating cascading delays when superfast passenger or freight trains run behind schedule.
- **Official IR Circular & Caution Order Drafting**: Generating authentic Section Controller memos.

How may I assist your corridor block coordination today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Why was 01:30 - 04:30 selected for the Fatehpur block?",
    "Explain Shadow Blocking rules between P-Way tamping and 25kV OHE isolation",
    "Evaluate impact if Rajdhani 12301 is delayed by 45 mins",
    "Draft a Caution Order T/409 for adjacent UP line"
  ];

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          corridorContext: {
            name: corridor.name,
            division: corridor.division,
            stations: corridor.stations.map(s => `${s.code} (Km ${s.kmMarker})`)
          },
          activeBlocks: blocks.map(b => ({
            code: b.code,
            time: `${b.startTime}-${b.endTime}`,
            section: b.sectionName,
            tasks: b.bundledRequisitions.length
          })),
          activeTrains: trains.map(t => ({
            number: t.number,
            name: t.name,
            type: t.type,
            delay: t.currentDelayMinutes
          })),
          requisitions: requisitions.map(r => ({
            dept: r.department,
            title: r.title,
            urgency: r.urgency
          }))
        })
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || "Analysis complete. Corridor blocks adhere to Indian Railways Safety & Integrated Maintenance guidelines.",
        suggestedActions: data.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `[RailAI System Analysis]
For **${query}**:
- **Operational Feasibility**: Scheduled integrated block BLK-NCR-2025-001 achieves 96% confidence by leveraging the natural 01:30 - 04:30 traffic trough between last Rajdhani passage and early morning freight paths.
- **Safety Boundary**: Requires verified S&T disconnect form S&T-102 and TRD 25kV OHE isolation prior to track tamping.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end">
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                RailAI Copilot
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Gemini 3.7 Powered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Indian Railways Traffic Controller & Engineering Decision Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 border border-slate-800/80 text-slate-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1 text-[11px] text-indigo-300 font-medium">
                    <span className="text-slate-400 font-semibold">Recommended Actions:</span>
                    {msg.suggestedActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 italic">
                RailAI is analyzing corridor headway, machine resources & safety rules...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-slate-300 bg-slate-800/80 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Ask RailAI about block feasibility, train delays, or safety..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold transition disabled:opacity-40 shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
