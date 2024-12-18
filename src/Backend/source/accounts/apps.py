from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from .models import Achievement
        from django.contrib.auth import get_user_model

        def create_admin_user(sender, **kwargs):
            User = get_user_model()
            admin_username = 'admin'
            admin_email = 'admin@example.com'
            admin_password = 'admin'

            if not User.objects.filter(username=admin_username).exists():
                User.objects.create_superuser(
                    username=admin_username,
                    email=admin_email,
                    password=admin_password
                )
                print(f"Admin user '{admin_username}' created successfully!")
            else:
                print(f"Admin user '{admin_username}' already exists.")

        def seed_achievements(sender, **kwargs):
            default_achievements = [
                # {"name" : "ice Explorer", "description" : "Play 5 games in ice biome.", "xp_gain" : 250, "condition" : 5},
                # {"name" : "ice Wanderer", "description" : "Play 20 games in ice biome.", "xp_gain" : 500, "condition" : 20},
                # {"name" : "ice Traveler", "description" : "Play 50 games in ice biome.", "xp_gain" : 1500, "condition" : 50},
                # {"name" : "ice Pilgrim", "description" : "Play 100 games in ice biome.", "xp_gain" : 2500, "condition" : 100},

                # {"name" : "water Explorer", "description" : "Play 5 games in water biome.", "xp_gain" : 250, "condition" : 5},
                # {"name" : "water Wanderer", "description" : "Play 20 games in water biome.", "xp_gain" : 500, "condition" : 20},
                # {"name" : "water Traveler", "description" : "Play 50 games in water biome.", "xp_gain" : 1500, "condition" : 50},
                # {"name" : "water Pilgrim", "description" : "Play 100 games in water biome.", "xp_gain" : 2500, "condition" : 100},

                # {"name" : "Fire Explorer", "description" : "Play 5 games in fire biome.", "xp_gain" : 250, "condition" : 5},
                # {"name" : "Fire Wanderer", "description" : "Play 20 games in fire biome.", "xp_gain" : 500, "condition" : 20},
                # {"name" : "Fire Traveler", "description" : "Play 50 games in fire biome.", "xp_gain" : 1500, "condition" : 50},
                # {"name" : "Fire Pilgrim", "description" : "Play 100 games in fire biome.", "xp_gain" : 2500, "condition" : 100},

                # {"name" : "Earth Explorer", "description" : "Play 5 games in earth biome.", "xp_gain" : 250, "condition" : 5},
                # {"name" : "Earth Wanderer", "description" : "Play 20 games in earth biome.", "xp_gain" : 500, "condition" : 20},
                # {"name" : "Earth Traveler", "description" : "Play 50 games in earth biome.", "xp_gain" : 1500, "condition" : 50},
                # {"name" : "Earth Pilgrim", "description" : "Play 100 games in earth biome.", "xp_gain" : 2500, "condition" : 100},



                # {"name" : "ice Apprentice", "description" : "win 5 games in ice biome.", "xp_gain" : 500, "condition" : 5},
                # {"name" : "ice Adventurer", "description" : "win 20 games in ice biome.", "xp_gain" : 1000, "condition" : 20},
                # {"name" : "ice Contender", "description" : "win 50 games in ice biome.", "xp_gain" : 2500, "condition" : 50},
                # {"name" : "ice Veteran", "description" : "win 100 games in ice biome.", "xp_gain" : 5000, "condition" : 100},

                # {"name" : "water Apprentice", "description" : "win 5 games in water biome.", "xp_gain" : 500, "condition" : 5},
                # {"name" : "water Adventurer", "description" : "win 20 games in water biome.", "xp_gain" : 1000, "condition" : 20},
                # {"name" : "water Contender", "description" : "win 50 games in water biome.", "xp_gain" : 2500, "condition" : 50},
                # {"name" : "water Veteran", "description" : "win 100 games in water biome.", "xp_gain" : 5000, "condition" : 100},

                # {"name" : "Fire Apprentice", "description" : "win 5 games in fire biome.", "xp_gain" : 500, "condition" : 5},
                # {"name" : "Fire Adventurer", "description" : "win 20 games in fire biome.", "xp_gain" : 1000, "condition" : 20},
                # {"name" : "Fire Contender", "description" : "win 50 games in fire biome.", "xp_gain" : 2500, "condition" : 50},
                # {"name" : "Fire Veteran", "description" : "win 100 games in fire biome.", "xp_gain" : 5000, "condition" : 100},

                # {"name" : "Earth Apprentice", "description" : "win 5 games in earth biome.", "xp_gain" : 500, "condition" : 5},
                # {"name" : "Earth Adventurer", "description" : "win 20 games in earth biome.", "xp_gain" : 1000, "condition" : 20},
                # {"name" : "Earth Contender", "description" : "win 50 games in earth biome.", "xp_gain" : 2500, "condition" : 50},
                # {"name" : "Earth Veteran", "description" : "win 100 games in earth biome.", "xp_gain" : 5000, "condition" : 100},



                # {"name" : "Spark", "description" : "reach level 10 in the platform.", "xp_gain" : 500, "condition" : 10},
                # {"name" : "Momentum", "description" : "reach level 20 in the platform.", "xp_gain" : 1000, "condition" : 20},
                # {"name" : "Edge", "description" : "reach level 50 in the platform.", "xp_gain" : 2500, "condition" : 50},
                # {"name" : "Pinnacle", "description" : "reach level 100 in the platform.", "xp_gain" : 5000, "condition" : 100},
                # {"name" : "Prime", "description" : "reach level 200 in the platform.", "xp_gain" : 10000, "condition" : 200},
                # {"name" : "Ascendant", "description" : "reach level 500 in the platform.", "xp_gain" : 20000, "condition" : 500},


                # done
                {"name": "Triumphant Trio", "description": "Streak of 3 wins", "xp_gain": 5000, "condition": 1},
                {"name": "Sizzling Six", "description": "Streak of 6 wins", "xp_gain": 10000, "condition": 1},
                {"name": "Immortal", "description": "Streak of 12 wins", "xp_gain": 15000, "condition": 1},

                {"name": "khriz man pro max 1", "description": "loss 3 matches in row", "xp_gain": 69, "condition": 1},
                {"name": "khriz man pro max 2", "description": "loss 6 matches in row", "xp_gain": 69, "condition": 1},
                {"name": "khriz man pro max 3", "description": "loss 12 matches in row", "xp_gain": 69, "condition": 1},


                # done
                {"name": "khriz man 1", "description": "loss with 0 points to 10", "xp_gain": 69, "condition": 1},
                {"name": "khriz man 2", "description": "loss with 0 points to 20", "xp_gain": 69, "condition": 1},
                {"name": "khriz man 3", "description": "loss with 0 points to 30", "xp_gain": 69, "condition": 1},

                {"name": "Flawless Victory", "description": "Win a match without conceding a single point (10 to 0).", "xp_gain": 1000, "condition": 1},
                {"name": "Perfect Run", "description": "Achieve a dominant win by scoring 20 points (20 to 0).", "xp_gain": 2500, "condition": 1},
                {"name": "Unstoppable", "description": "Completely shut out the opponent with a 30-point streak (30 to 0).", "xp_gain": 5000, "condition": 1},
            ]

            for achievement in default_achievements:
                Achievement.objects.get_or_create(
                    name=achievement["name"],
                    defaults={
                        "description": achievement["description"],
                        "xp_gain": achievement["xp_gain"],
                        "condition": achievement["condition"],
                    },
                )

        post_migrate.connect(create_admin_user, sender=self)
        post_migrate.connect(seed_achievements, sender=self)
