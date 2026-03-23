import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

export default function Counselors() {
  const { ready } = useAuth('ADMIN');
  const [counselors, setCounselors] = useState([]);
  const [leads, setLeads]           = useState([]);
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState({ name:'', email:'', password:'', phone:'', role:'COUNSELOR' });
  const [error, setError]           = useState('');

  useEffect(() => { if (ready) loadData(); }, [ready]);

  const loadData = () => Promise.all([api.get('/users'), api.get('/leads')])
    .then(([u,l]) => { setCounselors(u.data.filter(x=>x.role==='COUNSELOR')); setLeads(l.data); })
    .catch(console.error);

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const save = async () => {
    setError('');
    try {
      await api.post('/auth/register', form);
      setModal(false);
      setForm({ name:'', email:'', password:'', phone:'', role:'COUNSELOR' });
      loadData();
    } catch(e) { setError(e.response?.data?.message||'Failed to add counselor'); }
  };

  return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>Counselors</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>{counselors.length} academic counselors</p>
          </div>
          <button className="btn-primary" onClick={() => setModal(true)}>+ Add Counselor</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {counselors.map(c => {
            const myLeads   = leads.filter(l => l.counselor_id === c.id);
            const converted = myLeads.filter(l => l.status === 'CONVERTED');
            const rate      = myLeads.length ? Math.round((converted.length/myLeads.length)*100) : 0;
            return (
              <div key={c.id} className="card">
                <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,var(--grad-from),var(--grad-to))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 }}>
                    {c.name.split(' ').map(w=>w[0]).join('')}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:'var(--text-base)' }}>{c.name}</div>
                    <div style={{ fontSize:13, color:'var(--text-faint)' }}>{c.email}</div>
                  </div>
                  <div style={{ display:'flex', gap:32, textAlign:'center' }}>
                    {[['Total Leads',myLeads.length],['Converted',converted.length],['Rate',`${rate}%`]].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'var(--accent)' }}>{v}</div>
                        <div style={{ fontSize:12, color:'var(--text-faint)' }}>{k}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ width:144 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                      <span style={{ color:'var(--text-muted)' }}>Conversion</span>
                      <span style={{ fontWeight:700, color:'var(--accent)' }}>{rate}%</span>
                    </div>
                    <div style={{ height:8, borderRadius:4, background:'var(--accent-light)', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, background:'linear-gradient(90deg,var(--grad-from),var(--grad-to))', width:`${rate}%`, transition:'width 0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {counselors.length===0 && <div style={{ textAlign:'center', padding:'64px 20px', color:'var(--text-faint)', fontSize:14 }}>No counselors yet.</div>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Counselor">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[['name','Full Name','text'],['email','Email','email'],['password','Password','password'],['phone','Phone','tel']].map(([k,l,t]) => (
            <div key={k}><label className="label">{l}</label><input type={t} className="input" value={form[k]} onChange={e => set(k,e.target.value)} /></div>
          ))}
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#F87171', fontSize:13, borderRadius:10, padding:'8px 14px' }}>{error}</div>}
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-primary" style={{ flex:1 }} onClick={save}>Add Counselor</button>
            <button className="btn-outline" style={{ flex:1 }} onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
