# highlightjs-energyplus - a language grammar for highlight.js

[![version](https://badgen.net/npm/v/highlightjs-energyplus)](https://www.npmjs.com/package/highlightjs-energyplus) [![license](https://badgen.net/badge/license/MIT/blue)](https://github.com/jmarrec/highlightjs-energyplus/blob/main/LICENSE)
![install size](https://badgen.net/packagephobia/install/highlightjs-energyplus) ![minified size](https://badgen.net/bundlephobia/min/highlightjs-energyplus)

[![ci status](https://github.com/jmarrec/highlightjs-energyplus/actions/workflows/ci.yml/badge.svg)](https://github.com/jmarrec/highlightjs-energyplus/actions/workflows/ci.yml)

EnergyPlus is a whole building energy simulation program that engineers, architects, and researchers use to model both energy consumption and water use in buildings.

See [energyplus.net](https://energyplus.net).

## Usage

Simply include the Highlight.js library in your webpage or Node app, then load this module.

**TWO grammars are provided**:

- energyplus: for IDF files (would work for OpenStudio OSM mostly)
- energyplus-err: for eplusout.err files

### Static website

Simply load the module after loading Highlight.js.  You'll use the minified version found in the `dist` directory.  This module is just a CDN build of the language, so it will register itself as the Javascript is loaded.

```html
<script type="text/javascript" src="/path/to/highlight.min.js"></script>
<script type="text/javascript" src="/path/to/energyplus.min.js"></script>
<script type="text/javascript" src="/path/to/energyplus-err.min.js"></script>
<script type="text/javascript">
  hljs.highlightAll();
</script>
```

### Using directly from a CDN

#### UNPKG

```html
<script type="text/javascript"
  src="https://unpkg.com/highlightjs-energyplus@0.2.0/dist/energyplus.min.js"></script>
<script type="text/javascript"
  src="https://unpkg.com/highlightjs-energyplus@0.2.0/dist/energyplus-err.min.js"></script>
```

#### JS Delivr

```html
<script type="text/javascript"
  src="https://cdn.jsdelivr.net/gh/jmarrec/highlightjs-energyplus@0.2.0/dist/energyplus.min.js"></script>
<script type="text/javascript"
  src="https://cdn.jsdelivr.net/gh/jmarrec/highlightjs-energyplus@0.2.0/dist/energyplus-err.min.js"></script>
```

#### As a Browser ES6 Module

Note: for browser ES6 module usage, use the `@highlightjs/cdn-assets` package for highlight.js itself (see [highlight.js docs](https://github.com/highlightjs/highlight.js#browser-es6-modules)).

Here I'm importing only the `core` package and registering only energyplus language, so we minimize the size of the dependencies.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css">

<script type="module">
import hljs from 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.11.1/es/core.min.js';
// Register the energyplus language grammar
import energyplus from 'https://cdn.jsdelivr.net/gh/jmarrec/highlightjs-energyplus@0.2.0/dist/energyplus.es.min.js';
import energyplusErr from 'https://cdn.jsdelivr.net/gh/jmarrec/highlightjs-energyplus@0.2.0/dist/energyplus-err.es.min.js';
hljs.registerLanguage('energyplus', energyplus);
hljs.registerLanguage('energyplus-err', energyplusErr);

hljs.highlightAll();
</script>
```

### With Node or another build system

If you're using Node / Webpack / Rollup / Browserify, etc, simply require the language module, then register it with Highlight.js.

```javascript
var hljs = require('highlight.js/lib/core');
var energyplus = require('highlightjs-energyplus');
var energyplusErr = require('highlightjs-energyplus/src/languages/energyplus-err');

hljs.registerLanguage("energyplus", energyplus);
hljs.registerLanguage("energyplus-err", energyplusErr);
hljs.highlightAll();
```

Or with ES modules:

```javascript
import hljs from 'highlight.js/lib/core';
import energyplus from 'highlightjs-energyplus';
import energyplusErr from 'highlightjs-energyplus/src/languages/energyplus-err';

hljs.registerLanguage("energyplus", energyplus);
hljs.registerLanguage("energyplus-err", energyplusErr);
hljs.highlightAll();
```

## License

Highlight.js for energyplus is released under the MIT License. See [LICENSE](LICENSE) file for details.

Highlight.js is released under the [BSD 3-Clause License](https://github.com/highlightjs/highlight.js/blob/master/LICENSE).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, commands, and architecture details.

## Links

- The official site for the Highlight.js library is <https://highlightjs.org/>.
- The Highlight.js GitHub project: <https://github.com/highlightjs/highlight.js>
- Learn more about energyplus: <https://energyplus.net>

---

This is free software (MIT License) contributed by [EffiBEM](https://effibem.com).

![EffiBEM Logo](https://effibem.com/images/logo.png)

Leveraging software, [EffiBEM](https://effibem.com) specializes in providing new ways to streamline your workflows
and create new tools that work with limited inputs for your specific applications.
We also offer support and training services on BEM simulation engines (OpenStudio and EnergyPlus).
