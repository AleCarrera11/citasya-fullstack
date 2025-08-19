'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import { VscChromeClose } from "react-icons/vsc";

interface DeleteSpecialistProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSpecialist: React.FC<DeleteSpecialistProps> = ({ onClose, onConfirm }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <main className="max-w-[400px] w-full">
        <div className="flex flex-col py-9 px-8 w-full bg-neutral-100 rounded-[30px] shadow-lg">
          
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full px-10 gap-6">
            <div className="flex-1"></div>
            <h1 className="text-2xl font-bold leading-none text-center text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              Eliminar Perfil Especialista
            </h1>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex-1 text-right text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <VscChromeClose className="inline-block w-6 h-6" />
            </button>
          </div>

          {/* Mensaje */}
          <div className="text-center mt-6 mb-8 text-neutral-600">
            <p>¿Estás seguro de que deseas eliminar este especialista?</p>
            <p>Esta acción no se puede deshacer.</p>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 text-base font-bold text-neutral-600 bg-neutral-300 rounded-[40px] hover:bg-neutral-400 transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-8 py-3 text-base font-bold text-white bg-red-500 rounded-[40px] hover:bg-red-600 transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </main>
    </div>,
    document.body
  );
};
