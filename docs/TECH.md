提示词：
帮我把之前的需求文档，拆分成更细致的开发文档，这份开发文档可以直接遵照上面的方案去实施开发，不需要写任何代码，只需要描述到功能点的列举、技术栈的列举就行，但是一定要细致，把用到的项目的github链接、简介和接入说明也写上去。

> 用户想要将先前的需求文档拆分为更详细的开发文档，按照现有方案实施开发，并列出功能点和技术栈等，不需要写代码。目标是生成一个Markdown格式的开发文档，其中包括功能点、技术架构、第三方依赖、集成指南、GitHub链接及其说明。
> 所以，我应该组织这份文档，包括“概述”、“功能需求”、“技术架构”、“第三方依赖”、“集成指南”、“GitHub链接”等内容。还需要列出Fumadocs、Next.js、Supabase、Stripe、Tailwind CSS等项目的GitHub链接，并提供接入说明。
> 用户希望提供一个详细的开发文档，我们需要列出每个技术的GitHub链接、描述和集成说明。文档将包括功能列表和技术栈详细说明。比如：
> 项目介绍
> 功能列表：用户模块、文档管理模块、付费订阅模块等
> 技术栈：包括Next.js、Fumadocs等；需要提供GitHub链接和集成说明。
> 我将按照这些要求，整理出结构清晰的开发文档，确保开发人员可以遵循说明进行实施。

下面是一份基于 Next.js App Router 风格优化后的详细开发文档，在文档中对项目结构做了改造，同时说明了如何集成 Fumadocs 以及可能的冲突点和解决思路。

---

# 优化后的详细开发文档

本文档将项目拆分为各个功能模块、使用的第三方技术及其接入说明，并调整项目目录结构，使其符合 Next.js App Router 风格。需要注意的是，Fumadocs 原本设计时主要基于传统 pages 目录，因此在集成时需注意以下几点：

- **Fumadocs 与 App Router 冲突**：  
  Fumadocs 部分组件或配置可能依赖于 pages 目录中的数据获取函数（如 getStaticProps）。在 App Router 下，需要使用新的数据获取机制（例如 generateStaticParams、generateMetadata 等）或者将 Fumadocs 作为独立模块引入，通过“桥接层”完成数据和布局的转换。  
- **解决方案**：  
  1. 封装 Fumadocs 组件为自定义组件，在 app 目录中引入。  
  2. 如遇到数据获取问题，采用 App Router 的服务端组件或 API 路由实现数据注入。  
  3. 保持全局布局与页面结构统一，所有页面均从 app 目录加载。

---

## 1. 项目概述

**项目目标**：开发一个基于 Markdown 的付费文档网站，提供部分预览和会员解锁功能，利用 Supabase 实现云数据库与用户认证，使用 Stripe 完成支付订阅，并通过自动化脚本将飞书文档转换为 Markdown。整个项目基于纯前端技术栈，可部署在 Vercel 或 Cloudflare Pages。

**核心需求**：
- Markdown 格式文档撰写与渲染
- 包括首页、定价页、登录注册页、文档详情页
- 会员付费后解锁完整内容
- 使用 Supabase 实现认证与数据库管理
- 集成 Stripe 实现支付与订阅
- 自动化脚本实现飞书文档到 Markdown 的转换

---

## 2. 功能模块划分与技术选型

### 2.1 用户认证与权限管理

- **功能点**：
  - 用户注册、登录、找回密码（基于 Supabase Auth）
  - 会员状态管理：区分普通用户与付费会员，控制文档内容显示

- **使用技术**：  
  - **Supabase**  
    - GitHub：[supabase-js](https://github.com/supabase/supabase-js)  
    - 接入说明：  
      1. 安装：`npm install @supabase/supabase-js`  
      2. 配置环境变量（SUPABASE_URL、SUPABASE_ANON_KEY）  
      3. 在 lib 目录下封装 Supabase 客户端，并在 app 目录中各页面调用相关 API

### 2.2 文档管理与展示

- **功能点**：
  - Markdown 渲染与展示，支持目录生成、分页、搜索
  - 文档详情页区分免费预览与会员完整内容
  - 集成 Fumadocs 框架组件（如有需要，可自定义封装以适应 App Router 数据获取）

- **使用技术**：
  - **Next.js App Router**  
    - GitHub：[Next.js](https://github.com/vercel/next.js)  
    - 接入说明：  
      1. 使用 `create-next-app` 初始化项目时采用 app 目录结构  
      2. 使用新的文件夹组织页面和布局（详见下方项目结构）
  - **Fumadocs**  
    - GitHub：[Fumadocs](https://github.com/fumadocs/fumadocs)  
    - 接入说明：  
      1. 安装：`npm install fumadocs`  
      2. 根据 App Router 结构，将 Fumadocs 提供的组件或样板代码封装到自定义模块中  
      3. 如遇数据获取问题，利用 App Router 的服务端组件能力进行适配
  - **Markdown 渲染工具**：Remark 与 Rehype  
    - GitHub：[Remark](https://github.com/remarkjs/remark) | [Rehype](https://github.com/rehypejs/rehype)  
    - 接入说明：  
      1. 安装相关依赖：`npm install remark remark-html rehype`  
      2. 在服务端或客户端组件中处理 Markdown 到 HTML 的转换

### 2.3 付费与订阅功能

- **功能点**：
  - 定价页面展示会员套餐
  - Stripe 支付集成，实现支付后更新用户会员状态

- **使用技术**：
  - **Stripe.js**  
    - GitHub：[Stripe.js](https://github.com/stripe/stripe-js)  
    - 接入说明：  
      1. 安装：`npm install @stripe/stripe-js`  
      2. 在定价及支付相关组件中集成 Stripe 按钮和支付弹窗，配置 publishable key

### 2.4 自动化文档转换脚本

- **功能点**：
  - 编写 Node.js 脚本，通过飞书 API 获取内容并转换为 Markdown
  - 批量转换并更新文档库，触发项目重构建

- **使用技术**：
  - **Turndown**  
    - GitHub：[Turndown](https://github.com/domchristie/turndown)  
    - 接入说明：  
      1. 安装：`npm install turndown`  
      2. 编写 Node.js 脚本调用飞书 API 获取 HTML，再通过 Turndown 转换成 Markdown

### 2.5 UI 与样式设计

- **使用技术**：
  - **Tailwind CSS**  
    - GitHub：[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)  
    - 接入说明：  
      1. 安装：`npm install tailwindcss`  
      2. 初始化配置：`npx tailwindcss init`  
      3. 在 app/global.css 中引入 Tailwind 样式
  - **UI 组件库**（可选）：Headless UI 或 Radix UI  
    - GitHub：[Headless UI](https://github.com/tailwindlabs/headlessui) | [Radix UI](https://github.com/radix-ui/primitives)  
    - 接入说明：按照各自官方文档在组件中调用

---

## 3. 优化后的项目目录结构（基于 Next.js App Router）

```
project-root/
├── app/                          # Next.js App Router 目录
│   ├── layout.tsx              # 全局布局（Header、Footer 等全局组件）
│   ├── globals.css             # 全局样式（引入 Tailwind CSS）
│   ├── page.tsx                # 首页入口
│   ├── auth/                   # 用户认证模块
│   │   ├── layout.tsx          # 认证模块的专用布局（可选）
│   │   ├── login/page.tsx      # 登录页面
│   │   ├── register/page.tsx   # 注册页面
│   │   └── forgot/page.tsx     # 忘记密码页面
│   ├── docs/                   # 文档模块
│   │   ├── layout.tsx          # 文档模块专用布局（集成 Fumadocs 组件）
│   │   └── [slug]/             # 动态文档详情页面
│   │       └── page.tsx        # 根据 slug 渲染 Markdown 内容（预览/完整视图）
│   └── pricing/                # 定价页面模块
│       └── page.tsx            # 定价页，展示会员套餐及 Stripe 支付入口
├── components/                 # 公共组件（Header、Footer、支付按钮、会员提示组件、Fumadocs 封装组件）
├── lib/                        # 公共库
│   ├── supabaseClient.ts       # Supabase 客户端封装
│   ├── stripeClient.ts         # Stripe 交互封装
│   └── markdownRenderer.ts     # Markdown 渲染相关配置（结合 Remark、Rehype）
├── scripts/                    # 自动化脚本（飞书转 Markdown）
│   └── feishu-to-md.js         # Node.js 脚本
├── styles/                     # Tailwind CSS 配置文件、全局样式文件（如 tailwind.config.js）
├── public/                     # 静态资源（图片、图标、文档附件等）
├── next.config.js              # Next.js 配置文件（配置环境变量、实验性功能等）
└── package.json                # 项目依赖与脚本
```

### 3.1 目录说明与重点

- **app 目录**：  
  所有页面均基于 Next.js App Router 的新机制。各模块内置独立 layout.tsx，实现局部布局定制。
- **docs 模块**：  
  为解决 Fumadocs 与 App Router 的冲突，可将 Fumadocs 组件封装在 components 目录内，然后在 app/docs/layout.tsx 中引入，确保页面数据获取和布局均采用 App Router 的方式。
- **数据获取**：  
  采用 App Router 的服务端组件方式，使用 generateStaticParams、generateMetadata 等新函数实现静态渲染或服务器端渲染，以替代 getStaticProps/getServerSideProps。
- **全局样式**：  
  通过 app/globals.css 引入 Tailwind CSS，确保全局样式一致。

---

## 4. 部署与 CI/CD 集成

- **部署平台**：Vercel 或 Cloudflare Pages  
  - 将项目代码仓库连接到 Vercel，配置环境变量（如 SUPABASE_URL、SUPABASE_ANON_KEY、STRIPE_PUBLISHABLE_KEY 等），实现自动化部署。
- **CI/CD**：  
  利用 GitHub Actions 实现自动测试、构建与部署。参考 GitHub Actions 官方文档进行配置。

---

## 5. 开发任务与里程碑

1. **项目初始化与环境配置**  
   - 初始化 Next.js（App Router）项目  
   - 配置 TypeScript、Tailwind CSS、环境变量（Supabase、Stripe 等）
2. **用户认证模块开发**  
   - 开发 app/auth 目录下的登录、注册与找回密码页面  
   - 集成 Supabase Auth API，管理用户状态及会员权限
3. **文档模块与 Fumadocs 集成**  
   - 在 app/docs 中封装 Fumadocs 组件，完成 Markdown 渲染与预览/完整视图逻辑  
   - 处理数据获取及静态参数生成，确保兼容 App Router 的新机制
4. **定价与支付功能开发**  
   - 开发 app/pricing 页面，展示套餐信息及 Stripe 支付入口  
   - 集成 Stripe.js，完成支付交互设计及会员状态更新
5. **自动化文档转换脚本开发**  
   - 编写 Node.js 脚本（scripts/feishu-to-md.js），实现飞书文档转换为 Markdown  
   - 配置定时任务或手动触发，自动更新文档库
6. **测试、部署与优化**  
   - 编写单元测试、集成测试  
   - 利用 GitHub Actions 实现 CI/CD 部署（Vercel/Cloudflare Pages）  
   - 优化 SEO、性能与安全性

---

## 6. 总结

- **核心前端框架**：Next.js App Router（[GitHub](https://github.com/vercel/next.js)），支持 SSR/SSG 和服务端组件，适应现代前端开发趋势。  
- **文档展示框架**：Fumadocs（[GitHub](https://github.com/fumadocs/fumadocs)），需通过封装解决与 App Router 的部分冲突，确保灵活扩展。  
- **用户认证与数据库**：Supabase（[GitHub](https://github.com/supabase/supabase-js)），负责认证与数据存储。  
- **支付系统**：Stripe.js（[GitHub](https://github.com/stripe/stripe-js)），实现支付订阅功能。  
- **自动化脚本**：Turndown（[GitHub](https://github.com/domchristie/turndown)），完成飞书文档 HTML 到 Markdown 的转换。  
- **UI 与样式**：Tailwind CSS（[GitHub](https://github.com/tailwindlabs/tailwindcss)）及 Headless UI/Radix UI，快速构建响应式页面。

此优化后的开发文档详细列出了各模块功能点、第三方技术选型、GitHub 链接及接入说明，同时对项目目录进行了基于 Next.js App Router 的改造，开发团队可直接按照此文档开展实施工作。