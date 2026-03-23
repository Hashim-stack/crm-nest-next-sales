export default function StatCard({ title, value, icon, change }) {
  return (
    <div className="card stat-hover" style={{ cursor:'default' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontSize:28 }}>{icon}</div>
        {change && (
          <span style={{ fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:999, background:'var(--accent-light)', color:'var(--accent-text)' }}>{change}</span>
        )}
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'var(--text-base)' }}>{value}</div>
      <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>{title}</div>
    </div>
  );
}
