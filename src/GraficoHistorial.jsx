import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function GraficoHistorial() {
  const [datos, setDatos] = useState([]);
  const [horas, setHoras] = useState(4); // Estado para el intervalo de tiempo

  // Cambiamos de una opción única a un objeto de múltiples opciones (Checkboxes)
  const [arosActivos, setArosActivos] = useState({
    luz_valor: true,
    temp_aire: false,
    hum_suelo: false
  });

  const configuracionAros = {
    'luz_valor': { titulo: 'Luminosidad (%)', color: '#FACC15', key: 'luz_valor' },
    'temp_aire': { titulo: 'Temperatura (°C)', color: '#60A5FA', key: 'temp_aire' },
    'hum_suelo': { titulo: 'Humedad Suelo (%)', color: '#4ADE80', key: 'hum_suelo' }
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        // Ahora le mandamos el parámetro de horas a la API
        const response = await fetch(`https://api-invernadero-pq16.onrender.com/api/lecturas/historial?horas=${horas}`);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const rawData = await response.json();

        if (Array.isArray(rawData)) {
          const datosFormateados = rawData.map(item => ({
            ...item,
            hora: new Date(item.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setDatos(datosFormateados);
        } else {
          setDatos([]);
        }
      } catch (error) {
        console.error("Error cargando el historial:", error);
        setDatos([]);
      }
    };

    fetchHistorial();
    const interval = setInterval(fetchHistorial, 10000);
    return () => clearInterval(interval);

  }, [horas]); // Agregamos 'horas' aquí para que recargue inmediatamente si cambias el tiempo

  // Función para encender/apagar una gráfica
  const toggleAro = (aroKey) => {
    setArosActivos(prev => ({
      ...prev,
      [aroKey]: !prev[aroKey]
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mt-8 border border-gray-700 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        
        {/* Título y Selector de Tiempo */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">
            Historial de Sensores
          </h2>
          <select 
            value={horas} 
            onChange={(e) => setHoras(Number(e.target.value))}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none focus:border-green-400 cursor-pointer"
          >
            <option value={1}>Última Hora</option>
            <option value={4}>Últimas 4 Horas</option>
            <option value={12}>Últimas 12 Horas</option>
            <option value={24}>Últimas 24 Horas</option>
          </select>
        </div>
        
        {/* Checkboxes visuales (Pills) */}
        <div className="flex space-x-2 mt-4 md:mt-0 bg-gray-900 p-1.5 rounded-lg border border-gray-700">
          {Object.entries(configuracionAros).map(([llave, config]) => {
            const activo = arosActivos[llave];
            return (
              <button 
                key={llave}
                onClick={() => toggleAro(llave)}
                style={{
                  backgroundColor: activo ? `${config.color}33` : 'transparent', // 33 es 20% de opacidad en Hex
                  color: activo ? config.color : '#9CA3AF',
                  borderColor: activo ? `${config.color}66` : 'transparent'
                }}
                className="px-4 py-1.5 rounded-md text-sm font-bold border transition-all flex items-center space-x-2"
              >
                {/* Cuadrito estilo Checkbox */}
                <div 
                  className="w-3 h-3 rounded-sm border"
                  style={{
                    backgroundColor: activo ? config.color : 'transparent',
                    borderColor: activo ? config.color : '#6B7280'
                  }}
                ></div>
                <span>{config.titulo.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        {datos.length > 0 ? (
          <LineChart width={850} height={320} data={datos} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="hora" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
            />
            
            {/* Renderizamos dinámicamente solo las líneas que estén activas */}
            {Object.entries(configuracionAros).map(([llave, config]) => (
              arosActivos[llave] && (
                <Line 
                  key={llave}
                  type="monotone" 
                  dataKey={config.key} 
                  name={config.titulo}
                  stroke={config.color} 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
              )
            ))}
            
          </LineChart>
        ) : (
          <div className="flex items-center justify-center h-72 text-gray-500 animate-pulse">
            No hay datos para el rango de tiempo seleccionado...
          </div>
        )}
      </div>
    </div>
  );
}
