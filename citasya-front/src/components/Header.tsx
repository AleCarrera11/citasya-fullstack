'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VscAccount } from "react-icons/vsc";

// Todos los textos usan la fuente Poppins
export const Header: React.FC = () => {
  const pathname = usePathname();

  // Array de links para la navegación
  const navLinks = [
    { name: 'CITAS', href: '/appointments' },
    { name: 'CLIENTES', href: '/clients' },
    { name: 'SERVICIOS', href: '/services' },
    { name: 'ESPECIALISTAS', href: '/workers' },
  ];

  return (
    <header className="flex shrink-0 justify-center items-center px-20 pt-0 pb-px w-full bg-white rounded-md shadow-md h-[69px] max-md:px-8 max-md:pt-0 max-md:pb-px max-sm:px-4 max-sm:pt-0 max-sm:pb-px" style={{ boxShadow: '0 2px 12px 0 rgba(68, 127, 152, 0.08)' }}>
      <div className="flex shrink-0 justify-between items-center py-4 w-full max-w-screen-xl h-[68px] max-md:px-0 max-md:py-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 justify-start items-start w-20 h-8">
          <div className="flex shrink-0 justify-center items-center h-8 w-[75px]">
            <h1 className="shrink-0 h-8 text-2xl font-bold leading-8 text-slate-300 w-[55px]" style={{ color: "#B9D8E1", fontFamily: 'Poppins, sans-serif'}}>
              Citas
            </h1>
          </div>
          <div className="flex flex-col shrink-0 justify-center items-center h-8 w-[25px]">
            <span className="shrink-0 h-8 text-2xl font-bold leading-8 text-slate-500 w-[25px]" style={{ color: "#447F98", fontFamily: 'Poppins, sans-serif' }}>
              Ya
            </span>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="flex shrink-0 gap-1 justify-end items-center h-9 w-[431px] max-md:gap-2 max-md:w-auto max-sm:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className="flex relative flex-col items-center group">
                <button
                  className={`flex shrink-0 justify-center items-center px-4 pt-2 pb-2.5 rounded-md max-md:px-3 max-md:pt-1.5 max-md:pb-2
                  ${isActive ? '' : ''}
                  `}
                  style={isActive ? { background: '#D6EBF3' } : undefined}
                >
                  <span className={`shrink-0 text-base font-medium leading-6 ${isActive ? 'text-primary' : ''} max-md:text-base`} style={{ background: isActive ? '#D6EBF3' : undefined, color: "#447F98", fontFamily: 'Poppins, sans-serif' }}>
                  {link.name}
                  </span>
                </button>
              </Link>
            );
          })}
          <Link href="/profile" className="flex shrink-0 justify-center items-center w-9 h-9 ml-2">
            <VscAccount className="size-9 hover:text-primary/20 transition-colors duration-200 rounded-2xl " style={{  background: pathname === '/profile' ? '#D6EBF3' : undefined, color: "#447F98" }} />
          </Link>
        </nav>
      </div>
    </header>
  );
};
