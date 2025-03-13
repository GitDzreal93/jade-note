好的，我来整理一下完整的改动方案说明：

### 1. 需要新建的文件

```plaintext
src/
└── app/
    └── api/
        └── create-checkout-session/
            └── route.ts      # 处理支付会话创建的 API 路由
└── components/
    └── stripe/
        └── StripeCheckoutButton.tsx    # 新的支付按钮组件
```

### 2. 需要修改的文件

```typescript:src/app/pricing/page.tsx
// 主要改动：
// 1. 移除原有的 StripeBuyButton 导入
// 2. 添加新的 StripeCheckoutButton 导入
// 3. 更新按钮组件的使用方式
```

### 3. 需要安装的依赖

```bash
npm install @stripe/stripe-js stripe
```

### 4. 确保环境变量存在（.env.local）

```plaintext
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 或生产环境URL
```

### 5. 代码变更详细说明

1. **新建 API 路由**
```typescript:src/app/api/create-checkout-session/route.ts
// 作用：处理支付会话创建的服务端逻辑
// 功能：
// - 验证用户登录状态
// - 创建 Stripe Checkout Session
// - 处理错误情况
```

2. **新建支付按钮组件**
```typescript:src/components/stripe/StripeCheckoutButton.tsx
// 作用：提供统一的支付按钮界面
// 功能：
// - 集成 useAuth 进行认证管理
// - 处理支付流程
// - 提供加载状态和错误提示
```

3. **修改定价页面**
```typescript:src/app/pricing/page.tsx
// 改动位置：在渲染计划卡片时的按钮部分
// 原代码：
<StripeBuyButton
  buyButtonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_ID || ''}
  publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
  className="mt-8 block w-full"
/>

// 新代码：
<StripeCheckoutButton
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''}
  className="mt-8 block w-full bg-emerald-600 text-white rounded-md py-2 px-4 font-medium text-sm"
>
  {plan.cta}
</StripeCheckoutButton>
```

### 6. 不需要修改的文件

- `src/hooks/useAuth.ts` - 继续使用现有的认证 Hook
- 其他现有的组件和页面文件

### 7. 实施步骤

1. 首先安装必要的依赖
2. 创建新的 API 路由文件
3. 创建新的 StripeCheckoutButton 组件
4. 修改定价页面中的按钮实现
5. 测试支付流程

### 8. 测试要点

1. 未登录用户点击支付按钮时的重定向
2. 已登录用户的支付流程
3. 各种错误情况的处理
4. 支付成功和取消的跳转
5. 移动端适配效果

这样的改动可以让支付流程更加可控，同时保持了良好的用户体验和安全性。
