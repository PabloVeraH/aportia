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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-stone-400 dark:text-stone-500 text-sm">Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {!activeCenter ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-stone-100 dark:bg-stone-800 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Sin centros asignados</h3>
              <p className="mt-2 text-stone-500 dark:text-stone-400 text-sm max-w-sm">
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
