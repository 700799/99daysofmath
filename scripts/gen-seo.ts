/**
 * Build-time SEO generation for Cloudflare Pages (no browser needed).
 *
 * After `vite build`, this reads the exact app data (LESSONS + domain metadata)
 * and writes into dist/:
 *   • robots.txt
 *   • sitemap.xml
 *   • per-route static HTML shells (dist/<route>/index.html) with the <head>
 *     rewritten for that page — title, description, canonical, OG/Twitter, and
 *     route-specific JSON-LD — so crawlers get correct metadata + structured
 *     data with zero JS execution. Cloudflare serves these files directly; any
 *     route without a shell falls back to the SPA via public/_redirects.
 *
 * Run with tsx (see package.json "build"). Plain-node-safe: no browser APIs.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS, lessonKey } from '../src/data/lessons';
import {
  DOMAINS,
  DOMAIN_LABELS,
  DOMAIN_DESCRIPTIONS,
  domainCourseName,
  gradeLabelFor,
  type Domain,
} from '../src/types/problem';

const SITE_URL = 'https://math10x.com';
const SITE_NAME = 'Math10x';
const OG_IMAGE = `${SITE_URL}/og.png`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const LASTMOD = new Date().toISOString().slice(0, 10);

// Course phrasing per domain — Algebra 1 and Precalculus are courses, not grades.
const COURSE_NAME: Partial<Record<Domain, string>> = { A1: 'Algebra 1', PC: 'Precalculus' };
const lessonCourse = (d: Domain) =>
  COURSE_NAME[d] ?? `${d.startsWith('5.') ? '5th' : '6th'} Grade Math`;
const lessonProse = (d: Domain) =>
  COURSE_NAME[d]
    ? `A free ${COURSE_NAME[d]} lesson with clear worked examples and practice on Math10x.`
    : `A free ${d.startsWith('5.') ? '5th' : '6th'}-grade math lesson with an animated video, worked examples, and practice on Math10x.`;

interface Route {
  path: string; // e.g. "/trail/6.RP" ("/" for home)
  title: string;
  description: string;
  jsonLd?: object | object[];
  priority: number;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function courseLd(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: { '@type': 'EducationalOrganization', name: SITE_NAME, url: `${SITE_URL}/` },
  };
}

function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}

function buildRoutes(): Route[] {
  const routes: Route[] = [];

  // Home
  routes.push({
    path: '/',
    title: 'Math10x — Free Math for Grades 5-6 Plus Algebra 1 & Precalculus',
    description:
      'Math10x makes math click for grades 5-6 and beyond: clear lessons, worked examples, and practice across ratios, fractions, geometry, statistics, Algebra 1 and Precalculus — plus an arcade of games kids unlock by learning.',
    priority: 1.0,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Math10x math trails',
      itemListElement: DOMAINS.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: courseLd(domainCourseName(d), DOMAIN_DESCRIPTIONS[d], `${SITE_URL}/trail/${d}`),
      })),
    },
  });

  // Domain trails
  for (const d of DOMAINS) {
    routes.push({
      path: `/trail/${d}`,
      title: `${domainCourseName(d)} | Math10x`,
      description: `Learn ${DOMAIN_LABELS[d]} (${d}) for ${gradeLabelFor(d)}: ${DOMAIN_DESCRIPTIONS[d]}. Free lessons, worked examples, and practice on Math10x.`,
      priority: 0.9,
      jsonLd: [
        courseLd(domainCourseName(d), DOMAIN_DESCRIPTIONS[d], `${SITE_URL}/trail/${d}`),
        breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: DOMAIN_LABELS[d], path: `/trail/${d}` },
        ]),
      ],
    });
  }

  // Lessons (units)
  for (const l of LESSONS) {
    const d = l.domain as Domain;
    const p = `/unit/${d}/${l.unit}`;
    routes.push({
      path: p,
      title: `${l.title} — ${lessonCourse(d)}${COURSE_NAME[d] ? '' : ` (${DOMAIN_LABELS[d]})`} | Math10x`,
      description: `${l.objective ?? l.title}. ${lessonProse(d)}`,
      priority: 0.8,
      jsonLd: [
        courseLd(`${l.title} — ${lessonCourse(d)}`, l.objective ?? l.title, `${SITE_URL}${p}`),
        breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: DOMAIN_LABELS[d], path: `/trail/${d}` },
          { name: l.title, path: p },
        ]),
      ],
    });
  }

  // Library pages
  routes.push({
    path: '/videos',
    title: 'Math Video Lessons — Grades 5-6 & Beyond | Math10x',
    description:
      'Watch free animated math video lessons for grades 5-6: ratios, fractions, decimals, geometry, expressions, and statistics — each with worked examples and practice.',
    priority: 0.7,
  });
  routes.push({
    path: '/stories',
    title: 'Math Stories — The History & Wonder of Math | Math10x',
    description:
      'Illustrated math stories that bring math concepts to life — the origins and real-world magic behind ratios, fractions, geometry, and more.',
    priority: 0.6,
  });
  routes.push({
    path: '/mathematicians',
    title: 'Famous Mathematicians for Kids — Euclid to Ramanujan | Math10x',
    description:
      'Meet the brilliant minds who shaped math: Euclid, Newton, Euler, Gauss, Ramanujan, Noether, Hilbert & Cantor — slide-by-slide stories of what they did and why it matters.',
    priority: 0.6,
  });

  return routes;
}

/** Rewrite the base index.html <head> for a specific route. */
function rewriteHead(baseHtml: string, r: Route): string {
  let html = baseHtml;
  // Replace <title>…</title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  // Replace description
  html = html.replace(
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${esc(r.description)}" />`,
  );
  // Replace canonical
  const url = SITE_URL + (r.path === '/' ? '/' : r.path);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  // Replace OG url/title/description
  html = html
    .replace(/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(r.title)}" />`)
    .replace(
      /<meta\s+property="og:description"[^>]*>/,
      `<meta property="og:description" content="${esc(r.description)}" />`,
    )
    .replace(/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(r.title)}" />`)
    .replace(
      /<meta\s+name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${esc(r.description)}" />`,
    );
  // Inject route JSON-LD just before </head> (in addition to the site-wide graph).
  if (r.jsonLd) {
    const arr = Array.isArray(r.jsonLd) ? r.jsonLd : [r.jsonLd];
    const scripts = arr
      .map(
        (ld) =>
          `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
      )
      .join('\n    ');
    html = html.replace('</head>', `    ${scripts}\n  </head>`);
  }
  return html;
}

async function main() {
  const baseHtml = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  const routes = buildRoutes();

  // robots.txt
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /settings',
    'Disallow: /arcade',
    'Disallow: /shop',
    'Disallow: /rewards',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
  await fs.writeFile(path.join(DIST, 'robots.txt'), robots);

  // sitemap.xml
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap);

  // Per-route static shells (skip "/" — dist/index.html already has home head).
  let shells = 0;
  for (const r of routes) {
    if (r.path === '/') continue;
    const outDir = path.join(DIST, r.path.replace(/^\//, ''));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'index.html'), rewriteHead(baseHtml, r));
    shells++;
  }

  // Also inject the home route's JSON-LD ItemList into dist/index.html.
  const home = routes.find((r) => r.path === '/');
  if (home) {
    await fs.writeFile(path.join(DIST, 'index.html'), rewriteHead(baseHtml, home));
  }

  console.log(
    `[gen-seo] wrote robots.txt, sitemap.xml (${routes.length} urls), ${shells} per-route HTML shells → dist/`,
  );
}

main().catch((err) => {
  console.error('[gen-seo] failed:', err);
  process.exit(1);
});
