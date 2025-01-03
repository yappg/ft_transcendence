'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const avatars = ['./air.png', './earth.png', './fire.png', './water.png'];

interface Player {
  avatar: string;
  username: string;
}

interface TournamentFormProps {
  onStartTournament: (selectedPlayers: Player[]) => void;
}

const TournamentForm = ({ onStartTournament }: TournamentFormProps) => {
  const [players, setPlayers] = useState<Player[]>([
    { avatar: '', username: '' },
    { avatar: '', username: '' },
    { avatar: '', username: '' },
    { avatar: '', username: '' },
  ]);

  const handleAvatarSelect = (index: number, avatar: string) => {
    const newPlayers = [...players];
    newPlayers[index].avatar = avatar;
    setPlayers(newPlayers);
  };

  const handleNicknameChange = (index: number, username: string) => {
    const newPlayers = [...players];
    newPlayers[index].username = username;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTournament(players);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tournament Player Selection</CardTitle>
        <CardDescription>Select avatars and enter nicknames for 3 players</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {players.map((player, index) => (
            <div key={index} className="mb-6">
              <Label htmlFor={`player-${index}`} className="mb-2 block">
                Player {index + 1}
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {avatars.map((avatar, avatarIndex) => (
                    <Avatar
                      key={avatarIndex}
                      className={`cursor-pointer ${player.avatar === avatar ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleAvatarSelect(index, avatar)}
                    >
                      <AvatarImage src={avatar} alt={`Avatar ${avatarIndex + 1}`} />
                      <AvatarFallback>A{avatarIndex + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Input
                  id={`player-${index}`}
                  placeholder="Enter nickname"
                  value={player.username}
                  onChange={(e) => handleNicknameChange(index, e.target.value)}
                  className="grow"
                />
              </div>
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit}>
          Start Tournament
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentForm;
