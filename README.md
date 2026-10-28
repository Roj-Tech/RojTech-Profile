# RojTech Profile

Next.js 15 cybersecurity learning site with live tools:

- `/` — marketing homepage
- `/tools/password-checker` — local browser password analysis + generator
- `/tools/phishing-detector` — URL phishing heuristics (+ optional Safe Browsing)
- `/courses` — public PDF courses library
- `/admin/courses` — authenticated admin upload / publish dashboard

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`.

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_USERNAME` | No (default `admin`) | Courses admin username |
| `ADMIN_PASSWORD` | Yes for admin | Admin password (never commit this) |
| `ADMIN_PASSWORD_SHA256` | Optional | SHA-256 hex of password instead of plaintext `ADMIN_PASSWORD` |
| `SESSION_SECRET` | Yes in production (32+ chars) | Signs httpOnly admin session cookie |
| `MAX_UPLOAD_BYTES` | No | PDF max size (default 15MB) |
| `GOOGLE_SAFE_BROWSING_API_KEY` | No | Optional phishing reputation lookup |

Create the first admin by setting `ADMIN_USERNAME` + `ADMIN_PASSWORD` (or `ADMIN_PASSWORD_SHA256`) in `.env.local`. There is **no hardcoded default password**.

## Courses storage

- Metadata: `data/courses.json`
- Files: `data/uploads/`
- Drafts are private; only `published: true` resources appear on `/courses`
- PDF magic-byte validation (`%PDF-`); cover images JPEG/PNG only
- Suitable for a persistent disk host. Ephemeral platforms (some serverless) need an object store instead of local `data/` — keep credentials in env vars if you migrate storage later.

## Security notes

- Password Checker never sends passwords to the server
- Phishing Detector never opens or fetches submitted target URLs; optional Safe Browsing calls Google’s API only
- Admin routes require a signed session cookie; login is rate-limited
- Do not expose API keys in `NEXT_PUBLIC_*` variables

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
