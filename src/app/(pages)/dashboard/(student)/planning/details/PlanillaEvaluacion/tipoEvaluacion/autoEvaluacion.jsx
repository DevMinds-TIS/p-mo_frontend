import React, { useState, useEffect } from "react";

export default function AutoEvaluacion() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('202000212@est.umss.edu');
  const [currentDate, setCurrentDate] = useState('');

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

  return (
    <div className="flex flex-col justify-center items-center gap-[5px]">
      <h1 className="text-3xl w-full text-center">Autoevaluación</h1>
      <div className="w-full flex gap-[20px]">
        <div className="bg-[#191919] rounded-[10px] p-[5px] w-[70%] h-[60px] flex flex-col gap-[5px]">
					<h3>Usuario propietario:</h3>
					<div className="flex">
						<h4>{userName} | {userEmail}</h4>
					</div>
        </div>
        <div className="bg-[#191919] rounded-[10px] p-[5px] w-[30%] h-[60px] flex flex-col gap-[5px]">
					<h3>Fecha de evaluación:</h3>
          <h4>{currentDate}</h4>
        </div>
      </div>
    </div>
  );
}
