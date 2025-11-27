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

// todo: remove mock functionality
const mockOffers: Offer[] = [
  {
    id: "1",
    title: "10% Off on Premium Fuel",
    business: "Shell - Main Street",
    discount: "10% OFF",
    description: "Valid on all premium fuel purchases over 30L",
    rating: 4.5,
    distance: "0.8 km",
    expires: "Ends in 3 days",
    type: "station",
  },
  {
    id: "2",
    title: "Free Oil Check",
    business: "AutoCare Plus",
    discount: "FREE",
    description: "Complimentary oil level check with any service",
    rating: 4.8,
    distance: "1.2 km",
    type: "workshop",
  },
  {
    id: "3",
    title: "50% Off First Charge",
    business: "GreenCharge Network",
    discount: "50% OFF",
    description: "For new users at any GreenCharge station",
    rating: 4.6,
    distance: "2.5 km",
    expires: "Limited time",
    type: "charge",
  },
  {
    id: "4",
    title: "Loyalty Bonus: 200 Points",
    business: "Chevron",
    discount: "+200 PTS",
    description: "Earn bonus points on your next fill-up",
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
          <CardTitle className="text-base font-medium">Marketplace & Offers</CardTitle>
          <Badge variant="secondary">
            <Percent className="mr-1 h-3 w-3" />
            {mockOffers.length} offers
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="all" data-testid="tab-all-offers">All</TabsTrigger>
            <TabsTrigger value="stations" data-testid="tab-stations">Stations</TabsTrigger>
            <TabsTrigger value="workshops" data-testid="tab-workshops">Workshops</TabsTrigger>
            <TabsTrigger value="charging" data-testid="tab-charging">Charging</TabsTrigger>
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
              Showing fuel station offers only
            </p>
          </TabsContent>

          <TabsContent value="workshops" className="mt-0">
            <p className="py-8 text-center text-sm text-muted-foreground">
              Showing workshop offers only
            </p>
          </TabsContent>

          <TabsContent value="charging" className="mt-0">
            <p className="py-8 text-center text-sm text-muted-foreground">
              Showing EV charging offers only
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
