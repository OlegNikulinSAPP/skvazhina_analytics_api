import math
import random
import time
import logging
from datetime import datetime, timedelta

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

logger = logging.getLogger(__name__)


# Генератор случайных данных скважин
def generate_mock_wells(count=3):
    """Генерирует случайные данные скважин"""
    wells = []
    for i in range(1, count + 1):
        # Базовые значения с небольшими случайными отклонениями
        base_temp = 80 + random.uniform(0, 25)
        base_flow = 50 + random.uniform(0, 150)
        base_pressure = 30 + random.uniform(0, 25)

        # Добавляем тренд по времени (чтобы данные менялись)
        time_factor = time.time() / 10000

        well = {
            "well_id": f"WELL-{i:03d}",
            "temperature": round(base_temp + random.uniform(-2, 2) + time_factor % 5, 1),
            "flow_rate": round(base_flow + random.uniform(-10, 10) + time_factor % 20, 1),
            "pressure": round(base_pressure + random.uniform(-1, 1) + time_factor % 3, 1),
            "coordinates": {
                "lat": 55.75 + random.uniform(-0.01, 0.01),
                "lon": 37.61 + random.uniform(-0.01, 0.01)
            },
            "depth": round(2000 + random.uniform(0, 1500), 1),
            "status": random.choice(["active", "active", "active", "maintenance", "inactive"]),
            "last_updated": datetime.now().isoformat()
        }
        wells.append(well)
    return wells


@require_GET
@csrf_exempt
def wells_list(request):
    """
    Эндпоинт: GET /api/v1/wells/
    Возвращает список всех скважин с телеметрией.
    Имитирует внешнее API системы мониторинга.
    """
    logger.info(f"Mock API: запрос списка скважин от {request.META.get('REMOTE_ADDR')}")

    # Имитация сетевой задержки (50-500ms)
    delay = random.uniform(0.05, 0.5)
    time.sleep(delay)

    # Имитация случайных сбоев API (3% случаев)
    if random.random() < 0.03:
        logger.warning("Mock API: имитация сбоя API (503)")
        return JsonResponse(
            {"error": "Service temporarily unavailable"},
            status=503,
            headers={"Retry-After": "30"}
        )

    # Генерируем данные
    count = random.randint(2, 10)  # Случайное количество скважин
    wells_data = generate_mock_wells(count)

    # Форматируем ответ как у реального API
    response_data = {
        "success": True,
        "data": {
            "wells": wells_data,
            "count": len(wells_data),
            "timestamp": datetime.now().isoformat(),
            "api_version": "1.0.0"
        }
    }

    logger.info(f"Mock API: возвращено {len(wells_data)} скважин")
    return JsonResponse(response_data)


@require_GET
@csrf_exempt
def well_detail(request, well_id):
    """
    Эндпоинт: GET /api/v1/wells/{well_id}/
    Возвращает данные конкретной скважины.
    """
    logger.info(f"Mock API: запрос скважины {well_id}")

    # Имитация задержки
    time.sleep(random.uniform(0.1, 0.3))

    # Парсим номер из well_id (формат "WELL-001")
    try:
        well_number = int(well_id.split("-")[1])
    except (IndexError, ValueError):
        logger.warning(f"Mock API: некорректный ID скважины {well_id}")
        return JsonResponse(
            {"error": f"Invalid well ID format: {well_id}"},
            status=400
        )

    # Проверяем существование скважины (только WELL-001..WELL-010)
    if well_number < 1 or well_number > 10:
        logger.warning(f"Mock API: скважина {well_id} не найдена")
        return JsonResponse(
            {"error": f"Well {well_id} not found"},
            status=404
        )

    # Генерируем данные для этой скважины
    wells_data = generate_mock_wells(well_number)  # Генерируем до нужного номера
    well_data = wells_data[-1]  # Берем последнюю (нужная нам)
    well_data["well_id"] = well_id  # Гарантируем правильный ID

    # Добавляем дополнительную информацию
    well_data.update({
        "installation_date": "2020-05-15",
        "field_name": random.choice(["Северное", "Южное", "Западное"]),
        "operator": random.choice(["Газпром", "Лукойл", "Роснефть"]),
        "last_maintenance": "2024-11-20"
    })

    response_data = {
        "success": True,
        "data": well_data
    }

    return JsonResponse(response_data)


@require_GET
@csrf_exempt
def well_telemetry(request, well_id):
    """
    Эндпоинт: GET /api/v1/wells/{well_id}/telemetry/
    Возвращает исторические данные телеметрии.
    Поддерживает параметры: hours=24, points=100
    """
    logger.info(f"Mock API: запрос телеметрии скважины {well_id}")

    # Имитация задержки
    time.sleep(random.uniform(0.2, 0.8))

    # Параметры запроса
    hours = int(request.GET.get("hours", 24))  # За сколько часов данные
    points = int(request.GET.get("points", 100))  # Количество точек
    points = min(points, 1000)  # Лимит

    # Проверяем существование скважины
    try:
        well_number = int(well_id.split("-")[1])
        if well_number < 1 or well_number > 10:
            return JsonResponse({"error": "Well not found"}, status=404)
    except:
        return JsonResponse({"error": "Invalid well ID"}, status=400)

    # Генерируем временные метки (последние N часов)
    now = time.time()
    timestamps = [
                     int(now - i * (hours * 3600 / points))
                     for i in range(points)
                 ][::-1]  # От старых к новым

    # Базовые значения с трендом и сезонностью
    base_temp = 80 + well_number * 2
    base_pressure = 35 + well_number * 1.5
    base_flow = 100 + well_number * 10

    # Генерируем телеметрию
    telemetry = {
        "timestamps": timestamps,
        "temperature": [],
        "pressure": [],
        "flow_rate": []
    }

    for i, ts in enumerate(timestamps):
        # Тренд + шум + сезонность (синус)
        time_factor = ts / 10000
        season = math.sin(time_factor) * 3  # Сезонные колебания
        noise = random.uniform(-1, 1)

        telemetry["temperature"].append(
            round(base_temp + season + noise + (i * 0.01), 1)
        )
        telemetry["pressure"].append(
            round(base_pressure + season * 0.5 + noise * 0.5, 1)
        )
        telemetry["flow_rate"].append(
            round(max(0, base_flow + season * 2 + noise * 2), 1)  # Не отрицательный
        )

    response_data = {
        "success": True,
        "data": {
            "well_id": well_id,
            "parameters": ["temperature", "pressure", "flow_rate"],
            "units": {"temperature": "°C", "pressure": "атм", "flow_rate": "м³/сут"},
            "telemetry": telemetry,
            "period_hours": hours,
            "points": points
        }
    }

    return JsonResponse(response_data)


@require_GET
@csrf_exempt
def health_check(request):
    """
    Эндпоинт: GET /api/v1/health/
    Проверка работоспособности API.
    Возвращает статус системы и метрики.
    """
    logger.info("Mock API: health check запрос")

    # Имитация быстрого ответа
    time.sleep(random.uniform(0.01, 0.05))

    # 1% шанс что API "упало"
    if random.random() < 0.01:
        logger.error("Mock API: имитация критического сбоя")
        return JsonResponse(
            {
                "status": "critical",
                "error": "Database connection failed",
                "timestamp": datetime.now().isoformat()
            },
            status=500
        )

    # Генерируем реалистичные метрики
    current_time = datetime.now()
    response_data = {
        "status": "healthy",
        "timestamp": current_time.isoformat(),
        "version": "1.0.0",
        "environment": "production",
        "metrics": {
            "uptime_seconds": random.randint(1000000, 2000000),  # 11-23 дня
            "memory_usage_mb": round(random.uniform(512, 2048), 1),
            "cpu_percent": round(random.uniform(5, 40), 1),
            "active_connections": random.randint(50, 200),
            "request_rate_per_minute": random.randint(100, 500),
            "last_cron_run": (current_time - timedelta(minutes=random.randint(0, 60))).isoformat()
        },
        "services": {
            "database": "online",
            "cache": "online",
            "message_queue": "online" if random.random() > 0.05 else "degraded",
            "storage": "online"
        },
        "response_time_ms": round(time.time() % 100, 2)  # Псевдослучайное время ответа
    }

    return JsonResponse(response_data)


@require_GET
@csrf_exempt
def api_root(request):
    """
    Корневой эндпоинт с информацией о API.
    """
    return JsonResponse({
        "api": "Mock Well Monitoring API",
        "version": "1.0.0",
        "description": "Имитация внешнего API системы мониторинга скважин",
        "endpoints": {
            "wells_list": "/api/v1/wells/",
            "well_detail": "/api/v1/wells/{id}/",
            "well_telemetry": "/api/v1/wells/{id}/telemetry/",
            "health": "/api/v1/health/"
        },
        "documentation": "См. техническое задание",
        "contact": "api.support@example.com"
    })
