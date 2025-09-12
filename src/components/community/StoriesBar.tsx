import React, { useMemo } from 'react';
import { useCommunity } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

const StoryAvatar: React.FC<{ name: string; src?: string | null; isSelf?: boolean }> = ({ name, src, isSelf }) => (
  <div className="flex flex-col items-center gap-2 select-none">
    <div className="p-[2px] rounded-full bg-gradient-to-tr from-green-500 via-emerald-400 to-green-600">
      <div className="p-[2px] bg-white rounded-full">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={src || undefined} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {isSelf && (
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="text-xs text-slate-700 max-w-[72px] truncate">{isSelf ? 'Your story' : name}</div>
  </div>
);

const StoriesBar: React.FC = () => {
  const { posts, currentUser } = useCommunity();

  const users = useMemo(() => {
    const map = new Map<string, { name: string; avatar?: string | null }>();
    posts.forEach(p => {
      if (!map.has(p.user.id)) map.set(p.user.id, { name: p.user.name, avatar: p.user.avatarUrl });
    });
    return Array.from(map.entries()).slice(0, 20).map(([id, v]) => ({ id, ...v }));
  }, [posts]);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4 px-2 py-3">
        {currentUser && (
          <StoryAvatar name={currentUser.name} src={currentUser.avatarUrl} isSelf />
        )}
        {users.map(u => (
          <StoryAvatar key={u.id} name={u.name} src={u.avatar} />
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
