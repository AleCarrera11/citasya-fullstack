'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField, SelectOption } from '../InputField'; 

interface SpecialistData {
  id: string;
  name: string;
  phone: string;
  cedula: string;
  email: string;
  services: { id: number; name: string }[];
}

interface EditSpecialistProps {
  onClose: () => void;
  specialistData: SpecialistData;
  allServices: { id: number; name: string }[];
  onSaveSuccess?: () => void;
}

export const EditWorker: React.FC<EditSpecialistProps> = ({
  onClose,
  specialistData,
  allServices,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: specialistData.name,
    phone: specialistData.phone,
    cedula: specialistData.cedula,
    email: specialistData.email,
    services: specialistData.services.map(s => s.id),
  });
  const [loading, setLoading] = useState(false);
  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/admin`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name?: string; value: string | string[] | number | number[] } }
  ) => {
    const { name, value } = e.target;
    if (name) {
      if (name === "services") {
        let newValue: number[] = [];
        if (Array.isArray(value)) {
          newValue = (value as string[]).map(v => Number(v));
        } else if (typeof value === "string") {
          newValue = [Number(value)];
        } else if (Array.isArray(value)) {
          newValue = value as number[];
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleEditSpecialist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/workers/${specialistData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          documentId: formData.cedula,
          services: formData.services.map(id => ({ id })),
        }),
      });
      if (!response.ok) throw new Error('Error al editar especialista');
      onClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions: SelectOption<number>[] = allServices.map(service => ({
    value: service.id,
    label: service.name
  }));
  

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <main className="max-w-[679px] w-full">
        <div className="flex flex-col py-9 w-full bg-neutral-100 rounded-[30px] shadow-lg">
          <div className="flex flex-row justify-between items-center w-full px-10">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-medium leading-none text-center text-[#447F98]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Editar Perfil Especialista
            </h1>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex-1 text-right text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <VscChromeClose className="inline-block w-6 h-6" />
            </button>
          </div>

          <form className="flex flex-col px-10 mt-8 w-full text-neutral-600 max-md:px-5">
            <div className="flex gap-x-10 max-md:flex-col">
              <div className="flex flex-col w-full md:w-1/2 gap-y-6">
                <ServiceFormField
                  label="Nombre:"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <ServiceFormField
                  label="Teléfono:"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 gap-y-6 mt-6 md:mt-0">
                <ServiceFormField
                  label="Cédula:"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                />
                <ServiceFormField
                  label="Email:"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-y-6">
                <ServiceFormField
                    label="Servicios asignados:"
                    placeholder="Selecciona servicios..."
                    name="services"
                    multiple
                    options={serviceOptions}
                    value={formData.services} 
                    onChange={handleChange}
                    className="mt-6"
                />
            </div>
            
            <button
              onClick={e => {
                e.preventDefault();
                handleEditSpecialist();
              }}
              type="submit"
              className="self-center px-11 py-5 mt-10 text-sm font-semibold text-white bg-[#447F98] rounded-[40px] hover:bg-[#629BB5] transition-colors duration-200"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </main>
    </div>,
    document.body
  );
};