import { SITE } from '../../lib/site';

export const metadata = { title: 'سياسة الخصوصية' };

export default function PrivacyPage() {
  return (
    <div className="container">
      <div className="detail" style={{ marginTop: 26, marginBottom: 50 }}>
        <h1>سياسة الخصوصية</h1>
        <p className="text-block" style={{ marginTop: 14, color: 'var(--muted)', fontSize: 14 }}>
          آخر تحديث: {new Date().toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <p className="text-block" style={{ marginTop: 18 }}>
          نحن في {SITE.name} نحترم خصوصية زوارنا، وهذه الصفحة توضح البيانات التي
          يتم جمعها عند استخدام الموقع، وكيفية استخدامها.
        </p>

        <div className="block-title">البيانات التي لا نجمعها</div>
        <p className="text-block">
          لا يتطلب {SITE.name} إنشاء حساب أو تسجيل دخول لتصفح الوظائف. لا نطلب من الزائر
          اسمه أو بريده الإلكتروني أو رقم هاتفه أو سيرته الذاتية، ولا نقوم بتخزين أي بيانات شخصية
          عن الباحثين عن عمل.
        </p>

        <div className="block-title">ملفات تعريف الارتباط (Cookies) والإعلانات</div>
        <p className="text-block">
          قد يعرض الموقع إعلانات من خلال شبكة Google AdSense. تستخدم Google وشركاؤها
          ملفات تعريف الارتباط لعرض إعلانات مناسبة بناءً على زيارات المستخدم لهذا الموقع
          ومواقع أخرى على الإنترنت. يمكن للزائر التحكم في الإعلانات المخصصة له من خلال
          إعدادات الإعلانات في حسابه على جوجل، عبر الصفحة الرسمية:
          {' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>
          .
        </p>

        <div className="block-title">إحصائيات الزيارات</div>
        <p className="text-block">
          قد نستخدم أدوات تحليل مثل Google Analytics لفهم أعداد الزوار والصفحات الأكثر
          مشاهدة بشكل عام وغير شخصي، بهدف تحسين محتوى الموقع.
        </p>

        <div className="block-title">الروابط الخارجية</div>
        <p className="text-block">
          تحتوي صفحات الوظائف على روابط لمواقع أو وسائل تواصل خاصة بالشركات المعلنة
          (رابط تقديم، بريد إلكتروني، واتساب). {SITE.name} غير مسؤول عن سياسة الخصوصية
          الخاصة بهذه الجهات الخارجية، وننصح بمراجعة سياسة كل جهة على حدة قبل تقديم أي
          بيانات شخصية لها.
        </p>

        <div className="block-title">مسؤولية المحتوى الوظيفي</div>
        <p className="text-block">
          نحرص على نشر إعلانات وظائف حقيقية، لكننا ننصح دائمًا بالتحقق من بيانات الجهة
          المعلنة قبل التقديم، وعدم دفع أي أموال مقابل التقديم على أي وظيفة معلنة على الموقع.
        </p>

        <div className="block-title">تحديث هذه السياسة</div>
        <p className="text-block">
          قد يتم تحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة أي تغييرات في طريقة عمل
          الموقع أو الخدمات المستخدمة فيه، وسيتم نشر أي تحديث على هذه الصفحة.
        </p>

        <div className="block-title">التواصل معنا</div>
        <p className="text-block">
          لأي استفسار يخص هذه السياسة، يمكن التواصل معنا عبر البريد الإلكتروني:
          {' '}
          <span style={{ fontWeight: 800 }}>shoghlak2026@gmail.com</span>
        </p>
      </div>
    </div>
  );
}
