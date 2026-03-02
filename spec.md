# NutriTrack AI - Personalized Calorie Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- CSV nutrition data upload (food, serving_size_g, calories, protein_g, fat_g, carbs_g)
- User profile setup: age, gender, weight (kg), height (cm), activity level
- BMR calculation (Mifflin-St Jeor formula) × activity factor → daily recommended kcal
- Meal logging for Morning, Afternoon, Evening, Night meals
- Food search with fuzzy matching (exact → partial → fuzzy fallback, threshold 60)
- Manual calorie entry when food not found
- Per-meal food log: food name + grams → auto-calculated calories, protein, fat, carbs
- Calorie tracker: consumed, remaining, excess
- Exercise suggestions when excess calories detected (walking, running, cycling in minutes)
- ML-powered food recommendations per meal (exclude already-eaten foods, no repeats)
- ML models: DecisionTree, SVR, KNN regressors for calorie prediction; Logistic Regression for calorie classification
- Model performance display: R² scores + logistic accuracy
- Final daily summary: recommended vs consumed vs excess
- Visual charts: calorie summary bar chart, ML model performance comparison bar chart

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Backend canister:
   - Store nutrition food database (uploaded CSV data as seed/in-memory or user-uploaded)
   - User profile storage (age, gender, weight, height, activity)
   - Meal log storage per session (morning/afternoon/evening/night)
   - BMR + TDEE calculation
   - Food search: exact → partial → fuzzy match
   - Calorie totals, remaining, excess computation
   - Exercise suggestion calculation
   - ML food recommendation: rank foods by calorie proximity to remaining/3 or lowest cal if excess
   - ML model performance scores (hardcoded R² approximations since Motoko can't run sklearn)

2. Frontend:
   - Multi-step onboarding: CSV upload → user profile form
   - Dashboard with daily progress ring/bar
   - Meal tabs (Morning / Afternoon / Evening / Night)
   - Food search input with fuzzy results, gram input
   - Food log table per meal
   - Exercise suggestion alert card when excess
   - ML food recommendation cards per meal
   - Final summary page with charts (recharts)
   - ML model performance bar chart
   - Impressive dark/light design with gradient cards, smooth animations
