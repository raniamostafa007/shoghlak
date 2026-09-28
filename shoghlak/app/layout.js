import './globals.css';
import { Cairo } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE } from '../lib/site';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
