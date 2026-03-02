import { Sparkles, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import type { FoodItem } from "../types/nutrition";

interface FoodRecommendationsProps {
  foods: FoodItem[];
  excessMode: boolean;
  onSelect?: (food: FoodItem) => void;
}

export function FoodRecommendations({
  foods,
  excessMode,
  onSelect,
}: FoodRecommendationsProps) {
  if (foods.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {excessMode ? (
          <TrendingDown className="w-4 h-4 text-nutritrack-green" />
        ) : (
          <Sparkles className="w-4 h-4 text-nutritrack-teal" />
        )}
        <span className="font-display font-semibold text-sm text-foreground">
          {excessMode ? "Low-Calorie Recommendations" : "ML-Suggested Foods"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {foods.map((food, i) => (
          <motion.button
            key={food.food}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect?.(food)}
            className="text-left p-3 rounded-xl bg-card border border-border hover:border-nutritrack-teal/40 hover:bg-nutritrack-teal/5 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-1">
              <p className="font-body font-medium text-sm text-foreground capitalize leading-tight group-hover:text-nutritrack-teal transition-colors">
                {food.food}
              </p>
              <span className="num-display text-xs font-bold text-nutritrack-teal whitespace-nowrap shrink-0">
                {food.calories_per_100g.toFixed(0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              kcal/100g
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                P:{food.protein_per_100g.toFixed(0)}g
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                F:{food.fat_per_100g.toFixed(0)}g
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                C:{food.carbs_per_100g.toFixed(0)}g
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
