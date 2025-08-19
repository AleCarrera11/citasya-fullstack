import * as React from "react";
import { VscAdd, VscSearch } from "react-icons/vsc";
import { NewSpecialist } from "./NewWorker";
import { SpecialistProfile } from "./WorkerProfile";

const specialistsData = [
  {
    id: 1,
    name: "Paola Quintero",
    specialty: "Manicurista",
    phone: "584143252122",
    cedula: "28310220",
    email: "paolaq@gmail.com",
    services: ["Manos normales", "Pies normales", "Manos semi-permanente", "Pies semi-permanente"],
  },
  {
    id: 2,
    name: "Juan Pérez",
    specialty: "Pediatra",
    phone: "123456789",
    cedula: "12345678",
    email: "juanperez@mail.com",
    services: ["Consulta general", "Vacunación"],
  },
];

type SpecialistCardProps = {
  id: number;
  name: string;
  specialty: string;
  onClick: (id: number) => void;
  selected: boolean;
};

function SpecialistCard({ id, name, specialty, onClick, selected }: SpecialistCardProps) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`flex flex-col items-start px-10 py-4 min-h-[77px] w-full max-md:px-5 max-md:max-w-full border-b-[3px] border-neutral-200 cursor-pointer
        ${selected ? "bg-gray-100" : "bg-white"}`}
    >
      <h3 className="text-xl tracking-tight leading-none text-black">{name}</h3>
      <p className="text-sm tracking-tight leading-6 text-neutral-600">{specialty}</p>
    </div>
  );
}


export function SpecialistList() {
  const [showNewSpecialistModal, setShowNewSpecialistModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSpecialistId, setSelectedSpecialistId] = React.useState<number | null>(null);

  const filteredSpecialists = specialistsData.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSpecialist = specialistsData.find((spec) => spec.id === selectedSpecialistId);

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
                specialty={spec.specialty}
                onClick={setSelectedSpecialistId}
                selected={selectedSpecialistId === spec.id}
              />
            ))}
          </div>
        </div>
        {showNewSpecialistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
            <NewSpecialist onClose={() => setShowNewSpecialistModal(false)} />
          </div>
        )}
      </aside>

      <section className="ml-5 w-[64%] max-md:ml-0 max-md:w-full">
        <SpecialistProfile specialist={selectedSpecialist || null} />
      </section>
    </div>
  );
}