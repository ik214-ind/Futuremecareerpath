import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Cpu,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { StudentProfile, ChatMessage } from '@/types';
import { chatWithCounselor, isGroqConfigured } from '@/utils/gemini';

interface ChatPageProps {
  profile: StudentProfile;
}

const suggestedQuestions = [
  'What career path suits me best?',
  'How do I get started with AI/ML?',
  'Should I focus on research or industry?',
  'What projects should I build this semester?',
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatPage({ profile }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiReady = isGroqConfigured();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setShowWelcome(false);
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    const result = await chatWithCounselor(profile, history, trimmed);

    const modelMsg: ChatMessage = {
      id: generateId(),
      role: 'model',
      content: result.content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, modelMsg]);

    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  return (
    <div className="pt-20 pb-4 relative flex flex-col" style={{ height: 'calc(100vh - 4rem - 49px)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px] animate-floatGlow" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px] animate-floatGlow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-4xl mx-auto px-6 w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fadeInDown">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-primary">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-40 -z-10" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white">AI Career Counselor</h1>
              <div className="flex flex-col gap-1">
                {apiReady ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <Zap className="w-3 h-3" />
                      Powered by Groq (Llama 3.1 — Live)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      Demo Engine Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 hover:border-white/15 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear chat
            </button>
          )}
        </div>

        {/* Chat container */}
        <div className="flex-1 min-h-0 glass-card rounded-2xl flex flex-col overflow-hidden animate-fadeInUp">
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Welcome state */}
            {showWelcome && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-fadeIn">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-20 animate-floatGlow" />
                </div>
                <h2 className="font-display text-xl font-bold text-white mb-2">
                  Hi {profile.email ? profile.email.split('@')[0] : 'there'}!
                </h2>
                <p className="text-sm text-slate-400 max-w-md mb-1 leading-relaxed">
                  I'm your AI career counselor. I already know you're a{' '}
                  <span className="text-indigo-300">{profile.yearOfStudy || 'student'}</span> with skills in{' '}
                  <span className="text-indigo-300">{profile.skills.length > 0 ? profile.skills.join(', ') : 'various areas'}</span>.
                </p>
                <p className="text-sm text-slate-500 mb-6">Ask me anything about your career path!</p>

                {/* Suggested questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="group p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/25 hover:bg-indigo-500/[0.06] text-left transition-all animate-fadeInUp opacity-0-init"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-400/60 group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors" />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{q}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fadeInUp ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-slate-600 to-slate-700'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-500/15 border border-indigo-400/20 rounded-tr-md'
                      : 'glass border border-white/[0.06] rounded-tl-md'
                  }`}
                >
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex items-center gap-3 glass-input rounded-2xl px-4 py-1">
              <Cpu className="w-5 h-5 text-indigo-400/50 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI counselor anything..."
                disabled={isSending}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none py-3 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isSending}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  input.trim() && !isSending
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:scale-105 glow-primary'
                    : 'bg-white/[0.05] text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-600">
              AI responses are generated by Groq (Llama 3.1 8B Instant) and may contain inaccuracies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
