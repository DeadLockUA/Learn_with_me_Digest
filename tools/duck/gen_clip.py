"""Generate duck widget assets through OpenRouter.

  python tools/duck/gen_clip.py frame --model <image model> --out start.png
  python tools/duck/gen_clip.py video --model <video model> --reaction idle \
      --first start.png [--last start.png] --out idle.mp4

The API key is read from .env (OPENROUTER_API_KEY) and never printed.
"""
import argparse
import base64
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REFERENCE = ROOT / "assets" / "images" / "mascot" / "duck-reference.png"
API = "https://openrouter.ai/api/v1"

CHARACTER = (
    "Classic yellow rubber duck bath toy: smooth glossy vinyl, rounded body, flat bottom, "
    "no legs, no feet, no arms (small wing nubs only). Expressive face with large eyes, "
    "eyebrows and an orange beak that can open. Sleek modern AR glasses with a small cyan LED "
    "on the frame, projecting a small glowing cyan holographic panel beside its head. "
    "Modern stylized 3D illustration, warm soft light on the duck."
)
BACKGROUND = (
    "Plain flat solid off-white background (#fdfdfd) filling the whole frame, no desk, "
    "no props, no scenery, no shadows on the background, no text."
)
NO_LOGOS = "Avoid any logos or trademarked brand marks."

REACTIONS = {
    "idle": ("?", "The duck sits calmly and breathes gently, blinks once, the hologram flickers "
                  "softly. Very subtle motion so the clip loops seamlessly."),
    "surprised": ("!", "The duck's eyes widen, eyebrows jump up, beak opens in amazement, a small "
                       "startled hop, then it settles back to the calm pose."),
    "laughing": ("?", "The duck laughs: beak open, eyes squeezed into happy arcs, body wobbles with "
                      "laughter, then it settles back to the calm pose."),
    "nodding": ("check mark", "The duck nods twice approvingly with a pleased smile, then settles "
                              "back to the calm pose."),
    "thinking": ("?", "The duck tilts its head, looks up thoughtfully, eyebrows knitted, then "
                      "settles back to the calm pose."),
    "facepalm": ("!", "The duck raises one small wing nub to cover its eyes in a facepalm, shakes "
                      "its head slightly, lowers the wing, then settles back to the calm pose."),
    "shrugging": ("?", "The duck lifts both small wing nubs in a shrug with a puzzled half-smile, "
                       "lowers them, then settles back to the calm pose."),
}


def api_key():
    for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENROUTER_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    sys.exit("OPENROUTER_API_KEY missing in .env")


def data_url(path):
    data = Path(path).read_bytes()
    # Image models may return WebP/JPEG under any name; label by real content, not extension.
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        mime = "image/webp"
    elif data[:3] == b"\xff\xd8\xff":
        mime = "image/jpeg"
    else:
        mime = "image/png"
    return f"data:{mime};base64," + base64.b64encode(data).decode()


def request(method, url, body=None, raw=False):
    req = urllib.request.Request(
        url, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {api_key()}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            data = r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode(errors='replace')[:800]}")
    return data if raw else json.loads(data)


def find_image(obj):
    """Return image bytes from an images-API response (b64 or URL), searching recursively."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("b64_json", "b64") and isinstance(v, str):
                return base64.b64decode(v)
            if isinstance(v, str) and v.startswith("data:image"):
                return base64.b64decode(v.split(",", 1)[1])
            if k == "url" and isinstance(v, str) and v.startswith("http"):
                with urllib.request.urlopen(v, timeout=120) as r:
                    return r.read()
            found = find_image(v)
            if found:
                return found
    if isinstance(obj, list):
        for v in obj:
            found = find_image(v)
            if found:
                return found
    return None


def cmd_frame(a):
    prompt = (
        "Use the attached reference image as the exact character design: the same yellow rubber "
        f"duck with the same AR glasses. {CHARACTER} New image: the whole duck centered, facing "
        "the viewer at a slight three-quarter angle, filling about 70% of a square frame, calm "
        "neutral expression, beak closed, the hologram panel shows a question mark. "
        f"{BACKGROUND} {NO_LOGOS}"
    )
    body = {"model": a.model, "prompt": prompt,
            "input_references": [{"type": "image_url", "image_url": {"url": data_url(REFERENCE)}}]}
    img = find_image(request("POST", f"{API}/images", body))
    if not img:
        sys.exit("no image in response")
    Path(a.out).write_bytes(img)
    print(f"saved {a.out}")


def cmd_video(a):
    panel, motion = REACTIONS[a.reaction]
    prompt = (
        f"{CHARACTER} {motion} The hologram panel shows a {panel}. Static camera, no zoom, no cut, "
        f"the duck stays centered. The clip starts and ends on the same calm pose. {BACKGROUND} "
        f"{NO_LOGOS}"
    )
    frames = [{"type": "image_url", "image_url": {"url": data_url(a.first)}, "frame_type": "first_frame"}]
    if a.last:
        frames.append({"type": "image_url", "image_url": {"url": data_url(a.last)}, "frame_type": "last_frame"})
    body = {"model": a.model, "prompt": prompt, "duration": a.duration, "resolution": a.resolution,
            "aspect_ratio": a.aspect, "frame_images": frames}
    if a.no_audio:
        body["generate_audio"] = False
    job = request("POST", f"{API}/videos", body)
    url = job.get("polling_url") or f"{API}/videos/{job['id']}"
    print(f"job {job.get('id')} submitted", flush=True)
    deadline = time.time() + 900
    while time.time() < deadline:
        time.sleep(15)
        st = request("GET", url)
        status = st.get("status")
        if status == "completed":
            Path(a.out).write_bytes(request("GET", f"{API}/videos/{job['id']}/content?index=0", raw=True))
            print(f"saved {a.out}")
            return
        if status in ("failed", "cancelled", "expired"):
            sys.exit(f"job {status}: {json.dumps(st)[:600]}")
    sys.exit("timeout")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    f = sub.add_parser("frame")
    f.add_argument("--model", required=True)
    f.add_argument("--out", required=True)
    v = sub.add_parser("video")
    v.add_argument("--model", required=True)
    v.add_argument("--reaction", required=True, choices=sorted(REACTIONS))
    v.add_argument("--first", required=True)
    v.add_argument("--last")
    v.add_argument("--out", required=True)
    v.add_argument("--duration", type=int, default=4)
    v.add_argument("--resolution", default="720p")
    v.add_argument("--aspect", default="1:1")
    v.add_argument("--no-audio", action="store_true")
    a = p.parse_args()
    {"frame": cmd_frame, "video": cmd_video}[a.cmd](a)


if __name__ == "__main__":
    main()
