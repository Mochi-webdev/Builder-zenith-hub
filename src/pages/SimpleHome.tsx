import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SimpleHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🗾 ANIME CLASH ⚔️
        </h1>
        <p className="text-white/80 mb-6">
          Epic battles with legendary anime warriors!
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/game")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Start Battle ⚔️
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Reload App 🔄
          </Button>
        </div>
        <div className="mt-6 text-xs text-white/50">
          <p>If you see this, the basic app is working!</p>
          <p>Check browser console for any errors.</p>
        </div>
      </Card>
    </div>
  );
}
