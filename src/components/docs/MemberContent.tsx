'use client';

import { useEffect, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface MemberContentProps {
  children: React.ReactNode;
}

export function MemberContent({ children }: MemberContentProps) {
  // TODO: 替换为实际的会员状态检查逻辑
  const [isMember, setIsMember] = useState(false);

  if (!isMember) {
    return (
      <div className="my-8 p-6 bg-emerald-50 rounded-lg border border-emerald-100">
        <div className="flex items-center space-x-3 text-emerald-700 mb-4">
          <LockClosedIcon className="h-6 w-6" />
          <h3 className="text-lg font-medium">会员专享内容</h3>
        </div>
        <p className="text-emerald-600 mb-4">
          此部分内容需要会员权限才能查看。成为会员，即可解锁全部高级内容！
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          升级会员
        </Link>
      </div>
    );
  }

  return <div className="member-content">{children}</div>;
}