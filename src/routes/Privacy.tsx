import { Link } from 'react-router-dom';
import { useConsent } from '../state/consent';
import { useSeo } from '../lib/seo';
import { clerkConfigured } from '../lib/clerk';
import { firebaseConfigured } from '../lib/firebase';

const UPDATED = 'October 17, 2026';
export const PRIVACY_CONTACT = 'privacy@math10x.com';

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-7 font-display text-lg font-extrabold text-ink">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[15px]">{children}</p>;
}

/** The privacy and cookie notice, in plain language. */
export function Privacy() {
  const choice = useConsent((s) => s.choice);
  const reset = useConsent((s) => s.reset);
  useSeo({
    title: 'Privacy & Cookies | Math10x',
    description: 'What Math10x stores, which cookies it uses, where ads appear, and how to change your choice.',
    canonicalPath: '/privacy',
  });

  return (
    <article className="max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold text-ink">Privacy &amp; cookies</h1>
      <P>Last updated {UPDATED}. This page explains, in plain words, what Math10x keeps about you and why.</P>

      <H2>What stays on your device</H2>
      <P>
        Your progress (stars, XP, streaks, stickers, coins, which problems you have done) and your
        settings (sound, theme, daily goal, age and grade if you entered them) are stored in your
        browser on this device. You can erase all of it at any time with “Reset progress” in{' '}
        <Link to="/settings" className="font-bold text-accent underline">Settings</Link>.
      </P>

      <H2>Accounts (optional)</H2>
      {clerkConfigured ? (
        <P>
          You can use Math10x without an account. If you sign in with Google or an email address,
          our sign-in provider (Clerk) stores your email address, name and profile picture so you can
          sign in again.{firebaseConfigured ? ' Your progress is then also saved to our cloud database (Google Firebase) so it follows you between devices.' : ''}{' '}
          We do not sell this information or use it for advertising. To delete your account and
          everything linked to it, email {PRIVACY_CONTACT}.
        </P>
      ) : (
        <P>Sign-in is not enabled on this site, so no account information is collected.</P>
      )}

      <H2>Children</H2>
      <P>
        Math10x is made for students from 5th grade up. We do not knowingly collect personal
        information from children under 13 beyond what an account needs, and we ask that a parent
        or guardian create any account for a child under 13. Parents can ask to see or delete
        their child’s information by emailing {PRIVACY_CONTACT}. No ads are shown in the 5th-grade,
        6th-grade, Algebra 1 or Geometry sections, in the arcade, or in the stories.
      </P>

      <H2>Cookies</H2>
      <P>
        <b>Essential cookies and storage</b> keep you signed in, remember your settings and remember
        your answer to the cookie notice. They need no permission and set no advertising cookies.
      </P>
      <P>
        <b>Advertising cookies</b> are used only by Google AdSense, only on the Trigonometry,
        Precalculus and SAT Math pages, and only if you chose “Allow ads” in the cookie notice. We
        request non-personalized ads and tag every ad request for restricted, age-appropriate
        treatment, so Google does not build an interest profile from your visits here. Google’s
        own cookies may still be used to limit how often you see an ad and to detect fraud. How
        Google uses data is described at google.com/policies/technologies/partner-sites. Ads never
        appear during a timed test.
      </P>
      <div className="mt-3 rounded-2xl border-2 border-line bg-surface p-4">
        <div className="font-display text-sm font-extrabold text-ink">
          Your cookie choice:{' '}
          {choice === 'all' ? 'ads allowed' : choice === 'essential' ? 'essential only' : 'not answered yet'}
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-2 min-h-11 rounded-xl border-2 border-line bg-surface-2 px-4 font-display text-sm font-extrabold text-ink hover:border-accent/50"
          data-haptic="tap"
        >
          Change my choice
        </button>
      </div>

      <H2>What we do not do</H2>
      <P>
        We do not run analytics trackers, we do not sell personal information, and we do not show
        ads anywhere other than the pages named above.
      </P>

      <H2>Contact</H2>
      <P>Questions, or a request to see or delete your information: {PRIVACY_CONTACT}.</P>

      <Link to="/" className="mt-8 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
        ← Back home
      </Link>
    </article>
  );
}
