import { CheckIcon } from '@heroicons/react/24/solid';
import { StripeCheckoutButton } from '@/components/stripe/StripeCheckoutButton';

interface Plan {
  name: string;
  description: string;
  price: string;
  interval: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: '免费',
    description: '适合短期学习和体验的用户',
    price: '¥0',
    interval: '/永久',
    features: [
      '部分免费文档可读',
    ],
    cta: '阅读文档',
    highlighted: false,
  },
  {
    name: '终身会员',
    description: '一次付费，永久使用',
    price: '¥999',
    interval: '/永久',
    features: [
      '所有年度会员功能',
      '永久访问所有内容',
      '专属技术咨询',
      '超值优惠价格',
    ],
    cta: '立即购买',
    highlighted: true,
    badge: '最受欢迎',
  },
];

const faqs = [
  {
    question: '如何选择合适的会员方案？',
    answer:
      '建议根据您的学习计划选择：短期学习选择月度会员，长期学习选择年度会员可享受更多优惠，想要一劳永逸可选择终身会员。',
  },
  {
    question: '可以随时取消订阅吗？',
    answer:
      '是的，您可以随时取消订阅。取消后，您仍可以继续使用到当前订阅周期结束。我们不会收取任何额外费用。',
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付等主流支付方式，让您可以方便快捷地完成支付。',
  },
  {
    question: '购买后遇到问题如何联系？',
    answer:
      '您可以通过网站底部的联系方式或发送邮件至 support@jadenote.com 联系我们的客服团队，我们会在24小时内回复您的问题。',
  },
];

export default async function PricingPage({ searchParams }: { searchParams: { canceled?: string } }) {
  // 获取 URL 参数，需要 await searchParams
  const params = await Promise.resolve(searchParams);
  const canceled = params.canceled;

  return (
    <main className="flex flex-col items-center">
      {/* 显示取消支付的提示信息 */}
      {canceled && (
        <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                支付已取消。如果您有任何疑问，请随时联系我们的客服团队。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Header */}
      <div className="bg-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              简单透明的定价方案
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              选择最适合您的会员方案，随时享受优质内容
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 lg:gap-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${
                plan.highlighted
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-gray-200'
              } border rounded-lg shadow-sm divide-y divide-gray-200 flex-1 max-w-md mx-auto sm:mx-0`}
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  {plan.name}
                  {plan.badge && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {plan.badge}
                    </span>
                  )}
                </h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {plan.interval}
                  </span>
                </p>
                {plan.cta && plan.cta.trim() !== '' && (
                  <StripeCheckoutButton
                    priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''}
                    className="mt-8 block w-full bg-emerald-600 text-white rounded-md py-2 px-4 font-medium text-sm"
                  >
                    {plan.cta}
                  </StripeCheckoutButton>
                )}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  包含功能
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <CheckIcon
                        className="flex-shrink-0 h-5 w-5 text-emerald-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-50 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            常见问题
          </h2>
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
