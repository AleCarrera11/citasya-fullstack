'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  telefono: string;
  tipo_mensaje: 'entrante' | 'saliente';
  contenido_mensaje: string;
  timestamp: string;
}

interface Appointment {
  id: number;
  nombre: string;
  servicio: string;
  fecha: string;
  hora: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; date?: string; };
  end: { dateTime: string; date?: string; };
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [messagesRes, appointmentsRes, calendarEventsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/messages`),
        fetch(`${BACKEND_URL}/admin/appointments`),
        fetch(`${BACKEND_URL}/admin/calendar-events`)
      ]);

      const messagesData = await messagesRes.json();
      const appointmentsData = await appointmentsRes.json();
      const calendarEventsData = await calendarEventsRes.json();

      if (!messagesRes.ok) throw new Error(messagesData.error || 'Error fetching messages');
      if (!appointmentsRes.ok) throw new Error(appointmentsData.error || 'Error fetching appointments');
      if (!calendarEventsRes.ok) throw new Error(calendarEventsData.error || 'Error fetching calendar events');

      setMessages(messagesData);
      setAppointments(appointmentsData);
      setCalendarEvents(calendarEventsData);

    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch data from backend.');
      } else {
        setError('Failed to fetch data from backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Cargando datos del panel...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Panel de Administración del Bot de WhatsApp</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sección de Mensajes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Últimos Mensajes del Bot</h2>
          <ul className="space-y-3">
            {messages.length === 0 ? (
              <li className="text-gray-600">No hay mensajes registrados.</li>
            ) : (
              messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`p-4 rounded-md ${
                    msg.tipo_mensaje === 'entrante' ? 'bg-green-50' : 'bg-blue-50'
                  }`}
                >
                  <strong className={`block text-sm font-medium ${msg.tipo_mensaje === 'entrante' ? 'text-green-700' : 'text-blue-700'}`}>
                    {msg.tipo_mensaje.toUpperCase()}:
                  </strong>
                  <span className="block text-gray-800">{msg.contenido_mensaje}</span>
                  <span className="block text-xs text-gray-500 mt-1">
                    Teléfono: {msg.telefono} - {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Sección de Citas Locales */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Citas Locales (Base de Datos)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  <th className="py-3 px-4 border-b">ID</th>
                  <th className="py-3 px-4 border-b">Nombre</th>
                  <th className="py-3 px-4 border-b">Servicio</th>
                  <th className="py-3 px-4 border-b">Fecha</th>
                  <th className="py-3 px-4 border-b">Hora</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 px-4 text-gray-600 text-center">No hay citas registradas.</td></tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4">{app.id}</td>
                      <td className="py-3 px-4">{app.nombre}</td>
                      <td className="py-3 px-4">{app.servicio}</td>
                      <td className="py-3 px-4">{app.fecha}</td>
                      <td className="py-3 px-4">{app.hora}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de Eventos del Calendario de Google */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Próximos Eventos (Google Calendar)</h2>
          <ul className="space-y-3">
            {calendarEvents.length === 0 ? (
              <li className="text-gray-600">No hay eventos próximos en el calendario de Google.</li>
            ) : (
              calendarEvents.map((event) => (
                <li key={event.id} className="p-4 rounded-md bg-purple-50">
                  <strong className="block text-base text-purple-700">{event.summary}</strong>
                  <span className="block text-sm text-gray-700">
                    {event.description && `${event.description.substring(0, 100)}...`}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {event.start && new Date(event.start.dateTime ?? event.start.date ?? '').toLocaleString()} -{' '}
                    {event.end && new Date(event.end.dateTime ?? event.end.date ?? '').toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}