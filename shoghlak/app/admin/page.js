'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import VisitorStats from '../../components/VisitorStats';
import { supabase } from '../../lib/supabase';
import { formatDate, isExpired, makeSlug } from '../../lib/utils';

const EMPTY = {
  title: '',
  slug: '',
  company_name: '',
  company_logo: '',
  cover_image: '',
  city: '',
  qualification: '',
  category: '',
  jobs_count: '',
  description: '',
  requirements: '',
  application_type: 'Website',
  application_url: '',
  application_email: '',
  application_whatsapp: '',
  interview_address: '',
  interview_date: '',
  other_instructions: '',
  expires_date: '',
  status: 'published',
  is_featured: false,
};

const nullIfEmpty = (value) =>
  typeof value === 'string' && value.trim() === '' ? null : value;

function toForm(job) {
  const form = { ...EMPTY };

  Object.keys(EMPTY).forEach((key) => {
    if (job[key] !== undefined && job[key] !== null) {
      form[key] = String(job[key]);
    }
  });

  form.expires_date = job.expires_at
    ? new Date(job.expires_at).toLocaleDateString('en-CA')
    : '';

  form.is_featured = Boolean(job.is_featured);
  return form;
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession || null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadJobs();
  }, [session]);

  async function loadJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMsg({
        type: 'err',
        text: 'مشكلة في تحميل الوظائف: ' + error.message,
      });
    } else {
      setJobs(data || []);
    }
  }

  if (session === undefined) {
    return (
      <div className="container">
        <p style={{ padding: 40 }}>جاري التحميل...</p>
      </div>
    );
  }

  if (!session) return <Login />;

  function startNew() {
    setEditingId(null);
    setForm({ ...EMPTY });
    setMsg(null);
    window.scrollTo(0, 0);
  }

  function startEdit(job) {
    setEditingId(job.id);
    setForm(toForm(job));
    setMsg(null);
    window.scrollTo(0, 0);
  }

  async function save(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.company_name.trim()) {
      setMsg({
        type: 'err',
        text: 'اكتبي عنوان الوظيفة واسم الشركة على الأقل.',
      });
      return;
    }

    setSaving(true);
    setMsg(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim()
        ? form.slug.trim().replace(/\s+/g, '-')
        : makeSlug(form.title),
      company_name: form.company_name.trim(),
      company_logo: nullIfEmpty(form.company_logo),
      cover_image: nullIfEmpty(form.cover_image),
      city: nullIfEmpty(form.city),
      qualification: nullIfEmpty(form.qualification),
      category: nullIfEmpty(form.category),
      jobs_count: form.jobs_count.trim()
        ? parseInt(form.jobs_count, 10) || null
        : null,
      description: nullIfEmpty(form.description),
      requirements: nullIfEmpty(form.requirements),
      application_type: form.application_type,
      application_url: nullIfEmpty(form.application_url),
      application_email: nullIfEmpty(form.application_email),
      application_whatsapp: nullIfEmpty(form.application_whatsapp),
      interview_address: nullIfEmpty(form.interview_address),
      interview_date: nullIfEmpty(form.interview_date),
      other_instructions: nullIfEmpty(form.other_instructions),
      expires_at: form.expires_date
        ? new Date(form.expires_date + 'T23:59:59').toISOString()
        : null,
      status: form.status,
      is_featured: Boolean(form.is_featured),
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('jobs')
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId));
    } else {
      ({ error } = await supabase.from('jobs').insert(payload));
    }

    setSaving(false);

    if (error) {
      const duplicate =
        error.message.includes('duplicate') || error.code === '23505';

      setMsg({
        type: 'err',
        text: duplicate
          ? 'الرابط (slug) ده مستخدم قبل كده، غيريه أو سيبيه فاضي.'
          : 'حصلت مشكلة: ' + error.message,
      });

      return;
    }

    setForm(null);
    setEditingId(null);
    setMsg({
      type: 'good',
      text: editingId ? 'تم حفظ التعديلات ✓' : 'تم نشر الوظيفة ✓',
    });

    loadJobs();
  }

  async function toggleStatus(job) {
    const nextStatus =
      job.status === 'published' ? 'hidden' : 'published';

    const { error } = await supabase
      .from('jobs')
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    if (error) {
      setMsg({ type: 'err', text: error.message });
    } else {
      loadJobs();
    }
  }

  async function remove(job) {
    if (
      !window.confirm('متأكدة إنك عايزة تحذفي الوظيفة دي نهائيًا؟')
    ) {
      return;
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', job.id);

    if (error) {
      setMsg({ type: 'err', text: error.message });
    } else {
      loadJobs();
    }
  }

  function set(field) {
    return (event) =>
      setForm({ ...form, [field]: event.target.value });
  }

  return (
    <div className="container">
      <div className="admin-card">
        <div className="bar">
          <h2 style={{ margin: 0 }}>لوحة التحكم</h2>

          <div className="actions">
            {!form && (
              <button className="btn btn-sm" onClick={startNew}>
                + إضافة وظيفة
              </button>
            )}

            <button
              className="btn btn-sm btn-ghost"
              onClick={() => supabase.auth.signOut()}
            >
              تسجيل خروج
            </button>
          </div>
        </div>

        <VisitorStats />

        {msg && (
          <div className={`msg ${msg.type}`}>{msg.text}</div>
        )}

        {form ? (
          <form onSubmit={save}>
            <h2>{editingId ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}</h2>

            <div className="form-grid">
              <div className="field full">
                <label>عنوان الوظيفة *</label>
                <input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="مثال: وظائف شاغرة في شركة"
                />
              </div>

              <div className="field">
                <label>اسم الشركة / الجهة *</label>
                <input
                  value={form.company_name}
                  onChange={set('company_name')}
                />
              </div>

              <div className="field">
                <label>المدينة</label>
                <input
                  value={form.city}
                  onChange={set('city')}
                  placeholder="مثال: القاهرة"
                />
              </div>

              <div className="field">
                <label>المؤهل</label>
                <input
                  value={form.qualification}
                  onChange={set('qualification')}
                  placeholder="مثال: بكالوريوس فأعلى"
                />
              </div>

              <div className="field full">
                <label>
                  الوظائف المطلوبة (اكتبي كل وظيفة في سطر لو أكتر
                  من وظيفة)
                </label>
                <textarea
                  value={form.category}
                  onChange={set('category')}
                  placeholder={
                    'مثال:\nمحاسب\nمندوب مبيعات\nموظف خدمة عملاء'
                  }
                />
              </div>

              <div className="field">
                <label>عدد الوظائف</label>
                <input
                  inputMode="numeric"
                  value={form.jobs_count}
                  onChange={set('jobs_count')}
                />
              </div>

              <div className="field">
                <label>آخر موعد للتقديم (اختياري)</label>
                <input
                  type="date"
                  value={form.expires_date}
                  onChange={set('expires_date')}
                />
              </div>

              <div className="field full">
                <label>تفاصيل الوظيفة</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

              <div className="field full">
                <label>الشروط والمتطلبات</label>
                <textarea
                  value={form.requirements}
                  onChange={set('requirements')}
                />
              </div>

              <ImageField
                label="شعار الشركة (اختياري)"
                mode="logo"
                value={form.company_logo}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    company_logo: value,
                  }))
                }
              />

              <ImageField
                label="صورة الإعلان (اختياري)"
                mode="cover"
                value={form.cover_image}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    cover_image: value,
                  }))
                }
              />
            </div>

            <div className="field">
              <label>طريقة التقديم</label>
              <select
                value={form.application_type}
                onChange={set('application_type')}
              >
                <option value="Website">رابط موقع إلكتروني</option>
                <option value="Email">بريد إلكتروني</option>
                <option value="WhatsApp">واتساب</option>
                <option value="Interview">مقابلة شخصية</option>
                <option value="Other">طريقة أخرى</option>
              </select>
            </div>

            <div className="apply-fields">
              {form.application_type === 'Website' && (
                <div className="field" style={{ margin: 0 }}>
                  <label>رابط التقديم</label>
                  <input
                    dir="ltr"
                    value={form.application_url}
                    onChange={set('application_url')}
                    placeholder="https://..."
                  />
                </div>
              )}

              {form.application_type === 'Email' && (
                <div className="field" style={{ margin: 0 }}>
                  <label>البريد الإلكتروني</label>
                  <input
                    dir="ltr"
                    value={form.application_email}
                    onChange={set('application_email')}
                    placeholder="jobs@company.com"
                  />
                </div>
              )}

              {form.application_type === 'WhatsApp' && (
                <div className="field" style={{ margin: 0 }}>
                  <label>رقم الواتساب (بالكود الدولي)</label>
                  <input
                    dir="ltr"
                    value={form.application_whatsapp}
                    onChange={set('application_whatsapp')}
                    placeholder="201000000000"
                  />
                </div>
              )}

              {form.application_type === 'Interview' && (
                <div className="form-grid">
                  <div className="field">
                    <label>مكان المقابلة</label>
                    <input
                      value={form.interview_address}
                      onChange={set('interview_address')}
                    />
                  </div>

                  <div className="field">
                    <label>التاريخ والساعة</label>
                    <input
                      value={form.interview_date}
                      onChange={set('interview_date')}
                      placeholder="مثال: الأحد 4 أكتوبر - 10 ص"
                    />
                  </div>

                  <div
                    className="field full"
                    style={{ margin: 0 }}
                  >
                    <label>
                      ملاحظات / رقم تواصل (اختياري)
                    </label>
                    <textarea
                      value={form.other_instructions}
                      onChange={set('other_instructions')}
                    />
                  </div>
                </div>
              )}

              {form.application_type === 'Other' && (
                <div className="field" style={{ margin: 0 }}>
                  <label>اشرحي طريقة التقديم</label>
                  <textarea
                    value={form.other_instructions}
                    onChange={set('other_instructions')}
                  />
                </div>
              )}
            </div>

            <div className="form-grid">
              <div className="field">
                <label>الحالة</label>
                <select
                  value={form.status}
                  onChange={set('status')}
                >
                  <option value="published">منشورة</option>
                  <option value="hidden">مخفية</option>
                </select>
              </div>

              <div className="field">
                <label>
                  الرابط (slug) - اتركيه فاضي وهيتعمل تلقائي
                </label>
                <input
                  dir="ltr"
                  value={form.slug}
                  onChange={set('slug')}
                  placeholder="مثال: company-jobs"
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '4px 0 16px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(form.is_featured)}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_featured: event.target.checked,
                  })
                }
                style={{ width: 18, height: 18 }}
              />
              وظيفة مميزة (هتظهر بشارة حمراء وهتتقدم فوق باقي
              الوظائف)
            </label>

            <div className="actions">
              <button
                className="btn btn-sm"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'جاري الحفظ...'
                  : editingId
                    ? 'حفظ التعديلات'
                    : 'نشر الوظيفة'}
              </button>

              <button
                className="btn btn-sm btn-ghost"
                type="button"
                onClick={() => {
                  setForm(null);
                  setEditingId(null);
                  setMsg(null);
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <>
            <div
              style={{
                color: 'var(--muted)',
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              كل الوظائف ({jobs.length})
            </div>

            {jobs.length === 0 && (
              <div
                className="empty"
                style={{ marginBottom: 0 }}
              >
                <h3>لسه مفيش وظائف</h3>
                <p>دوسي "إضافة وظيفة" وابدئي.</p>
              </div>
            )}

            {jobs.map((job) => {
              const expired = isExpired(job);
              const hidden = job.status !== 'published';

              return (
                <div className="row" key={job.id}>
                  <div>
                    <div className="t">
                      {job.title}{' '}
                      {job.is_featured && (
                        <span
                          className="badge-featured"
                          style={{ marginInlineStart: 6 }}
                        >
                          مميز
                        </span>
                      )}
                    </div>

                    <div className="s">
                      {job.company_name} —{' '}
                      {formatDate(job.published_at)}
                    </div>
                  </div>

                  <div className="actions">
                    <span
                      className={`pill ${
                        hidden ? 'off' : expired ? 'exp' : 'ok'
                      }`}
                    >
                      {hidden
                        ? 'مخفية'
                        : expired
                          ? 'منتهية'
                          : 'منشورة'}
                    </span>

                    <Link
                      className="mini"
                      href={`/jobs/${job.slug}`}
                      target="_blank"
                    >
                      عرض
                    </Link>

                    <button
                      className="mini"
                      onClick={() => startEdit(job)}
                    >
                      تعديل
                    </button>

                    <button
                      className="mini"
                      onClick={() => toggleStatus(job)}
                    >
                      {hidden ? 'إظهار' : 'إخفاء'}
                    </button>

                    <button
                      className="mini danger"
                      onClick={() => remove(job)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErr('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);

    if (error) setErr('الإيميل أو الباسورد غلط.');
  }

  return (
    <div className="container">
      <div className="admin-card login-box">
        <h2>تسجيل الدخول</h2>

        {err && <div className="msg err">{err}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>كلمة المرور</label>
            <input
              type="password"
              dir="ltr"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            className="btn btn-sm"
            type="submit"
            disabled={busy}
          >
            {busy ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

const BUCKET = 'job-images';

async function resizeImage(file, mode) {
  const url = URL.createObjectURL(file);

  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (mode === 'logo') {
      const size = 256;
      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const scale = Math.min(
        (size * 0.88) / img.width,
        (size * 0.88) / img.height
      );

      const width = img.width * scale;
      const height = img.height * scale;

      ctx.drawImage(
        img,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height
      );
    } else {
      const scale = Math.min(1, 1000 / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error('تعذر تجهيز الصورة')),
        'image/jpeg',
        0.88
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ImageField({ label, value, onChange, mode }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handleFile(event) {
    const file = event.target.files && event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErr('اختاري ملف صورة (JPG أو PNG).');
      return;
    }

    setBusy(true);
    setErr('');

    try {
      const blob = await resizeImage(file, mode);

      const path = `${mode}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.jpg`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, {
          contentType: 'image/jpeg',
          cacheControl: '31536000',
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      onChange(data.publicUrl);
    } catch (error) {
      setErr(
        'فشل رفع الصورة: ' + (error.message || 'حاولي تاني')
      );
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <div className="field">
      <label>{label}</label>

      {value && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={value}
            alt=""
            style={{
              display: 'block',
              maxWidth: mode === 'logo' ? 72 : 240,
              maxHeight: mode === 'logo' ? 72 : 160,
              borderRadius: 10,
              border: '1px solid var(--line)',
              marginBottom: 6,
            }}
          />

          <button
            type="button"
            className="mini danger"
            onClick={() => onChange('')}
          >
            حذف الصورة
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={busy}
      />

      {busy && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            marginTop: 6,
          }}
        >
          جاري رفع الصورة...
        </div>
      )}

      {err && (
        <div
          className="msg err"
          style={{ marginTop: 8, marginBottom: 0 }}
        >
          {err}
        </div>
      )}
    </div>
  );
}
