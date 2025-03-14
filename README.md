# Jade Note

A modern, subscription-based documentation platform that transforms Markdown content into premium reading experiences. Built with Next.js 14 and designed for seamless deployment on Vercel or Cloudflare.

## Description

Jade Note is a sophisticated documentation platform that offers both free and premium content through a subscription model. It's designed to provide an exceptional reading experience while maintaining simplicity in content management through Markdown.

### Key Features

- 📚 Premium Documentation Platform
  - Free preview for basic content
  - Full access for subscribed members
  - Automatic table of contents generation
  - Advanced search functionality

- 🎯 User Experience
  - Clean and intuitive interface
  - Responsive design for all devices
  - Dark/Light mode support
  - Fast page loading with SSR/SSG

- 🔐 Authentication & Payments
  - Secure user authentication via Supabase
  - Flexible subscription plans (monthly/yearly)
  - Seamless payment integration with Stripe
  - Automatic content unlocking for members

- 🔄 Content Management
  - Markdown-based content
  - Automatic conversion from Feishu documents
  - Easy content updates and management
  - Version control support

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Documentation**: Fumadocs for enhanced Markdown support
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Payment Processing**: Stripe
- **Content Processing**: Remark & Rehype
- **Deployment**: Vercel/Cloudflare Pages

### Target Audience

- Content creators and publishers
- Educational institutions
- Documentation maintainers
- Knowledge-sharing platforms
- Professional training providers

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GitDzreal93/jade-note)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project into Vercel
3. Vercel will detect Next.js automatically and configure the build settings
4. Your app will be deployed and available at a Vercel URL

### Deploy on Cloudflare Pages

You can also deploy your Next.js app on Cloudflare Pages:

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GitDzreal93/jade-note)

1. Push your code to a Git repository
2. Log in to the Cloudflare dashboard
3. Navigate to Pages > Create a project
4. Connect your Git repository
5. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Environment variables:
     - `NODE_VERSION`: `16` (or your preferred version)
6. Deploy your site

For more detailed deployment instructions:
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
