/* ============================================================
   NEXUS — Context Profiles (list, builder, detail, mini-viz)
   ============================================================ */
(function(){
const { useState } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Chip, PageHeader, Slider, toast } = window;
const TableShell=window.__TableShell, Th=window.__Th, Td=window.__Td;
const FIELDS=window.NX.CONTEXT_FIELDS;

/* ---- compact bar visualization of a context's values ---- */
function ContextMini({ vals }) {
  return <div style={{display:'flex',flexDirection:'column',gap:7}}>
    {FIELDS.map((f,i)=>{ const v=vals[f.key]; const pct=v/f.max*100;
      const color = pct>=70?'var(--rose-600)':pct>=45?'var(--amber-600)':'var(--teal-600)';
      return <div key={f.key} style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{width:118,fontSize:11,color:'var(--text-2)',fontWeight:500,flex:'none'}} className="clip">{f.label}</span>
        <div style={{flex:1,height:6,background:'var(--track)',borderRadius:99,overflow:'hidden'}}>
          <window.ScoreBar value={v} max={f.max} color={color} height={6} delay={i*30}/></div>
        <span style={{fontSize:10.5,fontWeight:700,color:'var(--text-3)',width:14,textAlign:'right'}}>{v}</span>
      </div>;})}
  </div>;
}
window.__ContextMini = ContextMini;

/* ---- radial "context signature" ---- */
function ContextRadar({ vals, size=300 }) {
  const axes=[
    {k:'decision_stakes',l:'Stakes'},{k:'ambiguity',l:'Ambiguity'},{k:'time_pressure',l:'Pace'},
    {k:'stakeholder',l:'Stakeholders'},{k:'regulatory',l:'Regulation'},{k:'autonomy',l:'Autonomy'},
    {k:'innovation',l:'Innovation'},{k:'precision',l:'Precision'},
  ];
  const cx=size/2,cy=size/2,R=size/2-46;
  const pt=(i,r)=>{ const a=-Math.PI/2+i/axes.length*2*Math.PI; return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]; };
  const poly=axes.map((ax,i)=>pt(i,(vals[ax.k]/5)*R).join(',')).join(' ');
  return <svg width={size} height={size}>
    {[1,2,3,4,5].map(r=><polygon key={r} points={axes.map((ax,i)=>pt(i,r/5*R).join(',')).join(' ')}
      fill="none" stroke="var(--grid-line)" strokeWidth="1"/>)}
    {axes.map((ax,i)=>{ const [x,y]=pt(i,R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--grid-line-2)" strokeWidth="1"/>;})}
    <polygon points={poly} fill="rgba(79,70,229,.16)" stroke="#4F46E5" strokeWidth="2" style={{animation:'scaleIn .6s var(--ease-out)',transformOrigin:'center'}}/>
    {axes.map((ax,i)=>pt(i,(vals[ax.k]/5)*R)).map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#4F46E5"/>)}
    {axes.map((ax,i)=>{ const [x,y]=pt(i,R+22); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
      fontSize="10.5" fontWeight="600" fill="#818B9C">{ax.l}</text>;})}
  </svg>;
}
window.__ContextRadar = ContextRadar;

/* ---------------- list ---------------- */
function Contexts({ go }) {
  const NX=window.NX;
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Context Profiles" sub="Describe the environment a role operates in — the engine behind Domain 6 contextual alignment."
      actions={<><Button variant="secondary" icon="download" onClick={()=>toast('Export started','info')}>Export</Button>
        <Button icon="plus" onClick={()=>go('create-context')}>Create Context Profile</Button></>}/>
    <TableShell>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
          <tr><Th>Context Name</Th><Th>Linked Role</Th><Th>Family</Th><Th>Level</Th><Th>Linked Blueprint</Th><Th>Status</Th><Th>Updated</Th><Th w={44}></Th></tr></thead>
        <tbody className="nx-stagger">
          {NX.CONTEXTS.map(c=>(
            <tr key={c.id} onClick={()=>go('context-detail',{id:c.id})} style={{borderTop:'1px solid var(--border-soft)',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td><div style={{display:'flex',alignItems:'center',gap:11}}>
                <div style={{width:32,height:32,borderRadius:9,background:'var(--teal-50)',color:'var(--teal-600)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="context" size={16}/></div>
                <span style={{fontWeight:600}}>{c.name}</span></div></Td>
              <Td>{c.role}</Td><Td style={{color:'var(--text-2)'}}>{c.family}</Td><Td style={{color:'var(--text-2)'}}>{c.level}</Td>
              <Td style={{fontSize:12.5}}>{c.blueprint}</Td><Td><StatusBadge status={c.status} size="sm"/></Td>
              <Td style={{color:'var(--text-3)',fontSize:12.5}}>{c.updated}</Td>
              <Td><div onClick={e=>e.stopPropagation()}><IconButton name="more"/></div></Td>
            </tr>))}
        </tbody>
      </table>
    </TableShell>
  </div>;
}

/* ---------------- create (sliders) ---------------- */
const GROUPS=[
  {title:'Scope & Stakes',fields:['leadership_scope','decision_stakes','failure_cost','autonomy']},
  {title:'Demand & Pace',fields:['ambiguity','time_pressure','change','innovation']},
  {title:'Discipline & Constraint',fields:['regulatory','precision','interdependence']},
  {title:'People & Pressure',fields:['stakeholder','customer','conflict']},
];
function CreateContext({ go }) {
  const init={}; FIELDS.forEach(f=>init[f.key]=f.key==='leadership_scope'?2:3);
  const [vals,setVals]=useState(init);
  const [name,setName]=useState('');
  const set=(k,v)=>setVals(p=>({...p,[k]:v}));
  const labelsFor=f=> f.key==='leadership_scope'?['None','','','','Org-wide']:['Low','','Mod','','High'];
  return <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--canvas)'}}>
    <div style={{height:60,flex:'none',display:'flex',alignItems:'center',gap:16,padding:'0 24px',background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
      <window.NexusMark size={26}/><div style={{fontSize:15,fontWeight:700}}>Create Context Profile</div>
      <div style={{flex:1}}></div>
      <window.ThemeToggle/>
      <Button variant="ghost" onClick={()=>go('contexts')}>Cancel</Button>
      <Button variant="secondary" onClick={()=>{toast('Draft saved','success');go('contexts');}}>Save Draft</Button>
      <Button icon="check" onClick={()=>{toast('Context activated','success',(name||'New context')+' is now active.');go('contexts');}}>Activate</Button>
    </div>
    <div style={{flex:1,display:'flex',minHeight:0}}>
      <div style={{flex:1,overflow:'auto',padding:'28px 36px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{marginBottom:24}}>
            <label style={{fontSize:12.5,fontWeight:600,color:'var(--text-2)'}}>Context Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Finance Manager · Regulated"
              style={{width:'100%',marginTop:6,padding:'12px 14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:15,fontWeight:600,background:'var(--surface)'}}/>
            <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
              {['Job Family: Finance','Level: Manager'].map(c=><Chip key={c} tone="slate">{c}</Chip>)}</div>
          </div>
          {GROUPS.map((g,gi)=>(
            <div key={gi} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'20px 22px',marginBottom:16,boxShadow:'var(--sh-sm)'}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>{g.title}</h3>
              <div className="nx-g2" style={{gap:'22px 32px'}}>
                {g.fields.map(k=>{ const f=FIELDS.find(x=>x.key===k);
                  return <div key={k}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:6}}>{f.label}
                        <window.Tooltip text={f.desc}><Icon name="info" size={13} color="var(--text-3)"/></window.Tooltip></span>
                      <span style={{fontSize:12,fontWeight:700,color:'var(--indigo-600)',width:24,textAlign:'right'}}>{vals[k]}</span></div>
                    <Slider value={vals[k]} onChange={v=>set(k,v)} min={f.key==='leadership_scope'?0:1} max={f.max} labels={labelsFor(f)}/>
                  </div>;})}
              </div>
            </div>
          ))}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'20px 22px',boxShadow:'var(--sh-sm)'}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Success Profile Notes</h3>
            <textarea placeholder="Qualitative notes that support interpretation…" style={{width:'100%',padding:'11px 13px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:13.5,minHeight:80,resize:'vertical',background:'var(--surface)'}}/>
          </div>
        </div>
      </div>
      {/* live summary */}
      <div style={{width:360,flex:'none',borderLeft:'1px solid var(--border)',background:'var(--surface)',overflow:'auto',padding:24}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>Context Signature</div>
        <div style={{fontSize:12,color:'var(--text-3)',marginBottom:8}}>Updates live as you tune the sliders.</div>
        <div style={{display:'flex',justifyContent:'center',margin:'4px 0 18px'}}><ContextRadar vals={vals} size={300}/></div>
        <ContextMini vals={vals}/>
      </div>
    </div>
  </div>;
}

/* ---------------- detail ---------------- */
function ContextDetail({ go, route }) {
  const NX=window.NX;
  const c=NX.CONTEXTS.find(x=>x.id===route.params.id)||NX.CONTEXTS[0];
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader breadcrumb={[{label:'Context Profiles',onClick:()=>go('contexts')},{label:c.name}]} title={c.name} sub={`${c.role} · ${c.family} · ${c.level}`}
      actions={<><Button variant="secondary" icon="copy">Duplicate</Button><Button variant="secondary" icon="link">Link to Blueprint</Button><Button icon="edit" onClick={()=>go('create-context')}>Edit</Button></>}/>
    <div className="nx-g2" style={{gap:20}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h3 style={{fontSize:14,fontWeight:700,alignSelf:'flex-start',marginBottom:6}}>Visual Context Map</h3>
        <ContextRadar vals={c.vals} size={320}/>
        <div style={{display:'flex',gap:10,marginTop:8,flexWrap:'wrap',justifyContent:'center'}}>
          <StatusBadge status={c.status}/><Chip tone="slate">Linked: {c.blueprint}</Chip></div>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Context Dimensions</h3>
        <ContextMini vals={c.vals}/>
      </div>
    </div>
  </div>;
}

window.ADMIN_PAGES.contexts = Contexts;
window.ADMIN_PAGES['create-context'] = CreateContext;
window.ADMIN_PAGES['context-detail'] = ContextDetail;
})();
