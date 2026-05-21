import { useState, useEffect } from 'react';
import GraficoHistorial from './GraficoHistorial';

function App() {
  // Estado inicial ahora vacío o con valores por defecto en cero/cargando
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const obtenerDatosActuales = async () => {
      try {
        const response = await fetch('https://api-invernadero-pq16.onrender.com/api/lecturas/actual');
        
        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        
        // ¡Aquí está la magia! Usamos tus funciones exactas
        setSensorData(data); 
        setError(null); // Limpiamos cualquier error previo si la conexión fue exitosa

      } catch (err) {
        console.error("Error al obtener datos en vivo:", err);
        setError(err.message); // Si algo falla, lo guardamos en tu variable de error
      }
    };

    // 1. Ejecución inmediata
    obtenerDatosActuales();

    // 2. Programar repetición cada 5 segundos
    const intervalo = setInterval(obtenerDatosActuales, 5000);

    // 3. Limpieza del cronómetro
    return () => clearInterval(intervalo);
  }, []);

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="bg-red-900/50 p-6 rounded-lg text-red-200">Error: {error}</div>
    </div>;
  }

  // Si los datos aún no cargan, mostramos un indicador de carga
  if (!sensorData) {
    return <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="text-xl animate-pulse text-green-400">Conectando con el invernadero...</div>
    </div>;
  }
return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-green-400">Panel de Control: Invernadero</h1>
          <p className="text-gray-400">Monitoreo en tiempo real del sistema ESP32</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          Última actualización: <span className="text-gray-300">
            {sensorData.fecha_hora ? new Date(sensorData.fecha_hora+'Z').toLocaleTimeString() : 'En vivo'}
          </span>
        </div>
      </header>

      {/* Grid para las tarjetas de los 3 Aros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Aro de Luminosidad */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-yellow-400 transition-all hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Aro de Luminosidad</h2>
            <span className="text-2xl">☀️</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Intensidad:</span>
              <span className="font-bold">{sensorData.luz_valor}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Estado de Luces:</span>
              {/* Si está Encendido es Amarillo, si no, es Rojo */}
              <span className={`px-3 py-1 rounded text-sm font-bold shadow-sm ${sensorData.luz_estado === 'Encendido' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {sensorData.luz_estado}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Aro de Ventilación */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-blue-400 transition-all hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Aro de Ventilación</h2>
            <span className="text-2xl">💨</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Temperatura:</span>
              <span className="font-bold text-red-400">{sensorData.temp_aire} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Humedad Aire:</span>
              <span className="font-bold text-blue-300">{sensorData.hum_aire}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Extractor:</span>
              {/* Si está Activo es Azul, si no, es Rojo */}
              <span className={`px-3 py-1 rounded text-sm font-bold shadow-sm ${sensorData.extractor_estado === 'Activo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {sensorData.extractor_estado}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Aro de Humedad de Suelo */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-green-500 transition-all hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Aro de Suelo</h2>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Humedad de Suelo:</span>
              <span className="font-bold text-green-300">{sensorData.hum_suelo}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Riego por Goteo:</span>
              {/* Si está Activo es Verde, si no, es Rojo */}
              <span className={`px-3 py-1 rounded text-sm font-bold shadow-sm ${sensorData.riego_estado === 'Activo' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {sensorData.riego_estado}
              </span>
            </div>
          </div>
        </div>

      </div>
      <GraficoHistorial />
    </div>
  );
  }

export default App;
