export interface FoodItem {
  food: string;
  serving_size_g: number;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
}

export interface FoodLogEntry {
  id: string;
  food: string;
  grams: number;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  timestamp: Date;
  meal: MealType;
  isManual?: boolean;
}

export type MealType = "Morning" | "Afternoon" | "Evening" | "Night";

export interface UserProfile {
  age: number;
  gender: "M" | "F";
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  recommendedKcal: number;
  customGoal?: number;
}

export type ActivityLevel =
  | "sedentary"
  | "lightly active"
  | "moderately active"
  | "very active"
  | "extra active";

export interface MLScores {
  decisionTree: number;
  svr: number;
  knn: number;
  logisticAccuracy: number;
}

export interface DayStatus {
  recommended: number;
  consumed: number;
  remaining: number;
  excess: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface ExerciseSuggestion {
  walking: number;
  running: number;
  cycling: number;
}

export type AppStep = "upload" | "profile" | "dashboard" | "summary";
