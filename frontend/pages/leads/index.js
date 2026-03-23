import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import api from '../../lib/axios';
import useAuth from '../../hooks/useAuth';

const PIPELINE = ['NEW','CONTACTED','DEMO','NEGOTIATION','CONVERTED','LOST'];
const STATUSES  = ['ALL', ...PIPELINE];

const COL_COLORS = {
  NEW:'#94A3B8', CONTACTED:'#60A5FA', DEMO:'#A78BFA',
  NEGOTIATION:'#FBBF24', CONVERTED:'#10B981', LOST:'#F87171',
};

const SOURCE_LABELS = {
  INSTAGRAM_AD:'Instagram Ad', FACEBOOK_AD:'Facebook Ad', GOOGLE_AD:'Google Ad',
  EMPLOYEE_REFERRAL:'Employee Referral', STUDENT_REFERRAL:'Student Referral',
  WALK_IN:'Walk-in', WEBSITE:'Website', YOUTUBE:'YouTube', OTHER:'Other',
};

// Sources that need a campaign/ad selector
const AD_SOURCES   = ['INSTAGRAM_AD','FACEBOOK_AD','GOOGLE_AD','YOUTUBE'];
// Sources that need a person name
const NAME_SOURCES = ['EMPLOYEE_REFERRAL','STUDENT_REFERRAL'];

// Placeholder ad lists per platform
const AD_OPTIONS = {
  INSTAGRAM_AD: ['Summer Batch 2025','Full Stack Campaign','Data Science Reel Ad','Story Ad – React Native'],
  FACEBOOK_AD:  ['Lead Gen Form – FS','Carousel – All Courses','Retargeting Batch 25','Video Ad – Data Science'],
  GOOGLE_AD:    ['Search – Coding Courses','Display – Tech Courses','YouTube Pre-roll','Performance Max'],
  YOUTUBE:      ['Full Stack Intro Video','Python Crash Course Ad','Data Science Overview'],
};

// ─── Kanban Card ─────────────────────────────────────────────────────────────
function KanbanCard({ lead, onEdit, onDelete, isAdmin, dragging, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:12, padding:'12px 14px', marginBottom:8,
        cursor:'grab', userSelect:'none',
        opacity: dragging ? 0.45 : 1,
        boxShadow: dragging ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        transition:'opacity 0.15s, box-shadow 0.15s',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--accent-light)', color:'var(--accent-text)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
          {lead.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--text-base)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.name}</div>
          <div style={{ fontSize:11, color:'var(--text-faint)' }}>{lead.phone}</div>
        </div>
      </div>

      {lead.course_interest && (
        <div style={{ fontSize:11, fontWeight:600, color:'var(--accent)', background:'var(--accent-light)', padding:'2px 8px', borderRadius:6, display:'inline-block', marginBottom:8 }}>{lead.course_interest}</div>
      )}

      {lead.lead_source && (
        <div style={{ fontSize:10, color:'var(--text-faint)', marginBottom:6 }}>
          📍 {SOURCE_LABELS[lead.lead_source] || lead.lead_source}
          {lead.source_detail && <span> · {lead.source_detail}</span>}
        </div>
      )}

      {lead.counselor && (
        <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8 }}>👤 {lead.counselor.name}</div>
      )}

      <div style={{ display:'flex', gap:6, marginTop:4 }}>
        <button onClick={() => onEdit(lead)} style={{ flex:1, fontSize:11, fontWeight:600, padding:'4px 0', borderRadius:7, cursor:'pointer', background:'var(--accent-light)', color:'var(--accent-text)', border:'1px solid var(--border-strong)', transition:'opacity 0.15s' }}>Edit</button>
        {isAdmin && (
          <button onClick={() => onDelete(lead.id)} style={{ fontSize:11, fontWeight:600, padding:'4px 8px', borderRadius:7, cursor:'pointer', background:'rgba(239,68,68,0.1)', color:'#F87171', border:'1px solid rgba(239,68,68,0.25)', transition:'opacity 0.15s' }}>✕</button>
        )}
      </div>
    </div>
  );
}

// ─── Source Fields (reusable in new + edit) ───────────────────────────────────
function SourceFields({ form, setField }) {
  const src = form.lead_source || '';
  const showAds  = AD_SOURCES.includes(src);
  const showName = NAME_SOURCES.includes(src);

  return (
    <>
      <div>
        <label className="label">Lead Source</label>
        <select className="input" value={src} onChange={e => { setField('lead_source', e.target.value); setField('source_detail',''); setField('source_campaign',''); }}>
          <option value="">— Select source —</option>
          {Object.entries(SOURCE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {showAds && (
        <div>
          <label className="label">Which Ad / Campaign</label>
          <select className="input" value={form.source_campaign||''} onChange={e => setField('source_campaign', e.target.value)}>
            <option value="">— Select ad —</option>
            {(AD_OPTIONS[src]||[]).map(a => <option key={a} value={a}>{a}</option>)}
            <option value="__custom__">Other (type below)</option>
          </select>
          {form.source_campaign === '__custom__' && (
            <input className="input" style={{ marginTop:6 }} placeholder="Enter ad/campaign name" value={form.source_detail||''} onChange={e => setField('source_detail', e.target.value)} />
          )}
        </div>
      )}

      {showName && (
        <div>
          <label className="label">{src === 'EMPLOYEE_REFERRAL' ? 'Employee Name' : 'Referred Student Name'}</label>
          <input className="input" placeholder={src === 'EMPLOYEE_REFERRAL' ? 'e.g. Rahul Sharma' : 'e.g. Anjali Nair'} value={form.source_detail||''} onChange={e => setField('source_detail', e.target.value)} />
        </div>
      )}

      {src === 'OTHER' && (
        <div>
          <label className="label">Source Details</label>
          <input className="input" placeholder="Describe the source..." value={form.source_detail||''} onChange={e => setField('source_detail', e.target.value)} />
        </div>
      )}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Leads() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [leads, setLeads]           = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('ALL');
  const [view, setView]             = useState('table'); // 'table' | 'kanban'
  const [editLead, setEditLead]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [dragging, setDragging]     = useState(null); // lead id being dragged
  const [dragOver, setDragOver]     = useState(null); // column being hovered

  useEffect(() => { if (ready) loadData(); }, [ready]);

  const loadData = async () => {
    try {
      const isAdmin = user?.role === 'ADMIN';
      const reqs = [api.get('/leads')];
      if (isAdmin) reqs.push(api.get('/users/counselors'));
      const [l, u] = await Promise.all(reqs);
      setLeads(l.data);
      if (u) setCounselors(u.data);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleUpdate = async () => {
    const payload = { ...editLead };
    if (!payload.counselor_id) delete payload.counselor_id;
    const res = await api.patch(`/leads/${editLead.id}`, payload);
    setLeads(prev => prev.map(l => l.id === editLead.id ? res.data : l));
    setEditLead(null);
  };

  // Drag-and-drop: drop onto a column to change status
  const handleDrop = async (newStatus) => {
    if (!dragging) return;
    const lead = leads.find(l => l.id === dragging);
    if (!lead || lead.status === newStatus) { setDragging(null); setDragOver(null); return; }
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === dragging ? { ...l, status: newStatus } : l));
    setDragging(null); setDragOver(null);
    try { await api.patch(`/leads/${dragging}`, { status: newStatus }); }
    catch(e) { console.error(e); loadData(); }
  };

  const filtered = leads.filter(l =>
    (filter === 'ALL' || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) ||
     (l.course_interest||'').toLowerCase().includes(search.toLowerCase()) ||
     l.phone.includes(search))
  );

  const th = { textAlign:'left', padding:'10px 20px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-faint)', background:'var(--bg-input)' };
  const td = { padding:'12px 20px', fontSize:14, color:'var(--text-muted)', borderTop:'1px solid var(--border)' };

  if (!ready || loading) return (
    <Layout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:256, color:'var(--accent)', fontWeight:600 }}>Loading leads...</div></Layout>
  );

  return (
    <Layout>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--text-base)' }}>Leads</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>{filtered.length} leads found</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {/* View toggle */}
            <div style={{ display:'flex', border:'1.5px solid var(--border-strong)', borderRadius:10, overflow:'hidden' }}>
              {[['table','☰ Table'],['kanban','⬛ Kanban']].map(([v,l]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', border:'none',
                  background: view===v ? 'var(--accent)' : 'transparent',
                  color:      view===v ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}>{l}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={() => router.push('/leads/new')}>+ Add Lead</button>
          </div>
        </div>

        {/* Filters row */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          <input className="input" style={{ width:260 }} placeholder="🔍  Search name, course, phone..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {view === 'table' && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{
                  fontSize:12, fontWeight:600, padding:'5px 12px', borderRadius:999, cursor:'pointer', transition:'all 0.15s',
                  background: filter===s ? 'var(--accent)' : 'transparent',
                  color:      filter===s ? '#fff' : 'var(--text-muted)',
                  border:     filter===s ? '1.5px solid var(--accent)' : '1.5px solid var(--border-strong)',
                }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {/* ── TABLE VIEW ─────────────────────────────────────────────────── */}
        {view === 'table' && (
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>{['Name & Contact','Course','Source','Status','Counselor','Date','Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="tr-hover">
                    <td style={td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--accent-light)', color:'var(--accent-text)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                          {l.name.split(' ').map(w=>w[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'var(--text-base)' }}>{l.name}</div>
                          <div style={{ fontSize:12, color:'var(--text-faint)' }}>{l.phone} · {l.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}>{l.course_interest}</td>
                    <td style={{ ...td, fontSize:12 }}>
                      {l.lead_source ? (
                        <div>
                          <div style={{ fontWeight:600, color:'var(--text-base)', fontSize:12 }}>{SOURCE_LABELS[l.lead_source]||l.lead_source}</div>
                          {(l.source_campaign || l.source_detail) && (
                            <div style={{ fontSize:11, color:'var(--text-faint)' }}>{l.source_campaign && l.source_campaign !== '__custom__' ? l.source_campaign : l.source_detail}</div>
                          )}
                        </div>
                      ) : <span style={{ color:'var(--text-faint)' }}>—</span>}
                    </td>
                    <td style={td}><StatusBadge status={l.status} /></td>
                    <td style={td}>{l.counselor?.name||'—'}</td>
                    <td style={{ ...td, fontSize:12 }}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={td}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => setEditLead({...l})} style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:8, cursor:'pointer', background:'var(--accent-light)', color:'var(--accent-text)', border:'1px solid var(--border-strong)' }}>Edit</button>
                        {user?.role === 'ADMIN' && (
                          <button className="btn-danger" style={{ padding:'4px 8px', fontSize:12 }} onClick={() => handleDelete(l.id)}>✕</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-faint)', fontSize:14 }}>No leads match your filters.</div>}
          </div>
        )}

        {/* ── KANBAN VIEW ────────────────────────────────────────────────── */}
        {view === 'kanban' && (
          <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:12, alignItems:'flex-start' }}>
            {PIPELINE.map(col => {
              const colLeads = leads.filter(l =>
                l.status === col &&
                (l.name.toLowerCase().includes(search.toLowerCase()) ||
                 (l.course_interest||'').toLowerCase().includes(search.toLowerCase()) ||
                 l.phone.includes(search))
              );
              const isDragTarget = dragOver === col;

              return (
                <div
                  key={col}
                  onDragOver={e => { e.preventDefault(); setDragOver(col); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(col)}
                  style={{
                    minWidth:240, width:240, flexShrink:0,
                    background: isDragTarget ? 'var(--bg-hover)' : 'var(--bg-input)',
                    border: isDragTarget ? `2px solid ${COL_COLORS[col]}` : '2px solid transparent',
                    borderRadius:16, padding:'12px 10px',
                    transition:'border-color 0.15s, background 0.15s',
                  }}
                >
                  {/* Column header */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, padding:'0 4px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:COL_COLORS[col], display:'inline-block' }} />
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--text-base)', letterSpacing:'0.04em' }}>{col}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-muted)', padding:'1px 8px', borderRadius:999 }}>{colLeads.length}</span>
                  </div>

                  {/* Cards */}
                  {colLeads.map(l => (
                    <KanbanCard key={l.id} lead={l}
                      onEdit={lead => setEditLead({...lead})}
                      onDelete={handleDelete}
                      isAdmin={user?.role==='ADMIN'}
                      dragging={dragging === l.id}
                      onDragStart={() => setDragging(l.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    />
                  ))}

                  {colLeads.length === 0 && (
                    <div style={{ textAlign:'center', padding:'24px 0', color:'var(--text-faint)', fontSize:12, borderRadius:10, border:'2px dashed var(--border)' }}>
                      {isDragTarget ? 'Drop here' : 'No leads'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────────── */}
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, maxHeight:'72vh', overflowY:'auto', paddingRight:4 }}>
            {[['name','Name'],['phone','Phone'],['email','Email'],['course_interest','Course Interest'],['notes','Notes']].map(([f,l]) => (
              <div key={f}><label className="label">{l}</label>
                <input className="input" value={editLead[f]||''} onChange={e => setEditLead({...editLead,[f]:e.target.value})} />
              </div>
            ))}
            <div><label className="label">Status</label>
              <select className="input" value={editLead.status} onChange={e => setEditLead({...editLead,status:e.target.value})}>
                {PIPELINE.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {user?.role==='ADMIN' && (
              <div><label className="label">Assign Counselor</label>
                <select className="input" value={editLead.counselor_id||''} onChange={e => setEditLead({...editLead,counselor_id:+e.target.value})}>
                  <option value="">— Unassigned —</option>
                  {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* divider */}
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'var(--text-faint)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>Lead Source</p>
              <SourceFields
                form={editLead}
                setField={(k,v) => setEditLead(prev => ({...prev,[k]:v}))}
              />
            </div>

            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button className="btn-primary" style={{ flex:1 }} onClick={handleUpdate}>Save Changes</button>
              <button className="btn-outline" style={{ flex:1 }} onClick={() => setEditLead(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
