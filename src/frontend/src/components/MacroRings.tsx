interface MacroRingsProps {
  protein: number;
  fat: number;
  carbs: number;
  size?: number;
}

export function MacroRings({
  protein,
  fat,
  carbs,
  size = 56,
}: MacroRingsProps) {
  const total = protein * 4 + fat * 9 + carbs * 4;

  const macros = [
    {
      label: "P",
      value: total > 0 ? ((protein * 4) / total) * 100 : 0,
      grams: protein,
      color: "oklch(var(--nutritrack-teal))",
      fullLabel: "Protein",
    },
    {
      label: "F",
      value: total > 0 ? ((fat * 9) / total) * 100 : 0,
      grams: fat,
      color: "oklch(var(--nutritrack-amber))",
      fullLabel: "Fat",
    },
    {
      label: "C",
      value: total > 0 ? ((carbs * 4) / total) * 100 : 0,
      grams: carbs,
      color: "oklch(var(--nutritrack-purple))",
      fullLabel: "Carbs",
    },
  ];

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-4">
      {macros.map((m) => {
        const offset =
          circumference - (Math.min(100, m.value) / 100) * circumference;
        return (
          <div key={m.label} className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-label={`${m.fullLabel}: ${m.grams.toFixed(1)}g`}
                role="img"
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="oklch(var(--border))"
                  strokeWidth={5}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={m.color}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="progress-ring-circle"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[9px] font-bold text-foreground">
                  {m.label}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {m.grams.toFixed(0)}g
            </span>
          </div>
        );
      })}
    </div>
  );
}
