import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertCircle, Zap, PauseCircle, Power, RefreshCw } from "lucide-react";
import hiluxImg from "@assets/generated_images/white_toyota_hilux_pickup_truck.png";
import hyundaiImg from "@assets/generated_images/silver_hyundai_h1_minibus_van.png";
import nissanImg from "@assets/generated_images/gray_nissan_np300_pickup_truck.png";
import bydImg from "@assets/generated_images/blue_byd_t3_electric_vehicle.png";
import mitsubishiImg from "@assets/generated_images/red_mitsubishi_l200_pickup_truck.png";
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
  image: string;
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
    image: hiluxImg,
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
    image: hyundaiImg,
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
    image: nissanImg,
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
    image: bydImg,
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
    image: mitsubishiImg,
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

            latChange += (Math.random() - 0.5) * 0.0003;
            lngChange += (Math.random() - 0.5) * 0.0003;

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

  // Convertir coordenadas GPS a posición porcentual en el iframe
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
          {/* Mapa con vehículos superpuestos */}
          <div className="lg:col-span-3 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
            {/* Contenedor del mapa con Google Maps */}
            <div className="relative w-full rounded-md overflow-hidden border shadow-sm mb-4">
              {/* Google Maps iframe */}
              <iframe
                width="100%"
                height="500"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62887.92905151252!2d-84.10963784863279!3d9.92846000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e3a6000001cd%3A0x800917dfaa1c6cc!2sSan%20Jos%C3%A9%2C%20Costa%20Rica!5e0!3m2!1ses!2scr!4v1234567890`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Marcadores superpuestos en tiempo real */}
              <div className="absolute inset-0 pointer-events-none">
                {vehicles.map((vehicle) => {
                  const pos = getMapPosition(vehicle.lat, vehicle.lng);
                  const config = stateConfig[vehicle.state];
                  const Icon = config.icon;

                  return (
                    <button
                      key={vehicle.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVehicleSelect(vehicle);
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-auto"
                      style={{
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                      }}
                      data-testid={`map-marker-${vehicle.id}`}
                    >
                      {/* Pulso de animación */}
                      <div
                        className={`absolute inset-0 rounded-full opacity-50 animate-pulse ${config.bgColor}`}
                        style={{
                          width: "32px",
                          height: "32px",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                      {/* Marcador principal */}
                      <div
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg hover-elevate cursor-pointer ${config.bgColor} ${
                          selectedVehicle?.id === vehicle.id
                            ? "ring-4 ring-primary scale-125"
                            : "hover:scale-110"
                        }`}
                        title={`${vehicle.name} - ${vehicle.plate}`}
                      >
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                    </button>
                  );
                })}
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
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="h-12 w-12 rounded-md object-cover border border-border flex-shrink-0"
                        data-testid={`map-vehicle-image-${vehicle.id}`}
                      />
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
