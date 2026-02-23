import { useCenter } from '@/context/CenterContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';

export default function Header() {
  const { activeCenter, centers, switchCenter } = useCenter();
  const { signOut } = useAuth();

  return (
    <header className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 h-14 flex items-center justify-between px-5 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {centers.length > 0 && (
          <div className="relative">
            {centers.length > 1 ? (
              <div className="relative flex items-center">
                <select
                  value={activeCenter?.id || ''}
                  onChange={(e) => switchCenter(e.target.value)}
                  className="appearance-none bg-white dark:bg-stone-800 text-sm font-medium text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors cursor-pointer"
                >
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
              </div>
            ) : (
              <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                {activeCenter?.name}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-danger dark:text-stone-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
