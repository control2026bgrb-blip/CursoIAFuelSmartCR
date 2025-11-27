import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Wrench,
  TrendingDown,
  MapPin,
  Clock,
  ChevronRight,
  Bell,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AlertType = "warning" | "maintenance" | "price" | "tip";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string;
  actionLabel?: string;
  icon: LucideIcon;
  dismissed?: boolean;
}

// todo: remove mock functionality - datos de Costa Rica
const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Consumo Inusual Detectado",
    description: "Tu Toyota Corolla consumió 15% más combustible de lo normal esta semana.",
    time: "Hace 2 horas",
    actionLabel: "Ver Detalles",
    icon: AlertTriangle,
  },
  {
    id: "2",
    type: "maintenance",
    title: "Cambio de Aceite Recomendado",
    description: "Según tu kilometraje, se recomienda cambio de aceite en los próximos 500km.",
    time: "Hace 1 día",
    actionLabel: "Buscar Taller",
    icon: Wrench,
  },
  {
    id: "3",
    type: "price",
    title: "Precios Bajos Cerca de Ti",
    description: "Gasolinera Delta (Escazú) bajó a ₡695/L - ₡15 menos que el promedio.",
    time: "Hace 3 horas",
    actionLabel: "Ver Mapa",
    icon: TrendingDown,
  },
  {
    id: "4",
    type: "tip",
    title: "Consejo de Eco-Conducción",
    description: "Mantén velocidades constantes en autopista para mejorar eficiencia hasta 10%.",
    time: "Hace 5 horas",
    icon: MapPin,
  },
];

const alertStyles: Record<AlertType, { bg: string; text: string; border: string }> = {
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  maintenance: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  price: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  tip: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <Card data-testid="alerts-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Alertas Inteligentes</CardTitle>
            <Badge>{alerts.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" data-testid="button-alert-settings">
            <Bell className="mr-1 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">No hay alertas en este momento</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`relative rounded-md border p-4 ${alertStyles[alert.type].bg} ${alertStyles[alert.type].border}`}
              data-testid={`alert-${alert.id}`}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => dismissAlert(alert.id)}
                data-testid={`button-dismiss-${alert.id}`}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="flex gap-3 pr-6">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${alertStyles[alert.type].bg}`}>
                  <alert.icon className={`h-5 w-5 ${alertStyles[alert.type].text}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{alert.time}</span>
                    </div>
                    {alert.actionLabel && (
                      <Button size="sm" variant="ghost" className={alertStyles[alert.type].text}>
                        {alert.actionLabel}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
