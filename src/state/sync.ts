// Cloud progress sync (Firestore). Layered on top of the local Zustand store —
// the localStorage persistence in `progress.ts` remains the durable baseline and
// keeps working even when every call here fails. Strategy: pull + lossless merge
// on sign-in, then debounced push on change.
import { useProgress } from './progress';
import { getFirebase, peekFirebase, type FirebaseHandles } from '../lib/firebase';

// Matches the persisted store version in progress.ts.
const SCHEMA_VERSION = 10;
const PUSH_DEBOUNCE_MS = 1500;

type Dict = Record<string, unknown>;

/** The store minus its action functions — the serializable progress blob. */
function dataOnly(state: object): Dict {
  const out: Dict = {};
  for (const [k, v] of Object.entries(state)) {
    if (typeof v !== 'function') out[k] = v;
  }
  return out;
}

function isPlainObject(x: unknown): x is Dict {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Recursively merge two values, never losing progress:
 * numbers → max, booleans → OR, ISO-ish strings → later (lexical max),
 * arrays → de-duped union, objects → key-by-key recurse. Type mismatch keeps `a`.
 */
function mergeValue(a: unknown, b: unknown): unknown {
  if (a === undefined || a === null) return b;
  if (b === undefined || b === null) return a;
  if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
  if (typeof a === 'boolean' && typeof b === 'boolean') return a || b;
  if (typeof a === 'string' && typeof b === 'string') return a >= b ? a : b;
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set<string>();
    const out: unknown[] = [];
    for (const item of [...a, ...b]) {
      const key = item && typeof item === 'object' ? JSON.stringify(item) : String(item);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
    return out;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const out: Dict = { ...a };
    for (const k of Object.keys(b)) out[k] = mergeValue(a[k], b[k]);
    return out;
  }
  return a;
}

/**
 * Merge local + remote progress blobs. Remote empty/missing → keep local as-is.
 * Sound preference stays with the current device.
 */
export function mergeProgress(local: Dict, remote: Dict | null | undefined): Dict {
  if (!remote || Object.keys(remote).length === 0) return local;
  const merged = mergeValue(local, remote) as Dict;
  merged.soundEnabled = local.soundEnabled;
  return merged;
}

let unsubscribePush: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

/** Returns a Firebase custom token for the signed-in user, or null if none. */
export type CloudTokenGetter = () => Promise<string | null>;

/**
 * Open a Firestore session for `uid`. Clerk signs the user in; Firebase only
 * learns about it through a custom token Clerk mints for its Firebase
 * integration, which makes the Firebase uid equal the Clerk user id. Any
 * failure — no Firebase config, no token, network — leaves progress on the
 * device and never touches the Clerk session.
 */
async function openCloud(uid: string, getToken: CloudTokenGetter): Promise<FirebaseHandles | null> {
  const fb = await getFirebase();
  if (!fb) return null;
  try {
    if (fb.auth.currentUser?.uid === uid) return fb;
    const token = await getToken();
    if (!token) return null;
    const { signInWithCustomToken } = await import('firebase/auth');
    const cred = await signInWithCustomToken(fb.auth, token);
    if (cred.user.uid !== uid) {
      console.warn('[sync] cloud uid does not match the signed-in user; not syncing');
      return null;
    }
    return fb;
  } catch (err) {
    console.warn('[sync] cloud session unavailable; progress stays on this device', err);
    return null;
  }
}

async function writeRemote(uid: string): Promise<void> {
  const fb = await getFirebase();
  if (!fb) return;
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(fb.db, 'users', uid, 'state', 'progress');
    await setDoc(
      ref,
      { data: dataOnly(useProgress.getState()), schemaVersion: SCHEMA_VERSION, updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch (err) {
    // Local store is unaffected; just log and move on.
    console.warn('[sync] push failed; progress still saved locally', err);
  }
}

/** Pull + merge remote progress for this user, then start pushing local changes. */
export async function startSync(uid: string, getToken: CloudTokenGetter): Promise<void> {
  stopSync();
  const fb = await openCloud(uid, getToken);
  if (!fb) return;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const ref = doc(fb.db, 'users', uid, 'state', 'progress');
    const snap = await getDoc(ref);
    const remote = (snap.exists() ? (snap.data()?.data as Dict | undefined) : null) ?? null;
    const merged = mergeProgress(dataOnly(useProgress.getState()), remote);
    useProgress.setState(merged);
    await writeRemote(uid); // persist the merged result
  } catch (err) {
    console.warn('[sync] pull failed; using local progress', err);
  }
  // Push subsequent local changes (debounced). Set up AFTER the merge so the
  // initial setState above doesn't trigger a redundant write.
  unsubscribePush = useProgress.subscribe(() => {
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => void writeRemote(uid), PUSH_DEBOUNCE_MS);
  });
}

/** Stop pushing and close the cloud session. Local progress is left untouched. */
export function stopSync(): void {
  if (unsubscribePush) {
    unsubscribePush();
    unsubscribePush = null;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  // Only if Firebase was ever loaded — never initialize it just to sign out.
  void peekFirebase()?.then(async (fb) => {
    if (!fb?.auth.currentUser) return;
    const { signOut } = await import('firebase/auth');
    await signOut(fb.auth).catch(() => undefined);
  });
}
