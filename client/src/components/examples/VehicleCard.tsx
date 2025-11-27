import { VehicleCard } from "../VehicleCard";

export default function VehicleCardExample() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2">
      <VehicleCard
        name="Toyota Camry"
        plate="ABC-1234"
        type="gasoline"
        efficiency="8.2 L/100km"
        lastFill="2 days ago"
        isActive={true}
      />
      <VehicleCard
        name="Tesla Model 3"
        plate="EV-5678"
        type="electric"
        efficiency="15 kWh/100km"
        lastFill="Yesterday"
      />
      <VehicleCard
        name="Ford F-150"
        plate="TRK-9012"
        type="diesel"
        efficiency="10.5 L/100km"
        lastFill="5 days ago"
      />
      <VehicleCard
        name="Toyota Prius"
        plate="HYB-3456"
        type="hybrid"
        efficiency="4.8 L/100km"
        lastFill="1 week ago"
      />
    </div>
  );
}
