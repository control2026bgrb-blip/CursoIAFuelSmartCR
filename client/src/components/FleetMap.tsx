import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertCircle, Zap, PauseCircle, Power, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type VehicleState = "moving" | "charging" | "stopped" | "off" | "breakdown";

interface MapVehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  lat: number;
  lng: number;
  state: VehicleState;
  speed?: number;
  battery?: number;
  lastUpdate: string;
}

// Mock data - ubicaciones en San José, Costa Rica
const mockMapVehicles: MapVehicle[] = [
  {
    id: "1",
    name: "Toyota Hilux",
    plate: "SJO-123",
    driver: "Juan Pérez",
    lat: 9.9281,
    lng: -84.0907,
    state: "moving",
    speed: 45,
    lastUpdate: "Hace 2 min",
  },
  {
    id: "2",
    name: "Hyundai H1",
    plate: "HER-456",
    driver: "María García",
    lat: 9.9326,
    lng: -84.1008,
    state: "charging",
    battery: 65,
    lastUpdate: "Hace 1 min",
  },
  {
    id: "3",
    name: "Nissan NP300",
    plate: "ALA-789",
    driver: "David Mora",
    lat: 9.9394,
    lng: -84.1054,
    state: "breakdown",
    lastUpdate: "Hace 15 min",
  },
  {
    id: "4",
    name: "BYD T3",
    plate: "CAR-012",
    driver: "Sara Solís",
    lat: 9.9261,
    lng: -84.0853,
    state: "stopped",
    lastUpdate: "Ahora",
  },
  {
    id: "5",
    name: "Mitsubishi L200",
    plate: "LIB-345",
    driver: "Miguel Rojas",
    lat: 9.9245,
    lng: -84.0768,
    state: "off",
    lastUpdate: "Hace 30 min",
  },
];

const stateConfig: Record<
  VehicleState,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: LucideIcon;
  }
> = {
  moving: {
    label: "En Movimiento",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: Navigation,
  },
  charging: {
    label: "En Carga",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: Zap,
  },
  stopped: {
    label: "Detenido",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: PauseCircle,
  },
  off: {
    label: "Apagado",
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
    icon: Power,
  },
  breakdown: {
    label: "Con Avería",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: AlertCircle,
  },
};

export function FleetMap() {
  const [selectedVehicle, setSelectedVehicle] = useState<MapVehicle | null>(null);

  const handleVehicleSelect = useCallback((vehicle: MapVehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  return (
    <Card className="col-span-full" data-testid="fleet-map">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Flota en Tiempo Real
          </CardTitle>
          <div className="flex gap-1">
            {Object.entries(stateConfig).map(([state, config]) => (
              <div key={state} className="flex items-center gap-1">
                <div className={`h-3 w-3 rounded-full ${config.bgColor}`} />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Mapa simulado */}
          <div className="lg:col-span-3 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
            <div className="relative h-[500px] w-full rounded-md border border-dashed border-muted-foreground/20 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              {/* Simulación de mapa con Grid */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border border-muted" />
                ))}
              </div>

              {/* Marcadores de vehículos */}
              <div className="relative w-full h-full">
                {mockMapVehicles.map((vehicle) => {
                  const xPos = ((vehicle.lng + 84.15) / 0.15) * 100;
                  const yPos = ((10.0 - vehicle.lat) / 0.1) * 100;
                  const config = stateConfig[vehicle.state];
                  const Icon = config.icon;

                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group ${
                        selectedVehicle?.id === vehicle.id ? "z-10" : ""
                      }`}
                      style={{
                        left: `${xPos}%`,
                        top: `${yPos}%`,
                      }}
                      data-testid={`map-marker-${vehicle.id}`}
                    >
                      {/* Pulso de animación */}
                      <div
                        className={`absolute h-8 w-8 rounded-full opacity-75 animate-pulse ${config.bgColor}`}
                      />
                      {/* Marcador */}
                      <div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg transition-all hover-elevate ${config.bgColor} ${
                          selectedVehicle?.id === vehicle.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      {/* Tooltip */}
                      <div className="invisible group-hover:visible absolute -top-16 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none">
                        {vehicle.name} - {vehicle.plate}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                <p className="font-medium mb-1">San José, Costa Rica</p>
                <p>Zona de Cobertura GPS</p>
              </div>
            </div>

            {/* Información de rutas */}
            <div className="mt-4 grid gap-2">
              <div className="text-sm font-medium">Rutas Activas</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div>
                    <p className="font-medium">SJO-123 (Juan Pérez)</p>
                    <p className="text-xs text-muted-foreground">
                      Escazú → San Antonio de Belén • 12.5 km
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-blue-600">
                    45 km/h
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div>
                    <p className="font-medium">HER-456 (María García)</p>
                    <p className="text-xs text-muted-foreground">
                      Estación CNFL - Escazú • En carga
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    65% batería
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral con detalles */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Vehículos en Flota</div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {mockMapVehicles.map((vehicle) => {
                const config = stateConfig[vehicle.state];
                const Icon = config.icon;

                return (
                  <button
                    key={vehicle.id}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className={`w-full rounded-lg border p-3 text-left transition-all hover-elevate ${
                      selectedVehicle?.id === vehicle.id
                        ? "ring-2 ring-primary border-primary"
                        : ""
                    }`}
                    data-testid={`vehicle-panel-${vehicle.id}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="ml-10 space-y-1">
                      <Badge variant="secondary" className={config.bgColor}>
                        {config.label}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        <p>📍 {vehicle.lastUpdate}</p>
                        {vehicle.speed && <p>⚡ {vehicle.speed} km/h</p>}
                        {vehicle.battery && <p>🔋 {vehicle.battery}%</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botones de acción */}
            <div className="space-y-2 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                data-testid="button-view-routes"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Ver Todas las Rutas
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                data-testid="button-generate-report"
              >
                📊 Generar Reporte
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
