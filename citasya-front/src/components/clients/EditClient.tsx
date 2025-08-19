'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { VscChromeClose } from "react-icons/vsc";
import { ServiceFormField } from '../InputField'; 


interface ClientData {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  notes: string;
}

interface EditarClienteProps {
  onClose: () => void;
  onClientUpdated: () => void;
  clientData: ClientData;
}

export const EditarCliente: React.FC<EditarClienteProps> = ({ onClose, clientData, onClientUpdated }) => {
  const [formData, setFormData] = useState({ ...clientData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/admin`;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name?: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;
    // La lógica de tipo para manejar 'value' como 'string' o 'string[]'
    const newValue = typeof value === 'string' ? value : value[0];
    setFormData(prev => ({ ...prev, [name as string]: newValue }));
  };

  const handleUpdateClient = async () => {
    setLoading(true);
    setError(null);

    // Mapeo de los datos del formulario a la estructura del backend
    const clientUpdateData = {
      name: formData.nombre,
      documentId: formData.cedula,
      phone: formData.telefono,
      notes: formData.notes, // El nombre de la variable debe ser 'notes'
    };

    try {
      const response = await fetch(`${API_URL}/clients/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientUpdateData),
      });

      if (!response.ok) {
        throw new Error('Error al editar cliente');
      }
      onClientUpdated();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setError(errorMessage);
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
              Editar Perfil Cliente
            </h1>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex-1 text-right text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <VscChromeClose className="inline-block w-6 h-6" />
            </button>
          </div>
          

          {/* Formulario */}
          <form className="flex flex-col px-10 mt-8 w-full text-neutral-600" onSubmit={(e) => {e.preventDefault(); handleUpdateClient();}}>
            <ServiceFormField
              label="Nombre:"
              placeholder="Nombre del cliente"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Cédula:"
              placeholder="Ej: 12345678"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Teléfono:"
              placeholder="Ej: 584123456789"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <ServiceFormField
              label="Notas:"
              placeholder="Notas adicionales..."
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

            <button
              type="submit"
              className="flex justify-center px-11 py-5 mt-10 text-base font-bold text-center text-white bg-yellow-700/60 rounded-[40px] hover:bg-yellow-700/80 transition-colors duration-200"
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

export default EditarCliente;
