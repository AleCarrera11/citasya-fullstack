'use client';

import React, { useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField';

interface NuevoClienteProps {
  onClose: () => void;
}

export const NuevoCliente: React.FC<NuevoClienteProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    nota: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Maneja los cambios en los campos del formulario.
   * La función ahora acepta el tipo 'string | string[]' y se asegura de que
   * el valor guardado en el estado sea siempre un string.
   */
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name?: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    // Comprobamos si el valor es un array y tomamos el primer elemento si lo es.
    // De lo contrario, usamos el valor directamente.
    const newValue = typeof value === 'string' ? value : value[0];
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleAddClient = async () => {
    setLoading(true);
    setError(null);

    // Mapeo de los datos del frontend a los nombres de las columnas del backend (clients.model.ts)
    const clientData = {
      name: formData.nombre,
      documentId: formData.cedula,
      phone: formData.telefono,
      notes: formData.nota, // Aseguramos que el nombre de la variable coincida con el backend
    };

    try {
      // Realiza la petición POST a tu API
      const response = await fetch('http://localhost:3000/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente. Por favor, intenta de nuevo.');
      }

      // Si la petición es exitosa, cierra el modal.
      // La función 'onClose' en el componente padre (ClientDirectory)
      // se encargará de recargar la lista de clientes.
      onClose();

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
      setError(errorMessage);
      console.error('Error al agregar cliente:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="max-w-xl w-full mx-4 sm:mx-6 md:mx-auto">
        <div className="flex flex-col py-9 px-6 sm:px-10 md:px-12 w-full bg-neutral-100 rounded-[30px] shadow-2xl">
          {/* Header */}
          <header className="flex justify-between items-center w-full">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Nuevo Cliente
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
          <form className="flex flex-col mt-8 w-full text-neutral-600" onSubmit={(e) => { e.preventDefault(); handleAddClient(); }}>
            {/* Fila 1 */}
            <div className="flex flex-wrap gap-10 max-md:flex-col">
              <ServiceFormField
                label="Nombre del cliente:"
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
            </div>
            
            {/* Fila 3 - TextArea */}
            <ServiceFormField
              label="Nota:"
              placeholder="Escribe una nota para el cliente..."
              type="textarea"
              name="nota"
              value={formData.nota}
              onChange={handleChange}
              className="mt-6"
            />

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

            {/* Botón */}
            <button
              type="submit"
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

export default NuevoCliente;