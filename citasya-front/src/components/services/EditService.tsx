'use client';

import React, { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';
import { SpecialtyData, ServiceData } from '../../types/service';


interface EditServiceProps {
  onClose: () => void;
  serviceData: ServiceData;
  specialties: SpecialtyData[];
}

export const EditService: React.FC<EditServiceProps> = ({ onClose, serviceData, specialties }) => {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditService = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        specialty_id: parseInt(formData.specialty_id, 10), 
        minutes_duration: parseInt(formData.minutes_duration, 10),
        price: parseFloat(formData.price),
      };

      const response = await fetch(`${API_URL}/services/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al editar el servicio');

      await response.json();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Failed to edit service:', err);
      } else {
        setError('Error desconocido al editar el servicio');
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
    <main className="max-w-[679px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex flex-col py-9 w-full bg-neutral-100 rounded-[30px] shadow-lg">
        <header className="flex flex-col self-end mr-11 text-4xl font-medium leading-none text-center text-stone-400 w-[404px]">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="self-end w-[25px] h-[25px] cursor-pointer"
          >
            <VscChromeClose className="text-neutral-600 hover:text-neutral-800 transition-colors" />
          </button>
          <h1 className="self-center text-[#447F98]" style={{ fontFamily: 'Roboto Condensed' }}>Editar Servicio</h1>
        </header>

        <form className="flex flex-col px-10 mt-4 w-full text-neutral-600">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex flex-wrap gap-10">
            <ServiceFormField
              label="Nombre del servicio:"
              placeholder="Ingresa nombre..."
              className="flex-1"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Especialidad:"
              placeholder="Selecciona una especialidad"
              options={specialties.map(s => ({ value: s.id.toString(), label: s.name }))} 
              className="flex-1"
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

          <div className="flex flex-wrap gap-10 mt-2">
            <ServiceFormField
              label="Duración (min):"
              placeholder="Ej: 60"
              type="number"
              className="flex-1"
              name="minutes_duration"
              value={formData.minutes_duration}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Precio ($):"
              placeholder="Ej: 50.00"
              type="number"
              className="flex-1"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-10 mt-2">
            <ServiceFormField
              label="Estado:"
              placeholder="Selecciona un estado"
              options={statusOptions}
              className="flex-1"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleEditService}
            type="button"
            className="self-center px-11 py-5 mt-10 text-base font-bold text-white bg-[#447F98] rounded-[40px] hover:bg-[#629BB5] transition-colors"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </main>
  );
};
