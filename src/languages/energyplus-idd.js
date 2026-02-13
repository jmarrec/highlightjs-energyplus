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

  // Object-level annotations (apply to the whole object, appear before fields)
  const OBJECT_ANNOTATION = {
    className: 'built_in',
    begin: /\\(?:unique-object|required-object|obsolete|format)\b/,
    relevance: 5
  };

  const OBJECT_EXTENSIBLE = {
    className: 'title.function',
    begin: /\\(?:min-fields|begin-extensible|extensible:\s*\d+)\b/,
    relevance: 5
  };

  // Field-level annotations that affect field behavior
  const FIELD_KEYWORD = {
    className: 'keyword',
    begin: /\\(?:default|required-field|autosizable|autocalculatable|deprecated|key)\b/,
    relevance: 5
  };

  // \type annotation — defines the field data type, value styled as strong
  const FIELD_TYPE = {
    begin: [
      /\\type/,
      /\s+/,
      /\S+/
    ],
    beginScope: {
      1: 'type',
      3: 'strong'
    },
    relevance: 5
  };

  // \reference, \reference-class-name, \object-list, \external-list with value as link
  const FIELD_REFERENCE = {
    begin: [
      /\\(?:reference-class-name|reference|object-list|external-list)/,
      /\s+/,
      /\S+/
    ],
    beginScope: {
      1: 'attribute',
      3: 'link'
    },
    relevance: 2
  };

  // Field-level metadata annotations
  const FIELD_ATTRIBUTE = {
    className: 'attribute',
    begin: /\\(?:minimum>?|maximum<?|units|ip-units|unitsBasedOnField|retaincase)\b/,
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
      OBJECT_ANNOTATION,
      OBJECT_EXTENSIBLE,
      FIELD_KEYWORD,
      FIELD_TYPE,
      FIELD_REFERENCE,
      FIELD_ATTRIBUTE,
      FIELD_ID,
      OBJECT_CLASS,
      NUMBER
    ]
  };
};
