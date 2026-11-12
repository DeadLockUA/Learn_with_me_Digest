"""Local preview of the duck widget without Jekyll (no Ruby needed).

  python tools/duck/preview_server.py [--port 4000] [--facts PATH | --facts-missing]

Serves the repo root; /assets/duck/facts.json is rendered from YAML the way the
Liquid template does it. Open http://localhost:4000/tools/duck/preview.html
"""
import argparse
import json
from datetime import date
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]


class Handler(SimpleHTTPRequestHandler):
    facts_path = ROOT / "_data" / "duck_facts.yml"
    facts_missing = False

    def do_GET(self):
        if self.path.split("?")[0] == "/assets/duck/facts.json":
            if self.facts_missing:
                self.send_error(404)
                return
            facts = yaml.safe_load(self.facts_path.read_text(encoding="utf-8")) or []
            for f in facts:
                if isinstance(f.get("source_date"), date):
                    f["source_date"] = f["source_date"].isoformat()
            body = json.dumps(facts).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=4000)
    p.add_argument("--facts")
    p.add_argument("--facts-missing", action="store_true")
    a = p.parse_args()
    if a.facts:
        Handler.facts_path = Path(a.facts)
    Handler.facts_missing = a.facts_missing
    server = ThreadingHTTPServer(("127.0.0.1", a.port), partial(Handler, directory=str(ROOT)))
    print(f"http://localhost:{a.port}/tools/duck/preview.html", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
