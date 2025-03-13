import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    // 先 await cookies()
    const cookieStore = await cookies();
    const cookieValues = new Map<string, string>();

    // 然后再获取所有 cookies
    const supabaseCookies = await cookieStore.getAll();
    for (const cookie of supabaseCookies) {
      cookieValues.set(cookie.name, cookie.value);
    }
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => {
            return cookieValues.get(name);
          },
          set: (name: string, value: string, options: any) => {
            cookieValues.set(name, value);
          },
          remove: (name: string, options: any) => {
            cookieValues.delete(name);
          },
        },
      }
    );

    // 获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: '无效的价格ID' },
        { status: 400 }
      );
    }

    // 使用硬编码的 URL（开发环境）
    const appUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_APP_URL;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/profile?payment=success`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: error.message || '创建支付会话失败' },
      { status: 500 }
    );
  }
} 