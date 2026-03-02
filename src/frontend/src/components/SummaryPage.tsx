import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Dumbbell,
  Flame,
  RotateCcw,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type {
  DayStatus,
  FoodItem,
  FoodLogEntry,
  UserProfile,
} from "../types/nutrition";
import {
  computeMLScores,
  exerciseSuggestion,
  generateReport,
} from "../utils/nutrition";

interface SummaryPageProps {
  db: FoodItem[];
  profile: UserProfile;
  dayStatus: DayStatus;
  foodLog: FoodLogEntry[];
  onReset: () => void;
  onBack: () => void;
}

export function SummaryPage({
  db,
  profile: _profile,
  dayStatus,
  foodLog,
  onReset,
  onBack,
}: SummaryPageProps) {
  const scores = computeMLScores(db);
  const exercise = exerciseSuggestion(dayStatus.excess);

  const macroData = [
    {
      name: "Protein",
      grams: dayStatus.protein,
      kcal: dayStatus.protein * 4,
      color: "#5fcfb0",
    },
    {
      name: "Fat",
      grams: dayStatus.fat,
      kcal: dayStatus.fat * 9,
      color: "#e8a838",
    },
    {
      name: "Carbs",
      grams: dayStatus.carbs,
      kcal: dayStatus.carbs * 4,
      color: "#a78bfa",
    },
  ];

  const modelData = [
    {
      name: "Decision Tree",
      score: scores.decisionTree,
      label: `R² ${scores.decisionTree.toFixed(3)}`,
    },
    { name: "KNN", score: scores.knn, label: `R² ${scores.knn.toFixed(3)}` },
    { name: "SVR", score: scores.svr, label: `R² ${scores.svr.toFixed(3)}` },
    {
      name: "Logistic",
      score: scores.logisticAccuracy,
      label: `Acc ${scores.logisticAccuracy.toFixed(3)}`,
    },
  ];

  const pieColors = ["#5fcfb0", "#e8a838", "#a78bfa"];
  const totalMacroKcal = macroData.reduce((s, m) => s + m.kcal, 0);

  const handleExport = () => {
    const report = generateReport(foodLog, dayStatus, scores);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutritrack-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  return (
    <div className="min-h-screen mesh-bg pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 text-xs font-body gap-1.5"
            >
              ← Back
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <span className="font-display font-bold text-foreground">
              Daily Summary
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 text-xs font-body gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </Button>
            <Button
              size="sm"
              onClick={onReset}
              variant="ghost"
              className="h-8 text-xs font-body gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Day
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 shadow-glow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl nutritrack-gradient flex items-center justify-center shadow-glow">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Daily Report
              </h1>
              <p className="text-muted-foreground text-sm font-body">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryKPI
              label="Goal"
              value={dayStatus.recommended.toFixed(0)}
              unit="kcal"
              color="text-muted-foreground"
            />
            <SummaryKPI
              label="Consumed"
              value={dayStatus.consumed.toFixed(0)}
              unit="kcal"
              color="text-nutritrack-teal"
            />
            <SummaryKPI
              label="Remaining"
              value={Math.max(0, dayStatus.remaining).toFixed(0)}
              unit="kcal"
              color={
                dayStatus.remaining > 0
                  ? "text-nutritrack-green"
                  : "text-muted-foreground"
              }
            />
            <SummaryKPI
              label="Excess"
              value={dayStatus.excess.toFixed(0)}
              unit="kcal"
              color={
                dayStatus.excess > 0
                  ? "text-destructive"
                  : "text-nutritrack-green"
              }
              badge={dayStatus.excess === 0 ? "On track ✓" : undefined}
            />
          </div>

          {dayStatus.excess === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 rounded-xl bg-nutritrack-green/10 border border-nutritrack-green/20 text-center"
            >
              <p className="font-display font-semibold text-nutritrack-green text-sm">
                💪 Perfect — You stayed within your calorie goal!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Exercise Plan */}
        {dayStatus.excess > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-nutritrack-amber" />
              <h2 className="font-display font-bold text-foreground">
                Burn Off the Excess
              </h2>
              <Badge className="ml-auto border-0 bg-destructive/10 text-destructive text-xs">
                {dayStatus.excess.toFixed(0)} kcal excess
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Walking", mins: exercise.walking, emoji: "🚶" },
                { label: "Running", mins: exercise.running, emoji: "🏃" },
                { label: "Cycling", mins: exercise.cycling, emoji: "🚴" },
              ].map((ex) => (
                <div
                  key={ex.label}
                  className="bg-card rounded-2xl p-4 text-center border border-border"
                >
                  <p className="text-2xl mb-1">{ex.emoji}</p>
                  <p className="num-display text-3xl font-bold text-foreground">
                    {ex.mins}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    min of {ex.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Macros Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Macro Bar */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-nutritrack-coral" />
              <h2 className="font-display font-bold text-foreground">
                Macronutrient Breakdown
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={macroData} barSize={40}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontFamily: "Cabinet Grotesk" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Geist Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontFamily: "Cabinet Grotesk",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`${v.toFixed(1)} g`, ""]}
                />
                <Bar dataKey="grams" radius={[8, 8, 0, 0]}>
                  {macroData.map(({ color }, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: recharts cells are stable
                    <Cell key={`macro-bar-${index}`} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Macro Pie */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-display font-bold text-foreground mb-4">
              Calorie Sources
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="kcal"
                >
                  {macroData.map((_entry, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: recharts cells are stable
                    <Cell key={`macro-pie-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [
                    `${v.toFixed(0)} kcal (${((v / (totalMacroKcal || 1)) * 100).toFixed(0)}%)`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {macroData.map((m, i) => (
                <div key={m.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[i] }}
                  />
                  <span className="text-xs text-muted-foreground font-body">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ML Model Performance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-nutritrack-purple" />
            <h2 className="font-display font-bold text-foreground">
              ML Model Performance
            </h2>
            <Badge className="ml-auto text-xs border-0 bg-nutritrack-purple/10 text-nutritrack-purple">
              Trained on {db.length} foods
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {modelData.map((m) => (
              <div
                key={m.name}
                className="bg-card rounded-2xl p-4 text-center border border-border"
              >
                <p className="num-display text-2xl font-bold text-foreground">
                  {(m.score * 100).toFixed(1)}
                  <span className="text-xs text-muted-foreground">%</span>
                </p>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  {m.name}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full nutritrack-gradient"
                    style={{ width: `${m.score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={modelData} barSize={48}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fontFamily: "Cabinet Grotesk" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 11, fontFamily: "Geist Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontFamily: "Cabinet Grotesk",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "Score"]}
              />
              <Bar
                dataKey="score"
                radius={[8, 8, 0, 0]}
                fill="oklch(var(--nutritrack-teal))"
              />
            </BarChart>
          </ResponsiveContainer>

          <p className="text-xs text-muted-foreground font-body mt-3 text-center">
            Scores computed using Atwater formula baseline on held-out 20% test
            set
          </p>
        </motion.div>

        {/* Food Log Table */}
        {foodLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="font-display font-bold text-foreground mb-4">
              Complete Food Log
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Food",
                      "Meal",
                      "Grams",
                      "Calories",
                      "Protein",
                      "Fat",
                      "Carbs",
                      "Time",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 text-xs font-mono text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {foodLog.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border/50 hover:bg-muted/20"
                    >
                      <td className="py-2 px-2 font-body capitalize text-foreground">
                        {entry.food}
                      </td>
                      <td className="py-2 px-2 font-body text-muted-foreground text-xs">
                        {entry.meal}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                        {entry.grams}g
                      </td>
                      <td className="py-2 px-2 font-mono text-xs font-bold text-nutritrack-teal">
                        {entry.calories.toFixed(0)}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                        {(entry.protein_g || 0).toFixed(1)}g
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                        {(entry.fat_g || 0).toFixed(1)}g
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                        {(entry.carbs_g || 0).toFixed(1)}g
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function SummaryKPI({
  label,
  value,
  unit,
  color,
  badge,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  badge?: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <p className="text-xs text-muted-foreground font-body mb-1">{label}</p>
      <p className={`num-display text-3xl font-bold ${color}`}>{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-xs text-muted-foreground font-body">{unit}</span>
        {badge && (
          <Badge className="text-[10px] border-0 bg-nutritrack-green/10 text-nutritrack-green px-1.5">
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
}
