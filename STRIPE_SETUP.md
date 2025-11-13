# Stripe Integration Setup Guide

## Overview
StopTheCharge uses Stripe for payment processing with two types of charges:
1. **Pro Plan Subscription** - $4.99/month or $49.99/year (recurring)
2. **Cancellation Letter** - $2.99 (one-time payment)

## Setup Steps

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete your business profile
3. Activate your account to accept live payments

### 2. Get Your API Keys
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers → API keys**
3. Copy your **Secret key** (starts with `sk_`)

### 3. Create Products & Prices

#### Pro Plan Monthly ($4.99/month)
1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Name: `StopTheCharge Pro - Monthly`
4. Description: `Unlimited subscriptions, smart reminders, net worth tracker`
5. Pricing model: **Recurring**
6. Price: `$4.99` USD
7. Billing period: **Monthly**
8. Click **Save product**
9. **Copy the Price ID** (starts with `price_`) - this is: `price_1SSoY3AL9TCLgFxzKJSa5VdL`

#### Pro Plan Yearly ($49.99/year)
1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Name: `StopTheCharge Pro - Yearly`
4. Description: `Unlimited subscriptions, smart reminders, net worth tracker (save $10/year)`
5. Pricing model: **Recurring**
6. Price: `$49.99` USD
7. Billing period: **Yearly**
8. Click **Save product**
9. **Copy the Price ID** - this is: `price_1SSoYvAL9TCLgFxz2v3KAJJb`

#### Cancellation Letter ($2.99 one-time)
1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Name: `Cancellation Letter Generator`
4. Description: `Professional cancellation letter template for any subscription`
5. Pricing model: **One-time**
6. Price: `$2.99` USD
7. Click **Save product**
8. **Copy the Price ID** - you need to update this in `public/js/app.js` line 2281

### 4. Configure Vercel Environment Variables
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `stopthecharge` project
3. Go to **Settings → Environment Variables**
4. Add the following variables:

| Name | Value | Environments |
|------|-------|--------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (or `sk_live_...` for production) | Production, Preview, Development |
| `N8N_WEBHOOK_URL` | Your N8N webhook URL | Production, Preview, Development |

5. Click **Save**
6. **Important:** Redeploy your project for changes to take effect

### 5. Update Price ID for Cancellation Letter
1. Open `public/js/app.js`
2. Find line 2281: `const priceId = 'price_CANCELLATION_LETTER';`
3. Replace `price_CANCELLATION_LETTER` with your actual Stripe Price ID from step 3
4. Commit and push changes

### 6. Test Stripe Integration

#### Test Mode
1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any billing postal code

#### Test Flow
1. Go to your dashboard: `https://stopthecharge.vercel.app/dashboard.html`
2. Try adding more than 3 subscriptions (should show upgrade modal)
3. Click "Monthly Plan" or "Yearly Plan"
4. Complete test payment
5. Should redirect to `success.html` with confirmation

#### Test Cancellation Letter
1. Go to dashboard
2. Click "Generate Letter ($2.99)" button
3. Complete test payment
4. Should redirect to success page

### 7. Go Live
1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Copy your **Live Secret Key** (`sk_live_...`)
3. Update `STRIPE_SECRET_KEY` in Vercel environment variables
4. Redeploy your Vercel project
5. Verify with a real card (can immediately refund)

## Troubleshooting

### "Stripe integration is not working"
**Check:**
1. Is `STRIPE_SECRET_KEY` set in Vercel? (`vercel env ls`)
2. Are you using test mode keys for testing?
3. Check browser console for errors (`F12 → Console`)
4. Check Vercel function logs (`vercel logs`)

**Common Errors:**
- `No such price: 'price_...'` → Price ID doesn't exist or wrong environment
- `Invalid API Key` → Wrong secret key or not set in environment
- `CORS error` → Use relative path `/api/create-checkout` (already fixed)

### Payment succeeds but no redirect
- Check `success.html` exists in `public/` directory ✅ (created)
- Verify success_url in `api/create-checkout.js` ✅ (set to `/success.html`)

### Modal doesn't show
- Check browser console for JavaScript errors
- Verify `showUpgradeModal()` function exists in app.js ✅ (line 2170)
- Check if FREE_TIER_LIMIT is properly set ✅ (line 20)

## Code Architecture

### Free Tier Limit
- **Constant:** `FREE_TIER_LIMIT = 3` (line 20 in app.js)
- **Checks:** Lines 785, 801, 1954 in app.js
- **Trigger:** Shows upgrade modal when user tries to add 4th subscription

### Checkout Flow
1. User clicks "Monthly" or "Yearly" in modal
2. `checkout(plan)` function called (line 2228)
3. Fetches `/api/create-checkout` with priceId
4. Stripe returns checkout session URL
5. User redirected to Stripe Checkout
6. After payment, redirected to `/success.html`

### Cancellation Letter Flow
1. User clicks "Generate Letter" button
2. `showCancellationLetterModal()` displays modal (line 2263)
3. User clicks "Generate Letter - $2.99"
4. `checkoutCancellationLetter()` called (line 2281)
5. Same flow as subscription but with `mode: 'payment'`

## File Reference
- **Frontend:** `public/js/app.js` (checkout functions)
- **API:** `api/create-checkout.js` (Stripe session creation)
- **Success Page:** `public/success.html` (post-payment confirmation)
- **Dashboard:** `public/dashboard.html` (includes letter generator button)

## Support
If issues persist, check:
1. Stripe Dashboard → Developers → Logs
2. Vercel Project → Deployments → Functions (logs)
3. Browser Console (F12)

Email: hello@stopthecharge.com
