import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ConsumptionChart } from "@/components/ConsumptionChart";
import { VehicleCard } from "@/components/VehicleCard";
import { RecentRecords } from "@/components/RecentRecords";
import { EcoScoreCard } from "@/components/EcoScoreCard";
import { AddRecordModal } from "@/components/AddRecordModal";
import { Fuel, DollarSign, Gauge, Leaf } from "lucide-react";

// todo: remove mock functionality - datos de Costa Rica
const mockVehicles = [
  { name: "Toyota Corolla", plate: "SJO-123", type: "gasoline" as const, efficiency: "8.2 L/100km", lastFill: "Hace 2 días" },
  { name: "BYD Dolphin", plate: "HER-456", type: "electric" as const, efficiency: "15 kWh/100km", lastFill: "Ayer" },
];

export default function Dashboard() {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0].plate);

  return (
    <div className="space-y-6 p-6" data-testid="page-dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel Principal</h1>
          <p className="text-muted-foreground">Monitorea el consumo de energía de tus vehículos</p>
        </div>
        <Button onClick={() => setShowAddRecord(true)} data-testid="button-add-record">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Registro
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Consumo Mensual"
          value="245.8 L"
          subtitle="Noviembre 2025"
          trend="down"
          trendValue="12% vs mes anterior"
          icon={Fuel}
        />
        <StatCard
          title="Precio Promedio"
          value="₡700/L"
          subtitle="Últimos 30 días"
          trend="up"
          trendValue="3% aumento"
          icon={DollarSign}
        />
        <StatCard
          title="Eficiencia"
          value="8.2 L/100km"
          subtitle="Promedio actual"
          trend="down"
          trendValue="5% mejora"
          icon={Gauge}
        />
        <StatCard
          title="Gasto Mensual"
          value="₡172,060"
          subtitle="Este mes"
          trend="down"
          trendValue="8% ahorro"
          icon={Leaf}
          iconColor="text-green-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ConsumptionChart />
          <RecentRecords />
        </div>
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-semibold">Mis Vehículos</h2>
              <Button size="sm" variant="outline" data-testid="button-add-vehicle">
                <Car className="mr-1 h-4 w-4" />
                Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {mockVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.plate}
                  {...vehicle}
                  isActive={selectedVehicle === vehicle.plate}
                  onSelect={() => setSelectedVehicle(vehicle.plate)}
                />
              ))}
            </div>
          </div>
          <EcoScoreCard />
        </div>
      </div>

      <AddRecordModal open={showAddRecord} onOpenChange={setShowAddRecord} />
    </div>
  );
}
