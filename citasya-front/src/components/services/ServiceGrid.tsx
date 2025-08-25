'use client';
import React from 'react';
import { CiEdit, CiClock1 } from 'react-icons/ci';
import { MdOutlineCurrencyExchange } from 'react-icons/md';
import { TbCategory } from 'react-icons/tb';
import { VscChromeClose } from 'react-icons/vsc';

interface SpecialtyData {
  id: number;
  name: string;
}

interface ServiceData {
  id: string;
  name: string;
  specialty: SpecialtyData; 
  description: string;
  minutes_duration: number;
  price: number;
  status: string;
}

interface ServiceGridProps {
  services: ServiceData[];
  loading: boolean;
  error: string | null;
  onEditService: (serviceData: ServiceData) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  loading,
  error,
  onEditService,
  onDeleteService,
}) => {
  if (loading) {
    return <div className="text-center text-neutral-600">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!services || services.length === 0) {
    return <div className="text-center text-neutral-600">No hay servicios disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10 w-full max-w-7xl">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative flex flex-col p-12 bg-green-300/20 rounded-[30px] shadow-lg max-md:p-4"
          >
            <button
              onClick={() => onEditService(service)}
              className="absolute top-6 right-16 text-yellow-700/60 hover:text-yellow-700 transition-colors"
            >
              <CiEdit size={24} />
            </button>
            <button
              onClick={() => onDeleteService(service.id)}
              className="absolute top-6 right-6 text-yellow-700/60 hover:text-red-500 transition-colors"
            >
              <VscChromeClose className="size-5" />
            </button>

            <h2
              className="text-3xl items-center font-bold text-yellow-700/60 leading-tight"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            >
              {service.name}
            </h2>

            <div className="flex items-center mt-2 text-neutral-500 text-m font-bold">
              <TbCategory className="mr-2" />
              <span>{service.specialty.name}</span>
            </div>

            <p
              className="mt-4 text-base text-neutral-500 leading-relaxed max-h-24 overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {service.description}
            </p>

            <div className="flex items-center mt-4 text-neutral-600">
              <CiClock1 className="mr-2" size={20} />
              <span>{service.minutes_duration} min</span>
            </div>

            <div className="flex items-center mt-2 text-neutral-600">
              <MdOutlineCurrencyExchange className="mr-2" size={20} />
              <span>${service.price}</span>
            </div>

            <div
              className={`mt-4 text-sm font-bold ${
                service.status === 'Activo' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              Estado: {service.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
