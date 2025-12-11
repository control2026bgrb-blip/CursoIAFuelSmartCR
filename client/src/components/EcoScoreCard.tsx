import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, TrendingUp, Droplets, Wind, Trees } from "lucide-react";

interface EcoMetric {
  label: string;
  value: number;
  max: number;
  icon: typeof Leaf;
  color: string;
}

// todo: remove mock functionality
const mockEcoScore = 78;
const mockMetrics: EcoMetric[] = [
  { label: "Eficiencia de Conducción", value: 82, max: 100, icon: Wind, color: "text-blue-500" },
  { label: "Economía de Combustible", value: 75, max: 100, icon: Droplets, color: "text-cyan-500" },
  { label: "Reducción de CO₂", value: 68, max: 100, icon: Trees, color: "text-green-500" },
];

export function EcoScoreCard() {
  const scoreColor =
    mockEcoScore >= 80
      ? "text-green-500"
      : mockEcoScore >= 60
        ? "text-amber-500"
        : "text-red-500";

  const scoreLabel =
    mockEcoScore >= 80
      ? "Excelente"
      : mockEcoScore >= 60
        ? "Bueno"
        : "Necesita Mejorar";

  return (
    <Card data-testid="eco-score-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">Eco Score</CardTitle>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>+5 este mes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(162, 72%, 45%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(mockEcoScore / 100) * 283} 283`}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{mockEcoScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Leaf className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{scoreLabel}</span>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          {mockMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span>{metric.label}</span>
                </div>
                <span className="font-medium">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Huella de Carbono:</span> Has ahorrado 45 kg de CO₂ este mes conduciendo eficientemente. ¡Equivale a plantar 2 árboles!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
