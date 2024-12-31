from dataclasses import dataclass
from typing import Dict, Tuple

@dataclass
class CoordinateConverter:
    """
    Handles conversion between backend fixed coordinates and frontend responsive coordinates
    """
    backend_width: float = 160  # Fixed backend width
    backend_height: float = 100  # Fixed backend height
    
    def to_frontend_coords(self, x: float, y: float, frontend_width: float, frontend_height: float) -> Tuple[float, float]:
        """
        Convert backend coordinates to frontend coordinates
        
        Args:
            x: Backend x coordinate
            y: Backend y coordinate
            frontend_width: Current frontend canvas width
            frontend_height: Current frontend canvas height
            
        Returns:
            Tuple of (frontend_x, frontend_y)
        """
        scale_x = frontend_width / self.backend_width
        scale_y = frontend_height / self.backend_height
        
        return (x * scale_x, y * scale_y)
    
    def to_backend_coords(self, x: float, y: float, frontend_width: float, frontend_height: float) -> Tuple[float, float]:
        """
        Convert frontend coordinates to backend coordinates
        
        Args:
            x: Frontend x coordinate
            y: Frontend y coordinate
            frontend_width: Current frontend canvas width
            frontend_height: Current frontend canvas height
            
        Returns:
            Tuple of (backend_x, backend_y)
        """
        scale_x = self.backend_width / frontend_width
        scale_y = self.backend_height / frontend_height
        
        return (x * scale_x, y * scale_y)
    
    def convert_game_state(self, game_state: Dict, frontend_width: float, frontend_height: float) -> Dict:
        """
        Convert an entire game state from backend to frontend coordinates
        
        Args:
            game_state: The game state dictionary from PingPongGame.get_state()
            frontend_width: Current frontend canvas width
            frontend_height: Current frontend canvas height
            
        Returns:
            New game state dictionary with converted coordinates
        """
        converted_state = game_state.copy()
        
        # Convert ball position
        ball_x, ball_y = self.to_frontend_coords(
            game_state['ball']['x'],
            game_state['ball']['y'],
            frontend_width,
            frontend_height
        )
        converted_state['ball']['x'] = ball_x
        converted_state['ball']['y'] = ball_y
        
        # Convert paddle positions
        p1_x, p1_y = self.to_frontend_coords(
            5,  # Fixed left paddle x position
            game_state['players']['player1']['paddle_y'],
            frontend_width,
            frontend_height
        )
        p2_x, p2_y = self.to_frontend_coords(
            155,  # Fixed right paddle x position
            game_state['players']['player2']['paddle_y'],
            frontend_width,
            frontend_height
        )
        
        converted_state['players']['player1']['paddle_y'] = p1_y
        converted_state['players']['player2']['paddle_y'] = p2_y
        
        return converted_state