import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle } from 'lucide-react';
import { PostItem } from '@/contexts/CommunityContext';
import { useCommunity } from '@/contexts/CommunityContext';

const formatTime = (iso: string) => new Date(iso).toLocaleString();

const PostCard: React.FC<{ post: PostItem }> = ({ post }) => {
  const { likePost, unlikePost, addComment, currentUser } = useCommunity();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const liked = useMemo(() => currentUser ? post.likes.includes(currentUser.id) : false, [currentUser, post.likes]);

  const onToggleLike = () => {
    if (!currentUser) return;
    liked ? unlikePost(post.id) : likePost(post.id);
  };

  const onAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(post.id, comment.trim());
    setComment('');
    setShowComments(true);
  };

  return (
    <Card className="rounded-3xl overflow-hidden border bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.user.avatarUrl || undefined} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.user.name}</div>
            <div className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full">#{t}</Badge>
          ))}
        </div>
      </div>

      <CardContent className="p-0">
        {post.mediaType === 'image' ? (
          <img src={post.mediaUrl} alt={post.caption} className="w-full max-h-[540px] object-contain bg-black/5" />
        ) : (
          <video src={post.mediaUrl} controls className="w-full max-h-[540px] bg-black" />
        )}
        <div className="p-4 space-y-3">
          {!post.approved && (
            <div className="text-sm text-red-600">This post is hidden from the public feed: {post.flaggedReason}</div>
          )}
          <div className="text-sm"><span className="font-semibold mr-1">{post.user.name}</span>{post.caption}</div>

          <div className="flex items-center gap-3 pt-1">
            <Button onClick={onToggleLike} variant={liked ? 'default' : 'outline'} className={liked ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-300 text-green-700 hover:bg-green-50'}>
              <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {post.likes.length}
            </Button>
            <Button onClick={() => setShowComments(v => !v)} variant="ghost" className="text-slate-600 hover:text-slate-900">
              <MessageCircle className="mr-2 h-4 w-4" /> {post.comments.length} Comments
            </Button>
          </div>

          <form onSubmit={onAddComment} className="flex items-center gap-2 pt-2">
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Post</Button>
          </form>

          {showComments && post.comments.length > 0 && (
            <div className="pt-2 space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={c.user.avatarUrl || undefined} />
                    <AvatarFallback>{c.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-50 rounded-2xl px-3 py-2">
                    <div className="text-sm"><span className="font-medium mr-1">{c.user.name}</span>{c.text}</div>
                    <div className="text-[10px] text-muted-foreground">{formatTime(c.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
