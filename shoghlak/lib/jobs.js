import { supabase } from './supabase';

export async function getActiveJobs() {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('getActiveJobs error:', error.message);
    return { jobs: [], failed: true };
  }
  return { jobs: data || [], failed: false };
}

export async function getJobBySlug(slug) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('getJobBySlug error:', error.message);
    return null;
  }
  return data;
}
