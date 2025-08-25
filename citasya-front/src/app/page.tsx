"use client";
import * as React from "react";

import { StatsCard } from "../components/homePage/StatsCard";
import { AppointmentsList } from "../components/homePage/AppointmentsList";
import { VscAdd, VscCalendar } from "react-icons/vsc";
import { NewAppointment } from "@/components/appointments/NewAppointment";
import { useRouter } from 'next/navigation'; 

function HomePage() {
  const [showModalAppointment, setShowModalAppointment] = React.useState(false);
  const handleOpenModalAppointment = () => setShowModalAppointment(true);
  const handleCloseModalAppointment = () => {
    setShowModalAppointment(false);
  };  
  const router = useRouter(); 

  return (
    <div className="flex overflow-hidden flex-col items-center pb-28 bg-neutral-100 max-md:pb-24">

      <main className="flex flex-col items-center w-full">
        <h1 className="mt-12 text-6xl font-bold text-center text-yellow-700/60 max-md:mt-10 max-md:text-4xl" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
          SPA CARACAS
        </h1>

        <section className="mt-14 w-full max-w-[1125px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:">
            <div className="w-[33%] max-md:ml-0 max-md:w-full">
              <StatsCard
                title="Citas Confirmadas"
                value={20}
                variant="confirmed"
              />
            </div>
            <div className="ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <StatsCard
                title="Citas Pendientes"
                value={10}
                variant="pending"
              />
            </div>
            <div className="ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <StatsCard
                title="Citas Canceladas"
                value={3}
                variant="cancelled"
              />
            </div>
          </div>
        </section>

        <section className="mt-14 w-full max-w-[1125px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <AppointmentsList />
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10 max-md:max-w-full">
                  <section className="flex flex-col px-11 pt-6 w-full bg-white rounded-3xl max-md:px-5 max-md:max-w-full">
                    <h2 className="self-center text-2xl font-bold tracking-wide leading-8 text-center text-neutral-700 w-[310px]">
                      Servicios más agendado<span style={{letterSpacing: "1px"}}>s</span>
                    </h2>
                    <div className="mt-4 w-full">
                      <div className="flex gap-5 max-md:flex-col max-md:">
                        <div className="w-[56%] max-md:ml-0 max-md:w-full">
                           {/* Aqui ira el grafico */}
                          </div>
                        </div>
                        <div className="ml-5 w-[44%] max-md:ml-0 max-md:w-full">
                          <div className="flex overflow-hidden flex-col self-stretch pt-6 pr-2.5 pb-2.5 pl-3 my-auto w-full text-xs font-medium text-black min-h-[151px] max-md:mt-10">
                            <div className="flex justify-between items-center w-full text-base tracking-tight whitespace-nowrap">
                              <h3 className="self-stretch my-auto">Servicio</h3>
                            </div>
                            <div className="flex justify-between items-center mt-7 w-full whitespace-nowrap">
                              <div className="flex overflow-hidden flex-col justify-center items-start self-stretch my-auto w-[150px]">
                                <div className="flex overflow-hidden gap-2.5 items-center">
                                  <div className="flex shrink-0 self-stretch my-auto w-5 h-5 bg-green-300 rounded" />
                                  <span className="self-stretch my-auto">Manos</span>
                                </div>
                              </div>
                            </div>
                              <div className="flex overflow-hidden flex-col justify-center items-start self-stretch my-auto w-[150px]">
                                <div className="flex overflow-hidden gap-2.5 items-center">
                                  <div className="flex shrink-0 self-stretch my-auto w-5 h-5 bg-yellow-700/60 rounded" />
                                <span className="self-stretch my-auto">Masajes Corporales</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </section>
                  <section className="flex flex-col items-center px-20 pt-8 pb-16 mt-7 font-bold text-center bg-white rounded-3xl shadow-[4px_4px_6px_rgba(0,0,0,0.25)] max-md:px-5 max-md:max-w-full">
                    <div className="flex flex-col max-w-full w-[204px]">
                      <h2 className="text-2xl tracking-wide leading-none text-neutral-700">
                        Nuevos Clientes
                      </h2>
                      <p className="self-center mt-9 text-6xl leading-tight text-neutral-600 max-md:text-4xl">
                        7
                      </p>
                    </div>
                  </section>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-10 mt-14 max-w-full text-2xl font-semibold text-center text-white w-[584px] max-md:mt-10 justify-center items-center">
          <button
            onClick={() => router.push("/appointments#top")} // Cambia aquí
            className="relative cursor-pointer h-[50px] w-[201px] max-sm:h-[45px] max-sm:w-[180px]"
          >
            <div className="rounded-lg shadow-lg bg-yellow-700/60 size-full" />
            <div className="absolute left-[24px] top-[13px]">
              <VscCalendar className="text-white size-6" />
            </div>
            <span
              className="absolute h-6 text-base font-bold leading-6 text-center text-white left-[54px] top-[13px] w-[133px] max-sm:text-sm max-sm:left-[45px] max-sm:top-[11px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ver Calendario
            </span>
          </button>
          <button
            onClick={handleOpenModalAppointment}
            className="relative cursor-pointer h-[50px] w-[201px] max-sm:h-[45px] max-sm:w-[180px]">
            <div className="rounded-lg shadow-lg bg-yellow-700/60 size-full" />
                <div className="absolute left-[24px] top-[13px]">
                  <VscAdd className="text-white size-6" />
                </div>
                <span className="absolute h-6 text-base font-bold leading-6 text-center text-white left-[54px] top-[13px] w-[133px] max-sm:text-sm max-sm:left-[45px] max-sm:top-[11px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Nueva cita
                </span>
          </button>
        </section>
      </main>
            {/* Renderizado condicional del modal de nuevo servicio */}
              {showModalAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-300/50 backdrop-blur-sm">
                  <NewAppointment onClose={handleCloseModalAppointment} />
                </div>
            )}

                        {/* Renderizado condicional del modal de nuevo servicio */}

    </div>
  );
}

export default HomePage;
