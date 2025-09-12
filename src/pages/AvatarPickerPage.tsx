import React from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonAvatarPicker from '@/components/auth/PokemonAvatarPicker';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AvatarPickerPage: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = React.useState<string | null>(profile?.pokemon_avatar || null);

  React.useEffect(() => {
    setSelected(profile?.pokemon_avatar || null);
  }, [profile]);

  const handleConfirm = async () => {
    if (!profile) return navigate(-1);
    try {
      const res = await updateProfile({ pokemon_avatar: selected } as any);
      if ((res as any)?.error) {
        toast({ title: 'Failed to update avatar', variant: 'destructive' });
      } else {
        toast({ title: 'Avatar updated' });
        navigate(-1);
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      toast({ title: 'Failed to update avatar', variant: 'destructive' });
    }
  };

  const handleSkip = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8edff] via-[#eef1ff] to-[#f3eaff] py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Choose Your Avatar</h1>
            <p className="text-sm text-slate-600">Select a Pokémon avatar for your profile.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

        <PokemonAvatarPicker
          selected={selected}
          onSelect={(url) => setSelected(url)}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default AvatarPickerPage;
