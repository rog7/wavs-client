export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://ecc5-67-216-154-211.ngrok-free.app"
    : "https://vault-server-jxzx.onrender.com:10000"

export const STRIPE_PAYMENT_LINK =
  process.env.NODE_ENV === "development"
    ? "https://buy.stripe.com/test_9AQ3dGgjhfV57ni145"
    : "https://buy.stripe.com/9AQ8yodNP01V3sc3ci";

export const POSTHOG_API_KEY =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_POSTHOG_KEY
    : process.env.PROD_POSTHOG_KEY;
