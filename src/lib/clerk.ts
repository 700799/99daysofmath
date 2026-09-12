// Clerk is the sign-in provider. Like Firebase before it, it is *optional*:
// without a publishable key the app runs fully anonymously as "Math-Friend"
// and sign-in is simply not offered. The key is public by design (pk_test_ /
// pk_live_), so it is safe to bake into the client bundle.
export const clerkPublishableKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim() || '';

/** True when a Clerk publishable key is present. Safe to read synchronously. */
export const clerkConfigured = /^pk_(test|live)_/.test(clerkPublishableKey);
