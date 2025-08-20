"use client";
import * as React from "react";
import { ClientDirectory } from "../../components/clients/ClientDirectory";

function Clientes() {
  return (
    <div className="z-0 relative w-full min-h-screen flex overflow-hidden flex-col items-center pb-24 bg-neutral-100 ">
      <h1 className="text-4xl font-medium text-yellow-700/60 mt-8 max-md:mt-10" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
        Directorio de Clientes
      </h1>

      <div className="mt-7 w-full max-w-[1273px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <ClientDirectory />
        </div>
      </div>
    </div>
  );
}

export default Clientes;
