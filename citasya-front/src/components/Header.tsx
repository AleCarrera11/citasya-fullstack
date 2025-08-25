'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VscAccount } from "react-icons/vsc";


const poppinsFontUrl = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap";
const robotoCondensedFontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap";

export const Header: React.FC = () => {
  const [activePath, setActivePath] = useState('/');

  // Array de links para la navegación
  const navLinks = [
    { name: 'CITAS', href: '/appointments' },
    { name: 'CLIENTES', href: '/clients' },
    { name: 'SERVICIOS', href: '/services' },
    { name: 'ESPECIALISTAS', href: '/workers' },
  ];

  useEffect(() => {
    const poppinsLink = document.createElement('link');
    poppinsLink.href = poppinsFontUrl;
    poppinsLink.rel = 'stylesheet';
    document.head.appendChild(poppinsLink);

    const robotoCondensedLink = document.createElement('link');
    robotoCondensedLink.href = robotoCondensedFontUrl;
    robotoCondensedLink.rel = 'stylesheet';
    document.head.appendChild(robotoCondensedLink);

    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(robotoCondensedLink);
    };
  }, []);

  return (
    <>
      <header className="z-10 flex items-center justify-between px-20 py-0 w-full shadow-lg bg-neutral-100 h-[117px] max-md:flex-wrap max-md:px-10 max-sm:flex-col max-sm:gap-4 max-sm:items-start max-sm:p-5 max-sm:h-auto">
        <div className="flex items-center gap-50 max-md:gap-5 max-sm:flex-wrap max-sm:gap-4">
            <Link href="/" className="mr-auto text-3xl font-bold text-neutral-600 max-sm:text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              CitasYa
            </Link>
            
        </div>

        <div className="flex items-center gap-12  max-sm:flex-col  max-sm:items-start">
          <nav className="flex items-center gap-12 max-md:gap-5 max-sm:flex-wrap max-sm:gap-4">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <a key={link.name} href={link.href} onClick={() => setActivePath(link.href)} className="flex relative flex-col items-center group">
                  <span className={`text-xl font-bold text-stone-600 max-sm:text-base ${isActive ? 'text-green-500' : ''}`} style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    {link.name}
                  </span>
                  <div
                    className={`h-[3px] mt-1 rounded-sm transition-all duration-300 ${
                      isActive ? 'bg-green-300 w-full' : 'bg-transparent w-0 group-hover:w-full group-hover:bg-green-200'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

            <Link href="/profile" className="ml-12 max-md:ml-5">
            <button
              type="button"
              className="focus:outline-none"
              aria-label="Ir al perfil"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <VscAccount className="size-9 text-green-300/80 hover:text-yellow-700/60 transition-colors duration-200" />
            </button>
            </Link>
        </div>
      </header>
    </>
  );
};
