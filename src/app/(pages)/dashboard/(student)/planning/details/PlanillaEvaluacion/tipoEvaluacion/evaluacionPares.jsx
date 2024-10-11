import React, { useState, useEffect } from "react";

export default function EvaluacionPares() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('202000212@est.umss.edu');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  
  // Lista de miembros del equipo con sus correos
  const teamMembers = [
    { name: "Juan Pérez", email: "juan.perez@ejemplo.com" },
    { name: "María López", email: "maria.lopez@ejemplo.com" },
    { name: "Carlos García", email: "carlos.garcia@ejemplo.com" },
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
    <div className="evaluados-container flex flex-col justify-center items-center gap-[5px]">
      <h1 className="text-3xl w-full text-center">Evaluación por pares</h1>
      <div className="w-full flex gap-[20px]">
        <div className="bg-[#191919] rounded-[10px] p-[5px] w-[70%] h-[60px] flex flex-col gap-[5px]">
          <h3>Usuario evaluador:</h3>
          <div className="flex">
            {/*Espacio para imagen*/}
            <h4>{userName} | {userEmail}</h4>
          </div>
        </div>
        <div className="bg-[#191919] rounded-[10px] p-[5px] w-[70%] h-[60px] flex flex-col gap-[5px]">
          <h3>Usuario evaluado:</h3>
          <div className="flex justify-center">
            {/* Espacio para imagen */}
            <select value={selectedMember} 
              onChange={handleMemberChange}
              className="rounded-md"
              >
              <option value="" disabled>Seleccionar miembro</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member.email}>
                  {member.name} | {member.email}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-[#191919] rounded-[10px] p-[5px] w-[70%] h-[60px] flex flex-col gap-[5px]">
          <h3>Fecha de evaluación:</h3>
          <h4>{currentDate}</h4>
        </div>
      </div>
    </div>
  );
}
