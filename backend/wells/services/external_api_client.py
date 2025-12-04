from typing import List, Dict, Optional
import logging


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class ExternalWellDataClient:
    """
    Клиент для получения данных скважин из внешней системы мониторинга.
    Пока реализован как mock-сервис с тестовыми данными.
    """
    def __init__(self, api_url: str, api_key: str, timeout: int = 30):
        self.api_url = api_url
        self.api_key = api_key
        self.timeout = timeout
        self.logger = logging.getLogger(__name__)

        # Mock-данные для тестирования (по ТЗ п.2.3)
        self.mock_wells_data = [
            {
                "well_id": "WELL-001",
                "temperature": 85.5,
                "flow_rate": 120.3,
                "pressure": 45.2,
                "coordinates": {"lat": 55.7558, "lon": 37.6173},
                "depth": 2450.0,
                "status": "active"
            },
            {
                "well_id": "WELL-002",
                "temperature": 92.1,
                "flow_rate": 95.7,
                "pressure": 38.9,
                "coordinates": {"lat": 55.7512, "lon": 37.6185},
                "depth": 3100.5,
                "status": "active"
            },
            {
                "well_id": "WELL-003",
                "temperature": 65.3,
                "flow_rate": 0.0,
                "pressure": 12.1,
                "coordinates": {"lat": 55.7498, "lon": 37.6199},
                "depth": 1800.0,
                "status": "maintenance"
            }
        ]

    def get_wells_data(self) -> List[Dict]:
        """
        Получает данные всех скважин из внешнего API.
        Пока возвращает mock-данные для тестирования.

        Returns:
            Список словарей с данными скважин

        Raises:
            ConnectionError: Если не удается подключиться к API

        Пример возвращаемого значения:
            [
                {"well_id": "WELL-001", "temperature": 85.5, ...},
                {"well_id": "WELL-002", "temperature": 92.1, ...}
            ]
        """
        self.logger.info("Запрос данных скважин из внешнего API (mock)")

        try:
            # Имитация сетевой задержки
            import time
            time.sleep(0.5)  # 500ms задержка как у реального API

            # Имитация случайной ошибки подключения (10% случаев)
            import random
            if random.random() < 0.1:
                raise ConnectionError("Не удалось подключиться к внешнему API")

            return self.mock_wells_data

        except ConnectionError as e:
            self.logger.error(f"Ошибка подключения: {e}")
            raise
        except Exception as e:
            self.logger.error(f"Неожиданная ошибка: {e}")
            raise

    def get_well_by_id(self, well_id: str) -> Optional[Dict]:
        """
        Получает данные конкретной скважины по её идентификатору.

        Args:
            well_id: Уникальный идентификатор скважины (например, "WELL-001")

        Returns:
            Словарь с данными скважины или None если скважина не найдена

        Пример:
            get_well_by_id("WELL-001") -> {"well_id": "WELL-001", "temperature": 85.5, ...}
        """
        self.logger.info(f"Запрос данных скважины {well_id}")

        for well in self.mock_wells_data:
            if well["well_id"] == well_id:
                return well

        self.logger.warning(f"Скважина с ID {well_id} не найдена")
        return None

    def get_well_telemetry(self, well_id: str) -> Optional[Dict[str, List[float]]]:
        """
        Получает исторические данные телеметрии скважины.
        Пока генерирует случайные данные в реальном времени.

        Args:
            well_id: Уникальный идентификатор скважины

        Returns:
            Словарь с временными рядами телеметрии или None если скважина не найдена
            Формат: {"temperature": [85.5, 85.7, 86.0], "pressure": [45.2, 45.1, 45.3], ...}
        """
        import random
        import time

        well = self.get_well_by_id(well_id)
        if not well:
            return None

        # Генерируем 10 последних значений с небольшими случайными отклонениями
        base_temp = well["temperature"]
        base_pressure = well["pressure"]
        base_flow = well["flow_rate"]

        # Текущее время для seed генератора случайных чисел
        current_seed = int(time.time())
        random.seed(current_seed)

        telemetry = {
            "timestamps": [int(time.time() - i * 300) for i in range(10)],  # 10 точек, каждые 5 минут
            "temperature": [
                round(base_temp + random.uniform(-2, 2), 1)
                for _ in range(10)
            ],
            "pressure": [
                round(base_pressure + random.uniform(-1, 1), 1)
                for _ in range(10)
            ],
            "flow_rate": [
                max(0, round(base_flow + random.uniform(-5, 5), 1))  # Дебит не может быть отрицательным
                for _ in range(10)
            ]
        }

        self.logger.debug(f"Сгенерирована телеметрия для скважины {well_id}")
        return telemetry

    @classmethod
    def create_mock_client(cls) -> "ExternalWellDataClient":
        """
        Фабричный метод для создания mock-клиента с тестовыми настройками.

        Returns:
            Экземпляр ExternalWellDataClient с предустановленными параметрами

        Использование:
            client = ExternalWellDataClient.create_mock_client()
            wells = client.get_wells_data()
        """
        return cls(
            api_url="https://mock.well-monitoring-api.com/v1",
            api_key="test_api_key_12345",
            timeout=30
        )

    def check_health(self) -> Dict[str, any]:
        """
        Проверяет доступность и работоспособность внешнего API.

        Returns:
            Словарь со статусом и метриками подключения
            Пример: {"status": "healthy", "response_time": 0.15, "version": "1.0.0"}

        Raises:
            ConnectionError: Если API недоступно
        """
        import time

        self.logger.info("Проверка здоровья внешнего API")

        start_time = time.time()

        try:
            # Имитация проверки API (в реальности - HTTP HEAD запрос)
            time.sleep(0.1)  # Имитация сетевой задержки

            response_time = time.time() - start_time

            # Имитация 5% вероятности сбоя API
            import random
            if random.random() < 0.05:
                raise ConnectionError("Внешний API временно недоступен")

            return {
                "status": "healthy",
                "response_time": round(response_time, 3),
                "version": "1.0.0",
                "timestamp": int(time.time())
            }

        except ConnectionError as e:
            self.logger.error(f"API недоступно: {e}")
            raise
        except Exception as e:
            self.logger.error(f"Ошибка при проверке здоровья API: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": int(time.time())
            }


if __name__ == "__main__":
    """
    Пример использования ExternalWellDataClient.
    Запустите этот файл для тестирования: python external_api_client.py
    """
    print("=== Тестирование ExternalWellDataClient ===")

    # 1. Создаем mock-клиент
    client = ExternalWellDataClient.create_mock_client()
    print("✓ Mock-клиент создан")

    # 2. Проверяем здоровье API
    try:
        health = client.check_health()
        print(f"✓ API здоров: {health}")
    except ConnectionError:
        print("✗ API недоступно (ожидаемое поведение для теста)")

    # 3. Получаем список скважин
    wells = client.get_wells_data()
    print(f"✓ Получено {len(wells)} скважин")

    # 4. Получаем данные конкретной скважины
    if wells:
        first_well_id = wells[0]["well_id"]
        well_data = client.get_well_by_id(first_well_id)
        print(f"✓ Данные скважины {first_well_id}: {well_data['temperature']}°C")

    # 5. Получаем телеметрию
    telemetry = client.get_well_telemetry(first_well_id)
    if telemetry:
        print(f"✓ Телеметрия: {len(telemetry['temperature'])} точек данных")
        print(f"  Температуры: {telemetry['temperature'][:3]}...")  # Первые 3 значения

    print("=== Тестирование завершено ===")
