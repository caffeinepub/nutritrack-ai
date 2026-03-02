import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useCallback, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ProfileForm } from "./components/ProfileForm";
import { SummaryPage } from "./components/SummaryPage";
import { UploadScreen } from "./components/UploadScreen";
import type {
  AppStep,
  FoodItem,
  FoodLogEntry,
  UserProfile,
} from "./types/nutrition";
import { computeDayStatus } from "./utils/nutrition";

export default function App() {
  const [step, setStep] = useState<AppStep>("upload");
  const [db, setDb] = useState<FoodItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [foodLog, setFoodLog] = useState<FoodLogEntry[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(0);

  const handleFoodsLoaded = useCallback((foods: FoodItem[]) => {
    setDb(foods);
    setStep("profile");
  }, []);

  const handleProfileComplete = useCallback((p: UserProfile) => {
    setProfile(p);
    setStep("dashboard");
  }, []);

  const handleViewSummary = useCallback(() => {
    setStep("summary");
  }, []);

  const handleBack = useCallback(() => {
    setStep("dashboard");
  }, []);

  const handleReset = useCallback(() => {
    setFoodLog([]);
    setWaterGlasses(0);
    setStep("upload");
    setProfile(null);
    setDb([]);
  }, []);

  const dayStatus = profile
    ? computeDayStatus(profile.recommendedKcal, foodLog)
    : {
        recommended: 0,
        consumed: 0,
        remaining: 0,
        excess: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Toaster position="top-right" richColors />
      {step === "upload" && <UploadScreen onFoodsLoaded={handleFoodsLoaded} />}
      {step === "profile" && (
        <ProfileForm onProfileComplete={handleProfileComplete} />
      )}
      {step === "dashboard" && profile && (
        <Dashboard
          db={db}
          profile={profile}
          onViewSummary={handleViewSummary}
          onReset={handleReset}
          foodLog={foodLog}
          setFoodLog={setFoodLog}
          waterGlasses={waterGlasses}
          setWaterGlasses={setWaterGlasses}
        />
      )}
      {step === "summary" && profile && (
        <SummaryPage
          db={db}
          profile={profile}
          dayStatus={dayStatus}
          foodLog={foodLog}
          onReset={handleReset}
          onBack={handleBack}
        />
      )}
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-center">
          <p className="text-[11px] text-muted-foreground/40 font-body">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="hover:text-muted-foreground transition-colors pointer-events-auto underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </ThemeProvider>
  );
}
