import Link from 'next/link';
import { SITE } from '../lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          © {new Date().getFullYear()} {SITE.name}
          {' - '}
          {SITE.description}
        </div>

        <nav
          aria-label="روابط أسفل الموقع"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 20px',
            marginTop: 12,
          }}
        >
          <Link href="/about">عن الموقع</Link>

          <Link href="/contact">اتصل بنا</Link>

          <Link href="/privacy">سياسة الخصوصية</Link>

          {SITE.facebookUrl && (
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              فيسبوك
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
