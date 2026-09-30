'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // لا نحسب زيارات لوحة الأدمن.
    if (pathname.startsWith('/admin')) return;

    let stopped = false;

    async function recordVisit() {
      if (document.visibilityState !== 'visible') return;

      try {
        const { data } = await supabase.auth.getSession();

        // لا نحسب الزيارة أثناء تسجيل الدخول.
        if (stopped || data.session) return;

        let visitorId = localStorage.getItem('shoghlak-visitor-id');

        const uuidPattern =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!visitorId || !uuidPattern.test(visitorId)) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('shoghlak-visitor-id', visitorId);
        }

        // قاعدة البيانات تمنع حساب نفس المتصفح مرتين في اليوم.
        await supabase.rpc('record_daily_visit', {
          p_visitor: visitorId,
        });
      } catch {
        // أي مشكلة في العداد لا تعطل الموقع.
      }
    }

    recordVisit();

    // يحسب اليوم الجديد لو الموقع ظل مفتوحًا بعد منتصف الليل.
    const timer = setInterval(recordVisit, 60000);

    document.addEventListener('visibilitychange', recordVisit);

    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', recordVisit);
    };
  }, [pathname]);

  return null;
}
