import { SITE } from '../../lib/site';

export const metadata = {
  title: 'اتصل بنا',
  description:
    'تواصل مع إدارة شغلك عندنا للاستفسارات والإبلاغ عن إعلانات الوظائف أو مشكلات الموقع.',
};

const CONTACT_EMAIL = 'shoghlak2026@gmail.com';

export default function ContactPage() {
  return (
    <div className="container">
      <article
        className="detail"
        style={{
          marginTop: 26,
          marginBottom: 50,
          fontSize: 16,
          lineHeight: 1.9,
        }}
      >
        <h1>اتصل بنا</h1>

        <p>
          للاستفسارات أو الاقتراحات أو الإبلاغ عن مشكلة
          في أحد إعلانات الوظائف، يمكنك التواصل مع
          إدارة {SITE.name} عبر البريد الإلكتروني.
        </p>

        <section
          aria-label="بريد التواصل"
          style={{
            marginTop: 24,
            marginBottom: 28,
            padding: 24,
            border: '1px solid var(--line)',
            borderRadius: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            البريد الإلكتروني
          </h2>

          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>

          <a
            className="btn"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            إرسال رسالة
          </a>
        </section>

        <h2 className="block-title">
          الإبلاغ عن إعلان وظيفة
        </h2>

        <p>
          إذا وجدت إعلانًا انتهى التقديم عليه، أو يحتوي
          على معلومات غير صحيحة، أو يطلب دفع رسوم
          للتقديم، أرسل لنا:
        </p>

        <ul>
          <li>رابط الإعلان على موقعنا.</li>
          <li>وصف المشكلة أو المعلومات المطلوب تصحيحها.</li>
          <li>
            رابط المصدر أو دليل يدعم البلاغ، إن توفر.
          </li>
        </ul>

        <h2 className="block-title">
          مشكلات الموقع والاقتراحات
        </h2>

        <p>
          عند الإبلاغ عن مشكلة في الموقع، وضّح الصفحة
          التي ظهرت فيها المشكلة وما حدث أثناء استخدامها.
          يمكنك إرفاق صورة بعد إخفاء أي بيانات شخصية.
          ونرحب باقتراحاتك لتحسين تجربة البحث عن الوظائف.
        </p>

        <h2 className="block-title">
          الاستفسار عن التقديم
        </h2>

        <p>
          {SITE.name} موقع لنشر فرص العمل في مصر، وليس
          جهة التوظيف. للتقديم أو متابعة طلبك، استخدم
          وسيلة التواصل الخاصة بالشركة والمذكورة في
          إعلان الوظيفة.
        </p>

        <p>
          لا ترسل سيرتك الذاتية إلى بريد إدارة الموقع
          بغرض التقديم على الوظائف.
        </p>

        <h2 className="block-title">
          استفسارات الخصوصية
        </h2>

        <p>
          يمكنك استخدام البريد نفسه للاستفسار عن
          استخدام بياناتك، مع كتابة «استفسار خصوصية»
          في عنوان الرسالة.
        </p>
      </article>
    </div>
  );
}
