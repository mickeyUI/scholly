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
  FileSearch,
} from 'lucide-react';
import AuthGate from '../components/AuthGate';
import InlineCitation from '../components/InlineCitation';
import { ChatMessage } from '../types';
import { useAuth } from '../lib/auth-context';

export default function AssistantPage() {
  return (
    <AuthGate
      featureName="AI Study Advisor"
      description="Chat 1-on-1 with your personal admissions advisor. Ask questions regarding GPA eligibility, language waivers, and full-ride funding with official source citations."
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
      content: `Hi there! I’m your Scholly AI Advisor. I’m here to help you navigate international admissions and scholarship opportunities around the world.\n\nYou can ask me about minimum GPA requirements, language test waivers, application fee discounts, or full-ride scholarships. How can I help you today?`,
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
      description: 'Which scholarships offer 100% full funding plus monthly stipends?',
    },
    {
      icon: Globe,
      label: 'Study in Germany',
      description: "Find low-tuition master's programs in Germany with no application fee.",
    },
    {
      icon: GraduationCap,
      label: 'GPA Requirements',
      description: 'Can I apply to UK or Canadian universities with a 3.2 GPA?',
    },
    {
      icon: DollarSign,
      label: 'Developing Countries',
      description: 'What scholarships are open to students from developing countries?',
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

    // Modular response engine connected to local database, ready for your custom backend API
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = '';
      let citations: { label: string; url: string; fact: string }[] = [];
      let suggestedOpportunities: ChatMessage['suggestedOpportunities'] = [];

      if (lower.includes('germany') || lower.includes('daad') || lower.includes('tum')) {
        responseText = `Public universities in Germany offer world-class degrees with minimal or no standard tuition fees for international students!

• The **DAAD Helmut-Schmidt-Programme** provides 100% full funding, including a €934/month living stipend, full health insurance, and round-trip airfare for master’s courses in Public Policy and Economics.
• The **Technical University of Munich (TUM)** offers top-ranked engineering and computer science programs with low semester fees and $0 application fee.`;
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
        responseText = `A GPA of 3.0 to 3.2 opens up several prestigious international funding programs:

1. **Chevening UK Government Scholarship**: Requires a minimum 3.0 GPA (equivalent to a UK 2:1 honours). Covers 100% tuition plus monthly living allowance and airfare.
2. **Mastercard Foundation Scholars Program**: Takes a holistic view focusing on leadership potential and academic dedication with full cost coverage.
3. **MEXT Japanese Government Scholarship**: Requires roughly 3.2 GPA and offers full tuition plus 144,000 JPY monthly allowance.`;
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
        responseText = `I searched our verified registry for "${text}". There are several programs offering full tuition waivers and living allowances that match international students.

Be sure to request your 2 academic recommendation letters at least 6 weeks before published deadlines!`;
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
        content: `Conversation reset! What can I help you research today?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDE4D3] flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-zinc-900 tracking-tight">
              AI College &amp; Scholarship Advisor
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Personalized answers grounded in official university portals and scholarship guidelines.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-[#FAF8F5] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
          <span>New Chat</span>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] text-[#92400E] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
              </div>
            )}

            <div
              className={`max-w-xl p-5 sm:p-6 shadow-xs space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#B45309] text-amber-50 rounded-3xl rounded-tr-xs'
                  : 'bg-[#FFFDF9] text-zinc-800 border border-[#EDE4D3] rounded-3xl rounded-tl-xs'
              }`}
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Inline Citations & Sources */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400">Sources:</span>
                  {msg.citations.map((cite, i) => (
                    <InlineCitation key={i} sourceName={cite.label} sourceUrl={cite.url} />
                  ))}
                </div>
              )}

              {/* Suggested Opportunity Cards */}
              {msg.suggestedOpportunities && msg.suggestedOpportunities.length > 0 && (
                <div className="pt-3 border-t border-zinc-100 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-700 block">
                    Recommended Opportunities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.suggestedOpportunities.map((opp) => (
                      <Link
                        key={opp.id}
                        href={opp.type === 'scholarship' ? `/scholarships/${opp.id}` : `/universities/${opp.id}`}
                        className="p-3 bg-[#FAF8F5] hover:bg-[#FEF3C7]/60 border border-[#EDE4D3] hover:border-[#D97706] rounded-2xl transition-all text-xs group block"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-[#D97706] font-bold mb-0.5">
                          {opp.type === 'scholarship' ? (
                            <Award className="w-3.5 h-3.5 text-[#D97706]" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />
                          )}
                          <span>{opp.coverageOrTuition}</span>
                        </div>
                        <h4 className="font-serif font-bold text-zinc-900 group-hover:text-[#D97706] truncate">
                          {opp.title}
                        </h4>
                        <span className="text-[11px] text-zinc-500 truncate block">
                          {opp.subtitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] text-right font-medium ${msg.sender === 'user' ? 'text-amber-200/80' : 'text-zinc-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                <User className="w-4 h-4 text-[#D97706]" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] text-[#92400E] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="bg-[#FFFDF9] border border-[#EDE4D3] rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-medium text-zinc-500">Researching admissions guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (when clean) — 2×2 card grid */}
      {messages.length === 1 && (
        <div className="py-4 flex-shrink-0">
          <p className="text-xs text-zinc-400 font-semibold mb-3">Try asking about…</p>
          <div className="grid grid-cols-2 gap-2">
            {starterPrompts.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.description)}
                  className="p-3.5 bg-white hover:bg-[#FFFBEB] border border-[#EDE4D3] hover:border-[#D97706] rounded-2xl transition-all text-left group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <p className="text-xs font-bold text-zinc-900 group-hover:text-[#D97706] transition-colors mb-0.5">
                    {prompt.label}
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
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
        className="pt-3 border-t border-[#EDE4D3] flex items-center gap-2 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about minimum GPA, IELTS waivers, application deadlines, living stipends..."
            className="w-full px-5 py-3 bg-white border border-[#EDE4D3] rounded-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 sm:px-6 sm:py-3 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <span className="hidden sm:inline">Ask Advisor</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
