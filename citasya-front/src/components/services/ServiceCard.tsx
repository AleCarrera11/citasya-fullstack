'use client';

import React from 'react';
import { VscEdit, VscTrash, VscCheck, VscClose } from "react-icons/vsc";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  initialStatus: 'ACTIVO' | 'INACTIVO';
  onEdit: () => void;
  onDelete: () => void;
  onStatusToggle: (id: string, currentStatus: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  duration,
  price,
  initialStatus,
  onEdit,
  onDelete,
  onStatusToggle
}) => {
  const isActivo = initialStatus === 'ACTIVO';
  const statusButtonClasses = isActivo
    ? "bg-green-500 hover:bg-green-600"
    : "bg-red-500 hover:bg-red-600";

  const handleStatusToggle = () => {
    onStatusToggle(id, isActivo ? 'Activo' : 'Inactivo');
  };

  return (
    <article className="flex flex-col w-[304px] min-h-[294px] p-5 rounded-[20px] bg-green-700/60 shadow-xl max-md:mt-5 max-md:ml-0">
      <header className="flex gap-2">
        <h3 className="flex-1 text-2xl font-bold text-yellow-700/60" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex justify-center items-center h-10 w-10 text-xl text-neutral-600 rounded-lg transition-colors duration-200 hover:bg-neutral-200"
            aria-label="Editar servicio"
          >
            <VscEdit />
          </button>
          <button
            onClick={onDelete}
            className="flex justify-center items-center h-10 w-10 text-xl text-neutral-600 rounded-lg transition-colors duration-200 hover:bg-neutral-200"
            aria-label="Eliminar servicio"
          >
            <VscTrash />
          </button>
        </div>
      </header>

      <p className="mt-4 text-base leading-6 text-zinc-500">
        {description}
      </p>

      <div className="flex flex-col mt-4">
        <div className="flex gap-2.5">
          <span className="flex-1 text-base text-yellow-700/60">
            Duración: {duration} min
          </span>
          <span className="flex-1 text-base text-yellow-700/60">
            Precio: ${parseFloat(price).toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2.5 mt-2">
          <span className="flex-1 text-base text-yellow-700/60">
            Estado: {initialStatus.charAt(0) + initialStatus.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      <button
        onClick={handleStatusToggle}
        className={`flex justify-center items-center self-center px-6 py-2 mt-4 text-sm font-bold text-white rounded-full shadow transition-colors duration-200 ${statusButtonClasses}`}
      >
        {isActivo ? (
          <>
            <VscCheck className="mr-2" />
            <span>Desactivar</span>
          </>
        ) : (
          <>
            <VscClose className="mr-2" />
            <span>Activar</span>
          </>
        )}
      </button>
    </article>
  );
};
