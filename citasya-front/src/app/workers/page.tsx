"use client";
import * as React from "react";
import { SpecialistList } from "../../components/worker/WorkerList";

function Workers() {
  return (
    <div className="z-0 relative w-full min-h-screen flex flex-col items-center pb-20 bg-neutral-100">
      <main className="mt-8 ml-10 w-full max-w-[1273px] max-md:mt-10 max-md:max-w-full flex flex-col">
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


export default Workers;
