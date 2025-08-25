import * as React from "react";
import { VscAdd, VscSearch } from "react-icons/vsc";
import { NewSpecialist } from "./NewWorker";
import { SpecialistProfile } from "./WorkerProfile";

type Specialty = {
  name: string;
};

type Service = {
  id: number;
  name: string;
  specialty: Specialty;
};

type Specialist = {
  id: number;
  name: string;
  specialties: string[];
  phone: string;
  documentId: string;
  email: string;
  services: { id: number; name: string }[];
};

interface BackendSpecialist {
  id: number;
  name: string;
  phone: string;
  documentId: string;
  email: string;
  services: Service[];
}

type SpecialistCardProps = {
  id: number;
  name: string;
  specialties: string[];
  onClick: (id: number) => void;
  selected: boolean;
};

function SpecialistCard({
  id,
  name,
  specialties,
  onClick,
  selected,
}: SpecialistCardProps) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`flex flex-col items-start px-10 py-4 min-h-[77px] w-full max-md:px-5 max-md:max-w-full border-b-[3px] border-neutral-200 cursor-pointer
        ${selected ? "bg-gray-100" : "bg-white"}`}
    >
      <h3 className="text-xl tracking-tight leading-none text-black">{name}</h3>
      {specialties.length > 0 && (
        <p className="text-sm tracking-tight leading-6 text-neutral-600">
          {specialties.join(", ")}
        </p>
      )}
    </div>
  );
}

export function SpecialistList() {
const [specialists, setSpecialists] = React.useState<Specialist[]>([]);
  const [allServices, setAllServices] = React.useState<{ id: number; name: string }[]>([]); 
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showNewSpecialistModal, setShowNewSpecialistModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSpecialistId, setSelectedSpecialistId] = React.useState<number | null>(null);
  const [forceReload, setForceReload] = React.useState(0);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const specialistsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/workers`);
        if (!specialistsRes.ok) throw new Error("Error al obtener especialistas");
        const specialistsData: BackendSpecialist[] = await specialistsRes.json();

        const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/services`); 
        if (!servicesRes.ok) throw new Error("Error al obtener servicios");
        const servicesData = await servicesRes.json();
        setAllServices(servicesData.map((s: Service) => ({ id: s.id, name: s.name }))); 

        const formattedData: Specialist[] = specialistsData.map((spec) => {
          const uniqueSpecialties = Array.from(
            new Set(spec.services.map((service) => service.specialty.name))
          );
          
          return {
            id: spec.id,
            name: spec.name,
            specialties: uniqueSpecialties,
            phone: spec.phone,
            documentId: spec.documentId,
            email: spec.email,
            services: spec.services.map((service) => ({ id: service.id, name: service.name })), 
          };
        });
        
        setSpecialists(formattedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [forceReload]);

  const filteredSpecialists = specialists.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSpecialist = specialists.find(
    (spec) => spec.id === selectedSpecialistId
  );
    const handleWorkerUpdated = () => {
    setForceReload(prev => prev + 1);
  };
  if (loading) return <p>Cargando especialistas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex w-full max-h-[calc(100vh-100px)] max-md:flex-col max-md:max-h-auto">
      <aside className="w-[36%] max-md:w-full max-md:mb-5 max-md:px-4">
        <div className="flex flex-col p-6 pt-10 mx-auto w-full font-medium rounded-3xl bg-green-200/40 pb-[830px] max-md:pb-24 max-md:max-w-full">
          <div className="flex gap-10 self-center max-w-full text-sm tracking-normal text-neutral-600 w-[376px] max-md:w-full">
            <div className="flex flex-auto items-center gap-4 px-2.5 py-3 bg-white rounded-lg w-full">
              <VscSearch className="h-6 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Nombre especialista"
                className="self-start basis-auto bg-transparent outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setShowNewSpecialistModal(true)}>
              <VscAdd className="h-6 w-8 text-yellow-700/60" />
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-10 max-md:mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {filteredSpecialists.map((spec) => (
              <SpecialistCard
                key={spec.id}
                id={spec.id}
                name={spec.name}
                specialties={spec.specialties}
                onClick={setSelectedSpecialistId}
                selected={selectedSpecialistId === spec.id}
              />
            ))}
          </div>
        </div>
        {showNewSpecialistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
            <NewSpecialist
              onClose={() => setShowNewSpecialistModal(false)}
              onWorkerAdded={(newSpecialist: Specialist) => {
                setSpecialists((prev) => [...prev, newSpecialist]);
              }}
            />
          </div>
        )}
      </aside>

      <section className="ml-5 w-[64%] max-md:ml-0 max-md:w-full">
        <SpecialistProfile 
          specialist={selectedSpecialist || null} 
          onWorkerUpdated={handleWorkerUpdated}
          allServices={allServices} 
        />
      </section>
    </div>
  );
}