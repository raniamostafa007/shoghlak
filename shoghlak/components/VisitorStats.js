'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VisitorStats() {
  const [count, setCount] = useState(null);
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
          setCount(Number(data?.[0]?.visitors ?? 0));
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
      aria-label="زوار اليوم"
      style={{
        padding: 20,
        marginBottom: 20,
        border: '1px solid var(--line)',
        borderRadius: 14,
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>زوار اليوم</h3>

      <strong
        aria-live="polite"
        style={{
          display: 'block',
          fontSize: 36,
          color: 'var(--ink)',
        }}
      >
        {error
          ? 'تعذر التحميل'
          : count === null
            ? '…'
            : count.toLocaleString('ar-EG')}
      </strong>
    </section>
  );
}
