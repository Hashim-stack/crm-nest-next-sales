import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

export default function CounselorDashboard() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (ready) api.get('/leads').then(r => setLeads(r.data)).catch(console.error).finally(() => setLoading(false)); }, [ready]);

  const today     = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString());
  const converted = leads.filter(l => l.status === 'CONVERTED');

  const th = { textAlign:'left', padding:'10px 20px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-faint)', background:'var(--bg-input)' };
  const td = { padding:'12px 20px', fontSize:14, color:'var(--text-muted)', borderTop:'1px solid var(--border)' };

  if (!ready || loading) return (
    <Layout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:256, color:'var(--accent)', fontWeight:600 }}>Loading...</div></Layout>
  );

  return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>My Dashboard</h1>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Welcome back, {user?.name?.split(' ')[0]||'Counselor'}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          <StatCard title="My Total Leads" value={leads.length} />
          <StatCard title="Added Today"    value={today.length}  />
          <StatCard title="Converted"      value={converted.length}
            change={leads.length ? `${Math.round((converted.length/leads.length)*100)}%` : '0%'} />
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text-base)' }}>My Leads</h2>
            <button className="btn-primary" style={{ fontSize:12, padding:'6px 14px' }} onClick={() => router.push('/leads/new')}>+ New Lead</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Name','Course','Status','Notes','Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="tr-hover" style={{ cursor:'pointer' }} onClick={() => router.push('/leads')}>
                  <td style={td}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--accent-light)', color:'var(--accent-text)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>
                        {l.name.split(' ').map(w=>w[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:'var(--text-base)' }}>{l.name}</div>
                        <div style={{ fontSize:12, color:'var(--text-faint)' }}>{l.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td}>{l.course_interest}</td>
                  <td style={td}><StatusBadge status={l.status} /></td>
                  <td style={{ ...td, fontSize:12, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.notes||'—'}</td>
                  <td style={{ ...td, fontSize:12 }}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-faint)', fontSize:14 }}>
              No leads yet. <button onClick={() => router.push('/leads/new')} style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Add your first lead →</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
