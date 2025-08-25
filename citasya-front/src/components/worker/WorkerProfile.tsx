import * as React from "react";
import { Calendar } from "./Calendar";
import { ServiceFormField } from "../InputField";
import { DeleteSpecialist } from "./DeleteWorker";
import { EditWorker } from "./EditWorker";
import { VscEdit } from "react-icons/vsc";

export interface Specialist {
  id: number;
  name: string;
  specialties: string[];
  phone: string;
  documentId: string;
  email: string;
  services: { id: number; name: string }[]; 
}

interface SpecialistProfileProps {
  specialist: Specialist | null;
  onWorkerUpdated: () => void;
  allServices: { id: number; name: string }[]; 
}

export function SpecialistProfile({ specialist, onWorkerUpdated, allServices }: SpecialistProfileProps) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);

  if (!specialist) {
    return (
      <section className="ml-5 w-full max-md:ml-0 max-md:w-full flex items-center justify-center h-full bg-green-200/40 rounded-3xl p-10 max-md:p-5">
        <p className="text-neutral-500 text-lg">
          Selecciona un especialista para ver su perfil
        </p>
      </section>
    );
  }
  
  const serviceNames = specialist.services.map(s => s.name).join(", "); 
  const handleDeleteWorker = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/workers/${specialist.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar especialista");
      }

      onWorkerUpdated(); 
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el especialista");
    }
  };

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
            <VscEdit onClick={() => setShowEditModal(true)} size={24} className="text-yellow-700/60 cursor-pointer hover:text-stone-500 transition-colors" />
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
              </div>
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start w-full text-base text-neutral-600 max-md:mt-6">
                <ServiceFormField
                  label="Cédula"
                  value={specialist.documentId}
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

        <div className="flex flex-wrap gap-2 max-md:max-w-full">
          <ServiceFormField
            label="Especialidades:"
            value={specialist.specialties.join(", ")}
            readOnly
            placeholder="No hay especialidades asignadas"
            className="w-full max-md:w-full"
          />
          <ServiceFormField
            label="Servicios asignados:"
            value={serviceNames}
            readOnly
            placeholder="No hay servicios asignados"
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
      {showEditModal && specialist && (
        <EditWorker
          onClose={() => setShowEditModal(false)}
          specialistData={{
            id: String(specialist.id),
            name: specialist.name,
            phone: specialist.phone,
            services: specialist.services, 
            cedula: specialist.documentId,
            email: specialist.email,
          }}
          allServices={allServices}
          onSaveSuccess={onWorkerUpdated}
        />
      )}
      {showDeleteModal && (
        <DeleteSpecialist
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteWorker}
        />
      )}
    </section>
  );
}