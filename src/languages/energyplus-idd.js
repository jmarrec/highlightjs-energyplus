/*
Language: energyplus-idd
Description: EnergyPlus Input Data Dictionary (IDD) format defining object schemas, fields, and metadata.
Author: Julien Marrec <contact@effibem.com>
Website: https://energyplus.net
Category: config
*/

/** @type LanguageFn */
// eslint-disable-next-line no-unused-vars
module.exports = function (hljs) {

  const NUMBER = {
    className: 'number',
    begin: /\b-?\d+\.?\d*(E[+-]?\d+)?\b/i,
    relevance: 0
  };

  // The contiguous ! block at the top of the file
  const HEADER_BLOCK = {
    className: 'meta',
    begin: /^(?=!)/,
    end: /\n(?!\s*!)/,
    contains: [
      {
        className: 'built_in',
        begin: /^!IDD_Version\b.*/,
        relevance: 1000
      },
      {
        className: 'keyword',
        begin: /^!IDD_BUILD\b.*/,
        relevance: 10
      }
    ],
    relevance: 5
  };

  const GROUP = {
    className: 'section',
    begin: /^\\group\b/,
    end: /$/,
    relevance: 10
  };

  // \memo and \note: treat the entire rest of line as a comment
  const MEMO_NOTE = {
    className: 'comment',
    begin: /\\(?:memo|note)\b/,
    end: /$/,
    relevance: 0
  };

  // \field with its name highlighted separately
  const FIELD_ANNOTATION = {
    begin: [
      /\\field/,
      /\s+/,
      /[^\n]+/
    ],
    beginScope: {
      1: 'keyword',
      3: 'string'
    },
    relevance: 5
  };

  // Important annotations that affect field behavior
  const IMPORTANT_ANNOTATION = {
    className: 'keyword',
    begin: /\\(?:default|required-field|autosizable|autocalculatable|begin-extensible|deprecated|key|unique-object|required-object|obsolete)\b/,
    relevance: 5
  };

  // Minor metadata annotations
  const MINOR_ANNOTATION = {
    className: 'attribute',
    begin: /\\(?:type|minimum>?|maximum<?|units|ip-units|unitsBasedOnField|retaincase|object-list|reference-class-name|reference|external-list|format|min-fields|extensible:\d+)\b/,
    relevance: 2
  };

  // Field identifiers: A1, N1, A2, N2, etc.
  const FIELD_ID = {
    className: 'variable',
    begin: /\b[AN]\d+\b/,
    relevance: 5
  };

  // Object class name: alphanumeric (with colons) at start of line, followed by ,
  const OBJECT_CLASS = {
    className: 'title',
    begin: /^[A-Za-z][A-Za-z0-9:._-]*/,
    end: /,/,
    excludeEnd: true,
    relevance: 5
  };

  return {
    name: 'energyplus-idd',
    aliases: [
      'idd',
      'eplus-idd'
    ],
    case_insensitive: false,
    contains: [
      HEADER_BLOCK,
      GROUP,
      MEMO_NOTE,
      FIELD_ANNOTATION,
      IMPORTANT_ANNOTATION,
      MINOR_ANNOTATION,
      FIELD_ID,
      OBJECT_CLASS,
      NUMBER
    ]
  };
};
