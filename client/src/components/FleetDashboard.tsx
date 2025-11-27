import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Car,
  Users,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FileText,
  Download,
  Filter,
} from "lucide-react";

interface FleetVehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  driverInitials: string;
  status: "active" | "maintenance" | "idle";
  efficiency: number;
  monthlySpend: number;
  alerts: number;
}

interface FleetKPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

// todo: remove mock functionality
const mockFleetVehicles: FleetVehicle[] = [
  { id: "1", name: "Toyota Camry", plate: "FLT-001", driver: "John Smith", driverInitials: "JS", status: "active", efficiency: 85, monthlySpend: 245, alerts: 0 },
  { id: "2", name: "Ford Transit", plate: "FLT-002", driver: "Maria Garcia", driverInitials: "MG", status: "active", efficiency: 72, monthlySpend: 380, alerts: 1 },
  { id: "3", name: "Honda Accord", plate: "FLT-003", driver: "David Lee", driverInitials: "DL", status: "maintenance", efficiency: 0, monthlySpend: 120, alerts: 2 },
  { id: "4", name: "Chevrolet Bolt", plate: "FLT-004", driver: "Sarah Chen", driverInitials: "SC", status: "active", efficiency: 92, monthlySpend: 85, alerts: 0 },
  { id: "5", name: "Ford F-150", plate: "FLT-005", driver: "Mike Johnson", driverInitials: "MJ", status: "idle", efficiency: 65, monthlySpend: 290, alerts: 1 },
];

const mockKPIs: FleetKPI[] = [
  { label: "Total Vehicles", value: "12", change: "+2 this quarter", trend: "up" },
  { label: "Monthly Fuel Cost", value: "$4,280", change: "-8% vs last month", trend: "down" },
  { label: "Avg Efficiency", value: "78%", change: "+5% improvement", trend: "down" },
  { label: "Active Alerts", value: "4", change: "2 critical", trend: "up" },
];

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  idle: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
};

export function FleetDashboard() {
  return (
    <div className="space-y-6" data-testid="fleet-dashboard">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Fleet Management</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage your vehicle fleet</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-fleet-filter">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button data-testid="button-add-vehicle">
            <Car className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {mockKPIs.map((kpi, index) => (
          <Card key={index} className="hover-elevate" data-testid={`fleet-kpi-${index}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
                  <p className={`mt-1 text-xs ${kpi.trend === "down" ? "text-green-600" : "text-muted-foreground"}`}>
                    {kpi.change}
                  </p>
                </div>
                {index === 0 && <Car className="h-5 w-5 text-muted-foreground" />}
                {index === 1 && <DollarSign className="h-5 w-5 text-muted-foreground" />}
                {index === 2 && <TrendingDown className="h-5 w-5 text-green-500" />}
                {index === 3 && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">Fleet Vehicles</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{mockFleetVehicles.length} vehicles</Badge>
              <Button size="sm" variant="ghost">
                <FileText className="mr-1 h-4 w-4" />
                Detailed Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-sm">
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Efficiency</th>
                  <th className="px-4 py-3 font-medium">Monthly Spend</th>
                  <th className="px-4 py-3 font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockFleetVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover-elevate" data-testid={`fleet-vehicle-${vehicle.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
                          <Car className="h-4 w-4 text-accent-foreground" />
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
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
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
                      <span className="font-medium">${vehicle.monthlySpend}</span>
                    </td>
                    <td className="px-4 py-3">
                      {vehicle.alerts > 0 ? (
                        <Badge variant="destructive">{vehicle.alerts}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
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
