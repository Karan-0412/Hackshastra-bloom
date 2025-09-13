import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle, 
  Play, 
  Clock, 
  Star, 
  BookOpen,
  Video,
  FileText,
  Zap,
  HelpCircle
} from 'lucide-react';
import { LessonModule as LessonModuleType, Lesson, canAccessLesson, updateModuleProgress } from '@/data/lessons';
import { useProgress } from '@/contexts/ProgressContext';

interface LessonModuleProps {
  module: LessonModuleType;
  onStartLesson: (lesson: Lesson) => void;
}

const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'reading': return <FileText className="w-4 h-4" />;
    case 'interactive': return <Zap className="w-4 h-4" />;
    case 'quiz': return <HelpCircle className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LessonModule({ module, onStartLesson }: LessonModuleProps) {
  const { userProgress } = useProgress();
  const [expanded, setExpanded] = useState(false);
  
  // Update module progress based on completed lessons
  const updatedModule = updateModuleProgress(module.id, userProgress.completedLessons);

  const handleStartLesson = (lesson: Lesson) => {
    if (canAccessLesson(lesson.id, userProgress.completedLessons)) {
      onStartLesson(lesson);
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white/60 to-white/40 shadow-sm hover:shadow-xl transform-gpu transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
              module.color === 'red' ? 'bg-red-50' :
              module.color === 'green' ? 'bg-green-50' :
              module.color === 'yellow' ? 'bg-yellow-50' :
              module.color === 'blue' ? 'bg-blue-50' :
              'bg-gray-50'
            }`}>
              {module.icon}
            </div>
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold text-slate-900">{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="border-gray-200 bg-white/50 hover:bg-white flex items-center gap-2"
          >
            {expanded ? 'Hide Lessons' : 'Show Lessons'}
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-500">
              {updatedModule?.completedLessons || 0}/{updatedModule?.totalLessons || 0} lessons
            </span>
          </div>
          <Progress 
            value={updatedModule?.progress || 0} 
            className="h-3 bg-slate-100 rounded-full"
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const isCompleted = userProgress.completedLessons.includes(lesson.id);
              const canAccess = canAccessLesson(lesson.id, userProgress.completedLessons);
              const isLocked = !canAccess && !isCompleted;

              return (
                <div
                  key={lesson.id}
                  className={`p-4 md:p-6 rounded-2xl border shadow-sm transition-transform duration-150 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-50 to-white border-emerald-100 ring-1 ring-emerald-100' 
                      : isLocked
                        ? 'bg-gray-50 border-gray-200 opacity-70' 
                        : 'bg-white border-gray-100 hover:shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isLocked 
                            ? 'bg-gray-300 text-gray-500' 
                            : 'bg-primary text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-semibold ${
                            isCompleted ? 'text-green-800' : 
                            isLocked ? 'text-gray-500' : 'text-slate-900'
                          }`}> 
                            {lesson.title}
                          </h4>
                          {getLessonTypeIcon(lesson.type)}
                        </div>
                        <p className={`text-sm ${
                          isCompleted ? 'text-green-600' : 
                          isLocked ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}min
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Star className="w-3 h-3 mr-1" />
                          {lesson.points} pts
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleStartLesson(lesson)}
                        disabled={isLocked || isCompleted}
                        className={`ml-2 ${
                          isCompleted 
                            ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' 
                            : isLocked 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-primary hover:bg-primary/90 text-white'
                        }`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </>
                        ) : isLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isLocked && lesson.prerequisites.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Prerequisites:</strong> Complete previous lessons to unlock this lesson.
                      </p>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <p className="text-xs text-emerald-800">
                        <strong>Completed!</strong> Great job on finishing this lesson.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
