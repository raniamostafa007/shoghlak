import Link from 'next/link';
import { SITE } from '../lib/site';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <img src="/logo.png" alt={SITE.name} />
          <div>
            <div className="brand-name">{SITE.name}</div>
            <div className="brand-tag">{SITE.tagline}</div>
          </div>
        </Link>
        <nav className="nav">
          <Link href="/">الرئيسية</Link>
          <Link href="/about">عن الموقع</Link>
        </nav>
      </div>
    </header>
  );
}
