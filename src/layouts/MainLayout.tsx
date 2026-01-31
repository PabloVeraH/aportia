import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useCenter } from '@/context/CenterContext';
import { AlertCircle } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { activeCenter, loading } = useCenter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-500">Cargando aplicación...</div>
      </div>
    );
  }

  // If no active center is selected (and not loading), we block access to the main UI
  // except maybe we should allow it but show the error state as in Dashboard?
  // Dashboard had specific logic for "Sin Centros Asignados".
  // Probably better to let the children render or handle it here.
  // The Dashboard handled it nicely, but if we have a sidebar, maybe we still want the sidebar visible?
  // For now, let's keep the layout structure and let the content handle the empty state,
  // OR we can lift that check here.
  // If we lift it, the sidebar might still be useful (e.g. to logout).

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {!activeCenter ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 dark:bg-slate-800 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white">Sin Centros Asignados</h3>
              <p className="mt-2 text-slate-500 max-w-sm">
                No tienes acceso a ningún centro operativo activo. Por favor, contacta a un administrador.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
