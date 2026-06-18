/* ============================================================
   NEXUS — Create Assessment (9-step wizard + AI Discovery Chat)
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, toast } = window;

const STEPS = [
  {n:'Select User',d:'Who is being assessed'},
  {n:'Purpose',d:'Why this assessment'},
  {n:'AI Discovery',d:'Interview the agent'},
  {n:'Requirements',d:'Review the profile'},
  {n:'Role Blueprint',d:'Link success model'},
  {n:'Context Profile',d:'Define the environment'},
  {n:'Questions',d:'Select & adapt items'},
  {n:'Review',d:'Coverage & balance'},
  {n:'Send',d:'Confirm & invite'},
];

function Wizard({ go }) {
  const CA = window.__CA || {};
  const [step,setStep]=useState(0);
  const [transforming,setTransforming]=useState(false);
  const [data,setData]=useState({user:null,purpose:'Hiring Support',chatDone:false,blueprint:null,context:null});
  const next=()=>{
    // play the discovery→assessment transformation when leaving the chat (if completed)
    if(step===2 && data.chatDone && CA.TransformSequence){ setTransforming(true); return; }
    setStep(s=>Math.min(s+1,8));
  };
  const back=()=>setStep(s=>Math.max(s-1,0));
  const set=(k,v)=>setData(p=>({...p,[k]:v}));

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--canvas)'}}>
      {/* header */}
      <div style={{height:60,flex:'none',display:'flex',alignItems:'center',gap:16,padding:'0 24px',
        background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
        <window.NexusMark size={26}/>
        <div style={{fontSize:15,fontWeight:700}}>Create Assessment</div>
        {data.user && <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 4px 4px 10px',background:'var(--indigo-50)',borderRadius:99}}>
          <span style={{fontSize:12.5,fontWeight:600,color:'var(--indigo-700)'}}>for {data.user}</span>
          <Avatar name={data.user} size={24}/></div>}
        <div style={{flex:1}}></div>
        <span style={{fontSize:12.5,color:'var(--text-3)'}}>Step {step+1} of 9</span>
        <window.ThemeToggle/>
        <IconButton name="x" tip="Exit" onClick={()=>go('assessments')}/>
      </div>
      <div style={{flex:1,display:'flex',minHeight:0}}>
        {/* step rail */}
        <div style={{width:216,flex:'none',padding:'22px 14px',borderRight:'1px solid var(--border)',background:'var(--surface)',overflow:'auto'}}>
          {STEPS.map((s,i)=>{ const on=i===step, done=i<step;
            return <button key={i} onClick={()=>i<=step&&setStep(i)} style={{display:'flex',gap:12,width:'100%',padding:'10px 10px',
              borderRadius:'var(--r-md)',textAlign:'left',marginBottom:2,cursor:i<=step?'pointer':'default',
              background:on?'var(--indigo-50)':'transparent',transition:'background .15s'}}>
              <div style={{width:26,height:26,borderRadius:99,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:12,fontWeight:700,fontFamily:'var(--font-display)',
                background:done?'var(--teal-600)':on?'var(--indigo-500)':'var(--canvas-2)',
                color:done||on?'#fff':'var(--text-3)',border:on?'none':'1px solid var(--border)'}}>
                {done?<Icon name="check" size={14} stroke={3}/>:i+1}</div>
              <div style={{paddingTop:1}}>
                <div style={{fontSize:13,fontWeight:on?700:600,color:on?'var(--indigo-700)':done?'var(--text)':'var(--text-2)'}}>{s.n}</div>
                <div style={{fontSize:11,color:'var(--text-3)',marginTop:1}}>{s.d}</div></div>
            </button>;})}
        </div>
        {/* content */}
        <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',position:'relative'}}>
          {transforming && CA.TransformSequence &&
            <CA.TransformSequence onDone={()=>{ setTransforming(false); setStep(3); }}/>}
          <div style={{flex:1,overflow:'auto',padding:step===2?0:'32px 40px'}}>
            <div key={step} style={{animation:'fadeUp .35s var(--ease-out) both',maxWidth:step===2?'none':920,margin:'0 auto',height:step===2?'100%':'auto'}}>
              {step===0 && <SelectUser data={data} set={set}/>}
              {step===1 && <Purpose data={data} set={set}/>}
              {step===2 && CA.DiscoveryChat && <CA.DiscoveryChat data={data} set={set} onComplete={()=>{set('chatDone',true);}}/>}
              {step===3 && CA.Requirements && <CA.Requirements/>}
              {step===4 && CA.PickBlueprint && <CA.PickBlueprint data={data} set={set}/>}
              {step===5 && CA.PickContext && <CA.PickContext data={data} set={set}/>}
              {step===6 && CA.QuestionSelect && <CA.QuestionSelect/>}
              {step===7 && CA.ReviewCoverage && <CA.ReviewCoverage/>}
              {step===8 && CA.SendStep && <CA.SendStep data={data} go={go}/>}
            </div>
          </div>
          {/* footer */}
          <div style={{height:70,flex:'none',display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'0 40px',borderTop:'1px solid var(--border)',background:'var(--surface)'}}>
            <Button variant="ghost" icon="arrowLeft" onClick={step===0?()=>go('assessments'):back}>{step===0?'Cancel':'Back'}</Button>
            <div style={{display:'flex',gap:10}}>
              {step>=6 && <Button variant="secondary" onClick={()=>{toast('Draft saved','success');go('assessments');}}>Save Draft</Button>}
              {step<8 && <Button iconRight="arrowRight" onClick={next}
                disabled={(step===0&&!data.user)}>{stepCta(step)}</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function stepCta(s){ return ['Continue','Continue','Skip to summary','Approve summary','Link blueprint','Link context','Approve questions','Approve assessment'][s]||'Continue'; }

/* ---------------- Step 1: Select User ---------------- */
function SelectUser({ data, set }) {
  const NX=window.NX; const [q,setQ]=useState('');
  const rows=NX.CANDIDATES.filter(c=>(c.name+c.target).toLowerCase().includes(q.toLowerCase()));
  return <div>
    <StepHead title="Who is being assessed?" sub="Select an existing candidate, or add a new one. You can assess several people with the same design."/>
    <div style={{position:'relative',marginBottom:16}}>
      <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)'}}><Icon name="search" size={16}/></span>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search candidates…"
        style={{width:'100%',padding:'12px 14px 12px 40px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:14,background:'var(--surface)'}}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
      {rows.slice(0,8).map(c=>{ const on=data.user===c.name;
        return <button key={c.id} onClick={()=>set('user',c.name)} style={{display:'flex',alignItems:'center',gap:13,padding:14,
          borderRadius:'var(--r-md)',border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',
          textAlign:'left',transition:'all .15s',boxShadow:on?'var(--sh-sm)':'none'}}>
          <Avatar name={c.name} size={40}/>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
            <div className="clip" style={{fontSize:12,color:'var(--text-3)'}}>{c.current} → {c.target}</div></div>
          {on && <Icon name="checkCircle" size={20} color="var(--indigo-500)"/>}
        </button>;})}
    </div>
    <button onClick={()=>set('user','New Candidate')} style={{display:'flex',alignItems:'center',gap:10,marginTop:14,padding:'12px 14px',
      borderRadius:'var(--r-md)',border:'1.5px dashed var(--border-strong)',width:'100%',color:'var(--indigo-600)',fontWeight:600,fontSize:13.5,justifyContent:'center'}}>
      <Icon name="plus" size={16}/> Add a new candidate</button>
  </div>;
}

/* ---------------- Step 2: Purpose ---------------- */
function Purpose({ data, set }) {
  const opts=[
    {v:'Developmental Feedback',icon:'trending',d:'Support growth with strengths, themes and development suggestions. All measured dimensions are interpretable.',gov:'Standard governance'},
    {v:'Hiring Support',icon:'target',d:'Role-linked results against a validated blueprint. Selection-safe outputs only — no omnibus fit score.',gov:'Controlled · requires validated blueprint'},
  ];
  return <div>
    <StepHead title="What is this assessment for?" sub="V1 supports two governed use cases. The purpose determines which outputs may be shown and how reports are gated."/>
    <div className="nx-g2" style={{gap:16}}>
      {opts.map(o=>{ const on=data.purpose===o.v;
        return <button key={o.v} onClick={()=>set('purpose',o.v)} style={{padding:22,borderRadius:'var(--r-lg)',textAlign:'left',
          border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',transition:'all .15s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div style={{width:44,height:44,borderRadius:12,background:on?'var(--indigo-500)':'var(--canvas-2)',color:on?'#fff':'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={o.icon} size={22}/></div>
            {on && <Icon name="checkCircle" size={22} color="var(--indigo-500)"/>}</div>
          <div style={{fontSize:16,fontWeight:700,marginTop:14}}>{o.v}</div>
          <p style={{fontSize:13,color:'var(--text-2)',marginTop:7,lineHeight:1.55}}>{o.d}</p>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:12,fontSize:11.5,fontWeight:600,color:'var(--text-3)'}}>
            <Icon name="shield" size={13}/>{o.gov}</div>
        </button>;})}
    </div>
    <div style={{marginTop:20}}><label style={{fontSize:12.5,fontWeight:600,color:'var(--text-2)'}}>Admin notes (optional)</label>
      <textarea placeholder="Any context for the record…" style={{width:'100%',marginTop:6,padding:'11px 13px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:13.5,minHeight:70,resize:'vertical',background:'var(--surface)'}}/></div>
  </div>;
}

function StepHead({ title, sub }) {
  return <div style={{marginBottom:24}}>
    <h2 style={{fontSize:23,fontWeight:700,letterSpacing:'-.02em'}}>{title}</h2>
    <p style={{fontSize:14.5,color:'var(--text-2)',marginTop:7,maxWidth:620,lineHeight:1.55}}>{sub}</p></div>;
}
window.__StepHead = StepHead;
window.__Wizard_next = null;

window.ADMIN_PAGES['create-assessment'] = Wizard;

/* expose step components placeholder — defined in create_assessment2.jsx */
window.__CA = {};
})();
