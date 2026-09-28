export function isExpired(job) {
  if (!job || !job.expires_at) return false;
  return new Date(job.expires_at) < new Date();
}

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('ar-EG-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  });
}

export function todayLabel() {
  return new Date().toLocaleDateString('ar-EG-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  });
}

export function makeSlug(title) {
  const base = (title || '')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '');
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base || 'job'}-${rand}`;
}

export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
