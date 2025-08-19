'use client';

import React, { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';

interface SpecialtyData {
  id: number;
  name: string;
}

interface ServiceData {
  id: string;
  name: string;
  specialty: SpecialtyData;
  description: string;
  minutes_duration: number;
  price: number;
  status: string;
}

interface EditServiceProps {
  onClose: () => void;
  serviceData: ServiceData;
  specialties: SpecialtyData[];
}

// Se renombra el componente y sus props
export const EditService: React.FC<EditServiceProps> = ({ onClose, serviceData, specialties }) => {
  // Estado del formulario, inicializado con los datos del servicio
  const [formData, setFormData] = useState({
    id: serviceData.id,
    name: serviceData.name || '',
    specialty_id: serviceData.specialty?.id.toString() || '',
    description: serviceData.description || '',
    minutes_duration: serviceData.minutes_duration?.toString() || '',
    price: serviceData.price?.toString() || '',
    status: serviceData.status || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/admin`;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name?: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData(prev => ({ ...prev, [name]: typeof value === 'string' ? value : value[0] }));
  };

  const handleEditService = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        minutes_duration: parseInt(formData.minutes_duration),
        price: parseFloat(formData.price),
        specialty_id: parseInt(formData.specialty_id)
      };

      const response = await fetch(`${API_URL}/services/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al editar el servicio');
      }

      await response.json();
      onClose(); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Failed to edit service:', err);
      } else {
        setError('Error desconocido al editar el servicio');
        console.error('Failed to edit service:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' }
  ];

  return (
    <main className="max-w-[679px]">
      <div className="flex flex-col py-9 w-full bg-neutral-100 rounded-[30px] shadow-lg max-md:max-w-full">
        {/* Sección de Header */}
        <header className="flex flex-col self-end mr-11 max-w-full text-4xl font-bold leading-none text-center text-stone-400 w-[404px] max-md:mr-2.5">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="self-end object-contain w-[25px] h-[25px] cursor-pointer"
          >
            <VscChromeClose className="text-neutral-600 hover:text-neutral-800 transition-colors duration-200" />
          </button>
          <h1 className="self-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Editar Servicio
          </h1>
        </header>

        {/* Sección de formulario */}
        <form className="flex flex-col px-10 mt-8 w-full text-neutral-600 max-md:px-5 max-md:max-w-full">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex flex-wrap gap-10 max-md:max-w-full">
            <ServiceFormField
              label="Nombre del servicio:"
              placeholder="Ingresa nombre..."
              className="flex-1 grow shrink-0 basis-0 w-fit"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Especialidad:"
              placeholder="Selecciona una especialidad"
              options={specialties.map(s => ({ value: s.id.toString(), label: s.name }))}
              className="flex-1 grow shrink-0 basis-0 w-fit"
              name="specialty_id"
              value={formData.specialty_id}
              onChange={handleChange}
            />
          </div>

          <ServiceFormField
            label="Descripción"
            placeholder="Escribe una descripción del servicio..."
            type="textarea"
            className="mt-1"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-10 mt-6 whitespace-nowrap max-md:max-w-full">
            <ServiceFormField
              label="Duración (min):"
              placeholder="Ej: 60"
              type="number"
              className="flex-1 grow shrink-0 basis-0 w-fit"
              name="minutes_duration"
              value={formData.minutes_duration}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Precio ($):"
              placeholder="Ej: 50.00"
              type="number"
              className="flex-1 grow shrink-0 basis-0 w-fit"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap gap-10 mt-6 whitespace-nowrap max-md:max-w-full">
            <ServiceFormField
              label="Estado:"
              placeholder="Selecciona un estado"
              options={statusOptions}
              className="flex-1 grow shrink-0 basis-0 w-fit"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>


          {/* Botón de editar */}
          <button
            onClick={handleEditService}
            type="button"
            className="flex flex-col justify-center self-center px-11 py-5 mt-10 max-w-full text-base font-bold text-center text-white whitespace-nowrap bg-yellow-700/60 rounded-[40px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[149px] max-md:px-5 hover:bg-yellow-700/80 transition-colors duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            disabled={loading}
          >
            <span>{loading ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </form>
      </div>
    </main>
  );
};
