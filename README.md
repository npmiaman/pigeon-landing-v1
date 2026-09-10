# Pigeon — landing page v1

The first Pigeon landing page, kept as it stood on 8 September 2026. Lifted out
of the monorepo at commit `0b84756`, the last one before the redesign replaced
it.

It is here for the section it was built around:

> Every generational company started by **doing things that don't scale.**
> — Paul Graham, 2013

and the fan of founder cards above it, each captioned with the hack that got
that company its first users — YouTube paying strangers $100 a video, Canva
selling school yearbooks one call at a time, the Collisons installing Stripe on
users' laptops, Airbnb's Obama O's, Drew Houston paying $40 to watch people
struggle, Reddit's own fake accounts, PayPal's eBay bot.

## Running it

```
npm install
npm run dev
```

Vite, React 19, Tailwind 4. `npm run build` produces a static `dist/` that will
host anywhere — it is a folder of files, nothing more.

## No backend

Deliberately. The original shipped with a waiting-list form behind Supabase and
a Vercel function, and proxied `/dashboard` and `/portal` through to the live
apps. None of that is in this copy:

| Gone | Was |
|---|---|
| `api/waitlist.ts` | Vercel serverless function, wrote to Postgres |
| `supabase/`, `sql/` | the waiting-list table and its migrations |
| `src/lib/supabase.ts` | browser client for the above |
| `src/pages/Waitlist.tsx` | the `/signup` form |
| `@vercel/analytics` | page beacon |
| `vercel.json` rewrites | proxies to `app.trypigeon.in`, `portal.trypigeon.in` |

Every "Join the waiting list" button now reads "Talk to the founder" and opens
the calendar — which is where its neighbour already pointed, so the pairs
collapsed to one button rather than two of the same. Outbound links live in
`src/lib/links.ts`.

The page is otherwise untouched: same sections, same copy, same numbers, same
pigeons walking along the bottom of the hero. The product frames inside it are
the real dashboard's components rendered against fixed example data in
`src/demo/data.ts` — they were always a mock, and they still fetch nothing.
