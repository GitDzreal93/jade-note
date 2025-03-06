import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle OAuth or email verification errors
  if (error || error_description) {
    const errorPath = new URL('/auth/auth-error', request.url)
    errorPath.searchParams.set('error', error_description || error || '认证失败')
    return NextResponse.redirect(errorPath)
  }

  // Handle successful authentication
  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successful authentication, redirect to the next page
      return NextResponse.redirect(new URL(next, request.url))
    }
    // Handle session exchange error
    const errorPath = new URL('/auth/auth-error', request.url)
    errorPath.searchParams.set('error', '会话验证失败，请重新登录')
    return NextResponse.redirect(errorPath)
  }

  // No code or error present, redirect to error page
  const errorPath = new URL('/auth/auth-error', request.url)
  errorPath.searchParams.set('error', '无效的认证请求')
  return NextResponse.redirect(errorPath)
}
