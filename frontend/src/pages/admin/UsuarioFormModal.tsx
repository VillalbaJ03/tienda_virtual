import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UsuarioFormPage from './UsuarioFormPage';

export default function UsuarioFormModal({ open, onClose, onSuccess, usuario }: { open: boolean, onClose: () => void, onSuccess: () => void, usuario?: any }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[100] flex items-center justify-center" onClose={onClose}>
        {/* Fondo oscuro desenfocado y centrado */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[3px] transition-opacity" />
        </Transition.Child>
        {/* Modal principal centrado */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0 translate-y-8 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-8 scale-95"
        >
          <Dialog.Panel className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 p-0 flex flex-col overflow-visible animate-fadeIn">
            {/* Botón de cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full bg-white/80 hover:bg-blue-100 p-3 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 z-20 border border-blue-200"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-7 w-7 text-blue-500" />
            </button>
            <Dialog.Title as="h3" className="text-3xl font-extrabold text-blue-700 mb-2 text-center pt-8 pb-2 px-6">
              {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Dialog.Title>
            <div className="overflow-y-auto max-h-[70vh] px-4 pb-4 pt-2">
              <UsuarioFormPage isModal usuario={usuario} onSuccess={onSuccess} onClose={onClose} />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
