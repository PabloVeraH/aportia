import { Link } from 'react-router-dom';
import { useCenter } from '@/context/CenterContext';
// import { useAuth } from '@/context/AuthContext'; // Unused
import { Building2, Package, CheckSquare, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { activeCenter, loading } = useCenter();
  // const { signOut } = useAuth(); // Handled in Header

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando dashboard...</div>;
  }

  // MainLayout handles the loading and "no active center" states
  if (loading || !activeCenter) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Resumen de operaciones del centro {activeCenter.name}</p>
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
