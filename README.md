# Beloved Kindness Maxcare

Next.js App Router website with Sanity Studio, Neon donation records, Paystack test checkout and Resend enquiry emails.

## Local development
Use Node.js 24.x. Run npm ci, copy .env.example to .env.local and fill it with your own settings, then run npm run dev.
Studio is available at /admin. Published CMS content is cached for 60 seconds.

## Checks
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm start (serves the production build)

Tests mock email/payment providers and use an in-memory PostgreSQL-compatible database. They do not send messages or charge money.

## Vercel deployment
1. Import the repository and select the Next.js framework preset.
2. Use Node.js 24.x, npm ci, the default npm run build command and the default output directory. Do not configure a static export: this application has API routes.
3. Add every variable from .env.example in Vercel's environment settings, using real values. Do not expose server-only keys with NEXT_PUBLIC_.
4. Set APP_URL to the HTTPS URL that donors will actually use. Keep separate values for preview and production environments. Redeploy after changing environment variables.
5. In Sanity project settings, add the deployed Studio origin as an allowed CORS origin with credentials enabled. Enter only the origin, without /admin.
6. Configure the matching Paystack TEST webhook as https://YOUR-DEPLOYED-HOST/api/payments/webhook. The endpoint must be accessible without a login/deployment-protection challenge. Ngrok is only for local development.
7. Test public pages, CMS sign-in, photo/video galleries, both enquiry forms, counselling recipient routing and test payment callbacks/webhooks on the deployed URL.
8. Add the custom domain through Vercel and apply the exact DNS records Vercel provides. Preserve the existing Resend TXT/CNAME records and mailbox records.

## Payment release status
Payments are deliberately restricted to Paystack TEST keys and TEST transaction domains in code. A successful deployment does not enable real donations. Do not simply switch the secret to a live key: complete the live/test configuration change, Paystack approvals (including international acceptance), permanent webhook checks and a controlled live/settlement test separately.

The enquiry limiter is currently a best-effort per-instance memory limit. Shared rate limiting is still needed for consistent limits across serverless instances. Payment review/reconciliation procedures also remain necessary before accepting real money.

## Performance
Local images use Next's image optimizer. CMS images use a responsive Sanity CDN loader, preserving the existing direct-delivery workaround for image-proxy timeouts.
Video files are loaded only when a visitor opens a player. Mobile navigation and the video gallery have separate lazy-loaded chunks.
The logo uses a small derivative; the original remains available. The favicon is a properly encoded small ICO.
See docs/performance-and-deployment.md for the audit and measured results.

Official deployment reference: https://vercel.com/docs/frameworks/full-stack/nextjs
