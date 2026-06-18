/* ============================================================
   NEXUS — Reports list + Candidate Comparison
   ============================================================ */
(function(){
const { useState } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, ConfidenceChip, PageHeader, EmptyState, toast } = window;
const TableShell=window.__TableShell, Th=window.__Th, Td=window.__Td;

function Reports({ go }) {
  const NX=window.NX; const [tab,setTab]=useState('All');
  let rows=NX.REPORTS;
  if(tab==='Caution') rows=rows.filter(r=>r.status.includes('Caution')||r.status.includes('Partial'));
  else if(tab!=='All') rows=rows.filter(r=>r.status===tab);
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Reports" sub="172 governed reports across your workspace."
      actions={<><Button variant="secondary" icon="download" onClick={()=>toast('Export started','info')}>Export</Button>
        <Button variant="secondary" icon="compare" onClick={()=>go('comparison')}>Compare</Button></>}/>
    <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
      {['All','Released','Caution','Processing'].map(f=><Chip key={f} active={tab===f} onClick={()=>setTab(f)} tone="indigo">{f}</Chip>)}</div>
    <TableShell>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
          <tr><Th>Report</Th><Th>Candidate</Th><Th>Type</Th><Th>Blueprint</Th><Th>Completed</Th><Th>Confidence</Th><Th>Domain 6</Th><Th>Status</Th><Th w={90}></Th></tr></thead>
        <tbody className="nx-stagger" key={rows.length}>
          {rows.map(r=>(
            <tr key={r.id} onClick={()=>go('report-detail',{id:r.id})} style={{borderTop:'1px solid var(--border-soft)',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td><span className="mono" style={{fontSize:12,color:'var(--text-2)'}}>{r.id}</span></Td>
              <Td><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={r.candidate} size={30}/>
                <div><div style={{fontWeight:600,fontSize:13}}>{r.candidate}</div><div style={{fontSize:11.5,color:'var(--text-3)'}}>{r.role}</div></div></div></Td>
              <Td style={{fontSize:12.5,color:'var(--text-2)'}}>{r.type}</Td>
              <Td style={{fontSize:12.5}}>{r.blueprint}</Td>
              <Td style={{fontSize:12.5,color:'var(--text-2)'}}>{r.date}</Td>
              <Td><ConfidenceChip level={r.confidence}/></Td>
              <Td style={{fontSize:12.5}}>{r.d6==='—'?<span style={{color:'var(--text-3)'}}>—</span>:<span style={{fontWeight:600,color:r.d6.includes('Strong')?'var(--teal-700)':'var(--amber-700)'}}>{r.d6}</span>}</Td>
              <Td><StatusBadge status={r.status} size="sm"/></Td>
              <Td><div onClick={e=>e.stopPropagation()} style={{display:'flex',gap:4}}>
                <IconButton name="download" tip="PDF" size={16}/><IconButton name="compare" tip="Compare" size={16} onClick={()=>go('comparison')}/></div></Td>
            </tr>))}
        </tbody>
      </table>
    </TableShell>
  </div>;
}

/* ---------------- Candidate Comparison ---------------- */
function Comparison({ go }) {
  const CMP=window.NX.COMPARISON;
  const [cands,setCands]=useState(CMP.candidates);
  const matchTone={Strong:'teal',Good:'indigo',Conditional:'amber'};
  const remove=(name)=>setCands(c=>c.length>1?c.filter(x=>x.name!==name):c);
  const best=(di)=>Math.max(...cands.map(c=>c.scores[di]));
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Candidate Comparison" sub="Explainable, side-by-side comparison against one role. Supports human judgement — never an automatic decision."
      actions={<><Button variant="secondary" icon="download" onClick={()=>toast('Export started','info','Comparison is being exported.')}>Export</Button>
        <Button variant="secondary" icon="download">Download PDF</Button></>}/>
    {/* setup bar */}
    <div style={{display:'flex',gap:14,alignItems:'center',padding:'14px 18px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',marginBottom:18,boxShadow:'var(--sh-sm)',flexWrap:'wrap'}}>
      {[['Target Role',CMP.role],['Role Blueprint',CMP.blueprint],['Context Profile',CMP.context]].map((m,i)=>
        <div key={i}><div style={{fontSize:10.5,color:'var(--text-3)',fontWeight:700,textTransform:'uppercase'}}>{m[0]}</div>
          <div style={{fontSize:13.5,fontWeight:600,marginTop:2}}>{m[1]}</div></div>)}
      <div style={{flex:1}}></div>
      <Chip tone="violet" icon="layers">Domain 6 enabled</Chip>
    </div>
    {/* warning */}
    <div style={{display:'flex',gap:10,padding:'11px 16px',background:'var(--amber-50)',border:'1px solid var(--amber-100)',borderRadius:'var(--r-md)',marginBottom:18}}>
      <Icon name="info" size={16} color="var(--amber-700)"/>
      <div style={{fontSize:12.5,color:'var(--amber-700)',lineHeight:1.5}}>Nexus does not produce an automatic hiring decision. Use this comparison to inform structured, evidence-based judgement.</div></div>

    <div style={{overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:`200px repeat(${cands.length},minmax(190px,1fr))`,gap:0,
        border:'1px solid var(--border)',borderRadius:'var(--r-lg)',overflow:'hidden',background:'var(--surface)',boxShadow:'var(--sh-sm)',minWidth:640}}>
        {/* header row */}
        <div style={{padding:'18px',borderBottom:'1px solid var(--border)',borderRight:'1px solid var(--border-soft)',background:'var(--surface-2)'}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--text-3)'}}>Candidate</div></div>
        {cands.map((c,i)=><div key={c.name} style={{padding:'16px',borderBottom:'1px solid var(--border)',borderRight:i<cands.length-1?'1px solid var(--border-soft)':'none',textAlign:'center',position:'relative'}}>
          <div style={{position:'absolute',top:8,right:8}}><IconButton name="x" size={14} tip="Remove" onClick={()=>remove(c.name)}/></div>
          <Avatar name={c.name} size={48}/>
          <div style={{fontSize:14,fontWeight:700,marginTop:8}}>{c.name}</div>
          <div style={{marginTop:8,display:'flex',justifyContent:'center'}}><Chip tone={matchTone[c.match]}>{c.match} match</Chip></div>
        </div>)}
        {/* CAI row */}
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border-soft)',borderRight:'1px solid var(--border-soft)',display:'flex',alignItems:'center'}}>
          <div><div style={{fontSize:13,fontWeight:600}}>Contextual Alignment</div><div style={{fontSize:11,color:'var(--text-3)'}}>Domain 6 · CAI</div></div></div>
        {cands.map((c,i)=>{ const isBest=c.cai===Math.max(...cands.map(x=>x.cai));
          return <div key={c.name} style={{padding:'14px',borderBottom:'1px solid var(--border-soft)',borderRight:i<cands.length-1?'1px solid var(--border-soft)':'none',display:'flex',justifyContent:'center',alignItems:'center',gap:8}}>
            <window.Ring value={c.cai} size={52} stroke={5} color={isBest?'var(--teal-600)':'var(--indigo-500)'}/>
            {isBest && <span style={{fontSize:10.5,fontWeight:700,color:'var(--teal-700)'}}>Highest</span>}</div>;})}
        {/* dimension rows */}
        {CMP.dimensions.map((dim,di)=><React.Fragment key={dim}>
          <div style={{padding:'13px 18px',borderBottom:di<CMP.dimensions.length-1?'1px solid var(--border-soft)':'none',borderRight:'1px solid var(--border-soft)',display:'flex',alignItems:'center'}}>
            <span style={{fontSize:12.5,fontWeight:500}}>{dim}</span></div>
          {cands.map((c,i)=>{ const v=c.scores[di]; const isBest=v===best(di);
            return <div key={c.name} style={{padding:'13px 14px',borderBottom:di<CMP.dimensions.length-1?'1px solid var(--border-soft)':'none',borderRight:i<cands.length-1?'1px solid var(--border-soft)':'none',display:'flex',alignItems:'center',gap:10}}>
              <div style={{flex:1}}><window.ScoreBar value={v} color={isBest?'var(--teal-600)':'var(--indigo-400)'} delay={di*30}/></div>
              <span className="tnum" style={{fontSize:13,fontWeight:isBest?700:600,width:24,color:isBest?'var(--teal-700)':'var(--text)'}}>{v}</span></div>;})}
        </React.Fragment>)}
      </div>
    </div>

    {/* per-candidate qualitative */}
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cands.length},1fr)`,gap:14,marginTop:18}}>
      {cands.map((c,i)=><div key={c.name} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}><Avatar name={c.name} size={32}/><div style={{fontSize:14,fontWeight:700}}>{c.name}</div></div>
        <div style={{fontSize:11,fontWeight:700,color:'var(--teal-700)',marginBottom:6,textTransform:'uppercase'}}>Strengths</div>
        <div style={{fontSize:12.5,color:'var(--text-2)',lineHeight:1.5,marginBottom:12}}>{['Integrity & numerical reasoning','Decision complexity & integrity','Self-regulation & resilience'][i]}</div>
        <div style={{fontSize:11,fontWeight:700,color:'var(--amber-700)',marginBottom:6,textTransform:'uppercase'}}>Stretch</div>
        <div style={{fontSize:12.5,color:'var(--text-2)',lineHeight:1.5,marginBottom:12}}>{['Exploratory openness','Resilience under load','Numerical reasoning'][i]}</div>
        <Button size="sm" variant="secondary" full onClick={()=>go('report-detail',{id:'RPT-5501'})}>Open Report</Button>
      </div>)}
    </div>
  </div>;
}

window.ADMIN_PAGES.reports = Reports;
window.ADMIN_PAGES.comparison = Comparison;
})();
