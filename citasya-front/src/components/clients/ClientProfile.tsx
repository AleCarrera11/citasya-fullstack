"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { VscEdit } from "react-icons/vsc";
import { EditarCliente } from "./EditClient";
import { EliminarCliente } from "./DeleteClient";

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
  clientId: number; 
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/clients/${clientId}`);
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
  }, [clientId, fetchClientProfile]); 

  /**
   * Maneja la eliminación de un cliente.
   */
  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el cliente: ${response.statusText}`);
      }

      setShowDeleteModal(false);
      onCloseProfile(); 
    } catch (e) {
      console.error("Error deleting client:", e);

    }
  };

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
    fecha: new Date(appt.date).toISOString().split('T')[0].split('-').reverse().join('-'),
  }));

  return (
    <div className="flex bg-gray-100 " style={{ fontFamily: 'Poppins, sans-serif'}}>
      <aside className="flex flex-col w-full max-w-2xl rounded-lg bg-white shadow-md pb-8">
        <div className="bg-[#D6EBF3] px-8 pt-6 pb-6 rounded-t-lg">
          <h2 className="text-base font-medium tracking-wide leading-none text-left text-[#447F98]">
              Perfil del Cliente
          </h2>
        </div>
        <div className="flex px-8 gap-4 justify-between items-center mt-6 text-sm font-medium text-neutral-600">
          <h3 className="flex items-center gap-2">
            <span>Datos del cliente</span>
          </h3>
          <VscEdit onClick={() => setShowEditModal(true)} size={18} className="text-[#447F98] cursor-pointer hover:text-[#629BB5] transition-colors" />
        </div>

        <div className="mt-4 px-8">
          <div className="text-xs text-neutral-600">Nombre del cliente:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-xs bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.nombre}</div>
          </div>
        </div>

        <div className="mt-4 px-8">
          <div className="text-xs text-neutral-600">Cédula:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-xs bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.cedula}</div>
          </div>
        </div>

        <div className="mt-4 px-8">
          <div className="text-xs text-neutral-600">Teléfono:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-xs bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.telefono}</div>
          </div>
        </div>

        <div className="mt-4 px-8">
          <div className="text-xs text-neutral-600">Notas:</div>
          <div className="flex flex-col px-5 py-3 mt-2 text-xs bg-white rounded-lg shadow-sm text-neutral-600">
            <div>{clientData.notes}</div>
          </div>
        </div>

        <button className="flex justify-center items-center self-center px-10 py-3 mt-4 text-sm font-medium text-center text-white rounded-lg bg-[#447F98] shadow-md w-full max-w-[141px] hover:bg-[#629BB5] transition-colors">
          <span>Chat</span>
        </button>

        <h3 className="self-start px-8 mt-6 text-sm font-medium text-neutral-600">
          Historial de Citas
        </h3>

        <div className="px-8 mt-4 w-full">
          <table className="min-w-full shadow-sm rounded-lg">
            <thead className="bg-neutral-100 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Servicio
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
              <tbody className="bg-white overflow-y-auto max-h-60">
                  {history.length > 0 ? (
                  history.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-600">{entry.servicio}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-600">{entry.fecha}</td>
                    </tr>
                    ))
                        ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-xs text-gray-500">
                        No hay citas en el historial.
                      </td>
                    </tr>
                        )}
              </tbody>
          </table>
        </div>

        <h3 className="self-start px-8 mt-6 text-sm font-medium text-neutral-600">
          Total Invertido
        </h3>
        <div className="self-center text-2xl font-bold text-center leading-[66px] text-[#629BB5]">
          {clientData.totalInvertido}
        </div>

        <button onClick={() => setShowDeleteModal(true)} className="flex justify-center items-center self-center px-10 py-3 mt-6 text-sm font-medium text-center rounded-lg bg-[#FEE2E2] text-[#B91C1C] shadow-md w-full max-w-[141px] hover:bg-[#FFC1C1] transition-colors">
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