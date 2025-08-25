'use client';

import React, { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import ReactDOM from 'react-dom';
import { SelectOption, ServiceFormField } from '../InputField';

interface AppointmentData {
  id: string;
  status: string;
  service: string;
  date: string;
  clientName: string;
  time: string;
  professional: string;
}

enum AppointmentStatus {
  Pendiente = "Pendiente",
  Confirmado = "Confirmado",
  Cancelado = "Cancelado",
  Concluida = "Concluida"
}

interface AppointmentsTableProps {
  appointments: AppointmentData[];
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments, onUpdateStatus }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<AppointmentStatus | ''>('');

  const openStatusModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status as AppointmentStatus);
    setShowStatusModal(true);
  };

  const openCancelModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedAppointment && newStatus) {
      onUpdateStatus(selectedAppointment.id, newStatus);
      setShowStatusModal(false);
    }
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      onUpdateStatus(selectedAppointment.id, AppointmentStatus.Cancelado);
      setShowCancelModal(false);
    }
  };

  const statusOptions: SelectOption<string>[] = Object.values(AppointmentStatus).map(status => ({
    value: status,
    label: status
  }));

  const handleStatusChange = (e: { target: { name?: string; value: string | string[] } }) => {
    setNewStatus(e.target.value as AppointmentStatus);
  };
  
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
                  onClick={() => openStatusModal(appointment)}
                  className="px-4 py-2 rounded-lg shadow-lg bg-yellow-700/60 text-white font-bold text-xs hover:bg-yellow-800/60 transition-colors "
                >
                  Cambiar estado
                </button>
                <button
                  onClick={() => openCancelModal(appointment)}
                  className="px-4 py-2 rounded-lg shadow-lg bg-red-500/60 text-white font-bold text-xs hover:bg-red-600/60 transition-colors"
                >
                  Cancelar cita
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para cambiar estado */}
      {showStatusModal && selectedAppointment && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-700">Cambiar Estado</h2>
              <button onClick={() => setShowStatusModal(false)}>
                <VscChromeClose />
              </button>
            </div>
            <ServiceFormField
              label="Nuevo estado:"
              name="newStatus"
              options={statusOptions}
              value={newStatus}
              onChange={handleStatusChange}
              whiteBg={false} 
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
              <button onClick={handleUpdateStatus} className="px-4 py-2 bg-yellow-700 text-white rounded-lg">Actualizar</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal para cancelar cita */}
      {showCancelModal && selectedAppointment && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px] text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Cancelar Cita</h2>
            <p className="mb-6">¿Estás seguro que quieres cancelar esta cita?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">No</button>
              <button onClick={handleCancelAppointment} className="px-4 py-2 bg-red-500 text-white rounded-lg">Sí, Cancelar</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
    </div>
  );
};
