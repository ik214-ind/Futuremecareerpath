import { useState, useEffect, useRef } from 'react';
import { Sparkles, GitBranch, Lightbulb, Cpu } from 'lucide-react';
import { StudentProfile, CareerPath } from '@/types';
import { careerPaths as mockCareerPaths } from '@/data/careerPaths';
import { generateCareerPaths } from '@/utils/gemini';
import CareerPathCard from '@/components/CareerPathCard';
import HackathonWidget from '@/components/HackathonWidget';
import JobMarketChart from '@/components/JobMarketChart';

interface DashboardPageProps {
  profile: StudentProfile;
}

type GenerationState = 'loading' | 'success' | 'fallback';

export default function DashboardPage({ profile }: DashboardPageProps) {
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [genState, setGenState] = useState<GenerationState>('loading');
  const [loadingStep, setLoadingStep] = useState(0);
  const hasFetched = useRef(false);

  const loadingSteps = [
    'Analyzing your skills and interests...',
    'Simulating career trajectories...',
    'Generating personalized roadmaps...',
    'Finalizing your 3 futures...',
  ];

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    let stepInterval: ReturnType<typeof setInterval>;

    let settled = false;

    const finish = (resultPaths: CareerPath[], source: 'ai' | 'fallback') => {
      if (settled) return;
      settled = true;
      clearInterval(stepInterval);
      setPaths(resultPaths);
      setGenState(source === 'ai' ? 'success' : 'fallback');
    };

    const run = async () => {
      setGenState('loading');
      setLoadingStep(0);

      stepInterval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 400);

      const { paths: resultPaths, source } = await generateCareerPaths(profile);
      finish(resultPaths, source);
    };

    run();

    const maxTimer = setTimeout(() => {
      if (!settled) {
        generateCareerPaths(profile).then(({ paths: fp, source: fs }) => finish(fp, fs));
      }
    }, 1500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(maxTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[120px] animate-floatGlow" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-[100px] animate-floatGlow" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo-400/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300 tracking-wide">YOUR SIMULATED FUTURES</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-gradient">{profile.email.split('@')[0]}</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Based on your profile — {profile.yearOfStudy}, targeting{' '}
            <span className="text-indigo-300">{profile.targetCompanies.join(', ')}</span> — here are 3 career trajectories our AI has simulated for you.
          </p>
        </div>

        {/* Profile summary chips */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp delay-100">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300"
            >
              <GitBranch className="w-3 h-3 text-indigo-400" />
              {skill}
            </span>
          ))}
        </div>

        {/* AI Loading State */}
        {genState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Cpu className="w-10 h-10 text-indigo-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-30 animate-floatGlow" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">Simulating your future...</h2>
            <p className="text-sm text-slate-400 mb-6">{loadingSteps[loadingStep]}</p>
            <div className="w-64 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Career Paths Grid */}
        {genState !== 'loading' && (
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Your 3 Career Paths
              {genState === 'success' && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-300 font-normal">
                  <Sparkles className="w-3 h-3" />
                  AI-Generated
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {paths.map((path, i) => (
                <CareerPathCard key={path.id} path={path} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Market & Opportunities Section */}
        {genState !== 'loading' && (
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Market & Opportunities
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <HackathonWidget />
              <JobMarketChart />
            </div>
          </div>
        )}

        {/* Footer note */}
        {genState !== 'loading' && (
          <div className="mt-10 text-center animate-fadeInUp delay-300">
            <p className="text-xs text-slate-500">
              {genState === 'success'
                ? 'Powered by Groq (Llama 3.1) — personalized in real-time. Connect with alumni mentors for real-world guidance.'
                : 'Simulated by FutureMe AI — all projections are illustrative. Connect with alumni mentors for real-world guidance.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
