import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, ArrowRight, Edit2, Target, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ActivityLevel, UserProfile } from "../types/nutrition";
import {
  calculateBMI,
  calculateTDEE,
  getBMICategory,
} from "../utils/nutrition";

interface ProfileFormProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little/no exercise)",
  "lightly active": "Lightly Active (1-3 days/week)",
  "moderately active": "Moderately Active (3-5 days/week)",
  "very active": "Very Active (6-7 days/week)",
  "extra active": "Extra Active (2x daily training)",
};

export function ProfileForm({ onProfileComplete }: ProfileFormProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderately active");
  const [customGoal, setCustomGoal] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ageNum = Number.parseFloat(age);
  const weightNum = Number.parseFloat(weight);
  const heightNum = Number.parseFloat(height);
  const isValid =
    !Number.isNaN(ageNum) &&
    !Number.isNaN(weightNum) &&
    !Number.isNaN(heightNum) &&
    ageNum > 0 &&
    weightNum > 0 &&
    heightNum > 0;

  const recommendedKcal = isValid
    ? calculateTDEE(ageNum, gender, weightNum, heightNum, activity)
    : 0;
  const bmi = isValid ? calculateBMI(weightNum, heightNum) : 0;
  const bmiCategory = bmi > 0 ? getBMICategory(bmi) : "";

  const bmiColor =
    {
      Underweight: "text-nutritrack-amber",
      Normal: "text-nutritrack-green",
      Overweight: "text-nutritrack-amber",
      Obese: "text-destructive",
    }[bmiCategory] || "text-foreground";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!age || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 120)
      e.age = "Enter a valid age (10-120)";
    if (!weight || Number.isNaN(weightNum) || weightNum < 20 || weightNum > 300)
      e.weight = "Enter valid weight (20-300 kg)";
    if (
      !height ||
      Number.isNaN(heightNum) ||
      heightNum < 100 ||
      heightNum > 250
    )
      e.height = "Enter valid height (100-250 cm)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const custom =
      showCustom && customGoal ? Number.parseFloat(customGoal) : undefined;
    onProfileComplete({
      age: ageNum,
      gender,
      weight: weightNum,
      height: heightNum,
      activityLevel: activity,
      recommendedKcal: custom || recommendedKcal,
      customGoal: custom,
    });
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl nutritrack-gradient mb-4 shadow-glow">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Your Profile
          </h1>
          <p className="text-muted-foreground mt-1 font-body text-sm">
            We'll calculate your personalized calorie goal
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-glow">
          {/* Gender Toggle */}
          <div className="mb-5">
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">
              Biological Sex
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`h-11 rounded-xl font-display font-semibold text-sm transition-all ${
                    gender === g
                      ? "nutritrack-gradient text-white shadow-glow"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {g === "M" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* Age */}
            <div>
              <Label
                htmlFor="age"
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block"
              >
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`h-11 font-mono text-center text-lg ${errors.age ? "border-destructive" : ""}`}
              />
              {errors.age && (
                <p className="text-destructive text-xs mt-1">{errors.age}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <Label
                htmlFor="weight"
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block"
              >
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`h-11 font-mono text-center text-lg ${errors.weight ? "border-destructive" : ""}`}
              />
              {errors.weight && (
                <p className="text-destructive text-xs mt-1">{errors.weight}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <Label
                htmlFor="height"
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block"
              >
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`h-11 font-mono text-center text-lg ${errors.height ? "border-destructive" : ""}`}
              />
              {errors.height && (
                <p className="text-destructive text-xs mt-1">{errors.height}</p>
              )}
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6">
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Activity Level
            </Label>
            <Select
              value={activity}
              onValueChange={(v) => setActivity(v as ActivityLevel)}
            >
              <SelectTrigger className="h-11 font-body">
                <Activity className="w-4 h-4 mr-2 text-nutritrack-teal" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]
                ).map(([v, label]) => (
                  <SelectItem key={v} value={v} className="font-body">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Live Results */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-nutritrack-teal/10 rounded-2xl p-4 text-center">
                  <Target className="w-5 h-5 text-nutritrack-teal mx-auto mb-1" />
                  <p className="num-display text-2xl font-bold text-nutritrack-teal">
                    {Math.round(recommendedKcal)}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    kcal / day
                  </p>
                </div>
                <div className="bg-muted/40 rounded-2xl p-4 text-center">
                  <p className={`num-display text-2xl font-bold ${bmiColor}`}>
                    {bmi.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    BMI
                  </p>
                  <Badge
                    className={`text-xs mt-1 border-0 ${
                      bmiCategory === "Normal"
                        ? "bg-nutritrack-green/15 text-nutritrack-green"
                        : bmiCategory === "Obese"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-nutritrack-amber/15 text-nutritrack-amber"
                    }`}
                  >
                    {bmiCategory}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Custom Goal Toggle */}
          <div className="mb-6">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-nutritrack-teal hover:text-nutritrack-green transition-colors font-body"
              onClick={() => setShowCustom((p) => !p)}
            >
              <Edit2 className="w-3.5 h-3.5" />
              {showCustom ? "Use calculated goal" : "Set custom calorie goal"}
            </button>
            {showCustom && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2"
              >
                <Input
                  type="number"
                  placeholder={`${Math.round(recommendedKcal)} kcal (calculated)`}
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="h-11 font-mono"
                />
              </motion.div>
            )}
          </div>

          <Button
            className="w-full h-12 font-display font-bold text-base nutritrack-gradient border-0 text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.01] transition-all"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Start Tracking
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
