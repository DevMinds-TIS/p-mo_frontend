"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './menu.css'

export default function Menu() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Indicar que el componente está montado
  }, []);

  const handleClick = (index, num) => {
    setSelected(index);
    console.log(`Botón ${index} presionado`);

    if (num === 6) { // Revisar si el botón es el 5
      if (isMounted) {
        router.push('/'); // Redirige a la ruta deseada
      }
    }

    if (num === 5) { // Revisar si el botón es el 5
      if (isMounted) {
        router.push('/componentes/editarperfil'); // Redirige a la ruta deseada
      }
    }

    if (num === 1) {
      if (isMounted) {
        router.push('/componentes/calendarizacion'); // Redirige a la ruta deseada
      }
    }

    if (num === 3) {
      if (isMounted) {
        router.push('/componentes/Info'); // Redirige a la ruta deseada
      }
    }

  };

  return (
    <aside className="menu">
      <div className='imagen'>
        <a href='/componentes/home'>
          <Image
            src="/iconos/logomenu.svg"
            alt="Logo de la aplicación"
            width={40}
            height={50}
          />
        </a>
      </div>
      {[1, 2, 3, 4, 5, 6].map((num, index) => (
        <button
          key={index}
          className={`menu-button ${selected === index ? 'active' : ''}`}
          onClick={() => handleClick(index, num)}
        >
          <Image
            src={`/iconos/icon${num}.svg`}
            alt={`Icono ${num}`}
            width={40}
            height={48}
          />
        </button>
      ))}
    </aside>
  );
}
