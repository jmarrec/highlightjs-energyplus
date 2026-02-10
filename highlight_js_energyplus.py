#!/usr/bin/env python
# coding: utf-8

import json
import textwrap
from pathlib import Path

from energyplus_parser.constants import BLOCK_INDENT, COMMENT_ONLY_OBJECT_NAME
from energyplus_parser.idd.idd_field import IddField
from energyplus_parser.idd.idd_file import IddFile
from energyplus_parser.idd.idd_object import IddObject

use_sample = True

ROOT_DIR = Path(__file__).parent
output_hljs_path = ROOT_DIR / "src/languages/energyplus.js"


idd_file = IddFile.load(Path("/usr/local/EnergyPlus-25-2-0/Energy+.idd"))


object_names = [o.name for o in idd_file.objects]

choice_keywords = set()
for o in idd_file.objects:
    for field in o.fields:
        if field.keys:
            # print(o.name, field.name, field.keys)
            choice_keywords |= set([k.name for k in field.keys])


litterals = ["Yes", "No"]
assert all(x in choice_keywords for x in litterals)
choice_keywords = list(choice_keywords - set(litterals))

if use_sample:
    object_names = object_names[:10]
    choice_keywords = choice_keywords[:10]

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


header = r"""/*
Language: energyplus
Description: EnergyPlus is a whole building energy simulation program that engineers, architects, and researchers use to model both energy consumption and water use in buildings.
Author: Julien Marrec <contact@effibem.com>
Website: https://energyplus.net
Category: scripting
*/

/** @type LanguageFn */
module.exports = function (hljs) {

  const regex = hljs.regex;
"""

content = header

content += """
  const COMMENT = { variants: [
    hljs.COMMENT('!-', '$', { relevance: 0 }),
    hljs.COMMENT('!', '$', { relevance: 0 }),
  ] };
"""


content += f"""
  const OBJECT_NAMES_KEYWORDS = [
    {list_to_pretty_js(object_names)}
  ];

  const CHOICE_KEYWORDS = [
    {list_to_pretty_js(choice_keywords)}
  ];

  const LITERALS = [
    {list_to_pretty_js(litterals)}
  ];

  const IDF_KEYWORDS = {{
    type: OBJECT_NAMES_KEYWORDS,
    keyword: CHOICE_KEYWORDS,
    literal: LITERALS
  }};
"""

content += r"""
  const FUNCTION = {
    className: 'function',
    begin: regex.concat(
      /^(?:\s*)/,
      `(?!${OBJECT_NAMES_KEYWORDS.join('|')})`,
      /,/
    ),
    end: /;/
  };
"""

content += r"""
  return {
    name: 'energyplus',
    aliases: [
      'idf',
      'IDF'
    ],
    case_insensitive: true,
    keywords: IDF_KEYWORDS,
    contains: [
      FUNCTION,
      COMMENT,
      {
        className: 'meta.version',
        begin: /(?:^\s*[Vv]ersion,\s*)(\d+\.\d+)/,
        relevance: 10
      }
    ]
  };
}
"""

output_hljs_path.write_text(content)
