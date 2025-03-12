'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import UserMenu from '../auth/UserMenu';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(
      'bg-white sticky top-0 z-50 transition-shadow duration-200',
      scrolled ? 'shadow-md' : 'shadow-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <BookOpenIcon className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900 ml-2">Jade Note</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={clsx(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/' 
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                首页
              </Link>
              <Link 
                href="/docs" 
                className={clsx(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname.startsWith('/docs')
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                文档
              </Link>
              <Link 
                href="/pricing" 
                className={clsx(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/pricing'
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                定价
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  登录
                </Link>
                <Link href="/auth/register" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
