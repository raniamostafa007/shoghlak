'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VisitorStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let stopped = false;

    async function refreshStats() {
      try {
        const { data, error: failure } = await supabase.rpc(
          'get_today_visitors'
        );

        if (stopped) return;

        setError(Boolean(failure));

        if (!failure) {
          setStats(data?.[0] || null);
        }
      } catch {
        if (!stopped) setError(true);
      }
    }

    refreshStats();

    const timer = setInterval(refreshStats, 30000);

    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <section
      aria-label="إحصائيات الزوار"
      style={{
        padding: 20,
        marginBottom: 20,
        border: '1px solid var(--line)',
        borderRadius: 14,
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>زوار اليوم</h3>

      {error ? (
        <p role="status">
          تعذر تحميل العداد. تأكدي من تفعيل إعداداته وصلاحية
          حساب الأدمن.
        </p>
      ) : (
        <>
          <strong
            aria-live="polite"
            style={{
              display: 'block',
              fontSize: 36,
              color: 'var(--ink)',
            }}
          >
            {stats
              ? Number(stats.visitors).toLocaleString('ar-EG')
              : '…'}
          </strong>

          {stats && (
            <p style={{ margin: '4px 0' }}>
              {stats.visit_day} — بتوقيت مصر
            </p>
          )}
        </>
      )}

      <p
        style={{
          color: 'var(--muted)',
          fontSize: 14,
          marginBottom: 0,
        }}
      >
        كل متصفح يُحسب مرة واحدة يوميًا. يبدأ يوم جديد عند
        منتصف الليل بتوقيت مصر، ويتحدث الرقم كل 30 ثانية.
      </p>
    </section>
  );
}
