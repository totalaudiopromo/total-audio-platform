-- Add code_verifier column for PKCE support
ALTER TABLE oauth_states ADD COLUMN IF NOT EXISTS code_verifier TEXT;

COMMENT ON COLUMN oauth_states.code_verifier IS 'PKCE code verifier for Airtable/Mailchimp OAuth';
