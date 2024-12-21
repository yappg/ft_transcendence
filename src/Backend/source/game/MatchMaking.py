from dataclasses import dataclass
from typing import Dict

@dataclass
class QueuedPlayer:
    id: int
    username: str
    channel_name: str
    # skill_rating: int
    
class MatchMakingSystem:
    def __init__(self):
        self.queued_players :Dict[int, QueuedPlayer] = {}
        self.games = []