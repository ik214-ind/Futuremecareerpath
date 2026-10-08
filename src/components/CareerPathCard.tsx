import { useState } from 'react';
import {
  ServerCog,
  BrainCircuit,
  Database,
  Cpu,
  FolderGit2,
  CalendarDays,
  CheckSquare,
  Square,
  TrendingUp,
  Check,
  Target,
} from 'lucide-react';
import { CareerPath, ActionItem } from '@/types';

const iconMap: Record<string, typeof ServerCog> = {
  ServerCog,
  BrainCircuit,
  Database,
};

interface CareerPathCardProps {
  path: CareerPath;
  index: number;
}

type Tab = 'skills' | 'projects' | 'timeline' | 'action';

const tabs: { id: Tab; label: string; icon: typeof Cpu }[] = [
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
  { id: 'action', label: '30-Day Plan', icon: CheckSquare },
];

const colorMap: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400/20',
    dot: 'bg-cyan-400',
  },
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/20',
    dot: 'bg-violet-400',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
};

export default function CareerPathCard({ path, index }: CareerPathCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('skills');
  const [actionItems, setActionItems] = useState<ActionItem[]>(path.first30Days);
  const Icon = iconMap[path.icon] || Cpu;
  const colors = colorMap[path.color];

  const toggleAction = (id: string) => {
    setActionItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const completedCount = actionItems.filter((i) => i.done).length;
  const progress = Math.round((completedCount / actionItems.length) * 100);

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden animate-fadeInUp opacity-0-init`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Header */}
      <div className={`relative p-6 bg-gradient-to-br ${path.gradient}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="flex items-center gap-2">
            {path.matchScore != null && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-200">{path.matchScore}% match</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">{path.demandScore}% demand</span>
            </div>
          </div>
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-1">{path.title}</h3>
        <p className={`text-sm ${colors.text} font-medium mb-3`}>{path.subtitle}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{path.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] px-4 pt-2 overflow-x-auto">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
              {isActive && (
                <div className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${colors.dot}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[280px]">
        {activeTab === 'skills' && (
          <div className="flex flex-wrap gap-2 animate-fadeIn">
            {path.skillsToMaster.map((skill, i) => (
              <span
                key={skill}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg ${colors.bg} ${colors.border} border text-sm ${colors.text} animate-scaleIn opacity-0-init`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3 animate-fadeIn">
            {path.projects.map((project, i) => (
              <div
                key={project.title}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all animate-fadeInUp opacity-0-init"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <FolderGit2 className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{project.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="relative animate-fadeIn">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-white/15 to-white/[0.02]" />
            <div className="space-y-5">
              {path.milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className="relative pl-10 animate-fadeInUp opacity-0-init"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {/* Dot */}
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}>{milestone.year}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{milestone.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'action' && (
          <div className="animate-fadeIn">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">First 30 Days Progress</span>
                <span className={`text-xs font-bold ${colors.text}`}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${path.gradient} ${colors.dot} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {actionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleAction(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all group text-left"
                >
                  {item.done ? (
                    <div className={`w-5 h-5 rounded-md ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                      <Check className={`w-3 h-3 ${colors.text}`} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-all">
                      <Square className="w-2.5 h-2.5 text-slate-600" />
                    </div>
                  )}
                  <span className={`text-sm transition-all ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
