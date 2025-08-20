'use client';

import * as React from "react";
import { ServiceFormField } from "../../components/InputField";
import { VscEdit } from "react-icons/vsc";

// Componente para el contenedor de datos del centro
function CenterDataForm() {
  // Los datos del centro ahora están en el estado, lo que permite su edición
  const [centerData, setCenterData] = React.useState({
    name: "Spa Caracas",
    phone: "123456789",
    description: "Spa Caracas es ....",
    address: "Calle Caroni, Las Mercedes, Caracas",
    socialMedia: "Instagram: @spaCaracas, TikTok: @spaCss",
    hours: "7am a 6pm",
  });

  const [isEditing, setIsEditing] = React.useState(false);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name?: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setCenterData(prevData => ({
      ...prevData,
      [name]: typeof value === "string" ? value : value[0],
    }));
  };

  // Función para manejar el guardado de los datos
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos a un servidor
    console.log("Datos actualizados:", centerData);
    setIsEditing(false); // Desactiva el modo de edición
  };

  return (
    <section className="mx-auto mt-9 w-full max-w-8xl rounded-3xl bg-green-200/40 p-14 max-md:px-5 max-md:mt-7">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <h2 className="text-3xl font-semibold tracking-wide leading-none text-neutral-600 flex items-center gap-2 max-md:mb-6" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
          Datos del centro
          <VscEdit
            size={24}
            className="ml-20 cursor-pointer text-yellow-700/60 hover:text-yellow-700 transition-colors"
            onClick={() => setIsEditing(!isEditing)}
          />
        </h2>
      </div>

      <form onSubmit={handleSave}>
        {/* Se utiliza grid para una distribución más similar a la imagen */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 w-full ">
          {/* Primer grupo de campos: Nombre del centro y Teléfono */}
          <ServiceFormField
            label="Nombre del centro:"
            name="name"
            value={centerData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            whiteBg={true}
          />
          <ServiceFormField
            label="Teléfono:"
            name="phone"
            value={centerData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            whiteBg={true}
          />
        </div>

        {/* Campo de descripción que ocupa todo el ancho */}
        <div className="mt-10">
          <ServiceFormField
            label="Descripción:"
            name="description"
            value={centerData.description}
            onChange={handleChange}
            type='textarea'
            readOnly={!isEditing}
            whiteBg={true}
          />
        </div>

        {/* Tercer grupo de campos: Dirección, Redes Sociales y Horario */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contenedor para Dirección y Redes Sociales */}
          <div className="flex flex-col gap-6">
            <ServiceFormField
              label="Dirección:"
              name="address"
              value={centerData.address}
              onChange={handleChange}
              readOnly={!isEditing}
              whiteBg={true}
            />
            <ServiceFormField
              label="Redes Sociales:"
              name="socialMedia"
              value={centerData.socialMedia}
              onChange={handleChange}
              readOnly={!isEditing}
              whiteBg={true}
            />
          </div>
          {/* Campo para Horario de Atención */}
          <ServiceFormField
            label="Horario de Atención:"
            name="hours"
            value={centerData.hours}
            onChange={handleChange}
            readOnly={!isEditing}
            whiteBg={true}
          />
        </div>

        {/* Botón de Guardar que solo se muestra en modo de edición */}
        {isEditing && (
          <div className="flex justify-end mt-10">
            <button
              type="submit"
              className="py-2 px-6 rounded-lg bg-yellow-700/60 text-white font-semibold hover:bg-yellow-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

// Componente principal de la página
function Perfil() {
  

  return (
    <div className="relative w-full min-h-screen bg-neutral-100 flex flex-col items-center pb-72 max-md:pb-24">
      <main className="flex flex-col items-center w-full max-w-5xl px-5">
        <h1 className="mt-8 text-4xl font-medium text-yellow-700/60 max-md:mt-10 max-md:text-3xl" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
          Configuración del centro
        </h1>
        <CenterDataForm />
      </main>
    </div>
  );
}

export default Perfil;
