"use client"; // Asegúrate de que este archivo se trate como un componente de cliente

import { useState } from 'react';
import ConfirmCancelModal from '../app/components/ConfirmCancelModal';
import ErrorModal from '../app/components/ErrorModal';
import RegistroExitosoModal from './components/RegistroExitosoModal';

const Home = () => {
  // Estado separado para cada modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Funciones para abrir y cerrar modales
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const handleConfirm = () => {
    console.log('Acción confirmada');
    closeConfirmModal();
  };

  const openErrorModal = () => setIsErrorModalOpen(true);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* Botón para abrir el modal de confirmación */}
      <button onClick={openConfirmModal} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">
        Abrir Confirmar Modal
      </button>

      {/* Botón para abrir el modal de error */}
      <button onClick={openErrorModal} className="px-4 py-2 bg-red-500 text-white rounded mb-4">
        Abrir Error Modal
      </button>

      {/* Botón para abrir el modal de éxito */}
      <button onClick={openSuccessModal} className="px-4 py-2 bg-green-500 text-white rounded">
        Abrir Registro Exitoso Modal
      </button>

      {/* Modales */}
      <ConfirmCancelModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        title="Confirmar Acción"
        message="¿Estás seguro de que deseas realizar esta acción?"
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        message="Ocurrió un error inesperado"
      />

      <RegistroExitosoModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message="El registro ha sido exitoso"
      />
    </main>
  );
};

export default Home;

