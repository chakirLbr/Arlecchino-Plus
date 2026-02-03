import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in EUR
 */
export function formatPrice(price: number | string, locale: string = 'de-DE'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(numPrice);
}

/**
 * Format date in German format
 */
export function formatDate(date: Date | string, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format time in German format
 */
export function formatTime(date: Date | string, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Generate order number
 * Format: AP-YYYY-NNNNNN
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `AP-${year}-${random}`;
}

/**
 * Generate reservation number
 * Format: AR-YYYY-NNNNNN
 */
export function generateReservationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `AR-${year}-${random}`;
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Calculate estimated delivery time
 */
export function calculateEstimatedTime(
  prepTimeMinutes: number = 20,
  deliveryTimeMinutes: number = 25
): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getTime() + (prepTimeMinutes + deliveryTimeMinutes - 5) * 60000);
  const to = new Date(now.getTime() + (prepTimeMinutes + deliveryTimeMinutes + 10) * 60000);
  return { from, to };
}

/**
 * Validate German phone number
 */
export function isValidGermanPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // German phone: starts with 0 or +49, followed by 9-14 digits
  const germanPhoneRegex = /^(\+49|0049|0)[1-9]\d{8,13}$/;
  return germanPhoneRegex.test(cleaned);
}

/**
 * Validate German postal code
 */
export function isValidGermanPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Get day name in German
 */
export function getDayName(dayIndex: number, locale: string = 'de-DE'): string {
  const days = {
    'de-DE': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  };
  return (days[locale as keyof typeof days] || days['de-DE'])[dayIndex];
}

/**
 * Check if restaurant is currently open
 */
export function isRestaurantOpen(openingHours: Record<string, { open: string; close: string }[]>): boolean {
  const now = new Date();
  const dayIndex = now.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[dayIndex];
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const todayHours = openingHours[currentDay];
  if (!todayHours || todayHours.length === 0) return false;

  return todayHours.some(
    (period) => currentTime >= period.open && currentTime <= period.close
  );
}
