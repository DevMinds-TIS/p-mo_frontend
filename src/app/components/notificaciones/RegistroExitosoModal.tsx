import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message = 'Registro exitoso',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded shadow-lg relative w-60">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-base font-semibold mb-2 text-white"> {/* Tamaño de texto reducido */}
          ¡Éxito!
        </h2>
        <p className="text-sm mb-4 text-white"> {/* Tamaño de texto reducido */}
          {message}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm" 
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

