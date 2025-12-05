import React, { useEffect, useState } from 'react';
import { externalWellService, WellData } from '../../services/wellsService';
import { authService } from '../../services/authService';

const Dashboard: React.FC = () => {
  console.log('🎯 Dashboard component RENDERING');

  // ВСЕ хуки объявляем в начале (правильный порядок)
  const [isAuthenticated] = useState(authService.isAuthenticated());
  const [wells, setWells] = useState<WellData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<string>('unknown');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      // Проверяем здоровье API
      const health = await externalWellService.checkHealth();
      setApiStatus(health.status);

      // Загружаем список скважин
      const wellsData = await externalWellService.getWells();
      setWells(wellsData);
      setLastUpdated(new Date());

    } catch (err: any) {
      console.error('Ошибка загрузки данных:', err);
      setError(err.message || 'Не удалось загрузить данные');
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Функция для перевода статуса
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      'active': 'Работает',
      'maintenance': 'Техобслуживание',
      'inactive': 'Остановлена'
    };
    return translations[status] || status;
  };

  if (loading && wells.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#333' }}>Загрузка данных из mock API...</h2>
        <p style={{ color: '#666' }}>Пожалуйста, подождите</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #ddd',
          borderTopColor: '#1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && wells.length === 0) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#d32f2f' }}>Ошибка загрузки данных</h2>
        <p style={{ color: '#c62828' }}>{error}</p>
        <button
          onClick={loadData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{
          color: '#1976d2',
          marginTop: 0,
          marginBottom: '10px'
        }}>
          📊 Панель мониторинга скважин
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Данные из {externalWellService.getCurrentMode() === 'mock' ? 'MOCK' : 'реального'} API
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <button
            onClick={loadData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Обновить данные
          </button>

          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '8px 15px',
            borderRadius: '4px',
            color: '#2e7d32',
            fontWeight: 'bold'
          }}>
            📡 Режим: {externalWellService.getCurrentMode() === 'mock' ? 'MOCK API' : 'REAL API'}
          </div>

          <div style={{
            backgroundColor: apiStatus === 'healthy' ? '#e8f5e9' : '#ffebee',
            padding: '8px 15px',
            borderRadius: '4px',
            color: apiStatus === 'healthy' ? '#2e7d32' : '#d32f2f',
            fontWeight: 'bold'
          }}>
            API: {apiStatus === 'healthy' ? '✅ Здоров' : '❌ Проблемы'}
          </div>

          <div style={{ color: '#666' }}>
            Скважин: <strong>{wells.length}</strong>
          </div>

          {lastUpdated && (
            <div style={{ color: '#999', fontSize: '0.9rem' }}>
              Обновлено: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {wells.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#666' }}>Нет данных</h3>
          <p style={{ color: '#999' }}>API не вернул данные скважин</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {wells.map(well => (
            <div
              key={well.well_id}
              style={{
                border: '1px solid #e0e0e0',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#333',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              onClick={() => {
                console.log('Переход к скважине:', well.well_id);
                window.location.href = `/well/${well.well_id}`;
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#1976d2',
                  fontSize: '1.2rem'
                }}>
                  {well.well_id}
                </h3>

                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  backgroundColor: well.status === 'active' ? '#e8f5e9' :
                                 well.status === 'maintenance' ? '#fff3e0' : '#ffebee',
                  color: well.status === 'active' ? '#2e7d32' :
                        well.status === 'maintenance' ? '#ef6c00' : '#d32f2f'
                }}>
                  {translateStatus(well.status)}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#666' }}>Температура:</span>
                  <strong style={{ color: '#d32f2f' }}>{well.temperature}°C</strong>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#666' }}>Дебит:</span>
                  <strong style={{ color: '#1976d2' }}>{well.flow_rate} м³/сут</strong>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#666' }}>Давление:</span>
                  <strong style={{ color: '#7b1fa2' }}>{well.pressure} атм</strong>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#666' }}>Глубина:</span>
                  <strong>{well.depth} м</strong>
                </div>
              </div>

              {well.coordinates && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  borderTop: '1px solid #eee',
                  paddingTop: '10px',
                  marginTop: '10px'
                }}>
                  📍 Координаты: {well.coordinates.lat.toFixed(4)}, {well.coordinates.lon.toFixed(4)}
                </div>
              )}

              {well.operator && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  marginTop: '5px'
                }}>
                  🏢 Оператор: {well.operator}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#1565c0'
      }}>
        <strong>ℹ️ Информация:</strong> Это тестовые данные из mock API.
        Для переключения на реальное API используйте <code>externalWellService.setUseMock(false)</code>
      </div>
    </div>
  );
};

export default Dashboard;