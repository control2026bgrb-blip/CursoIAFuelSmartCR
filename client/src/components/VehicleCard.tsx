import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Fuel, Gauge, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleCardProps {
  name: string;
  plate: string;
  type: "gasoline" | "diesel" | "electric" | "hybrid";
  efficiency: string;
  lastFill?: string;
  isActive?: boolean;
  onSelect?: () => void;
}

const fuelTypeLabels = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  electric: "Eléctrico",
  hybrid: "Híbrido",
};

const fuelTypeColors = {
  gasoline: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  diesel: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300",
  electric: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  hybrid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export function VehicleCard({
  name,
  plate,
  type,
  efficiency,
  lastFill,
  isActive,
  onSelect,
}: VehicleCardProps) {
  return (
    <Card
      className={`hover-elevate cursor-pointer ${isActive ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
      data-testid={`vehicle-card-${plate}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
              <Car className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              <span className="text-sm text-muted-foreground">{plate}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" data-testid="button-vehicle-menu">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Ver Historial</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={fuelTypeColors[type]}>
            <Fuel className="mr-1 h-3 w-3" />
            {fuelTypeLabels[type]}
          </Badge>
          <Badge variant="outline">
            <Gauge className="mr-1 h-3 w-3" />
            {efficiency}
          </Badge>
        </div>
        {lastFill && (
          <p className="mt-3 text-xs text-muted-foreground">Última carga: {lastFill}</p>
        )}
      </CardContent>
    </Card>
  );
}
