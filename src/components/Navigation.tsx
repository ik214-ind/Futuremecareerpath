import { Compass, LayoutDashboard, Users, Bot } from 'lucide-react';
import { PageId } from '@/types';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  profileComplete: boolean;
}

const navItems: { id: PageId; label: string; icon: typeof Compass }[] = [
  { id: 'profile', label: 'Student Profile', icon: Compass },
  { id: 'dashboard', label: 'AI Trainer', icon: LayoutDashboard },
  { id: 'counselor', label: 'AI Counselor', icon: Bot },
  { id: 'alumni', label: 'Alumni Connect', icon: Users },
];

export default function Navigation({ currentPage, onNavigate, profileComplete }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center group-hover:from-indigo-400 group-hover:to-violet-500 transition-all duration-300 glow-primary">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-50 -z-10 animate-floatGlow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-white text-base tracking-tight">FutureMe</span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase">AI Career Simulator</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1 glass rounded-xl p-1 border border-white/[0.05]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isDisabled = item.id !== 'profile' && !profileComplete;
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onNavigate(item.id)}
                disabled={isDisabled}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : isDisabled
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-400/30" />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/10"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-slate-300">Menu</span>
        </button>
      </div>
    </nav>
  );
}
