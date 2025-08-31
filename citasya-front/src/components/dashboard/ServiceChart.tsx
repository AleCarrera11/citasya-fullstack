import React from 'react';

export const ServicesChart = () => {
  // Datos simulados
  const data = [
    { label: 'Manos', value: 65, color: '#447F98' },
    { label: 'Masajes Corporales', value: 35, color: '#B9D8E1' },
  ];

  // Cálculo para el donut chart
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 40;
  const strokeWidth = 10;
  const center = 50;
  const circumference = 2 * Math.PI * radius;

  // Calcula los offsets para cada segmento
  let offset = 0;
  const segments = data.map((d) => {
    const value = d.value;
    const dash = (value / total) * circumference;
    const segment = (
      <circle
        key={d.label}
        r={radius}
        cx={center}
        cy={center}
        fill="transparent"
        stroke={d.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset}
        style={{ transition: 'stroke-dasharray 0.3s' }}
      />
    );
    offset += dash;
    return segment;
  });

  return (
    <div className="rounded-lg shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="p-6 text-md font-medium text-left mb-4 bg-neutral-100 text-neutral-700 rounded-t-lg">
        Servicios más agendados
      </h2>
      <div className="flex flex-col items-center p-6">
        {/* Pie chart */}
        <div className="relative h-44 w-44 flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 100 100" className="absolute">
            {segments}
            {/* Centro blanco */}
            <circle
              r={radius - strokeWidth / 2}
              cx={center}
              cy={center}
              fill="#fff"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* Leyenda */}
        <div className="flex justify-center items-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#447F98]"></div>
            <span className="text-sm text-neutral-700">Manos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#B9D8E1]"></div>
            <span className="text-sm text-neutral-700">Masajes Corporales</span>
          </div>
        </div>
        {/* Porcentajes y etiquetas */}
        <div className="flex justify-between w-full px-16 mt-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#447F98]">65%</span>
            <span className="text-sm text-neutral-600 mt-1">Manos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#B9D8E1]">35%</span>
            <span className="text-sm text-neutral-600 mt-1">Masajes Corporales</span>
          </div>
        </div>
      </div>
    </div>
  );
};

