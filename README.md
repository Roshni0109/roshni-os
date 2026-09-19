# RoshniOS

A pixel-art, macOS-style desktop portfolio for Roshni Multani — AI / full-stack engineer.

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no dependencies.

## Features

- Boot screen → draggable, stackable, minimize/maximize windows
- Desktop icons for each project, résumé, skills, experience and contact
- Pixel character with a rotating "thought bubble" (Web Audio–synthesised 8-bit sound effects)
- Dock with quick links to GitHub, LinkedIn and the live Hugging Face demo
- "Rejected Concepts" trash-can easter egg
- Wallpaper cycling, sound toggle, all persisted to `localStorage`

## Run locally

No build step — just serve the folder statically, e.g.:

```bash
python -m http.server 4611
```

Then open http://localhost:4611. (Opening `index.html` directly via `file://` also works.)

## Deploy

Static site, zero config. Works on Vercel, Netlify, GitHub Pages, Cloudflare Pages — point any of them at this repo root with no build command and no output directory override needed.

## Structure

```
index.html    entry point / markup
style.css     all styling (pastel theme, pixel windows, responsive rules)
script.js     window manager, content data, sound synth, interactions
assets/       résumé PDF served to the "Resume.pdf" window
```
