import Link from 'next/link';
import { SITE } from '../lib/site';

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  padding: '10px 20px',
  border: '1px solid rgba(255,255,255,0.45)',
  borderRadius: 10,
  backgroundColor: '#ffffff',
  color: '#105b8e',
  fontSize: 16,
  fontWeight: 700,
  textDecoration: 'none',
  textAlign: 'center',
};

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: '30px 0 24px',
        backgroundColor: '#105b8e',
        color: '#ffffff',
        borderTop: '4px solid #efa51b',
      }}
    >
      <div className="container">
        <nav
          aria-label="روابط أسفل الموقع"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 14,
            maxWidth: 720,
            margin: '0 auto 24px',
          }}
        >
          <Link href="/about" style={linkStyle}>
            عن الموقع
          </Link>

          <Link href="/contact" style={linkStyle}>
            اتصل بنا
          </Link>

          <Link href="/privacy" style={linkStyle}>
            سياسة الخصوصية
          </Link>

          {SITE.facebookUrl && (
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              فيسبوك
            </a>
          )}
        </nav>

        <div
          style={{
            textAlign: 'center',
            paddingTop: 20,
            borderTop:
              '1px solid rgba(255,255,255,0.25)',
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          © {new Date().getFullYear()} {SITE.name}
          {' — جميع الحقوق محفوظة'}
        </div>
      </div>
    </footer>
  );
}
