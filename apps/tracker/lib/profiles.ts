import { createClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  user_type: 'artist' | 'agency' | 'both';
  full_name: string | null;
  company_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencyProfile {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  website: string | null;
  team_size: number;
  specialties: string[] | null;
  bio: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientRelationship {
  id: string;
  agency_id: string;
  client_id: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  role: 'client' | 'collaborator' | 'viewer';
  invited_by: string | null;
  invited_at: string;
  accepted_at: string | null;
  ended_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  agency_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'member';
  permissions: string[];
  invited_by: string | null;
  invited_at: string;
  joined_at: string | null;
  status: 'pending' | 'active' | 'suspended' | 'removed';
  created_at: string;
  updated_at: string;
}

export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      ...profile,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

export async function getAgencyProfile(userId?: string): Promise<AgencyProfile | null> {
  const supabase = await createClient();

  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('agency_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createAgencyProfile(
  userId: string,
  profile: Omit<AgencyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<AgencyProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('agency_profiles')
    .insert({
      user_id: userId,
      ...profile,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating agency profile:', error);
    return null;
  }

  return data;
}

export async function updateAgencyProfile(
  userId: string,
  updates: Partial<Omit<AgencyProfile, 'id' | 'user_id'>>
): Promise<AgencyProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('agency_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating agency profile:', error);
    return null;
  }

  return data;
}

export async function getClientRelationships(
  type: 'agency' | 'client' = 'agency'
): Promise<ClientRelationship[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const column = type === 'agency' ? 'agency_id' : 'client_id';

  const { data, error } = await supabase
    .from('client_relationships')
    .select('*')
    .eq(column, user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client relationships:', error);
    return [];
  }

  return data || [];
}

export async function createClientRelationship(
  clientId: string,
  role: 'client' | 'collaborator' | 'viewer' = 'client',
  notes?: string
): Promise<ClientRelationship | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('client_relationships')
    .insert({
      agency_id: user.id,
      client_id: clientId,
      role,
      notes,
      invited_by: user.id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client relationship:', error);
    return null;
  }

  return data;
}

export async function updateClientRelationship(
  relationshipId: string,
  updates: Partial<Pick<ClientRelationship, 'status' | 'role' | 'notes'>>
): Promise<ClientRelationship | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('client_relationships')
    .update(updates)
    .eq('id', relationshipId)
    .select()
    .single();

  if (error) {
    console.error('Error updating client relationship:', error);
    return null;
  }

  return data;
}

export async function acceptClientRelationship(
  relationshipId: string
): Promise<ClientRelationship | null> {
  return updateClientRelationship(relationshipId, {
    status: 'active',
  });
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('agency_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data || [];
}

export async function inviteTeamMember(
  userId: string,
  role: 'admin' | 'manager' | 'member' = 'member',
  permissions: string[] = ['view_campaigns', 'edit_activities']
): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('team_members')
    .insert({
      agency_id: user.id,
      user_id: userId,
      role,
      permissions,
      invited_by: user.id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error inviting team member:', error);
    return null;
  }

  return data;
}
