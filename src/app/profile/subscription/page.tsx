'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { subscription, isLoading, error, syncWithStripe, fetchSubscription } = useSubscription();
  const { user } = useAuth();
  const router = useRouter();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!user) {
    router.push('/login?redirect=/profile/subscription');
    return null;
  }

  const handleCancelSubscription = async () => {
    if (actionInProgress || !subscription?.stripe_subscription_id) return;

    if (!confirm('确定要取消订阅吗？您将继续享有服务直到当前订阅周期结束。')) {
      return;
    }

    try {
      setActionInProgress(true);
      setActionError(null);
      setActionSuccess(null);

      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '取消订阅失败');
      }

      await fetchSubscription();
      setActionSuccess('订阅已成功取消，您将继续享有服务直到当前订阅周期结束。');
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setActionError(err instanceof Error ? err.message : '取消订阅失败，请稍后再试');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (actionInProgress || !subscription?.stripe_subscription_id) return;

    try {
      setActionInProgress(true);
      setActionError(null);
      setActionSuccess(null);

      const response = await fetch('/api/stripe/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '重新激活订阅失败');
      }

      await fetchSubscription();
      setActionSuccess('订阅已成功重新激活！');
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setActionError(err instanceof Error ? err.message : '重新激活订阅失败，请稍后再试');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleSyncSubscription = async () => {
    if (actionInProgress || !subscription?.stripe_subscription_id) return;

    try {
      setActionInProgress(true);
      setActionError(null);
      setActionSuccess(null);

      syncWithStripe(subscription.stripe_subscription_id);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for sync to complete
      await fetchSubscription();
      
      setActionSuccess('订阅信息已同步！');
    } catch (err) {
      console.error('Error syncing subscription:', err);
      setActionError(err instanceof Error ? err.message : '同步订阅信息失败，请稍后再试');
    } finally {
      setActionInProgress(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">订阅管理</h1>

      {isLoading ? (
        <div className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">出错了</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => fetchSubscription()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            重试
          </button>
        </div>
      ) : subscription ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Subscription header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">订阅详情</h3>
          </div>

          {/* Action messages */}
          {actionError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 m-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{actionError}</p>
                </div>
              </div>
            </div>
          )}

          {actionSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 m-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">{actionSuccess}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription details */}
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

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">创建时间</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(subscription.created_at)}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">最后更新时间</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(subscription.updated_at)}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订阅 ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                  {subscription.stripe_subscription_id}
                </dd>
              </div>
            </dl>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-5 bg-gray-50 dark:bg-gray-700/50 flex flex-wrap gap-4">
            {!subscription.cancel_at_period_end && (
              <button
                onClick={handleCancelSubscription}
                disabled={actionInProgress}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {actionInProgress ? '处理中...' : '取消订阅'}
              </button>
            )}

            {subscription.cancel_at_period_end && (
              <button
                onClick={handleReactivateSubscription}
                disabled={actionInProgress}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {actionInProgress ? '处理中...' : '恢复订阅'}
              </button>
            )}

            <button
              onClick={handleSyncSubscription}
              disabled={actionInProgress}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {actionInProgress ? '同步中...' : '同步订阅状态'}
            </button>

            <a
              href="https://billing.stripe.com/p/login/test_28o5nN6Tn7Oi2oo144"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              管理支付方式
            </a>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
