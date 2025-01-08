'use client';

import React, { useState, useEffect } from 'react';
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
import { MyButton } from '@/components/generalUi/Button';
import InputBar from '@/components/auth/input-bar';

const avatars = ['./air.png', './earth.png', './fire.png', './water.png'];

interface Player {
  avatar: string;
  username: string;
}

interface TournamentFormProps {
  onStartTournament: (selectedPlayers: Player[]) => void;
}

const TournamentForm = ({ onStartTournament }: TournamentFormProps) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([
    { avatar: '', username: '' },
    { avatar: '', username: '' },
    { avatar: '', username: '' },
    { avatar: '', username: '' },
  ]);

  useEffect(() => {
    let unvalid = false;
    players.map((player: Player) => {
      if (player.avatar === '' ||  player.username === '' || player.username.length > 10) {
        unvalid = true;
      }
    })
    setDisabled(unvalid);
  }, [players])

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
    if (!disabled) {
      onStartTournament(players);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-black-crd text-white">
      <CardHeader>
        <CardTitle>Tournament Player Selection</CardTitle>
        <CardDescription className="text-[rgb(200,200,200)]">
          Select avatars and enter nicknames for 3 players
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {players.map((player, index) => (
            <div key={index} className="mb-6">
              <Label htmlFor={`player-${index}`} className="mb-2 block text-[rgb(200,200,200)]">
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
                {/* <Input
                  id={`player-${index}`}
                  placeholder="Enter nickname"
                  value={player.username}
                  onChange={(e) => handleNicknameChange(index, e.target.value)}
                  className="grow"
                /> */}
                <InputBar
                  // Icon={Button}
                  placeholder="Enter nickname"
                  value={player.username}
                  setValue={(value) => handleNicknameChange(index, value)}
                  className="grow"
                />
              </div>
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter>
        {/* <MyButton
          className="min-w-[120px] disabled:opacity-50"
          type="submit"
          onClick={handleSubmit}
        >
          start
        </MyButton> */}
        <Button
        className={disabled? 'bg-black-crd' : 'bg-aqua'}
          disable={disabled? 'true': 'false'}
          type="submit" onClick={handleSubmit}>
            Start Tournament
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentForm;
