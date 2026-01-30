import { Link } from 'react-router-dom';
import { useCenter } from '@/context/CenterContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, Package, CheckSquare, PlusCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { activeCenter, centers, switchCenter, loading } = useCenter();
  const { signOut } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando dashboard...</div>;
  }

  if (!activeCenter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-full h-20 w-20 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white">Sin Centros Asignados</h3>
        <p className="mt-2 text-slate-500 max-w-sm">
          No tienes acceso a ningún centro operativo activo. Por favor, contacta a un administrador para solicitar acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Center Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Resumen de operaciones del centro</p>
        </div>

        <div className="flex gap-4 items-center">
          {centers.length > 1 && (
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">Centro Activo</label>
              <select
                value={activeCenter.id}
                onChange={(e) => switchCenter(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {centers.length === 1 && (
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium border border-indigo-100">
              {activeCenter.name}
            </div>
          )}
          <button onClick={signOut} className="text-sm text-red-600 hover:text-red-800 font-medium">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Donaciones Hoy</h3>
            <Building2 className="h-5 w-5 text-indigo-500 opacity-75" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">0</p>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <span className="font-medium">+0%</span>
            <span className="ml-1 text-slate-400">vs ayer</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Items Recibidos</h3>
            <Package className="h-5 w-5 text-blue-500 opacity-75" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pendientes de Revisión</h3>
            <CheckSquare className="h-5 w-5 text-amber-500 opacity-75" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Accesos Rápidos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/donations/new"
          className="group block p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          <div className="flex items-center gap-3 mb-1">
            <PlusCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="font-medium text-indigo-700 dark:text-indigo-400">Registrar Donación</div>
          </div>
          <p className="text-sm text-indigo-600/80 dark:text-slate-400 pl-8">Ingreso rápido de items al inventario</p>
        </Link>
      </div>
    </div>
  );
}
