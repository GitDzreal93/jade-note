'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SubscriptionDetails() {
  const { subscription, isLoading, error } = useSubscription();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">出错了</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">您目前没有活跃的订阅</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          订阅我们的服务，解锁所有高级功能，提升您的笔记体验。
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          查看订阅方案
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">订阅详情</h3>
      </div>

      <div className="px-6 py-5">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">状态</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {subscription.status === 'active' ? '已激活' : 
                 subscription.status === 'trialing' ? '试用中' : 
                 subscription.status === 'canceled' ? '已取消' : 
                 subscription.status}
              </span>
              {subscription.cancel_at_period_end && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  将在期末取消
                </span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">当前周期结束时间</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(subscription.current_period_end)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-6 py-5 bg-gray-50 dark:bg-gray-700/50">
        <Link
          href="/profile/subscription"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          管理订阅
        </Link>
      </div>
    </div>
  );
}
