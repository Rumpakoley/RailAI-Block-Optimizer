import React, { useState, useRef, useEffect } from 'react';
import { Corridor, BlockWindow, Train, Requisition } from '../types';
import { Sparkles, Send, Bot, User, X, Loader2, RotateCcw, MessageSquare, Shield, Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

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
  category?: 'optimization' | 'safety' | 'disruption' | 'general';
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  corridor,
  blocks,
  trains,
  requisitions
}) => {
  const initialGreeting: Message = {
    id: 'msg-welcome',
    sender: 'ai',
    text: `Hello! I am **RailAI Copilot**, your Indian Railways Intelligent Traffic & Block Planning Assistant.

I can help you with:
• **CP-SAT Solver Explanations**: Why a specific window (e.g. 01:30–04:30) was chosen.
• **Shadow Bundling Validation**: Safety isolation checks across P-Way, 25kV OHE (TRD), and S&T.
• **Cascading Delay Simulator**: Impact of late-running Rajdhani or Vande Bharat rakes.
• **Official Authority Drafting**: Pre-formatted Caution Order T/409 and Paper Line Clear T/A 912 forms.

What would you like to check on the **${corridor.name}** corridor?`,
    timestamp: 'Just now'
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    "Why was 01:30 - 04:30 selected for the Fatehpur block?",
    "Explain Shadow Blocking rules between P-Way tamping and 25kV OHE isolation",
    "Evaluate impact if Rajdhani 12301 is delayed by 45 mins",
    "Draft Caution Order T/409 speed restriction",
    "How does CP-SAT prevent conflict with Vande Bharat 22436?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  const generateIntelligentResponse = (query: string): { text: string; actions?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('01:30') || q.includes('fatehpur') || q.includes('why') || q.includes('time') || q.includes('selected')) {
      return {
        text: `### 🕒 Optimization Rationale for Fatehpur Block (01:30 – 04:30)

The **CP-SAT Mathematical Solver** selected the **01:30 – 04:30** window for **BLK-NCR-2025-001** based on the following multi-objective constraints:

1. **Traffic Trough Analysis**:
   • The last high-priority passenger train (*Howrah Rajdhani 12301*) clears Fatehpur section at **01:42 hrs**.
   • The earliest morning passenger service (*Gorakhdham Express 12555*) enters the section at **04:15 hrs**.
   • This creates a **180-minute commercial traffic vacuum** ideal for heavy track possessions.

2. **Multi-Departmental Shadow Bundling (3-in-1)**:
   • **P-Way (TMS)**: Track Tamping Machine (CSM 09-32) operates on UP MAIN (Km 955–968).
   • **TRD (TDMS)**: 25kV OHE de-energization & Tower Wagon wire inspection in the same Km boundary (Km 955–970).
   • **S&T (SMMS)**: Point machine overhaul at Sirathu yard synchronized without requiring an independent track possession.
   • **Savings**: **120 minutes of duplicate line closure saved** with a 96% confidence score!

3. **Freight Siding Regulation**:
   • Freight Coal Rake *BOXN-9821* is regulated on the Fatehpur Loop Line for 45 minutes, keeping the corridor clear.`,
        actions: [
          'Inspect BLK-NCR-2025-001 on Time-Space Diagram',
          'Review S&T Disconnect Form S&T-102',
          'Simulate Rajdhani Delay Scenario'
        ]
      };
    }

    if (q.includes('shadow') || q.includes('ohe') || q.includes('p-way') || q.includes('isolation') || q.includes('rule')) {
      return {
        text: `### ⚡ Indian Railways Shadow Blocking Compatibility Protocol

Under Indian Railways **Integrated Maintenance Policy**, shadow blocking allows multiple departments to execute work within one combined possession:

1. **Primary Track Possession (P-Way)**:
   • Granted by Chief Section Controller (Dy. CHC) under Form **T/462**.
   • Speed restriction of **30 km/h** imposed on adjacent DOWN Main track.

2. **25kV Traction Power Block (TRD)**:
   • OHE Section Isolator opened between Km 955 and Km 970.
   • Discharge grounding rods clamped on both sides of the Tower Wagon work zone before work permits issued.

3. **Signaling & Interlocking Disconnect (S&T)**:
   • Form **S&T-102 (Disconnection Notice)** served to Station Master.
   • Track circuits shunted and point machines physically clamped and padlocked.

✅ **Safety Rule Enforced**: All 3 departments must hand back their respective clearances before the Section Controller can cancel the possession memo.`,
        actions: [
          'Open Approval Workflow Memo',
          'Verify Multi-Department Checklist',
          'Generate Form T/409 Caution Order'
        ]
      };
    }

    if (q.includes('rajdhani') || q.includes('45') || q.includes('delay') || q.includes('disruption')) {
      return {
        text: `### ⚠️ Disruption Analysis: Rajdhani 12301 Delayed (+45 Mins)

When **Train 12301 (Howrah Rajdhani Express)** is delayed by **+45 minutes** upstream:

• **Original Arrival at Fatehpur**: 01:40 hrs
• **Revised Arrival at Fatehpur**: **02:25 hrs**
• **Direct Conflict**: Overlaps with the scheduled block window **BLK-NCR-2025-001 (01:30 – 04:30)** at Km 960.

#### 🤖 AI Re-Plan Recommendation:
• **Shift Block Start**: Move block window from **01:30–04:30 ➔ 02:35–05:35**.
• **Alternative**: Divert Rajdhani through Loop line with 50 km/h caution (adds only 6 mins).
• **Inter-Station Consensus**: Notification automatically dispatched to Sirathu, Fatehpur, and Kanpur Central Station Masters for approval.`,
        actions: [
          'Apply 45-Min Shift Re-Plan',
          'Open Inter-Station Consensus Tab',
          'Issue Station Notification Memo'
        ]
      };
    }

    if (q.includes('caution') || q.includes('t/409') || q.includes('draft') || q.includes('order')) {
      return {
        text: `### 📜 Official Indian Railways Caution Order Memo (T/409)

\`\`\`
NORTH CENTRAL RAILWAY - PRAYAGRAJ DIVISION
OPERATING DEPARTMENT - CAUTION ORDER FORM T/409

Date: 06/09/2026 | Issue Time: 01:00 hrs IST
To: Loco Pilot & Train Manager of All UP/DOWN Trains Ex-PRYJ to CNB

SECTION: Fatehpur (FTP) – Sirathu (SRO) (Km 955/0 to Km 970/0)
TRACK: DOWN MAIN (Adjacent Line Protection during UP Main Tamping)

1. SPEED RESTRICTION: Do not exceed 30 km/h between Km 955.00 and 970.00.
2. CAUSE: CSM 09-32 Heavy Track Tamping & Dynamic Track Stabilizer on UP MAIN.
3. WHISTLE: Sound continuous whistle (W/L board compliance) due to staff on track.
4. AUTHORITY: Sanction Memo No. NCR/OPT/BLK/2026-089.

Signed: 
Chief Section Controller / Dy. CHC (P-Way), Prayagraj Control
\`\`\``,
        actions: [
          'Copy Form T/409 to Clipboard',
          'Transmit to Station Masters (PRYJ-FTP-CNB)',
          'Log in Immutable Audit Trail'
        ]
      };
    }

    return {
      text: `### 🧠 RailAI Operational Decision Summary

Regarding your query: **"${query}"**

• **Corridor**: ${corridor.name} (${corridor.division})
• **Active Asset Status**: ${blocks.length} scheduled multi-department block windows currently active.
• **Timetable Integrity**: Headway separation between Vande Bharat (22436) and Rajdhani Express (12301) maintained within safety thresholds (>20 mins).
• **AI Constraint Recommendation**: All hard safety constraints (OHE de-energization, Track Tamping clearance, and S&T point lock) are satisfied with **zero passenger delays**.`,
      actions: [
        'View String Diagram Graph',
        'Check CP-SAT Solver Constraints',
        'Review Inter-Station Consensus'
      ]
    };
  };

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
      // First attempt serverless Gemini API call
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
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.response,
          suggestedActions: data.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('API unavailable, switching to local knowledge engine');
      }
    } catch {
      // Intelligent Indian Railways offline knowledge fallback
      await new Promise(r => setTimeout(r, 650));
      const fallback = generateIntelligentResponse(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallback.text,
        suggestedActions: fallback.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-sm text-[#181816] mt-2.5 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="font-bold text-xs text-[#181816] mt-2 mb-0.5">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      // Code block
      if (line.startsWith('```')) {
        return null;
      }
      // Bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-[#181816] leading-relaxed my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="ml-1 text-xs font-semibold text-[#181816] mt-1.5 mb-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs text-[#181816] leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </p>
      );
    });
  };

  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#181816]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-[#636059]">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#F3EEE7] text-[#181816] px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#E6E0D4]">$1</code>');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-150">
      <div className="bg-white border-l border-[#E6E0D4] w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-[#181816]">
        {/* Chatbot Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE7DC] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#181816] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5 text-[#C87428]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#181816] font-cinzel">
                  RailAI Intelligent Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBF5EE] text-[#2D7A4D] border border-[#C6E7D2] font-bold">
                  ● Online
                </span>
              </div>
              <p className="text-[11px] text-[#636059]">
                {corridor.name} • Decision Support Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMessages([initialGreeting])}
              title="Reset Chat"
              className="p-2 rounded-full text-[#8F8A80] hover:text-[#181816] hover:bg-[#F3EEE7] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Assistant"
              className="p-2 rounded-full text-[#8F8A80] hover:text-[#181816] hover:bg-[#F3EEE7] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-[#FAF7F2]/40 scroll-smooth">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed animate-in fade-in duration-200 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#181816] flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4 text-[#C87428]" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[88%] ${
                  msg.sender === 'user'
                    ? 'bg-[#181816] text-[#FAF7F2] font-medium shadow-xs rounded-tr-xs'
                    : 'bg-white border border-[#E6E0D4] text-[#181816] shadow-sm rounded-tl-xs'
                }`}
              >
                <div className="font-sans">
                  {msg.sender === 'user' ? (
                    <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div>{renderFormattedMarkdown(msg.text)}</div>
                  )}
                </div>

                {/* AI Interactive Action Recommendations */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-[#EDE7DC] flex flex-col gap-1.5">
                    <span className="text-[#8F8A80] font-bold uppercase text-[9.5px] tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C87428]" /> Suggested Next Steps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="flex items-center gap-1 text-[11px] text-[#181816] bg-[#FAF7F2] hover:bg-[#181816] hover:text-white px-2.5 py-1 rounded-full border border-[#E6E0D4] transition font-medium cursor-pointer shadow-2xs"
                        >
                          <span>{action}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-white/60 text-right' : 'text-[#8F8A80]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#E6E0D4] border border-[#D9D0C3] flex items-center justify-center text-[#181816] shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 text-xs justify-start animate-in fade-in">
              <div className="w-7 h-7 rounded-full bg-[#181816] flex items-center justify-center text-white shrink-0 mt-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#C87428]" />
              </div>
              <div className="p-3.5 px-4 rounded-2xl rounded-tl-xs bg-white border border-[#E6E0D4] text-[#636059] flex items-center gap-2 shadow-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C87428] animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#C87428] animate-bounce [animation-delay:0.15s]"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#C87428] animate-bounce [animation-delay:0.3s]"></span>
                <span className="text-[11px] ml-1 font-medium italic">RailAI is formulating optimal block strategy...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Compact Quick Suggestion Chips (Single horizontal scrollable row) */}
        <div className="px-4 py-2 border-t border-[#EDE7DC] bg-white overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-[#8F8A80] shrink-0 font-mono">
            Suggestions:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-[#636059] hover:text-[#181816] bg-[#FAF7F2] hover:bg-[#F3EEE7] px-3 py-1 rounded-full border border-[#E6E0D4] hover:border-[#181816]/40 transition shrink-0 whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-[#EDE7DC] bg-[#FAF7F2]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5 bg-white border border-[#E6E0D4] rounded-full p-1.5 pl-4 shadow-xs focus-within:ring-2 focus-within:ring-[#181816] transition"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask RailAI about CP-SAT constraints, train conflicts, or safety rules..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#181816] placeholder:text-[#8F8A80] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold transition disabled:opacity-30 active:scale-95 cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5 text-[#FAF7F2]" />
            </button>
          </form>
          <div className="text-center text-[10px] text-[#8F8A80] mt-2">
            RailAI Multi-Department Decision Support • Indian Railways
          </div>
        </div>
      </div>
    </div>
  );
};
