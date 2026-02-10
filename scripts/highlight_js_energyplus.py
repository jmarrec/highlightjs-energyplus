#!/usr/bin/env python
# coding: utf-8

import argparse
import json
import platform
import textwrap
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

import openstudio

SCRIPTS_DIR = Path(__file__).parent
TEMPLATE_NAME = "energyplus.js.j2"
TEMPLATE_PATH = SCRIPTS_DIR / TEMPLATE_NAME
assert TEMPLATE_PATH.is_file(), f"Template file not found at path: {TEMPLATE_PATH}"

ROOT_DIR = SCRIPTS_DIR.parent

LANG_DIR = ROOT_DIR / "src" / "languages"
OUTPUT_HLJS_PATH = LANG_DIR / "energyplus.js"

if platform.system() == "Darwin":
    DEFAULT_IDD_PATH = Path("/Applications/EnergyPlus-25-2-0/Energy+.idd")
elif platform.system() == "Linux":
    DEFAULT_IDD_PATH = Path("/usr/local/EnergyPlus-25-2-0/Energy+.idd")
elif platform.system() == "Windows":
    DEFAULT_IDD_PATH = Path("C:/EnergyPlus-25-2-0/Energy+.idd")


def list_to_pretty_js(keywords, width=120):

    # Quote strings safely for JS (JSON-compatible)
    quoted = [json.dumps(k) for k in keywords]

    body = ", ".join(quoted)

    wrapped = textwrap.fill(
        body,
        initial_indent="  ",
        subsequent_indent="    ",
        width=120,
        break_long_words=False,
        break_on_hyphens=False,
    )
    return wrapped


# Get all IddFields for an IddObject
#
# @param iddObject [OpenStudio::IddObject] the IddObject to scan
# @return [Array[OpenStudio::IddField]
def get_idd_fields(iddObject: openstudio.IddObject) -> [openstudio.IddField]:
    """Get all IddFields for an IddObject.

    Parameters
    ----------
    iddObject : openstudio.IddObject
        the IddObject to scan

    Returns
    -------
    fields : List[openstudio.IddField]
    """
    num_fields = iddObject.numFields() + iddObject.properties().numExtensible
    return [iddObject.getField(i).get() for i in range(num_fields)]


def generate_highlightjs(idd_path: Path = DEFAULT_IDD_PATH, use_sample: bool = False) -> str:
    """Generate highlight.js language definition from EnergyPlus IDD file.

    Args:
        use_sample (bool): If True, use only a sample of keywords (first 10 of each).
    Returns:
        str: The generated highlight.js language definition as a string.
    """
    idd_file_ = openstudio.IddFile.load(idd_path)
    if not idd_file_.is_initialized():
        raise ValueError(f"Couldn't load {idd_path}")

    idd_file = idd_file_.get()

    object_names = []
    choice_keywords = set()

    for iddObject in idd_file.objects():
        object_names.append(iddObject.name())
        for field in get_idd_fields(iddObject=iddObject):
            if keys := field.keys():
                # print(iddObject.name(), field.name(), [k.name() for k in field.keys()])
                choice_keywords |= set([k.name() for k in keys])

    object_names = sorted(object_names)

    litterals = ["Yes", "No"]
    assert all(x in choice_keywords for x in litterals)
    # There are also a few integer choices that we want to filter out
    choice_keywords = sorted(
        choice_keywords - set(litterals) - set([str(i) for i in range(10)]) - set([f"A{i}" for i in range(10)])
    )

    if use_sample:
        # Still make sure we add object names and choice keywords used in testing
        object_names = sorted(set(["Building", "Timestep", "Version"] + object_names[:10]))
        choice_keywords = sorted(set(["Suburbs", "MinimalShadowing"] + choice_keywords[:10]))

    # Set up Jinja2 environment
    env = Environment(
        loader=FileSystemLoader(SCRIPTS_DIR),
        keep_trailing_newline=True,
    )

    template = env.get_template(TEMPLATE_NAME)

    content = template.render(
        object_names_keywords=object_names,
        choice_keywords=choice_keywords,
        litterals=litterals,
    )

    return content


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate highlight.js language definition for EnergyPlus IDF files")
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

    if not args.idd.is_file():
        raise FileNotFoundError(f"IDD file not found at path: {args.idd}")

    content = generate_highlightjs(idd_path=args.idd, use_sample=args.sample)

    OUTPUT_HLJS_PATH.write_text(content)
