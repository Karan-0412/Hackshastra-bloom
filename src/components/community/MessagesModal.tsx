import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCommunity } from '@/contexts/CommunityContext';

const DM_KEY = 'communityDM_v1';

interface Message { id: string; senderId: string; content: string; createdAt: string; }

const threadIdOf = (a: string, b: string) => [a, b].sort().join('|');

const MessagesModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; partner?: { id: string; name: string; avatarUrl?: string | null } }> = ({ open, onOpenChange, partner }) => {
  const { currentUser, posts } = useCommunity();
  const [selected, setSelected] = useState<string | null>(partner?.id || null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const people = useMemo(() => {
    const map = new Map<string, { name: string; avatarUrl?: string | null }>();
    posts.forEach(p => {
      if (p.user.id !== currentUser?.id && !map.has(p.user.id)) map.set(p.user.id, { name: p.user.name, avatarUrl: p.user.avatarUrl });
    });
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
  }, [posts, currentUser]);

  useEffect(() => { setSelected(partner?.id || null); }, [partner?.id]);

  useEffect(() => {
    if (!currentUser || !selected) { setMessages([]); return; }
    try {
      const raw = localStorage.getItem(DM_KEY);
      const data = raw ? JSON.parse(raw) as Record<string, Message[]> : {};
      setMessages(data[threadIdOf(currentUser.id, selected)] || []);
    } catch { setMessages([]); }
  }, [currentUser?.id, selected, open]);

  const send = () => {
    if (!currentUser || !selected || !input.trim()) return;
    const msg: Message = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, senderId: currentUser.id, content: input.trim(), createdAt: new Date().toISOString() };
    try {
      const raw = localStorage.getItem(DM_KEY);
      const data = raw ? JSON.parse(raw) as Record<string, Message[]> : {};
      const tid = threadIdOf(currentUser.id, selected);
      const arr = data[tid] || [];
      arr.push(msg);
      data[tid] = arr;
      localStorage.setItem(DM_KEY, JSON.stringify(data));
      setMessages(arr.slice());
      setInput('');
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-2 font-semibold text-sm">People</div>
            <div className="max-h-80 overflow-y-auto">
              {people.map(p => (
                <button key={p.id} className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 ${selected === p.id ? 'bg-slate-100' : ''}`} onClick={() => setSelected(p.id)}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={p.avatarUrl || undefined} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">{p.name}</div>
                </button>
              ))}
              {people.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">No people yet.</div>
              )}
            </div>
          </div>
          <div className="border rounded-lg flex flex-col">
            <div className="p-2 border-b text-sm font-medium">{selected ? people.find(p => p.id === selected)?.name || 'Chat' : 'Select a person'}</div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.senderId === currentUser?.id ? 'ml-auto bg-green-600 text-white' : 'mr-auto bg-slate-100'}`}>
                  {m.content}
                </div>
              ))}
              {selected && messages.length === 0 && (
                <div className="text-sm text-muted-foreground">Say hi!</div>
              )}
            </div>
            <div className="p-2 border-t flex items-center gap-2">
              <Input placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
              <Button onClick={send} disabled={!selected || !input.trim()} className="bg-green-600 hover:bg-green-700 text-white">Send</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
