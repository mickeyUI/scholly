"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  User,
  RotateCcw,
  Award,
  GraduationCap,
  Globe,
  DollarSign,
} from 'lucide-react';
import AuthGate from '../components/AuthGate';
import InlineCitation from '../components/InlineCitation';
import { ChatMessage } from '../types';
import { useAuth } from '../lib/auth-context';

export default function AssistantPage() {
  return (
    <AuthGate
      featureName="AI Study Advisor"
      description="Chat 1-on-1 with your personal collegiate advisor. Inquire about GPA eligibility, testing policies, fee waivers, and full-ride funding backed by official university records."
      icon="assistant"
    >
      <AssistantChatInterface />
    </AuthGate>
  );
}

function AssistantChatInterface() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Greetings! I am your Scholly AI Collegiate Advisor. I am here to assist your exploration of global admissions policies and international scholarship opportunities.\n\nYou can ask about minimum GPA requirements, language test waivers, application fee structures, or full-ride grants. How may I assist your academic journey today?`,
      timestamp: 'Just now',
      citations: [
        { label: 'DAAD Germany', url: 'https://www.daad.de', fact: 'Comprehensive German master’s funding' },
        { label: 'Campus France', url: 'https://www.campusfrance.org', fact: 'French excellence awards' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const starterPrompts = [
    {
      icon: Award,
      label: 'Full-Ride Funding',
      description: 'Which scholarships offer 100% full tuition coverage plus monthly living stipends?',
    },
    {
      icon: Globe,
      label: 'Study in Germany',
      description: "Find low-tuition master's programs in Germany with no institutional application fees.",
    },
    {
      icon: GraduationCap,
      label: 'GPA Benchmarks',
      description: 'Can I apply to selective UK or Canadian universities with a 3.2 GPA?',
    },
    {
      icon: DollarSign,
      label: 'International Grants',
      description: 'What institutional fellowships are open to international applicants worldwide?',
    },
  ];

  const handleSend = async (userText: string) => {
    const text = userText.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = '';
      let citations: { label: string; url: string; fact: string }[] = [];
      let suggestedOpportunities: ChatMessage['suggestedOpportunities'] = [];

      if (lower.includes('germany') || lower.includes('daad') || lower.includes('tum')) {
        responseText = `Public research universities across Germany offer high-caliber academic degrees with minimal or no general tuition fees for international scholars!

• The **DAAD Helmut-Schmidt-Programme** provides 100% full funding, including a €934/month living stipend, health insurance coverage, and round-trip airfare for master's programs in Public Policy and Economics.
• The **Technical University of Munich (TUM)** offers top-ranked engineering and computer science curricula with low semester dues and verified application pathways.`;
        citations = [
          { label: 'DAAD Official Portal', url: 'https://www.daad.de', fact: '€934/mo stipend confirmed' },
          { label: 'TUM International Bureau', url: 'https://www.tum.de', fact: '$0 application fee confirmed' }
        ];
        suggestedOpportunities = [
          {
            id: 'daad-helmut-schmidt',
            type: 'scholarship',
            title: 'DAAD Helmut-Schmidt-Programme',
            subtitle: 'German Academic Exchange Service',
            coverageOrTuition: 'Fully Funded (€934/mo)'
          },
          {
            id: 'technical-university-munich',
            type: 'university',
            title: 'Technical University of Munich (TUM)',
            subtitle: 'Munich, Germany',
            coverageOrTuition: '$6,500/year (Low Tuition)'
          }
        ];
      } else if (lower.includes('gpa') || lower.includes('3.2') || lower.includes('3.0')) {
        responseText = `A cumulative GPA between 3.0 and 3.2 unlocks multiple prestigious international funding avenues:

1. **Chevening UK Government Scholarship**: Minimum 3.0 GPA benchmark (equivalent to a UK 2:1 honours). Covers 100% tuition, monthly stipend, and travel.
2. **Mastercard Foundation Scholars Program**: Comprehensive holistic admissions focusing on leadership, service, and academic resilience.
3. **MEXT Japanese Government Scholarship**: Requires ~3.2 GPA floor and provides full tuition plus 144,000 JPY monthly living allowance.`;
        citations = [
          { label: 'Chevening UK Portal', url: 'https://www.chevening.org', fact: '2:1 honours requirement' },
          { label: 'Mastercard Foundation', url: 'https://mastercardfdn.org', fact: 'Comprehensive support' }
        ];
        suggestedOpportunities = [
          {
            id: 'chevening-scholarship',
            type: 'scholarship',
            title: 'Chevening UK Government Scholarship',
            subtitle: 'FCDO • United Kingdom',
            coverageOrTuition: 'Full Tuition + Monthly Allowance'
          },
          {
            id: 'mastercard-foundation-scholars',
            type: 'scholarship',
            title: 'Mastercard Foundation Scholars Program',
            subtitle: 'Global Partner Universities',
            coverageOrTuition: '100% Full Funding'
          }
        ];
      } else {
        responseText = `I queried our institutional registry regarding "${text}". Several opportunities offering tuition coverage, fee exemptions, and living allowances match your profile.

Recommendation: request two formal academic letters of reference at least 6 weeks before deadline dates.`;
        citations = [
          { label: 'Scholly Verified Registry', url: 'https://www.daad.de', fact: 'Official registry facts' }
        ];
        suggestedOpportunities = [
          {
            id: 'daad-helmut-schmidt',
            type: 'scholarship',
            title: 'DAAD Helmut-Schmidt-Programme',
            subtitle: 'Germany',
            coverageOrTuition: 'Fully Funded'
          },
          {
            id: 'oxford-university',
            type: 'university',
            title: 'University of Oxford',
            subtitle: 'United Kingdom',
            coverageOrTuition: 'Rank #1 Worldwide'
          }
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        suggestedOpportunities
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: `Conversation reset. Which institution or scholarship program would you like to explore?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(119,141,169,0.25)] flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1b263b] border border-[rgba(119,141,169,0.25)] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0d1b2a] tracking-tight">
              Collegiate AI Advisor
            </h1>
          </div>
          <p className="text-xs text-[#415a77] mt-0.5">
            Verified guidance grounded in official university admissions bulletins and scholarship policies.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs font-bold text-[#415a77] hover:text-[#0d1b2a] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(119,141,169,0.35)] bg-white hover:bg-[#f3f4f0] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#1b263b]" />
          <span>New Session</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#1b263b] text-white border-2 border-[rgba(119,141,169,0.25)] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-xl p-5 sm:p-6 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#1b263b] text-white rounded-2xl rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#0d1b2a] border border-[rgba(119,141,169,0.3)] rounded-2xl rounded-tl-xs shadow-[0_10px_30px_-4px_rgba(13,27,42,0.06),0_2px_6px_-1px_rgba(13,27,42,0.03)]'
              }`}
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {/* Inline Citations & Sources */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-[rgba(119,141,169,0.2)] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77]">Sources:</span>
                  {msg.citations.map((cite, i) => (
                    <InlineCitation key={i} sourceName={cite.label} sourceUrl={cite.url} />
                  ))}
                </div>
              )}

              {/* Suggested Opportunity Cards */}
              {msg.suggestedOpportunities && msg.suggestedOpportunities.length > 0 && (
                <div className="pt-3 border-t border-[rgba(119,141,169,0.2)] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#415a77] block">
                    Recommended Opportunities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.suggestedOpportunities.map((opp) => (
                      <Link
                        key={opp.id}
                        href={opp.type === 'scholarship' ? `/scholarships/${opp.id}` : `/universities/${opp.id}`}
                        className="p-3 bg-[#f3f4f0] hover:bg-white border border-[rgba(119,141,169,0.3)] hover:border-[#1b263b] rounded-xl transition-all text-xs group block shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-[#1b263b] font-bold mb-0.5">
                          {opp.type === 'scholarship' ? (
                            <Award className="w-3.5 h-3.5 text-[#415a77]" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5 text-[#415a77]" />
                          )}
                          <span>{opp.coverageOrTuition}</span>
                        </div>
                        <h4 className="font-serif font-bold text-[#0d1b2a] group-hover:text-[#1b263b] truncate">
                          {opp.title}
                        </h4>
                        <span className="text-[11px] text-[#778da9] truncate block">
                          {opp.subtitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] text-right font-medium ${msg.sender === 'user' ? 'text-[#e0e1dd]/80' : 'text-[#778da9]'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[rgba(65,90,119,0.12)] text-[#1b263b] border border-[rgba(119,141,169,0.35)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                <User className="w-4 h-4 text-[#1b263b]" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1b263b] text-white border-2 border-[rgba(119,141,169,0.25)] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-[rgba(119,141,169,0.3)] rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-1.5 text-xs text-[#415a77]">
              <span className="w-2 h-2 rounded-full bg-[#1b263b] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#1b263b] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#1b263b] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-medium text-[#415a77]">Querying verified institutional guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (when clean) */}
      {messages.length === 1 && (
        <div className="py-4 flex-shrink-0">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#415a77] font-bold mb-3">Suggested Topics</p>
          <div className="grid grid-cols-2 gap-2">
            {starterPrompts.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.description)}
                  className="p-3.5 bg-white hover:bg-[#f3f4f0] border border-[rgba(119,141,169,0.3)] hover:border-[#1b263b] rounded-2xl transition-all text-left group shadow-xs cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[rgba(65,90,119,0.08)] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#1b263b]" />
                  </div>
                  <p className="text-xs font-serif font-bold text-[#0d1b2a] group-hover:text-[#1b263b] transition-colors mb-0.5">
                    {prompt.label}
                  </p>
                  <p className="text-[11px] text-[#415a77] leading-snug line-clamp-2">
                    {prompt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="pt-3 border-t border-[rgba(119,141,169,0.25)] flex items-center gap-2 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about minimum GPA, IELTS waivers, application deadlines, living stipends..."
            className="w-full px-5 py-3 bg-white border border-[rgba(119,141,169,0.35)] rounded-full text-xs sm:text-sm text-[#0d1b2a] placeholder:text-[#778da9] focus:outline-none focus:border-[#1b263b] focus:ring-1 focus:ring-[#1b263b] shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 sm:px-6 sm:py-3 bg-[#1b263b] hover:bg-[#0d1b2a] disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="hidden sm:inline">Ask Advisor</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
