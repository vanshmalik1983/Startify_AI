import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Rocket,
  Sparkles,
  Brain,
  BarChart3,
  Scale,
  Zap,
  Coins,
  Mic2,
  History,
  TrendingUp,
  Target,
  Lightbulb,
  Layers3,
  ShieldCheck,
  Flame,
  BrainCircuit
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [mode, setMode] = useState("fun");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function fetchHistory() {
    try {
      const res = await axios.get(`${API}/api/history`);
      setHistory(res.data);
    } catch (error) {
      console.error("History fetch failed:", error);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  async function handleGenerate() {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/generate`, {
        input,
        mode
      });
      setResult(res.data);
      fetchHistory();
    } catch (error) {
      console.error("Generate failed:", error?.response?.data || error.message);
      alert(error?.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const barData = useMemo(() => {
    if (!result?.score) return null;
    return {
      labels: ["Innovation", "Demand", "Scalability", "Feasibility"],
      datasets: [
        {
          label: "Score",
          data: [
            result.score.innovation,
            result.score.demand,
            result.score.scalability,
            result.score.feasibility
          ],
          backgroundColor: [
            "rgba(129,140,248,0.8)",
            "rgba(34,197,94,0.8)",
            "rgba(168,85,247,0.8)",
            "rgba(251,191,36,0.8)"
          ],
          borderRadius: 12
        }
      ]
    };
  }, [result]);

  const lineData = useMemo(() => {
    if (!result?.chartData?.growth) return null;
    return {
      labels: ["M1", "M2", "M3", "M4", "M5", "M6"],
      datasets: [
        {
          label: "Growth",
          data: result.chartData.growth,
          borderColor: "rgba(99,102,241,1)",
          backgroundColor: "rgba(99,102,241,0.18)",
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [result]);

  const pieData = useMemo(() => {
    if (!result?.chartData?.demandSegments) return null;
    return {
      labels: ["Students", "Working Pros", "Businesses"],
      datasets: [
        {
          data: result.chartData.demandSegments,
          backgroundColor: [
            "rgba(99,102,241,0.85)",
            "rgba(236,72,153,0.85)",
            "rgba(14,165,233,0.85)"
          ],
          borderWidth: 0
        }
      ]
    };
  }, [result]);

  return (
    <div className="min-h-screen bg-grid bg-[size:26px_26px]">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-glow">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Startify AI</h1>
              <p className="text-xs text-slate-400">Crazy ideas → startup gold</p>
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
            <span className="inline-flex items-center gap-2">
              <History className="h-4 w-4" />
              {history.length} ideas saved
            </span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/80 p-8 shadow-glow">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-300">
                <Sparkles className="h-4 w-4" />
                AI startup machine
              </div>

              <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                Turn weird prompts into
                <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
                  {" "}
                  serious startup ideas
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                Type something like <span className="font-bold text-white">chai + AI + students</span>,
                and this thing cooks up concept, score, judge review, funding, pitch,
                charts, and roadmap. Basically hackathon fuel with better drip.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-4 flex gap-3">
                <button
                  onClick={() => setMode("fun")}
                  className={`rounded-2xl px-5 py-3 font-bold transition ${
                    mode === "fun"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "bg-white/5 text-slate-300"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Fun Mode
                  </span>
                </button>

                <button
                  onClick={() => setMode("normal")}
                  className={`rounded-2xl px-5 py-3 font-bold transition ${
                    mode === "normal"
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                      : "bg-white/5 text-slate-300"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Standard
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === "fun"
                      ? "chai + AI + students"
                      : "AI platform for local shop demand prediction"
                  }
                  className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-lg text-white outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500"
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-lg font-black text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate Startup ✨"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {result && (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-600/90 via-violet-700/85 to-fuchsia-700/75 p-8 shadow-glow">
              <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white/90">
                    Concept generated
                  </div>
                  <p className="mb-3 text-sm font-semibold text-indigo-100">
                    Generated Idea: {result.generatedIdea}
                  </p>
                  <h3 className="text-3xl font-black text-white md:text-5xl">
                    {result.title}
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-indigo-50/95">
                    {result.concept}
                  </p>
                </div>

                <div className="min-w-[180px] rounded-[28px] border border-white/10 bg-black/15 p-6 text-center backdrop-blur">
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-100">
                    Overall Score
                  </p>
                  <div className="mt-2 text-6xl font-black text-white">
                    {result.score.total}
                  </div>
                  <p className="text-sm text-indigo-100">out of 100</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="space-y-8 xl:col-span-2">
                <GlassCard title="Score Dashboard" icon={<BarChart3 className="h-5 w-5 text-indigo-300" />}>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-5">
                      <ScoreBar label="Innovation" value={result.score.innovation} color="from-violet-500 to-fuchsia-500" />
                      <ScoreBar label="Demand" value={result.score.demand} color="from-emerald-500 to-lime-400" />
                      <ScoreBar label="Scalability" value={result.score.scalability} color="from-indigo-500 to-sky-500" />
                      <ScoreBar label="Feasibility" value={result.score.feasibility} color="from-amber-400 to-orange-500" />
                    </div>
                    <div className="h-64">
                      {barData && <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
                    </div>
                  </div>
                </GlassCard>

                <div className="grid gap-6 md:grid-cols-2">
                  <ColorCard
                    title="The Problem"
                    icon={<Target className="h-5 w-5 text-rose-200" />}
                    className="from-rose-500/25 to-red-500/10 border-rose-400/20"
                  >
                    {result.problem}
                  </ColorCard>

                  <ColorCard
                    title="The Solution"
                    icon={<Lightbulb className="h-5 w-5 text-emerald-200" />}
                    className="from-emerald-500/25 to-green-500/10 border-emerald-400/20"
                  >
                    {result.solution}
                  </ColorCard>
                </div>

                <GlassCard title="Growth Prediction" icon={<TrendingUp className="h-5 w-5 text-sky-300" />}>
                  <div className="h-72">
                    {lineData && <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: "#cbd5e1" } } }, scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" } } } }} />}
                  </div>
                </GlassCard>

                <GlassCard title="Core Features" icon={<Layers3 className="h-5 w-5 text-fuchsia-300" />}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {result.features.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                        • {item}
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard title="Tech Stack" icon={<ShieldCheck className="h-5 w-5 text-cyan-300" />}>
                  <div className="flex flex-wrap gap-3">
                    {result.techStack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard title="AI Enhancement" icon={<Zap className="h-5 w-5 text-yellow-300" />}>
                  <SectionLabel>Improved Idea</SectionLabel>
                  <p className="mb-5 text-slate-200">{result.enhancement.improvedIdea}</p>

                  <SectionLabel>Advanced Features</SectionLabel>
                  <ul className="mb-5 space-y-2 text-slate-200">
                    {result.enhancement.advancedFeatures.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  <SectionLabel>Future Scope</SectionLabel>
                  <p className="text-slate-200">{result.enhancement.futureScope}</p>
                </GlassCard>

                <GlassCard title="AI Suggestions" icon={<BrainCircuit className="h-5 w-5 text-purple-300" />}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <SectionLabel>Growth Tips</SectionLabel>
                      <ul className="space-y-2 text-slate-200">
                        {result.suggestions.growthTips.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <SectionLabel>Strategy Improvements</SectionLabel>
                      <ul className="space-y-2 text-slate-200">
                        {result.suggestions.strategyImprovements.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-8">
                <DarkJudgeCard result={result} />

                <GlassCard title="Pitch Generator" icon={<Mic2 className="h-5 w-5 text-indigo-300" />}>
                  <PitchCard title="30-sec Pitch" text={result.pitches.short} />
                  <PitchCard title="Elevator Pitch" text={result.pitches.elevator} />
                  <PitchCard title="Investor Pitch" text={result.pitches.investor} />
                </GlassCard>

                <GlassCard title="Funding Estimator" icon={<Coins className="h-5 w-5 text-amber-300" />}>
                  <Metric title="Estimated Cost" value={result.funding.estimatedCost} />
                  <Metric title="Break-even" value={result.funding.breakEven} />
                  <Metric title="Investment Level" value={result.funding.investmentLevel} />
                </GlassCard>

                <GlassCard title="Market Segments" icon={<BarChart3 className="h-5 w-5 text-pink-300" />}>
                  <div className="h-72">
                    {pieData && <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: "#cbd5e1" } } } }} />}
                  </div>
                </GlassCard>

                <GlassCard title="Competitor Analysis" icon={<Scale className="h-5 w-5 text-rose-300" />}>
                  <SectionLabel>Competitors</SectionLabel>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {result.competitorAnalysis.competitors.map((item) => (
                      <span key={item} className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>

                  <SectionLabel>Market Gap</SectionLabel>
                  <p className="mb-4 text-slate-200">{result.competitorAnalysis.marketGap}</p>

                  <SectionLabel>Advantages</SectionLabel>
                  <ul className="space-y-2 text-slate-200">
                    {result.competitorAnalysis.advantages.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard title="History" icon={<History className="h-5 w-5 text-slate-300" />}>
                  <div className="space-y-3">
                    {history.slice(0, 6).map((item) => (
                      <button
                        key={item._id}
                        onClick={() => setResult(item)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                      >
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-slate-400">{item.concept}</div>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function GlassCard({ title, icon, children }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-black text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ColorCard({ title, icon, children, className = "" }) {
  return (
    <div className={`rounded-[28px] border bg-gradient-to-br p-6 shadow-glow ${className}`}>
      <div className="mb-3 flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-black text-white">{title}</h3>
      </div>
      <p className="text-slate-100">{children}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
      {children}
    </p>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="font-black text-white">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DarkJudgeCard({ result }) {
  return (
    <div className="rounded-[28px] border border-indigo-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 shadow-glow">
      <div className="mb-5 flex items-center gap-3">
        <Scale className="h-5 w-5 text-indigo-300" />
        <h3 className="text-xl font-black text-white">AI Judge</h3>
      </div>

      <JudgeGroup title="Pros" color="text-emerald-300" items={result.judge.pros} />
      <JudgeGroup title="Cons" color="text-rose-300" items={result.judge.cons} />
      <JudgeGroup title="Risks" color="text-amber-300" items={result.judge.risks} />

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <SectionLabel>Verdict</SectionLabel>
        <p className="italic text-slate-200">{result.judge.verdict}</p>
      </div>
    </div>
  );
}

function JudgeGroup({ title, color, items }) {
  return (
    <div className="mb-4">
      <p className={`mb-2 text-xs font-black uppercase tracking-[0.2em] ${color}`}>{title}</p>
      <ul className="space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function PitchCard({ title, text }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
      <SectionLabel>{title}</SectionLabel>
      <p className="italic leading-7 text-slate-200">{text}</p>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <SectionLabel>{title}</SectionLabel>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  );
}