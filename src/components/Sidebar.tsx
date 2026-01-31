import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Gift, Package } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Donaciones', href: '/donations', icon: Gift },
    { name: 'Productos', href: '/products', icon: Package },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-500">HelpChain</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors group',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-indigo-600 dark:text-white'
                    : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm">
              <span className="uppercase">{user.email?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
