# Arlecchino Plus - Architecture & Design Document

## A) Site Map & Wireframe-Level Section Plan

### Site Structure

```
arlecchino-plus.de/
├── / (Home)
├── /speisekarte (Menu & Ordering)
├── /bestellung/:orderId (Order Tracking)
├── /reservierung (Reservations)
├── /ueber-uns (About / Chef & Awards)
├── /kontakt (Contact)
├── /impressum (Legal - Impressum)
├── /datenschutz (Privacy Policy)
├── /agb (Terms & Conditions)
│
├── /admin/ (Protected Admin Area)
│   ├── /admin/dashboard
│   ├── /admin/bestellungen (Orders)
│   ├── /admin/speisekarte (Menu Management)
│   ├── /admin/reservierungen (Reservations)
│   ├── /admin/einstellungen (Settings)
│   └── /admin/analytics
│
└── /api/ (API Routes)
    ├── /api/menu
    ├── /api/orders
    ├── /api/reservations
    ├── /api/tracking
    ├── /api/admin/*
    └── /api/webhooks/*
```

---

## Page-by-Page Section Plan

### 1. HOME (/)

```
┌─────────────────────────────────────────────────────────────┐
│ [HEADER]                                                    │
│ Logo | Nav: Speisekarte | Reservieren | Über uns | Kontakt  │
│ [DE/EN Toggle] [Cart Icon with count]                       │
├─────────────────────────────────────────────────────────────┤
│ [HERO SECTION - Full width, 70vh]                           │
│ Background: High-quality pizza/oven image                   │
│                                                             │
│ "Holzofenpizza in Haan"                                    │
│ "Frisch. Schnell. Ausgezeichnet."                          │
│                                                             │
│ [🍕 Jetzt bestellen]  [📅 Tisch reservieren]               │
│                                                             │
│ ✓ Online bezahlen  ✓ Abholung & Lieferung  ✓ Live-Status  │
├─────────────────────────────────────────────────────────────┤
│ [AWARDS STRIP - Horizontal scroll on mobile]                │
│ 🏆 2. Platz Deutsche Meisterschaft | 🥇 1. Platz InterNorga │
│ [Mehr erfahren →]                                           │
├─────────────────────────────────────────────────────────────┤
│ [SIGNATURE PIZZAS CAROUSEL]                                 │
│ "Unsere Klassiker"                                          │
│ [Pizza Card] [Pizza Card] [Pizza Card] →                    │
│ [Zur Speisekarte →]                                         │
├─────────────────────────────────────────────────────────────┤
│ [HOW IT WORKS - 3 columns]                                  │
│ 1. Auswählen    2. Bezahlen     3. Genießen                │
│ 📱 Online       💳 Sicher       🚗 Geliefert               │
├─────────────────────────────────────────────────────────────┤
│ [REVIEWS TEASER]                                            │
│ ⭐⭐⭐⭐⭐ "Beste Pizza in Haan!" - Google Reviews          │
│ [Placeholder for Google/TripAdvisor integration]            │
├─────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                    │
│ Quick Links | Öffnungszeiten | Adresse | Social | Legal    │
└─────────────────────────────────────────────────────────────┘
```

### 2. MENU / ORDER (/speisekarte)

```
┌─────────────────────────────────────────────────────────────┐
│ [STICKY HEADER with Cart]                                   │
├─────────────────────────────────────────────────────────────┤
│ [DELIVERY/PICKUP TOGGLE]                                    │
│ [🚗 Lieferung] [🏃 Abholung]                               │
│ Lieferadresse: [PLZ eingeben...] oder Abholung um [Zeit]   │
├─────────────────────────────────────────────────────────────┤
│ [CATEGORY TABS - Sticky on scroll]                          │
│ Pizza | Pasta | Salate | Vorspeisen | Aufläufe | Getränke  │
├───────────────────────────────────┬─────────────────────────┤
│ [MENU ITEMS]                      │ [CART DRAWER]           │
│                                   │ (Slide-in on desktop,   │
│ ┌─────────────────────────────┐   │  bottom sheet mobile)   │
│ │ [IMG] Margherita       8,50€│   │                         │
│ │ Tomaten, Mozzarella, Basilik│   │ Warenkorb (3)           │
│ │ 🌶️ [+]                     │   │ ─────────────────       │
│ └─────────────────────────────┘   │ 1x Margherita    8,50€  │
│                                   │ 2x Cola          5,00€  │
│ ┌─────────────────────────────┐   │ ─────────────────       │
│ │ [IMG] Diavola        10,50€│   │ Zwischensumme   13,50€  │
│ │ Scharfe Salami, Peperoni   │   │ Lieferung        2,50€  │
│ │ 🌶️🌶️ [+]                   │   │ ─────────────────       │
│ └─────────────────────────────┘   │ Gesamt          16,00€  │
│                                   │                         │
│ [Load more / Infinite scroll]     │ [Zur Kasse →]           │
└───────────────────────────────────┴─────────────────────────┘

[PRODUCT MODAL - On item click]
┌─────────────────────────────────────────────────────────────┐
│ [X Close]                                                   │
│ [Large Product Image]                                       │
│                                                             │
│ Pizza Margherita                                    8,50 €  │
│ Tomatensoße, Mozzarella, frisches Basilikum                │
│                                                             │
│ Allergene: 🥛 Milch, 🌾 Gluten                             │
│                                                             │
│ [SIZE SELECTION]                                            │
│ ○ Klein (26cm) +0€  ● Normal (32cm) +0€  ○ Groß (40cm) +4€ │
│                                                             │
│ [EXTRAS / ADD-ONS]                                          │
│ □ Extra Käse +1,50€                                         │
│ □ Schinken +2,00€                                           │
│ □ Pilze +1,50€                                              │
│                                                             │
│ [NOTES]                                                     │
│ [Sonderwünsche eingeben... z.B. "ohne Zwiebeln"]           │
│                                                             │
│ [- 1 +]                           [In den Warenkorb 8,50€] │
└─────────────────────────────────────────────────────────────┘
```

### 3. CHECKOUT (/speisekarte?checkout=true)

```
┌─────────────────────────────────────────────────────────────┐
│ [CHECKOUT STEPS INDICATOR]                                  │
│ ● Warenkorb → ○ Lieferung → ○ Bezahlung → ○ Bestätigung   │
├─────────────────────────────────────────────────────────────┤
│ STEP 1: CART REVIEW                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Edit] 1x Margherita (32cm)                      8,50€  │ │
│ │        + Extra Käse                              1,50€  │ │
│ │        "ohne Zwiebeln"                           [🗑️]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Gutscheincode eingeben]                        [Prüfen]│ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Zwischensumme                                   10,00€  │ │
│ │ Liefergebühr                                     2,50€  │ │
│ │ Trinkgeld (optional)  [0€] [1€] [2€] [Andere]          │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ GESAMT                                          12,50€  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Weiter zur Lieferung →]                                    │
├─────────────────────────────────────────────────────────────┤
│ STEP 2: DELIVERY DETAILS                                    │
│ [🚗 Lieferung] [🏃 Abholung]                               │
│                                                             │
│ Vorname*        [____________]                              │
│ Nachname*       [____________]                              │
│ Straße & Nr.*   [____________]                              │
│ PLZ*            [____________]                              │
│ Stadt*          [Haan________]                              │
│ Telefon*        [____________]                              │
│ E-Mail*         [____________]                              │
│                                                             │
│ Lieferzeit:                                                 │
│ ● So schnell wie möglich (~30-45 Min)                      │
│ ○ Vorbestellen für: [Datum] [Uhrzeit]                      │
│                                                             │
│ Anmerkungen zur Lieferung:                                  │
│ [z.B. "2. Stock, Klingel defekt"________________]          │
│                                                             │
│ [← Zurück]                      [Weiter zur Bezahlung →]   │
├─────────────────────────────────────────────────────────────┤
│ STEP 3: PAYMENT                                             │
│                                                             │
│ Zahlungsart wählen:                                         │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ 💳 Karte   │ │ PayPal     │ │ Apple Pay  │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
│ [Stripe Card Element]                                       │
│ Kartennummer  [________________________]                    │
│ Ablauf        [____]  CVC [___]                            │
│                                                             │
│ □ Ich akzeptiere die AGB und Datenschutzerklärung          │
│                                                             │
│ [← Zurück]                    [Jetzt bezahlen 12,50€ →]    │
├─────────────────────────────────────────────────────────────┤
│ STEP 4: CONFIRMATION                                        │
│                                                             │
│ ✅ Vielen Dank für Ihre Bestellung!                        │
│                                                             │
│ Bestellnummer: #AP-2025-001234                              │
│ Voraussichtliche Lieferzeit: 18:30 - 18:45 Uhr             │
│                                                             │
│ Eine Bestätigung wurde an max@example.de gesendet.         │
│                                                             │
│ [📍 Bestellung verfolgen]        [🏠 Zur Startseite]       │
└─────────────────────────────────────────────────────────────┘
```

### 4. ORDER TRACKING (/bestellung/:orderId)

```
┌─────────────────────────────────────────────────────────────┐
│ [HEADER - Simplified]                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Bestellung #AP-2025-001234                                  │
│ Voraussichtliche Lieferung: 18:30 - 18:45 Uhr              │
│                                                             │
│ [TIMELINE - Vertical on mobile]                             │
│                                                             │
│ ✅ Bestellung eingegangen         17:45                     │
│ │                                                           │
│ ✅ Bestellung bestätigt           17:47                     │
│ │                                                           │
│ 🔄 Wird zubereitet               17:50                     │
│ │  "Ihre Pizza wird gerade frisch belegt"                  │
│ │                                                           │
│ ○ Im Ofen                                                   │
│ │                                                           │
│ ○ Bereit zur Abholung / Unterwegs                          │
│ │                                                           │
│ ○ Geliefert                                                 │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Bestelldetails:                                             │
│ 1x Pizza Margherita (32cm)                          10,00€  │
│ Liefergebühr                                         2,50€  │
│ Gesamt                                              12,50€  │
│                                                             │
│ Lieferadresse:                                              │
│ Max Mustermann                                              │
│ Musterstraße 1                                              │
│ 42781 Haan                                                  │
│                                                             │
│ [📞 Restaurant anrufen]                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. RESERVATIONS (/reservierung)

```
┌─────────────────────────────────────────────────────────────┐
│ [HEADER]                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tisch reservieren                                           │
│ "Genießen Sie unsere preisgekrönte Pizza vor Ort"          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Datum*            [📅 Datum wählen____________]         │ │
│ │                                                         │ │
│ │ Uhrzeit*          [🕐 18:00 ▼]                         │ │
│ │                   Verfügbare Zeiten werden angezeigt    │ │
│ │                                                         │ │
│ │ Anzahl Personen*  [- 2 +]                              │ │
│ │                                                         │ │
│ │ ─────────────────────────────────────────────────────  │ │
│ │                                                         │ │
│ │ Vorname*          [____________]                        │ │
│ │ Nachname*         [____________]                        │ │
│ │ Telefon*          [____________]                        │ │
│ │ E-Mail*           [____________]                        │ │
│ │                                                         │ │
│ │ Besondere Wünsche (optional)                           │ │
│ │ [z.B. Hochstuhl, Allergien, Anlass_________]           │ │
│ │                                                         │ │
│ │ □ Ich möchte vorab bestellen (optional)                │ │
│ │                                                         │ │
│ │ □ Ich akzeptiere die Reservierungsbedingungen          │ │
│ │   (Stornierung bis 2h vorher möglich)                  │ │
│ │                                                         │ │
│ │ [Tisch reservieren →]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [INFO BOX]                                                  │
│ 📍 Kölner Str. 1, 42781 Haan                               │
│ 📞 02129 6663                                              │
│ Für größere Gruppen (ab 10 Personen) rufen Sie uns an.    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6. ABOUT / CHEF & AWARDS (/ueber-uns)

```
┌─────────────────────────────────────────────────────────────┐
│ [HEADER]                                                    │
├─────────────────────────────────────────────────────────────┤
│ [HERO IMAGE - Kitchen/Oven]                                 │
│                                                             │
│ "Tradition trifft Leidenschaft"                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [OUR STORY SECTION]                                         │
│                                                             │
│ [Image: Restaurant]    Seit [Jahr] servieren wir in Haan   │
│                        authentische italienische Küche.     │
│                        Unser Teig reift 48 Stunden, unsere │
│                        Zutaten kommen direkt aus Italien.  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [CHEF SECTION]                                              │
│                                                             │
│ Unser Pizzaiolo: Tonino Pisano                             │
│                                                             │
│ [Photo placeholder]    Tonino Pisano ist mehrfach          │
│                        ausgezeichneter Pizzabäcker und     │
│                        bringt über [X] Jahre Erfahrung     │
│                        in jeden Teig.                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [AWARDS SECTION]                                            │
│                                                             │
│ "Ausgezeichnete Qualität"                                  │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ [Trophy]    │ │ [Medal]     │ │ [Cert]      │            │
│ │ 🥇          │ │ 🥈          │ │ 🏅          │            │
│ │ 1. Platz    │ │ 2. Platz    │ │ Teilnahme   │            │
│ │ InterNorga  │ │ Deutsche    │ │ European    │            │
│ │ Hamburg     │ │ Meistersch. │ │ Pizza       │            │
│ │ 2025        │ │ 2023        │ │ Excellence  │            │
│ │             │ │             │ │ 2025        │            │
│ │ Pizza       │ │ Pizza       │ │ Pizza       │            │
│ │ Classica    │ │ Classica    │ │ Classica    │            │
│ │ Gourmet     │ │ Gourmet     │ │ Gourmet     │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [PRESS SECTION]                                             │
│                                                             │
│ "In den Medien"                                             │
│                                                             │
│ "Hier gibt es die zweitbeste Pizza Deutschlands..."        │
│ — [Presseartikel Placeholder]                               │
│                                                             │
│ [Pressemappe herunterladen] (Logo, Fotos)                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [CTA SECTION]                                               │
│                                                             │
│ "Überzeugen Sie sich selbst"                               │
│ [Jetzt bestellen]  [Tisch reservieren]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7. CONTACT (/kontakt)

```
┌─────────────────────────────────────────────────────────────┐
│ [HEADER]                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Kontakt                                                     │
│                                                             │
│ ┌──────────────────────┬────────────────────────────────┐  │
│ │                      │                                │  │
│ │ 📍 Adresse          │ [GOOGLE MAPS EMBED]            │  │
│ │ Kölner Str. 1       │                                │  │
│ │ 42781 Haan          │                                │  │
│ │                      │                                │  │
│ │ 📞 Telefon          │                                │  │
│ │ 02129 6663          │                                │  │
│ │ [Jetzt anrufen]     │                                │  │
│ │                      │                                │  │
│ │ 📱 WhatsApp         │                                │  │
│ │ [Chat starten]      │                                │  │
│ │                      │                                │  │
│ │ 📧 E-Mail           │                                │  │
│ │ info@arlecchino.de  │                                │  │
│ │                      │                                │  │
│ │ 📷 Instagram        │                                │  │
│ │ @pizzeria_arlecch.. │                                │  │
│ │                      │                                │  │
│ └──────────────────────┴────────────────────────────────┘  │
│                                                             │
│ [OPENING HOURS TABLE]                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Öffnungszeiten                                         │ │
│ │ ─────────────────────────────────────────────────────  │ │
│ │ Montag        17:00 - 22:00                            │ │
│ │ Dienstag      11:00 - 14:30, 17:00 - 22:00            │ │
│ │ Mittwoch      11:00 - 14:30, 17:00 - 22:00            │ │
│ │ Donnerstag    11:00 - 14:30, 17:00 - 22:00            │ │
│ │ Freitag       11:00 - 14:30, 17:00 - 22:00            │ │
│ │ Samstag       12:00 - 22:00                            │ │
│ │ Sonntag       12:00 - 22:00                            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [CONTACT FORM]                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Schreiben Sie uns                                      │ │
│ │                                                         │ │
│ │ Name*         [____________]                            │ │
│ │ E-Mail*       [____________]                            │ │
│ │ Betreff       [____________]                            │ │
│ │ Nachricht*    [________________________]                │ │
│ │               [________________________]                │ │
│ │                                                         │ │
│ │ □ Ich akzeptiere die Datenschutzerklärung             │ │
│ │                                                         │ │
│ │ [Nachricht senden]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 🚗 Parkplätze: [TODO: Parking info]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## B) UI Component List

### Global Components
- `Header` - Logo, navigation, language toggle, cart icon
- `Footer` - Links, hours, address, social, legal
- `MobileNav` - Hamburger menu drawer
- `CartDrawer` - Slide-in cart panel
- `LanguageToggle` - DE/EN switch
- `CookieBanner` - GDPR-compliant consent
- `LoadingSpinner` - Loading states
- `Toast` - Notifications

### Home Page Components
- `HeroSection` - Full-width hero with CTAs
- `AwardsStrip` - Horizontal award badges
- `PizzaCarousel` - Featured items slider
- `HowItWorks` - 3-step process
- `ReviewsTeaser` - Customer reviews

### Menu & Ordering Components
- `DeliveryToggle` - Delivery/Pickup selector
- `CategoryTabs` - Sticky category navigation
- `MenuItemCard` - Product card
- `ProductModal` - Detailed item view with options
- `SizeSelector` - Size options
- `AddOnCheckbox` - Extra toppings
- `QuantitySelector` - +/- quantity
- `Cart` - Cart summary
- `CartItem` - Individual cart item
- `CheckoutSteps` - Step indicator
- `AddressForm` - Delivery address
- `TimeSlotPicker` - Delivery/pickup time
- `PaymentForm` - Stripe integration
- `CouponInput` - Discount code
- `TipSelector` - Optional tip
- `OrderSummary` - Final totals

### Order Tracking Components
- `TrackingTimeline` - Status steps
- `StatusBadge` - Current status indicator
- `ETADisplay` - Estimated time
- `OrderDetails` - Order breakdown
- `TrackingLookup` - Order search form

### Reservation Components
- `ReservationForm` - Full booking form
- `DatePicker` - Calendar
- `TimePicker` - Available slots
- `GuestCounter` - Number selector
- `ReservationConfirmation` - Success state

### Admin Components
- `AdminSidebar` - Navigation
- `AdminHeader` - User menu, notifications
- `OrdersTable` - Orders list
- `OrderCard` - Individual order (kitchen view)
- `StatusUpdater` - Change order status
- `MenuEditor` - CRUD for menu items
- `ImageUploader` - Photo upload
- `ReservationsCalendar` - Calendar view
- `AnalyticsCards` - Key metrics
- `AnalyticsCharts` - Graphs

---

## C) Data Model / Entities

```prisma
// Prisma Schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ MENU ============

model Category {
  id          String     @id @default(cuid())
  name        String     // German name
  nameEn      String?    // English name
  slug        String     @unique
  description String?
  descriptionEn String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  items       MenuItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model MenuItem {
  id            String      @id @default(cuid())
  categoryId    String
  category      Category    @relation(fields: [categoryId], references: [id])
  name          String
  nameEn        String?
  description   String?
  descriptionEn String?
  basePrice     Decimal     @db.Decimal(10, 2)
  image         String?
  allergens     String[]    // Array of allergen codes
  spiceLevel    Int         @default(0) // 0-3
  isVegetarian  Boolean     @default(false)
  isVegan       Boolean     @default(false)
  isAvailable   Boolean     @default(true)
  sortOrder     Int         @default(0)
  sizes         MenuItemSize[]
  addOns        AddOn[]     @relation("MenuItemAddOns")
  orderItems    OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([categoryId])
  @@index([isAvailable])
}

model MenuItemSize {
  id         String   @id @default(cuid())
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  name       String   // e.g., "Klein (26cm)", "Normal (32cm)", "Groß (40cm)"
  nameEn     String?
  priceAdjustment Decimal @db.Decimal(10, 2) @default(0)
  sortOrder  Int      @default(0)

  @@index([menuItemId])
}

model AddOn {
  id          String     @id @default(cuid())
  name        String
  nameEn      String?
  price       Decimal    @db.Decimal(10, 2)
  isAvailable Boolean    @default(true)
  menuItems   MenuItem[] @relation("MenuItemAddOns")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

// ============ ORDERS ============

enum OrderStatus {
  PENDING          // Just placed, awaiting confirmation
  CONFIRMED        // Restaurant confirmed
  PREPARING        // Being prepared
  IN_OVEN          // In the oven (for pizza)
  READY            // Ready for pickup/delivery
  OUT_FOR_DELIVERY // Driver on the way
  DELIVERED        // Completed
  CANCELLED        // Cancelled
}

enum OrderType {
  DELIVERY
  PICKUP
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CARD
  PAYPAL
  APPLE_PAY
  GOOGLE_PAY
  CASH // For pickup only if enabled
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique // Human-readable: AP-2025-001234

  // Customer info (guest checkout)
  customerEmail   String
  customerPhone   String
  customerFirstName String
  customerLastName  String

  // Delivery info
  orderType       OrderType
  deliveryAddress String?
  deliveryCity    String?
  deliveryPostalCode String?
  deliveryInstructions String?

  // Timing
  isScheduled     Boolean       @default(false)
  scheduledFor    DateTime?
  estimatedReady  DateTime?

  // Pricing
  subtotal        Decimal       @db.Decimal(10, 2)
  deliveryFee     Decimal       @db.Decimal(10, 2) @default(0)
  tip             Decimal       @db.Decimal(10, 2) @default(0)
  discount        Decimal       @db.Decimal(10, 2) @default(0)
  total           Decimal       @db.Decimal(10, 2)

  // Coupon
  couponCode      String?
  couponId        String?
  coupon          Coupon?       @relation(fields: [couponId], references: [id])

  // Payment
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod?
  stripePaymentId String?
  paypalOrderId   String?

  // Status
  status          OrderStatus   @default(PENDING)
  statusHistory   OrderStatusHistory[]

  // Notes
  orderNotes      String?

  // Items
  items           OrderItem[]

  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([orderNumber])
  @@index([customerEmail])
  @@index([customerPhone])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItemId  String
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id])

  name        String   // Snapshot of item name at time of order
  quantity    Int
  size        String?  // Selected size
  unitPrice   Decimal  @db.Decimal(10, 2)
  addOns      Json?    // Array of {name, price}
  notes       String?  // Item-specific notes
  totalPrice  Decimal  @db.Decimal(10, 2)

  @@index([orderId])
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())
  createdBy String?     // Admin user ID if changed by admin

  @@index([orderId])
}

// ============ COUPONS ============

model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique
  description     String?
  discountType    String    // "percentage" or "fixed"
  discountValue   Decimal   @db.Decimal(10, 2)
  minimumOrder    Decimal?  @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int       @default(0)
  validFrom       DateTime  @default(now())
  validUntil      DateTime?
  isActive        Boolean   @default(true)
  orders          Order[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([code])
}

// ============ RESERVATIONS ============

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  NO_SHOW
  COMPLETED
}

model Reservation {
  id              String            @id @default(cuid())
  reservationNumber String          @unique // AR-2025-001234

  // Guest info
  guestFirstName  String
  guestLastName   String
  guestEmail      String
  guestPhone      String

  // Booking details
  date            DateTime          @db.Date
  time            String            // "18:00"
  partySize       Int

  // Status
  status          ReservationStatus @default(PENDING)

  // Notes
  specialRequests String?
  internalNotes   String?

  // Pre-order (optional, Phase 2)
  preOrderId      String?

  // Timestamps
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  confirmedAt     DateTime?
  cancelledAt     DateTime?

  @@index([date])
  @@index([status])
  @@index([guestEmail])
}

// ============ ADMIN ============

enum AdminRole {
  OWNER
  MANAGER
  STAFF
}

model AdminUser {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          AdminRole @default(STAFF)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  auditLogs     AuditLog[]

  @@index([email])
}

model AuditLog {
  id          String    @id @default(cuid())
  adminUserId String?
  adminUser   AdminUser? @relation(fields: [adminUserId], references: [id])
  action      String    // e.g., "order.status.updated", "menu.item.created"
  entityType  String    // e.g., "Order", "MenuItem"
  entityId    String
  oldValue    Json?
  newValue    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime  @default(now())

  @@index([adminUserId])
  @@index([entityType, entityId])
  @@index([createdAt])
}

// ============ SETTINGS ============

model Settings {
  id              String   @id @default(cuid())
  key             String   @unique
  value           Json
  updatedAt       DateTime @updatedAt
}

// ============ DELIVERY ZONES ============

model DeliveryZone {
  id           String  @id @default(cuid())
  postalCode   String  @unique
  deliveryFee  Decimal @db.Decimal(10, 2)
  minimumOrder Decimal @db.Decimal(10, 2)
  estimatedMinutes Int @default(45)
  isActive     Boolean @default(true)

  @@index([postalCode])
}
```

---

## D) API Endpoints

### Public API

#### Menu
```
GET /api/menu
  → Returns all categories with items
  Response: { categories: Category[] }

GET /api/menu/:categorySlug
  → Returns single category with items
  Response: { category: Category }

GET /api/menu/item/:id
  → Returns single menu item with sizes and add-ons
  Response: { item: MenuItem }
```

#### Orders
```
POST /api/orders
  → Create new order
  Body: {
    customerEmail: string,
    customerPhone: string,
    customerFirstName: string,
    customerLastName: string,
    orderType: "DELIVERY" | "PICKUP",
    deliveryAddress?: string,
    deliveryCity?: string,
    deliveryPostalCode?: string,
    deliveryInstructions?: string,
    isScheduled: boolean,
    scheduledFor?: string (ISO date),
    items: [{
      menuItemId: string,
      quantity: number,
      size?: string,
      addOns?: string[],
      notes?: string
    }],
    couponCode?: string,
    tip?: number,
    orderNotes?: string,
    paymentMethod: "CARD" | "PAYPAL" | "APPLE_PAY" | "GOOGLE_PAY"
  }
  Validation:
    - Email: valid format, max 255 chars
    - Phone: German format, 10-15 digits
    - Names: 1-100 chars, letters only
    - Address: required if DELIVERY, max 255 chars
    - PostalCode: 5 digits, must be in delivery zones
    - Items: min 1, max 50
    - Quantity: 1-20 per item
  Response: { order: Order, paymentIntent?: { clientSecret: string } }

GET /api/orders/:orderNumber
  → Get order by number (public tracking)
  Query: ?email=xxx or ?phone=xxx (for verification)
  Response: { order: Order }

GET /api/orders/:orderNumber/status
  → Get current status only
  Response: { status: OrderStatus, estimatedReady: DateTime }
```

#### Payments
```
POST /api/payments/create-intent
  → Create Stripe PaymentIntent
  Body: { orderId: string, amount: number }
  Response: { clientSecret: string }

POST /api/payments/webhook
  → Stripe webhook handler
  Headers: stripe-signature
  Body: Stripe event

POST /api/payments/paypal/create
  → Create PayPal order
  Response: { paypalOrderId: string }

POST /api/payments/paypal/capture
  → Capture PayPal payment
  Body: { paypalOrderId: string }
```

#### Reservations
```
POST /api/reservations
  → Create reservation
  Body: {
    guestFirstName: string,
    guestLastName: string,
    guestEmail: string,
    guestPhone: string,
    date: string (YYYY-MM-DD),
    time: string (HH:MM),
    partySize: number,
    specialRequests?: string
  }
  Validation:
    - Date: must be future, within 60 days
    - Time: must be during opening hours
    - PartySize: 1-20 (larger groups call)
  Response: { reservation: Reservation }

GET /api/reservations/availability
  → Check available time slots
  Query: ?date=YYYY-MM-DD&partySize=N
  Response: { slots: string[] }
```

#### Delivery
```
GET /api/delivery/check
  → Check if postal code is deliverable
  Query: ?postalCode=42781
  Response: {
    isDeliverable: boolean,
    fee: number,
    minimumOrder: number,
    estimatedMinutes: number
  }
```

#### Contact
```
POST /api/contact
  → Send contact form
  Body: { name: string, email: string, subject?: string, message: string }
  Rate limit: 3 per hour per IP
  Response: { success: boolean }
```

### Admin API (Protected)

#### Authentication
```
POST /api/admin/auth/login
  Body: { email: string, password: string }
  Rate limit: 5 attempts per 15 minutes
  Response: { token: string, user: AdminUser }

POST /api/admin/auth/logout
  Response: { success: boolean }

GET /api/admin/auth/me
  Response: { user: AdminUser }
```

#### Orders Management
```
GET /api/admin/orders
  Query: ?status=X&date=YYYY-MM-DD&page=1&limit=20
  Response: { orders: Order[], total: number, pages: number }

GET /api/admin/orders/:id
  Response: { order: Order }

PATCH /api/admin/orders/:id/status
  Body: { status: OrderStatus, note?: string }
  Response: { order: Order }
  → Triggers customer notification

GET /api/admin/orders/stats
  Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD
  Response: { totalOrders, totalRevenue, avgOrderValue, topItems }
```

#### Menu Management
```
GET /api/admin/menu/categories
POST /api/admin/menu/categories
PATCH /api/admin/menu/categories/:id
DELETE /api/admin/menu/categories/:id

GET /api/admin/menu/items
POST /api/admin/menu/items
PATCH /api/admin/menu/items/:id
DELETE /api/admin/menu/items/:id

POST /api/admin/menu/items/:id/image
  → Upload image (multipart/form-data)
```

#### Reservations Management
```
GET /api/admin/reservations
  Query: ?date=YYYY-MM-DD&status=X
  Response: { reservations: Reservation[] }

PATCH /api/admin/reservations/:id/status
  Body: { status: ReservationStatus, internalNotes?: string }

GET /api/admin/reservations/calendar
  Query: ?month=YYYY-MM
  Response: { days: { date: string, count: number }[] }
```

#### Settings
```
GET /api/admin/settings
PATCH /api/admin/settings
  Body: { key: string, value: any }
```

---

## E) Recommended Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (cart state)
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl
- **Animations**: Framer Motion

### Backend
- **Runtime**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (Supabase or Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (admin only)
- **Validation**: Zod

### Payments
- **Primary**: Stripe (Cards, Apple Pay, Google Pay)
- **Secondary**: PayPal

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase / Neon / PlanetScale
- **File Storage**: Cloudflare R2 or Vercel Blob
- **Email**: Resend or SendGrid
- **Rate Limiting**: Upstash Redis
- **Monitoring**: Vercel Analytics + Sentry

### Security
- **Rate Limiting**: Upstash Redis
- **Input Validation**: Zod schemas on all endpoints
- **Auth**: bcrypt for passwords, secure session cookies
- **Headers**: Next.js security headers config
- **CSRF**: Built-in Next.js protection

---

## F) Phased Roadmap

### Phase 1: MVP (4-6 weeks)

**Week 1-2: Foundation**
- [x] Project setup (Next.js, Tailwind, Prisma)
- [ ] Database schema and migrations
- [ ] Basic component library
- [ ] Layout components (Header, Footer, Mobile Nav)

**Week 2-3: Public Pages**
- [ ] Home page with hero, awards, carousel
- [ ] Menu page with categories and items
- [ ] Product modal with options
- [ ] Cart functionality
- [ ] About page
- [ ] Contact page
- [ ] Legal pages (Impressum, Datenschutz)

**Week 3-4: Ordering System**
- [ ] Cart state management
- [ ] Checkout flow (4 steps)
- [ ] Stripe integration
- [ ] PayPal integration
- [ ] Order confirmation
- [ ] Email receipts

**Week 4-5: Order Tracking & Reservations**
- [ ] Order tracking page
- [ ] Status timeline component
- [ ] Reservation form
- [ ] Time slot availability
- [ ] Confirmation emails

**Week 5-6: Admin Dashboard MVP**
- [ ] Admin authentication
- [ ] Orders list and detail view
- [ ] Status updates (pushes to tracking)
- [ ] Menu CRUD
- [ ] Reservations list

**Week 6: Polish & Launch**
- [ ] Mobile optimization
- [ ] Performance tuning
- [ ] SEO optimization
- [ ] Cookie consent
- [ ] Testing and bug fixes
- [ ] Production deployment

### Phase 2: Enhancements (Post-Launch)

**Notifications & Communication**
- [ ] SMS notifications (Twilio)
- [ ] WhatsApp Business API
- [ ] Push notifications
- [ ] Order sound alerts for kitchen

**Advanced Tracking**
- [ ] Driver assignment
- [ ] Live map tracking
- [ ] Real-time ETA updates

**Customer Features**
- [ ] Customer accounts (optional)
- [ ] Order history
- [ ] Saved addresses
- [ ] Favorite items
- [ ] Loyalty points program

**Admin Enhancements**
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Staff accounts with roles
- [ ] Printer integration
- [ ] Table management for reservations

**Marketing**
- [ ] Coupon management
- [ ] Email marketing integration
- [ ] Google Reviews widget
- [ ] Referral program

---

## Security Implementation Checklist

### Input Validation
- [ ] All forms use Zod schemas
- [ ] Server-side validation on all API routes
- [ ] Sanitize HTML/script content
- [ ] Validate file uploads (type, size)

### Authentication & Authorization
- [ ] bcrypt password hashing (cost factor 12)
- [ ] Secure session cookies (HttpOnly, SameSite=Strict, Secure)
- [ ] CSRF protection on state-changing endpoints
- [ ] Role-based access control for admin
- [ ] Session timeout after inactivity

### Rate Limiting
- [ ] Login: 5 attempts per 15 minutes
- [ ] Order creation: 10 per hour per IP
- [ ] Contact form: 3 per hour per IP
- [ ] API general: 100 requests per minute per IP
- [ ] Tracking lookup: 30 per minute per IP

### Security Headers
```javascript
// next.config.js
headers: [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://www.paypal.com; frame-src https://js.stripe.com https://www.paypal.com https://www.google.com;"
  }
]
```

### Database Security
- [ ] Parameterized queries only (Prisma handles this)
- [ ] Least privilege database user
- [ ] Connection pooling with limits
- [ ] No raw SQL without validation

### Error Handling
- [ ] Generic error messages to users
- [ ] Detailed logging internally
- [ ] No stack traces in production
- [ ] Audit log for admin actions

---

*Document version: 1.0 | Last updated: 2025*
