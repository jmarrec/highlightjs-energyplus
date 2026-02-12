/*
Language: energyplus-err
Description: EnergyPlus eplusout.err log file format with severity-tagged messages.
Author: Julien Marrec <contact@effibem.com>
Website: https://energyplus.net
Category: logs
*/

/** @type LanguageFn */
// eslint-disable-next-line no-unused-vars
module.exports = function (hljs) {

  const NUMBER = {
    className: 'number',
    begin: /\b-?\d+\.?\d*(E[+-]?\d+)?\b/i,
    relevance: 0
  };

  const PROGRAM_VERSION = {
    className: 'meta',
    begin: /^Program Version,EnergyPlus/,
    end: /$/,
    relevance: 1000
  };

  const INFO_LINE = {
    className: 'comment',
    begin: /^\s*\*{13,}/,
    end: /$/,
    contains: [
      {
        className: 'addition',
        begin: /EnergyPlus Completed Successfully/
      },
      {
        className: 'deletion',
        begin: /EnergyPlus Terminated--Fatal Error Detected/
      },
      {
        className: 'string',
        begin: /\d+\s+Warning/
      },
      {
        className: 'keyword',
        begin: /\d+\s+Severe/
      }
    ],
    relevance: 0
  };

  const CONTINUATION = {
    className: 'comment',
    begin: /^\s*(?:\*{13,}\s*)?\*\*\s+~~~\s+\*\*/,
    end: /$/,
    relevance: 0
  };

  const FATAL = {
    begin: [
      /^\s*(?:\*{13,}\s*)?/,
      /\*\*\s+Fatal\s+\*\*/
    ],
    beginScope: { 2: 'title' },
    end: /$/,
    contains: [ NUMBER ],
    relevance: 10
  };

  const SEVERE = {
    begin: [
      /^\s*(?:\*{13,}\s*)?/,
      /\*\*\s+Severe\s+\*\*/
    ],
    beginScope: { 2: 'keyword' },
    end: /$/,
    contains: [ NUMBER ],
    relevance: 10
  };

  const WARNING = {
    begin: [
      /^\s*(?:\*{13,}\s*)?/,
      /\*\*\s+Warning\s+\*\*/
    ],
    beginScope: { 2: 'string' },
    end: /$/,
    contains: [ NUMBER ],
    relevance: 5
  };

  return {
    name: 'energyplus-err',
    aliases: [ 'eplus-err' ],
    case_insensitive: false,
    contains: [
      PROGRAM_VERSION,
      CONTINUATION,
      FATAL,
      SEVERE,
      WARNING,
      INFO_LINE
    ]
  };
};
