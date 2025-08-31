'use client';

import React from 'react';
import { VscChromeClose } from "react-icons/vsc";

interface DeleteServiceProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteService: React.FC<DeleteServiceProps> = ({ onClose, onConfirm }) => {
  return (
    <main className="max-w-[400px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex flex-col py-9 px-8 w-full bg-neutral-100 rounded-[30px] shadow-lg max-md:max-w-full">

        <header className="flex flex-col self-end max-w-full text-2xl font-medium leading-none text-center text-stone-400 w-[404px] max-md:mr-2.5">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="self-end object-contain w-[25px] h-[25px] cursor-pointer"
          >
            <VscChromeClose className="text-neutral-600 hover:text-neutral-800 transition-colors duration-200" />
          </button>
          <h1 className="self-center text-[#447F98]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Eliminar Servicio
          </h1>
        </header>
        
        <div className="text-center mt-6 mb-8 text-neutral-600">
          <p>¿Estás seguro de que deseas eliminar este servicio?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>


        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex flex-col justify-center px-8 py-3 text-sm font-bold text-center text-neutral-600 whitespace-nowrap bg-neutral-300 rounded-[40px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-neutral-400 transition-colors duration-200"
          >
            <span>Cancelar</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-col justify-center px-8 py-3 text-sm font-bold text-center text-[#B91C1C] whitespace-nowrap bg-[#FEE2E2] rounded-[40px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFC1C1] transition-colors duration-200"
          >
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </main>
  );
};
