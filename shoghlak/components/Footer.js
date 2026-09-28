import { SITE } from '../lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} {SITE.name} - {SITE.description}</div>
        {SITE.facebookUrl ? (
          <div style={{ marginTop: 6 }}>
            تابعونا على <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer">فيسبوك</a>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
