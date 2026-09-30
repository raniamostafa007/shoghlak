import { supabase } from './supabase';
import { isExpired } from './utils';

export async function getActiveJobs() {
  const now = new Date();
  const nowIso = now.toISOString();

  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')

    // عرض الوظائف المنشورة منذ أقل من 30 يوم.
    // إذا لم يوجد تاريخ نشر، نستخدم تاريخ الإنشاء.
    .or(
      `published_at.gt.${thirtyDaysAgo},` +
      `and(published_at.is.null,created_at.gt.${thirtyDaysAgo})`
    )

    // استبعاد الوظائف التي انتهى موعدها الرسمي.
    .or(
      `expires_at.is.null,expires_at.gt.${nowIso}`
    )

    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('getActiveJobs error:', error.message);

    return {
      jobs: [],
      failed: true,
    };
  }

  return {
    jobs: (data || []).filter((job) => !isExpired(job)),
    failed: false,
  };
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

  // الإعلان المنتهي يظل متاحًا بالرابط المباشر
  // حتى الحذف التلقائي بعد 6 شهور.
  return data;
}
