import { domainCourseName } from '../types/problem';
import { COURSES, courseHref, type CourseId } from '../data/courses';
import { useProgress } from '../state/progress';
import { useDisplayName } from '../state/auth';
import { useDomainSummary } from '../hooks/useProblems';
import { LaunchBay } from '../components/launch/LaunchBay';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import { Onboarding } from '../components/Onboarding';
import { HowItWorks } from '../components/HowItWorks';
import { useSeo, SITE_URL, SITE_NAME } from '../lib/seo';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Math10x courses',
  itemListElement: COURSES.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: c.strands.length === 1 ? domainCourseName(c.strands[0].domain) : c.name,
      description: c.blurb,
      url: `${SITE_URL}${courseHref(c)}`,
      provider: { '@type': 'EducationalOrganization', name: SITE_NAME, url: `${SITE_URL}/` },
    },
  })),
};

export function Home() {
  useSeo({
    title: 'Math10x — Free Math: Grades 5-6, Algebra 1, Geometry, Trig, Precalculus & SAT Prep',
    description:
      'Math10x makes math click, from 5th and 6th grade Common Core through Algebra 1, Geometry, Trigonometry and Precalculus, plus full Digital SAT Math prep: clear lessons, worked examples, and practice — with an arcade of games kids unlock by learning.',
    canonicalPath: '/',
    jsonLd: HOME_JSON_LD,
  });
  const { error } = useDomainSummary();
  const practiceDates = useProgress((s) => s.practiceDates);
  const xpByDate = useProgress((s) => s.xpByDate);
  const onboardingComplete = useProgress((s) => s.onboardingComplete);
  const startingCourse = useProgress((s) => s.startingCourse);
  const setStartingCourse = useProgress((s) => s.setStartingCourse);
  const markOnboardingDone = useProgress((s) => s.markOnboardingDone);
  // The only thing asked up front is which course to start. Age and grade are
  // optional and live in Settings.
  const needsProfile = startingCourse === null;
  const displayName = useDisplayName();

  return (
    <div>
      {(!onboardingComplete || needsProfile) && (
        <Onboarding
          initialCourse={(startingCourse as CourseId | null) ?? null}
          onDone={(c) => {
            setStartingCourse(c);
            markOnboardingDone();
          }}
        />
      )}

      <h1 className="sr-only">Math10x — pick a course</h1>

      {error && (
        <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad mb-4">
          Couldn't load problems: {error.message}
        </div>
      )}

      <LaunchBay displayName={displayName} chosen={startingCourse} />

      <PracticeHeatmap practiceDates={practiceDates} xpByDate={xpByDate} />

      <HowItWorks />

    </div>
  );
}
