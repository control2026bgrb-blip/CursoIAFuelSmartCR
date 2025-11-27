import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Fuel,
  Wrench,
  Zap,
  Percent,
  MapPin,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";

interface Offer {
  id: string;
  title: string;
  business: string;
  discount: string;
  description: string;
  rating: number;
  distance: string;
  expires?: string;
  type: "station" | "workshop" | "charge";
}

// todo: remove mock functionality - datos de Costa Rica
const mockOffers: Offer[] = [
  {
    id: "1",
    title: "10% Descuento en Súper",
    business: "Gasolinera Delta - Escazú",
    discount: "10% DESC",
    description: "Válido en compras de combustible súper mayores a 30L",
    rating: 4.5,
    distance: "0.8 km",
    expires: "Termina en 3 días",
    type: "station",
  },
  {
    id: "2",
    title: "Revisión de Aceite Gratis",
    business: "Taller AutoTico - San José",
    discount: "GRATIS",
    description: "Revisión de nivel de aceite con cualquier servicio",
    rating: 4.8,
    distance: "1.2 km",
    type: "workshop",
  },
  {
    id: "3",
    title: "50% Primera Carga",
    business: "Estación CNFL - Heredia",
    discount: "50% DESC",
    description: "Para nuevos usuarios en cualquier estación CNFL",
    rating: 4.6,
    distance: "2.5 km",
    expires: "Tiempo limitado",
    type: "charge",
  },
  {
    id: "4",
    title: "Bono Lealtad: 200 Puntos",
    business: "Gasolinera Uno - Alajuela",
    discount: "+200 PTS",
    description: "Gana puntos extra en tu próxima carga",
    rating: 4.3,
    distance: "3.1 km",
    type: "station",
  },
];

const typeIcons = {
  station: Fuel,
  workshop: Wrench,
  charge: Zap,
};

const typeColors = {
  station: "text-amber-500",
  workshop: "text-blue-500",
  charge: "text-green-500",
};

export function MarketplaceCard() {
  return (
    <Card data-testid="marketplace-section">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">Marketplace y Ofertas</CardTitle>
          <Badge variant="secondary">
            <Percent className="mr-1 h-3 w-3" />
            {mockOffers.length} ofertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="all" data-testid="tab-all-offers">Todas</TabsTrigger>
            <TabsTrigger value="stations" data-testid="tab-stations">Gasolineras</TabsTrigger>
            <TabsTrigger value="workshops" data-testid="tab-workshops">Talleres</TabsTrigger>
            <TabsTrigger value="charging" data-testid="tab-charging">Carga EV</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-0">
            {mockOffers.map((offer) => {
              const Icon = typeIcons[offer.type];
              return (
                <div
                  key={offer.id}
                  className="flex items-start gap-3 rounded-md border p-4 hover-elevate cursor-pointer"
                  data-testid={`offer-${offer.id}`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent ${typeColors[offer.type]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{offer.title}</h4>
                        <p className="text-sm text-muted-foreground">{offer.business}</p>
                      </div>
                      <Badge className="shrink-0 bg-primary text-primary-foreground">{offer.discount}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{offer.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{offer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{offer.distance}</span>
                      </div>
                      {offer.expires && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{offer.expires}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="stations" className="mt-0">
            <p className="py-8 text-center text-sm text-muted-foreground">
              Mostrando solo ofertas de gasolineras
            </p>
          </TabsContent>

          <TabsContent value="workshops" className="mt-0">
            <p className="py-8 text-center text-sm text-muted-foreground">
              Mostrando solo ofertas de talleres
            </p>
          </TabsContent>

          <TabsContent value="charging" className="mt-0">
            <p className="py-8 text-center text-sm text-muted-foreground">
              Mostrando solo ofertas de carga eléctrica
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
