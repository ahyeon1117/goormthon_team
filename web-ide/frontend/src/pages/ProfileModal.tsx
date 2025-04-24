import React from 'react';
import { FiX } from 'react-icons/fi';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-dashboard-background shadow-lg p-6 rounded-xl w-[400px] relative">
        <button onClick={onClose} className="absolute top-7 right-7 text-white text-xl font-bold">
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
