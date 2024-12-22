from django.core.management.base import BaseCommand
from accounts.models import Achivement

class Command(BaseCommand):
    help = "seed database with achievements"

    def handle(self, *args, **kwargs):
        from .models import Achievement
        default_achievements = [
            {"name" : "ice Explorer", "description" : "Play 5 games in ice biome.", "xp_gain" : "150", "condition" : "5"},
            {"name" : "ice Wanderer", "description" : "Play 20 games in ice biome.", "xp_gain" : "300", "condition" : "20"},
            {"name" : "ice Traveler", "description" : "Play 50 games in ice biome.", "xp_gain" : "600", "condition" : "50"},
            {"name" : "ice Pilgrim", "description" : "Play 100 games in ice biome.", "xp_gain" : "1000", "condition" : "100"},

            {"name" : "water Explorer", "description" : "Play 5 games in water biome.", "xp_gain" : "150", "condition" : "5"},
            {"name" : "water Wanderer", "description" : "Play 20 games in water biome.", "xp_gain" : "300", "condition" : "20"},
            {"name" : "water Traveler", "description" : "Play 50 games in water biome.", "xp_gain" : "600", "condition" : "50"},
            {"name" : "water Pilgrim", "description" : "Play 100 games in water biome.", "xp_gain" : "1000", "condition" : "100"},

            {"name" : "Fire Explorer", "description" : "Play 5 games in fire biome.", "xp_gain" : "150", "condition" : "5"},
            {"name" : "Fire Wanderer", "description" : "Play 20 games in fire biome.", "xp_gain" : "300", "condition" : "20"},
            {"name" : "Fire Traveler", "description" : "Play 50 games in fire biome.", "xp_gain" : "600", "condition" : "50"},
            {"name" : "Fire Pilgrim", "description" : "Play 100 games in fire biome.", "xp_gain" : "1000", "condition" : "100"},

            {"name" : "Earth Explorer", "description" : "Play 5 games in earth biome.", "xp_gain" : "150", "condition" : "5"},
            {"name" : "Earth Wanderer", "description" : "Play 20 games in earth biome.", "xp_gain" : "300", "condition" : "20"},
            {"name" : "Earth Traveler", "description" : "Play 50 games in earth biome.", "xp_gain" : "600", "condition" : "50"},
            {"name" : "Earth Pilgrim", "description" : "Play 100 games in earth biome.", "xp_gain" : "1000", "condition" : "100"},



            {"name" : "ice Apprentice", "description" : "win 5 games in ice biome.", "xp_gain" : "200", "condition" : "5"},
            {"name" : "ice Adventurer", "description" : "win 20 games in ice biome.", "xp_gain" : "500", "condition" : "20"},
            {"name" : "ice Contender", "description" : "win 50 games in ice biome.", "xp_gain" : "1000", "condition" : "50"},
            {"name" : "ice Veteran", "description" : "win 100 games in ice biome.", "xp_gain" : "2000", "condition" : "100"},

            {"name" : "water Apprentice", "description" : "win 5 games in water biome.", "xp_gain" : "200", "condition" : "5"},
            {"name" : "water Adventurer", "description" : "win 20 games in water biome.", "xp_gain" : "500", "condition" : "20"},
            {"name" : "water Contender", "description" : "win 50 games in water biome.", "xp_gain" : "1000", "condition" : "50"},
            {"name" : "water Veteran", "description" : "win 100 games in water biome.", "xp_gain" : "2000", "condition" : "100"},

            {"name" : "Fire Apprentice", "description" : "win 5 games in fire biome.", "xp_gain" : "200", "condition" : "5"},
            {"name" : "Fire Adventurer", "description" : "win 20 games in fire biome.", "xp_gain" : "500", "condition" : "20"},
            {"name" : "Fire Contender", "description" : "win 50 games in fire biome.", "xp_gain" : "1000", "condition" : "50"},
            {"name" : "Fire Veteran", "description" : "win 100 games in fire biome.", "xp_gain" : "2000", "condition" : "100"},

            {"name" : "Earth Apprentice", "description" : "win 5 games in earth biome.", "xp_gain" : "200", "condition" : "5"},
            {"name" : "Earth Adventurer", "description" : "win 20 games in earth biome.", "xp_gain" : "500", "condition" : "20"},
            {"name" : "Earth Contender", "description" : "win 50 games in earth biome.", "xp_gain" : "1000", "condition" : "50"},
            {"name" : "Earth Veteran", "description" : "win 100 games in earth biome.", "xp_gain" : "2000", "condition" : "100"},



            {"name" : "Spark", "description" : "reach level 10 in the platform.", "xp_gain" : "250", "condition" : "10"},
            {"name" : "Momentum", "description" : "reach level 20 in the platform.", "xp_gain" : "500", "condition" : "20"},
            {"name" : "Edge", "description" : "reach level 50 in the platform.", "xp_gain" : "1000", "condition" : "50"},
            {"name" : "Pinnacle", "description" : "reach level 100 in the platform.", "xp_gain" : "2000", "condition" : "100"},
            {"name" : "Prime", "description" : "reach level 200 in the platform.", "xp_gain" : "4000", "condition" : "200"},
            {"name" : "Ascendant", "description" : "reach level 500 in the platform.", "xp_gain" : "8000", "condition" : "500"},


            {"name": "Triumphant Trio", "description": "Streak of 3 wins", "xp_gain": "5000", "condition": "3"},
            {"name": "Sizzling Six", "description": "Streak of 6 wins", "xp_gain": "10000", "condition": "6"},
            {"name": "Immortal", "description": "Streak of 12 wins", "xp_gain": "15000", "condition": "12"},
        ]

        for achievement in default_achievements:
            Achivement.objects.get_or_create(
                name=achievement["name"],
                defaults={
                    "description": achievement["description"],
                    "xp_gain": achievement["xp_gain"],
                    "condition": achievement["condition"],
                }
            )

        self.stdout.write(self.style.SUCCESS("Default achievements created successfully!"))
