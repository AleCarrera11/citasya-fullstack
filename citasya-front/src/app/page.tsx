"use client";
import * as React from "react";

import { StatsCard } from "../components/dashboard/StatsCard";
import { AppointmentsList } from "../components/dashboard/AppointmentsList";
import {ServicesChart} from "../components/dashboard/ServiceChart";
import { VscAdd, VscCalendar } from "react-icons/vsc";
import { NewAppointment } from "@/components/appointments/NewAppointment";
import { useRouter } from 'next/navigation'; 
import { CiCalendar } from "react-icons/ci";

function HomePage() {
  const [showModalAppointment, setShowModalAppointment] = React.useState(false);
  const handleOpenModalAppointment = () => setShowModalAppointment(true);
  const handleCloseModalAppointment = () => {
    setShowModalAppointment(false);
  };  
  const router = useRouter(); 
  const [activeTab, setActiveTab] = React.useState<'day' | 'week' | 'month'>('week');

  return (
    <div className="flex overflow-hidden flex-col items-center pb-28 bg-[#F9FAFB] max-md:pb-24" style={{ fontFamily: 'Poppins, sans-serif'}}>
      <main className="flex flex-col w-full px-30">
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center">
          <span className="mr-4 flex items-center justify-center bg-[#D9E8F5] rounded-full" style={{ width: 48, height: 48 }}>
            <CiCalendar className="text-2xl text-[#447F98]" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              SPA CARACAS
            </h1>
            <p className="text-sm text-gray-500">
              Dashboard de gestión • miércoles, 27 de agosto
            </p>
          </div>
          </div>
          <div className="flex items-right h-full">
            {/* Tabs component */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {[
                { label: "Día", value: "day" },
                { label: "Semana", value: "week" },
                { label: "Mes", value: "month" },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as 'day' | 'week' | 'month')}
                  className={`px-8 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.value
                      ? "bg-[#D6EBF3] text-[#447F98] border-b-2 border-t-2 border-[#447F98]"
                      : "bg-white text-gray-500"
                  }`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14 w-full max-md:mt-10 max-md:max-w-full">
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

        <section className="mt-14 w-full max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <AppointmentsList />
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10 max-md:max-w-full">
                  <section className="flex flex-col w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full">
                    <ServicesChart />
                  </section>
                  <section className="flex flex-col items-center mt-7 pb-6 font-bold text-center bg-white rounded-lg shadow-md max-md:px-5 max-md:max-w-full">
                    <div className="flex flex-col w-full max-w-full ">
                      <h2 className="p-6 text-md text-left  font-medium bg-neutral-100 text-neutral-700 rounded-t-lg">
                        Nuevos Clientes
                      </h2>
                      <p className="self-center pt-6 pt-2 text-4xl leading-tight text-neutral-600 max-md:text-2xl">
                        7
                      </p>
                      <p className="text-xs font-medium mt-2 text-[#447F98]">+2 vs. semana anterior</p>
                      <div className="mx-10 mt-4 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="px-10 bg-[#447F98] h-2.5 rounded-full"
                          style={{
                            width: '70%',
                          }}
                        ></div>
                      </div>
                      <div className="px-10 w-full flex justify-between text-xs font-medium text-neutral-500 mt-1">
                        <span>Meta: 10</span>
                        <span>70% completado</span>
                      </div>
                    </div>
                  </section>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-10 mt-14 w-full max-w-xl mx-auto text-2xl font-semibold text-center text-white justify-center items-center">
          <button
            onClick={() => router.push("/appointments#top")} // Cambia aquí
            className="relative cursor-pointer h-[50px] w-[201px] max-sm:h-[45px] max-sm:w-[180px]"
          >
            <div className="rounded-lg shadow-lg bg-[#447F98] size-full" />
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
            <div className="rounded-lg shadow-lg bg-[#D6EBF3] size-full" />
                <div className="absolute left-[24px] top-[13px]">
                  <VscAdd className="text-[#447F98] size-6" />
                </div>
                <span className="absolute h-6 text-base font-bold leading-6 text-center text-[#447F98] left-[54px] top-[13px] w-[133px] max-sm:text-sm max-sm:left-[45px] max-sm:top-[11px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
