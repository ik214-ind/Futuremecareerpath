import { useState } from 'react';
import {
  Users, Linkedin, Calendar, MessageCircle, Sparkles, X,
  ExternalLink, Briefcase, GraduationCap, CheckCircle2, Clock,
} from 'lucide-react';
import { AlumniMentor } from '@/types';
import { alumniMentors } from '@/data/alumni';
import { useToast } from '@/components/ToastContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = [
  '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
];

export default function AlumniPage() {
  const { showToast } = useToast();
  const [linkedinMentor, setLinkedinMentor] = useState<AlumniMentor | null>(null);
  const [chatMentor, setChatMentor] = useState<AlumniMentor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const openChatModal = (mentor: AlumniMentor) => {
    setChatMentor(mentor);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const closeChatModal = () => {
    setChatMentor(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const confirmBooking = () => {
    if (chatMentor && selectedDay && selectedTime) {
      showToast(`Chat booked with ${chatMentor.name} on ${selectedDay} at ${selectedTime}. You'll receive a calendar invite soon!`, 'success');
      closeChatModal();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px] animate-floatGlow" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px] animate-floatGlow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo-400/20 mb-4">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300 tracking-wide">ALUMNI MENTOR NETWORK</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Talk to <span className="text-gradient">Mentors</span> Who Walked Your Path
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Connect with alumni who started exactly where you are now. Schedule a chat, ask questions, and learn from their real-world journey.
          </p>
        </div>

        {/* Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {alumniMentors.map((mentor, i) => (
            <div
              key={mentor.id}
              className="glass-card rounded-2xl p-6 animate-fadeInUp opacity-0-init group"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mentor.avatarColor} flex items-center justify-center font-display font-bold text-white text-lg shadow-lg`}
                  >
                    {mentor.initials}
                  </div>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mentor.avatarColor} blur-lg opacity-40 -z-10`} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0a12] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium">
                    {mentor.role} <span className="text-slate-500">at</span>{' '}
                    <span className="text-indigo-300">{mentor.company}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Batch of {mentor.batch}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "{mentor.bio}"
                  </p>
                </div>
              </div>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {mentor.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-400/15 text-xs text-indigo-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setLinkedinMentor(mentor)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-sm font-medium text-[#5ea0e8] hover:bg-[#0A66C2]/25 hover:border-[#0A66C2]/50 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                </button>
                <button
                  onClick={() => openChatModal(mentor)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 text-sm font-medium text-indigo-200 hover:from-indigo-500/30 hover:to-violet-500/30 hover:border-indigo-400/50 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule 15-min Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-10 gradient-border p-6 text-center animate-fadeInUp delay-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">More mentors joining every week</span>
          </div>
          <p className="text-xs text-slate-500">
            Our alumni network is growing. Check back soon for mentors from Tesla, DeepMind, and top AI startups.
          </p>
        </div>
      </div>

      {/* LinkedIn Profile Modal */}
      {linkedinMentor && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLinkedinMentor(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass-card rounded-2xl p-6 md:p-8 max-w-md w-full animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLinkedinMentor(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${linkedinMentor.avatarColor} flex items-center justify-center font-display font-bold text-white text-lg shadow-lg flex-shrink-0`}>
                {linkedinMentor.initials}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">{linkedinMentor.name}</h3>
                <p className="text-sm text-slate-300">{linkedinMentor.role} at {linkedinMentor.company}</p>
                <p className="text-xs text-slate-500 mt-0.5">Batch of {linkedinMentor.batch}</p>
              </div>
            </div>

            {/* Profile summary */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <Briefcase className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Current Role</p>
                  <p className="text-sm text-slate-200">{linkedinMentor.role} at {linkedinMentor.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Graduated</p>
                  <p className="text-sm text-slate-200">Batch of {linkedinMentor.batch}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-400 leading-relaxed italic">"{linkedinMentor.bio}"</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {linkedinMentor.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-400/15 text-xs text-indigo-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* LinkedIn button */}
            <a
              href={linkedinMentor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#0A66C2]/90 transition-all duration-300"
            >
              <Linkedin className="w-4 h-4" />
              <span>Open LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      )}

      {/* Schedule Chat Slot-Picker Modal */}
      {chatMentor && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeChatModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass-card rounded-2xl p-6 md:p-8 max-w-md w-full animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeChatModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${chatMentor.avatarColor} flex items-center justify-center font-display font-bold text-white text-sm shadow-lg flex-shrink-0`}>
                {chatMentor.initials}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Book a 15-min Chat</h3>
                <p className="text-xs text-slate-400">with {chatMentor.name}, {chatMentor.role} at {chatMentor.company}</p>
              </div>
            </div>

            {/* Day picker */}
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Select a day
              </p>
              <div className="grid grid-cols-5 gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedDay === day
                        ? 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/40 text-white'
                        : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot picker */}
            <div className="mb-6">
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Select a time slot
              </p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/40 text-white'
                        : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={confirmBooking}
              disabled={!selectedDay || !selectedTime}
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedDay && selectedTime
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:scale-[1.02] glow-primary'
                  : 'bg-white/[0.05] text-slate-600 cursor-not-allowed border border-white/[0.05]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {selectedDay && selectedTime
                ? `Confirm: ${selectedDay} at ${selectedTime}`
                : 'Select a day and time to confirm'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
