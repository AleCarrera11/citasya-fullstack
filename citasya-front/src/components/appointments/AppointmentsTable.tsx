'use client';

import React from 'react';

// La interfaz de datos para la tabla se mantiene igual, ya que recibe los datos procesados
interface AppointmentData {
  id: string;
  status: string;
  service: string;
  date: string;
  clientName: string;
  time: string;
  professional: string;
  notes?: string;
  clientPhone?: string;
}

interface AppointmentsTableProps {
  appointments: AppointmentData[];
  onMoreInfo: (appointment: AppointmentData) => void;
  onCancel: (appointment: AppointmentData) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments, onMoreInfo, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-200/40">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado cita</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Servicio</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hora</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Especialista</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Gestionar cita</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.service}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {appointment.date.split('T')[0].split('-').reverse().join('-')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.professional}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                <button
                  onClick={() => onMoreInfo(appointment)}
                  className="px-4 py-2 rounded-lg shadow-lg bg-yellow-700/60 text-white font-bold text-xs hover:bg-yellow-800/60 transition-colors "
                >
                  Más Info
                </button>
                <button
                  onClick={() => onCancel(appointment)}
                  className="px-4 py-2 rounded-lg shadow-lg bg-red-500/60 text-white font-bold text-xs hover:bg-red-600/60 transition-colors"
                >
                  Cancelar cita
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
