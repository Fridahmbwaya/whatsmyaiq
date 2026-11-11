# What's My AIQ — launch runbook

What's My AIQ is a Next.js quiz and paid AI-readiness report product. It has five readiness tiers and four audiences. Users can see free results and level-specific reading, request a Brevo snapshot email, and buy a more detailed Anthropic-generated report via Stripe Checkout.

## Architecture

- Browser: 8-question assessment, free results and suggested reading.
- \`POST /api/snapshot\`: server validates answers and sends a transactional free snapshot through Brevo. An email is only marked sent on a successful Brevo API response.
- \`POST /api/checkout\`: validates the entire quiz server-side and creates a $24.99 Stripe-hosted payment session. The endpoint is **disabled** unless \`PAYMENTS_ENABLED=true\` and all service credentials are present.
- \`GET /api/order-status?session_id=...\`: verifies Checkout Session with Stripe, returning only paid and fulfillment status. The browser **never** grants itself paid access from URL query parameters.
- \`POST /api/stripe-webhook\`: verifies the Stripe signature, checks the canonical Stripe Session is paid and for the expected product/amount, requests a tailored Anthropic report, emails it via Brevo, and marks the session as delivered in Stripe metadata.

### Security and operational constraints

Never place any secret in \`NEXT_PUBLIC_*\`, frontend code, or GitHub. Paid report generation only occurs on the backend and only after payment verification. The current MVP uses Stripe Checkout Session metadata to skip **sequential** duplicate webhook deliveries. This is **not a transactional lock**; concurrent deliveries or failure between Brevo acceptance and Stripe metadata update could send duplicate messages. Add a durable jobs/orders database with unique Stripe Checkout Session IDs before opening to substantial traffic. A durable workflow/queue is also recommended because Anthropic generation and Brevo delivery may exceed Stripe's webhook response timeout; monitor and retry failed events.

The free snapshot route accepts submissions from the public internet and requires production-grade anti-abuse protection, such as a persistent rate limiter plus a CAPTCHA challenge, before promotion to a widely marketed launch. Transactional email does not auto-subscribe recipients to marketing.

## Configure Vercel

Project: \`whatsmyaiq\` → Settings → Environment Variables.

Add the following **secret** variables, all directly inside Vercel's secure UI (never in ChatGPT or source control):

| Name | Source |
| --- | --- |
| \`STRIPE_SECRET_KEY\` | Stripe Developers → API keys (use test key for staging) |
| \`STRIPE_WEBHOOK_SECRET\` | Stripe webhook endpoint signing secret, for \`/api/stripe-webhook\` |
| \`ANTHROPIC_API_KEY\` | Anthropic Console → API Keys |
| \`BREVO_API_KEY\` | Brevo → SMTP & API → API Keys |
| \`BREVO_SENDER_EMAIL\` | A verified sender address / authenticated domain in Brevo |

The following nonsecret settings have already been set in Vercel for Preview, Production, and Development:

| Name | Value |
| --- | --- |
| \`ANTHROPIC_MODEL\` | \`claude-sonnet-5\` |
| \`BREVO_SENDER_NAME\` | \`What's My AIQ\` |
| \`PAYMENTS_ENABLED\` | \`false\` |

For staging, use Stripe test secrets and a test-mode webhook secret scoped to Preview. Use separate live-mode Stripe keys and endpoint signing secret for Production. After changing env vars, redeploy, since the values are captured by the deployed functions.

## Stripe webhook

Configure the event destination to \`https://whatsmyaiq.online/api/stripe-webhook\` **only after the new version is deployed**. Subscribe to:

- \`checkout.session.completed\`
- \`checkout.session.async_payment_succeeded\`

The backend currently limits Checkout to card payments; the second event is included as a forward-compatible handler. Test webhook signature verification with an invalid signature (must return 400) and a valid Stripe test event.

## Release checklist

1. Deploy a reviewed preview and verify the site and quiz on desktop and mobile.
2. Add credentials in Vercel and redeploy. Confirm sending a free snapshot reaches an actual inbox, and that Brevo Email Logs record the message.
3. Configure Stripe test-mode webhook for an accessible staging endpoint. Set \`PAYMENTS_ENABLED=true\` only in that test environment after configuration.
4. Make a **test-mode** $24.99 Checkout payment; confirm that the webhook receives the event, that paid status is verified server-side, that Anthropic generates the requested personalised report, and that Brevo sends it to the buyer. Make a second test for a different audience/tier.
5. Attempt to call the return page with a made-up session ID; confirm it does not unlock a report. Test invalid webhook signatures (400), duplicate event handling, and provider errors/retries.
6. Add durable idempotency and asynchronous fulfillment before a production-scale launch; add free-email abuse protection.
7. Only after successful tests, set live Stripe secrets and a live webhook signing secret in Production and turn on \`PAYMENTS_ENABLED=true\` for Production. Redeploy.
8. Review the actual price, refund policy, data collection/privacy notice, and support contact before charging customers.

**Important:** Because the original Stripe Payment Link could be accessed without a trusted customer/quiz mapping, this implementation creates new Stripe Checkout Sessions using the verified quiz data. The original link is no longer used.

## Future revenue sequence

Free AIQ snapshot and resource list → $24.99 personalised report → targeted paid learning modules (planned, not yet sold). Modules should be organized by readiness tier and audience, with practical exercises and measurable completion evidence.
