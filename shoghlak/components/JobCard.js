import Link from 'next/link';
import { formatDate } from '../lib/utils';

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job.slug}`} className="card">
      <div className="logo-box">
        {job.company_logo ? (
          <img src={job.company_logo} alt="" />
        ) : (
          <span>{(job.company_name || '؟').trim()[0]}</span>
        )}
      </div>
      <div className="card-body">
        <div className="card-head">
          <h3>{job.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            {job.is_featured ? <span className="badge-featured">مميز</span> : null}
            <span className="badge">{formatDate(job.published_at)}</span>
          </div>
        </div>
        <p className="company">{job.company_name}</p>
        <div className="chips">
          {job.city ? <span className="chip">📍 {job.city}</span> : null}
          {job.qualification ? <span className="chip">🎓 {job.qualification}</span> : null}
          {job.jobs_count ? <span className="chip">{job.jobs_count} وظيفة</span> : null}
        </div>
        <div className="card-foot">
          <span className="card-btn">عرض التفاصيل</span>
        </div>
      </div>
    </Link>
  );
}
