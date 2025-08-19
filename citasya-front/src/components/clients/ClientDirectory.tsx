"use client";
import { CalendarPlus } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { VscAdd, VscSearch } from "react-icons/vsc";
import { NuevoCliente } from "./NewClient";
import NewAppointment from "../appointments/NewAppointment";
import ClientProfile from "./ClientProfile";

interface Client {
  id: number;
  cedula: string;
  nombre: string;
  telefono: string;
}

export function ClientDirectory() {
  // Estados para la data de la API
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales y selección
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [appointmentClient, setAppointmentClient] = useState<Client | null>(null);

  // Estados para los inputs de búsqueda
  const [searchNameOrCedula, setSearchNameOrCedula] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  /**
   * Carga los clientes desde la API.
   */
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/clients');
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
      }
      const data = await response.json();
      // Mapea los nombres de las propiedades del backend a las del frontend
      interface BackendClient {
        id: number;
        documentId: string;
        name: string;
        phone: string;
      }
      const mappedClients = data.map((client: BackendClient) => ({
        id: client.id,
        cedula: client.documentId,
        nombre: client.name,
        telefono: client.phone,
      }));
      setClients(mappedClients);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Error al cargar los clientes: " + e.message);
        console.error("Error fetching clients:", e);
      } else {
        setError("Error al cargar los clientes: error desconocido");
        console.error("Error fetching clients:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Carga los clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrar según inputs (ignorando mayúsculas/minúsculas)
  const filteredClients = clients.filter((client) => {
    const searchNC = searchNameOrCedula.toLowerCase();
    const searchPh = searchPhone.toLowerCase();

    const matchesNameOrCedula =
      client.nombre.toLowerCase().includes(searchNC) ||
      client.cedula.toLowerCase().includes(searchNC);

    const matchesPhone = client.telefono.toLowerCase().includes(searchPh);

    return matchesNameOrCedula && matchesPhone;
  });

  const handleOpenNewClientModal = () => setShowNewClientModal(true);
  
  // Función para recargar los datos después de crear un cliente
  const handleCloseNewClientModal = () => {
    setShowNewClientModal(false);
    fetchClients(); 
  };
  
  const handleOpenNewAppointmentModal = (client?: Client) => {
    if (client) {
      setAppointmentClient(client);
    }
    setShowNewAppointmentModal(true);
  };
  const handleCloseNewAppointmentModal = () => setShowNewAppointmentModal(false);

  // Lógica para manejar el cierre del perfil del cliente (opcional)
  const handleCloseProfile = () => {
    setSelectedClient(null);
    fetchClients(); // Opcional: refresca la lista si el perfil podría haber sido editado o borrado.
  };

  return (
    <div className="relative flex w-full overflow-hidden">
      {/* Columna izquierda: Directorio */}
      <main
        className={`transition-all duration-500 transform ${
          selectedClient
            ? "translate-x-0 w-[68%] mr-auto"
            : "mx-auto w-[70%]"
        }`}
      >
        <div className="px-16 pt-12 mx-auto w-full rounded-3xl bg-green-200/40 pb-[602px]">
          {/* Buscadores y botón */}
          <div className="flex flex-wrap gap-4 w-full text-sm text-neutral-600 justify-between items-center">
            <div className="flex gap-3 px-2 py-3 tracking-normal bg-white rounded-lg">
              <VscSearch className="h-5 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Nombre o Cédula"
                className="my-auto bg-transparent outline-none"
                value={searchNameOrCedula}
                onChange={(e) => setSearchNameOrCedula(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-start px-5 py-3 tracking-normal whitespace-nowrap bg-white rounded-lg">
              <VscSearch className="h-5 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Teléfono"
                className="my-auto bg-transparent outline-none"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <button
              onClick={handleOpenNewClientModal}
              className="flex gap-1.5 px-3 py-3.5 my-auto items-center text-base font-semibold text-center text-white rounded-lg bg-yellow-700/60 hover:bg-stone-500 transition-colors"
            >
              <VscAdd className="h-5 w-4" />
              <span>Nuevo Cliente</span>
            </button>
          </div>

          {/* Estado de carga y error */}
          {loading && <div className="p-5 text-center">Cargando clientes...</div>}
          {error && <div className="p-5 text-center text-red-500">{error}</div>}

          {/* Tabla */}
          {!loading && !error && (
            <div className="overflow-hidden mt-20 w-full bg-white rounded-lg ">
              <div className="flex font-bold text-center text-neutral-600">
                <div className="flex-1 p-3">Cédula</div>
                <div className="flex-1 p-3">Nombre</div>
                <div className="flex-1 p-3">Teléfono</div>
                <div className="flex-1 p-3">Acciones</div>
              </div>

              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id} // Usamos el ID de la base de datos como key
                    className="flex text-center text-neutral-600 border-t-[2px] border-yellow-700/60"
                  >
                    <div className="flex-1 p-3 justify-center">{client.cedula}</div>
                    <div className="flex-1 p-3 justify-center">{client.nombre}</div>
                    <div className="flex-1 p-3 justify-center">{client.telefono}</div>
                    <div className="flex gap-2 p-2 justify-center">
                      <button
                        onClick={() => {
                          if (selectedClient?.id === client.id) {
                            setSelectedClient(null);
                          } else {
                            setSelectedClient(client);
                          }
                        }}
                        className="p-2 bg-green-300/80 rounded-lg text-[10px] font-bold text-white hover:bg-green-400"
                      >
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => handleOpenNewAppointmentModal(client)}
                        className="flex gap-1 p-2 bg-green-300/80 rounded-lg text-[10px] font-bold text-white hover:bg-green-400"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        Nueva Cita
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-neutral-600">No hay clientes que coincidan.</div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Columna derecha: Perfil (panel deslizante) */}
      <aside
        className={`absolute right-0 top-0 h-full overflow-y-auto transition-transform duration-500 w-[32%] ${
          selectedClient ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="ml-8">
          {selectedClient && (
            // Código corregido
            <ClientProfile
              clientId={selectedClient.id} // <-- ¡Este es el cambio!
              onCloseProfile={handleCloseProfile}
            />
          )}
        </div>
      </aside>

      {/* Modales */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <NuevoCliente onClose={handleCloseNewClientModal} />
        </div>
      )}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <NewAppointment
            onClose={handleCloseNewAppointmentModal}
            initialName={appointmentClient?.nombre || ""}
            initialPhone={appointmentClient?.telefono || ""}
          />
        </div>
      )}
    </div>
  );
}