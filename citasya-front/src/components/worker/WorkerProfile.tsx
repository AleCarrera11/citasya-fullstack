import * as React from "react";
import { Calendar } from "./Calendar";
import { VscAdd, VscEdit } from "react-icons/vsc";
import { ServiceFormField } from "../InputField";
import { EditSpecialist }from "./EditWorker";
import { DeleteSpecialist } from "./DeleteWorker";

interface SpecialistProfileProps {
  specialist: {
    name: string;
    phone: string;
    specialty: string;
    cedula: string;
    email: string;
    services: string[];
  } | null;
}


export function SpecialistProfile({ specialist }: SpecialistProfileProps) {
  const defaultSpecialist = {
    nombre: "Alejandra Carrera",
    cedula: "28310220",
    telefono: "584143252122",
    notas: "Alergias...",
    totalInvertido: "250$"
  };
  

  // Para servicios (array) creamos un manejador separado
  const handleServicesChange = (selectedServices: string[]) => {
    setFormData(prev => ({ ...prev, services: selectedServices }));
  };

   // Opciones para servicios: si tienes un catálogo, pásalo aquí
  const availableServices = [
    { value: 'consulta', label: 'Consulta' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'terapia', label: 'Terapia' },
    // ... agrega los que uses
  ];


  const SpecialistData = specialist || defaultSpecialist; 
  const [formData, setFormData] = React.useState({ ...SpecialistData });
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  if (!specialist) {
    return (
      <section className="ml-5 w-full max-md:ml-0 max-md:w-full flex items-center justify-center h-full bg-green-200/40 rounded-3xl p-10 max-md:p-5">
        <p className="text-neutral-500 text-lg">
          Selecciona un especialista para ver su perfil
        </p>
      </section>
    );
  }
  return (
    <section className="ml-5 w-full h-full ">
      <div className="px-12 py-14 mx-auto w-full rounded-3xl bg-green-200/40 max-md:px-5 max-md:mt-7 max-md:max-w-full">
        <div className="max-md:max-w-full">
          <h2
            className="self-stretch text-3xl font-semibold tracking-wide leading-none text-yellow-700/60"
            style={{ fontFamily: "Roboto Condensed, sans-serif" }}
          >
            Perfil y Disponibilidad
          </h2>
          <div className="flex gap-10 mt-4 text-xl font-semibold">
            <h3 className="basis-auto rotate-[7.710460847772601e-17rad]">
              Datos del especialista
            </h3>
            <VscEdit onClick={() => setShowEditModal(true)} 
              size={24}
              className="text-yellow-700/60 cursor-pointer hover:text-stone-500 transition-colors"
            />
          </div>
          <div className="flex gap-5 max-md:flex-col max-md:">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start w-full text-base text-neutral-600 max-md:mt-6">
                 <ServiceFormField
                  label="Nombre del especialista:"
                  value={specialist.name}
                  readOnly
                  className="w-full"
                />
                <ServiceFormField
                  label="Teléfono"
                  value={specialist.phone}
                  readOnly
                  className="w-full"
                />
                <ServiceFormField
                  label="Especialidad"
                  value={specialist.specialty}
                  readOnly
                  className="w-full"
                />
              </div>
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start w-full text-base text-neutral-600 max-md:mt-6">
                <ServiceFormField
                  label="Cédula"
                  value={specialist.cedula}
                  readOnly
                  className="w-full"
                />
                <ServiceFormField
                  label="Email"
                  value={specialist.email}
                  readOnly
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 max-md:max-w-full">
          <ServiceFormField
            label="Servicios asignados:"
            options={availableServices}
            multiple
            value={formData.services}
            onChange={(e) => {
              if ('target' in e && Array.isArray(e.target.value)) {
                handleServicesChange(e.target.value);
              }
            }}
            placeholder="Selecciona servicios"
            whiteBg={true}
            className="w-full max-md:w-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="mt-11 text-xl font-semibold rotate-[7.710460847772601e-17rad] text-neutral-600 max-md:mt-10">
              Disponibilidad
          </h3>
          <div className="flex justify-center items-center w-full mt-4">
            <Calendar />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-5 mt-10 text-base font-semibold text-center text-white rounded-lg bg-red-600/60 shadow-md w-full max-w-[141px] hover:bg-red-500 transition-colors"
          >
            <span>Eliminar Especialista</span>
          </button>
        </div>
      </div>
          {showEditModal && (
        <EditSpecialist
          onClose={() => setShowEditModal(false)}
          specialistData={SpecialistData}
        />
      )}
    
      {showDeleteModal && (
        <DeleteSpecialist
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => { 
            // Lógica de borrado 
            setShowDeleteModal(false);
          }}
        />
      )}
    </section>
  );
}
