"use client"; // Asegúrate de colocar esta línea al inicio del archivo

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter desde 'next/navigation'

export default function Home() {
  const router = useRouter(); // Crear instancia del router
  const [isMounted, setIsMounted] = useState(false); // Verificar si el componente está montado en el cliente

  useEffect(() => {
    setIsMounted(true); // Indicar que el componente está montado
  }, []);

  // Estados para los campos del formulario de inicio de sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para el mensaje de error

  // Estado para alternar visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estado para mostrar el formulario de crear cuenta nueva
  const [showModal, setShowModal] = useState(false);

  // Estados para el formulario de registro
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState(''); // Para el desplegable de roles

  const [registerErrors, setRegisterErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar si el correo tiene un dominio válido
    const emailDomain = email.split('@')[1]; // Obtener el dominio del correo
    const validDomains = ['gmail.com', 'est.umss.edu'];

    if (!validDomains.includes(emailDomain)) {
      setError('El correo o la contraseña son incorrectos');
    } else {
      setError('');
      console.log('Email:', email);
      console.log('Password:', password);
      
      // Redirigir solo si el componente está montado
      if (isMounted) {
        router.push('/componentes/home');
      }
    }
  };

  // Función para validar los campos del registro
  const validateRegisterForm = () => {
    const errors = {};
    if (name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (lastName.length < 5) {
      errors.lastName = 'El apellido debe tener al menos 5 caracteres';
    }
    if (!registerEmail.includes('@') || !registerEmail.includes('.')) {
      errors.registerEmail = 'El correo debe tener el carácter "@" y "."';
    }
    if (registerPassword.length < 8) {
      errors.registerPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!role) {
      errors.role = 'Debe seleccionar un rol para su registro';
    }
    return errors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    const errors = validateRegisterForm();
    
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
    } else {
      setRegisterErrors({});
      console.log('Name:', name);
      console.log('LastName:', lastName);
      console.log('Email:', registerEmail);
      console.log('Password:', registerPassword);
      console.log('Role:', role);
      setShowModal(false);
    }
  };

  return (
    <main>
      <div className="contenedor-logo">
        <div className='imagen'>
          <Image
            src="/iconos/logoG.svg"
            alt="Logo de la aplicación"
            width={400}
            height={480}
          />
        </div>
      </div>
      <div className="contenedor-formulario">
        <div className='formulario'>
          <h1>Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Correo Electrónico'
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Contraseña'
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"} {/* Cambia el ícono */}
              </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit"><b>Iniciar Sesión</b></button>
          </form>
          <a href='/componentes/home'><p>¿Olvido su contraseña?</p></a>
          <hr />
          <button onClick={() => setShowModal(true)}><b>Crear una cuenta nueva</b></button>
        </div>
      </div>

      {/* Formulario emergente para crear una cuenta nueva */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button id="cerrar-registro" onClick={() => setShowModal(false)}>✖</button>
            <div className='titulo-registro'>
              <h1>Únete</h1>
            </div>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                required
              />
              {registerErrors.name && <p style={{ color: 'red' }}>{registerErrors.name}</p>}

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
                required
              />
              {registerErrors.lastName && <p style={{ color: 'red' }}>{registerErrors.lastName}</p>}

              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Correo Electrónico"
                required
              />
              {registerErrors.registerEmail && <p style={{ color: 'red' }}>{registerErrors.registerEmail}</p>}

              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {registerErrors.registerPassword && <p style={{ color: 'red' }}>{registerErrors.registerPassword}</p>}

              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">Selecciona un rol</option>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
              </select>
              {registerErrors.role && <p style={{ color: 'red' }}>{registerErrors.role}</p>}

              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
