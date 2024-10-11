import React from 'react';

export default function ModalMensaje({ mensaje, mostrar, onClose }) {
  if (!mostrar) return null; // Si no se debe mostrar, retorna null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-[#191919] p-5 rounded-[10px] text-center text-[20px]">
        <p>{mensaje}</p>
        <button 
          onClick={onClose}
          className='mt-2 p-1 px-2 bg-[#FE7F2D] rounded-md'
        >Cerrar</button>
      </div>
    </div>
  );
}
