import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full animate-character-hover"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <Card className="glass-effect p-8">
          <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-6 anime-glow" />
          <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">
            Arena Not Found
          </h2>
          <p className="text-white/70 mb-8">
            The battle arena you're looking for has vanished into the void.
            Perhaps it was destroyed in an epic clash?
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="anime-button w-full text-lg py-3"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Main Menu
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="glass-effect w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
