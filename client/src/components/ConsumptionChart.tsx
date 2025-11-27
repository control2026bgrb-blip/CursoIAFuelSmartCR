import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// todo: remove mock functionality
const mockData = [
  { month: "Jan", consumption: 180, cost: 256 },
  { month: "Feb", consumption: 165, cost: 235 },
  { month: "Mar", consumption: 190, cost: 270 },
  { month: "Apr", consumption: 175, cost: 249 },
  { month: "May", consumption: 200, cost: 284 },
  { month: "Jun", consumption: 185, cost: 263 },
  { month: "Jul", consumption: 210, cost: 299 },
  { month: "Aug", consumption: 195, cost: 277 },
  { month: "Sep", consumption: 170, cost: 242 },
  { month: "Oct", consumption: 220, cost: 313 },
  { month: "Nov", consumption: 205, cost: 292 },
  { month: "Dec", consumption: 246, cost: 350 },
];

export function ConsumptionChart() {
  return (
    <Card data-testid="chart-consumption">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fuel Consumption Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162, 72%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162, 72%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="hsl(162, 72%, 45%)"
                strokeWidth={2}
                fill="url(#colorConsumption)"
                name="Consumption (L)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
