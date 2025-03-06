import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';

const plans = [
  {
    name: '月度会员',
    description: '适合短期学习和体验的用户',
    price: '¥29',
    interval: '/月',
    features: [
      '所有文档完整阅读权限',
      '高清图片下载',
      '代码示例下载',
    ],
    cta: '开始订阅',
    highlighted: false,
  },
  {
    name: '年度会员',
    description: '适合长期学习，性价比最高',
    price: '¥299',
    interval: '/年',
    features: [
      '所有月度会员功能',
      '优先更新内容',
      '技术问答支持',
      '节省 15% 费用',
    ],
    cta: '开始订阅',
    highlighted: true,
    badge: '推荐',
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
    highlighted: false,
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

export default function PricingPage() {
  return (
    <main>
      {/* Pricing Header */}
      <div className="bg-white py-16">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${
                plan.highlighted
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-gray-200'
              } border rounded-lg shadow-sm divide-y divide-gray-200`}
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
                <Link
                  href="/auth/register"
                  className="mt-8 block w-full bg-emerald-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-emerald-700"
                >
                  {plan.cta}
                </Link>
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
      <div className="bg-gray-50 py-16">
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
