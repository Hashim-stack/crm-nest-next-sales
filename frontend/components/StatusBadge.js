const DOT = { NEW:'#94A3B8', CONTACTED:'#60A5FA', DEMO:'#A78BFA', NEGOTIATION:'#FBBF24', CONVERTED:'#10B981', LOST:'#F87171' };

export default function StatusBadge({ status }) {
  return (
    <span className={`status-${status}`} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:999 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:DOT[status]||'#94A3B8', display:'inline-block', flexShrink:0 }} />
      {status}
    </span>
  );
}
