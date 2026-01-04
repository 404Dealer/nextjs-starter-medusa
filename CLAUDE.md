# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Medusa Next.js Storefront** - a modern e-commerce frontend built with Next.js 15 that connects to a Medusa v2 backend. It uses server-first architecture with React Server Components, server actions, and cookie-based session management.

**Tech Stack:**
- Next.js 15.3.8 (App Router)
- React 19.0.3
- TypeScript 5.3.2
- Tailwind CSS 3.0
- Medusa JS SDK (latest)
- Stripe for payments

## Development Commands

```bash
# Start development server (port 8000 with Turbopack)
yarn dev

# Build for production
yarn build

# Start production server (port 8000)
yarn start

# Run linting
yarn lint

# Analyze bundle size
ANALYZE=true yarn build
```

**Note:** Use `yarn` (not npm) as specified in the README. Development server runs on **port 8000** by default.

## Prerequisites

Requires a **Medusa backend server running on port 9000** (default). Set up with:

```bash
npx create-medusa-app@latest
```

## Environment Variables

Required environment variables are defined in `.env.local`:

```bash
# REQUIRED
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...  # Get from Medusa Admin

# Server URL (defaults to http://localhost:9000)
MEDUSA_BACKEND_URL=http://localhost:9000

# Storefront URL (defaults to https://localhost:8000)
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# Default region ISO-2 code (defaults to "us")
NEXT_PUBLIC_DEFAULT_REGION=us

# Payment providers (optional)
NEXT_PUBLIC_STRIPE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=

# Next.js revalidation secret (optional)
REVALIDATE_SECRET=supersecret

# Medusa Cloud S3 (optional)
MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=
```

See `.env.example` for full documentation.

## Architecture

### Server-First Design

This codebase is **heavily server-side focused** with minimal client-side JavaScript:

- **Data fetching**: All done server-side via server actions (no React Query, SWR, etc.)
- **State management**: No Redux/Zustand - uses HTTP-only cookies + server actions
- **Forms**: Use native FormData with server actions, no form libraries
- **Session**: JWT stored in HTTP-only cookies, cart ID in cookies
- **Caching**: Next.js cache with tag-based revalidation

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [countryCode]/           # Multi-region routing (us, ca, gb, etc.)
│   │   ├── (main)/              # Route group for storefront pages
│   │   └── (checkout)/          # Route group for checkout flow
│   └── layout.tsx               # Root layout
│
├── lib/                          # Core utilities and data layer
│   ├── config.ts                # Medusa SDK initialization (critical!)
│   ├── constants.tsx            # Payment providers, currencies
│   ├── context/                 # React contexts (modals)
│   ├── data/                    # Server actions for API calls
│   ├── hooks/                   # Client hooks
│   └── util/                    # Helper functions
│
└── modules/                      # Feature modules (component groups)
    ├── account/                 # User profile, auth, orders
    ├── cart/                    # Shopping cart
    ├── checkout/                # Multi-step checkout
    ├── products/                # Product display
    ├── collections/             # Product collections
    ├── categories/              # Category pages
    ├── layout/                  # Nav, footer
    ├── common/                  # Shared components
    └── skeletons/               # Loading states
```

### Module Pattern

Each feature module follows this structure:

```
modules/feature/
├── components/          # Reusable sub-components (often "use client")
│   └── ComponentName/
│       └── index.tsx
├── templates/           # Page-level layouts (often server components)
│   └── TemplateName/
│       └── index.tsx
└── actions.ts          # Server actions (optional)
```

### Data Layer (`src/lib/data/`)

**All files are server-side only** (marked `"use server"`).

Key data modules:

- **`cookies.ts`**: Auth token, cart ID, cache tag management
- **`cart.ts`**: Cart operations (retrieve, create, update, add items)
- **`customer.ts`**: Authentication (login, signup, logout, profile)
- **`products.ts`**: Product listing with filtering/sorting
- **`orders.ts`**: Order retrieval and transfer
- **`regions.ts`**: Multi-region support
- **`payment.ts`**: Payment method listing
- **`fulfillment.ts`**: Shipping method selection

**Pattern for all data fetching:**

```typescript
"use server"

export async function retrieveCart(cartId?: string) {
  // 1. Get auth headers from cookies
  const headers = { ...(await getAuthHeaders()) }

  // 2. Get cache options with tags
  const next = { ...(await getCacheOptions("carts")) }

  // 3. Call Medusa SDK
  return await sdk.client.fetch(
    `/store/carts/${id}`,
    { method: "GET", headers, next, cache: "force-cache" }
  )
}
```

### Medusa SDK Integration

The SDK is initialized once in `lib/config.ts` with a **custom fetch interceptor** that injects locale headers:

```typescript
const originalFetch = sdk.client.fetch.bind(sdk.client)
sdk.client.fetch = async (input, init) => {
  const localeHeader = await getLocaleHeader()
  // Inject x-medusa-locale header into all requests
  return originalFetch(input, { ...init, headers: newHeaders })
}
```

**Import the SDK from `lib/config.ts`, never directly from `@medusajs/js-sdk`.**

### Multi-Region Routing

Every page route includes `[countryCode]` dynamic parameter (e.g., `/us/products`, `/ca/cart`).

- Region determined by country code (ISO-2: `us`, `ca`, `gb`, etc.)
- Middleware (`src/middleware.ts`) handles region detection and redirects
- All links use `LocalizedClientLink` wrapper to preserve region
- Region data cached in memory with 1-hour TTL

### Authentication Flow

1. User logs in via `login()` server action
2. SDK returns JWT token
3. Token stored in **HTTP-only cookie** (`_medusa_jwt`)
4. All API requests include `Authorization: Bearer` header
5. On logout: token removed, cart cleared, cache invalidated

**Key functions:**
- `getAuthHeaders()` - retrieves JWT from cookies
- `setAuthToken()` - stores JWT in cookie (7-day expiry)
- `login()`, `signup()`, `signout()` - authentication actions
- `transferCart()` - moves guest cart to authenticated user

### Cart Management

- Cart ID stored in cookie (`_medusa_cart_id`)
- Guest carts exist before authentication
- On login: `transferCart()` merges items into user's cart
- Cart region validated on every request

### Payment Integration

**Stripe is the primary provider** using `@stripe/react-stripe-js`:

1. Checkout page renders `PaymentWrapper`
2. `PaymentWrapper` detects Stripe payment session
3. If Stripe: wraps children in `StripeWrapper` (client component)
4. `StripeWrapper` creates Elements provider with client secret
5. Payment component handles card input and submission

**Provider detection:**
```typescript
const isStripeLike = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_") ||
         providerId?.startsWith("pp_medusa-")
}
```

Multiple providers supported: Stripe, PayPal, iDeal, Bancontact, Manual (see `lib/constants.tsx`).

### Caching Strategy

**All GET requests use `cache: "force-cache"`** with tag-based revalidation:

- Cache tags: `{resource}-{cacheId}` (e.g., `carts-abc123`)
- Cache ID stored in cookie (`_medusa_cache_id`)
- On mutations: `revalidateTag()` invalidates relevant cache
- Cache ID changes per user + cart session

Example:
```typescript
// Create cache tag
const next = { tags: [`carts-${cacheId}`] }

// Later, after cart update:
revalidateTag(`carts-${cacheId}`)
```

### TypeScript Path Aliases

Configured in `tsconfig.json`:

```typescript
// Use these imports:
import { ... } from "@lib/data/cart"
import { ... } from "@modules/cart/components/..."
import { ... } from "@pages/..."

// Instead of:
import { ... } from "../../lib/data/cart"
```

## Key Patterns

### Server vs. Client Components

**Default to Server Components** unless you need:
- Event handlers (`onClick`, `onChange`, etc.)
- React hooks (`useState`, `useEffect`, etc.)
- Browser APIs
- Stripe Elements

Mark client components with `"use client"` directive.

### Form Handling with Server Actions

```typescript
// Server action (src/lib/data/customer.ts)
export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  // Process and return state
}

// Client component
"use client"
import { useActionState } from "react"

const [message, formAction] = useActionState(login, null)

<form action={formAction}>
  <input name="email" />
  <input name="password" />
  <SubmitButton>Sign in</SubmitButton>
</form>
```

### Suspense for Progressive Rendering

Wrap async components in `<Suspense>` with skeleton fallbacks:

```typescript
<Suspense fallback={<SkeletonProductGrid />}>
  <ProductList countryCode={countryCode} />
</Suspense>
```

### Error Handling

- Server actions return error states via `useActionState`
- Errors formatted with `medusaError()` utility
- Display errors using `ErrorMessage` component
- Never throw in forms - return error objects instead

### Static Pre-rendering

Use `generateStaticParams()` to pre-render dynamic routes:

```typescript
export async function generateStaticParams() {
  const { products } = await listProducts(...)
  const countryCodes = await listRegions().then(...)

  return countryCodes.flatMap(countryCode =>
    products.map(product => ({
      countryCode,
      handle: product.handle,
    }))
  )
}
```

Wrap in try-catch to allow build to continue on API errors (returns `[]` for on-demand generation).

### URL Search Params for UI State

- Checkout step: `?step=payment`
- Product variant: `?v_id={variantId}`
- Allows browser back/forward navigation
- Read with `searchParams` prop in server components

## Important Notes

### When Adding Features

1. **Data fetching**: Create server actions in `src/lib/data/`, never fetch client-side
2. **Authentication**: Always use `getAuthHeaders()` for authenticated requests
3. **Caching**: Use `getCacheOptions()` and `revalidateTag()` after mutations
4. **Multi-region**: Pass `countryCode` to all region-aware functions
5. **Locale**: Use `getLocaleHeader()` or SDK will inject automatically
6. **Links**: Use `LocalizedClientLink`, never `<a>` or plain `<Link>`
7. **Forms**: Use server actions with FormData, not client-side state

### Common Gotchas

- **SDK import**: Always from `@lib/config`, never direct from package
- **Cookie security**: `secure: true` only in production (`NODE_ENV === 'production'`)
- **Cart region**: Validate/update cart region when switching regions
- **Stripe Elements**: Must be client component wrapped in provider
- **TypeScript errors**: Ignored during build (configured in `next.config.js`)
- **ESLint errors**: Also ignored during build

### Testing Locally

Ensure Medusa backend is running on port 9000 before starting the storefront. If backend is not available, the app will build but display runtime errors when accessing pages that fetch data.

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Stripe Payment Integration](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe)
