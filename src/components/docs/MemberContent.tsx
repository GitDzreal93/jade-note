'use client';

import { useState } from 'react';
import { LockClosedIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface MemberContentProps {
  children: React.ReactNode;
  previewContent?: React.ReactNode;
}

export function MemberContent({ children, previewContent }: MemberContentProps) {
  const [isMember, setIsMember] = useState(false);
  if (!isMember) {
    return (
      <div className="relative">
        {previewContent && <div>{previewContent}</div>}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        
        {/* Member Unlock Prompt */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
          <div className="bg-white p-8 text-center rounded-lg shadow-lg max-w-md mx-auto">
            <LockClosedIcon className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              成为会员，解锁完整内容
            </h3>
            <p className="text-gray-600 mb-4">
              订阅会员后可查看本文完整内容，包括详细的代码示例和最佳实践建议。
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              立即解锁
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div className="member-content">{children}</div>;
}