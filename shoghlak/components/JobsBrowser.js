'use client';

import { useState } from 'react';
import JobCard from './JobCard';
import AdSlot from './AdSlot';
import { SITE } from '../lib/site';

export default function JobsBrowser({ jobs, failed, dateText }) {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();

  const filtered = term
    ? jobs.filter((j) =>
        [j.title, j.company_name, j.city, j.category, j.qualification]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    : jobs;

  const companiesCount = new Set(jobs.map((j) => j.company_name)).size;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-icon">
            <img src="/logo.png" alt="" />
          </div>
          <h1>وظائف <span>وفرص عمل</span> يوميًا</h1>
          <p className="sub">{SITE.description}</p>

          <div className="search-wrap">
            <input
              type="search"
              placeholder="ابحث عن وظيفة أو شركة أو مدينة..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <p className="sub" style={{ fontWeight: 500, fontSize: 13, marginTop: 6 }}>{dateText}</p>
        </div>
      </section>

      <div className="container">
        <AdSlot id="home-top" />

        <div className="section-title">
          {term ? `نتائج البحث (${filtered.length})` : `أحدث الوظائف (${filtered.length})`}
        </div>

        {failed ? (
          <div className="empty">
            <h3>حصلت مشكلة في تحميل الوظائف</h3>
            <p>جربي تعملي تحديث للصفحة بعد شوية.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>{term ? 'مفيش نتائج مطابقة' : 'مفيش وظائف منشورة دلوقتي'}</h3>
            <p>{term ? 'جربي كلمة بحث تانية.' : 'ارجعي بعد شوية، بنضيف وظائف جديدة كل يوم.'}</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        <AdSlot id="home-bottom" />
      </div>
    </>
  );
}
