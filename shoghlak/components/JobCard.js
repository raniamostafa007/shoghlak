import Link from 'next/link';
import { formatDate } from '../lib/utils';

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job.slug}`} className="card">
      <div className="card-top">
        <div className="logo-box">
          {job.company_logo ? (
            <img src={job.company_logo} alt="" />
          ) : (
            <span>{(job.company_name || '؟').trim()[0]}</span>
          )}
        </div>
        <span className="badge">{formatDate(job.published_at)}</span>
      </div>
      <h3>{job.title}</h3>
      <p className="company">{job.company_name}</p>
      <div className="chips">
        {job.city ? <span className="chip">📍 {job.city}</span> : null}
        {job.qualification ? <span className="chip">🎓 {job.qualification}</span> : null}
        {job.jobs_count ? <span className="chip">{job.jobs_count} وظيفة</span> : null}
      </div>
      <span className="card-btn">عرض التفاصيل</span>
    </Link>
  );
}
