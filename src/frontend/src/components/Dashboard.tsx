import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Coffee,
  Download,
  LogOut,
  Moon,
  Sun,
  Sunset,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  FoodItem,
  FoodLogEntry,
  MealType,
  UserProfile,
} from "../types/nutrition";
import {
  computeDayStatus,
  computeMLScores,
  exerciseSuggestion,
  generateReport,
  recommendFoods,
} from "../utils/nutrition";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodLog } from "./FoodLog";
import { FoodRecommendations } from "./FoodRecommendations";
import { MacroRings } from "./MacroRings";
import { ProgressRing } from "./ProgressRing";
import { WaterTracker } from "./WaterTracker";

interface DashboardProps {
  db: FoodItem[];
  profile: UserProfile;
  onViewSummary: () => void;
  onReset: () => void;
  foodLog: FoodLogEntry[];
  setFoodLog: (fn: (prev: FoodLogEntry[]) => FoodLogEntry[]) => void;
  waterGlasses: number;
  setWaterGlasses: (fn: (prev: number) => number) => void;
}

const MEALS: {
  key: MealType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "Morning", label: "Morning", icon: Sun },
  { key: "Afternoon", label: "Afternoon", icon: Coffee },
  { key: "Evening", label: "Evening", icon: Sunset },
  { key: "Night", label: "Night", icon: Moon },
];

export function Dashboard({
  db,
  profile,
  onViewSummary,
  onReset,
  foodLog,
  setFoodLog,
  waterGlasses,
  setWaterGlasses,
}: DashboardProps) {
  const [activeMeal, setActiveMeal] = useState<MealType>("Morning");

  const dayStatus = computeDayStatus(profile.recommendedKcal, foodLog);
  // mealLog is used via foodLog.filter in each TabsContent

  const allEaten = [...new Set(foodLog.map((e) => e.food))];
  const recs = recommendFoods(
    db,
    dayStatus.remaining,
    dayStatus.excess > 0,
    allEaten,
  );
  const pct = Math.min(100, (dayStatus.consumed / dayStatus.recommended) * 100);

  const addEntry = (entry: FoodLogEntry) => {
    setFoodLog((prev) => [...prev, entry]);
    toast.success(`Added ${entry.food} — ${entry.calories.toFixed(0)} kcal`, {
      duration: 2500,
    });
  };

  const removeEntry = (id: string) => {
    setFoodLog((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExport = () => {
    const scores = computeMLScores(db);
    const report = generateReport(foodLog, dayStatus, scores);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutritrack-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const handleFoodSelect = (food: FoodItem) => {
    // Pre-fill a reasonable serving size (100g)
    toast.info(`Selected: ${food.food} — type in the form to add`, {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg nutritrack-gradient flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">
              NutriTrack AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 text-xs font-body gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSummary}
              className="h-8 text-xs font-body"
            >
              Summary
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Main Ring */}
          <div className="glass-card rounded-3xl p-6 flex flex-col items-center shadow-glow">
            <ProgressRing
              value={pct}
              size={160}
              strokeWidth={14}
              color={
                dayStatus.excess > 0
                  ? "oklch(var(--destructive))"
                  : pct > 80
                    ? "oklch(var(--nutritrack-amber))"
                    : "oklch(var(--nutritrack-teal))"
              }
              label={`${pct.toFixed(0)}%`}
              sublabel="consumed"
            />
            <p className="font-display font-bold text-3xl text-foreground mt-4 num-display">
              {dayStatus.consumed.toFixed(0)}
              <span className="text-base font-body text-muted-foreground ml-1">
                kcal
              </span>
            </p>
            <p className="text-sm text-muted-foreground font-body">
              of {dayStatus.recommended.toFixed(0)} goal
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <StatCard
              label="Remaining"
              value={Math.max(0, dayStatus.remaining).toFixed(0)}
              unit="kcal"
              color={
                dayStatus.remaining > 0
                  ? "text-nutritrack-teal"
                  : "text-muted-foreground"
              }
            />
            <StatCard
              label="Excess"
              value={dayStatus.excess.toFixed(0)}
              unit="kcal"
              color={
                dayStatus.excess > 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
              highlight={dayStatus.excess > 0}
            />
            <StatCard
              label="Protein"
              value={dayStatus.protein.toFixed(1)}
              unit="g"
              color="text-nutritrack-teal"
            />
            <StatCard
              label="Fat"
              value={dayStatus.fat.toFixed(1)}
              unit="g"
              color="text-nutritrack-amber"
            />
            <div className="col-span-2">
              <StatCard
                label="Carbohydrates"
                value={dayStatus.carbs.toFixed(1)}
                unit="g"
                color="text-nutritrack-purple"
              />
            </div>
          </div>
        </motion.div>

        {/* Excess Alert */}
        {dayStatus.excess > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 border border-destructive/20 bg-destructive/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="font-display font-bold text-destructive">
                Calorie Excess: {dayStatus.excess.toFixed(0)} kcal
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(exerciseSuggestion(dayStatus.excess)).map(
                ([k, v]) => (
                  <div key={k} className="bg-card rounded-xl p-3 text-center">
                    <p className="num-display text-xl font-bold text-foreground">
                      {v}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      min {k}
                    </p>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Meal Tabs - Main Area */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeMeal}
              onValueChange={(v) => setActiveMeal(v as MealType)}
            >
              <TabsList className="grid grid-cols-4 h-11 bg-muted/40 p-1 rounded-xl mb-4">
                {MEALS.map(({ key, label, icon: Icon }) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="rounded-lg font-body text-xs data-[state=active]:bg-card data-[state=active]:shadow-xs gap-1.5 data-[state=active]:text-nutritrack-teal"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {MEALS.map(({ key }) => {
                const mealEntries = foodLog.filter((e) => e.meal === key);
                const mealCalories = mealEntries.reduce(
                  (s, e) => s + e.calories,
                  0,
                );
                const mealProtein = mealEntries.reduce(
                  (s, e) => s + (e.protein_g || 0),
                  0,
                );
                const mealFat = mealEntries.reduce(
                  (s, e) => s + (e.fat_g || 0),
                  0,
                );
                const mealCarbs = mealEntries.reduce(
                  (s, e) => s + (e.carbs_g || 0),
                  0,
                );

                return (
                  <TabsContent key={key} value={key} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="glass-card rounded-2xl p-5 space-y-4"
                    >
                      {/* Meal Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-bold text-foreground">
                            {key} Meal
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {mealEntries.length} item
                            {mealEntries.length !== 1 ? "s" : ""} •{" "}
                            {mealCalories.toFixed(0)} kcal
                          </p>
                        </div>
                        {mealEntries.length > 0 && (
                          <MacroRings
                            protein={mealProtein}
                            fat={mealFat}
                            carbs={mealCarbs}
                          />
                        )}
                      </div>

                      <Separator />

                      {/* Recommendations */}
                      <FoodRecommendations
                        foods={recs}
                        excessMode={dayStatus.excess > 0}
                        onSelect={handleFoodSelect}
                      />

                      <Separator />

                      {/* Entry Form */}
                      <FoodEntryForm db={db} meal={key} onAdd={addEntry} />

                      {/* Log */}
                      {mealEntries.length > 0 && (
                        <>
                          <Separator />
                          <FoodLog
                            entries={mealEntries}
                            onRemove={removeEntry}
                          />
                        </>
                      )}
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Water */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WaterTracker
                glasses={waterGlasses}
                onAdd={() => setWaterGlasses((p) => Math.min(8, p + 1))}
                onRemove={() => setWaterGlasses((p) => Math.max(0, p - 1))}
              />
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="glass-card rounded-2xl p-4 space-y-2">
                <p className="font-display font-semibold text-sm text-foreground mb-2">
                  Profile
                </p>
                {[
                  ["Goal", `${profile.recommendedKcal.toFixed(0)} kcal`],
                  [
                    "Age / Gender",
                    `${profile.age} / ${profile.gender === "M" ? "Male" : "Female"}`,
                  ],
                  [
                    "Weight / Height",
                    `${profile.weight} kg / ${profile.height} cm`,
                  ],
                  ["Activity", profile.activityLevel],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-muted-foreground font-body">{k}</span>
                    <span className="font-mono text-foreground capitalize">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily History Count */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card rounded-2xl p-4">
                <p className="font-display font-semibold text-sm text-foreground mb-3">
                  Today's Log
                </p>
                {MEALS.map(({ key, icon: Icon }) => {
                  const count = foodLog.filter((e) => e.meal === key).length;
                  const cal = foodLog
                    .filter((e) => e.meal === key)
                    .reduce((s, e) => s + e.calories, 0);
                  return (
                    <div key={key} className="flex items-center gap-2 py-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-body text-muted-foreground flex-1">
                        {key}
                      </span>
                      {count > 0 ? (
                        <span className="font-mono text-xs text-nutritrack-teal">
                          {cal.toFixed(0)} kcal
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          —
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* View Summary CTA */}
            <Button
              onClick={onViewSummary}
              className="w-full h-11 nutritrack-gradient border-0 text-white font-display font-bold shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Daily Summary
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-4 ${highlight ? "border-destructive/20 animate-pulse-glow" : ""}`}
    >
      <p className="text-xs text-muted-foreground font-body mb-1">{label}</p>
      <p className={`num-display text-2xl font-bold ${color}`}>
        {value}
        <span className="text-sm font-body text-muted-foreground ml-1">
          {unit}
        </span>
      </p>
    </div>
  );
}
