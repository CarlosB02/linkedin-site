# SaaS Architecture Playbook: Next.js + Supabase + Stripe

This document serves as a comprehensive blueprint to replicate the core business logic of a credits-based AI SaaS application. The goal is to allow you to build new projects rapidly by reusing this architecture, changing only the frontend design/branding and the specific AI/service logic.

---

## 🏗️ 1. Core Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (Native SDK)
- **Database**: Supabase PostgreSQL (via Supabase SDK, **NO PRISMA**)
- **Payments**: Stripe Checkout & Webhooks
- **Internationalization**: `next-intl`
- **Background Jobs / AI**: Replicate (or equivalent, replacing API calls as needed)

---

## 🛠️ 2. Database Schema (Supabase SQL)

In your new Supabase project, go to the **SQL Editor** and run the following script. This creates the foundational tables for users, transactions, and generations.

```sql
-- 1. Users Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public."user" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" BOOLEAN,
    image TEXT,
    credits INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transactions Table (Stripe Ledgers)
CREATE TABLE IF NOT EXISTS public."Transaction" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES public."user"(id),
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    credits INTEGER NOT NULL,
    "stripeSessionId" TEXT UNIQUE,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 3. Generations Table (Or whatever service your app provides)
CREATE TABLE IF NOT EXISTS public."Generation" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES public."user"(id),
    prompt TEXT NOT NULL,
    style TEXT NOT NULL,
    "originalImage" TEXT,
    "blurredImage" TEXT,
    cost INTEGER DEFAULT 3,
    unlocked BOOLEAN DEFAULT false,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row Level Security temporarily for rapid prototyping
ALTER TABLE public."user" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Generation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Transaction" DISABLE ROW LEVEL SECURITY;
```

---

## 🔑 3. Environment Variables (`.env`)

For local development, create an `.env` file at the root of the project with the following keys. **Important: When deploying to Vercel, copy these exact variables to the Vercel Dashboard.**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here # Critical for webhooks

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Stripe Products (Set up in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_ID_TIER1=prod_xyz
NEXT_PUBLIC_STRIPE_PRICE_ID_TIER2=prod_abc

# AI/Service APIs (Example)
REPLICATE_API_TOKEN=your_token_here
```

---

## 🔐 4. Authentication Logic

Do not use third-party libraries like `better-auth`. Rely completely on the Supabase SDK for Next.js app router.

### Setup Supabase Clients
1. **`lib/supabase/server.ts`**: Uses `@supabase/ssr` to securely get the user from cookies (for `page.tsx` and Server Actions).
2. **`lib/supabase/client.ts`**: Uses `@supabase/ssr` for browser components (e.g., standard login forms).
3. **`lib/supabase/admin.ts`**: Uses `@supabase/supabase-js` initializing with `SUPABASE_SERVICE_ROLE_KEY`. **Use this ONLY IN WEBHOOKS** to bypass database security rules when an event happens offline.

### Login Flow
- Use `supabase.auth.signInWithOAuth({ provider: 'google' })` for frontend buttons.
- For magic links: `supabase.auth.signInWithOtp()`.

### Syncing Auth with Users Table
Whenever a user logs in, check if they exist in your `public.user` table. Since they authenticate via Supabase Auth, they will have a UUID.
```typescript
// Example from a Server Action
const { data: { user: authUser } } = await supabase.auth.getUser();

// Check if user exists in custom table
let { data: user } = await supabase.from('user').select('*').eq('id', authUser.id).single();

// If not, auto-create them and grant 0 credits
if (!user) {
    user = await supabase.from('user').insert({
        id: authUser.id,
        email: authUser.email!,
        credits: 0
    }).select().single();
}
```

---

## 💳 5. Payment & Credits Architecture (Stripe)

### Step 1: Initiating Payment (`app/actions.ts`)
When a user clicks "Buy Package", call a server action that:
1. Validates the user.
2. Creates a `Transaction` in Supabase with status `PENDING`.
3. Calls `stripe.checkout.sessions.create()`.
4. **Crucial**: Inject metadata into the session so the webhook knows what to do later.
```typescript
const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: stripePriceId, quantity: 1 }],
    metadata: {
        userId: authUser.id,
        credits: "800", // Hardcoded per package tier
    },
    success_url: `${baseUrl}?payment=success`,
    cancel_url: `${baseUrl}?payment=cancelled`,
});

// Update transaction with session ID
await supabase.from('Transaction').update({ stripeSessionId: checkoutSession.id }).eq('id', transaction.id);
```

### Step 2: The Webhook Receiver (`app/api/webhooks/stripe/route.ts`)
A serverless route that listens for `checkout.session.completed`.
It verifies the Stripe signature (`STRIPE_WEBHOOK_SECRET`) and extracts the `metadata`.

### Step 3: Fulfilling the Payment
In the webhook, call an admin function that uses the `admin` Supabase client (because webhooks don't have user cookies):
```typescript
const supabaseAdmin = createAdminClient();

// Find pending transaction
const { data: existingTx } = await supabaseAdmin.from('Transaction').select('*').eq('stripeSessionId', sessionId).single();

// Idempotency check (prevent double credits)
if (existingTx.status === "COMPLETED") return;

// Add credits to wallet
await supabaseAdmin.from('Transaction').update({ status: "COMPLETED" }).eq('id', existingTx.id);
await supabaseAdmin.from('user').update({ credits: user.credits + addedCredits }).eq('id', userId);
```

---

## 🌍 6. Translating / Internationalization (`next-intl`)

To replicate the language setup:
1. Keep the `i18n/routing.ts` defining locales (`en`, `pt`, `es`, `fr`, etc.).
2. Put all logic inside `app/[locale]/...`
3. Avoid hardcoded `<a href="...">` or `<Link>` from `next/link`. Always import the custom `Link` from `@/i18n/routing` so it automatically injects `/pt/` or `/en/` into URLs.
4. **JSON Strings**: Use a script like `patch_translations.js` if you want to automatically patch missing JSON keys across languages using a main generic file (e.g. `messages/en.json`).

---

## 🚀 7. Deployment Checklist (Vercel)

Before deploying a cloned version to Vercel, ensure you:
1. ✅ **Remove all Prisma files/commands**: Ensure `package.json` build step only says `"build": "next build"`.
2. ✅ **Supabase Connect**: Verify `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are exact copies in the Vercel Dashboard.
3. ✅ **Stripe Keys**: Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are for live mode (`sk_live_...`).
4. ✅ **Webhook Secret**: Register a new Webhook endpoint in the Stripe Dashboard pointing to `https://new-domain.com/api/webhooks/stripe`. Paste that specific live `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## 🛠️ Modifying for the Next Project
When starting project #2, **you only need to:**
1. Clone this structure.
2. Change the AI service (replace Replicate with OpenAI, Anthropic, ElevenLabs, etc.).
3. Alter `Generation` table to reflect whatever the app generates (e.g., `Video`, `Audio`, `Document`).
4. Apply new CSS classes / branding colors in `tailwind.config.ts`.
5. Create new Stripe products and paste their IDs in `.env`.
