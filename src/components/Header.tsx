import { useCenter } from '@/context/CenterContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { activeCenter, centers, switchCenter } = useCenter();
  const { signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here */}

        {centers.length > 0 && (
          <div className="relative">
            {centers.length > 1 ? (
              <div className="flex items-center bg-slate-50 dark:bg-slate-700 rounded-md p-1 border border-slate-200 dark:border-slate-600">
                <select
                  value={activeCenter?.id || ''}
                  onChange={(e) => switchCenter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pl-2 pr-1"
                >
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                {activeCenter?.name}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
