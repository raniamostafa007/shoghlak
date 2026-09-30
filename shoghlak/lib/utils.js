// تاريخ الانتهاء الفعلي هو الأقرب بين:
// تاريخ النشر + 30 يوم، أو الموعد الرسمي للتقديم.
export function getExpiryDate(job) {
  if (!job) return null;

  const publishedValue =
    job.published_at || job.created_at;

  const publishedAt = publishedValue
    ? new Date(publishedValue).getTime()
    : NaN;

  const officialExpiry = job.expires_at
    ? new Date(job.expires_at).getTime()
    : NaN;

  const thirtyDayExpiry = Number.isFinite(publishedAt)
    ? publishedAt + 30 * 24 * 60 * 60 * 1000
    : NaN;

  const validDates = [
    thirtyDayExpiry,
    officialExpiry,
  ].filter(Number.isFinite);

  if (validDates.length === 0) return null;

  return new Date(Math.min(...validDates));
}

// هل انتهى التقديم؟
export function isExpired(job) {
  const expiry = getExpiryDate(job);

  if (!expiry) return false;

  return Date.now() >= expiry.getTime();
}

// عرض التاريخ بتوقيت مصر.
export function formatDate(value) {
  if (!value) return '';

  return new Date(value).toLocaleDateString(
    'ar-EG-u-nu-latn',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Cairo',
    }
  );
}

// تاريخ اليوم بتوقيت مصر.
export function todayLabel() {
  return new Date().toLocaleDateString(
    'ar-EG-u-nu-latn',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Cairo',
    }
  );
}

// إنشاء رابط للوظيفة.
export function makeSlug(title) {
  const base = (title || '')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '');

  const random = Math.random()
    .toString(36)
    .slice(2, 6);

  return `${base || 'job'}-${random}`;
}

// قراءة النص المشفر في الرابط.
export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
