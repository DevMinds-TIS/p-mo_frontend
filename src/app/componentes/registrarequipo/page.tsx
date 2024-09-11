"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./registrarequipo.css";

export default function PruevaPage() {
  const [selected, setSelected] = useState(null);
  const [showCrearEquipo, setShowCrearEquipo] = useState(false);
  const [equipos, setEquipos] = useState([
    { nombre: "Equipo 1", id: "e1" },
    { nombre: "Equipo 2", id: "e2" },
    { nombre: "Equipo 3", id: "e3" },
    { nombre: "Equipo 4", id: "e4" }
  ]);
  const [miembros, setMiembros] = useState([{ email: "", rol: "miembro" }]);
  const router = useRouter(); 
  const [isMounted, setIsMounted] = useState(false); // Verificar si el componente está montado en el cliente

  useEffect(() => {
    setIsMounted(true); // Indicar que el componente está montado
  }, []);

  // Acción de los botones en la parte izquierda
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
  };

  const handleRegistrarEquipo = () => {
    setShowCrearEquipo(true); 
  };

  const handleCancel = () => {
    setShowCrearEquipo(false); 
  };

  const handleMiembroChange = (index, field, value) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros[index][field] = value;
    setMiembros(nuevosMiembros);
  };

  const handleAgregarMiembro = () => {
    if (miembros.length < 6) {
      setMiembros([...miembros, { email: "", rol: "miembro" }]);
    }
  };

  const handleEliminarMiembro = (index) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros.splice(index, 1); // Eliminar miembro por su índice
    setMiembros(nuevosMiembros);
  };

  return (
    <div className="container">
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

      {showCrearEquipo ? (
        <main className="registrarequipos-container">
          <h2>Registrar Equipo</h2>
          <form className="form-container">
            <div className='form'>
              <div className="datos">
                {/* Espacio para introducir una imagen */}
                <label htmlFor="imagen">Subir Logo:</label>
                <input type="file" id="imagen" name="imagen" accept="image/*" />
                
                {/* Inputs para nombres */}
                <label htmlFor="nombreEquipo">Nombre del Equipo:</label>
                <input type="text" id="nombreEquipo" name="nombreEquipo" placeholder="Nombre del equipo" />
                
                <label htmlFor="descripcionEquipo">Nombre largo del equipo:</label>
                <input type="text" id="descripcionEquipo" name="descripcionEquipo" placeholder="Nombre largo del equipo" />
              </div>

              <div className="miembros">
                <h3>Miembros del Equipo</h3>
                {miembros.map((miembro, index) => (
                  <div key={index} className="miembro-item">
                    
                    <input
                      type="email"
                      id={`email-${index}`}
                      name={`email-${index}`}
                      placeholder="Correo del miembro"
                      value={miembro.email}
                      onChange={(e) => handleMiembroChange(index, 'email', e.target.value)}
                    />

                    <select
                      id={`rol-${index}`}
                      name={`rol-${index}`}
                      value={miembro.rol}
                      onChange={(e) => handleMiembroChange(index, 'rol', e.target.value)}
                    >
                      <option value="miembro">Miembro</option>
                      <option value="productOwner">Product Owner</option>
                      <option value="scrumMaster">Scrum Master</option>
                    </select>

                    {/* Botón para eliminar miembro */}
                    {miembros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleEliminarMiembro(index)}
                        style={{backgroundColor: "red", color: "white" }}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}

                {/* Botón para agregar nuevo miembro */}
                {miembros.length < 6 && (
                  <button type="button" onClick={handleAgregarMiembro} style={{ marginTop: "10px" }}>
                    Agregar Miembro
                  </button>
                )}
              </div>
            </div>
            <button type="submit">Registrar</button>
          </form>

          {/* Botón de cancelar */}
          <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
            Cancelar
          </button>
        </main>
      ) : (
        <main className="content">
          <div className='titulo-equipos'>
            <h1>Equipos</h1>
          </div>
          <div className="equipos-container">
            {equipos.map((equipo) => (
              <div key={equipo.id} className="equipo-item">
                <Image
                  src={`/iconos/folder.svg`}
                  alt={`Folder`}
                  width={40}
                  height={48}
                />
                <div className='equipo-item-info'>
                  <a href='/componentes/registrarequipo'>
                    <h2>{equipo.nombre}</h2>
                    <p>ID: {equipo.id}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="boton-fijo">
            <button onClick={handleRegistrarEquipo}><b>Registrar Equipo</b></button>
          </div>
        </main>
      )}
    </div>
  );
}
