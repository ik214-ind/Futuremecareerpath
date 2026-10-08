import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { jobMarketData } from '@/data/jobMarket';

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-white/10 shadow-xl">
      <p className="text-xs font-bold text-white mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-slate-400">{entry.name}:</span>
            <span className="text-xs font-medium text-slate-200">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobMarketChart() {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-7">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Job Market Prediction</h3>
          <p className="text-xs text-slate-400">5-year projected job availability for key AI/ML roles</p>
        </div>
      </div>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={jobMarketData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="mlGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="deGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="opsGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="year"
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="mlEngineer"
              name="ML Engineer"
              stroke="url(#mlGrad)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#818cf8' }}
              activeDot={{ r: 5, fill: '#818cf8' }}
            />
            <Line
              type="monotone"
              dataKey="dataEngineer"
              name="Data Engineer"
              stroke="url(#deGrad)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#34d399' }}
              activeDot={{ r: 5, fill: '#34d399' }}
            />
            <Line
              type="monotone"
              dataKey="aiResearcher"
              name="AI Researcher"
              stroke="url(#aiGrad)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#c084fc' }}
              activeDot={{ r: 5, fill: '#c084fc' }}
            />
            <Line
              type="monotone"
              dataKey="mlOps"
              name="ML Ops"
              stroke="url(#opsGrad)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#22d3ee' }}
              activeDot={{ r: 5, fill: '#22d3ee' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
