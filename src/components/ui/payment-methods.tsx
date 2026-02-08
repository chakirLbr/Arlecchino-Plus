'use client';

import { cn } from '@/lib/utils';

interface PaymentMethodsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'Apple Pay', icon: '🍎' },
  { name: 'Google Pay', icon: '🔵' },
  { name: 'PayPal', icon: '🅿️' },
  { name: 'Klarna', icon: '🛒' },
  { name: 'SEPA', icon: '🏦' },
  { name: 'Sofort', icon: '⚡' },
];

export function PaymentMethods({ className, size = 'md', showLabel = true }: PaymentMethodsProps) {
  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-2',
    lg: 'text-base gap-3',
  };

  const badgeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <div className={cn('flex flex-col items-center', sizeClasses[size], className)}>
      {showLabel && (
        <p className="text-muted-foreground mb-2">Sichere Zahlungsmethoden</p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {paymentMethods.map((method) => (
          <span
            key={method.name}
            className={cn(
              'inline-flex items-center gap-1 rounded-md bg-muted border border-border font-medium',
              badgeClasses[size]
            )}
            title={method.name}
          >
            <span>{method.icon}</span>
            <span className="hidden sm:inline">{method.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Compact version with just icons for smaller spaces
export function PaymentMethodsIcons({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 text-muted-foreground', className)}>
      {/* Card */}
      <svg className="h-6 w-8" viewBox="0 0 32 24" fill="currentColor">
        <rect x="0" y="0" width="32" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <rect x="0" y="6" width="32" height="4" fill="currentColor" opacity="0.3"/>
        <rect x="3" y="14" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
        <rect x="3" y="18" width="5" height="2" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
      {/* Apple Pay */}
      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="currentColor">
        <rect x="0" y="0" width="40" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <text x="20" y="16" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">Pay</text>
      </svg>
      {/* Google Pay */}
      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="currentColor">
        <rect x="0" y="0" width="40" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <text x="20" y="16" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">GPay</text>
      </svg>
      {/* PayPal */}
      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="currentColor">
        <rect x="0" y="0" width="40" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <text x="20" y="16" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">PayPal</text>
      </svg>
      {/* Klarna */}
      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="currentColor">
        <rect x="0" y="0" width="40" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <text x="20" y="16" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">Klarna</text>
      </svg>
      {/* SEPA */}
      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="currentColor">
        <rect x="0" y="0" width="40" height="24" rx="3" fill="currentColor" opacity="0.1"/>
        <text x="20" y="16" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">SEPA</text>
      </svg>
    </div>
  );
}

// Banner version for prominent display
export function PaymentMethodsBanner({ className }: { className?: string }) {
  return (
    <div className={cn('bg-muted/50 border border-border rounded-lg p-4', className)}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-medium text-sm">Sichere Zahlung</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">💳 Karte</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">🍎 Apple Pay</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">🔵 Google Pay</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">🅿️ PayPal</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">🛒 Klarna</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">🏦 SEPA</span>
          <span className="px-2 py-1 bg-background border rounded text-xs font-medium">⚡ Sofort</span>
        </div>
      </div>
    </div>
  );
}
