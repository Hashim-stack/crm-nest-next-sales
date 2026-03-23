import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

const PIE_COLORS = ['#6EE7B7','#34D399','#10B981','#059669','#047857','#EF4444'];

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 12px', fontSize:12 }}>
      {label && <div style={{ fontWeight:700, color:'var(--text-base)', marginBottom:4 }}>{label}</div>}
      {payload.map((p,i) => <div key={i} style={{ color:p.color }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, ready } = useAuth('ADMIN');
  const [leads, setLeads]         = useState([]);
  const [students, setStudents]   = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { if (ready) loadData(); }, [ready]);

  const loadData = async () => {
    try {
      const [l, s, u] = await Promise.all([api.get('/leads'), api.get('/students'), api.get('/users')]);
      setLeads(l.data); setStudents(s.data);
      setCounselors(u.data.filter(x => x.role === 'COUNSELOR'));
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const statusCounts  = leads.reduce((a, l) => { a[l.status] = (a[l.status]||0)+1; return a; }, {});
  const pipelineData  = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const counselorData = counselors.map(c => ({
    name: c.name.split(' ')[0],
    leads:     leads.filter(l => l.counselor_id === c.id).length,
    converted: leads.filter(l => l.counselor_id === c.id && l.status === 'CONVERTED').length,
  }));

  if (!ready || loading) return (
    <Layout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:256, color:'var(--accent)', fontWeight:600 }}>Loading dashboard...</div></Layout>
  );

  const th = { textAlign:'left', padding:'10px 20px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-faint)', background:'var(--bg-input)' };
  const td = { padding:'12px 20px', fontSize:14, color:'var(--text-muted)', borderTop:'1px solid var(--border)' };

  return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>Dashboard</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>
              {new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
          <button className="btn-outline" style={{ fontSize:12 }} onClick={loadData}>↻ Refresh</button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          <StatCard title="Total Leads"       value={leads.length}                icon="" change="+12%" />
          <StatCard title="Students Enrolled" value={students.length}              icon="" change="+8%"  />
          <StatCard title="Counselors"        value={counselors.length}            icon="" />
          <StatCard title="Converted"         value={statusCounts['CONVERTED']||0} icon=""
            change={leads.length ? `${Math.round(((statusCounts['CONVERTED']||0)/leads.length)*100)}%` : '0%'} />
        </div>

        {/* Charts */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div className="card">
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text-base)', marginBottom:16 }}>Pipeline Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={3}>
                  {pipelineData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize:12, color:'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text-base)', marginBottom:16 }}>Counselor Performance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={counselorData} barSize={16}>
                <XAxis dataKey="name" tick={{ fontSize:12, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="leads"     fill="var(--accent-2)"  radius={[4,4,0,0]} name="Leads"     />
                <Bar dataKey="converted" fill="var(--accent)"    radius={[4,4,0,0]} name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent leads */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text-base)' }}>Recent Leads</h2>
            <button onClick={() => router.push('/leads')} style={{ fontSize:13, color:'var(--accent)', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>View all →</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Name','Course','Status','Counselor','Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {leads.slice(0,6).map(l => (
                <tr key={l.id} className="tr-hover">
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
                  <td style={{ ...td }}><StatusBadge status={l.status} /></td>
                  <td style={td}>{l.counselor?.name||'—'}</td>
                  <td style={{ ...td, fontSize:12 }}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
