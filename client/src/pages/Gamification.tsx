import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GamificationCard } from "@/components/GamificationCard";
import { Leaderboard } from "@/components/Leaderboard";
import { Trophy, Gift, Star, Zap } from "lucide-react";

// todo: remove mock functionality
const userStats = {
  totalPoints: 1980,
  level: 12,
  nextLevel: 2000,
  streak: 15,
};

const rewards = [
  { id: "1", name: "10% Off Premium Fuel", points: 500, available: true },
  { id: "2", name: "Free Oil Change", points: 1500, available: true },
  { id: "3", name: "Car Wash Voucher", points: 300, available: true },
];

export default function Gamification() {
  return (
    <div className="space-y-6 p-6" data-testid="page-gamification">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gamification</h1>
          <p className="text-muted-foreground">Earn rewards by driving efficiently</p>
        </div>
        <Badge className="w-fit gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Star className="h-3 w-3" />
          Level {userStats.level}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-elevate">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Trophy className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Level {userStats.level}</p>
              <p className="text-sm text-muted-foreground">{userStats.nextLevel - userStats.totalPoints} pts to next</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.streak} days</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Available Rewards</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GamificationCard />
        </div>
        <div className="space-y-6">
          <Leaderboard />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Redeem Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between gap-2 rounded-md border p-3"
                  data-testid={`reward-${reward.id}`}
                >
                  <div>
                    <p className="text-sm font-medium">{reward.name}</p>
                    <p className="text-xs text-muted-foreground">{reward.points} points</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={userStats.totalPoints < reward.points}
                    data-testid={`button-redeem-${reward.id}`}
                  >
                    Redeem
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
