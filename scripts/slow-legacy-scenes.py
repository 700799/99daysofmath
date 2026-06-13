"""Slow down the 30 legacy 6.x idea scenes that pre-date _helpers.py.

For each `self.play(...)` without an explicit `run_time`, append `, run_time=1.4`.
For each `self.wait(N)`, multiply N by 1.4 (rounded to 2 dp).
Idempotent: skips lines that already contain `run_time=` or a `# slowed` marker.

Run: `python3 scripts/slow-legacy-scenes.py`
"""
import re
import sys
from pathlib import Path

FACTOR = 1.4
ROOT = Path(__file__).resolve().parent.parent
SCENES = ROOT / "manim" / "scenes"

PLAY_RE = re.compile(r"^(?P<indent>\s*)self\.play\((?P<inner>.*)\)\s*$")
WAIT_RE = re.compile(r"^(?P<indent>\s*)self\.wait\((?P<n>[\d.]+)\)\s*$")
HAS_RUNTIME = re.compile(r"\brun_time\s*=")


def transform(text: str) -> tuple[str, int]:
    if "# slowed" in text:
        return text, 0
    out, touched = [], 0
    for line in text.splitlines(keepends=True):
        m = PLAY_RE.match(line.rstrip("\n"))
        if m and not HAS_RUNTIME.search(m.group("inner")):
            inner = m.group("inner").rstrip()
            new = f'{m.group("indent")}self.play({inner}, run_time={FACTOR})\n'
            out.append(new)
            touched += 1
            continue
        m = WAIT_RE.match(line.rstrip("\n"))
        if m:
            n = float(m.group("n")) * FACTOR
            out.append(f'{m.group("indent")}self.wait({round(n, 2)})\n')
            touched += 1
            continue
        out.append(line)
    if touched:
        out.append("# slowed\n")
    return "".join(out), touched


def main() -> int:
    files = sorted(
        f
        for f in SCENES.glob("lesson_6_*_*.py")
        if not any(part in f.name for part in ("_examples", "_trap", "_idea"))
    )
    # legacy 6.x idea scenes are named lesson_6_<DOMAIN>_<UNIT>.py (no part suffix)
    files = sorted(
        f
        for f in SCENES.glob("lesson_6_*.py")
        if not any(part in f.name for part in ("_examples", "_trap", "_idea"))
    )
    total = 0
    for f in files:
        src = f.read_text()
        new, touched = transform(src)
        if touched:
            f.write_text(new)
            total += 1
            print(f"  slowed {f.name}: {touched} ops")
    print(f"✓ slowed {total}/{len(files)} legacy scene files (factor {FACTOR}x)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
