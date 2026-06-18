/* ============================================================
   NEXUS — Role Blueprints (list, create, detail)
   ============================================================ */
(function(){
const { useState } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Chip, PageHeader, Tabs, toast } = window;
const TableShell=window.__TableShell, Th=window.__Th, Td=window.__Td;

function Blueprints({ go }) {
  const NX=window.NX; const [filter,setFilter]=useState('All');
  let rows=NX.BLUEPRINTS; if(filter!=='All') rows=rows.filter(b=>b.status===filter);
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Role Blueprints" sub="Define what success looks like for a role — beyond the job title."
      actions={<><Button variant="secondary" icon="download" onClick={()=>toast('Export started','info')}>Export</Button>
        <Button icon="plus" onClick={()=>go('create-blueprint')}>Create Blueprint</Button></>}/>
    <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
      {['All','Validated','Active','Under Review','Draft','Archived'].map(f=><Chip key={f} active={filter===f} onClick={()=>setFilter(f)} tone="indigo">{f}</Chip>)}</div>
    <TableShell>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
          <tr><Th>Blueprint</Th><Th>Role Title</Th><Th>Family</Th><Th>Level</Th><Th>Status</Th><Th>Version</Th><Th>Linked Context</Th><Th right>Used</Th><Th>Updated</Th><Th w={44}></Th></tr></thead>
        <tbody className="nx-stagger" key={rows.length}>
          {rows.map(b=>(
            <tr key={b.id} onClick={()=>go('blueprint-detail',{id:b.id})} style={{borderTop:'1px solid var(--border-soft)',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td><div style={{display:'flex',alignItems:'center',gap:11}}>
                <div style={{width:32,height:32,borderRadius:9,background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="blueprint" size={16}/></div>
                <span style={{fontWeight:600}}>{b.name}</span></div></Td>
              <Td>{b.role}</Td><Td style={{color:'var(--text-2)'}}>{b.family}</Td><Td style={{color:'var(--text-2)'}}>{b.level}</Td>
              <Td><StatusBadge status={b.status} size="sm"/></Td><Td><span className="mono" style={{fontSize:12}}>{b.version}</span></Td>
              <Td style={{fontSize:12.5}}>{b.context}</Td><Td right><span style={{fontWeight:600}}>{b.used}</span></Td>
              <Td style={{color:'var(--text-3)',fontSize:12.5}}>{b.updated}</Td>
              <Td><div onClick={e=>e.stopPropagation()}><IconButton name="more"/></div></Td>
            </tr>))}
        </tbody>
      </table>
    </TableShell>
  </div>;
}

/* ---------------- create (multi-step) ---------------- */
const BP_STEPS=['Role Information','Work Context','Success Requirements','Dimension Selection','Dimension Importance','Supporting Evidence','Link Context','Review & Save'];
function CreateBlueprint({ go }) {
  const [step,setStep]=useState(0);
  const DIMS=[
    {n:'Conscientious Execution',d:'D1'},{n:'Integrity Orientation',d:'D1'},{n:'Emotional Steadiness',d:'D1'},
    {n:'Decision Complexity',d:'D2'},{n:'Numerical Reasoning',d:'D2'},{n:'Abstract Reasoning',d:'D2'},
    {n:'Self-Regulation',d:'D4'},{n:'Resilience',d:'D4'},{n:'Relationship Management',d:'D4'},
  ];
  const [picked,setPicked]=useState({'Conscientious Execution':'Required','Integrity Orientation':'Required','Numerical Reasoning':'Required','Decision Complexity':'Optional','Self-Regulation':'Optional'});
  const cycle=n=>setPicked(p=>{ const cur=p[n]; const nx=cur==='Required'?'Optional':cur==='Optional'?'Excluded':cur==='Excluded'?undefined:'Required';
    const c={...p}; if(nx) c[n]=nx; else delete c[n]; return c; });
  const tone={Required:'rose',Optional:'indigo',Excluded:'slate'};
  return <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--canvas)'}}>
    <div style={{height:60,flex:'none',display:'flex',alignItems:'center',gap:16,padding:'0 24px',background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
      <window.NexusMark size={26}/><div style={{fontSize:15,fontWeight:700}}>Create Role Blueprint</div>
      <div style={{flex:1}}></div><span style={{fontSize:12.5,color:'var(--text-3)'}}>Step {step+1} of {BP_STEPS.length}</span>
      <window.ThemeToggle/>
      <IconButton name="x" onClick={()=>go('blueprints')}/></div>
    {/* step pills */}
    <div style={{flex:'none',display:'flex',gap:6,padding:'14px 36px',borderBottom:'1px solid var(--border)',background:'var(--surface)',overflowX:'auto'}}>
      {BP_STEPS.map((s,i)=><button key={i} onClick={()=>i<=step&&setStep(i)} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:99,flex:'none',
        background:i===step?'var(--indigo-500)':i<step?'var(--indigo-50)':'transparent',color:i===step?'#fff':i<step?'var(--indigo-700)':'var(--text-3)',fontSize:12.5,fontWeight:600}}>
        <span style={{width:18,height:18,borderRadius:99,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10.5,fontWeight:700,
          background:i===step?'rgba(255,255,255,.2)':i<step?'var(--indigo-500)':'var(--canvas-2)',color:i<=step?'#fff':'var(--text-3)'}}>{i<step?'✓':i+1}</span>{s}</button>)}
    </div>
    <div style={{flex:1,overflow:'auto',padding:'28px 36px'}}>
      <div key={step} style={{maxWidth:760,margin:'0 auto',animation:'fadeUp .3s var(--ease-out) both'}}>
        {step===0 && <Form title="Role Information" fields={[
          ['Blueprint Name','text','e.g. Finance Manager v4'],['Role Title','text','Finance Manager'],
          ['Job Family','select',['Finance','Operations','Sales','Product','Engineering','People','Risk']],
          ['Job Level','select',['Individual Contributor','Professional','Manager','Senior Manager','Director','Executive']],
          ['Role Purpose','textarea','What this role exists to achieve…']]}/>}
        {step===1 && <Form title="Work Context" fields={[
          ['Responsibilities','textarea','Core responsibilities…'],['Work Context','textarea','Describe the working environment…']]}/>}
        {step===2 && <Form title="Success Requirements" fields={[
          ['Success Indicators','textarea','What good looks like…'],['Failure Risks','textarea','What goes wrong…'],['Non-Negotiable Requirements','textarea','Cannot succeed without…']]}/>}
        {(step===3||step===4) && <div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>{step===3?'Dimension Selection':'Dimension Importance'}</h2>
          <p style={{fontSize:14,color:'var(--text-2)',marginBottom:18}}>{step===3?'Tap a dimension to cycle Required → Optional → Excluded. Equal weighting is the default unless evidence supports otherwise.':'Set relative importance for the required dimensions.'}</p>
          {step===3 ? <div className="nx-g3" style={{gap:10}}>
            {DIMS.map(d=>{ const st=picked[d.n]; const t=st?window.TONES[tone[st]]:null;
              return <button key={d.n} onClick={()=>cycle(d.n)} style={{padding:14,borderRadius:'var(--r-md)',textAlign:'left',
                border:'1.5px solid '+(st?t.dot:'var(--border)'),background:st?t.bg:'var(--surface)',transition:'all .15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span className="mono" style={{fontSize:10,fontWeight:700,color:'var(--text-3)'}}>{d.d}</span>
                  {st && <span style={{fontSize:10,fontWeight:700,color:t.fg}}>{st}</span>}</div>
                <div style={{fontSize:13,fontWeight:600,marginTop:8}}>{d.n}</div></button>;})}
          </div> : <div style={{display:'flex',flexDirection:'column',gap:16,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:20}}>
            {Object.keys(picked).filter(n=>picked[n]==='Required').map((n,i)=>(
              <div key={n}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13.5,fontWeight:600}}>{n}</span><span style={{fontSize:12,color:'var(--indigo-600)',fontWeight:700}}>{['Critical','High','High'][i]||'Moderate'}</span></div>
                <window.Slider value={[5,4,4,3,3][i]||3} onChange={()=>{}} min={1} max={5} labels={['Low','','Mod','','Critical']}/></div>))}
          </div>}
        </div>}
        {step===5 && <Form title="Supporting Evidence" fields={[['Supporting Evidence','textarea','Validation studies, criterion data, SME input…'],['Notes','textarea','Additional notes…']]}/>}
        {step===6 && <div><h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>Link Context Profile</h2>
          <p style={{fontSize:14,color:'var(--text-2)',marginBottom:18}}>Connect this blueprint to a context profile to enable Domain 6.</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {window.NX.CONTEXTS.slice(0,3).map((c,i)=><button key={c.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',borderRadius:'var(--r-md)',
              border:'1.5px solid '+(i===0?'var(--indigo-500)':'var(--border)'),background:i===0?'var(--indigo-50)':'var(--surface)',textAlign:'left'}}>
              <Icon name="context" size={18} color="var(--teal-600)"/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
                <div style={{fontSize:12,color:'var(--text-3)'}}>{c.role}</div></div>{i===0&&<Icon name="checkCircle" size={20} color="var(--indigo-500)"/>}</button>)}
          </div></div>}
        {step===7 && <div><h2 style={{fontSize:20,fontWeight:700,marginBottom:16}}>Review & Save</h2>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22}}>
            {[['Blueprint','Finance Manager v4'],['Role','Finance Manager · Manager'],['Required dimensions',Object.keys(picked).filter(n=>picked[n]==='Required').join(', ')],['Linked context','FinMgr · Regulated'],['Initial status','Draft']].map((m,i)=>
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:i<4?'1px solid var(--border-soft)':'none',gap:20}}>
                <span style={{fontSize:13,color:'var(--text-3)',flex:'none'}}>{m[0]}</span><span style={{fontSize:13.5,fontWeight:600,textAlign:'right'}}>{m[1]}</span></div>)}
          </div></div>}
      </div>
    </div>
    <div style={{height:70,flex:'none',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 36px',borderTop:'1px solid var(--border)',background:'var(--surface)'}}>
      <Button variant="ghost" icon="arrowLeft" onClick={step===0?()=>go('blueprints'):()=>setStep(s=>s-1)}>{step===0?'Cancel':'Back'}</Button>
      {step<BP_STEPS.length-1 ? <Button iconRight="arrowRight" onClick={()=>setStep(s=>s+1)}>Continue</Button>
        : <div style={{display:'flex',gap:10}}><Button variant="secondary" onClick={()=>{toast('Draft saved','success');go('blueprints');}}>Save as Draft</Button>
          <Button icon="check" onClick={()=>{toast('Blueprint created','success','Finance Manager v4 saved as Draft.');go('blueprints');}}>Save Blueprint</Button></div>}
    </div>
  </div>;
}
function Form({ title, fields }) {
  const sel={width:'100%',padding:'11px 13px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:14,background:'var(--surface)'};
  return <div><h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>{title}</h2>
    <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:18}}>
      {fields.map((f,i)=><label key={i} style={{display:'block'}}>
        <span style={{fontSize:12.5,fontWeight:600,color:'var(--text-2)'}}>{f[0]}</span>
        <div style={{marginTop:6}}>
          {f[1]==='text' && <input placeholder={f[2]} style={sel}/>}
          {f[1]==='textarea' && <textarea placeholder={f[2]} style={{...sel,minHeight:90,resize:'vertical'}}/>}
          {f[1]==='select' && <select style={sel}>{f[2].map(o=><option key={o}>{o}</option>)}</select>}
        </div></label>)}
    </div></div>;
}

/* ---------------- detail ---------------- */
function BlueprintDetail({ go, route }) {
  const NX=window.NX; const b=NX.BLUEPRINTS.find(x=>x.id===route.params.id)||NX.BLUEPRINTS[0];
  const [tab,setTab]=useState('Overview');
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader breadcrumb={[{label:'Role Blueprints',onClick:()=>go('blueprints')},{label:b.name}]} title={b.name} sub={`${b.role} · ${b.family} · ${b.level} · ${b.version}`}
      actions={<><Button variant="secondary" icon="copy">Duplicate</Button>
        {b.status!=='Validated'&&<Button variant="secondary" icon="shieldCheck" onClick={()=>toast('Blueprint activated','success')}>Activate</Button>}
        <Button icon="sparkles" onClick={()=>go('create-assessment')}>Create Assessment</Button></>}/>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}><StatusBadge status={b.status}/><Chip tone="slate">{b.used} assessments</Chip><Chip tone="slate">Linked: {b.context}</Chip></div>
    <Tabs tabs={['Overview','Context','Dimensions','Evidence','Assessment Usage','Version History','Notes']} active={tab} onChange={setTab} style={{marginBottom:18}}/>
    {tab==='Dimensions' ? <div className="nx-g3" style={{gap:12}}>
      {[['Conscientious Execution','D1','Required','Critical'],['Integrity Orientation','D1','Required','Critical'],['Numerical Reasoning','D2','Required','High'],
        ['Decision Complexity','D2','Optional','Moderate'],['Self-Regulation','D4','Optional','Moderate'],['Emotional Steadiness','D1','Excluded','—']].map((d,i)=>{
        const tone={Required:'rose',Optional:'indigo',Excluded:'slate'}[d[2]]; const t=window.TONES[tone];
        return <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:16,boxShadow:'var(--sh-sm)'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><span className="mono" style={{fontSize:10.5,fontWeight:700,color:'var(--text-3)'}}>{d[1]}</span>
            <span style={{fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:99,background:t.bg,color:t.fg}}>{d[2]}</span></div>
          <div style={{fontSize:14,fontWeight:600,marginTop:10}}>{d[0]}</div>
          <div style={{fontSize:12,color:'var(--text-3)',marginTop:4}}>Importance: {d[3]}</div></div>;})}
    </div> : tab==='Version History' ? <window.__DetailCard title="Versions">
      <window.__Timeline items={[
        {t:'v3.0 · Validated',d:'May 18, 2026 · criterion validity confirmed',icon:'shieldCheck',tone:'teal'},
        {t:'v2.1 · Active',d:'Apr 02, 2026 · added Self-Regulation as optional',icon:'edit',tone:'indigo'},
        {t:'v1.0 · Draft',d:'Feb 11, 2026 · initial blueprint',icon:'plus',tone:'slate'},
      ]}/></window.__DetailCard>
    : <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>{tab}</h3>
        <p style={{fontSize:14,color:'var(--text-2)',lineHeight:1.6,maxWidth:620}}>
          {tab==='Overview' && 'This validated blueprint defines success for a regulated Finance Manager role. Integrity and conscientious execution are non-negotiable; numerical reasoning is critical for forecasting and regulated reporting. The blueprint links to the FinMgr · Regulated context, enabling Domain 6 contextual alignment.'}
          {tab==='Context' && 'Linked to FinMgr · Regulated — a high-precision, high-failure-cost environment with strong regulatory constraint and moderate ambiguity.'}
          {tab==='Evidence' && 'Supported by criterion-validity study (N=312) linking conscientious execution and integrity to regulated-reporting accuracy. SME panel of 4 finance directors reviewed the success model.'}
          {tab==='Assessment Usage' && `Used in ${b.used} assessments. Average contextual alignment of matched candidates: 78.`}
          {tab==='Notes' && 'Review at next calibration cycle. Monitor adverse-impact for numerical reasoning weighting.'}
        </p></div>}
  </div>;
}

window.ADMIN_PAGES.blueprints = Blueprints;
window.ADMIN_PAGES['create-blueprint'] = CreateBlueprint;
window.ADMIN_PAGES['blueprint-detail'] = BlueprintDetail;
})();
