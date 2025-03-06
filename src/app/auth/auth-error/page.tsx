import Link from 'next/link'

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            认证错误
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {searchParams.error || '抱歉，在处理您的认证请求时出现了问题。'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              请尝试重新登录或注册。如果问题持续存在，请<Link href="/contact" className="text-emerald-600 hover:text-emerald-500">联系我们的支持团队</Link>。
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                返回登录
              </Link>
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
