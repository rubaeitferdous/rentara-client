import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Singleton client-side Stripe loader using the publishable key.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = loadStripe(key || "");
  }
  return stripePromise;
};
