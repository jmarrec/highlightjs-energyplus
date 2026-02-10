'use strict';

const fs = require('fs');
const hljs = require("highlight.js/lib/core");
const yourLanguage = require("../../src/languages/energyplus");
const path = require('path');
const utility = require('../utility');

const languageName = "energyplus";

hljs.debugMode();
hljs.registerLanguage(languageName, yourLanguage);

describe('hljs.highlightAuto()', () => {
  const languagePath = utility.buildPath('detect', languageName);

  const filenames = fs.readdirSync(languagePath)
    .filter(f => !f.startsWith('.'));

  filenames.forEach(function(example) {
    it(`should detect ${example} as ${languageName}`, async() => {
      const filename = path.join(languagePath, example);
      const content = await fs.promises.readFile(filename, 'utf-8');
      const detectedLanguage = hljs.highlightAuto(content).language;

      detectedLanguage.should.equal(languageName,
        `${example} should be detected as ${languageName}, but was ${detectedLanguage}`);
    });
  });
});
