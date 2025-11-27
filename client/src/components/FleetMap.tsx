import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertCircle, Zap, PauseCircle, Power, RefreshCw } from "lucide-react";
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

// Ubicaciones iniciales en San José, Costa Rica
const initialVehicles: MapVehicle[] = [
  {
    id: "1",
    name: "Toyota Hilux",
    plate: "SJO-123",
    driver: "Juan Pérez",
    lat: 9.9281,
    lng: -84.0907,
    state: "moving",
    speed: 45,
    lastUpdate: "Ahora",
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
    lastUpdate: "Ahora",
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
  const [vehicles, setVehicles] = useState<MapVehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<MapVehicle | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(
    new Date().toLocaleTimeString("es-CR")
  );

  // Actualización en tiempo real - cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => {
          // Vehículos en movimiento se mueven ligeramente
          if (vehicle.state === "moving") {
            const latChange = (Math.random() - 0.5) * 0.001;
            const lngChange = (Math.random() - 0.5) * 0.001;
            const speedVariation = Math.max(
              30,
              Math.min(60, (vehicle.speed || 45) + (Math.random() - 0.5) * 10)
            );

            return {
              ...vehicle,
              lat: vehicle.lat + latChange,
              lng: vehicle.lng + lngChange,
              speed: Math.round(speedVariation),
            };
          }

          // Vehículos en carga pueden aumentar batería
          if (vehicle.state === "charging" && vehicle.battery !== undefined) {
            const newBattery = Math.min(100, vehicle.battery + Math.random() * 5);
            return {
              ...vehicle,
              battery: Math.round(newBattery),
            };
          }

          return vehicle;
        })
      );

      setLastUpdateTime(new Date().toLocaleTimeString("es-CR"));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleVehicleSelect = useCallback((vehicle: MapVehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleRefresh = () => {
    setVehicles(initialVehicles);
    setLastUpdateTime(new Date().toLocaleTimeString("es-CR"));
  };

  return (
    <Card className="col-span-full" data-testid="fleet-map">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa de Flota en Tiempo Real
            </CardTitle>
            <span className="text-xs text-muted-foreground ml-2">
              Actualizado: {lastUpdateTime}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            data-testid="button-refresh-map"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Mapa */}
          <div className="lg:col-span-3 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
            {/* Contenedor del mapa con iframe de Google Maps */}
            <div className="w-full rounded-md overflow-hidden border shadow-sm mb-4">
              <iframe
                width="100%"
                height="500"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62887.92905151252!2d-84.10963784863279!3d9.92846000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e3a6000001cd%3A0x800917dfaa1c6cc!2sSan%20Jos%C3%A9%2C%20Costa%20Rica!5e0!3m2!1ses!2scr!4v1234567890`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Información de rutas activas */}
            <div className="grid gap-2">
              <div className="text-sm font-medium">Rutas Activas - En Tiempo Real</div>
              <div className="space-y-2">
                {vehicles
                  .filter((v) => v.state === "moving" || v.state === "charging")
                  .map((vehicle) => {
                    const config = stateConfig[vehicle.state];
                    return (
                      <div
                        key={vehicle.id}
                        className="flex items-center justify-between rounded-md border p-2 text-sm hover-elevate"
                        data-testid={`route-${vehicle.id}`}
                      >
                        <div>
                          <p className="font-medium">
                            {vehicle.plate} ({vehicle.driver})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.state === "moving"
                              ? `Ubicación: ${vehicle.lat.toFixed(4)}°, ${vehicle.lng.toFixed(4)}°`
                              : "En estación de carga"}
                          </p>
                        </div>
                        <Badge variant="secondary" className={config.bgColor}>
                          {vehicle.speed
                            ? `${vehicle.speed} km/h`
                            : `${vehicle.battery}% batería`}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Leyenda de estados */}
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="text-xs font-medium mb-2">Estados de Vehículos:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(stateConfig).map(([state, config]) => (
                  <div key={state} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${config.bgColor}`} />
                    <span>{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral con detalles en tiempo real */}
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Vehículos en Flota ({vehicles.length})
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {vehicles.map((vehicle) => {
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
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${config.bgColor} flex-shrink-0`}>
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
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          📍 {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                        </p>
                        {vehicle.speed && (
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            ⚡ {vehicle.speed} km/h
                          </p>
                        )}
                        {vehicle.battery !== undefined && (
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            🔋 {vehicle.battery}%
                          </p>
                        )}
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
