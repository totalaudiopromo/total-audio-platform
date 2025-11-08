-- More Aggressive Fix: Disable RLS on campaign_collaborators Temporarily
-- This completely breaks the recursion by disabling RLS checks on this table

-- First, drop ALL policies (in case any were missed)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'campaign_collaborators') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON campaign_collaborators';
    END LOOP;
END $$;

-- Disable RLS entirely on campaign_collaborators
ALTER TABLE campaign_collaborators DISABLE ROW LEVEL SECURITY;

-- If you need RLS back later, re-enable with simple policies:
-- ALTER TABLE campaign_collaborators ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own collaborator records" ON campaign_collaborators
--   FOR SELECT USING (auth.uid() = user_id);

