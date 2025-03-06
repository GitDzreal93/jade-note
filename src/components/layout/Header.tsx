import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import UserMenu from '../auth/UserMenu';

export default async function Header() {
  const cookieStore = cookies()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <BookOpenIcon className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900 ml-2">Jade Note</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-emerald-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                首页
              </Link>
              <Link href="/docs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                文档
              </Link>
              <Link href="/pricing" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
