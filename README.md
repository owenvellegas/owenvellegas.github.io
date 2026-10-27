# Owen Vellegas — Portfolio

Interactive desktop portfolio with Experience, Education, Skills, and Resume pages. Included apps: Wallpapers, Calculator, Calendar, Notes, Focus, and 2048.

## Run locally

Use Node.js 24 and pnpm 10.12.3.

```sh
pnpm install
pnpm dev
```

## Build and check

```sh
pnpm check
pnpm test
pnpm build
pnpm serve
```

Deploy the generated `dist` directory to a static host at the domain root.

## Project structure

- `src/components/apps/Profile`: resume content and portfolio views.
- `src/state/window-manager.ts`: window lifecycle and focus rules.
- `src/components/apps`: independent apps and their domain logic.
- `src/css`: shared theme and design values.
- `public`: resume, logos, icons, and sounds.
- `tests`: behavior and regression checks.
- `docs/MANUAL_TESTING.md`: browser interaction checklist.

Notes, timers, game progress, and settings save in browser-local storage. They do not sync between devices.

Licensing terms are in `LICENSE`.
