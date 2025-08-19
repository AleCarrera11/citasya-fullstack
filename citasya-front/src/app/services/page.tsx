'use client';

import React, { useState, useEffect } from 'react';
import { ServiceGrid } from '../../components/services/ServiceGrid';
import { NewService } from '../../components/services/NewService';
import { EditService } from '../../components/services/EditService';
import { DeleteService } from '../../components/services/DeleteService';
import { ServiceFormField } from '../../components/InputField';
import { VscAdd } from "react-icons/vsc";
import { VscChromeClose } from "react-icons/vsc";

// Interfaz para la especialidad, debe coincidir con la de ServiceGrid.tsx
interface SpecialtyData {
  id: number;
  name: string;
}

// Interfaz actualizada para los datos del servicio, ahora con un objeto de especialidad anidado
// Esto soluciona los errores de tipo con el componente ServiceGrid
interface ServiceData {
  id: string;
  name: string;
  specialty: SpecialtyData;
  description: string;
  minutes_duration: number;
  price: number;
  status: string;
}

export const Servicios: React.FC = () => {
  // Estados para los diferentes modales y datos
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState('');

  // Estados para los filtros
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Estados para la administración de especialidades
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [specialtiesError, setSpecialtiesError] = useState<string | null>(null);
  const [showManageSpecialtyModal, setShowManageSpecialtyModal] = useState(false);
  const [newSpecialtyValue, setNewSpecialtyValue] = useState('');

  // Estados para los servicios
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const API_URL = 'http://localhost:4000/admin';

  // Opciones de estado estáticas con "Todos"
  const statusOptions = ['Todos', 'Activo', 'Inactivo'];

  // Handlers para abrir/cerrar modales
  const handleOpenNewModal = () => setShowNewModal(true);
  const handleCloseNewModal = () => {
    setShowNewModal(false); 
    fetchSpecialties();
    fetchServices();
  };

  // El tipo del parámetro serviceData ahora es el correcto
  const handleOpenEditModal = (serviceData: ServiceData) => {
    setEditingService(serviceData);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    fetchSpecialties();
    fetchServices();
  };

  const handleOpenDeleteModal = (serviceId: string) => {
    setDeletingServiceId(serviceId);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    fetchServices();
  };

  // Handlers para el modal de administración de especialidades
  const handleOpenManageSpecialtyModal = () => setShowManageSpecialtyModal(true);
  const handleCloseManageSpecialtyModal = () => {
    setShowManageSpecialtyModal(false);
    fetchSpecialties(); 
  };

  const handleAddSpecialty = async () => {
    if (newSpecialtyValue.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/specialties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newSpecialtyValue.trim() }),
        });
  
        if (!response.ok) {
          throw new Error('Error al agregar la especialidad. Es posible que ya exista.');
        }
  
        setNewSpecialtyValue('');
        fetchSpecialties(); 
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(String(error));
        }
      }
    }
  };
  
  const handleRemoveSpecialty = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/specialties/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la especialidad. Asegúrate de que no haya servicios asociados.');
      }
  
      fetchSpecialties(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    }
  };

  // Handlers para los cambios en los selectores de filtro
  const handleSpecialtyChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: string | string[] } }
  ) => {
    const value =
      'target' in e && typeof e.target.value === 'string'
        ? e.target.value
        : Array.isArray(e.target.value)
        ? e.target.value[0]
        : '';
    if (value === 'manage_specialties') {
      handleOpenManageSpecialtyModal();
    } else {
      setSelectedSpecialty(value);
    }
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: string | string[] } }
  ) => {
    const value =
      'target' in e && typeof e.target.value === 'string'
        ? e.target.value
        : Array.isArray(e.target.value)
        ? e.target.value[0]
        : '';
    setSelectedStatus(value);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/services/${deletingServiceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el servicio.');
      }
      handleCloseDeleteModal();
      fetchServices();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    }
  };

  // Handlers para las acciones de los botones de la grilla
  const handleEditService = (serviceData: ServiceData) => {
    handleOpenEditModal(serviceData);
  };

  const handleDeleteService = (id: string) => {
    handleOpenDeleteModal(id);
  };

  const fetchSpecialties = async () => {
    setLoadingSpecialties(true);
    setSpecialtiesError(null);
    try {
      const response = await fetch(`${API_URL}/specialties`);
      if (!response.ok) {
        throw new Error('Error al cargar las especialidades');
      }
      const data = await response.json();
      setSpecialties(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    } finally {
      setLoadingSpecialties(false);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    setServicesError(null);
    try {
      const response = await fetch(`${API_URL}/services`);
      if (!response.ok) {
        throw new Error('Error al cargar los servicios');
      }
      const data = await response.json();
      setServices(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    } finally {
      setLoadingServices(false);
    }
  };

  // Cargar las especialidades y servicios al montar el componente
  useEffect(() => {
    fetchSpecialties();
    fetchServices();
  }, []);

  // Construir las opciones del selector de especialidad, incluyendo la opción de administrar
  const specialtySelectOptions = [
    { value: '', label: 'Todos' },
    ...specialties.map(s => ({ value: s.id.toString(), label: s.name })),
    { value: 'manage_specialties', label: 'Añadir especialidad...' },
  ];

  // Lógica de filtrado de servicios
  const filteredServices = services.filter(service => {
    // service.specialty.id ya viene del backend gracias a la relación de TypeORM
    const isSpecialtyMatch = selectedSpecialty === '' || service.specialty.id.toString() === selectedSpecialty;
    const isStatusMatch = selectedStatus === 'Todos' || selectedStatus === '' || service.status === selectedStatus;
    return isSpecialtyMatch && isStatusMatch;
  });

  return (
    <div className="relative w-full min-h-screen bg-neutral-100">
      <main>
        <h1 className="mx-0 mt-14 mb-14 text-4xl font-medium text-center text-yellow-700/60 max-sm:mx-0 max-sm:my-8 max-sm:text-3xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          Servicios
        </h1>

        <div className="flex items-center justify-between gap-25 mx-auto mb-14 w-fit max-md:flex-wrap max-md:gap-24 max-md:justify-center max-sm:flex-col max-sm:gap-5 max-sm:items-center">
          <button
            onClick={handleOpenNewModal}
            className="relative cursor-pointer h-[50px] w-[201px] max-sm:h-[45px] max-sm:w-[180px]">
            <div className="rounded-lg shadow-lg bg-yellow-700/60 size-full" />
            <div className="absolute left-[24px] top-[13px]">
              <VscAdd className="text-white size-6" />
            </div>
            <span className="absolute h-6 text-base font-bold leading-6 text-center text-white left-[54px] top-[13px] w-[133px] max-sm:text-sm max-sm:left-[45px] max-sm:top-[11px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nuevo Servicio
            </span>
          </button>

          <section className="flex gap-20 w-fit max-md:flex-wrap max-md:gap-10 max-md:justify-center max-sm:flex-col max-sm:gap-5 max-sm:items-center">
            <div className="w-[179px]">
              <ServiceFormField
                label="Especialidad:"
                placeholder="Selecciona una especialidad"
                options={specialtySelectOptions}
                className="flex-1 grow shrink-0 basis-0 w-fit"
                value={selectedSpecialty}
                onChange={handleSpecialtyChange}
              />
            </div>

            <div className="w-[179px]">
              <ServiceFormField
                label="Estado:"
                placeholder="Selecciona un estado"
                options={statusOptions.map(option => ({ value: option === 'Todos' ? '' : option, label: option }))}
                className="flex-1 grow shrink-0 basis-0 w-fit"
                value={selectedStatus}
                onChange={handleStatusChange}
              />
            </div>
          </section>
        </div>

        <ServiceGrid
          services={filteredServices}
          loading={loadingServices}
          error={servicesError}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />

        <div className="mb-50" />
      </main>

      {/* Renderizado condicional del modal de nuevo servicio */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <NewService onClose={handleCloseNewModal} specialties={specialties} />
        </div>
      )}

      {/* Renderizado condicional del modal de edición */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <EditService onClose={handleCloseEditModal} serviceData={editingService} specialties={specialties} />
        </div>
      )}

      {/* Renderizado condicional del modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <DeleteService onClose={handleCloseDeleteModal} onConfirm={confirmDelete} />
        </div>
      )}

      {/* Modal para administrar especialidades */}
      {showManageSpecialtyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
          <div className="relative w-fit max-w-lg p-8 rounded-lg shadow-lg bg-neutral-100">
            <button
              className="absolute top-2 right-2 text-2xl text-neutral-500 hover:text-neutral-900"
              onClick={handleCloseManageSpecialtyModal}
            >
              <VscChromeClose className="text-neutral-600 hover:text-neutral-800 transition-colors duration-200" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-700/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Administrar Especialidades
            </h2>
            <div className="max-h-60 overflow-y-auto">
              {loadingSpecialties ? (
                <p className="text-center text-neutral-600">Cargando especialidades...</p>
              ) : specialtiesError ? (
                <p className="text-center text-red-500">{specialtiesError}</p>
              ) : specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <div key={specialty.id} className="flex justify-between items-center bg-white p-2 rounded-md mb-2">
                    <span className="text-neutral-600">{specialty.name}</span>
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:text-red-700 font-bold"
                      onClick={() => handleRemoveSpecialty(specialty.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutral-600">No hay especialidades añadidas.</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-700/60"
                value={newSpecialtyValue}
                onChange={(e) => setNewSpecialtyValue(e.target.value)}
                placeholder="Añadir nueva especialidad"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-lg shadow-lg bg-yellow-700/60 text-white font-bold hover:bg-yellow-800/60 transition-colors"
                onClick={handleAddSpecialty}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicios;
