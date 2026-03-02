import { Droplets } from "lucide-react";
import { motion } from "motion/react";

interface WaterTrackerProps {
  glasses: number;
  target?: number;
  onAdd: () => void;
  onRemove: () => void;
}

const GLASS_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export function WaterTracker({
  glasses,
  target = 8,
  onAdd,
  onRemove,
}: WaterTrackerProps) {
  const slots = GLASS_SLOTS.slice(0, target);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span className="font-display font-semibold text-sm text-foreground">
            Water Intake
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {glasses}/{target} glasses
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {slots.map((slot) => {
          const isFilled = slot < glasses;
          const isAddBtn = slot === glasses;
          const isRemoveBtn = slot === glasses - 1;
          return (
            <motion.button
              key={`glass-slot-${slot}`}
              type="button"
              onClick={isRemoveBtn ? onRemove : isAddBtn ? onAdd : undefined}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                background: isFilled
                  ? "oklch(0.6 0.18 220)"
                  : "oklch(var(--muted))",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isFilled ? "Remove glass" : "Add glass"}
            >
              <Droplets
                className="w-3.5 h-3.5"
                style={{
                  color: isFilled ? "white" : "oklch(var(--muted-foreground))",
                }}
              />
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRemove}
          disabled={glasses === 0}
          className="flex-1 h-7 rounded-lg text-xs font-body bg-muted/60 text-muted-foreground hover:bg-muted transition-all disabled:opacity-30"
        >
          −
        </button>
        <button
          type="button"
          onClick={onAdd}
          disabled={glasses >= target}
          className="flex-1 h-7 rounded-lg text-xs font-body bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 transition-all disabled:opacity-30"
        >
          + Glass
        </button>
      </div>

      {glasses >= target && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center text-nutritrack-green mt-2 font-body"
        >
          🎉 Daily goal reached!
        </motion.p>
      )}
    </div>
  );
}
