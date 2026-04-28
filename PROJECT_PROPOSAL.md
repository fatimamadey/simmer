# Project Proposal: Simmer

## One-Line Description
A social cooking app where you share recipes, rate your dishes on a 10-point scale, and follow your friends' cooking journeys — the good, the bad, and the burnt.

## The Problem
There's no dedicated social app for home cooking that feels personal. Recipe apps are databases, not communities. Instagram is too polished and generic — people only post their wins. Nobody has built the place where you post your 3/10 disaster alongside your 10/10 masterpiece, where friends try your recipes and tag you with their own results, and where cooking feels like a shared journey rather than a performance. Everyone cooks to survive — Simmer makes it social.

## Target User
Friends who cook — college students, young professionals, and anyone who wants to share what they're making and discover what the people they know are eating. The first 10 users are classmates and friends who already text each other photos of their meals. Simmer gives that behavior a home.

## Core Features (v1)
1. **User authentication** — sign up, log in, create a profile
2. **Recipe posts** — upload a photo, rate your dish (1-10 scale), add notes, and include the full recipe (ingredients + steps). The feed shows the photo, rating, and notes; tap in to see the full recipe.
3. **Social feed** — see what the people you follow are cooking, newest first
4. **User profiles** — browse someone's cooking history and ratings
5. **Find friends** — search by username and share invite links

## Tech Stack
- Frontend: **Next.js** (PWA) — already experienced with it, works in mobile browsers, and people at the project fair can access it by scanning a QR code with no app install required
- Styling: **Tailwind CSS** — fast to iterate on, pairs well with Next.js
- Database: **Supabase** (Postgres) — handles database, image storage (Supabase Storage for recipe photos), and real-time capabilities if needed
- Auth: **Clerk** — quick to set up, handles sign-up/log-in so time is spent on product features
- APIs: None required for v1. Potential future integrations: image compression service, nutrition API
- Deployment: **Vercel** — seamless with Next.js, instant deploys, shareable URL for the project fair
- MCP Servers: **Supabase MCP** (database management and migrations), **Playwright MCP** (testing the app in-browser during development)

## Stretch Goals
- **"Try and Tag" mechanic** — when you cook a friend's recipe, tag them in your post. The original recipe accumulates a community rating alongside the creator's own rating. This is Simmer's most unique social feature.
- **Dual rating display** — show both the creator's rating and the average rating from people who tried it
- **Comments or reactions** on posts
- **PWA install prompt** — "Add to Home Screen" so it feels like a native app
- **Phone contacts sync** — find friends already on Simmer
- **Recipe search and filtering** — by rating, ingredient, or tag
- **Cooking stats on profiles** — number of recipes posted, average rating, most-tried recipe

## Biggest Risk
**Making it feel distinct from Instagram.** If the feed is just photos with captions, people will ask "why not post this on your story?" The rating system, recipe structure, and "try and tag" mechanic are the differentiators on paper — but the design and vibe need to reinforce that this is its own thing. Simmer celebrates the journey (including the failures), not just the highlight reel. That philosophy needs to come through in every design decision — the layout, the tone, the way ratings are displayed, the way ugly food is welcomed, not hidden.

## Week 5 Goal
A deployed web app where a user can:
- Sign up and log in
- Create a recipe post with a photo, 10-point rating, notes, and full recipe (ingredients + steps)
- View a feed of all posts
- This is the core loop: post, browse, repeat. No social graph yet — that comes in week 2. The goal is to prove the posting and feed experience feels good before layering on social features.
