export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://ecc5-67-216-154-211.ngrok-free.app"
    : "https://api.usewavs.com"

export const STRIPE_PAYMENT_LINK =
  process.env.NODE_ENV === "development"
    ? "https://buy.stripe.com/test_9AQ3dGgjhfV57ni145"
    : "https://buy.stripe.com/9AQ8yodNP01V3sc3ci";

export const POSTHOG_API_KEY =
  process.env.NODE_ENV === "development"
    ? "phc_T2KxbF1upZUlk7SPVA5msqXhATER0bdKc5qgmK1uV6o"
    : "phc_GuT13crpRtdIPxRi0pzg6xZbfPXz8Jz3IhiFMcfMHBN"
