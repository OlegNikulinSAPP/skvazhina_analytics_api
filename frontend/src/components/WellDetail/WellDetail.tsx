// frontend/src/components/WellDetail/WellDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { externalWellService } from '../../services/wellsService';

const WellDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [well, setWell] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadWell(id);
    }
  }, [id]);

  const loadWell = async (wellId: string) => {
    try {
      setLoading(true);
      const data = await externalWellService.getWellById(wellId);
      setWell(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка данных скважины...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!well) return <div>Скважина не найдена</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Скважина {well.well_id}</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Основные параметры</h3>
          <p><strong>Температура:</strong> {well.temperature}°C</p>
          <p><strong>Дебит:</strong> {well.flow_rate} м³/сут</p>
          <p><strong>Давление:</strong> {well.pressure} атм</p>
          <p><strong>Глубина:</strong> {well.depth} м</p>
          <p><strong>Статус:</strong> {well.status}</p>
        </div>

        {well.coordinates && (
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3>Координаты</h3>
            <p><strong>Широта:</strong> {well.coordinates.lat}</p>
            <p><strong>Долгота:</strong> {well.coordinates.lon}</p>
          </div>
        )}

        {well.operator && (
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3>Информация</h3>
            <p><strong>Оператор:</strong> {well.operator}</p>
            {well.field_name && <p><strong>Месторождение:</strong> {well.field_name}</p>}
            {well.installation_date && <p><strong>Дата установки:</strong> {well.installation_date}</p>}
          </div>
        )}
      </div>

      <button
        onClick={() => loadWell(id!)}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Обновить данные
      </button>
    </div>
  );
};

export default WellDetail;