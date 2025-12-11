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

// todo: remove mock functionality - datos de Costa Rica
const mockRecords: Record[] = [
  {
    id: "1",
    date: "27 Nov, 2025",
    vehicle: "Toyota Corolla",
    type: "fuel",
    amount: "45.2 L",
    cost: "₡31,640",
    location: "Gasolinera Delta - San José",
  },
  {
    id: "2",
    date: "25 Nov, 2025",
    vehicle: "BYD Dolphin",
    type: "charge",
    amount: "52 kWh",
    cost: "₡8,840",
    location: "Estación CNFL - Escazú",
  },
  {
    id: "3",
    date: "22 Nov, 2025",
    vehicle: "Toyota Corolla",
    type: "fuel",
    amount: "38.7 L",
    cost: "₡27,090",
    location: "Gasolinera Uno - Heredia",
  },
  {
    id: "4",
    date: "20 Nov, 2025",
    vehicle: "Mitsubishi L200",
    type: "fuel",
    amount: "68.5 L",
    cost: "₡47,950",
    location: "Total - Alajuela",
  },
];
export function RecentRecords() {
  return (
    <Card data-testid="card-recent-records">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Registros Recientes</CardTitle>
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
