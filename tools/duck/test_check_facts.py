from datetime import date, timedelta

from check_facts import validate

TODAY = date(2026, 11, 12)


def fact(**over):
    base = {
        "text": "LLMs can confidently cite papers that do not exist.",
        "source_url": "https://example.org/paper",
        "source_title": "Example paper",
        "source_date": TODAY - timedelta(days=10),
        "reaction": "facepalm",
    }
    base.update(over)
    return base


def test_valid_fact_passes():
    assert validate([fact()], TODAY) == []


def test_date_as_string_accepted():
    assert validate([fact(source_date="2026-11-01")], TODAY) == []


def test_missing_field():
    f = fact()
    del f["source_url"]
    errors = validate([f], TODAY)
    assert errors and "source_url" in errors[0]


def test_unknown_reaction():
    assert validate([fact(reaction="dancing")], TODAY)


def test_all_six_reactions_allowed():
    for r in ["surprised", "laughing", "nodding", "thinking", "facepalm", "shrugging"]:
        assert validate([fact(reaction=r, text=f"Fact for {r}.")], TODAY) == []


def test_too_old():
    assert validate([fact(source_date=TODAY - timedelta(days=184))], TODAY)
    assert validate([fact(source_date=TODAY - timedelta(days=183))], TODAY) == []


def test_future_date():
    assert validate([fact(source_date=TODAY + timedelta(days=1))], TODAY)


def test_bad_date():
    assert validate([fact(source_date="not-a-date")], TODAY)


def test_text_too_long():
    assert validate([fact(text="x" * 161)], TODAY)
    assert validate([fact(text="x" * 160)], TODAY) == []


def test_url_not_https():
    assert validate([fact(source_url="http://example.org")], TODAY)


def test_markdown_in_text():
    assert validate([fact(text="This is **bold**.")], TODAY)
    assert validate([fact(text="See [this](https://x.org).")], TODAY)


def test_duplicate_text():
    assert validate([fact(), fact()], TODAY)


def test_top_level_must_be_list():
    assert validate({"a": 1}, TODAY)
