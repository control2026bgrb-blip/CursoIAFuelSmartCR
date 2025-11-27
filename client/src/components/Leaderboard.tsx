import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  initials: string;
  points: number;
  ecoScore: number;
  rank: number;
}

// todo: remove mock functionality - datos de Costa Rica
const mockLeaderboard: LeaderboardUser[] = [
  { id: "1", name: "María Fernández", initials: "MF", points: 2450, ecoScore: 92, rank: 1 },
  { id: "2", name: "José Vargas", initials: "JV", points: 2280, ecoScore: 88, rank: 2 },
  { id: "3", name: "Ana Solano", initials: "AS", points: 2150, ecoScore: 85, rank: 3 },
  { id: "4", name: "Carlos Rodríguez", initials: "CR", points: 1980, ecoScore: 78, rank: 4 },
  { id: "5", name: "Laura Jiménez", initials: "LJ", points: 1850, ecoScore: 75, rank: 5 },
];

const rankIcons = {
  1: <Trophy className="h-5 w-5 text-yellow-500" />,
  2: <Medal className="h-5 w-5 text-gray-400" />,
  3: <Award className="h-5 w-5 text-amber-600" />,
};

export function Leaderboard() {
  return (
    <Card data-testid="leaderboard">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">Top Conductores Eco</CardTitle>
          <Badge variant="outline">Este Mes</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockLeaderboard.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between gap-4 px-6 py-3 ${
                user.rank === 4 ? "bg-primary/5" : ""
              } hover-elevate`}
              data-testid={`leaderboard-user-${user.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center">
                  {rankIcons[user.rank as keyof typeof rankIcons] || (
                    <span className="text-sm font-medium text-muted-foreground">#{user.rank}</span>
                  )}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className={user.rank === 4 ? "bg-primary text-primary-foreground" : ""}>
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.name}
                    {user.rank === 4 && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        Tú
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">Eco Score: {user.ecoScore}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-primary">{user.points.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground"> pts</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
