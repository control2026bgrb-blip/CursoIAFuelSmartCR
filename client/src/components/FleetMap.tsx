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

// Área de San José, Costa Rica - coordenadas reales
const MAP_BOUNDS = {
  north: 9.975,
  south: 9.890,
  east: -84.050,
  west: -84.150,
};

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

  // Actualización en tiempo real - cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => {
          // Vehículos en movimiento se mueven en patrones realistas
          if (vehicle.state === "moving") {
            // Movimiento más realista con dirección
            const direction = parseInt(vehicle.id) % 4;
            let latChange = 0;
            let lngChange = 0;

            switch (direction) {
              case 0:
                latChange = 0.0008;
                lngChange = 0.0005;
                break;
              case 1:
                latChange = -0.0008;
                lngChange = 0.0005;
                break;
              case 2:
                latChange = 0.0008;
                lngChange = -0.0005;
                break;
              case 3:
                latChange = -0.0008;
                lngChange = -0.0005;
                break;
            }

            // Agregar algo de aleatoriedad
            latChange += (Math.random() - 0.5) * 0.0003;
            lngChange += (Math.random() - 0.5) * 0.0003;

            // Mantener dentro de límites
            let newLat = vehicle.lat + latChange;
            let newLng = vehicle.lng + lngChange;

            if (newLat > MAP_BOUNDS.north) newLat = MAP_BOUNDS.south;
            if (newLat < MAP_BOUNDS.south) newLat = MAP_BOUNDS.north;
            if (newLng < MAP_BOUNDS.west) newLng = MAP_BOUNDS.east;
            if (newLng > MAP_BOUNDS.east) newLng = MAP_BOUNDS.west;

            const speedVariation = Math.max(
              30,
              Math.min(75, (vehicle.speed || 45) + (Math.random() - 0.5) * 15)
            );

            return {
              ...vehicle,
              lat: newLat,
              lng: newLng,
              speed: Math.round(speedVariation),
            };
          }

          // Vehículos en carga aumentan batería lentamente
          if (vehicle.state === "charging" && vehicle.battery !== undefined) {
            const newBattery = Math.min(100, vehicle.battery + Math.random() * 3);
            return {
              ...vehicle,
              battery: Math.round(newBattery),
            };
          }

          return vehicle;
        })
      );

      setLastUpdateTime(new Date().toLocaleTimeString("es-CR"));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleVehicleSelect = useCallback((vehicle: MapVehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleRefresh = () => {
    setVehicles(initialVehicles);
    setLastUpdateTime(new Date().toLocaleTimeString("es-CR"));
  };

  // Convertir coordenadas a posición en el mapa (0-100%)
  const getMapPosition = (lat: number, lng: number) => {
    const latPercent =
      ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
    const lngPercent =
      ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
    return { top: latPercent, left: lngPercent };
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
          {/* Mapa con vehículos simulados */}
          <div className="lg:col-span-3 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
            {/* Contenedor del mapa */}
            <div className="relative w-full rounded-md overflow-hidden border shadow-sm mb-4 bg-white dark:bg-slate-900">
              {/* Fondo del mapa con patrón de grid */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-950 dark:to-cyan-950">
                  <div className="absolute inset-0 grid grid-cols-20 grid-rows-15 opacity-20">
                    {Array.from({ length: 300 }).map((_, i) => (
                      <div key={i} className="border border-slate-300 dark:border-slate-700" />
                    ))}
                  </div>
                  {/* Carreteras simuladas */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-30"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 40 Q 50 35 100 40" stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-400" />
                    <path d="M 30 0 L 35 100" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-gray-400" />
                    <path d="M 70 0 L 65 100" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-gray-400" />
                  </svg>

                  {/* Marcadores de estaciones de carga */}
                  <div className="absolute top-1/4 left-1/3 w-6 h-6 rounded-full border-2 border-green-500 bg-green-100/50 flex items-center justify-center text-xs opacity-60">
                    <Zap className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full border-2 border-green-500 bg-green-100/50 flex items-center justify-center text-xs opacity-60">
                    <Zap className="w-3 h-3 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Vehículos en el mapa */}
              <div className="relative w-full h-96">
                {vehicles.map((vehicle) => {
                  const pos = getMapPosition(vehicle.lat, vehicle.lng);
                  const config = stateConfig[vehicle.state];
                  const Icon = config.icon;

                  return (
                    <div
                      key={vehicle.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                      }}
                      data-testid={`map-marker-${vehicle.id}`}
                    >
                      {/* Pulso de animación */}
                      <div
                        className={`absolute inset-0 rounded-full opacity-50 animate-pulse ${config.bgColor}`}
                        style={{ width: "32px", height: "32px", transform: "translate(-50%, -50%)" }}
                      />
                      {/* Marcador principal */}
                      <button
                        onClick={() => handleVehicleSelect(vehicle)}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg transition-all hover-elevate cursor-pointer ${
                          config.bgColor
                        } ${
                          selectedVehicle?.id === vehicle.id
                            ? "ring-4 ring-primary scale-125"
                            : "hover:scale-110"
                        }`}
                        title={`${vehicle.name} - ${vehicle.plate}`}
                      >
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </button>
                      {/* Etiqueta del vehículo */}
                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {vehicle.plate}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Información de zoom y ubicación */}
              <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded">
                <p className="font-medium">San José, Costa Rica</p>
                <p>GPS: Tiempo Real</p>
              </div>
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
                            📍 {vehicle.lat.toFixed(4)}°, {vehicle.lng.toFixed(4)}°
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
                          📍 {vehicle.lat.toFixed(4)}°N, {vehicle.lng.toFixed(4)}°E
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
