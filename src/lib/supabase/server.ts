import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies() // await cookies() 先获取 cookieStore

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: any) {
          try {
            await cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 这里可以添加错误处理逻辑
          }
        },
        async remove(name: string, options: any) {
          try {
            await cookieStore.delete({ name, ...options })
          } catch (error) {
            // 这里可以添加错误处理逻辑
          }
        },
      },
    }
  )
}
