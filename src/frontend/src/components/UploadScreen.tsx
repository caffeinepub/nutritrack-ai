import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, FileText, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { FoodItem } from "../types/nutrition";
import { DEMO_FOODS, parseCSV } from "../utils/nutrition";

interface UploadScreenProps {
  onFoodsLoaded: (foods: FoodItem[]) => void;
}

export function UploadScreen({ onFoodsLoaded }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    count: number;
    name: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const foods = parseCSV(text);
          if (foods.length === 0) {
            setError("No valid food entries found. Check your CSV format.");
            return;
          }
          setPreview({ count: foods.length, name: file.name });
          setTimeout(() => onFoodsLoaded(foods), 600);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to parse CSV");
        }
      };
      reader.readAsText(file);
    },
    [onFoodsLoaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".csv")) processFile(file);
      else setError("Please upload a CSV file");
    },
    [processFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Logo / Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow flex items-center justify-center">
              <img
                src="/assets/generated/nutritrack-logo-transparent.dim_200x200.png"
                alt="NutriTrack AI logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.currentTarget.parentElement;
                  if (el) {
                    el.className =
                      "w-14 h-14 rounded-2xl nutritrack-gradient flex items-center justify-center shadow-glow";
                    e.currentTarget.remove();
                    el.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
                  }
                }}
              />
            </div>
          </motion.div>
          <h1 className="font-display text-5xl font-bold mb-3 nutritrack-gradient-text tracking-tight">
            NutriTrack AI
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            ML-powered calorie & nutrition intelligence
          </p>
        </div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card rounded-3xl p-8 shadow-glow-lg"
        >
          <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
            Load Your Nutrition Database
          </h2>
          <p className="text-muted-foreground text-sm mb-6 font-body">
            Upload a CSV with columns:{" "}
            <code className="font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded">
              food, serving_size_g, calories, protein_g, fat_g, carbs_g
            </code>
          </p>

          {/* Drop Zone */}
          <button
            type="button"
            className={`upload-zone w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragging
                ? "drag-active"
                : "border-border hover:border-nutritrack-teal/60 hover:bg-nutritrack-teal/5"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            aria-label="Upload CSV file"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />

            {preview ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-nutritrack-green/15 flex items-center justify-center">
                  <Check className="w-7 h-7 text-nutritrack-green" />
                </div>
                <p className="font-display font-bold text-foreground text-lg">
                  {preview.name}
                </p>
                <Badge className="bg-nutritrack-green/15 text-nutritrack-green border-0 font-mono">
                  {preview.count} foods loaded
                </Badge>
                <p className="text-muted-foreground text-sm">
                  Continuing to profile setup…
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-nutritrack-teal/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-nutritrack-teal" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-lg">
                    Drag & drop your CSV here
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    or click to browse files
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-border"
                >
                  .csv files only
                </Badge>
              </div>
            )}
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs font-body">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Data Button */}
          <Button
            variant="outline"
            className="w-full h-12 font-display font-semibold border-nutritrack-teal/30 hover:border-nutritrack-teal hover:bg-nutritrack-teal/10 text-nutritrack-teal transition-all"
            onClick={() => onFoodsLoaded(DEMO_FOODS)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Use Demo Data — 25 Foods
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          {[
            "ML Food Recommendations",
            "BMR Calculator",
            "Macro Tracking",
            "Exercise Planner",
            "Export Reports",
          ].map((f) => (
            <span
              key={f}
              className="text-xs font-body text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border"
            >
              {f}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
