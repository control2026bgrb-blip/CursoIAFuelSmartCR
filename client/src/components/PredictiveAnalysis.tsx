import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  Calendar,
  Zap,
  Fuel,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Prediction {
  id: string;
  type: "fuel" | "efficiency" | "price" | "maintenance";
  title: string;
  description: string;
  confidence: number;
  icon: any;
  color: string;
}

const mockPredictions: Prediction[] = [
  {
    id: "1",
    type: "fuel",
    title: "Mejor Momento para Cargar Combustible",
    description:
      "Basado en tus patrones de conducción, estimamos que el mejor momento para cargar combustible es mañana por la tarde. RECOPE actualiza precios los primeros días de cada mes.",
    confidence: 92,
    icon: Fuel,
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "2",
    type: "efficiency",
    title: "Oportunidad de Ahorro de Combustible",
    description:
      "Tus aceleraciones bruscas han aumentado 15% este mes. Reduciendo aceleraciones en un 20%, podrías ahorrar ₡8,500 mensuales en combustible.",
    confidence: 88,
    icon: TrendingUp,
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "3",
    type: "price",
    title: "Predicción de Precios RECOPE",
    description:
      "Historicamente, los precios suben un 3-5% en la tercera semana del mes. Recomendamos cargar combustible entre el 1-7 de diciembre.",
    confidence: 85,
    icon: Calendar,
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "4",
    type: "maintenance",
    title: "Mantenimiento Preventivo Estimado",
    description:
      "Con tu kilometraje y patrón de uso actual, necesitarás cambio de aceite en aproximadamente 18 días. Costo estimado: ₡45,000.",
    confidence: 90,
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
];

export function PredictiveAnalysis() {
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular generación de nuevas predicciones
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner Principal */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 p-6 text-white shadow-lg" data-testid="predictive-banner">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Análisis Predictivo IA</h3>
            <p className="mt-1 text-sm text-white/90">
              Basado en tus patrones de conducción, estimamos que el mejor momento para cargar combustible es <span className="font-bold">mañana por la tarde</span>. RECOPE actualiza precios los primeros días de cada mes.
            </p>
          </div>
        </div>
      </div>

      <Card data-testid="predictive-analysis">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-medium">
                Recomendaciones IA
              </CardTitle>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              data-testid="button-refresh-predictions"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mb-2 h-10 w-10 animate-spin opacity-50" />
            <p className="text-sm">Generando predicciones con IA...</p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">No hay predicciones disponibles</p>
          </div>
        ) : (
          predictions.map((prediction) => {
            const PredictionIcon = prediction.icon;
            return (
              <div
                key={prediction.id}
                className={`rounded-lg border p-4 ${prediction.color}`}
                data-testid={`prediction-${prediction.id}`}
              >
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${prediction.color}`}
                  >
                    <PredictionIcon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{prediction.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {prediction.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-xs font-medium text-foreground/70">
                          {prediction.confidence}%
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        data-testid={`button-action-${prediction.id}`}
                      >
                        Más Detalles
                      </Button>
                      {prediction.type === "fuel" && (
                        <Button
                          size="sm"
                          variant="default"
                          className="text-xs"
                          data-testid={`button-act-${prediction.id}`}
                        >
                          Establecer Recordatorio
                        </Button>
                      )}
                      {prediction.type === "maintenance" && (
                        <Button
                          size="sm"
                          variant="default"
                          className="text-xs"
                          data-testid={`button-act-${prediction.id}`}
                        >
                          Buscar Taller
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Nota sobre datos locales */}
        <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            Las predicciones se basan en datos actuales de RECOPE, estaciones de servicio en
            Costa Rica (Delta, Uno, Total) y tu historial de conducción. Precisión: ±5%.
          </p>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
