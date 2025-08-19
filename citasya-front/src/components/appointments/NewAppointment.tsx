'use client';

import React, { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';

const categories = [
  { id: 1, nombre: 'Masajes' },
  { id: 2, nombre: 'Depilación' },
  { id: 3, nombre: 'Manicura y Pedicura' },
];

const services = [
  { id: 101, nombre: 'Masaje Relajante', categoriaId: 1 },
  { id: 102, nombre: 'Masaje Terapéutico', categoriaId: 1 },
  { id: 201, nombre: 'Depilación con Cera', categoriaId: 2 },
  { id: 301, nombre: 'Manicura Simple', categoriaId: 3 },
  { id: 302, nombre: 'Pedicura Spa', categoriaId: 3 },
];

const professionals = [
  { id: 1, nombre: 'Maria' },
  { id: 2, nombre: 'Sofia' },
  { id: 3, nombre: 'Ana' },
];

const timeSlots = Array.from({ length: 18 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour < 10 ? '0' : ''}${hour}:${minute}`;
});

interface NuevaCitaProps {
  onClose: () => void;
  initialName?: string;
  initialPhone?: string;
}

export const NuevaCita: React.FC<NuevaCitaProps> = ({ onClose, initialName = "", initialPhone = "" }) => {
  const [formData, setFormData] = useState({
    clienteNombre: initialName,
    telefono: initialPhone,
    categoria: '',
    servicio: '',
    profesional: '',
    fecha: '',
    hora: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name?: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;

    if (name === 'categoria') {
      setFormData(prev => ({ ...prev, [name]: typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : ''), servicio: '' }));
    } else if (name) {
      setFormData(prev => ({ ...prev, [name]: typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : '') }));
    }
  };

  const handleAddAppointment = () => {
    // Aquí iría la lógica para agregar la cita a tu backend.
    console.log('Datos de la nueva cita:', formData);
    setLoading(true);
    // Simulación de una llamada a la API.
    setTimeout(() => {
      setLoading(false);
      onClose(); // Cierra el modal después de agregar.
    }, 1500);
  };

  // Mapear los datos de ejemplo al formato `SelectOption` que espera `ServiceFormField`
  const categoryOptions = categories.map(cat => ({ value: cat.id.toString(), label: cat.nombre }));
  const professionalOptions = professionals.map(prof => ({ value: prof.id.toString(), label: prof.nombre }));
  const timeOptions = timeSlots.map(time => ({ value: time, label: time }));

  // Filtrar los servicios en función de la categoría seleccionada
  const filteredServiceOptions = formData.categoria
    ? services
      .filter(s => s.categoriaId === parseInt(formData.categoria))
      .map(s => ({ value: s.id.toString(), label: s.nombre }))
    : [];

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="max-w-2xl w-full mx-4 sm:mx-6 md:mx-auto">
        <div className="flex flex-col py-9 px-6 sm:px-10 md:px-12 w-full bg-neutral-100 rounded-[30px] shadow-2xl">
          {/* Header */}
          <header className="flex justify-between items-center w-full">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Nueva Cita
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
                label="Nombre cliente:"
                placeholder="Ingresa nombre..."
                type="text"
                name="clienteNombre"
                value={formData.clienteNombre}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
              <ServiceFormField
                label="Teléfono:"
                placeholder="Ingresa numero..."
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>

            {/* Fila 2 */}
            <div className="flex flex-wrap gap-10 mt-6 max-md:flex-col">
              <ServiceFormField
                label="Categoría:"
                placeholder="Selecciona una categoría"
                options={categoryOptions}
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
              <ServiceFormField
                label="Servicio:"
                placeholder="Selecciona un servicio"
                options={filteredServiceOptions}
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>

            {/* Fila 3 */}
            <div className="flex flex-wrap gap-10 mt-6 max-md:flex-col">
              <ServiceFormField
                label="Profesional:"
                placeholder="Selecciona un profesional"
                options={professionalOptions}
                name="profesional"
                value={formData.profesional}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
              <ServiceFormField
                label="Fecha:"
                placeholder="Selecciona una fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>

            {/* Fila 4 */}
            <div className="flex flex-wrap gap-10 mt-6 max-md:flex-col">
              <ServiceFormField
                label="Hora:"
                placeholder="Selecciona una hora"
                options={timeOptions}
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="flex-1 grow shrink-0 basis-0 w-fit"
              />
            </div>

            {/* Botón */}
            <button
              onClick={handleAddAppointment}
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

export default NuevaCita;
