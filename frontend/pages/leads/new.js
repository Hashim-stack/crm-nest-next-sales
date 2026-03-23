import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

const SOURCE_LABELS = {
  INSTAGRAM_AD:'Instagram Ad', FACEBOOK_AD:'Facebook Ad', GOOGLE_AD:'Google Ad',
  EMPLOYEE_REFERRAL:'Employee Referral', STUDENT_REFERRAL:'Student Referral',
  WALK_IN:'Walk-in', WEBSITE:'Website', YOUTUBE:'YouTube', OTHER:'Other',
};
const AD_SOURCES   = ['INSTAGRAM_AD','FACEBOOK_AD','GOOGLE_AD','YOUTUBE'];
const NAME_SOURCES = ['EMPLOYEE_REFERRAL','STUDENT_REFERRAL'];
const AD_OPTIONS   = {
  INSTAGRAM_AD: ['Summer Batch 2025','Full Stack Campaign','Data Science Reel Ad','Story Ad – React'],
  FACEBOOK_AD:  ['Lead Gen Form – FS','Carousel – All Courses','Retargeting Batch 25','Video Ad – Data Science'],
  GOOGLE_AD:    ['Search – Coding Courses','Display – Tech Courses','YouTube Pre-roll','Performance Max'],
  YOUTUBE:      ['Full Stack Intro Video','Python Crash Course Ad','Data Science Overview'],
};

export default function NewLead() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [courses, setCourses]       = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({
    name:'', phone:'', email:'', course_interest:'', status:'NEW',
    counselor_id:'', notes:'',
    lead_source:'', source_detail:'', source_campaign:'',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.filter(c => c.is_active))).catch(console.error);
  }, []);
  useEffect(() => {
    if (!ready) return;
    api.get('/users/counselors').then(r => setCounselors(r.data)).catch(console.error);
  }, [ready]);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const save = async () => {
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form };
      if (!payload.counselor_id) delete payload.counselor_id;
      else payload.counselor_id = +payload.counselor_id;
      if (!payload.lead_source) delete payload.lead_source;
      // Resolve campaign: if custom, use source_detail as display
      if (payload.source_campaign === '__custom__') delete payload.source_campaign;
      await api.post('/leads', payload);
      router.push('/leads');
    } catch(e) {
      setError(e.response?.data?.message || 'Failed to save lead.');
    } finally { setSaving(false); }
  };

  const src       = form.lead_source;
  const showAds   = AD_SOURCES.includes(src);
  const showName  = NAME_SOURCES.includes(src);

  const section = (label) => (
    <div style={{ borderTop:'1px solid var(--border)', paddingTop:16, marginTop:4 }}>
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text-faint)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>{label}</p>
    </div>
  );

  if (!ready) return <Layout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:256, color:'var(--accent)', fontWeight:600 }}>Loading...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth:560 }}>
        <div style={{ marginBottom:24 }}>
          <button onClick={() => router.push('/leads')} style={{ fontSize:13, color:'var(--text-faint)', background:'none', border:'none', cursor:'pointer', fontWeight:500, marginBottom:8, transition:'color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-faint)'}>← Back to Leads</button>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>Add New Lead</h1>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>Fill in the lead details below</p>
        </div>

        <div className="card" style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Basic info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div><label className="label">Full Name *</label><input className="input" placeholder="e.g. Arjun Menon" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
            <div><label className="label">Phone *</label><input className="input" placeholder="9876543210" value={form.phone} onChange={e=>set('phone',e.target.value)} /></div>
          </div>
          <div><label className="label">Email</label><input className="input" type="email" placeholder="arjun@email.com" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
          <div>
            <label className="label">Course Interest</label>
            <select className="input" value={form.course_interest} onChange={e=>set('course_interest',e.target.value)}>
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c.id} value={c.title}>{c.title} — ₹{Number(c.fees).toLocaleString('en-IN')}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: user?.role==='ADMIN' ? '1fr 1fr' : '1fr', gap:14 }}>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
                {['NEW','CONTACTED','DEMO','NEGOTIATION','CONVERTED','LOST'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {user?.role==='ADMIN' && (
              <div>
                <label className="label">Assign to Counselor</label>
                <select className="input" value={form.counselor_id} onChange={e=>set('counselor_id',e.target.value)}>
                  <option value="">— Unassigned —</option>
                  {counselors.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Lead Source section */}
          {section('Lead Source')}
          <div>
            <label className="label">Where did this lead come from?</label>
            <select className="input" value={src} onChange={e=>{ set('lead_source',e.target.value); set('source_detail',''); set('source_campaign',''); }}>
              <option value="">— Select source —</option>
              {Object.entries(SOURCE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {showAds && (
            <div>
              <label className="label">Which Ad / Campaign</label>
              <select className="input" value={form.source_campaign} onChange={e=>set('source_campaign',e.target.value)}>
                <option value="">— Select ad —</option>
                {(AD_OPTIONS[src]||[]).map(a=><option key={a} value={a}>{a}</option>)}
                <option value="__custom__">Other (type below)</option>
              </select>
              {form.source_campaign === '__custom__' && (
                <input className="input" style={{ marginTop:8 }} placeholder="Enter ad/campaign name" value={form.source_detail} onChange={e=>set('source_detail',e.target.value)} />
              )}
            </div>
          )}

          {showName && (
            <div>
              <label className="label">{src==='EMPLOYEE_REFERRAL' ? 'Employee Name' : 'Referred Student Name'}</label>
              <input className="input" placeholder={src==='EMPLOYEE_REFERRAL' ? 'e.g. Rahul Sharma' : 'e.g. Anjali Nair'} value={form.source_detail} onChange={e=>set('source_detail',e.target.value)} />
            </div>
          )}

          {src === 'OTHER' && (
            <div>
              <label className="label">Describe the source</label>
              <input className="input" placeholder="e.g. Newspaper ad, local event..." value={form.source_detail} onChange={e=>set('source_detail',e.target.value)} />
            </div>
          )}

          {/* Notes */}
          {section('Additional Notes')}
          <div>
            <textarea className="input" style={{ resize:'none' }} rows={3} placeholder="Any relevant notes..." value={form.notes} onChange={e=>set('notes',e.target.value)} />
          </div>

          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#F87171', fontSize:13, borderRadius:10, padding:'8px 14px' }}>{error}</div>}

          <div style={{ display:'flex', gap:12 }}>
            <button className="btn-primary" style={{ flex:1, padding:'12px' }} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Lead'}</button>
            <button className="btn-outline" style={{ flex:1, padding:'12px' }} onClick={() => router.push('/leads')}>Cancel</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
