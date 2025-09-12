import React, { useMemo } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { useCommunity } from '@/contexts/CommunityContext';

const CommunityFeed: React.FC = () => {
  const { posts, currentUser } = useCommunity();
  const feed = useMemo(() => posts
    .filter(p => p.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [posts]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <CreatePost />
      {feed.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No posts yet. Be the first to share your eco-action!</div>
      ) : (
        feed.map(p => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
};

export default CommunityFeed;
