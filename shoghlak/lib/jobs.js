import { supabase } from './supabase';

const PAGE_SIZE = 12;

export async function getActiveJobs({
  page = 1,
  search = '',
} = {}) {
  const parsedPage = Number(page);

  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  // تنظيف علامات قد تؤثر على صيغة البحث.
  const searchTerm = String(search)
    .replace(/[,%_*()"\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);

  const now = new Date();
  const nowIso = now.toISOString();

  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const start = (currentPage - 1) * PAGE_SIZE;

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

    // استبعاد الوظائف التي مرّ عليها 30 يومًا.
    .or(
      `published_at.gt.${thirtyDaysAgo},` +
      `and(published_at.is.null,created_at.gt.${thirtyDaysAgo})`
    )

    // استبعاد الوظائف التي انتهى موعدها الرسمي.
    .or(
      `expires_at.is.null,expires_at.gt.${nowIso}`
    );

  // البحث في جميع الوظائف النشطة قبل تقسيم النتائج.
  if (searchTerm) {
    const pattern = `%${searchTerm}%`;

    query = query.or(
      [
        `title.ilike.${pattern}`,
        `company_name.ilike.${pattern}`,
        `city.ilike.${pattern}`,
        `category.ilike.${pattern}`,
        `qualification.ilike.${pattern}`,
      ].join(',')
    );
  }

  const { data, error, count } = await query
    .order('is_featured', { ascending: false })
    .order('published_at', {
      ascending: false,
      nullsFirst: false,
    })
    .order('id', { ascending: false })
    .range(start, start + PAGE_SIZE - 1);

  if (error) {
    console.error('getActiveJobs error:', error.message);

    return {
      jobs: [],
      failed: true,
      total: 0,
      totalPages: 0,
      currentPage,
      pageSize: PAGE_SIZE,
    };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // لو رقم الصفحة أكبر من الموجود، نعرض آخر صفحة.
  if (totalPages > 0 && currentPage > totalPages) {
    return getActiveJobs({
      page: totalPages,
      search: searchTerm,
    });
  }

  return {
    jobs: data || [],
    failed: false,
    total,
    totalPages,
    currentPage: totalPages === 0 ? 1 : currentPage,
    pageSize: PAGE_SIZE,
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

  return data;
}
