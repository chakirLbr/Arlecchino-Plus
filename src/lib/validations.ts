import { z } from 'zod';

// ============================================
// COMMON VALIDATION PATTERNS
// ============================================

const germanPhoneRegex = /^(\+49|0049|0)[1-9]\d{8,13}$/;
const germanPostalCodeRegex = /^\d{5}$/;

// ============================================
// CUSTOMER INFORMATION
// ============================================

export const customerInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Vorname ist erforderlich')
    .max(100, 'Vorname ist zu lang')
    .regex(/^[a-zA-ZäöüÄÖÜß\s\-']+$/, 'Ungültiger Vorname'),
  lastName: z
    .string()
    .min(1, 'Nachname ist erforderlich')
    .max(100, 'Nachname ist zu lang')
    .regex(/^[a-zA-ZäöüÄÖÜß\s\-']+$/, 'Ungültiger Nachname'),
  email: z
    .string()
    .min(1, 'E-Mail ist erforderlich')
    .max(255, 'E-Mail ist zu lang')
    .email('Ungültige E-Mail-Adresse'),
  phone: z
    .string()
    .min(1, 'Telefonnummer ist erforderlich')
    .transform((val) => val.replace(/[\s\-()]/g, ''))
    .refine((val) => germanPhoneRegex.test(val), 'Ungültige Telefonnummer'),
});

// ============================================
// ADDRESS
// ============================================

export const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Straße ist erforderlich')
    .max(255, 'Straße ist zu lang'),
  city: z
    .string()
    .min(1, 'Stadt ist erforderlich')
    .max(100, 'Stadt ist zu lang'),
  postalCode: z
    .string()
    .min(1, 'PLZ ist erforderlich')
    .regex(germanPostalCodeRegex, 'Ungültige PLZ (5 Ziffern)'),
  instructions: z
    .string()
    .max(500, 'Anweisungen sind zu lang')
    .optional(),
});

// ============================================
// ORDER ITEM
// ============================================

export const orderItemSchema = z.object({
  menuItemId: z.string().cuid('Ungültige Artikel-ID'),
  quantity: z
    .number()
    .int('Menge muss eine ganze Zahl sein')
    .min(1, 'Mindestmenge ist 1')
    .max(20, 'Maximale Menge ist 20'),
  size: z.string().optional(),
  addOns: z.array(z.string()).optional(),
  notes: z.string().max(500, 'Anmerkungen sind zu lang').optional(),
});

// ============================================
// ORDER CREATION
// ============================================

export const createOrderSchema = z
  .object({
    // Customer info
    customerFirstName: customerInfoSchema.shape.firstName,
    customerLastName: customerInfoSchema.shape.lastName,
    customerEmail: customerInfoSchema.shape.email,
    customerPhone: customerInfoSchema.shape.phone,

    // Order type
    orderType: z.enum(['DELIVERY', 'PICKUP'], {
      errorMap: () => ({ message: 'Bitte wählen Sie Lieferung oder Abholung' }),
    }),

    // Delivery address (required for delivery)
    deliveryAddress: z.string().max(255).optional(),
    deliveryCity: z.string().max(100).optional(),
    deliveryPostalCode: z.string().optional(),
    deliveryInstructions: z.string().max(500).optional(),

    // Timing
    isScheduled: z.boolean().default(false),
    scheduledFor: z.string().datetime().optional(),

    // Items
    items: z
      .array(orderItemSchema)
      .min(1, 'Mindestens ein Artikel ist erforderlich')
      .max(50, 'Maximale Anzahl Artikel überschritten'),

    // Coupon
    couponCode: z
      .string()
      .max(50)
      .transform((val) => val?.toUpperCase().trim())
      .optional(),

    // Tip
    tip: z
      .number()
      .min(0, 'Trinkgeld kann nicht negativ sein')
      .max(100, 'Maximales Trinkgeld ist 100€')
      .optional(),

    // Notes
    orderNotes: z.string().max(1000, 'Anmerkungen sind zu lang').optional(),

    // Payment
    paymentMethod: z.enum(['CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'CASH'], {
      errorMap: () => ({ message: 'Bitte wählen Sie eine Zahlungsart' }),
    }),
  })
  .refine(
    (data) => {
      if (data.orderType === 'DELIVERY') {
        return (
          data.deliveryAddress &&
          data.deliveryCity &&
          data.deliveryPostalCode &&
          germanPostalCodeRegex.test(data.deliveryPostalCode)
        );
      }
      return true;
    },
    {
      message: 'Lieferadresse ist für Lieferungen erforderlich',
      path: ['deliveryAddress'],
    }
  )
  .refine(
    (data) => {
      if (data.isScheduled && !data.scheduledFor) {
        return false;
      }
      if (data.scheduledFor) {
        const scheduled = new Date(data.scheduledFor);
        const now = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        return scheduled > now && scheduled < maxDate;
      }
      return true;
    },
    {
      message: 'Ungültiger Liefertermin',
      path: ['scheduledFor'],
    }
  );

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// ============================================
// ORDER TRACKING LOOKUP
// ============================================

export const orderLookupSchema = z.object({
  orderNumber: z
    .string()
    .min(1, 'Bestellnummer ist erforderlich')
    .regex(/^AP-\d{4}-\d{6}$/, 'Ungültiges Bestellnummern-Format'),
  verificationMethod: z.enum(['email', 'phone']),
  verificationValue: z.string().min(1, 'Verifizierungswert ist erforderlich'),
});

// ============================================
// RESERVATION
// ============================================

export const createReservationSchema = z
  .object({
    guestFirstName: customerInfoSchema.shape.firstName,
    guestLastName: customerInfoSchema.shape.lastName,
    guestEmail: customerInfoSchema.shape.email,
    guestPhone: customerInfoSchema.shape.phone,
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datumsformat')
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 60);
          return date >= today && date <= maxDate;
        },
        'Datum muss in den nächsten 60 Tagen liegen'
      ),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Ungültiges Zeitformat'),
    partySize: z
      .number()
      .int()
      .min(1, 'Mindestens 1 Person')
      .max(20, 'Für mehr als 20 Personen rufen Sie uns bitte an'),
    specialRequests: z.string().max(1000, 'Anmerkungen sind zu lang').optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: 'Bitte akzeptieren Sie die Reservierungsbedingungen',
      }),
    }),
  })
  .refine(
    (data) => {
      // Check if the time is valid for the selected date
      const date = new Date(data.date);
      const dayOfWeek = date.getDay();
      const time = data.time;

      // Opening hours (simplified - should come from settings)
      const openingHours: Record<number, { open: string; close: string }[]> = {
        0: [{ open: '12:00', close: '21:30' }], // Sunday
        1: [{ open: '17:00', close: '21:30' }], // Monday
        2: [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:30' }], // Tuesday
        3: [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:30' }], // Wednesday
        4: [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:30' }], // Thursday
        5: [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:30' }], // Friday
        6: [{ open: '12:00', close: '21:30' }], // Saturday
      };

      const hours = openingHours[dayOfWeek];
      if (!hours || hours.length === 0) return false;

      return hours.some((period) => time >= period.open && time <= period.close);
    },
    {
      message: 'Gewählte Uhrzeit liegt außerhalb der Öffnungszeiten',
      path: ['time'],
    }
  );

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

// ============================================
// CONTACT FORM
// ============================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name ist erforderlich')
    .max(200, 'Name ist zu lang'),
  email: customerInfoSchema.shape.email,
  subject: z.string().max(200, 'Betreff ist zu lang').optional(),
  message: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(5000, 'Nachricht ist zu lang'),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({
      message: 'Bitte akzeptieren Sie die Datenschutzerklärung',
    }),
  }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ============================================
// ADMIN LOGIN
// ============================================

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .max(100, 'Passwort ist zu lang'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// ============================================
// MENU ITEM
// ============================================

export const createMenuItemSchema = z.object({
  categoryId: z.string().cuid('Ungültige Kategorie-ID'),
  name: z.string().min(1, 'Name ist erforderlich').max(200),
  nameEn: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  descriptionEn: z.string().max(1000).optional(),
  basePrice: z
    .number()
    .min(0.01, 'Preis muss größer als 0 sein')
    .max(1000, 'Preis ist zu hoch'),
  allergens: z.array(z.string()).optional(),
  spiceLevel: z.number().int().min(0).max(3).optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

// ============================================
// DELIVERY ZONE CHECK
// ============================================

export const deliveryZoneCheckSchema = z.object({
  postalCode: z
    .string()
    .min(1, 'PLZ ist erforderlich')
    .regex(germanPostalCodeRegex, 'Ungültige PLZ'),
});

// ============================================
// COUPON VALIDATION
// ============================================

export const couponCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Gutscheincode ist erforderlich')
    .max(50, 'Ungültiger Gutscheincode')
    .transform((val) => val.toUpperCase().trim()),
  orderSubtotal: z.number().min(0),
});
