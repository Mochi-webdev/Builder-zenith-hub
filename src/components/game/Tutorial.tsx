import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Swords,
  Zap,
  Target,
  Shield,
  Users,
  Trophy,
} from "lucide-react";

const tutorialSteps = [
  {
    title: "Welcome to Anime Clash!",
    icon: <Swords className="w-8 h-8 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <p>
          Battle with legendary anime characters in this real-time strategy game
          inspired by Clash Royale!
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Build your deck</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Manage energy</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-400" />
            <span>Strategic placement</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>Destroy enemy tower</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Building Your Deck",
    icon: <Users className="w-8 h-8 text-blue-400" />,
    content: (
      <div className="space-y-4">
        <p>Select 4 characters to form your battle deck:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500">Legendary</Badge>
            <span className="text-sm">Powerful, high-cost characters</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500">Epic</Badge>
            <span className="text-sm">Strong with special abilities</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500">Rare</Badge>
            <span className="text-sm">Balanced characters</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gray-500">Common</Badge>
            <span className="text-sm">Basic, low-cost units</span>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Mix different rarities and elements for a balanced strategy!
        </p>
      </div>
    ),
  },
  {
    title: "Energy System",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    content: (
      <div className="space-y-4">
        <p>Energy is required to deploy characters:</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Starting Energy:</span>
            <Badge variant="outline">5/10</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Regeneration:</span>
            <Badge variant="outline">+1/sec</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Character Cost:</span>
            <Badge variant="outline">2-5 Energy</Badge>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Manage your energy wisely - deploy too fast and you'll be defenseless!
        </p>
      </div>
    ),
  },
  {
    title: "Battle Arena",
    icon: <Target className="w-8 h-8 text-red-400" />,
    content: (
      <div className="space-y-4">
        <p>Deploy characters strategically on the 3D battlefield:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-sm" />
            <span className="text-sm">Blue area = Your deployment zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-sm" />
            <span className="text-sm">Red area = Enemy territory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded-sm" />
            <span className="text-sm">Central line = Lane divider</span>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Click on your side to deploy characters. They'll automatically move
          toward the enemy tower!
        </p>
      </div>
    ),
  },
  {
    title: "Victory Conditions",
    icon: <Shield className="w-8 h-8 text-green-400" />,
    content: (
      <div className="space-y-4">
        <p>Destroy the enemy tower to win!</p>
        <div className="space-y-3">
          <div className="text-center p-4 bg-green-500/20 rounded-lg">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-bold text-green-400">VICTORY</div>
            <div className="text-sm text-white/70">
              Enemy tower health reaches 0
            </div>
          </div>
          <div className="text-center p-4 bg-red-500/20 rounded-lg">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="font-bold text-red-400">DEFEAT</div>
            <div className="text-sm text-white/70">
              Your tower health reaches 0
            </div>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Protect your tower while attacking theirs. Good luck, commander!
        </p>
      </div>
    ),
  },
];

export default function Tutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAndClose = () => {
    setCurrentStep(0);
    setIsOpen(false);
  };

  const step = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="glass-effect"
          onClick={() => setIsOpen(true)}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          How to Play
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md glass-effect border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            {step.icon}
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="text-white/90">{step.content}</div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep
                  ? "bg-purple-400"
                  : index < currentStep
                    ? "bg-purple-600"
                    : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="glass-effect"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-white/70">
            {currentStep + 1} of {tutorialSteps.length}
          </span>

          {currentStep === tutorialSteps.length - 1 ? (
            <Button onClick={resetAndClose} className="anime-button" size="sm">
              Let's Battle!
            </Button>
          ) : (
            <Button onClick={nextStep} className="anime-button" size="sm">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
