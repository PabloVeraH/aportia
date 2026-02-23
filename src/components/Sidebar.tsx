import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Gift, Package, Heart } from 'lucide-react';
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
    <aside className="w-64 bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 hidden md:flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Heart className="h-3.5 w-3.5 text-primary-700 dark:text-primary-500 fill-current" />
          </div>
          <span className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">HelpChain</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                isActive
                  ? 'bg-primary-50 text-primary-800 dark:bg-stone-800 dark:text-primary-400'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-4 w-4 flex-shrink-0',
                  isActive
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-stone-400 group-hover:text-stone-500 dark:text-stone-500 dark:group-hover:text-stone-300'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="p-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-800 dark:text-primary-400 uppercase">
                {user.email?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
