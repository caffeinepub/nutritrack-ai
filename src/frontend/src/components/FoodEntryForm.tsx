import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FoodItem, FoodLogEntry, MealType } from "../types/nutrition";
import { lookupFoodNutrients } from "../utils/nutrition";

interface FoodEntryFormProps {
  db: FoodItem[];
  meal: MealType;
  onAdd: (entry: FoodLogEntry) => void;
}

export function FoodEntryForm({ db, meal, onAdd }: FoodEntryFormProps) {
  const [foodName, setFoodName] = useState("");
  const [grams, setGrams] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualCalories, setManualCalories] = useState("");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);

  const handleAdd = () => {
    const gramsNum = Number.parseFloat(grams);
    if (!foodName.trim() || Number.isNaN(gramsNum) || gramsNum <= 0) return;

    setSearching(true);

    setTimeout(() => {
      const { entry, score } = lookupFoodNutrients(foodName, gramsNum, db);
      setLastScore(score);
      setSearching(false);

      if (entry) {
        const logEntry: FoodLogEntry = {
          id: crypto.randomUUID(),
          ...entry,
          timestamp: new Date(),
          meal,
        };
        onAdd(logEntry);
        setFoodName("");
        setGrams("");
        setManualMode(false);
        setManualCalories("");
      } else {
        setManualMode(true);
      }
    }, 200);
  };

  const handleManualAdd = () => {
    const cal = Number.parseFloat(manualCalories);
    if (Number.isNaN(cal)) return;
    const gramsNum = Number.parseFloat(grams) || 0;
    const logEntry: FoodLogEntry = {
      id: crypto.randomUUID(),
      food: foodName.trim(),
      grams: gramsNum,
      calories: cal,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      timestamp: new Date(),
      meal,
      isManual: true,
    };
    onAdd(logEntry);
    setFoodName("");
    setGrams("");
    setManualMode(false);
    setManualCalories("");
    setLastScore(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search food (e.g. chicken breast)"
            value={foodName}
            onChange={(e) => {
              setFoodName(e.target.value);
              setManualMode(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="pl-9 h-11 font-body"
            aria-label="Food name"
          />
        </div>
        <Input
          type="number"
          placeholder="Grams"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-24 h-11 font-mono text-center"
          aria-label="Grams"
        />
        <Button
          onClick={handleAdd}
          disabled={!foodName.trim() || !grams || searching}
          className="h-11 px-4 nutritrack-gradient border-0 text-white shadow-glow hover:shadow-glow-lg transition-all"
          aria-label="Add food"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {manualMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-nutritrack-amber/10 border border-nutritrack-amber/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-nutritrack-amber" />
                <span className="text-sm font-body text-foreground">
                  &quot;<span className="font-semibold">{foodName}</span>&quot;
                  not found
                  {lastScore !== null &&
                    ` (best match score: ${lastScore.toFixed(0)}%)`}
                  . Enter calories manually:
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Calories (kcal)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 250"
                    value={manualCalories}
                    onChange={(e) => setManualCalories(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                    className="h-10 font-mono"
                  />
                </div>
                <Button
                  onClick={handleManualAdd}
                  disabled={!manualCalories}
                  className="self-end h-10 font-body"
                  variant="outline"
                >
                  Add Manual
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
