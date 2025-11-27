import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Zap, Calendar } from "lucide-react";

interface Record {
  id: string;
  date: string;
  vehicle: string;
  type: "fuel" | "charge";
  amount: string;
  cost: string;
  location: string;
}

// todo: remove mock functionality
const mockRecords: Record[] = [
  {
    id: "1",
    date: "Nov 27, 2025",
    vehicle: "Toyota Camry",
    type: "fuel",
    amount: "45.2 L",
    cost: "$64.15",
    location: "Shell Station - Main St",
  },
  {
    id: "2",
    date: "Nov 25, 2025",
    vehicle: "Tesla Model 3",
    type: "charge",
    amount: "52 kWh",
    cost: "$18.20",
    location: "Tesla Supercharger",
  },
  {
    id: "3",
    date: "Nov 22, 2025",
    vehicle: "Toyota Camry",
    type: "fuel",
    amount: "38.7 L",
    cost: "$54.92",
    location: "Chevron - Oak Ave",
  },
  {
    id: "4",
    date: "Nov 20, 2025",
    vehicle: "Ford F-150",
    type: "fuel",
    amount: "68.5 L",
    cost: "$97.27",
    location: "Costco Gas",
  },
];

export function RecentRecords() {
  return (
    <Card data-testid="card-recent-records">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Records</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between gap-4 px-6 py-3 hover-elevate"
              data-testid={`record-${record.id}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${
                    record.type === "fuel"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-green-100 dark:bg-green-900/30"
                  }`}
                >
                  {record.type === "fuel" ? (
                    <Fuel className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{record.vehicle}</span>
                  <span className="text-xs text-muted-foreground">{record.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {record.amount}
                  </Badge>
                  <span className="font-medium">{record.cost}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{record.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
