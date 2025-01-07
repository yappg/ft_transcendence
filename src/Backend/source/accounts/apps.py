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
            admin_email = 'admin@django.com'
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
            if Achievement.objects.count() == 0:
                default_achievements = [
                    {"name" : "Air Explorer", "description" : "Play 5 games in air biome.", "xp_gain" : 250, "condition" : 5, "image" : "achievements/colored/air/1.png" , "image_bw" : "achievements/bw/air/1.png"},
                    {"name" : "Air Wanderer", "description" : "Play 20 games in air biome.", "xp_gain" : 500, "condition" : 20, "image" : "achievements/colored/air/2.png", "image_bw" : "achievements/bw/air/2.png"},
                    {"name" : "Air Traveler", "description" : "Play 50 games in air biome.", "xp_gain" : 1500, "condition" : 50, "image" : "achievements/colored/air/3.png", "image_bw" : "achievements/bw/air/3.png"},
                    {"name" : "Air Pilgrim", "description" : "Play 100 games in air biome.", "xp_gain" : 2500, "condition" : 100, "image" : "achievements/colored/air/4.png", "image_bw" : "achievements/bw/air/4.png"},

                    {"name" : "Water Explorer", "description" : "Play 5 games in water biome.", "xp_gain" : 250, "condition" : 5, "image" : "achievements/colored/water/1.png", "image_bw" : "achievements/bw/water/1.png"},
                    {"name" : "Water Wanderer", "description" : "Play 20 games in water biome.", "xp_gain" : 500, "condition" : 20, "image" : "achievements/colored/water/2.png", "image_bw" : "achievements/bw/water/2.png"},
                    {"name" : "Water Traveler", "description" : "Play 50 games in water biome.", "xp_gain" : 1500, "condition" : 50, "image" : "achievements/colored/water/3.png", "image_bw" : "achievements/bw/water/3.png"},
                    {"name" : "Water Pilgrim", "description" : "Play 100 games in water biome.", "xp_gain" : 2500, "condition" : 100, "image" : "achievements/colored/water/4.png", "image_bw" : "achievements/bw/water/4.png"},

                    {"name" : "Fire Explorer", "description" : "Play 5 games in fire biome.", "xp_gain" : 250, "condition" : 5, "image" : "achievements/colored/fire/1.png", "image_bw" : "achievements/bw/fire/1.png"},
                    {"name" : "Fire Wanderer", "description" : "Play 20 games in fire biome.", "xp_gain" : 500, "condition" : 20, "image" : "achievements/colored/fire/2.png", "image_bw" : "achievements/bw/fire/2.png"},
                    {"name" : "Fire Traveler", "description" : "Play 50 games in fire biome.", "xp_gain" : 1500, "condition" : 50, "image" : "achievements/colored/fire/3.png", "image_bw" : "achievements/bw/fire/3.png"},
                    {"name" : "Fire Pilgrim", "description" : "Play 100 games in fire biome.", "xp_gain" : 2500, "condition" : 100, "image" : "achievements/colored/fire/4.png", "image_bw" : "achievements/bw/fire/4.png"},

                    {"name" : "Earth Explorer", "description" : "Play 5 games in earth biome.", "xp_gain" : 250, "condition" : 5, "image" : "achievements/colored/earth/1.png", "image_bw" : "achievements/bw/earth/1.png"},
                    {"name" : "Earth Wanderer", "description" : "Play 20 games in earth biome.", "xp_gain" : 500, "condition" : 20, "image" : "achievements/colored/earth/2.png", "image_bw" : "achievements/bw/earth/2.png"},
                    {"name" : "Earth Traveler", "description" : "Play 50 games in earth biome.", "xp_gain" : 1500, "condition" : 50, "image" : "achievements/colored/earth/3.png", "image_bw" : "achievements/bw/earth/3.png"},
                    {"name" : "Earth Pilgrim", "description" : "Play 100 games in earth biome.", "xp_gain" : 2500, "condition" : 100, "image" : "achievements/colored/earth/4.png", "image_bw" : "achievements/bw/earth/4.png"},


                    {"name" : "Air Apprentice", "description" : "win 5 games in air biome.", "xp_gain" : 500, "condition" : 5, "image" : "achievements/colored/air/5.png", "image_bw" : "achievements/bw/air/5.png"},
                    {"name" : "Air Adventurer", "description" : "win 20 games in air biome.", "xp_gain" : 1000, "condition" : 20, "image" : "achievements/colored/air/6.png", "image_bw" : "achievements/bw/air/6.png"},
                    {"name" : "Air Contender", "description" : "win 50 games in air biome.", "xp_gain" : 2500, "condition" : 50, "image" : "achievements/colored/air/7.png", "image_bw" : "achievements/bw/air/7.png"},
                    {"name" : "Air Veteran", "description" : "win 100 games in air biome.", "xp_gain" : 5000, "condition" : 100, "image" : "achievements/colored/air/8.png", "image_bw" : "achievements/bw/air/8.png"},

                    {"name" : "Water Apprentice", "description" : "win 5 games in water biome.", "xp_gain" : 500, "condition" : 5, "image" : "achievements/colored/water/5.png", "image_bw" : "achievements/bw/water/5.png"},
                    {"name" : "Water Adventurer", "description" : "win 20 games in water biome.", "xp_gain" : 1000, "condition" : 20, "image" : "achievements/colored/water/6.png", "image_bw" : "achievements/bw/water/6.png"},
                    {"name" : "Water Contender", "description" : "win 50 games in water biome.", "xp_gain" : 2500, "condition" : 50, "image" : "achievements/colored/water/7.png", "image_bw" : "achievements/bw/water/7.png"},
                    {"name" : "Water Veteran", "description" : "win 100 games in water biome.", "xp_gain" : 5000, "condition" : 100, "image" : "achievements/colored/water/8.png", "image_bw" : "achievements/bw/water/8.png"},

                    {"name" : "Fire Apprentice", "description" : "win 5 games in fire biome.", "xp_gain" : 500, "condition" : 5, "image" : "achievements/colored/fire/5.png", "image_bw" : "achievements/bw/fire/5.png"},
                    {"name" : "Fire Adventurer", "description" : "win 20 games in fire biome.", "xp_gain" : 1000, "condition" : 20, "image" : "achievements/colored/fire/6.png", "image_bw" : "achievements/bw/fire/6.png"},
                    {"name" : "Fire Contender", "description" : "win 50 games in fire biome.", "xp_gain" : 2500, "condition" : 50, "image" : "achievements/colored/fire/7.png", "image_bw" : "achievements/bw/fire/7.png"},
                    {"name" : "Fire Veteran", "description" : "win 100 games in fire biome.", "xp_gain" : 5000, "condition" : 100, "image" : "achievements/colored/fire/8.png", "image_bw" : "achievements/bw/fire/8.png"},

                    {"name" : "Earth Apprentice", "description" : "win 5 games in earth biome.", "xp_gain" : 500, "condition" : 5, "image" : "achievements/colored/earth/5.png", "image_bw" : "achievements/bw/earth/5.png"},
                    {"name" : "Earth Adventurer", "description" : "win 20 games in earth biome.", "xp_gain" : 1000, "condition" : 20, "image" : "achievements/colored/earth/6.png", "image_bw" : "achievements/bw/earth/6.png"},
                    {"name" : "Earth Contender", "description" : "win 50 games in earth biome.", "xp_gain" : 2500, "condition" : 50, "image" : "achievements/colored/earth/7.png", "image_bw" : "achievements/bw/earth/7.png"},
                    {"name" : "Earth Veteran", "description" : "win 100 games in earth biome.", "xp_gain" : 5000, "condition" : 100, "image" : "achievements/colored/earth/8.png", "image_bw" : "achievements/bw/earth/8.png"},


                    {"name" : "Spark", "description" : "reach level 10 in the platform.", "xp_gain" : 500, "condition" : 10, "image" : "achievements/colored/level/1.png", "image_bw" : "achievements/bw/level/1.png"},
                    {"name" : "Momentum", "description" : "reach level 20 in the platform.", "xp_gain" : 1000, "condition" : 20, "image" : "achievements/colored/level/2.png", "image_bw" : "achievements/bw/level/2.png"},
                    {"name" : "Edge", "description" : "reach level 50 in the platform.", "xp_gain" : 2500, "condition" : 50, "image" : "achievements/colored/level/3.png", "image_bw" : "achievements/bw/level/3.png"},
                    {"name" : "Pinnacle", "description" : "reach level 100 in the platform.", "xp_gain" : 5000, "condition" : 100, "image" : "achievements/colored/level/4.png", "image_bw" : "achievements/bw/level/4.png"},
                    {"name" : "Prime", "description" : "reach level 200 in the platform.", "xp_gain" : 10000, "condition" : 200, "image" : "achievements/colored/level/5.png", "image_bw" : "achievements/bw/level/5.png"},
                    {"name" : "Ascendant", "description" : "reach level 500 in the platform.", "xp_gain" : 20000, "condition" : 500, "image" : "achievements/colored/level/6.png", "image_bw" : "achievements/bw/level/6.png"},


                    {"name": "Flawless Victory", "description": "Win a match without conceding a single point (10 to 0).", "xp_gain": 1000, "condition": 1, "image" : "achievements/colored/winner/1.png", "image_bw" : "achievements/bw/winner/1.png"},
                    {"name": "Perfect Run", "description": "Achieve a dominant win by scoring 20 points (20 to 0).", "xp_gain": 2500, "condition": 1, "image" : "achievements/colored/winner/2.png", "image_bw" : "achievements/bw/winner/2.png"},
                    {"name": "Unstoppable", "description": "Completely shut out the opponent with a 30-point streak (30 to 0).", "xp_gain": 5000, "condition": 1, "image" : "achievements/colored/winner/3.png", "image_bw" : "achievements/bw/winner/3.png"},

                    {"name": "Triumphant Trio", "description": "Streak of 3 wins", "xp_gain": 5000, "condition": 3, "image" : "achievements/colored/winner/4.png", "image_bw" : "achievements/bw/winner/4.png"},
                    {"name": "Sizzling Six", "description": "Streak of 6 wins", "xp_gain": 10000, "condition": 6, "image" : "achievements/colored/winner/5.png", "image_bw" : "achievements/bw/winner/5.png"},
                    {"name": "Immortal", "description": "Streak of 12 wins", "xp_gain": 15000, "condition": 12, "image" : "achievements/colored/winner/6.png", "image_bw" : "achievements/bw/winner/6.png"},


                    {"name": "khriz man 1", "description": "loss with 0 points to 10", "xp_gain": 69, "condition": 1, "image" : "achievements/colored/losser/1.png", "image_bw" : "achievements/bw/losser/1.png"},
                    {"name": "khriz man 2", "description": "loss with 0 points to 20", "xp_gain": 69, "condition": 1, "image" : "achievements/colored/losser/2.png", "image_bw" : "achievements/bw/losser/2.png"},
                    {"name": "khriz man 3", "description": "loss with 0 points to 30", "xp_gain": 69, "condition": 1, "image" : "achievements/colored/losser/3.png", "image_bw" : "achievements/bw/losser/3.png"},

                    {"name": "khriz man pro max 1", "description": "loss 3 matches in row", "xp_gain": 69, "condition": 3, "image" : "achievements/colored/losser/4.png", "image_bw" : "achievements/bw/losser/4.png"},
                    {"name": "khriz man pro max 2", "description": "loss 6 matches in row", "xp_gain": 69, "condition": 6, "image" : "achievements/colored/losser/5.png", "image_bw" : "achievements/bw/losser/5.png"},
                    {"name": "khriz man pro max 3", "description": "loss 12 matches in row", "xp_gain": 69, "condition": 12, "image" : "achievements/colored/losser/6.png", "image_bw" : "achievements/bw/losser/6.png"},
                ]

                for achievement in default_achievements:
                    Achievement.objects.get_or_create(
                        name=achievement["name"],
                        defaults={
                            "description": achievement["description"],
                            "xp_gain": achievement["xp_gain"],
                            "condition": achievement["condition"],
                            "image": achievement["image"],
                            "image_bw": achievement["image_bw"],
                        },
                    )
        post_migrate.connect(create_admin_user, sender=self, weak=False)
        post_migrate.connect(seed_achievements, sender=self, weak=False)
