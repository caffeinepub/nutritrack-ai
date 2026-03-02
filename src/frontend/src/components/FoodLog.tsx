import { Badge } from "@/components/ui/badge";
import { Clock, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FoodLogEntry } from "../types/nutrition";

interface FoodLogProps {
  entries: FoodLogEntry[];
  onRemove: (id: string) => void;
}

export function FoodLog({ entries, onRemove }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="font-body text-sm">No foods added yet</p>
        <p className="font-body text-xs mt-1 text-muted-foreground/60">
          Add food above to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -16, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 16, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border group hover:border-border/80 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body font-medium text-sm text-foreground capitalize truncate">
                    {entry.food}
                  </p>
                  {entry.isManual && (
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0 border-nutritrack-amber/30 text-nutritrack-amber"
                    >
                      manual
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {entry.grams}g
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {entry.protein_g > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        P:{entry.protein_g.toFixed(1)}g
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        F:{entry.fat_g.toFixed(1)}g
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        C:{entry.carbs_g.toFixed(1)}g
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="num-display font-bold text-base text-foreground">
                  {entry.calories.toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground font-body">
                  kcal
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  aria-label={`Remove ${entry.food}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
