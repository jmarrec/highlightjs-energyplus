'use strict';

const fs = require('fs').promises;
const glob = require('glob');
const hljs = require("highlight.js/lib/core");
const energyplus = require("../../src/languages/energyplus");
const energyplusErr = require("../../src/languages/energyplus-err");
const energyplusIdd = require("../../src/languages/energyplus-idd");
const path = require('path');
const utility = require('../utility');

hljs.debugMode();
hljs.registerLanguage("energyplus", energyplus);
hljs.registerLanguage("energyplus-err", energyplusErr);
hljs.registerLanguage("energyplus-idd", energyplusIdd);

function describeMarkup(languageName) {
  describe("highlight " + languageName, () => {
    const filePath = utility.buildPath('markup', languageName, '*.expect.txt');
    const filenames = glob.sync(filePath, { windowsPathsNoEscape: true }).sort();

    filenames.forEach(function(filename) {
      const testName = path.basename(filename, '.expect.txt');
      const sourceName = filename.replace(/\.expect/, '');

      it(`should markup ${testName}`, function(done) {
        const sourceFile = fs.readFile(sourceName, 'utf-8');
        const expectedFile = fs.readFile(filename, 'utf-8');

        Promise.all([sourceFile, expectedFile]).then(function([source, expected]) {
          const actual = hljs.highlight(source, { language: languageName }).value;

          if (process.env.FIX_FAILING) {
            require('fs').writeFileSync(filename, actual);
          }

          actual.trim().should.equal(expected.trim());
          done();
        }).catch(function(err) { return done(err) });
      });
    });
  });
}

describeMarkup("energyplus");
describeMarkup("energyplus-err");
describeMarkup("energyplus-idd");
