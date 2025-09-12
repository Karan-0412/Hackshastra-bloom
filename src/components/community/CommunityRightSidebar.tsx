import React, { useMemo, useState } from 'react';
import { useCommunity } from '@/contexts/CommunityContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquarePlus, Users, ImagePlus, Camera } from 'lucide-react';
import StoryModal from './StoryModal';
import PhotoModal from './PhotoModal';
import CreateGroupModal from './CreateGroupModal';
import MessagesModal from './MessagesModal';

const CommunityRightSidebar: React.FC = () => {
  const { posts, currentUser } = useCommunity();
  const [storyOpen, setStoryOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [partner, setPartner] = useState<{ id: string; name: string; avatarUrl?: string | null } | null>(null);

  const people = useMemo(() => {
    const map = new Map<string, { name: string; avatar?: string | null }>();
    posts.forEach(p => {
      if (p.user.id !== currentUser?.id && !map.has(p.user.id)) map.set(p.user.id, { name: p.user.name, avatar: p.user.avatarUrl });
    });
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v })).slice(0, 6);
  }, [posts, currentUser]);

  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setStoryOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
              <Camera className="h-4 w-4 mr-2" /> Post Story
            </Button>
            <Button onClick={() => setPhotoOpen(true)} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <ImagePlus className="h-4 w-4 mr-2" /> Post Photo
            </Button>
            <Button onClick={() => setGroupOpen(true)} variant="outline" className="border-slate-300">
              <Users className="h-4 w-4 mr-2" /> Create Group
            </Button>
            <Button onClick={() => { setPartner(null); setMessagesOpen(true); }} variant="outline" className="border-slate-300">
              <MessageSquarePlus className="h-4 w-4 mr-2" /> Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold">People nearby</div>
          <div className="space-y-3">
            {people.length === 0 && (
              <div className="text-sm text-muted-foreground">No suggestions yet.</div>
            )}
            {people.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={p.avatar || undefined} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{p.name}</div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setPartner({ id: p.id, name: p.name, avatarUrl: p.avatar }); setMessagesOpen(true); }}>Message</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <StoryModal open={storyOpen} onOpenChange={setStoryOpen} />
      <PhotoModal open={photoOpen} onOpenChange={setPhotoOpen} />
      <CreateGroupModal open={groupOpen} onOpenChange={setGroupOpen} />
      <MessagesModal open={messagesOpen} onOpenChange={setMessagesOpen} partner={partner || undefined} />
    </div>
  );
};

export default CommunityRightSidebar;
