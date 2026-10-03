# CircuitSparks

Website for CircuitSparks, a student-founded, youth-led 501(c)(3) bringing free, hands-on electronics workshops to middle schoolers.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Design system

Modeled closely on [cube.computer](https://cube.computer/). Live reference at [`/design-system`](http://localhost:3000/design-system) (not indexed).

- **Tokens** live in `src/app/globals.css` (`@theme`). White paper, ink text and rules, `sky` (#b6dbe1) as the brand accent, `signal` (#35808d) for accent text.
- **Layout unit:** `<Chapter num title lede>`: an ink rule, a number in the left rail, a two-line title with a short lede, then content. Every page is a `PageIntro` followed by chapters and the `Outro`.
- **Visuals:** `<Shot gradient="tide | horizon | depth" label="…" />` frames a placeholder in one of the brand gradients (extracted from the Odyssey boards by `scripts/extract-gradients.py`). Replace the placeholder with photography later.
- **Rules:** no shadows, regular-weight headings, short copy. Motion is a single fade-up on scroll, disabled for reduced motion.

## Content

- Organization settings (domain, emails, GoFundMe link): `src/lib/site.ts`
- Tiers, FAQ, facts, and other repeated copy: `src/lib/content.ts`
- Form fields: `src/lib/forms.ts`

## Before launch

- [ ] Confirm domain, inboxes, and the GoFundMe URL in `src/lib/site.ts`
- [ ] Set `FORMS_WEBHOOK_URL` (see `.env.example`)
- [ ] Review drafted copy, especially tier names and topics, governance, and sponsorship tiers
- [ ] Replace placeholders with photography, and add team names on `/about`
- [ ] Add a privacy policy (the registration form collects information about minors)

## Icons

`node scripts/generate-icons.mjs` regenerates the favicon and app icons from `public/logo-black.svg`.
