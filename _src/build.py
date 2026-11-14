#!/usr/bin/env python3
"""Build the static HTML prototype.

Usage (from anywhere):
    python3 -I files/design/_src/build.py

Renders every template in _src/templates/pages/ to files/design/<name>.html
and one service-detail page per entry in data.SERVICES.
"""
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
OUT = SRC.parent
sys.path.insert(0, str(SRC))

from jinja2 import Environment, FileSystemLoader, StrictUndefined  # noqa: E402
from markupsafe import Markup  # noqa: E402

import data  # noqa: E402
from icons import icon as _icon  # noqa: E402


def icon(name, size=20, cls="", stroke_width=1.75, label=None):
    return Markup(_icon(name, size, cls, stroke_width, label))


env = Environment(
    loader=FileSystemLoader(str(SRC / "templates")),
    autoescape=True,
    trim_blocks=True,
    lstrip_blocks=True,
    undefined=StrictUndefined,
)
env.globals.update(
    icon=icon,
    SITE=data.SITE,
    PAGES=data.PAGES,
    SERVICES=data.SERVICES,
    SERVICES_BY_SLUG=data.SERVICES_BY_SLUG,
    ENGAGEMENTS=data.ENGAGEMENTS,
    SUPPORT_PLANS=data.SUPPORT_PLANS,
    PROCESS=data.PROCESS,
    COMMITMENTS=data.COMMITMENTS,
    CASES=data.CASES,
    CASES_BY_SLUG=data.CASES_BY_SLUG,
    CASE_FILTERS=data.CASE_FILTERS,
    TESTIMONIALS=data.TESTIMONIALS,
    LOGOS=data.LOGOS,
    HOME_FAQ=data.HOME_FAQ,
    JOBS=data.JOBS,
    TEAM=data.TEAM,
)


def render(template, out_name, **ctx):
    ctx.setdefault("out_file", out_name)
    html = env.get_template(template).render(**ctx)
    (OUT / out_name).write_text(html, encoding="utf-8")
    print(f"  built {out_name}")


def main():
    print("Building Xubitar prototype →", OUT)
    for tpl in sorted((SRC / "templates" / "pages").glob("*.html")):
        render(f"pages/{tpl.name}", tpl.name)
    for svc in data.SERVICES:
        render("service.html", svc["file"], svc=svc)


if __name__ == "__main__":
    main()
