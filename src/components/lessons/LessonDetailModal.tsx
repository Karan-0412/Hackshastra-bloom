import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Video,
  FileText,
  Zap,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Lesson } from '@/data/lessons';

interface LessonDetailModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
  isCompleted: boolean;
}

export default function LessonDetailModal({ 
  lesson, 
  isOpen, 
  onClose, 
  onComplete, 
  isCompleted 
}: LessonDetailModalProps) {
  if (!lesson) return null;

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'reading': return <FileText className="w-5 h-5" />;
      case 'interactive': return <Zap className="w-5 h-5" />;
      case 'quiz': return <HelpCircle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
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

  const handleComplete = () => {
    onComplete(lesson.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-white/60 rounded-2xl shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shadow-sm">
              {getLessonTypeIcon(lesson.type)}
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold text-slate-900">{lesson.title}</DialogTitle>
              <DialogDescription className="text-base text-slate-600">
                {lesson.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Lesson Info */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(lesson.difficulty)}>
              {lesson.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration} minutes
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {lesson.points} points
            </Badge>
            <Badge variant="outline">
              {lesson.type}
            </Badge>
          </div>

          {/* Content */}
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 text-slate-900">Lesson Content</h3>
              <div className="prose prose-sm max-w-none text-slate-700">
                <p>{lesson.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          {Object.keys(lesson.resources).length > 0 && (
            <Card className="rounded-xl border border-gray-100 shadow-sm">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 text-slate-900">Resources</h3>
                <div className="space-y-2">
                  {lesson.resources.videos && lesson.resources.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Videos</h4>
                      <div className="space-y-1">
                        {lesson.resources.videos.map((video, index) => (
                          <div key={index} className="text-sm text-primary hover:underline cursor-pointer">
                            📹 {video}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lesson.resources.articles && lesson.resources.articles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Articles</h4>
                      <div className="space-y-1">
                        {lesson.resources.articles.map((article, index) => (
                          <div key={index} className="text-sm text-primary hover:underline cursor-pointer">
                            📄 {article}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lesson.resources.activities && lesson.resources.activities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Activities</h4>
                      <div className="space-y-1">
                        {lesson.resources.activities.map((activity, index) => (
                          <div key={index} className="text-sm text-primary hover:underline cursor-pointer">
                            🎯 {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lesson.resources.quizzes && lesson.resources.quizzes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Quizzes</h4>
                      <div className="space-y-1">
                        {lesson.resources.quizzes.map((quiz, index) => (
                          <div key={index} className="text-sm text-primary hover:underline cursor-pointer">
                            ❓ {quiz}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-slate-900">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {lesson.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isCompleted ? (
              <Button disabled className="flex-1 bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button 
                  onClick={handleComplete}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Complete Lesson
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
