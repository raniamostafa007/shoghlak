import { SITE } from '../../lib/site';

export const metadata = { title: 'عن الموقع' };

export default function AboutPage() {
  return (
    <div className="container">
      <div className="detail" style={{ marginTop: 26 }}>
        <h1>عن {SITE.name}</h1>
        <p className="text-block" style={{ marginTop: 14 }}>
          {SITE.name} موقع بينشر كل يوم وظائف حكومية وقطاع خاص، مع تفاصيل كل وظيفة
          وطريقة التقديم بشكل واضح: رابط التقديم الرسمي، أو البريد الإلكتروني،
          أو مكان وموعد المقابلة الشخصية.
        </p>
        <p className="text-block" style={{ marginTop: 10 }}>
          التقديم على كل الوظائف مجاني، وإحنا مش بناخد أي مبالغ من الباحثين عن عمل.
          دايمًا اتأكدي من بيانات الجهة قبل ما تقدمي.
        </p>
      </div>
    </div>
  );
}
