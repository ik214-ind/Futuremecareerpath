import { Calendar, MapPin, Trophy, Users, Clock, ExternalLink, BadgeCheck } from 'lucide-react';
import { hackathons } from '@/data/hackathons';

const tagColors: Record<string, string> = {
  'AI/ML': 'text-indigo-300 bg-indigo-500/10 border-indigo-400/20',
  GovTech: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
  Web3: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20',
  Data: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  MLOps: 'text-violet-300 bg-violet-500/10 border-violet-400/20',
};

export default function HackathonWidget() {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Live Hackathon Tracker</h3>
          <p className="text-xs text-slate-400">Real Indian tech hackathons — registrations open now</p>
        </div>
      </div>

      <div className="space-y-3">
        {hackathons.map((event, i) => (
          <div
            key={event.id}
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-400/20 transition-all duration-300 animate-fadeInUp opacity-0-init"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${tagColors[event.tag] || 'text-slate-300 bg-white/5 border-white/10'}`}>
                    {event.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border bg-emerald-500/10 border-emerald-400/20 text-emerald-300">
                    <BadgeCheck className="w-3 h-3" />
                    {event.status}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {event.daysAway} days away
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
                  {event.name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {event.participants}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500/70" />
                    Prize Pool: {event.prizePool}
                  </span>
                </div>
              </div>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 group-hover:scale-105"
                aria-label={`Register for ${event.name}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
