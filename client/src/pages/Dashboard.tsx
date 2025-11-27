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

// todo: remove mock functionality
const mockVehicles = [
  { name: "Toyota Camry", plate: "ABC-1234", type: "gasoline" as const, efficiency: "8.2 L/100km", lastFill: "2 days ago" },
  { name: "Tesla Model 3", plate: "EV-5678", type: "electric" as const, efficiency: "15 kWh/100km", lastFill: "Yesterday" },
];

export default function Dashboard() {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0].plate);

  return (
    <div className="space-y-6 p-6" data-testid="page-dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your vehicle energy consumption</p>
        </div>
        <Button onClick={() => setShowAddRecord(true)} data-testid="button-add-record">
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Consumption"
          value="245.8 L"
          subtitle="November 2025"
          trend="down"
          trendValue="12% vs last month"
          icon={Fuel}
        />
        <StatCard
          title="Average Cost"
          value="$1.42/L"
          subtitle="Last 30 days"
          trend="up"
          trendValue="3% increase"
          icon={DollarSign}
        />
        <StatCard
          title="Fuel Efficiency"
          value="8.2 L/100km"
          subtitle="Current average"
          trend="down"
          trendValue="5% improvement"
          icon={Gauge}
        />
        <StatCard
          title="Monthly Spend"
          value="$349.04"
          subtitle="This month"
          trend="down"
          trendValue="8% savings"
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
              <h2 className="font-semibold">My Vehicles</h2>
              <Button size="sm" variant="outline" data-testid="button-add-vehicle">
                <Car className="mr-1 h-4 w-4" />
                Add
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
