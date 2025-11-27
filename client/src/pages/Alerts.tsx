import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertsPanel } from "@/components/AlertsPanel";
import { AlertTriangle, Bell, Wrench, TrendingDown, Lightbulb } from "lucide-react";

// todo: remove mock functionality
const alertPreferences = [
  { id: "anomalies", label: "Consumption Anomalies", description: "Alert when fuel usage is unusually high", enabled: true, icon: AlertTriangle },
  { id: "maintenance", label: "Maintenance Reminders", description: "Get notified about upcoming service needs", enabled: true, icon: Wrench },
  { id: "prices", label: "Price Alerts", description: "Notify when fuel prices drop nearby", enabled: true, icon: TrendingDown },
  { id: "tips", label: "Eco-Driving Tips", description: "Receive suggestions to improve efficiency", enabled: false, icon: Lightbulb },
];

export default function Alerts() {
  return (
    <div className="space-y-6 p-6" data-testid="page-alerts">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Predictive Alerts</h1>
          <p className="text-muted-foreground">AI-powered insights and recommendations</p>
        </div>
        <Button variant="outline" data-testid="button-mark-all-read">
          <Bell className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsPanel />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Alert Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alertPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-start justify-between gap-4"
                  data-testid={`pref-${pref.id}`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
                      <pref.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={pref.id} className="text-sm font-medium cursor-pointer">
                        {pref.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                  </div>
                  <Switch id={pref.id} defaultChecked={pref.enabled} data-testid={`switch-${pref.id}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-primary/10 p-3">
                <p className="text-sm font-medium text-primary">Best Time to Fill Up</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fuel prices typically drop on Tuesdays. Consider filling up tomorrow for potential savings of $0.05/L.
                </p>
              </div>
              <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Route Optimization</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Taking Highway 101 instead of Route 5 could save 15% fuel on your daily commute.
                </p>
              </div>
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Driving Pattern</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reducing rapid acceleration by 20% could improve your fuel efficiency by 8%.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
