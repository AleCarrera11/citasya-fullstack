"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { VscEdit } from "react-icons/vsc";
import { EditarCliente } from "./EditClient";
import { EliminarCliente } from "./DeleteClient";

// Nueva interfaz para los datos completos del cliente desde el backend
interface FullClientData {
  id: number;
  name: string;
  documentId: string;
  phone: string;
  notes: string;
  appointments: {
    service: string;
    date: string;
    price: number;
  }[];
}

interface ClientProfileProps {
  clientId: number; // Ahora solo necesitamos el ID
  onCloseProfile: () => void;
}

export default function ClientProfile({ clientId, onCloseProfile }: ClientProfileProps) {
  const [fullClientData, setFullClientData] = useState<FullClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * Carga los datos completos del cliente desde la API.
   */
  const fetchClientProfile = React.useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/admin/clients/${clientId}`);
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
      }
      const data = await response.json();
      setFullClientData(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Error al cargar el perfil del cliente: " + e.message);
        console.error("Error fetching client profile:", e);
      } else {
        setError("Error desconocido al cargar el perfil del cliente.");
        console.error("Unknown error fetching client profile:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientProfile();
  }, [clientId, fetchClientProfile]); // Vuelve a cargar cuando el ID del cliente cambie

  /**
   * Maneja la eliminación de un cliente.
   */
  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el cliente: ${response.statusText}`);
      }

      setShowDeleteModal(false);
      onCloseProfile(); // Cierra el panel del perfil y refresca la lista en el componente padre
    } catch (e) {
      console.error("Error deleting client:", e);
      // Podrías mostrar una notificación de error aquí
    }
  };

  // Se muestra un mensaje de carga o error si es necesario
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Si no hay datos (por ejemplo, si el cliente fue borrado)
  if (!fullClientData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Perfil no encontrado.</p>
      </div>
    );
  }

  const clientData = {
    nombre: fullClientData.name,
    cedula: fullClientData.documentId,
    telefono: fullClientData.phone,
    notes: fullClientData.notes,
    totalInvertido: fullClientData.appointments.reduce((sum, appt) => sum + (appt.price || 0), 0) + "$",
  };

  const history = fullClientData.appointments.map((appt) => ({
    servicio: appt.service,
    fecha: new Date(appt.date).toLocaleDateString(),
  }));

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <aside className="flex flex-col p-8 md:p-11 w-full max-w-2xl rounded-3xl bg-green-200/40">
        <h2 className="self-center text-3xl font-semibold tracking-wide leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          Perfil del Cliente
        </h2>

        <div className="flex gap-4 justify-between items-center mt-8 text-xl font-semibold text-neutral-600">
          <h3 className="flex items-center gap-2">
            <span>Datos del cliente</span>
          </h3>
          <VscEdit onClick={() => setShowEditModal(true)} size={24} className="text-yellow-700/60 cursor-pointer hover:text-stone-500 transition-colors" />
        </div>

        <div className="mt-6">
          <div className="text-base text-neutral-600">Nombre del cliente:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-sm bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.nombre}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-base text-neutral-600">Cédula:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-sm bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.cedula}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-base text-neutral-600">Teléfono:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-sm bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.telefono}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-base text-neutral-600">Notas:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-sm bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.notes}</div>
          </div>
        </div>
        
        <button className="flex justify-center items-center self-center px-10 py-3 mt-6 text-base font-semibold text-center text-white rounded-lg bg-yellow-700/60 shadow-md w-full max-w-[141px] hover:bg-stone-500 transition-colors">
          <span>Chat</span>
        </button>

        <h3 className="self-start mt-11 text-xl font-semibold text-neutral-600">
          Historial de Citas
        </h3>

        <div className="overflow-x-auto mt-4 w-full rounded-lg shadow-sm ">
          <table className="min-w-full divide-y divide-yellow-700/60">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Servicio
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.servicio}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.fecha}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay citas en el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="self-start mt-9 text-xl font-semibold text-neutral-600">
          Total Invertido
        </h3>
        <div className="self-center mt-4 text-4xl font-bold text-center leading-[66px] text-neutral-600">
          {clientData.totalInvertido}
        </div>

        <button onClick={() => setShowDeleteModal(true)} className="flex justify-center items-center self-center px-10 py-3 mt-6 text-base font-semibold text-center text-white rounded-lg bg-red-600/60 shadow-md w-full max-w-[141px] hover:bg-red-500 transition-colors">
          <span>Eliminar Cliente</span>
        </button>
      </aside>

      {showEditModal && (
        <EditarCliente
          onClose={() => setShowEditModal(false)}
          clientData={{
            id: fullClientData.id,
            nombre: fullClientData.name,
            cedula: fullClientData.documentId,
            telefono: fullClientData.phone,
            notes: fullClientData.notes,
          }}
          onClientUpdated={fetchClientProfile}
        />
      )}

      {showDeleteModal && (
        <EliminarCliente
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteClient}
        />
      )}
    </div>
  );
}