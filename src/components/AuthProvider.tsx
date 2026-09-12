// Wraps the app in Clerk when a publishable key is present, and in nothing
// otherwise. Clerk's dialogs follow the app theme and its accent, and use the
// router for their redirects so they stay inside the SPA.
import type { ReactNode } from 'react';
import { AuthenticateWithRedirectCallback, ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { Navigate, useNavigate } from 'react-router-dom';
import { clerkConfigured, clerkPublishableKey } from '../lib/clerk';
import { useProgress } from '../state/progress';
import { AuthBootstrap } from './AuthBootstrap';
import { Mascot } from './Mascot';

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!clerkConfigured) return <>{children}</>;
  return <ClerkShell>{children}</ClerkShell>;
}

function ClerkShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const theme = useProgress((s) => s.theme);
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#2E5F8F',
          borderRadius: '1rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <AuthBootstrap />
      {children}
    </ClerkProvider>
  );
}

/**
 * Where Google sends the browser back. Clerk finishes the sign-in here — or
 * carries a new Google account over to sign-up — then goes to Settings, where
 * the account card now shows the person. Without Clerk there is nothing to
 * finish, so it goes Home.
 */
export function SsoCallback() {
  if (!clerkConfigured) return <Navigate to="/" replace />;
  return (
    <div className="text-center py-12">
      <Mascot mood="thinking" size={72} />
      <div className="mt-3 text-ink-muted font-display font-bold">Signing you in…</div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/settings"
        signUpFallbackRedirectUrl="/settings"
      />
    </div>
  );
}
