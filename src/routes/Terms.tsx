import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';
import { PRIVACY_CONTACT } from './Privacy';

const UPDATED = 'November 12, 2026';

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-7 font-display text-lg font-extrabold text-ink">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[15px]">{children}</p>;
}

/** Terms of use, in plain language: what you may do with Math10x and what you may not. */
export function Terms() {
  useSeo({
    title: 'Terms of Use | Math10x',
    description: 'What you may and may not do with Math10x lessons, problems, videos and artwork.',
    canonicalPath: '/terms',
  });

  return (
    <article className="max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold text-ink">Terms of use</h1>
      <P>Last updated {UPDATED}. By using Math10x you agree to these terms.</P>

      <H2>What you may do</H2>
      <P>
        Math10x is free for students, families and teachers to use for learning. You may use it at
        home or in a classroom, share links to any page, and show it on a screen while you teach.
      </P>

      <H2>Who owns the content</H2>
      <P>
        The lessons, problems, explanations, slides, videos, stories, artwork, characters and code
        on this site are © {new Date().getFullYear()} Math10x. All rights reserved. Using the site
        does not give you ownership of any of it.
      </P>

      <H2>What you may not do</H2>
      <P>Without our written permission, you may not:</P>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
        <li>
          copy, download in bulk, scrape or crawl the site or its files with a script, bot or
          other automated tool, other than a search engine indexing pages as our robots.txt allows;
        </li>
        <li>republish, resell or redistribute the problems, lessons, videos or artwork, in whole or in part;</li>
        <li>use the content to train, fine-tune or test an artificial intelligence or machine-learning model;</li>
        <li>build a competing product or dataset from the content;</li>
        <li>get around rate limits, bot checks or any other technical protection on the site.</li>
      </ul>
      <P>
        We may block or limit access for anyone who breaks these rules, and we may ask a host or
        platform to remove copies of our content.
      </P>

      <H2>No warranty</H2>
      <P>
        We work hard to keep the math correct and the site running, but Math10x is provided as it
        is, without any guarantee. It does not replace a teacher or an official exam provider.
      </P>

      <H2>Changes</H2>
      <P>We may update these terms. The date at the top shows the latest version.</P>

      <H2>Contact</H2>
      <P>To ask for permission to reuse something, or to report a copy of our content: {PRIVACY_CONTACT}.</P>

      <Link to="/" className="mt-8 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
        ← Back home
      </Link>
    </article>
  );
}
