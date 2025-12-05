from django.db import models
from django.contrib.auth.models import AbstractUser


class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Администратор'
    OPERATOR = 'operator', 'Оператор'
    VIEWER = 'viewer', 'Наблюдатель'
    GUEST = 'guest', 'Гость'


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.VIEWER,
    )
