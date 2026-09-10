# Pigeon — landing page v0

The first Pigeon landing page ever committed, 7 August 2026, at `9c6fe00`.

One screen. That is the whole site: the logo, a headline, Paul Graham's photo
with a hand-drawn arrow pointing at the quote, a fan of seven founder cards,
one line of copy, two links, and an email you can copy.

The headline read:

> Pigeon is the world's first agent built to help founders
> **do things that don't scale.**

and the line under the fan:

> Every generational company started by doing things that didn't scale.
> Pigeon gives you an AI coworker to do the same, only faster.

Hover any card and its story pops up on a blue bubble — the hack that got that
company its first users. Hover Paul Graham and the quote lights up sky blue.

## Running it

```
npm install
npm run dev
```

## No backend

None to remove. This commit predates the waiting list by a few hours — the
Supabase table, the `/signup` form and the serverless function all arrived
later the same day, in `c9d4298`. Everything here is a static file.

The only change from the original: the two call-to-action links were `href="#"`
placeholders that went nowhere. They now point at the founder's calendar and at
the Paul Graham essay. Nothing else has been touched.
