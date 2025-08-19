"use client";
import * as React from "react";
import { SpecialistList } from "../../components/worker/WorkerList";

function Especialista() {
  return (
    <div className="flex flex-col items-center pb-20 bg-neutral-100 min-h-screen">
      <main className="mt-12 ml-10 w-full max-w-[1273px] max-md:mt-10 max-md:max-w-full flex flex-col">
        <h1
          className="text-4xl font-medium text-yellow-700/60 max-md:max-w-full text-center w-full"
          style={{ fontFamily: "Roboto Condensed, sans-serif" }}
        >
          Directorio de Especialistas
        </h1>
        <div className="mt-7 w-full max-md:max-w-full flex-grow">
          <SpecialistList />
        </div>
      </main>
    </div>
  );
}


export default Especialista;
