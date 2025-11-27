import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Star, Gift, Medal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  icon: LucideIcon;
  daysLeft?: number;
}

interface AchievementBadge {
  id: string;
  name: string;
  icon: LucideIcon;
  earned: boolean;
  color: string;
}

// todo: remove mock functionality
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Conductor Eco",
    description: "Mantén eficiencia debajo de 8L/100km",
    progress: 12,
    target: 15,
    reward: "50 puntos + Insignia",
    icon: Flame,
    daysLeft: 5,
  },
  {
    id: "2",
    title: "Registro Constante",
    description: "Registra combustible por 30 días consecutivos",
    progress: 22,
    target: 30,
    reward: "100 puntos",
    icon: Target,
    daysLeft: 8,
  },
];

const mockBadges: AchievementBadge[] = [
  { id: "1", name: "Primera Carga", icon: Star, earned: true, color: "text-yellow-500" },
  { id: "2", name: "Eco Maestro", icon: Flame, earned: true, color: "text-green-500" },
  { id: "3", name: "Líder Flota", icon: Trophy, earned: false, color: "text-purple-500" },
  { id: "4", name: "Top Ahorro", icon: Medal, earned: true, color: "text-blue-500" },
  { id: "5", name: "Madrugador", icon: Gift, earned: false, color: "text-pink-500" },
];

export function GamificationCard() {
  return (
    <div className="space-y-6" data-testid="gamification-section">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">Retos Activos</CardTitle>
            <Badge variant="secondary">2 Activos</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-md border p-4 hover-elevate"
              data-testid={`challenge-${challenge.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <challenge.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    {challenge.daysLeft && (
                      <Badge variant="outline" className="shrink-0">
                        {challenge.daysLeft}d restantes
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Progreso: {challenge.progress}/{challenge.target}
                      </span>
                      <span className="font-medium text-primary">{challenge.reward}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">Tus Insignias</CardTitle>
            <span className="text-sm text-muted-foreground">
              {mockBadges.filter((b) => b.earned).length}/{mockBadges.length} obtenidas
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {mockBadges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 rounded-md border p-3 ${
                  badge.earned ? "bg-card" : "bg-muted/50 opacity-50"
                }`}
                data-testid={`badge-${badge.id}`}
              >
                <badge.icon className={`h-6 w-6 ${badge.earned ? badge.color : "text-muted-foreground"}`} />
                <span className="text-xs font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
