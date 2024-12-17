import React, { useState, useEffect } from "react";

export default function EvaluacionCruzada() {
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
      // setUserEmail(userData.correo); // Asumiendo que el campo 'correo' está en userData
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
    <div className="flex flex-col justify-center items-center py-5">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">Evaluación Cruzada</h1>
      </div>
      <div className="w-full flex flex-wrap gap-6 justify-center">
        {/* Usuario evaluador */}
        <div className="bg-[#191919] rounded-lg p-4 w-[45%] md:w-[30%] h-[auto] flex flex-col gap-2">
          <h3 className="text-white font-semibold">Usuario evaluador:</h3>
          <div className="text-white text-sm">
            <h4>{userName} | {userEmail}</h4>
          </div>
        </div>

        {/* Equipo evaluado */}
        <div className="bg-[#191919] rounded-lg p-4 w-[45%] md:w-[30%] h-[auto] flex flex-col gap-2">
          <h3 className="text-white font-semibold">Equipo evaluado:</h3>
          <div>
            <select
              value={selectedMember}
              onChange={handleMemberChange}
              className="w-full h-[40px] p-2 bg-gray-700 text-white rounded focus:outline-none"
            >
              <option value="" disabled>Seleccionar equipo</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member.email}>
                  {member.name} | {member.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha de evaluación */}
        <div className="bg-[#191919] rounded-lg p-4 w-[45%] md:w-[30%] h-[auto] flex flex-col gap-2">
          <h3 className="text-white font-semibold">Fecha de evaluación:</h3>
          <h4 className="text-white text-sm">{currentDate}</h4>
        </div>
      </div>
    </div>
  );
}
