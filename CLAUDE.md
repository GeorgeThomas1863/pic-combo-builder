# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # start with nodemon (auto-restarts on changes), port 1863
node app.js      # run without nodemon
```

No test suite or linter configured.

## What This App Does

A local web tool that takes a folder of images, groups them by a delimiter in their filenames, and combines each group into a PNG grid composition using the `canvas` library. The UI is a simple form where you enter an input path, output path, and delimiter character.

**Grouping by delimiter:** Given delimiter `_`, files like `photo_001.jpg`, `photo_002.jpg` → group `photo`. The group name is everything before the *last* occurrence of the delimiter in the filename.

**Composition count** is determined by how many images are in the group (thresholds in `config/config.js → typeArray`):
- >27 images → 3 compositions, random selection of 27
- >22 images → 3 compositions, all images
- >18 images → 2 compositions, random selection of 18
- >12 images → 2 compositions, all images
- ≤12 images → 1 composition (last 9 images used)

Each composition renders up to 9 images in a 3-column grid at 1400×975px (1400×950 canvas + 25px title bar).

## Architecture

```
app.js                   Express entry, port 1863
config/config.js         All tuneable constants (canvas dims, thresholds, port)
routes/routes.js         POST /get-backend-data, GET /, 404/500
controllers/
  data-controller.js     Receives form POST, sets state.active, calls runCombinePics
  display-controller.js  Serves HTML files
src/
  state.js               { active: boolean } — shared mutable stop flag
  util.js                Dir scan, extension filter, grouping by delimiter, sort by number
  pics-format.js         Decides composition count and splits pic array accordingly
  combine-pics.js        Orchestrates: validate paths → group → format → render → save
  pics-canvas.js         node-canvas rendering: grid layout, aspect-ratio-preserving fit
public/js/
  define-things.js       DOM element refs (d object)
  api-front.js           fetch wrapper (sendToBack)
  responsive.js          Click handlers for submit/stop buttons
```

**Stop mechanism:** `state.active` is checked at nearly every async step. The stop button POSTs `{ command: "stop" }` to `/get-backend-data`, which sets `state.active = false` and returns immediately, causing the in-progress `runCombinePics` loop to bail out on its next check.

**ESM throughout:** `"type": "module"` in `package.json`. All imports use `.js` extensions.
