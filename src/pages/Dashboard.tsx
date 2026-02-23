import { Link } from 'react-router-dom';
import { useCenter } from '@/context/CenterContext';
import { Building2, Package, CheckSquare, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { activeCenter, loading } = useCenter();

  if (loading) {
    return <div className="p-8 text-center text-stone-400 text-sm">Cargando dashboard...</div>;
  }

  if (!activeCenter) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-500 mb-1">
          Centro operativo
        </p>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {activeCenter.name}
        </h1>
        <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">
          Vista general de operaciones del día
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card">
          <div className="flex items-start justify-between mb-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
              Donaciones hoy
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 text-primary-600 dark:text-primary-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">0</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-3">Sin registros aún hoy</p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between mb-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
              Artículos recibidos
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
              <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">0</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-3">Inventario al día</p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between mb-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
              Pendientes de revisión
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">0</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-3">Sin revisiones pendientes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">
        Accesos rápidos
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/donations/new"
          className="group card hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
              <PlusCircle className="h-5 w-5 text-primary-600 dark:text-primary-500" />
            </div>
            <span className="text-stone-200 dark:text-stone-700 group-hover:text-primary-400 dark:group-hover:text-primary-600 transition-colors text-base font-light">→</span>
          </div>
          <p className="font-semibold text-stone-900 dark:text-stone-100 mb-1">Registrar donación</p>
          <p className="text-sm text-stone-400 dark:text-stone-500">Ingreso rápido de artículos al inventario</p>
        </Link>
      </div>
    </div>
  );
}
