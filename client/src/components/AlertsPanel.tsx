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
type AlertCategory = "all" | "maintenance" | "price" | "warning" | "eco" | "promotion";

interface Alert {
  id: string;
  type: AlertType;
  category: AlertCategory;
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
    type: "maintenance",
    category: "maintenance",
    title: "Mantenimiento Próximo",
    description: "Tu vehículo alcanzará los 50,000 km pronto. Se recomienda cambio de aceite y revisión de frenos.",
    time: "Hace 1 día",
    actionLabel: "Ver detalles",
    icon: Wrench,
  },
  {
    id: "2",
    type: "price",
    category: "price",
    title: "Precio Bajo Detectado",
    description: "Total Lindora tiene gasolina Super a ₡785/L. 3% más barato que tu promedio.",
    time: "Hace 3 horas",
    actionLabel: "Ver mapa",
    icon: TrendingDown,
  },
  {
    id: "3",
    type: "warning",
    category: "warning",
    title: "Consumo Inusual",
    description: "Tu consumo aumentó 20% esta semana. Revisa la presión de llantas o el filtro de aire.",
    time: "Hace 5 horas",
    icon: AlertTriangle,
  },
  {
    id: "4",
    type: "tip",
    category: "eco",
    title: "Tip de Eco-Driving",
    description: "Mantén velocidades constantes en autopista para mejorar eficiencia hasta 10%.",
    time: "Hace 8 horas",
    icon: MapPin,
  },
];

const alertStyles: Record<AlertType, { bg: string; text: string; borderColor: string; leftBorder: string }> = {
  warning: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    borderColor: "#ef4444",
    leftBorder: "border-l-4 border-l-red-500",
  },
  maintenance: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    borderColor: "#3b82f6",
    leftBorder: "border-l-4 border-l-blue-500",
  },
  price: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    borderColor: "#10b981",
    leftBorder: "border-l-4 border-l-green-500",
  },
  tip: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
    borderColor: "#14b8a6",
    leftBorder: "border-l-4 border-l-teal-500",
  },
};

const categories: { id: AlertCategory; label: string; count?: string }[] = [
  { id: "all", label: "Todas" },
  { id: "maintenance", label: "Mantenimiento" },
  { id: "price", label: "Precios" },
  { id: "warning", label: "Anomalías" },
  { id: "eco", label: "Eco-Tips" },
  { id: "promotion", label: "Promociones" },
];

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory>("all");

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const filteredAlerts = selectedCategory === "all" 
    ? alerts 
    : alerts.filter((a) => a.category === selectedCategory);

  return (
    <Card data-testid="alerts-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Alertas Inteligentes</CardTitle>
            <Badge>{filteredAlerts.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" data-testid="button-alert-settings">
            <Bell className="mr-1 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      
      {/* Tabs de categorías */}
      <div className="border-b px-4 py-2">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`category-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="space-y-3 pt-3">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">No hay alertas en esta categoría</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`relative rounded-md border p-4 ${alertStyles[alert.type].bg} ${alertStyles[alert.type].leftBorder}`}
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
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
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
