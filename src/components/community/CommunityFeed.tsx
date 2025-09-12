import React, { useMemo } from 'react';
import PostCard from './PostCard';
import StoriesBar from './StoriesBar';
import CommunityRightSidebar from './CommunityRightSidebar';
import { useCommunity } from '@/contexts/CommunityContext';

const CommunityFeed: React.FC = () => {
  const { posts } = useCommunity();
  const feed = useMemo(() => posts
    .filter(p => p.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [posts]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
        <div className="max-w-xl w-full mx-auto space-y-6">
          <StoriesBar />
          {feed.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No posts yet. Be the first to share your eco-action!</div>
          ) : (
            feed.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
        <div className="hidden lg:block">
          <CommunityRightSidebar />
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
