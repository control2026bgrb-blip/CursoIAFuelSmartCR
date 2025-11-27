import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FleetMap } from "./FleetMap";
import {
  Car,
  Users,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  Truck,
  Bus,
  Zap,
} from "lucide-react";

interface FleetVehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  driverInitials: string;
  status: "active" | "maintenance" | "idle" | "moving" | "charging" | "stopped" | "off" | "breakdown";
  efficiency: number;
  monthlySpend: number;
  alerts: number;
  icon: any;
  color: string;
}

interface FleetKPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

// todo: remove mock functionality - datos de Costa Rica
const mockFleetVehicles: FleetVehicle[] = [
  { id: "1", name: "Toyota Hilux", plate: "SJO-123", driver: "Juan Pérez", driverInitials: "JP", status: "active", efficiency: 85, monthlySpend: 245000, alerts: 0, icon: Truck, color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "2", name: "Hyundai H1", plate: "HER-456", driver: "María García", driverInitials: "MG", status: "active", efficiency: 72, monthlySpend: 380000, alerts: 1, icon: Bus, color: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "3", name: "Nissan NP300", plate: "ALA-789", driver: "David Mora", driverInitials: "DM", status: "maintenance", efficiency: 0, monthlySpend: 120000, alerts: 2, icon: Truck, color: "bg-gray-100 dark:bg-gray-800/50" },
  { id: "4", name: "BYD T3", plate: "CAR-012", driver: "Sara Solís", driverInitials: "SS", status: "active", efficiency: 92, monthlySpend: 85000, alerts: 0, icon: Zap, color: "bg-green-100 dark:bg-green-900/30" },
  { id: "5", name: "Mitsubishi L200", plate: "LIB-345", driver: "Miguel Rojas", driverInitials: "MR", status: "idle", efficiency: 65, monthlySpend: 290000, alerts: 1, icon: Truck, color: "bg-red-100 dark:bg-red-900/30" },
];

const mockKPIs: FleetKPI[] = [
  { label: "Total Vehículos", value: "12", change: "+2 este trimestre", trend: "up" },
  { label: "Costo Mensual", value: "₡2.1M", change: "-8% vs mes anterior", trend: "down" },
  { label: "Eficiencia Prom.", value: "78%", change: "+5% mejora", trend: "down" },
  { label: "Alertas Activas", value: "4", change: "2 críticas", trend: "up" },
];

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  idle: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
  moving: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  charging: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stopped: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  off: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  breakdown: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels = {
  active: "Activo",
  maintenance: "En Taller",
  idle: "Inactivo",
  moving: "En Movimiento",
  charging: "En Carga",
  stopped: "Detenido",
  off: "Apagado",
  breakdown: "Con Avería",
};

export function FleetDashboard() {
  return (
    <div className="space-y-6" data-testid="fleet-dashboard">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Flota</h2>
          <p className="text-sm text-muted-foreground">Monitorea y administra tu flota de vehículos en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-fleet-filter">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button data-testid="button-add-vehicle">
            <Car className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      <FleetMap />

      <div className="grid gap-4 md:grid-cols-6">
        {mockKPIs.map((kpi, index) => {
          const colors = [
            "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
            "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
            "bg-green-100 dark:bg-green-900/30 text-green-600",
            "bg-red-100 dark:bg-red-900/30 text-red-600",
          ];
          const color = colors[index] || "bg-muted";

          return (
            <Card key={index} className="hover-elevate" data-testid={`fleet-kpi-${index}`}>
              <CardContent className="p-4">
                <div className="flex flex-col items-start gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${color}`}>
                    {index === 0 && <Car className="h-5 w-5" />}
                    {index === 1 && <DollarSign className="h-5 w-5" />}
                    {index === 2 && <TrendingDown className="h-5 w-5" />}
                    {index === 3 && <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
                    <p className={`mt-1 text-xs ${kpi.trend === "down" ? "text-green-600" : "text-muted-foreground"}`}>
                      {kpi.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">Vehículos de Flota</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{mockFleetVehicles.length} vehículos</Badge>
              <Button size="sm" variant="ghost">
                <FileText className="mr-1 h-4 w-4" />
                Reporte Detallado
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-sm">
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Conductor</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Eficiencia</th>
                  <th className="px-4 py-3 font-medium">Gasto Mensual</th>
                  <th className="px-4 py-3 font-medium">Alertas</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockFleetVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover-elevate" data-testid={`fleet-vehicle-${vehicle.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-md ${vehicle.color}`}>
                          <vehicle.icon className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">{vehicle.driverInitials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{vehicle.driver}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={statusColors[vehicle.status]}>
                        {statusLabels[vehicle.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {vehicle.status !== "maintenance" ? (
                        <div className="flex items-center gap-2">
                          <Progress value={vehicle.efficiency} className="h-2 w-20" />
                          <span className="text-sm">{vehicle.efficiency}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">₡{vehicle.monthlySpend.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      {vehicle.alerts > 0 ? (
                        <Badge variant="destructive">{vehicle.alerts}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Ninguna</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
