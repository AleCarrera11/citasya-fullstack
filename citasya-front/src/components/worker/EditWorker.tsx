'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';

interface SpecialistData {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  cedula: string;
  email: string;
  services: string[];
}

interface EditSpecialistProps {
  onClose: () => void;
  specialistData: SpecialistData;
  onSaveSuccess?: () => void; // Opcional para callback post-guardado
}

export const EditSpecialist: React.FC<EditSpecialistProps> = ({
  onClose,
  specialistData,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({ ...specialistData });
  const [loading, setLoading] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/admin`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name?: string; value: string | string[] } }
  ) => {
    if ('target' in e && 'value' in e.target) {
      const { name, value } = e.target;
      if (name) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };


  const handleEditSpecialist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/specialists/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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



  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <main className="max-w-[679px] w-full">
        <div className="flex flex-col py-9 w-full bg-neutral-100 rounded-[30px] shadow-lg">
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full px-10">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
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
            {/* Wrapper para columnas */}
            <div className="flex gap-x-10 max-md:flex-col">
                {/* Columna izquierda */}
                <div className="flex flex-col w-full md:w-1/2 gap-y-6">
                <ServiceFormField
                    label="Nombre:"
                    placeholder="Nombre del especialista"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <ServiceFormField
                    label="Teléfono:"
                    placeholder="Ej: 584123456789"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <ServiceFormField
                    label="Especialidad:"
                    placeholder="Selecciona especialidad..."
                    name="especialidad"
                    multiple
                    options={[
                        { value: 'corte', label: 'Corte de Cabello' },
                        { value: 'manicure', label: 'Manicure' },
                        { value: 'tinte', label: 'Tinte' },
                        { value: 'pedicura', label: 'Pedicura' }
                    ]}
                    value={formData.specialty}
                    onChange={handleChange}
                    className="mt-6"
                    />
                </div>
                {/* Columna derecha */}
                <div className="flex flex-col w-full md:w-1/2 gap-y-6 mt-6 md:mt-0">
                <ServiceFormField
                    label="Cédula:"
                    placeholder="Ej: 12345678"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                />
                <ServiceFormField
                    label="Email:"
                    placeholder="email@ejemplo.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
               
                
                </div>
            </div>

            {/* Botón debajo */}
            <button
                onClick={e => {
                e.preventDefault();
                handleEditSpecialist();
                }}
                type="submit"
                className="self-center px-11 py-5 mt-10 text-base font-bold text-white bg-yellow-700/60 rounded-[40px] hover:bg-yellow-700/80 transition-colors duration-200"
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
