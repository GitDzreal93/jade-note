# Stripe Integration Setup Guide

## Required Environment Variables

Add the following environment variables to your `.env.local` file:

```
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_BUTTON_ID=buy_btn_your_button_id
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Stripe Setup Steps

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create a Stripe Buy Button in the Stripe Dashboard:
   - Go to Products > Buy Button
   - Create a new Buy Button for your subscription
   - Copy the Button ID to use in your environment variables
4. Set up Stripe Webhooks:
   - Go to Developers > Webhooks in the Stripe Dashboard
   - Add an endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `customer.subscription.trial_will_end`
   - Get the webhook signing secret and add it to your environment variables

## Database Setup

Ensure your Supabase database has the following tables:

1. `subscriptions` table with the following fields:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `stripe_customer_id` (text)
   - `stripe_subscription_id` (text)
   - `status` (text)
   - `price_id` (text)
   - `cancel_at_period_end` (boolean)
   - `current_period_end` (timestamp)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. `user_trials` table with the following fields:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `trial_start_time` (timestamp)
   - `trial_end_time` (timestamp)
   - `is_trial_used` (boolean)
