import { getActiveJobs } from '../lib/jobs';
import { todayLabel } from '../lib/utils';
import JobsBrowser from '../components/JobsBrowser';

// تحميل الوظائف حسب رقم الصفحة وكلمة البحث.
export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }) {
  const pageValue = searchParams?.page;
  const searchValue = searchParams?.q;

  const page = Array.isArray(pageValue)
    ? pageValue[0]
    : pageValue;

  const search = Array.isArray(searchValue)
    ? searchValue[0]
    : searchValue || '';

  const {
    jobs,
    failed,
    total,
    totalPages,
    currentPage,
    pageSize,
  } = await getActiveJobs({
    page: page || 1,
    search,
  });

  return (
    <JobsBrowser
      key={`${currentPage}-${search}`}
      jobs={jobs}
      failed={failed}
      dateText={todayLabel()}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
      pageSize={pageSize}
      search={search}
    />
  );
}
