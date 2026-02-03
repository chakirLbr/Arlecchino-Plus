# CLAUDE.md - AI Assistant Guidelines for Arlecchino-Plus

This document provides essential context for AI assistants working on the Arlecchino-Plus codebase.

## Project Overview

**Arlecchino Plus** is a full-featured restaurant website for a pizzeria in Haan, Germany. The application provides online ordering, table reservations, order tracking, and a restaurant admin dashboard.

### Business Information
- **Name**: Arlecchino Plus (Pizzeria)
- **Location**: Kölner Str. 1, 42781 Haan, Germany
- **Phone**: 02129 6663
- **Instagram**: @pizzeria_arlecchino_plus
- **Chef**: Tonino Pisano (award-winning pizzaiolo)

### Key Features
- Online ordering (delivery + pickup)
- Real-time order tracking
- Table reservations
- Payment processing (Stripe, PayPal)
- Admin dashboard for restaurant management
- Multi-language support (DE/EN)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui patterns
- **State Management**: Zustand (cart)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Jose (JWT)
- **Payments**: Stripe, PayPal

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database**: Supabase / Neon / PlanetScale
- **Email**: Resend
- **Rate Limiting**: Upstash Redis

## Repository Structure

```
Arlecchino-Plus/
├── docs/
│   └── ARCHITECTURE.md     # Detailed architecture documentation
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── images/             # Static images
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── bestellung/     # Order tracking
│   │   ├── kontakt/        # Contact page
│   │   ├── reservierung/   # Reservations
│   │   ├── speisekarte/    # Menu & ordering
│   │   ├── ueber-uns/      # About page
│   │   ├── impressum/      # Legal - Imprint
│   │   ├── datenschutz/    # Legal - Privacy
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   └── ui/             # Reusable UI components
│   ├── lib/
│   │   ├── db.ts           # Prisma client
│   │   ├── utils.ts        # Utility functions
│   │   └── validations.ts  # Zod schemas
│   ├── store/
│   │   └── cart.ts         # Cart state (Zustand)
│   └── i18n/
│       └── config.ts       # Translations
├── .env.example            # Environment variables template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── CLAUDE.md               # This file
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Type check
npm run type-check

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database

# Testing
npm test
```

## Environment Variables

Copy `.env.example` to `.env.local` for development. Required variables:

```
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET            # Secret for auth tokens
STRIPE_SECRET_KEY     # Stripe API key
STRIPE_WEBHOOK_SECRET # Stripe webhook secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY        # Email service
UPSTASH_REDIS_REST_URL    # Rate limiting
UPSTASH_REDIS_REST_TOKEN
```

## Key Pages & Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/speisekarte` | Menu & ordering |
| `/speisekarte/checkout` | Checkout flow |
| `/bestellung/[orderId]` | Order tracking |
| `/reservierung` | Table reservations |
| `/ueber-uns` | About & awards |
| `/kontakt` | Contact information |
| `/impressum` | Legal imprint |
| `/datenschutz` | Privacy policy |

### Admin Routes (Protected)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview |
| `/admin/bestellungen` | Orders management |
| `/admin/speisekarte` | Menu management |
| `/admin/reservierungen` | Reservations calendar |
| `/admin/statistiken` | Analytics |
| `/admin/einstellungen` | Settings |

## Database Models

Key entities (see `prisma/schema.prisma` for full schema):

- **Category** - Menu categories (Pizza, Pasta, etc.)
- **MenuItem** - Individual menu items with pricing
- **MenuItemSize** - Size variants (Klein, Normal, Groß)
- **AddOn** - Extra toppings/additions
- **Order** - Customer orders
- **OrderItem** - Items within an order
- **Reservation** - Table reservations
- **AdminUser** - Restaurant staff accounts
- **DeliveryZone** - Delivery areas with fees

## Coding Conventions

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Prefer `type` for object shapes, `interface` for extendable contracts
- Use Zod for runtime validation

### React/Next.js
- Use Server Components by default
- Add `'use client'` only when needed (interactivity)
- Keep components small and focused
- Use Next.js Image component for images

### Styling
- Use Tailwind CSS utility classes
- Follow the design system colors (brand-red, brand-olive, brand-cream)
- Mobile-first responsive design
- Use `cn()` utility for conditional classes

### State Management
- Server state: fetch in Server Components
- Client state: Zustand for cart
- Form state: React Hook Form

### Security
- Validate all inputs with Zod (frontend + backend)
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on API routes
- Never expose sensitive data in responses
- Use HTTPS and secure cookies

## German Microcopy Reference

### Buttons & CTAs
- Order: "Jetzt bestellen"
- Reserve: "Tisch reservieren"
- Add to cart: "In den Warenkorb"
- Checkout: "Zur Kasse"
- Pay: "Jetzt bezahlen"
- Submit: "Absenden"
- Remove: "Entfernen"

### Form Labels
- First name: "Vorname"
- Last name: "Nachname"
- Email: "E-Mail"
- Phone: "Telefon"
- Address: "Adresse"
- Street: "Straße & Hausnummer"
- Postal code: "PLZ"
- City: "Stadt"
- Date: "Datum"
- Time: "Uhrzeit"
- Guests: "Anzahl Personen"
- Notes: "Anmerkungen"

### Order Status
- Pending: "Ausstehend"
- Confirmed: "Bestätigt"
- Preparing: "Wird zubereitet"
- In oven: "Im Ofen"
- Ready: "Fertig"
- Out for delivery: "Unterwegs"
- Delivered: "Geliefert"

## API Design Guidelines

### Request Validation
All API endpoints should validate inputs using Zod schemas from `src/lib/validations.ts`.

### Response Format
```typescript
// Success
{ data: T }

// Error
{ error: { message: string, code?: string } }
```

### Rate Limiting
- Login: 5 attempts / 15 minutes
- Order creation: 10 / hour / IP
- Contact form: 3 / hour / IP
- General API: 100 / minute / IP

## Testing Strategy

### Unit Tests
- Utility functions
- Validation schemas
- Price calculations

### Integration Tests
- API endpoints
- Database operations

### E2E Tests (Phase 2)
- Ordering flow
- Checkout process
- Admin workflows

## Phase 2 Features (Planned)
- Live driver tracking (GPS map)
- Customer accounts & order history
- Loyalty points program
- Push notifications
- Advanced analytics
- Table management system
- Printer integration

## AI Assistant Guidelines

### Before Making Changes
1. Read existing code before proposing modifications
2. Check the ARCHITECTURE.md for detailed design decisions
3. Follow existing patterns in the codebase
4. Validate against the Zod schemas

### Code Quality
- Write clean, typed TypeScript code
- Keep functions focused (single responsibility)
- Add JSDoc comments for exported functions
- Avoid over-engineering

### Security Checklist
- [ ] Input validation with Zod
- [ ] Parameterized database queries
- [ ] Rate limiting on new endpoints
- [ ] No hardcoded secrets
- [ ] CSRF protection where needed
- [ ] Audit logging for admin actions

### Common Tasks

**Adding a new page:**
1. Create file in `src/app/[route]/page.tsx`
2. Add to navigation in `header.tsx` if needed
3. Update metadata in the page file

**Adding a new API endpoint:**
1. Create file in `src/app/api/[route]/route.ts`
2. Add Zod validation schema
3. Implement rate limiting
4. Add to API documentation

**Adding a new component:**
1. Create in `src/components/ui/` for reusable components
2. Follow shadcn/ui patterns
3. Export from component file

---

*Last updated: February 2025*
