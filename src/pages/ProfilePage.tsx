import { useState } from 'react';
import {
  Mail,
  GraduationCap,
  Code2,
  Heart,
  Target,
  Sparkles,
  Zap,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import TagInput from '@/components/TagInput';
import { StudentProfile } from '@/types';
import { demoProfile } from '@/data/demoProfile';

interface ProfilePageProps {
  profile: StudentProfile;
  onProfileChange: (profile: StudentProfile) => void;
  onGenerate: () => void;
}

const skillSuggestions = [
  'Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL',
  'Mathematics', 'Statistics', 'Machine Learning', 'Deep Learning',
  'TensorFlow', 'PyTorch', 'Docker', 'AWS', 'Git', 'Linux', 'Data Analysis',
];

const companySuggestions = [
  'FAANG', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
  'OpenAI', 'Startups', 'Research Labs', 'Nvidia', 'Tesla', 'DeepMind',
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function ProfilePage({ profile, onProfileChange, onGenerate }: ProfilePageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const loadDemo = () => {
    setDemoLoading(true);
    setTimeout(() => {
      onProfileChange({ ...demoProfile });
      setDemoLoading(false);
    }, 400);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate();
      setIsGenerating(false);
    }, 800);
  };

  const isFormValid =
    profile.email.trim() &&
    profile.yearOfStudy &&
    profile.skills.length > 0 &&
    profile.interests.trim() &&
    profile.targetCompanies.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-floatGlow" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] animate-floatGlow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-3xl mx-auto px-6">
        {/* Hero header */}
        <div className="text-center mb-10 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo-400/20 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300 tracking-wide">AI-POWERED CAREER SIMULATION</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Discover Your <span className="text-gradient neon-text">AI Career Path</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Tell us about yourself, and our AI simulator will generate three personalized career trajectories with actionable roadmaps.
          </p>
        </div>

        {/* Demo Profile Button */}
        <div className="flex justify-center mb-8 animate-fadeInUp delay-200">
          <button
            onClick={loadDemo}
            className={`group flex items-center gap-2.5 px-5 py-3 rounded-xl glass-card hover:border-indigo-400/30 text-sm font-medium text-slate-200 transition-all duration-300 ${demoLoading ? 'scale-95 opacity-70' : ''}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-violet-500/30 transition-all">
              {demoLoading ? (
                <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              )}
            </div>
            <span>{demoLoading ? 'Loading...' : 'Load Demo Profile'}</span>
            {!demoLoading && <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">— 1st yr B.Tech → AI/ML</span>}
          </button>
        </div>

        {/* Form Card */}
        <div className="gradient-border p-8 md:p-10 animate-fadeInUp delay-300">
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                Contact Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
                placeholder="you@gmail.com"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* Year of Study */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                Year of Study
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => onProfileChange({ ...profile, yearOfStudy: year })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      profile.yearOfStudy === year
                        ? 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/40 text-white glow-primary'
                        : 'glass-input text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <TagInput
              label="Current Skills"
              placeholder="Start typing a skill..."
              suggestions={skillSuggestions}
              tags={profile.skills}
              onChange={(skills) => onProfileChange({ ...profile, skills })}
              icon={Code2}
            />

            {/* Interests */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Heart className="w-4 h-4 text-indigo-400" />
                Core Interests
              </label>
              <textarea
                value={profile.interests}
                onChange={(e) => onProfileChange({ ...profile, interests: e.target.value })}
                placeholder="Describe what excites you about technology, what problems you want to solve, and your dream career..."
                rows={4}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Target Companies */}
            <TagInput
              label="Target Companies"
              placeholder="Add a company or category..."
              suggestions={companySuggestions}
              tags={profile.targetCompanies}
              onChange={(targetCompanies) => onProfileChange({ ...profile, targetCompanies })}
              icon={Target}
            />
          </div>

          {/* Generate Button */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!isFormValid || isGenerating}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-semibold text-base transition-all duration-300 ${
                isFormValid && !isGenerating
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white glow-primary hover:scale-[1.02] hover:from-indigo-400 hover:to-violet-500'
                  : 'bg-white/[0.05] text-slate-600 cursor-not-allowed border border-white/[0.05]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating your futures...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Generate My Futures</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
              {isFormValid && !isGenerating && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 blur-xl opacity-40 -z-10 animate-floatGlow" />
              )}
            </button>
            {!isFormValid && (
              <p className="text-xs text-slate-500">Fill in all fields to generate your career paths</p>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fadeInUp delay-500">
          {[
            { label: 'Career Paths', value: '3' },
            { label: 'Year Roadmap', value: '4' },
            { label: 'Action Items', value: '21+' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
