import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Clock, Star, Trophy, Camera, CheckCircle, Play } from 'lucide-react';
import { Challenge } from '@/data/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
  userLevel: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'waste': return '🗑️';
    case 'energy': return '⚡';
    case 'water': return '💧';
    case 'biodiversity': return '🌿';
    case 'climate': return '🌍';
    case 'lifestyle': return '🏠';
    default: return '🌱';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'daily': return 'bg-blue-100 text-blue-800';
    case 'weekly': return 'bg-purple-100 text-purple-800';
    case 'monthly': return 'bg-orange-100 text-orange-800';
    case 'special': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getVerificationIcon = (method: string) => {
  switch (method) {
    case 'photo': return <Camera className="w-4 h-4" />;
    case 'quiz': return <CheckCircle className="w-4 h-4" />;
    case 'timer': return <Clock className="w-4 h-4" />;
    case 'location': return <Star className="w-4 h-4" />;
    default: return <CheckCircle className="w-4 h-4" />;
  }
};

export default function ChallengeCard({ challenge, onStart, onComplete, userLevel }: ChallengeCardProps) {
  const canUnlock = !challenge.isLocked || 
    (challenge.requirements.level && userLevel >= challenge.requirements.level);

  const getTreeRewardsText = () => {
    const rewards = [];
    if (challenge.treeRewards.seed) rewards.push(`${challenge.treeRewards.seed} 🌱`);
    if (challenge.treeRewards.water) rewards.push(`${challenge.treeRewards.water} 💧`);
    if (challenge.treeRewards.sunlight) rewards.push(`${challenge.treeRewards.sunlight} ☀️`);
    if (challenge.treeRewards.nutrients) rewards.push(`${challenge.treeRewards.nutrients} 🌿`);
    if (challenge.treeRewards.fertilizer) rewards.push(`${challenge.treeRewards.fertilizer} 🧪`);
    if (challenge.treeRewards.love) rewards.push(`${challenge.treeRewards.love} ❤️`);
    return rewards.join(' ');
  };

  const isComingSoon = challenge.tags.includes('coming-soon');

  return (
    <Card className={`relative p-4 rounded-2xl border bg-white/90 transition-transform transform-gpu duration-200 ${
      challenge.isLocked ? 'opacity-70' : 'hover:-translate-y-1 hover:shadow-lg'
    } ${challenge.isCompleted ? 'ring-2 ring-green-500' : ''} ${isComingSoon ? 'ring-2 ring-yellow-300' : ''}`}>
      {challenge.isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <Trophy className="w-6 h-6 text-green-600" />
        </div>
      )}
      {isComingSoon && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">{getCategoryIcon(challenge.category)}</div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">{challenge.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {challenge.description}
              </CardDescription>
            </div>
          </div>
          {challenge.isLocked && (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={`text-xs py-1 px-2 ${getTypeColor(challenge.type)}`}>
            {challenge.type}
          </Badge>
          <Badge className={`text-xs py-1 px-2 ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-xs py-1 px-2">
            <Star className="w-3 h-3" />
            {challenge.points} pts
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-4">
          {/* Progress Bar */}
          {challenge.progress !== undefined && challenge.maxProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-700">
                <span>Progress</span>
                <span>{challenge.progress}/{challenge.maxProgress}</span>
              </div>
              <Progress
                value={(challenge.progress / challenge.maxProgress) * 100}
                className="h-2 rounded-full"
              />
            </div>
          )}

          {/* Tree Rewards */}
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-slate-800">Tree Rewards:</span>
            <span className="text-green-600">{getTreeRewardsText()}</span>
          </div>

          {/* Verification Method */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getVerificationIcon(challenge.verificationMethod)}
            <span>Verify by {challenge.verificationMethod}</span>
            <Clock className="w-4 h-4 ml-auto text-slate-400" />
            <span className="text-slate-500">{challenge.estimatedTime}</span>
          </div>

          {/* Instructions Preview */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-800">Instructions:</span>
            <ul className="text-sm text-slate-600 space-y-2">
              {challenge.instructions.slice(0, 2).map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
              {challenge.instructions.length > 2 && (
                <li className="text-primary text-sm">
                  +{challenge.instructions.length - 2} more steps
                </li>
              )}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs py-1 px-2">#{tag}</Badge>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {challenge.isCompleted ? (
              <Button disabled className="w-full bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : isComingSoon ? (
              <Button disabled className="w-full bg-yellow-100 text-yellow-800">
                <Clock className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            ) : challenge.isLocked ? (
              <Button disabled className="w-full bg-gray-100 text-gray-400">
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </Button>
            ) : (
              <Button
                onClick={() => onStart(challenge.id)}
                className="w-full bg-primary text-primary-foreground hover:opacity-95"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
