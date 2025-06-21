import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chestManager } from "@/lib/chestSystem";
import { currencyManager } from "@/lib/currencySystem";
import {
  Gift,
  Clock,
  Star,
  Zap,
  Coins,
  Gem,
  ShoppingCart,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopProps {
  className?: string;
}

interface DailyReward {
  day: number;
  type: "chest" | "coins" | "gems";
  amount: number;
  chestType?: string;
  claimed: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: "chest" | "currency";
  price: number;
  currency: "coins" | "gems";
  value: number;
  chestType?: string;
  discount?: number;
  popular?: boolean;
}

export default function Shop({ className }: ShopProps) {
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const [canClaimDaily, setCanClaimDaily] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(
    null,
  );

  const shopItems: ShopItem[] = [
    {
      id: "wooden-chest-pack",
      name: "Wooden Chest Pack",
      description: "5 Wooden chests with basic rewards",
      type: "chest",
      price: 50,
      currency: "coins",
      value: 5,
      chestType: "wooden",
    },
    {
      id: "silver-chest",
      name: "Silver Chest",
      description: "Better rewards than wooden",
      type: "chest",
      price: 100,
      currency: "coins",
      value: 1,
      chestType: "silver",
      popular: true,
    },
    {
      id: "golden-chest",
      name: "Golden Chest",
      description: "High-value rewards",
      type: "chest",
      price: 250,
      currency: "coins",
      value: 1,
      chestType: "golden",
    },
    {
      id: "magical-chest",
      name: "Magical Chest",
      description: "Rare characters and items",
      type: "chest",
      price: 50,
      currency: "gems",
      value: 1,
      chestType: "magical",
      discount: 20,
    },
    {
      id: "coin-pack-small",
      name: "Coin Pouch",
      description: "1000 coins",
      type: "currency",
      price: 10,
      currency: "gems",
      value: 1000,
    },
    {
      id: "coin-pack-large",
      name: "Coin Chest",
      description: "5000 coins",
      type: "currency",
      price: 40,
      currency: "gems",
      value: 5000,
      discount: 15,
    },
  ];

  useEffect(() => {
    // Initialize daily rewards for a week
    const rewards: DailyReward[] = [
      { day: 1, type: "chest", amount: 1, chestType: "wooden", claimed: false },
      { day: 2, type: "coins", amount: 100, claimed: false },
      { day: 3, type: "chest", amount: 1, chestType: "silver", claimed: false },
      { day: 4, type: "gems", amount: 5, claimed: false },
      { day: 5, type: "coins", amount: 250, claimed: false },
      { day: 6, type: "chest", amount: 1, chestType: "golden", claimed: false },
      { day: 7, type: "gems", amount: 20, claimed: false },
    ];

    // Load saved state (in real app, this would be from localStorage or server)
    const savedDay = localStorage.getItem("anime-clash-daily-day");
    const savedRewards = localStorage.getItem("anime-clash-daily-rewards");

    if (savedDay && savedRewards) {
      setCurrentDay(parseInt(savedDay));
      setDailyRewards(JSON.parse(savedRewards));
    } else {
      setCurrentDay(1);
      setDailyRewards(rewards);
    }

    // Calculate time until reset (24 hours)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setTimeUntilReset(tomorrow.getTime() - now.getTime());

    // Update timer every second
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeLeft = tomorrow.getTime() - now.getTime();
      setTimeUntilReset(timeLeft);

      // Reset daily reward if time is up
      if (timeLeft <= 0) {
        setCanClaimDaily(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeUntilReset = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const claimDailyReward = () => {
    if (!canClaimDaily || currentDay > dailyRewards.length) return;

    const reward = dailyRewards[currentDay - 1];
    const updatedRewards = [...dailyRewards];
    updatedRewards[currentDay - 1].claimed = true;

    // Give the reward
    if (reward.type === "chest" && reward.chestType) {
      chestManager.addChest(reward.chestType as any);
    } else if (reward.type === "coins") {
      currencyManager.addCoins(reward.amount);
    } else if (reward.type === "gems") {
      currencyManager.addGems(reward.amount);
    }

    setDailyRewards(updatedRewards);
    setCanClaimDaily(false);

    // Move to next day or reset cycle
    const nextDay = currentDay >= 7 ? 1 : currentDay + 1;
    setCurrentDay(nextDay);

    // Save to localStorage
    localStorage.setItem("anime-clash-daily-day", nextDay.toString());
    localStorage.setItem(
      "anime-clash-daily-rewards",
      JSON.stringify(updatedRewards),
    );

    // Reset rewards for new cycle if needed
    if (nextDay === 1) {
      const resetRewards = updatedRewards.map((r) => ({
        ...r,
        claimed: false,
      }));
      setDailyRewards(resetRewards);
      localStorage.setItem(
        "anime-clash-daily-rewards",
        JSON.stringify(resetRewards),
      );
    }
  };

  const purchaseItem = (item: ShopItem) => {
    const currency = currencyManager.getCurrencyData();
    const cost = item.price;

    if (item.currency === "coins" && currency.coins >= cost) {
      currencyManager.spendCoins(cost);

      if (item.type === "chest" && item.chestType) {
        for (let i = 0; i < item.value; i++) {
          chestManager.addChest(item.chestType as any);
        }
      } else if (item.type === "currency") {
        currencyManager.addCoins(item.value);
      }

      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 2000);
    } else if (item.currency === "gems" && currency.gems >= cost) {
      currencyManager.spendGems(cost);

      if (item.type === "chest" && item.chestType) {
        for (let i = 0; i < item.value; i++) {
          chestManager.addChest(item.chestType as any);
        }
      } else if (item.type === "currency") {
        currencyManager.addCoins(item.value);
      }

      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 2000);
    }
  };

  const canAfford = (item: ShopItem) => {
    const currency = currencyManager.getCurrencyData();
    return item.currency === "coins"
      ? currency.coins >= item.price
      : currency.gems >= item.price;
  };

  const todaysReward = dailyRewards[currentDay - 1];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Daily Reward Card */}
      <Card className="floating-panel p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-400/10 to-green-600/10 animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse-glow">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Daily Reward</h3>
                <p className="text-sm text-white/70">Day {currentDay} of 7</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-white/60 mb-1">Resets in:</div>
              <div className="text-sm font-mono text-green-400">
                {formatTimeUntilReset(timeUntilReset)}
              </div>
            </div>
          </div>

          {todaysReward && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {todaysReward.type === "chest"
                    ? "🎁"
                    : todaysReward.type === "coins"
                      ? "🪙"
                      : "💎"}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {todaysReward.type === "chest" &&
                      `${todaysReward.chestType} Chest`}
                    {todaysReward.type === "coins" &&
                      `${todaysReward.amount} Coins`}
                    {todaysReward.type === "gems" &&
                      `${todaysReward.amount} Gems`}
                  </div>
                  <div className="text-xs text-white/70">Free daily reward</div>
                </div>
              </div>

              <Button
                onClick={claimDailyReward}
                disabled={!canClaimDaily || todaysReward.claimed}
                className={cn(
                  "futuristic-button-primary px-6 py-3",
                  todaysReward.claimed && "opacity-50",
                )}
              >
                {todaysReward.claimed
                  ? "Claimed"
                  : canClaimDaily
                    ? "Claim"
                    : "Tomorrow"}
              </Button>
            </div>
          )}

          {/* Daily Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>Daily Progress</span>
              <span>{currentDay}/7</span>
            </div>
            <Progress
              value={(currentDay / 7) * 100}
              className="h-2 bg-slate-800/50"
              indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400"
            />
          </div>
        </div>
      </Card>

      {/* Shop Button */}
      <Dialog open={isShopOpen} onOpenChange={setIsShopOpen}>
        <DialogTrigger asChild>
          <Button className="w-full anime-button flex items-center gap-3 py-4">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-lg font-bold">Open Shop</span>
            <Badge className="bg-red-500 text-white animate-pulse">NEW</Badge>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900/95 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-purple-400" />
              Anime Clash Shop
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {shopItems.map((item) => (
              <Card key={item.id} className="floating-panel p-4 relative">
                {item.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white animate-pulse">
                    Popular
                  </Badge>
                )}

                {item.discount && (
                  <Badge className="absolute -top-2 -left-2 bg-red-500 text-white">
                    -{item.discount}%
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {item.type === "chest" ? "🎁" : "🪙"}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.currency === "coins" ? (
                          <Coins className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Gem className="w-4 h-4 text-purple-400" />
                        )}
                        <span className="font-bold text-white">
                          {item.price.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        onClick={() => purchaseItem(item)}
                        disabled={!canAfford(item)}
                        className={cn(
                          "futuristic-button px-4 py-2",
                          !canAfford(item) && "opacity-50 cursor-not-allowed",
                          purchaseAnimation === item.id &&
                            "animate-bounce-glow",
                        )}
                      >
                        {purchaseAnimation === item.id ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          "Buy"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
