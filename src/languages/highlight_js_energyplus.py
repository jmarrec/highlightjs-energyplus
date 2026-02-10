#!/usr/bin/env python
# coding: utf-8

import argparse
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from energyplus_parser.idd.idd_file import IddFile


SCRIPT_DIR = Path(__file__).parent
TEMPLATE_PATH = SCRIPT_DIR / "energyplus.js.j2"
OUTPUT_HLJS_PATH = SCRIPT_DIR / "energyplus.js"
DEFAULT_IDD_PATH = Path("/Applications/EnergyPlus-25-2-0/Energy+.idd")


def generate_highlightjs(idd_path: Path = DEFAULT_IDD_PATH, sample: bool = False):
    """Generate highlight.js language definition from EnergyPlus IDD file."""
    idd_file = IddFile.load(idd_path)

    object_names = [o.name for o in idd_file.objects]

    choice_keywords = set()
    for o in idd_file.objects:
        for field in o.fields:
            if field.keys:
                choice_keywords |= set([k.name for k in field.keys])

    literals = ["Yes", "No"]
    assert all(x in choice_keywords for x in literals)
    choice_keywords = list(choice_keywords - set(literals))

    if sample:
        object_names = object_names[:10]
        choice_keywords = choice_keywords[:10]

    # Set up Jinja2 environment
    env = Environment(
        loader=FileSystemLoader(SCRIPT_DIR),
        keep_trailing_newline=True,
    )

    template = env.get_template("energyplus.js.j2")

    content = template.render(
        OBJECT_NAMES_KEYWORDS=object_names,
        CHOICE_KEYWORDS=choice_keywords,
    )

    OUTPUT_HLJS_PATH.write_text(content)
    print(f"Generated {OUTPUT_HLJS_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate highlight.js language definition for EnergyPlus IDF files"
    )
    parser.add_argument(
        "--sample",
        action="store_true",
        help="Use only a sample of keywords (first 10 of each)",
    )
    parser.add_argument(
        "--idd",
        type=Path,
        default=DEFAULT_IDD_PATH,
        help=f"Path to Energy+.idd file (default: {DEFAULT_IDD_PATH})",
    )
    args = parser.parse_args()

    generate_highlightjs(idd_path=args.idd, sample=args.sample)
