# LinkedIn Site

A Next.js application for generating professional LinkedIn headshots with AI.

## Stripe Payment Integration

This application uses Stripe Checkout for processing credit purchases. The integration includes webhook handling to ensure credits are added only after successful payment confirmation.

## Stripe Dashboard Setup

### 1. Create a Stripe Account

If you don't have a Stripe account, sign up at [https://stripe.com](https://stripe.com).

### 2. Get Your API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_...`)
5. Copy your **Publishable key** (starts with `pk_test_...`)

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: The `STRIPE_WEBHOOK_SECRET` will be different for local development (from Stripe CLI) and production (from Stripe Dashboard).

## Local Development Setup

### 1. Install Stripe CLI

The Stripe CLI allows you to forward webhook events to your local development server.

**macOS (using Homebrew):**

```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**

```bash
# Download the binary
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Windows:**
Download from [Stripe CLI releases](https://github.com/stripe/stripe-cli/releases)

### 2. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate the CLI with your Stripe account.

### 3. Forward Webhooks to Local Server

In a separate terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This command will:

- Forward all webhook events from Stripe to your local endpoint
- Display a webhook signing secret (starts with `whsec_...`)
- Show all webhook events in real-time

**Important**: Copy the webhook signing secret and add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### 4. Start Your Development Server

```bash
npm run dev
# or
bun dev
```

## Testing the Payment Flow

### Test Cards

Stripe provides test cards for different scenarios. Use these in test mode:

**Successful Payment:**

- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**

- Card: `4000 0000 0000 0002`

**Requires Authentication (3D Secure):**

- Card: `4000 0027 6000 3184`

### Testing Steps

1. **Start your development server** and Stripe webhook forwarding
2. **Navigate to the pricing page** on your local site
3. **Click "Choose [Package Name]"** on any package
4. **You should be redirected** to Stripe Checkout
5. **Enter test card details**: `4242 4242 4242 4242`
6. **Complete the payment**
7. **Check your terminal** - you should see webhook events being received
8. **Verify credits were added**:
   - Check the user's credit balance in the UI
   - Query the database to see the transaction record
   - Transaction should have status `COMPLETED`

### Verifying Transaction Records

You can check transactions in your database:

```sql
SELECT * FROM Transaction ORDER BY createdAt DESC;
```

Expected behavior:

- Transaction is created with status `PENDING` when checkout session is created
- Transaction status changes to `COMPLETED` after webhook is processed
- User credits are incremented after webhook processing

### Testing Abandoned Checkouts

To test abandoned checkout tracking:

1. Click "Choose [Package Name]" to start checkout
2. **Don't complete the payment** - close the Stripe Checkout window
3. Check the database - you should see a transaction with status `PENDING`
4. This allows you to track users who started checkout but didn't complete

### Testing Webhook Events Manually

You can trigger webhook events manually using Stripe CLI:

```bash
# Trigger a checkout.session.completed event
stripe trigger checkout.session.completed
```

This is useful for testing webhook handling without going through the full payment flow.

## Production Deployment

### 1. Switch to Production Mode

1. In Stripe Dashboard, toggle to **Live Mode**
2. Get your **live API keys** (starts with `sk_live_...` and `pk_live_...`)
3. Update your production environment variables

### 2. Configure Production Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your production webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add it to your production environment variables as `STRIPE_WEBHOOK_SECRET`

### 3. Update Environment Variables

Set these in your production environment (Vercel, Railway, etc.):

```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Test Production Webhook

1. Make a small test purchase with a real card (or use Stripe's test mode in production)
2. Verify the webhook is received (check your logs)
3. Verify credits are added correctly
4. Check transaction records

## Package Pricing

The application supports three credit packages:

- **Entrepreneur**: 2€ → 200 credits
- **Friends**: 6€ → 800 credits (750 + 50 bonus)
- **Networking**: 15€ → 1700 credits (1600 + 100 bonus)

**Note**: Package pricing and credit amounts are defined in the `buyCredits` server action (`app/actions.ts`). When a checkout session is created, the credits amount is stored in the session metadata. The webhook handler reads the credits from this metadata, ensuring a single source of truth and eliminating duplication. To modify package pricing or credits, update the `buyCredits` function.

## Troubleshooting

### Webhook Not Received

1. **Check webhook forwarding is running**: Make sure `stripe listen` is running in local development
2. **Verify webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe CLI or Dashboard
3. **Check endpoint URL**: Verify the webhook endpoint URL is correct
4. **Check logs**: Look for webhook signature verification errors in your server logs

### Credits Not Added After Payment

1. **Check webhook logs**: Verify the webhook was received and processed
2. **Check transaction status**: Query the database to see if transaction status is `COMPLETED`
3. **Check for errors**: Look for errors in server logs during webhook processing
4. **Verify metadata**: Check that checkout session metadata contains `credits` field (can be viewed in Stripe Dashboard)
5. **Verify idempotency**: If webhook was processed twice, credits should only be added once

### Checkout Session Creation Fails

1. **Verify API key**: Ensure `STRIPE_SECRET_KEY` is set correctly
2. **Check API key permissions**: Ensure the key has permission to create checkout sessions
3. **Verify environment variables**: Check that `NEXT_PUBLIC_APP_URL` is set correctly

## Security Considerations

1. **Never commit API keys**: Keep all Stripe keys in environment variables
2. **Webhook verification**: Always verify webhook signatures to prevent unauthorized requests
3. **Idempotency**: The system checks for duplicate transactions to prevent double credit additions
4. **Transaction tracking**: All transactions are recorded for audit purposes

## Architecture

The payment flow works as follows:

1. User clicks "Buy" → `buyCredits` server action is called
2. Package pricing and credits are determined (defined in `buyCredits`)
3. Transaction record created with status `PENDING`
4. Stripe Checkout Session created with metadata containing:
   - `userId`: User ID for credit allocation
   - `packageId`: Package identifier
   - `credits`: Number of credits to add (stored as string in metadata)
5. User redirected to Stripe Checkout
6. User completes payment
7. Stripe sends webhook to `/api/webhooks/stripe`
8. Webhook verifies signature and extracts data from session metadata
9. Webhook forwards to `addCreditsFromPayment` server action
10. Transaction status updated to `COMPLETED` and credits added to user account

This architecture ensures:

- Credits are only added after confirmed payment
- Abandoned checkouts can be tracked (PENDING transactions)
- Webhook processing is idempotent (safe to retry)
- All business logic stays in server actions
- Single source of truth: Package pricing defined only in `buyCredits`, credits read from checkout session metadata
