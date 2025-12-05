from django.test import TestCase

# Create your tests here.
from django.contrib.auth.hashers import make_password, check_password

# Создаем хеш пароля
raw_password = "mysecret123"
hashed_password = make_password(raw_password)

print("Исходный пароль:", raw_password)
print("Хешированный пароль:", hashed_password)
print("Длина хеша:", len(hashed_password))
print("Тип данных:", type(hashed_password))