'use client';

import { useState } from 'react';
import Link from 'next/link';
import JobCard from './JobCard';
import AdSlot from './AdSlot';
import { SITE } from '../lib/site';

function pageLink(page, search) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('q', search.trim());
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();

  return query ? `/?${query}` : '/';
}

function pageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  const numbers = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    [2, 3, 4].forEach((page) => numbers.add(page));
  }

  if (currentPage >= totalPages - 2) {
    [
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
    ].forEach((page) => numbers.add(page));
  }

  const sorted = [...numbers]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push(`gap-${page}`);
    }

    result.push(page);
  });

  return result;
}

export default function JobsBrowser({
  jobs,
  failed,
  dateText,
  total = 0,
  totalPages = 0,
  currentPage = 1,
  pageSize = 12,
  search = '',
}) {
  const [q, setQ] = useState(search);
  const hasSearch = Boolean(search.trim());

  const firstResult = (currentPage - 1) * pageSize + 1;
  const lastResult = Math.min(
    firstResult + jobs.length - 1,
    total
  );

  const pages = pageNumbers(currentPage, totalPages);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-icon">
            <img src="/logo.png" alt="" />
          </div>

          <h1>
            وظائف <span>وفرص عمل</span> يوميًا
          </h1>

          <p className="sub">{SITE.description}</p>

          <form
            action="/"
            method="get"
            className="search-wrap"
            role="search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              type="search"
              name="q"
              aria-label="البحث عن وظيفة أو شركة أو مدينة"
              placeholder="ابحث عن وظيفة أو شركة أو مدينة..."
              value={q}
              onChange={(event) => setQ(event.target.value)}
              maxLength={150}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            />

            <button
              type="submit"
              className="btn btn-sm"
              style={{
                flexShrink: 0,
                marginInlineEnd: 8,
              }}
            >
              بحث
            </button>
          </form>

          {hasSearch && (
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginTop: 12,
                fontWeight: 700,
              }}
            >
              عرض كل الوظائف
            </Link>
          )}

          <p
            className="sub"
            style={{
              fontWeight: 500,
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {dateText}
          </p>
        </div>
      </section>

      <div className="container">
        {!failed && jobs.length > 0 && (
          <AdSlot id="home-top" />
        )}

        <div className="section-title">
          {failed
            ? 'الوظائف'
            : hasSearch
              ? `نتائج البحث (${total})`
              : `أحدث الوظائف (${total})`}
        </div>

        {failed ? (
          <div className="empty">
            <h3>حصلت مشكلة في تحميل الوظائف</h3>
            <p>حاولي تحديث الصفحة بعد شوية.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty">
            <h3>
              {hasSearch
                ? 'مفيش نتائج مطابقة'
                : 'مفيش وظائف منشورة دلوقتي'}
            </h3>

            <p>
              {hasSearch
                ? 'جربي كلمة بحث تانية.'
                : 'ارجعي بعد شوية، بنضيف وظائف جديدة كل يوم.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="jobs-pagination"
                aria-label="صفحات الوظائف"
              >
                {currentPage > 1 ? (
                  <Link
                    className="jobs-page"
                    href={pageLink(currentPage - 1, search)}
                    rel="prev"
                  >
                    السابق
                  </Link>
                ) : (
                  <span
                    className="jobs-page jobs-page-disabled"
                    aria-disabled="true"
                  >
                    السابق
                  </span>
                )}

                {pages.map((page) =>
                  typeof page === 'string' ? (
                    <span
                      key={page}
                      className="jobs-page-gap"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={page}
                      href={pageLink(page, search)}
                      className={`jobs-page ${
                        page === currentPage
                          ? 'jobs-page-current'
                          : ''
                      }`}
                      aria-label={`صفحة ${page}`}
                      aria-current={
                        page === currentPage
                          ? 'page'
                          : undefined
                      }
                    >
                      {page}
                    </Link>
                  )
                )}

                {currentPage < totalPages ? (
                  <Link
                    className="jobs-page"
                    href={pageLink(currentPage + 1, search)}
                    rel="next"
                  >
                    التالي
                  </Link>
                ) : (
                  <span
                    className="jobs-page jobs-page-disabled"
                    aria-disabled="true"
                  >
                    التالي
                  </span>
                )}
              </nav>
            )}

            <p
              style={{
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: 14,
                margin: '16px 0 24px',
              }}
            >
              عرض {firstResult}–{lastResult} من {total} إعلان
            </p>

            <AdSlot id="home-bottom" />
          </>
        )}
      </div>

      <style>{`
        .jobs-pagination {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 28px;
        }

        .jobs-pagination .jobs-page {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
          padding: 8px 12px;
          border: 2px solid #efa51b;
          border-radius: 8px;
          background: #ffffff;
          color: #105b8e;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.4;
          text-decoration: none;
        }

        .jobs-pagination a.jobs-page:hover {
          background: #fff8eb;
        }

        .jobs-pagination .jobs-page-current {
          background: #105b8e;
          color: #ffffff;
          border-color: #105b8e;
        }

        .jobs-pagination a.jobs-page-current:hover {
          background: #105b8e;
        }

        .jobs-pagination .jobs-page-disabled {
          color: #737373;
          background: #f5f5f5;
          border-color: #dddddd;
        }

        .jobs-pagination .jobs-page-gap {
          padding: 0 4px;
          color: var(--muted);
        }

        .jobs-pagination a:focus-visible {
          outline: 2px solid #105b8e;
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
}
