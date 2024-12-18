import React, { useState, useEffect } from 'react';
import { EyeFilledIcon } from "@nextui-org/shared-icons"; // Usaremos EyeFilledIcon como un icono de advertencia

interface ModalProps {
  message: string;
  onClose: () => void;
  className?: string;
}

const ErrorModal: React.FC<ModalProps> = ({ message, onClose, className }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, [message]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className={`${className} fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20`}>
          <div className="bg-[#191919] text-white p-6 rounded-lg shadow-lg z-60 max-w-sm">
            <div className="flex items-center space-x-4">
              <EyeFilledIcon className="text-red-500 w-6 h-6" />
              <p className="text-lg font-medium">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 mx-auto block px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 items-center justify-center space-x-2"
            >
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorModal;
