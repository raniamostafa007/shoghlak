import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="empty">
        <h3>الصفحة دي مش موجودة</h3>
        <p>ممكن تكون الوظيفة انتهت أو الرابط غلط.</p>
        <Link className="btn" href="/">رجوع لوظائف اليوم</Link>
      </div>
    </div>
  );
}
