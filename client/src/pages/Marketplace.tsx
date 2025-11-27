import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { Search, MapPin, SlidersHorizontal, Navigation } from "lucide-react";

// todo: remove mock functionality
const nearbyStations = [
  { id: "1", name: "Shell - Main Street", price: "$1.35/L", distance: "0.8 km", rating: 4.5 },
  { id: "2", name: "Chevron - Oak Avenue", price: "$1.38/L", distance: "1.2 km", rating: 4.3 },
  { id: "3", name: "Costco Gas", price: "$1.29/L", distance: "3.5 km", rating: 4.7 },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 p-6" data-testid="page-marketplace">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Find deals, stations, and services near you</p>
        </div>
        <Button variant="outline" data-testid="button-filter-marketplace">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stations, workshops, or offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-marketplace-search"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MarketplaceCard />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-medium">Nearby Stations</CardTitle>
                <Badge variant="outline">
                  <MapPin className="mr-1 h-3 w-3" />
                  3 found
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyStations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between gap-2 rounded-md border p-3 hover-elevate cursor-pointer"
                  data-testid={`station-${station.id}`}
                >
                  <div>
                    <p className="text-sm font-medium">{station.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{station.distance}</span>
                      <span>•</span>
                      <span className="text-yellow-600">{station.rating} stars</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{station.price}</p>
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      <Navigation className="mr-1 h-3 w-3" />
                      Go
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Price Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average in your area</span>
                  <span className="font-semibold">$1.42/L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lowest nearby</span>
                  <span className="font-semibold text-green-600">$1.29/L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly trend</span>
                  <Badge variant="secondary" className="text-green-600">
                    -2.3%
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Prices typically drop on Tuesdays and Wednesdays. Consider timing your fill-ups accordingly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
