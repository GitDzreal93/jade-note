'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <UserCircleIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
            {user.email}
          </div>
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            账户设置
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}