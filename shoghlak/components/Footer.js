import Link from 'next/link';
import { SITE } from '../lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} {SITE.name} - {SITE.description}</div>
        <div style={{ marginTop: 6 }}>
          <Link href="/privacy">سياسة الخصوصية</Link>
          {SITE.facebookUrl ? (
            <>
              {' · '}
              <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer">فيسبوك</a>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
