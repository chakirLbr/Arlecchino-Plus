'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    );
  }
  return stripePromise;
}

interface StripeProviderProps {
  children: ReactNode;
  clientSecret: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStripe().then((stripeInstance) => {
      setStripe(stripeInstance);
      setLoading(false);
    });
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#dc2626',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  if (loading || !stripe) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Zahlungsformular wird geladen...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}
