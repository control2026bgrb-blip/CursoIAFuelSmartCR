import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertsPanel } from "@/components/AlertsPanel";
import { PredictiveAnalysis } from "@/components/PredictiveAnalysis";
import { AlertTriangle, Bell, Wrench, TrendingDown, Lightbulb } from "lucide-react";

// todo: remove mock functionality
const alertPreferences = [
  { id: "anomalies", label: "Anomalías de Consumo", description: "Alerta cuando el uso de combustible es inusualmente alto", enabled: true, icon: AlertTriangle },
  { id: "maintenance", label: "Recordatorios de Mantenimiento", description: "Notificación sobre próximos servicios necesarios", enabled: true, icon: Wrench },
  { id: "prices", label: "Alertas de Precios", description: "Notificar cuando bajan los precios cerca de ti", enabled: true, icon: TrendingDown },
  { id: "tips", label: "Consejos de Eco-Conducción", description: "Recibir sugerencias para mejorar eficiencia", enabled: false, icon: Lightbulb },
];

export default function Alerts() {
  return (
    <div className="space-y-6 p-6" data-testid="page-alerts">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alertas Predictivas</h1>
          <p className="text-muted-foreground">Análisis inteligente con IA y recomendaciones</p>
        </div>
        <Button variant="outline" data-testid="button-mark-all-read">
          <Bell className="mr-2 h-4 w-4" />
          Marcar Todo como Leído
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AlertsPanel />
          <PredictiveAnalysis />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Preferencias de Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alertPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-start justify-between gap-4"
                  data-testid={`pref-${pref.id}`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
                      <pref.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={pref.id} className="text-sm font-medium cursor-pointer">
                        {pref.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                  </div>
                  <Switch id={pref.id} defaultChecked={pref.enabled} data-testid={`switch-${pref.id}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recomendaciones IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-primary/10 p-3">
                <p className="text-sm font-medium text-primary">Mejor Momento para Cargar</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Los precios suelen bajar los martes. Considera cargar mañana para ahorrar hasta ₡15/L.
                </p>
              </div>
              <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Optimización de Ruta</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tomar la Ruta 27 en lugar de la Ruta 1 podría ahorrarte 15% de combustible en tu trayecto diario.
                </p>
              </div>
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Patrón de Conducción</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reducir aceleraciones bruscas un 20% podría mejorar tu eficiencia de combustible en 8%.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
