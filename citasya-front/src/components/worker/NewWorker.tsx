'use client';

import React, { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';

interface NewSpecialistProps {
  onClose: () => void;
}

export const NewSpecialist: React.FC<NewSpecialistProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    especialidad: [] as string[], // <-- array
    });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | { target: { name?: string; value: string | string[] } }
    ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name as string]: value
    }));
    };


  const handleAddClient = () => {
    // Aquí iría la lógica para agregar el nuevo cliente a tu backend.
    console.log('Datos del nuevo cliente:', formData);
    setLoading(true);
    // Simulación de una llamada a la API.
    setTimeout(() => {
      setLoading(false);
      onClose(); // Cierra el modal después de agregar.
    }, 1500);
  };

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="max-w-xl w-full mx-4 sm:mx-6 md:mx-auto">
        <div className="flex flex-col py-9 px-6 sm:px-10 md:px-12 w-full bg-neutral-100 rounded-[30px] shadow-2xl">
          {/* Header */}
          <header className="flex justify-between items-center w-full">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Nuevo Especialista
            </h1>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex-1 text-right text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <VscChromeClose className="inline-block w-6 h-6" />
            </button>
          </header>

          {/* Form */}
          <form className="flex flex-col mt-8 w-full text-neutral-600">
            {/* Fila 1 */}
            <div className="flex flex-wrap gap-10 max-md:flex-col">
              <ServiceFormField
                label="Nombre del especialista:"
                placeholder="Ingresa nombre..."
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
              <ServiceFormField
                label="Cédula:"
                placeholder="Ingresa cédula..."
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>

            {/* Fila 2 */}
            <div className="flex flex-wrap gap-10 mt-6 max-md:flex-col">
              <ServiceFormField
                label="Teléfono:"
                placeholder="xxxxxxxxxx"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
              <ServiceFormField
                label="Email:"
                placeholder="xxxxxxxxxx"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>
            
            {/* Fila 3 - TextArea */}
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
                value={formData.especialidad}
                onChange={handleChange}
                className="mt-6"
                />




            {/* Botón */}
            <button
              onClick={handleAddClient}
              type="button"
              className="flex justify-center self-center px-11 py-5 mt-10 max-w-full text-base font-bold text-center text-white whitespace-nowrap bg-yellow-700/60 rounded-[40px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[149px] max-md:px-5 hover:bg-yellow-700/80 transition-colors duration-200"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              disabled={loading}
            >
              <span>{loading ? 'Agregando...' : 'Agregar'}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NewSpecialist;
