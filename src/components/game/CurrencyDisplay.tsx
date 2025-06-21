import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { currencyManager, CurrencyData } from "@/lib/currencySystem";
import { Coins, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CurrencyDisplay({
  className,
  size = "md",
}: CurrencyDisplayProps) {
  const [currency, setCurrency] = useState<CurrencyData>(
    currencyManager.getCurrencyData(),
  );

  useEffect(() => {
    const updateCurrency = () => {
      setCurrency(currencyManager.getCurrencyData());
    };

    updateCurrency();
    const interval = setInterval(updateCurrency, 1000);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "text-sm p-2",
    md: "text-base p-3",
    lg: "text-lg p-4",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Card
      className={cn(
        "glass-effect flex items-center gap-4",
        sizeClasses[size],
        className,
      )}
    >
      {/* Coins */}
      <div className="flex items-center gap-2">
        <Coins className={cn(iconSizes[size], "text-yellow-400 anime-glow")} />
        <span className="font-bold text-white">
          {currency.coins.toLocaleString()}
        </span>
      </div>

      {/* Gems */}
      <div className="flex items-center gap-2">
        <Gem className={cn(iconSizes[size], "text-purple-400 anime-glow")} />
        <span className="font-bold text-white">
          {currency.gems.toLocaleString()}
        </span>
      </div>
    </Card>
  );
}
