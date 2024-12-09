from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# from django.conf import settings
from django.db import models, transaction
from django.db.models import Q
import string
import random
from django.core.exceptions import ValidationError

def get_dynamic_k_factor(player):
    """
    Determine the K-factor based on the player's ELO rating and activity.

    :param player: PlayerProfile instance
    :return: Integer K-factor
    """
    if player.games_played < 30:
        return 40  # Higher K-factor for new players
    elif player.elo_rating < 1600:
        return 32
    elif player.elo_rating < 2000:
        return 24
    else:
        return 16  # Lower K-factor for highly skilled players


def calculate_elo(winner_rating, loser_rating, k_winner, k_loser):
    """
    Calculate new ELO ratings for winner and loser with dynamic K-factors.

    :param winner_rating: Current ELO of the winner
    :param loser_rating: Current ELO of the loser
    :param k_winner: K-factor for the winner
    :param k_loser: K-factor for the loser
    :return: Tuple of (new_winner_rating, new_loser_rating)
    """
    expected_win = 1 / (1 + 10 ** ((loser_rating - winner_rating) / 400))
    expected_loss = 1 / (1 + 10 ** ((winner_rating - loser_rating) / 400))

    new_winner_rating = winner_rating + k_winner * (1 - expected_win)
    new_loser_rating = loser_rating + k_loser * (0 - expected_loss)

    return round(new_winner_rating), round(new_loser_rating)


def calculate_draw_elo(p1_elo, p2_elo, k_p1, k_p2):
    """
    Calculate new ELO ratings for both players after a draw.

    :param p1_elo: Player 1's current ELO
    :param p2_elo: Player 2's current ELO
    :param k_p1: Player 1's K-factor
    :param k_p2: Player 2's K-factor
    :return: Tuple of (new_p1_elo, new_p2_elo)
    """
    expected_p1 = 1 / (1 + 10 ** ((p2_elo - p1_elo) / 400))
    expected_p2 = 1 / (1 + 10 ** ((p1_elo - p2_elo) / 400))

    new_p1_elo = p1_elo + k_p1 * (0.5 - expected_p1)
    new_p2_elo = p2_elo + k_p2 * (0.5 - expected_p2)

    return round(new_p1_elo), round(new_p2_elo)



def calculate_level(xp, max_level=200):
    """
    Calculate the player's level based on their accumulated XP.
    The required XP increases as the level increases.

    :param xp: Integer representing the player's current XP
    :param max_level: Integer representing the maximum level (default is 200)
    :return: Integer representing the player's level
    """
    level = 1
    while level < max_level:
        # Example formula: required_xp increases quadratically
        required_xp = 100 * level + 10 * (level ** 2)
        if xp >= required_xp:
            level += 1
        else:
            break
    return level


def get_xp_for_match(won, current_level):
    """
    Determine the XP awarded based on match outcome and current level.

    :param won: Boolean indicating if the player won the match
    :param current_level: Integer representing the player's current level
    :return: Integer representing the XP awarded
    """
    base_xp_win = 50
    base_xp_loss = 20
    if won:
        # XP decreases required to gain as level increases
        xp = base_xp_win - (current_level // 10)
        return max(xp, 10)  # Ensure a minimum XP gain
    else:
        xp = base_xp_loss - (current_level // 20)
        return max(xp, 5)  # Ensure a minimum XP gain


def reset_elo_ratings():
    """
    Reset ELO ratings for all players to the default value.
    This function should be called monthly via a scheduled task.
    """
    from .models import PlayerProfile
    PlayerProfile.objects.update(elo_rating=1000)


def calculate_draw_elo(p1_elo, p2_elo, k_p1, k_p2):
    """
    Calculate new ELO ratings for both players after a draw.

    :param p1_elo: Player 1's current ELO
    :param p2_elo: Player 2's current ELO
    :param k_p1: Player 1's K-factor
    :param k_p2: Player 2's K-factor
    :return: Tuple of (new_p1_elo, new_p2_elo)
    """
    expected_p1 = 1 / (1 + 10 ** ((p2_elo - p1_elo) / 400))
    expected_p2 = 1 / (1 + 10 ** ((p1_elo - p2_elo) / 400))

    new_p1_elo = p1_elo + k_p1 * (0.5 - expected_p1)
    new_p2_elo = p2_elo + k_p2 * (0.5 - expected_p2)

    return round(new_p1_elo), round(new_p2_elo)


# auth user
class Player(AbstractUser):
    enabled_2fa=models.BooleanField(default=False)
    verified_otp=models.BooleanField(default=False)
    otp_secret_key=models.CharField(max_length=255, default=None, null=True, blank=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Player'
        verbose_name_plural = 'Players'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            PlayerProfile.objects.create(player=self)
            PlayerSettings.objects.create(player_profile=self.profile)

class PlayerProfile(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='profile')

    is_online=models.BooleanField(default=False)

    display_name = models.CharField(max_length=50, unique=True, blank=False)

    bio = models.TextField(max_length=500, blank=True)

    avatar = models.ImageField(
        upload_to='avatars/',
        default='avatars/.defaultAvatar.jpeg'
    )
    cover = models.ImageField(
        upload_to='covers/',
        default='covers/.defaultCover.jpeg'
    )

    elo_rating = models.IntegerField(default=1000)
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)

    games_played = models.PositiveIntegerField(default=0) # TODO make bioms where the game was played
    games_won = models.PositiveIntegerField(default=0)
    games_loss = models.PositiveIntegerField(default=0)
    win_ratio = models.FloatField(default=0.0)

    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} (Rank: {self.rank_points})"

    class Meta:
        ordering = ['-rank_points']
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

    def save(self, *args, **kwargs):
        if not self.display_name:
            max_attempts = 10
            for attempt in range(max_attempts):
                random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
                potential_name = f"Player_{random_suffix}"
                if not PlayerProfile.objects.filter(display_name=potential_name).exists():
                    self.display_name = potential_name
                    break
            else:
                raise ValueError("Unable to generate a unique display name after multiple attempts.")

        super().save(*args, **kwargs)

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def update_level(self):
        """
        Update the player's level based on current XP.
        Ensures that the level only increases and never decreases.
        Caps the level at 200.
        """
        new_level = calculate_level(self.xp, max_level=200)
        if new_level > self.level:
            self.level = new_level
            self.save(update_fields=['level'])

    def update_win_ratio(self):
        """
        Update the player's win ratio.
        """
        total_games = self.games_won + self.games_loss
        if total_games > 0:
            self.win_ratio = round((self.games_won / total_games) * 100, 2)
        else:
            self.win_ratio = 0.0
        self.save(update_fields=['win_ratio'])

    def all_matches(self):
        return MatchHistory.objects.filter(Q(player1=self) | Q(player2=self)).order_by('-date')


class PlayerSettings(models.Model):
    player_profile = models.OneToOneField(PlayerProfile, on_delete=models.CASCADE, related_name="settings")

    private_profile = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.player_profile.display_name}"

    class Meta:
        verbose_name = 'Player Settings'
        verbose_name_plural = 'Player Settings'


class MatchHistory(models.Model):
    RESULT_CHOICES = [
        ('player1', 'player1 Wins'),
        ('player2', 'player2 Wins'),
        ('Draw', 'Draw'),
    ]

    # add biom where the game was played

    result = models.CharField(max_length=10, choices=RESULT_CHOICES)

    player1 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player2')

    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)

    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player1.display_name} vs {self.player2.display_name} on {self.date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-date']
        verbose_name = 'Match History'
        verbose_name_plural = 'Match Histories'

    def save(self, *args, **kwargs):
        if self.player1 == self.player2:
            raise ValidationError("A player cannot play against themselves.")

        with transaction.atomic():
            # Update games played
            self.player1.games_played += 1
            self.player2.games_played += 1

            # Determine match outcome and allocate XP
            if self.result == "player1":
                self.player1.games_won += 1
                self.player2.games_loss += 1
                winner = self.player1
                loser = self.player2
                xp_awarded = get_xp_for_match(won=True, current_level=winner.level)
                xp_lost = get_xp_for_match(won=False, current_level=loser.level)
            elif self.result == "player2":
                self.player2.games_won += 1
                self.player1.games_loss += 1
                winner = self.player2
                loser = self.player1
                xp_awarded = get_xp_for_match(won=True, current_level=winner.level)
                xp_lost = get_xp_for_match(won=False, current_level=loser.level)
            elif self.result == "Draw":
                winner = None
                loser = None
                xp_awarded_p1 = get_xp_for_match(won=False, current_level=self.player1.level)
                xp_awarded_p2 = get_xp_for_match(won=False, current_level=self.player2.level)


            # Update XP and levels
            if self.result in ["player1", "player2"]:
                winner.xp += xp_awarded
                loser.xp += xp_lost
                winner.save(update_fields=['xp'])
                loser.save(update_fields=['xp'])

                winner.update_level()
                loser.update_level()

                # Update ELO ratings
                k_winner = get_dynamic_k_factor(winner)
                k_loser = get_dynamic_k_factor(loser)

                new_winner_elo, new_loser_elo = calculate_elo(
                    winner.elo_rating,
                    loser.elo_rating,
                    k_winner,
                    k_loser
                )

                winner.elo_rating = new_winner_elo
                loser.elo_rating = new_loser_elo

                winner.save(update_fields=['elo_rating'])
                loser.save(update_fields=['elo_rating'])
            elif self.result == "Draw":
                self.player1.xp += xp_awarded_p1
                self.player2.xp += xp_awarded_p2
                self.player1.save(update_fields=['xp'])
                self.player2.save(update_fields=['xp'])

                self.player1.update_level()
                self.player2.update_level()

                # Update ELO ratings for draw
                # from .utils import calculate_draw_elo

                new_p1_elo, new_p2_elo = calculate_draw_elo(
                    self.player1.elo_rating,
                    self.player2.elo_rating,
                    get_dynamic_k_factor(self.player1),
                    get_dynamic_k_factor(self.player2)
                )

                self.player1.elo_rating = new_p1_elo
                self.player2.elo_rating = new_p2_elo

                self.player1.save(update_fields=['elo_rating'])
                self.player2.save(update_fields=['elo_rating'])

            # Update win ratio
            self.player1.update_win_ratio()
            self.player2.update_win_ratio()

            # Save updated match history
            super().save(*args, **kwargs)
