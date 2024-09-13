// components/ModalMensaje.jsx
import React from 'react';
import './mensaje.css'; // Asegúrate de definir estilos adecuados para tu modal

export default function ModalMensaje({ mensaje, mostrar, onClose }) {
  if (!mostrar) return null; // Si no se debe mostrar, retorna null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{mensaje}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
