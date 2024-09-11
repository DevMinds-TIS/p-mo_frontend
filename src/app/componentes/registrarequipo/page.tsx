"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./registrarequipo.css";
import { getAllRegisterEquipo, createRegisterEquipo } from '../../../../api/register.api';

export default function PruevaPage() {
  const [selected, setSelected] = useState(null);
  const [showCrearEquipo, setShowCrearEquipo] = useState(false);
  const [equipos, setEquipos] = useState([]); // Inicializa como array vacío
  const [miembros, setMiembros] = useState([{ email: "", rol: "miembro" }]);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    setIsMounted(true); // Cambia el estado a true cuando el componente se monta
  }, []);

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);



  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await getAllRegisterEquipo();
        console.log('Datos de equipos:', response.data);
        if (response.data && Array.isArray(response.data.equipos)) {
          setEquipos(response.data.equipos);
        } else {
          console.error('Formato inesperado de datos:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };

    fetchEquipos();
  }, []);


  const handleClick = (index, num) => {
    setSelected(index);
    console.log(`Botón ${index} presionado`);

    if (num === 5) {
      if (isMounted) {
        
          window.sessionStorage.removeItem('userData');
          router.push('/'); // Redirigir al login
        

       // router.push('/');
      }
    }

    if (num === 6) {
      if (isMounted) {
        router.push('/componentes/editarperfil');
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
    nuevosMiembros.splice(index, 1);
    setMiembros(nuevosMiembros);
  };


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    console.log('Formulario enviado'); // Verificar si la función se ejecuta

    const form = event.target;

    const formData = new FormData();
    formData.append('Nombredelequipo', form.nombreEquipo.value);
    formData.append('nombre_equipo_largo', form.descripcionEquipo.value);

    // Comprobar si el archivo ha sido seleccionado
    if (form.imagen.files.length > 0) {
      console.log('Imagen seleccionada:', form.imagen.files[0]);
      formData.append('fotodelogoEquipo', form.imagen.files[0]); // Añadir archivo al FormData
    } else {
      console.log('No se seleccionó ninguna imagen');
      formData.append('fotodelogoEquipo', null); // Enviar null si no hay imagen seleccionada
    }

    try {
      const response = await fetch('http://localhost:8000/api/equipo', {
        method: 'POST',
        body: formData, // No uses JSON.stringify aquí porque estás enviando archivos
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Ver respuesta del servidor

      if (response.ok) {
        console.log("Equipo creado correctamente");
        // Refrescar la lista de equipos
        const updatedEquipos = await getAllRegisterEquipo();
        setEquipos(updatedEquipos.data.equipos);
      } else {
        console.error('Error en la respuesta del servidor:', data);
      }
      form.reset();
      setShowCrearEquipo(false);
    } catch (error) {
      console.error('Error al registrar el equipo:', error);
    }
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
          <form className="form-container" onSubmit={handleSubmit}>
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
                        style={{ backgroundColor: "red", color: "white" }}
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
              <div key={equipo.idequipo} className="equipo-item">
                <Image
                  src={`/iconos/folder.svg`}
                  alt={`Folder`}
                  width={40}
                  height={48}
                />
                <div className='equipo-item-info'>
                  <a href='/componentes/registrarequipo'>
                    <h2>{equipo.Nombredelequipo}</h2>
                    <p>ID: {equipo.idequipo}</p>
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
