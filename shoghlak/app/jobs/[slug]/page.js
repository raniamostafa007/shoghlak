import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobBySlug } from '../../../lib/jobs';
import { formatDate, isExpired, safeDecode } from '../../../lib/utils';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const job = await getJobBySlug(safeDecode(params.slug));
  if (!job) return { title: 'وظيفة غير موجودة' };
  return {
    title: job.title,
    description: `${job.title} - ${job.company_name}${job.city ? ' - ' + job.city : ''}`,
  };
}

function ApplyBox({ job }) {
  const type = job.application_type;

  if (type === 'Website' && job.application_url) {
    return (
      <div className="apply-box">
        <div className="block-title">طريقة التقديم</div>
        <p>التقديم يتم إلكترونيًا عن طريق الموقع الرسمي للجهة.</p>
        <a className="btn" href={job.application_url} target="_blank" rel="noopener noreferrer">
          التقديم على الوظيفة ←
        </a>
      </div>
    );
  }

  if (type === 'Email' && job.application_email) {
    return (
      <div className="apply-box">
        <div className="block-title">طريقة التقديم</div>
        <p>أرسلي السيرة الذاتية على البريد الإلكتروني:</p>
        <p style={{ fontWeight: 800, direction: 'ltr', textAlign: 'right' }}>{job.application_email}</p>
        <a className="btn" href={`mailto:${job.application_email}`}>إرسال بريد إلكتروني ←</a>
      </div>
    );
  }

  if (type === 'WhatsApp' && job.application_whatsapp) {
    const digits = job.application_whatsapp.replace(/[^0-9]/g, '');
    return (
      <div className="apply-box">
        <div className="block-title">طريقة التقديم</div>
        <p>التقديم عن طريق التواصل على واتساب.</p>
        <a className="btn btn-green" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
          التواصل عبر واتساب ←
        </a>
      </div>
    );
  }

  if (type === 'Interview' && (job.interview_address || job.interview_date)) {
    return (
      <div className="apply-box">
        <div className="block-title">التقديم بالمقابلة الشخصية</div>
        {job.interview_address ? <p>📍 <b>مكان المقابلة:</b> {job.interview_address}</p> : null}
        {job.interview_date ? <p>📅 <b>الموعد:</b> {job.interview_date}</p> : null}
        {job.other_instructions ? <p className="text-block">{job.other_instructions}</p> : null}
      </div>
    );
  }

  if (job.other_instructions) {
    return (
      <div className="apply-box">
        <div className="block-title">طريقة التقديم</div>
        <p className="text-block">{job.other_instructions}</p>
      </div>
    );
  }

  return null;
}

export default async function JobPage({ params }) {
  const job = await getJobBySlug(safeDecode(params.slug));
  if (!job) notFound();

  const expired = isExpired(job);

  return (
    <div className="container">
      <div className="crumbs">
        <Link href="/">→ رجوع لكل الوظائف</Link>
      </div>

      <article className="detail">
        {expired ? <div className="warn">⚠️ هذا الإعلان انتهى موعد التقديم عليه.</div> : null}

        <div className="detail-head">
          <div className="logo-box">
            {job.company_logo ? <img src={job.company_logo} alt="" /> : <span>{(job.company_name || '؟').trim()[0]}</span>}
          </div>
          <div>
            <h1>{job.title}</h1>
            <p className="company-line">{job.company_name}</p>
          </div>
        </div>

        {job.cover_image ? <img className="cover" src={job.cover_image} alt={job.title} /> : null}

        <div className="facts">
          {job.company_name ? <div className="fact"><b>🏢 الشركة</b>{job.company_name}</div> : null}
          {job.city ? <div className="fact"><b>📍 مكان العمل</b>{job.city}</div> : null}
          {job.qualification ? <div className="fact"><b>🎓 المؤهل</b>{job.qualification}</div> : null}
          {job.category ? <div className="fact"><b>💼 المجال</b>{job.category}</div> : null}
          {job.jobs_count ? <div className="fact"><b>🔢 عدد الوظائف</b>{job.jobs_count}</div> : null}
          <div className="fact"><b>📅 تاريخ النشر</b>{formatDate(job.published_at)}</div>
          {job.expires_at ? <div className="fact"><b>⏳ آخر موعد للتقديم</b>{formatDate(job.expires_at)}</div> : null}
        </div>

        {job.description ? (
          <>
            <div className="block-title">تفاصيل الوظيفة</div>
            <p className="text-block">{job.description}</p>
          </>
        ) : null}

        {job.requirements ? (
          <>
            <div className="block-title">الشروط والمتطلبات</div>
            <p className="text-block">{job.requirements}</p>
          </>
        ) : null}

        {!expired ? <ApplyBox job={job} /> : null}
      </article>
    </div>
  );
}
