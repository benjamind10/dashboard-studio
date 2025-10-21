'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LoggingControl } from '@/components/ui/LoggingControl';
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
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 hover:text-blue-600"
              >
                Dashboard Studio
              </Link>

              {/* Main Navigation */}
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">MQTT Connected</span>
              </div>

              {/* Mobile menu button - you can expand this later */}
              <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-8 py-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              {pathname !== '/' && (
                <>
                  <span>/</span>
                  <li className="text-gray-900 font-medium">
                    {navigation.find((item) => item.href === pathname)?.name ||
                      pathname
                        .split('/')
                        .pop()
                        ?.replace('-', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                      'Page'}
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="relative">{children}</main>

      {/* Global Components */}
      <LoggingControl />
    </div>
  );
}
