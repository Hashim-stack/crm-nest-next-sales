import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

export default function Courses() {
  const { ready } = useAuth();
  const [courses, setCourses] = useState([]);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({ title:'', duration:'', fees:'', description:'' });

  useEffect(() => { if (ready) api.get('/courses').then(r => setCourses(r.data)); }, [ready]);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const save = async () => {
    const res = await api.post('/courses', { ...form, fees:+form.fees });
    setCourses(prev => [res.data, ...prev]);
    setModal(false);
    setForm({ title:'', duration:'', fees:'', description:'' });
  };

  const remove = async (id) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    setCourses(prev => prev.filter(x => x.id !== id));
  };

  return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>Courses</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>{courses.length} courses available</p>
          </div>
          <button className="btn-primary" onClick={() => setModal(true)}>+ Add Course</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {courses.map(c => (
            <div key={c.id} className="card stat-hover">
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:12 }}>📚</div>
                <button onClick={() => remove(c.id)} style={{ background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', fontSize:14, transition:'color 0.15s', padding:4 }}
                  onMouseEnter={e=>e.currentTarget.style.color='#EF4444'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-faint)'}>✕</button>
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text-base)' }}>{c.title}</h3>
              <p style={{ fontSize:12, color:'var(--text-faint)', marginTop:4, marginBottom:16, lineHeight:1.5 }}>{c.description||'No description'}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, fontWeight:600, padding:'3px 10px', borderRadius:8, background:'var(--accent-light)', color:'var(--accent-text)', border:'1px solid var(--border-strong)' }}>{c.duration}</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:'var(--accent)', fontSize:16 }}>₹{Number(c.fees).toLocaleString('en-IN')}</span>
              </div>
              {!c.is_active && <div style={{ marginTop:8, fontSize:10, color:'var(--text-faint)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>Inactive</div>}
            </div>
          ))}
        </div>

        {courses.length===0 && (
          <div style={{ textAlign:'center', padding:'64px 20px', color:'var(--text-faint)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📚</div>
            <p style={{ fontSize:14 }}>No courses yet. Add your first course.</p>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Course">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label className="label">Course Title</label><input className="input" placeholder="e.g. Full Stack Development" value={form.title} onChange={e => set('title',e.target.value)} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label className="label">Duration</label><input className="input" placeholder="e.g. 6 months" value={form.duration} onChange={e => set('duration',e.target.value)} /></div>
            <div><label className="label">Fees (₹)</label><input type="number" className="input" placeholder="25000" value={form.fees} onChange={e => set('fees',e.target.value)} /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" style={{ resize:'none' }} rows={3} placeholder="Course description..." value={form.description} onChange={e => set('description',e.target.value)} /></div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-primary" style={{ flex:1 }} onClick={save}>Save Course</button>
            <button className="btn-outline" style={{ flex:1 }} onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}