# CONTRIBUTING

## Project Overview

A highlight.js plugin providing grammars for Energyplus.

It contains several language grammars:

- **energyplus** — for EnergyPlus IDF files (auto-generated)
- **energyplus-err** — for EnergyPlus error files (`eplusout.err`) (hand-written)

## Commands

| Task                           | Command                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------- |
| Run all tests                  | `npm test`                                                                       |
| Run markup tests only          | `npm run test-markup`                                                            |
| Run detect tests only          | `npm run test-detect`                                                            |
| Lint                           | `npm run lint`                                                                   |
| Regenerate energyplus grammar  | `python scripts/highlight_js_energyplus.py`                                      |
| Regenerate markup expected     | `FIX_FAILING=1 npx mocha test/markup` (run twice: first generates, 2nd verifies) |
| Build dist (CDN)               | See [Build / dist](#build--dist) below                                           |

## Architecture

### Code generation

`src/languages/energyplus.js` is **auto-generated** — never edit it directly.
It is produced by `scripts/highlight_js_energyplus.py` using the Jinja template `scripts/energyplus.js.j2`.
To change the energyplus grammar, edit the Python script or Jinja template, then regenerate.

`src/languages/energyplus-err.js` is hand-written and can be edited directly.

### Build / dist

This repo is symlinked into `../highlight.js/extra/highlightjs-energyplus`. To regenerate the `dist/` files:

```bash
cd ../highlight.js && node tools/build.js -t cdn
```

To release

```bash
npm version patch # minor, major
git push --follow-tags
```


Entr watch to automatically generate when testing stuff

```
cd ../highlight.js
fd .js extra/highlightjs-energyplus/src/languages/ | entr -s -p "node ./tools/build.js -t cdn && node ./tools/build.js -t browser"
```

### ESLint rules

`eslint.config.js` enforces formatting on `src/languages/*.js`:

- `array-bracket-spacing`: always (e.g. `[ item ]`)
- `object-curly-newline`: multi-line when ≥2 properties
- `object-property-newline`: each property on its own line

### Tests

Tests live under `test/` with subdirectories `markup/` and `detect/`, each containing `energyplus/` and `energyplus-err/` folders.
