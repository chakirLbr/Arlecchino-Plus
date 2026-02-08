export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
};

// Common translations
export const translations = {
  de: {
    // Navigation
    nav: {
      menu: 'Speisekarte',
      reservation: 'Reservieren',
      about: 'Über uns',
      contact: 'Kontakt',
      orderNow: 'Jetzt bestellen',
      cart: 'Warenkorb',
    },
    // Hero
    hero: {
      title: 'Holzofenpizza in Haan',
      subtitle: 'Frisch. Schnell. Ausgezeichnet.',
      orderCta: 'Jetzt bestellen',
      reserveCta: 'Tisch reservieren',
    },
    // Features
    features: {
      onlinePayment: 'Online bezahlen',
      deliveryPickup: 'Abholung & Lieferung',
      liveTracking: 'Live Bestellstatus',
    },
    // Menu
    menu: {
      delivery: 'Lieferung',
      pickup: 'Abholung',
      addToCart: 'In den Warenkorb',
      extras: 'Extras (optional)',
      specialRequests: 'Sonderwünsche',
      vegetarian: 'Vegetarisch',
      vegan: 'Vegan',
      spicy: 'Scharf',
    },
    // Cart
    cart: {
      title: 'Warenkorb',
      empty: 'Ihr Warenkorb ist leer',
      subtotal: 'Zwischensumme',
      deliveryFee: 'Liefergebühr',
      tip: 'Trinkgeld',
      total: 'Gesamt',
      checkout: 'Zur Kasse',
      remove: 'Entfernen',
    },
    // Checkout
    checkout: {
      steps: {
        cart: 'Warenkorb',
        delivery: 'Lieferung',
        payment: 'Bezahlung',
        confirmation: 'Bestätigung',
      },
      deliveryAddress: 'Lieferadresse',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      street: 'Straße & Hausnummer',
      postalCode: 'PLZ',
      city: 'Stadt',
      deliveryNotes: 'Anmerkungen zur Lieferung',
      asap: 'So schnell wie möglich',
      scheduled: 'Vorbestellen für',
      paymentMethod: 'Zahlungsart',
      payNow: 'Jetzt bezahlen',
      orderSuccess: 'Vielen Dank für Ihre Bestellung!',
    },
    // Tracking
    tracking: {
      title: 'Bestellung verfolgen',
      orderNumber: 'Bestellnummer',
      status: {
        pending: 'Ausstehend',
        confirmed: 'Bestätigt',
        preparing: 'Wird zubereitet',
        inOven: 'Im Ofen',
        ready: 'Fertig',
        outForDelivery: 'Unterwegs',
        delivered: 'Geliefert',
      },
      estimatedDelivery: 'Voraussichtliche Lieferung',
      estimatedPickup: 'Voraussichtliche Abholung',
    },
    // Reservation
    reservation: {
      title: 'Tisch reservieren',
      date: 'Datum',
      time: 'Uhrzeit',
      guests: 'Anzahl Personen',
      specialRequests: 'Besondere Wünsche',
      submit: 'Tisch reservieren',
      success: 'Reservierung eingegangen!',
      largeGroup: 'Für größere Gruppen rufen Sie uns bitte an.',
    },
    // Contact
    contact: {
      title: 'Kontakt',
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
      openingHours: 'Öffnungszeiten',
      sendMessage: 'Nachricht senden',
    },
    // Footer
    footer: {
      quickLinks: 'Schnellzugriff',
      legal: 'Rechtliches',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
      terms: 'AGB',
      rights: 'Alle Rechte vorbehalten.',
    },
    // Common
    common: {
      loading: 'Laden...',
      error: 'Ein Fehler ist aufgetreten',
      retry: 'Erneut versuchen',
      back: 'Zurück',
      next: 'Weiter',
      submit: 'Absenden',
      cancel: 'Abbrechen',
      close: 'Schließen',
      required: 'Pflichtfeld',
      optional: 'optional',
    },
    // Days
    days: {
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
    },
  },
  en: {
    // Navigation
    nav: {
      menu: 'Menu',
      reservation: 'Reserve',
      about: 'About',
      contact: 'Contact',
      orderNow: 'Order now',
      cart: 'Cart',
    },
    // Hero
    hero: {
      title: 'Stone Oven Pizza in Haan',
      subtitle: 'Fresh. Fast. Award-winning.',
      orderCta: 'Order now',
      reserveCta: 'Reserve a table',
    },
    // Features
    features: {
      onlinePayment: 'Pay online',
      deliveryPickup: 'Delivery & Pickup',
      liveTracking: 'Live order tracking',
    },
    // Menu
    menu: {
      delivery: 'Delivery',
      pickup: 'Pickup',
      addToCart: 'Add to cart',
      extras: 'Extras (optional)',
      specialRequests: 'Special requests',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      spicy: 'Spicy',
    },
    // Cart
    cart: {
      title: 'Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery fee',
      tip: 'Tip',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
    },
    // Checkout
    checkout: {
      steps: {
        cart: 'Cart',
        delivery: 'Delivery',
        payment: 'Payment',
        confirmation: 'Confirmation',
      },
      deliveryAddress: 'Delivery address',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      street: 'Street & number',
      postalCode: 'Postal code',
      city: 'City',
      deliveryNotes: 'Delivery instructions',
      asap: 'As soon as possible',
      scheduled: 'Schedule for',
      paymentMethod: 'Payment method',
      payNow: 'Pay now',
      orderSuccess: 'Thank you for your order!',
    },
    // Tracking
    tracking: {
      title: 'Track order',
      orderNumber: 'Order number',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        inOven: 'In the oven',
        ready: 'Ready',
        outForDelivery: 'Out for delivery',
        delivered: 'Delivered',
      },
      estimatedDelivery: 'Estimated delivery',
      estimatedPickup: 'Estimated pickup',
    },
    // Reservation
    reservation: {
      title: 'Reserve a table',
      date: 'Date',
      time: 'Time',
      guests: 'Number of guests',
      specialRequests: 'Special requests',
      submit: 'Reserve table',
      success: 'Reservation received!',
      largeGroup: 'For larger groups, please call us.',
    },
    // Contact
    contact: {
      title: 'Contact',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      openingHours: 'Opening hours',
      sendMessage: 'Send message',
    },
    // Footer
    footer: {
      quickLinks: 'Quick links',
      legal: 'Legal',
      imprint: 'Imprint',
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'All rights reserved.',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Try again',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      cancel: 'Cancel',
      close: 'Close',
      required: 'Required',
      optional: 'optional',
    },
    // Days
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.de;
