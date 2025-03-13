'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutButtonProps {
  priceId: string;
  className?: string;
  children: React.ReactNode;
}

export function StripeCheckoutButton({ priceId, className, children }: StripeCheckoutButtonProps) {
  const { user, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }

    try {
      setLoading(true);
      clearError?.();

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '创建支付会话失败');
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = `
    ${className}
    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'}
    transition-all duration-200
  `.trim();

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? '处理中...' : children}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error.message}
        </div>
      )}
    </>
  );
} 