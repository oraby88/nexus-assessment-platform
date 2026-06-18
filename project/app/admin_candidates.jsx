/* ============================================================
   NEXUS — Candidates (list, detail, add, bulk upload)
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, PageHeader, Drawer, Modal, Field, EmptyState, Tabs, toast } = window;

/* ---------- shared table shell (horizontal-scroll safe) ---------- */
function TableShell({ children, minWidth=880 }) {
  return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
    boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
    <div className="nx-tscroll" style={{overflowX:'auto'}}>
      <div style={{minWidth}}>{children}</div>
    </div>
  </div>;
}
function Th({ children, w, right }) {
  return <th style={{padding:'12px 16px',textAlign:right?'right':'left',fontSize:11.5,fontWeight:700,
    letterSpacing:'.04em',textTransform:'uppercase',color:'var(--text-3)',width:w,whiteSpace:'nowrap'}}>{children}</th>;
}
function Td({ children, right, style={} }) {
  return <td style={{padding:'13px 16px',fontSize:13.5,color:'var(--text)',textAlign:right?'right':'left',...style}}>{children}</td>;
}

/* ---------- Add Candidate drawer ---------- */
function AddCandidate({ open, onClose }) {
  const [f,setF]=useState({name:'',email:'',cur:'',target:'',dept:'Finance',level:'Manager',org:'Meridian Group',notes:''});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const save=(go)=>{ toast('Candidate added', 'success', f.name+' was added to your workspace.'); onClose(); };
  const sel={...window.inpStyle,appearance:'none',backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23818B9C\' stroke-width=\'2.5\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',backgroundRepeat:'no-repeat',backgroundPosition:'right 12px center'};
  return (
    <Drawer open={open} onClose={onClose} title="Add Candidate" sub="Create a single candidate record."
      actions={<><Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="secondary" onClick={()=>save(false)}>Save</Button>
        <Button icon="sparkles" onClick={()=>{onClose();window.__goAdmin('create-assessment');}}>Save & Create Assessment</Button></>}>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <div className="nx-g2" style={{gap:14}}>
          <Field label="Full Name"><input style={window.inpStyle} value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Jamie Carter"/></Field>
          <Field label="Email"><input style={window.inpStyle} value={f.email} onChange={e=>set('email',e.target.value)} placeholder="name@company.com"/></Field>
          <Field label="Current Job Title"><input style={window.inpStyle} value={f.cur} onChange={e=>set('cur',e.target.value)} placeholder="Senior Analyst"/></Field>
          <Field label="Target Job Title"><input style={window.inpStyle} value={f.target} onChange={e=>set('target',e.target.value)} placeholder="Finance Manager"/></Field>
          <Field label="Department"><select style={sel} value={f.dept} onChange={e=>set('dept',e.target.value)}>
            {['Finance','Operations','Product','Sales','Engineering','People','Risk','Marketing'].map(d=><option key={d}>{d}</option>)}</select></Field>
          <Field label="Job Level"><select style={sel} value={f.level} onChange={e=>set('level',e.target.value)}>
            {['Individual Contributor','Professional','Manager','Senior Manager','Director','Executive'].map(d=><option key={d}>{d}</option>)}</select></Field>
        </div>
        <Field label="Organization"><input style={window.inpStyle} value={f.org} onChange={e=>set('org',e.target.value)}/></Field>
        <Field label="Optional Notes"><textarea style={{...window.inpStyle,minHeight:80,resize:'vertical'}} value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder="Context for this candidate…"/></Field>
      </div>
    </Drawer>
  );
}

/* ---------- Bulk Upload modal ---------- */
function BulkUpload({ open, onClose }) {
  const [phase,setPhase]=useState('drop'); // drop | uploading | preview | done
  const [prog,setProg]=useState(0);
  useEffect(()=>{ if(phase==='uploading'){ setProg(0);
    const t=setInterval(()=>setProg(p=>{ if(p>=100){clearInterval(t); setTimeout(()=>setPhase('preview'),300); return 100;} return p+8;}),90);
    return ()=>clearInterval(t);} },[phase]);
  useEffect(()=>{ if(open) setPhase('drop'); },[open]);
  const rows=[
    {n:'Jamie Carter',e:'jamie.carter@meridian.co',r:'Finance Analyst',ok:true},
    {n:'Robin Patel',e:'robin.patel@meridian.co',r:'Ops Coordinator',ok:true},
    {n:'Sam Lee',e:'invalid-email',r:'Engineer',ok:false,err:'Invalid email format'},
    {n:'Amara Okonkwo',e:'amara.okonkwo@meridian.co',r:'Analyst',ok:false,err:'Duplicate — already exists'},
    {n:'Quinn Doyle',e:'quinn.doyle@meridian.co',r:'Designer',ok:true},
  ];
  const valid=rows.filter(r=>r.ok).length;
  return (
    <Modal open={open} onClose={onClose} width={620} title="Bulk Upload Candidates" sub="Import multiple candidates from a CSV file.">
      <div style={{padding:24}}>
        {phase==='drop' && <>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}>
            <Button variant="secondary" size="sm" icon="download">Download Template</Button></div>
          <div onClick={()=>setPhase('uploading')} style={{border:'2px dashed var(--border-strong)',borderRadius:'var(--r-lg)',
            padding:'48px 24px',textAlign:'center',cursor:'pointer',background:'var(--surface-2)',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--indigo-400)';e.currentTarget.style.background='var(--indigo-50)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.background='var(--surface-2)';}}>
            <div style={{width:54,height:54,borderRadius:14,margin:'0 auto 14px',background:'var(--indigo-100)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="upload" size={24}/></div>
            <div style={{fontSize:15,fontWeight:600}}>Drop your CSV here, or click to browse</div>
            <div style={{fontSize:13,color:'var(--text-3)',marginTop:5}}>Accepts .csv up to 5MB · max 500 candidates</div>
          </div></>}
        {phase==='uploading' && <div style={{padding:'30px 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
            <Icon name="reports" size={20} color="var(--indigo-500)"/>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>candidates_q2.csv</div>
              <div style={{fontSize:12,color:'var(--text-3)'}}>Uploading & validating… {prog}%</div></div></div>
          <div style={{height:8,background:'var(--track)',borderRadius:99,overflow:'hidden'}}>
            <div style={{width:prog+'%',height:'100%',background:'var(--indigo-500)',borderRadius:99,transition:'width .2s'}}></div></div>
        </div>}
        {phase==='preview' && <>
          <div style={{display:'flex',gap:10,marginBottom:16}}>
            <Stat n={valid} l="Valid records" tone="teal"/><Stat n={1} l="Invalid" tone="rose"/><Stat n={1} l="Duplicates" tone="amber"/></div>
          <div style={{border:'1px solid var(--border)',borderRadius:'var(--r-md)',overflow:'hidden',maxHeight:240,overflowY:'auto'}}>
            {rows.map((r,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',
                borderTop:i?'1px solid var(--border-soft)':'none',background:r.ok?'transparent':'var(--rose-50)'}}>
                <Icon name={r.ok?'checkCircle':'alert'} size={17} color={r.ok?'var(--teal-600)':'var(--rose-600)'}/>
                <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{r.n}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{r.e} · {r.r}</div></div>
                {!r.ok && <span style={{fontSize:11.5,color:'var(--rose-700)',fontWeight:600}}>{r.err}</span>}
              </div>
            ))}
          </div>
          <label style={{display:'flex',alignItems:'center',gap:9,fontSize:13,marginTop:16,color:'var(--text-2)'}}>
            <input type="checkbox" defaultChecked/> Assign an assessment to imported candidates after import</label>
          <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:18}}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button icon="check" onClick={()=>{setPhase('done');}}>Confirm Import · {valid} records</Button></div>
        </>}
        {phase==='done' && <div style={{textAlign:'center',padding:'24px 0'}}>
          <SuccessCheck/>
          <h3 style={{fontSize:18,fontWeight:700,marginTop:8}}>Import complete</h3>
          <p style={{fontSize:14,color:'var(--text-2)',marginTop:6}}>{valid} of {rows.length} candidates imported. 2 records skipped.</p>
          <div style={{display:'flex',justifyContent:'center',gap:10,marginTop:20}}>
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button icon="sparkles" onClick={()=>{onClose();window.__goAdmin('create-assessment');}}>Assign Assessment</Button></div>
        </div>}
      </div>
    </Modal>
  );
}
function Stat({ n, l, tone }) { const t=window.TONES[tone];
  return <div style={{flex:1,padding:'12px 14px',borderRadius:'var(--r-md)',background:t.bg}}>
    <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-display)',color:t.fg}}>{n}</div>
    <div style={{fontSize:12,color:t.fg,fontWeight:600,opacity:.85}}>{l}</div></div>; }
function SuccessCheck() {
  return <div style={{width:60,height:60,borderRadius:99,margin:'0 auto',background:'var(--teal-50)',
    display:'flex',alignItems:'center',justifyContent:'center',animation:'scaleIn .4s var(--ease-out)'}}>
    <Icon name="check" size={30} color="var(--teal-600)" stroke={2.6}/></div>;
}
window.__SuccessCheck = SuccessCheck;

/* ---------- Candidates list ---------- */
function Candidates({ go }) {
  const NX=window.NX;
  const [sel,setSel]=useState([]);
  const [filter,setFilter]=useState('All');
  const [q,setQ]=useState('');
  const [addOpen,setAddOpen]=useState(false);
  const [bulkOpen,setBulkOpen]=useState(false);
  let rows=NX.CANDIDATES;
  if(filter!=='All') rows=rows.filter(r=>r.aStatus===filter);
  if(q) rows=rows.filter(r=>(r.name+r.target+r.email).toLowerCase().includes(q.toLowerCase()));
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const allSel=rows.length&&rows.every(r=>sel.includes(r.id));
  return (
    <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
      <PageHeader title="Candidates" sub="247 people across your workspace."
        actions={<>
          <Button variant="secondary" icon="download" onClick={()=>{toast('Export started','info','Candidate List (CSV) is being prepared.');}}>Export</Button>
          <Button variant="secondary" icon="upload" onClick={()=>setBulkOpen(true)}>Bulk Upload</Button>
          <Button icon="plus" onClick={()=>setAddOpen(true)}>Add Candidate</Button></>}/>
      {/* filter bar */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:'1 1 260px',maxWidth:320}}>
          <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)'}}><Icon name="search" size={15}/></span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search candidates…"
            style={{width:'100%',padding:'8px 12px 8px 34px',borderRadius:'var(--r-md)',border:'1px solid var(--border)',fontSize:13.5,background:'var(--surface)'}}/>
        </div>
        {['All','Completed','In Progress','Not Started','Expired'].map(f=>
          <Chip key={f} active={filter===f} onClick={()=>setFilter(f)} tone="indigo">{f}</Chip>)}
        <div style={{flex:1}}></div>
        {sel.length>0 && <div style={{display:'flex',alignItems:'center',gap:10,padding:'6px 6px 6px 14px',
          background:'var(--indigo-50)',borderRadius:99,animation:'fadeIn .2s'}}>
          <span style={{fontSize:13,fontWeight:600,color:'var(--indigo-700)'}}>{sel.length} selected</span>
          <Button size="sm" icon="compare" onClick={()=>go('comparison')}>Add to Comparison</Button></div>}
      </div>
      <TableShell>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
            <tr>
              <Th w={40}><Check on={allSel} onClick={()=>setSel(allSel?[]:rows.map(r=>r.id))}/></Th>
              <Th>Candidate</Th><Th>Target Role</Th><Th>Level</Th><Th right>Assess.</Th>
              <Th>Latest Status</Th><Th>Report</Th><Th>Added</Th><Th w={44}></Th>
            </tr>
          </thead>
          <tbody className="nx-stagger" key={rows.length}>
            {rows.map((c,i)=>(
              <tr key={c.id} style={{borderTop:'1px solid var(--border-soft)',cursor:'pointer',
                background:sel.includes(c.id)?'var(--indigo-50)':'transparent',transition:'background .12s'}}
                onClick={()=>go('candidate-detail',{id:c.id})}
                onMouseEnter={e=>{if(!sel.includes(c.id))e.currentTarget.style.background='var(--surface-2)';}}
                onMouseLeave={e=>{if(!sel.includes(c.id))e.currentTarget.style.background='transparent';}}>
                <Td><div onClick={e=>{e.stopPropagation();toggle(c.id);}}><Check on={sel.includes(c.id)}/></div></Td>
                <Td><div style={{display:'flex',alignItems:'center',gap:11}}>
                  <Avatar name={c.name} size={34}/>
                  <div><div style={{fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:12,color:'var(--text-3)'}}>{c.email}</div></div></div></Td>
                <Td><div style={{fontWeight:500}}>{c.target}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{c.dept}</div></Td>
                <Td style={{color:'var(--text-2)'}}>{c.level}</Td>
                <Td right><span style={{fontWeight:600}}>{c.assessments}</span></Td>
                <Td><StatusBadge status={c.aStatus} size="sm"/></Td>
                <Td><StatusBadge status={c.rStatus} size="sm" dot={c.rStatus!=='—'}/></Td>
                <Td style={{color:'var(--text-3)',fontSize:12.5}}>{c.date}</Td>
                <Td><div onClick={e=>e.stopPropagation()}><IconButton name="more" tip="Actions"/></div></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length===0 && <EmptyState icon="candidates" title="No candidates match" sub="Try clearing your filters or search."/>}
      </TableShell>
      <AddCandidate open={addOpen} onClose={()=>setAddOpen(false)}/>
      <BulkUpload open={bulkOpen} onClose={()=>setBulkOpen(false)}/>
    </div>
  );
}
function Check({ on, onClick }) {
  return <span onClick={onClick} style={{width:18,height:18,borderRadius:5,display:'inline-flex',alignItems:'center',justifyContent:'center',
    border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border-strong)'),background:on?'var(--indigo-500)':'var(--surface)',cursor:'pointer'}}>
    {on && <Icon name="check" size={12} color="#fff" stroke={3}/>}</span>;
}

/* ---------- Candidate Detail ---------- */
function CandidateDetail({ go, route }) {
  const NX=window.NX;
  const c = NX.CANDIDATES.find(x=>x.id===route.params.id) || NX.CANDIDATES[0];
  const [tab,setTab]=useState('Overview');
  const asmts = NX.ASSESSMENTS.filter(a=>a.candidate===c.name);
  const reps = NX.REPORTS.filter(r=>r.candidate===c.name);
  return (
    <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
      <PageHeader breadcrumb={[{label:'Candidates',onClick:()=>go('candidates')},{label:c.name}]}
        title={c.name} sub={`${c.current} → ${c.target} · ${c.dept}`}
        actions={<>
          <Button variant="secondary" icon="compare" onClick={()=>go('comparison')}>Add to Comparison</Button>
          <Button variant="secondary" icon="download" onClick={()=>toast('Export started','info','Candidate history is being exported.')}>Export History</Button>
          <Button icon="sparkles" onClick={()=>go('create-assessment')}>Assign Assessment</Button></>}/>
      {/* identity card */}
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:20}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:20,boxShadow:'var(--sh-sm)',
          display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
          <Avatar name={c.name} size={64} ring/>
          <div style={{display:'flex',gap:34,flexWrap:'wrap'}}>
            {[['Email',c.email],['Current Role',c.current],['Target Role',c.target],['Job Level',c.level],['Department',c.dept],['Date Added',c.date]].map((m,i)=>(
              <div key={i}><div style={{fontSize:11.5,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{m[0]}</div>
                <div style={{fontSize:14,fontWeight:600,marginTop:3}}>{m[1]}</div></div>
            ))}
          </div>
          <div style={{flex:1}}></div>
          <div style={{textAlign:'right'}}>
            <StatusBadge status={c.aStatus}/>
            <div style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>{c.assessments} assessments · {reps.length} reports</div>
          </div>
        </div>
        <div>
          <Tabs tabs={['Overview','Active Assessments','Assessment History','Reports','Consent','Timeline']} active={tab} onChange={setTab} style={{marginBottom:18}}/>
          {tab==='Overview' && <div className="nx-g2" style={{gap:18}}>
            <DetailCard title="Active Assessments">
              {asmts.filter(a=>a.status==='In Progress'||a.status==='Not Started').map(a=><AsmRow key={a.id} a={a} go={go}/>)}
              {asmts.filter(a=>a.status==='In Progress'||a.status==='Not Started').length===0 && <Muted text="No active assessments."/>}
            </DetailCard>
            <DetailCard title="Latest Reports">
              {reps.map(r=><div key={r.id} onClick={()=>go('report-detail',{id:r.id})} style={rowCard}>
                <Icon name="reports" size={18} color="var(--violet-600)"/>
                <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{r.role}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{r.date}</div></div>
                <StatusBadge status={r.status} size="sm"/></div>)}
              {reps.length===0 && <Muted text="No reports yet."/>}
            </DetailCard>
          </div>}
          {(tab==='Active Assessments'||tab==='Assessment History') && <DetailCard title={tab}>
            {asmts.map(a=><AsmRow key={a.id} a={a} go={go}/>)}
            {asmts.length===0 && <Muted text="Nothing here yet."/>}
          </DetailCard>}
          {tab==='Reports' && <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
            {reps.map(r=><div key={r.id} onClick={()=>go('report-detail',{id:r.id})} style={{...rowCard,padding:16}}>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{r.role}</div>
                <div style={{fontSize:12,color:'var(--text-3)',marginTop:3}}>{r.type} · {r.date}</div>
                <div style={{marginTop:10}}><StatusBadge status={r.status} size="sm"/></div></div>
              <Button size="sm" variant="secondary" icon="download">PDF</Button></div>)}
            {reps.length===0 && <Muted text="No reports available."/>}
          </div>}
          {tab==='Consent' && <DetailCard title="Consent records">
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <ConsentRow useCase="Hiring Support · Finance Manager" status="Active" date="Granted May 20, 2026"/>
              <ConsentRow useCase="Developmental Feedback" status="Active" date="Granted Apr 12, 2026"/>
            </div></DetailCard>}
          {tab==='Timeline' && <DetailCard title="Activity timeline">
            <Timeline items={[
              {t:'Report released',d:'May 28 · Finance Manager report available',icon:'reports',tone:'teal'},
              {t:'Assessment completed',d:'May 27 · 42 min · valid response pattern',icon:'checkCircle',tone:'teal'},
              {t:'Reminder sent',d:'May 25 · automated reminder',icon:'bell',tone:'amber'},
              {t:'Assessment started',d:'May 22 · consent granted',icon:'play',tone:'indigo'},
              {t:'Invitation sent',d:'May 20 · invited to Finance Manager assessment',icon:'send',tone:'indigo'},
              {t:'Candidate added',d:'May 20 · added by Jordan Avery',icon:'plus',tone:'slate'},
            ]}/></DetailCard>}
        </div>
      </div>
    </div>
  );
}
const rowCard={display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:'var(--r-md)',
  border:'1px solid var(--border-soft)',cursor:'pointer',background:'var(--surface)',marginBottom:8,transition:'all .14s'};
function DetailCard({ title, children }) {
  return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>{title}</h3>{children}</div>;
}
function AsmRow({ a, go }) {
  return <div onClick={()=>go('assessment-detail',{id:a.id})} style={rowCard}>
    <window.Ring value={a.progress} size={40} stroke={4} color={a.progress===100?'var(--teal-600)':'var(--indigo-500)'} label={a.progress}/>
    <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{a.role}</div>
      <div style={{fontSize:12,color:'var(--text-3)'}}>{a.useCase} · due {a.deadline}</div></div>
    <StatusBadge status={a.status} size="sm"/></div>;
}
function Muted({ text }) { return <p style={{fontSize:13,color:'var(--text-3)',padding:'8px 0'}}>{text}</p>; }
function ConsentRow({ useCase, status, date }) {
  return <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)'}}>
    <Icon name="shieldCheck" size={18} color="var(--teal-600)"/>
    <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{useCase}</div>
      <div style={{fontSize:12,color:'var(--text-3)'}}>{date}</div></div>
    <StatusBadge status="Active" size="sm"/></div>;
}
function Timeline({ items }) {
  return <div style={{position:'relative',paddingLeft:8}}>
    {items.map((it,i)=>{ const t=window.TONES[it.tone];
      return <div key={i} style={{display:'flex',gap:14,paddingBottom:i<items.length-1?20:0,position:'relative'}}>
        {i<items.length-1 && <div style={{position:'absolute',left:15,top:30,bottom:0,width:2,background:'var(--border)'}}></div>}
        <div style={{width:32,height:32,borderRadius:99,flex:'none',background:t.bg,color:t.dot,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1}}>
          <Icon name={it.icon} size={15}/></div>
        <div style={{paddingTop:5}}><div style={{fontSize:13.5,fontWeight:600}}>{it.t}</div>
          <div style={{fontSize:12.5,color:'var(--text-3)',marginTop:2}}>{it.d}</div></div>
      </div>;})}
  </div>;
}
window.__Timeline = Timeline; window.__DetailCard = DetailCard;

window.ADMIN_PAGES.candidates = Candidates;
window.ADMIN_PAGES['candidate-detail'] = CandidateDetail;
window.__AddCandidate = AddCandidate;
window.__nxStat = Stat; window.__TableShell=TableShell; window.__Th=Th; window.__Td=Td; window.__Check=Check;
})();
