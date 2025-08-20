'use client';

import React, { useState } from 'react';
import { ServiceFormField } from '../InputField';
import { VscChromeClose } from "react-icons/vsc";

interface SpecialtyData {
  id: number;
  name: string;
}

interface NewServiceProps {
  onClose: () => void;
  specialties: SpecialtyData[];
}

export const NewService: React.FC<NewServiceProps> = ({ onClose, specialties }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty_id: '', 
    description: '',
    minutes_duration: '',
    price: '',
    status: 'Activo',
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

  const handleAddService = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        specialty_id: parseInt(formData.specialty_id, 10), 
        minutes_duration: parseInt(formData.minutes_duration, 10),
        price: parseFloat(formData.price),
      };

      const response = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al agregar el servicio');

      await response.json();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Failed to add service:', err);
      } else {
        setError('Error desconocido al agregar el servicio');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ['Activo', 'Inactivo'].map(option => ({
    value: option,
    label: option,
  }));

  return (
    <main className="max-w-[679px]">
      <div className="flex flex-col py-9 w-full bg-neutral-100 rounded-[30px] shadow-lg">
        <header className="flex flex-col self-end mr-11 text-4xl font-bold leading-none text-center text-stone-400 w-[404px]">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="self-end w-[25px] h-[25px] cursor-pointer"
          >
            <VscChromeClose className="text-neutral-600 hover:text-neutral-800 transition-colors" />
          </button>
          <h1 className="self-center text-yellow-700/60">Nuevo Servicio</h1>
        </header>

        <form className="flex flex-col px-10 mt-8 w-full text-neutral-600">
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

          <div className="flex flex-wrap gap-10 mt-6">
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

          <ServiceFormField
            label="Estado:"
            placeholder="Selecciona un estado"
            options={statusOptions}
            className="flex-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />

          <button
            onClick={handleAddService}
            type="button"
            className="self-center px-11 py-5 mt-10 text-base font-bold text-white bg-yellow-700/60 rounded-[40px] hover:bg-yellow-700/80 transition-colors"
            disabled={loading}
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      </div>
    </main>
  );
};
