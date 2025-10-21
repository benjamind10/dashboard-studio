'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LoggingControl } from '@/components/ui/LoggingControl';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { systemLogger } from '@/lib/logger';
import { useEffect } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Sample Dashboard', href: '/sample', icon: '🧪' },
  { name: 'Broker Config', href: '/config/broker', icon: '🔌' },
  { name: 'User Config', href: '/config/user', icon: '👤' },
  { name: 'Widget Library', href: '/widgets', icon: '🧩' },
  { name: 'Templates', href: '/templates', icon: '📋' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    systemLogger.info('Navigation to page', { pathname });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* Compact Navigation Header */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side: Logo, Navigation, and Breadcrumb */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
              >
                DS
              </Link>

              {/* Compact Navigation */}
              <div className="hidden lg:flex space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.icon && (
                        <span className="text-sm">{item.icon}</span>
                      )}
                      <span className="hidden xl:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Breadcrumb for current page */}
              <div className="hidden md:flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>/</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">
                  {navigation.find((item) => item.href === pathname)?.name ||
                    pathname
                      .split('/')
                      .pop()
                      ?.replace('-', ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                    'Page'}
                </span>
              </div>
            </div>

            {/* Right side: Compact status and controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300 hidden sm:inline">
                  MQTT
                </span>
              </div>

              <ThemeToggle />

              {/* Mobile menu button */}
              <button className="lg:hidden p-1 rounded text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="relative">{children}</main>

      {/* Global Components */}
      <LoggingControl />
    </div>
  );
}
