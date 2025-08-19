'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceFormField } from '../../components/InputField';
import { AppointmentsTable } from '../../components/appointments/AppointmentsTable';
import { VscAdd } from "react-icons/vsc";
import NewAppointment from '../../components/appointments/NewAppointment';

// Interfaces para los datos que ahora esperamos del backend
interface Client {
  name: string;
}

interface Worker {
  name: string;
}

interface Service {
  name: string;
}

export enum AppointmentStatus {
  Pendiente = "Pendiente",
  Confirmado = "Confirmado",
  Cancelado = "Cancelado",
  Concluida = "Concluida"
}

// Interfaz que coincide con la respuesta del backend (con relaciones)
interface Appointment {
  id: number;
  date: string;
  hour: string;
  status: AppointmentStatus;
  client: Client;
  worker: Worker;
  service: Service;
}

// Interfaz para la data de la cita que se pasa a la tabla
interface AppointmentDataForTable {
    id: string;
    status: string;
    service: string;
    date: string;
    clientName: string;
    time: string;
    especialista: string;
}

export const Citas: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEspecialista, setSelectedEspecialista] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  

  // Solo necesitamos el estado para las citas del backend
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [servicesForFilter, setServicesForFilter] = useState<{ label: string; value: string; }[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const appointmentStatusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: AppointmentStatus.Pendiente },
    { label: 'Confirmado', value: AppointmentStatus.Confirmado },
    { label: 'Cancelado', value: AppointmentStatus.Cancelado },
    { label: 'Concluida', value: AppointmentStatus.Concluida },
  ];

  const especialistaOptions = [
    { label: 'Todos', value: '' },
    { label: 'Maria Perez', value: 'Maria Perez' },
    { label: 'Juan Lopez', value: 'Juan Lopez' },
    { label: 'Ana Garcia', value: 'Ana Garcia' }
  ];

  // La función de obtención de datos ahora solo se enfoca en las citas del backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const appointmentsRes = await fetch(`${API_BASE}/admin/appointments`);

      if (!appointmentsRes.ok) {
        throw new Error(`Error fetching appointments: ${appointmentsRes.statusText}`);
      }

      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData);
      
      // Procesar los servicios únicos para el filtro
      const uniqueServices = Array.from(new Set(appointmentsData.map((a: Appointment) => String(a.service.name))));
      const newServiceOptions = [{ label: 'Todos', value: '' }, ...uniqueServices.map(service => ({ label: String(service), value: String(service) }))];
      setServicesForFilter(newServiceOptions);

    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch data from backend.');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lógica de filtrado de citas
  const filteredAppointments = appointments.filter(appointment => {
    // Filtro por estado  
    const statusMatch = selectedStatus === '' || appointment.status.toLowerCase() === selectedStatus.toLowerCase();
    // Filtro por especialista (usando el nombre del objeto anidado)
    const especialistaMatch = selectedEspecialista === '' || appointment.worker.name.toLowerCase() === selectedEspecialista.toLowerCase();
    // Filtro por servicio (usando el nombre del objeto anidado)
    const serviceMatch = selectedService === '' || appointment.service.name.toLowerCase() === selectedService.toLowerCase();
    // Filtro por término de búsqueda (cliente)
    const searchMatch = searchTerm === '' || appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && especialistaMatch && serviceMatch && searchMatch;
  });

  const handleOpenNewModal = () => setShowNewModal(true);
  const handleCloseNewModal = () => {
    setShowNewModal(false); 
  };

  const handleMoreInfo = (appointment: AppointmentDataForTable) => {
    console.log(`Ver más información de la cita con ID: ${appointment.id}`);
  };

  const handleCancelAppointment = (appointment: AppointmentDataForTable) => {
    console.log(`Cancelando la cita con ID: ${appointment.id}`);
  };

  const googleCalendarEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL;

  return (
    <div className="z-0 relative w-full min-h-screen bg-neutral-100">
      <main className="container pl-30 pr-30 mx-auto max-md:px-5 max-sm:px-2.5">
        <h1 className="mx-0 mt-20 mb-5 text-4xl font-medium text-center text-yellow-700/60 max-sm:mx-0 max-sm:my-8 max-sm:text-3xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          Gestión de Citas
        </h1>

        <div className="flex justify-between items-center mb-5">
            <h2 className="mx-0 text-3xl font-medium text-yellow-700/60 max-sm:text-2xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Calendario de Citas
            </h2>
            <button
                onClick={fetchData} 
                className="px-4 py-2 rounded-lg shadow-lg bg-yellow-700/60 text-white font-bold text-sm hover:bg-yellow-700/80 transition-colors"
            >
              Refrescar datos
            </button>
        </div>

        {loading && <p className="text-center text-gray-500">Cargando calendario...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
            <div className="w-full mb-8" style={{ height: '700px' }}>
                <iframe
                    src={googleCalendarEmbedUrl}
                    style={{ border: '0', width: '100%', height: '100%' }}
                    frameBorder="0"
                    scrolling="no"
                    title="Google Calendar"
                />
            </div>
        )}

        <div className="flex justify-start items-center mb-5">
            <h2 className="mx-0 text-3xl font-medium text-yellow-700/60 max-sm:text-2xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Historial de Citas
            </h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-10 max-md:justify-center">
            <div className="w-[179px]">
              <ServiceFormField
                label="Estado cita:"
                placeholder="Selecciona un estado"
                options={appointmentStatusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              />
            </div>
            <div className="w-[179px]">
              <ServiceFormField
                label="Especialista:"
                placeholder="Selecciona un especialista"
                options={especialistaOptions}
                value={selectedEspecialista}
                onChange={(e) => setSelectedEspecialista(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              />
            </div>
            <div className="w-[179px]">
              <ServiceFormField
                label="Servicio:"
                placeholder="Selecciona un servicio"
                options={servicesForFilter}
                value={selectedService}
                onChange={(e) => setSelectedService(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              />
            </div>
            <div className="relative w-[250px] mt-4 ml-15">
              <input
                type="text"
                placeholder="Buscar por cliente"
                className="w-full rounded-lg bg-green-200/40 p-3 pl-10 text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="relative cursor-pointer h-[50px] w-[201px] max-sm:h-[45px] max-sm:w-[180px]">
            <div className="rounded-lg shadow-lg bg-yellow-700/60 size-full" />
            <div className="absolute left-[24px] top-[13px]">
              <VscAdd className="text-white size-6" />
            </div>
            <span className="absolute h-6 text-base font-bold leading-6 text-center text-white left-[54px] top-[13px] w-[133px] max-sm:text-sm max-sm:left-[45px] max-sm:top-[11px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nueva cita
            </span>
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Cargando tabla de citas...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
            <AppointmentsTable
                appointments={filteredAppointments.map(a => ({
                  id: a.id.toString(),
                  status: a.status, 
                  service: a.service.name,
                  date: a.date,
                  time: a.hour,
                  clientName: a.client.name,
                  especialista: a.worker.name, // Cambio aquí de 'professional' a 'especialista'
                }))}
                onMoreInfo={handleMoreInfo}
                onCancel={handleCancelAppointment}
            />
        )}

        <div className="mb-50" />
      </main>

      {/* Renderizado condicional del modal de nuevo servicio */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
            <NewAppointment onClose={handleCloseNewModal} />
          </div>
      )}
    </div>
  );
};

export default Citas;
