import React, { useState, useEffect } from "react";
import "./autoEvaluacion.css";

export default function EvaluacionPares() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('202000212@est.umss.edu');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  
  // Lista de miembros del equipo con sus correos
  const teamMembers = [
    { name: "Devminds", email: "devminds@ejemplo.com" },
    { name: "squasoft", email: "squasoft@ejemplo.com" },
    { name: "coders", email: "coders@ejemplo.com" },
  ];

  useEffect(() => {
    // Obtener los datos del usuario
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
      //setUserEmail(userData.correo); // Asumiendo que el campo 'correo' está en userData
    }

    // Obtener la fecha actual en formato dd/mm/aa
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleMemberChange = (event) => {
    setSelectedMember(event.target.value);
  };

  return (
    <div className="evaluados-container">
      <div className="titulo1">
        <h1>Evaluación Cruzada</h1>
      </div>
      <div className="evaluadores">
        <div className="evaluado">
          <h3>Usuario evaluador:</h3>
          <div className="datos2">
            {/*Espacio para imagen*/}
            <h4>{userName} | {userEmail}</h4>
          </div>
        </div>
        <div className="evaluado">
          <h3>Equipo evaluado:</h3>
          <div className="datos2">
            {/* Espacio para imagen */}
            <select value={selectedMember} onChange={handleMemberChange}>
              <option value="" disabled>Seleccionar equipo</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member.email}>
                  {member.name} | {member.email}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="evaluado">
          <h3>Fecha de evaluación:</h3>
          <h4>{currentDate}</h4>
        </div>
      </div>
    </div>
  );
}