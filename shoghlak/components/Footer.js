import Link from 'next/link';
import { SITE } from '../lib/site';

function FooterIcon({ type }) {
  const props = {
    width: 19,
    height: 19,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#efa51b',
    strokeWidth: 2.3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    style: { flexShrink: 0 },
  };

  if (type === 'about') {
    return (
      <svg {...props}>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 22v-4h4v4" />
      </svg>
    );
  }

  if (type === 'contact') {
    return (
      <svg {...props}>
        <path d="M14 9V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2l3 3v-3h3a2 2 0 0 0 2-2" />
        <path d="M14 8h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v3l-3-3h-3a2 2 0 0 1-2-2v-1" />
        <path d="M5 6h6M5 10h3" />
      </svg>
    );
  }

  if (type === 'privacy') {
    return (
      <svg {...props}>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14 7h-2a2 2 0 0 0-2 2v10M8 12h6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="shoghlak-footer">
      <div className="container">
        <nav
          className="shoghlak-footer-links"
          aria-label="روابط أسفل الموقع"
        >
          <Link
            href="/about"
            className="shoghlak-footer-link"
          >
            <FooterIcon type="about" />
            <span>عن الموقع</span>
          </Link>

          <Link
            href="/contact"
            className="shoghlak-footer-link"
          >
            <FooterIcon type="contact" />
            <span>اتصل بنا</span>
          </Link>

          <Link
            href="/privacy"
            className="shoghlak-footer-link"
          >
            <FooterIcon type="privacy" />
            <span>سياسة الخصوصية</span>
          </Link>

          {SITE.facebookUrl && (
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shoghlak-footer-link"
            >
              <FooterIcon type="facebook" />
              <span>فيسبوك</span>
            </a>
          )}
        </nav>

        <div className="shoghlak-footer-copyright">
          © {new Date().getFullYear()} {SITE.name}
          {' — جميع الحقوق محفوظة'}
        </div>
      </div>

      <style>{`
        .shoghlak-footer {
          margin-top: 40px;
          padding: 30px 0 20px;
          background: #105b8e;
          color: #ffffff;
        }

        .shoghlak-footer-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 20px 28px;
          margin-bottom: 24px;
        }

        .shoghlak-footer .shoghlak-footer-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 7px 16px;
          border: 3px solid #efa51b;
          border-radius: 10px;
          background: #ffffff;
          color: #105b8e;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.6;
          text-decoration: none;
          transition:
            background-color 0.15s ease,
            transform 0.15s ease;
        }

        .shoghlak-footer .shoghlak-footer-link:hover {
          background: #fff8eb;
          color: #105b8e;
          transform: translateY(-2px);
        }

        .shoghlak-footer .shoghlak-footer-link:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 4px;
        }

        .shoghlak-footer-copyright {
          max-width: 640px;
          margin: 0 auto;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          color: #e1edf5;
          text-align: center;
          font-size: 13px;
          line-height: 1.8;
        }

        @media (max-width: 420px) {
          .shoghlak-footer-links {
            gap: 16px;
          }

          .shoghlak-footer .shoghlak-footer-link {
            padding: 7px 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shoghlak-footer .shoghlak-footer-link {
            transition: none;
          }

          .shoghlak-footer .shoghlak-footer-link:hover {
            transform: none;
          }
        }
      `}</style>
    </footer>
  );
}
