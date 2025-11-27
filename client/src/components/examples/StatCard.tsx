import { StatCard } from "../StatCard";
import { Fuel, DollarSign, Gauge, Leaf } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <StatCard
        title="Monthly Consumption"
        value="245.8 L"
        subtitle="This month"
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
        title="Eco Score"
        value="78/100"
        subtitle="Good"
        trend="up"
        trendValue="+5 points"
        icon={Leaf}
        iconColor="text-green-600"
      />
    </div>
  );
}
