-- Local test schema matching the donations table built in Neon.
-- This file is applied only to an in-memory PGlite database by the tests.
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  donor_name VARCHAR(120),
  donor_email VARCHAR(254) NOT NULL,
  amount_in_kobo BIGINT NOT NULL CHECK (amount_in_kobo > 0),
  currency TEXT NOT NULL DEFAULT 'NGN' CHECK (currency = 'NGN'),
  cause TEXT NOT NULL CHECK (cause IN ('general', 'children', 'widows', 'education', 'community')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'successful', 'failed', 'abandoned', 'reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  checkout_request_id UUID UNIQUE,
  checkout_url TEXT,
  checkout_state TEXT NOT NULL DEFAULT 'created'
    CHECK (checkout_state IN ('created', 'initializing', 'ready', 'needs_review', 'failed')),
  checkout_started_at TIMESTAMPTZ,
  checkout_attempt_token UUID,
  provider_status TEXT,
  payment_last_checked_at TIMESTAMPTZ
);
