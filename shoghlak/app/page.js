import { getActiveJobs } from '../lib/jobs';
import { todayLabel } from '../lib/utils';
import JobsBrowser from '../components/JobsBrowser';

export const revalidate = 60;

export default async function HomePage() {
  const { jobs, failed } = await getActiveJobs();
  return <JobsBrowser jobs={jobs} failed={failed} dateText={todayLabel()} />;
}
