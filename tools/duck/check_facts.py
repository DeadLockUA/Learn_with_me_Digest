"""Validate _data/duck_facts.yml for the duck facts widget.

Usage: python tools/duck/check_facts.py [path]   (exit 1 on errors)
"""
import sys
from datetime import date
from pathlib import Path

import yaml

REACTIONS = {"surprised", "laughing", "nodding", "thinking", "facepalm", "shrugging"}
FIELDS = ("text", "source_url", "source_title", "source_date", "reaction")
MAX_AGE_DAYS = 183
MAX_TEXT = 160
MARKDOWN = ("**", "__", "](", "`")
DEFAULT_PATH = Path(__file__).resolve().parents[2] / "_data" / "duck_facts.yml"


def _as_date(value):
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(str(value))
    except ValueError:
        return None


def validate(facts, today):
    if not isinstance(facts, list):
        return ["top level must be a list of facts"]
    errors = []
    seen = set()
    for i, f in enumerate(facts, 1):
        where = f"fact {i}"
        if not isinstance(f, dict):
            errors.append(f"{where}: must be a mapping")
            continue
        missing = [k for k in FIELDS if not f.get(k)]
        if missing:
            errors.append(f"{where}: missing {', '.join(missing)}")
            continue
        text = str(f["text"])
        if len(text) > MAX_TEXT:
            errors.append(f"{where}: text is {len(text)} chars, max {MAX_TEXT}")
        if any(m in text for m in MARKDOWN):
            errors.append(f"{where}: text contains Markdown")
        if text in seen:
            errors.append(f"{where}: duplicate text")
        seen.add(text)
        if not str(f["source_url"]).startswith("https://"):
            errors.append(f"{where}: source_url must be https")
        if f["reaction"] not in REACTIONS:
            errors.append(f"{where}: unknown reaction {f['reaction']!r}")
        d = _as_date(f["source_date"])
        if d is None:
            errors.append(f"{where}: source_date is not YYYY-MM-DD")
        elif d > today:
            errors.append(f"{where}: source_date is in the future")
        elif (today - d).days > MAX_AGE_DAYS:
            errors.append(f"{where}: source older than {MAX_AGE_DAYS} days")
    return errors


def main(argv):
    path = Path(argv[1]) if len(argv) > 1 else DEFAULT_PATH
    facts = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    errors = validate(facts, date.today())
    for e in errors:
        print(e)
    print(f"{len(facts)} facts, {len(errors)} errors")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
