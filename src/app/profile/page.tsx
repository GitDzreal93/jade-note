'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

export default function ProfilePage() {
  const { user, loading: authLoading, error: authError, getSession } = useAuth();
  const { subscription } = useSubscription();  // 只用来判断是否已付费
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login?redirect=/profile');
        return;
      }
    };

    checkAuth();

    if (searchParams.get('payment') === 'success') {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [getSession, router, searchParams]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {authError.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* 支付成功提示 */}
      {showSuccessMessage && (
        <div className="mb-8">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">支付成功！</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>感谢您的购买！您现在可以访问所有会员内容了。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 个人资料 */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900">个人资料</h2>
          <div className="mt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">邮箱</dt>
                <dd className="text-gray-900">{user.email}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">用户ID</dt>
                <dd className="text-gray-900">{user.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* 会员状态 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900">会员状态</h2>
          {subscription ? (
            <div className="mt-6">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  终身会员
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                您已经是我们的终身会员，可以永久访问所有内容。感谢您的支持！
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  免费用户
                </span>
              </div>
              <p className="text-gray-500 mt-4 mb-4">
                成为终身会员，即可解锁所有高级功能，享受完整的学习体验。
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                查看会员方案
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 