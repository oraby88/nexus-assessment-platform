/* ============================================================
   NEXUS — User Assessment Flow (overview→consent→instructions→runtime→completion) + report
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
const { Button, IconButton, StatusBadge, Chip, toast } = window;
const ME = window.__ME;

/* shared focused-screen frame */
function FocusFrame({ children, max=720, onExit, step, label }) {
  return <div style={{minHeight:'100vh',background:'var(--canvas)',display:'flex',flexDirection:'column'}}>
    <div style={{height:58,flex:'none',display:'flex',alignItems:'center',gap:14,padding:'0 24px',background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
      <window.NexusWordmark sub="Candidate Portal"/>
      <div style={{flex:1}}></div>
      {label && <span style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600}}>{label}</span>}
      <window.ThemeToggle/>
      <IconButton name="x" tip="Save & exit" onClick={onExit}/>
    </div>
    <div style={{flex:1,overflow:'auto',display:'flex',justifyContent:'center',padding:'40px 24px'}}>
      <div style={{width:'100%',maxWidth:max,animation:'fadeUp .4s var(--ease-out) both'}}>{children}</div>
    </div>
  </div>;
}

/* ---------------- Overview ---------------- */
function Overview({ go, onExit }) {
  const a=ME.active;
  return <FocusFrame onExit={()=>go('dashboard')} label="Step 1 of 3">
    <div style={{textAlign:'center',marginBottom:8}}><Chip tone="indigo">{a.purpose}</Chip></div>
    <h1 style={{fontSize:30,fontWeight:700,textAlign:'center',letterSpacing:'-.02em'}}>{a.role} Assessment</h1>
    <p style={{fontSize:15.5,color:'var(--text-2)',textAlign:'center',marginTop:10,lineHeight:1.6,maxWidth:540,marginInline:'auto'}}>
      {ME.org} has invited you to complete this assessment. It helps them understand your strengths and how you work — there are no trick questions, and no single pass/fail score.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14,margin:'28px 0'}}>
      {[['briefcase','Organization',ME.org],['target','Purpose',a.purpose],['clock','Estimated time',a.duration],['calendar','Deadline',a.deadline],['layers','Sections',a.sections+' sections'],['shield','Privacy','Specific consent required']].map((m,i)=>
        <div key={i} style={{display:'flex',alignItems:'center',gap:13,padding:16,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',boxShadow:'var(--sh-xs)'}}>
          <div style={{width:38,height:38,borderRadius:10,flex:'none',background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={m[0]} size={18}/></div>
          <div><div style={{fontSize:11.5,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase'}}>{m[1]}</div>
            <div style={{fontSize:14,fontWeight:700,marginTop:2}}>{m[2]}</div></div></div>)}
    </div>
    <div style={{display:'flex',gap:10,padding:'14px 16px',background:'var(--surface-2)',borderRadius:'var(--r-md)',marginBottom:24,border:'1px solid var(--border)'}}>
      <Icon name="info" size={18} color="var(--indigo-500)"/>
      <div style={{fontSize:13.5,color:'var(--text-2)',lineHeight:1.5}}><strong style={{color:'var(--text)'}}>You can pause and resume.</strong> Your progress saves automatically. Most sections aren't timed; any timed section will be clearly flagged before it begins.</div></div>
    <Button full size="lg" iconRight="arrowRight" onClick={()=>go('consent')}>Continue to Consent</Button>
  </FocusFrame>;
}

/* ---------------- Consent ---------------- */
function Consent({ go }) {
  const [agreed,setAgreed]=useState(false);
  return <FocusFrame onExit={()=>go('dashboard')} max={640} label="Step 2 of 3">
    <div style={{textAlign:'center'}}><div style={{width:56,height:56,borderRadius:15,margin:'0 auto 16px',background:'var(--teal-50)',color:'var(--teal-600)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="shieldCheck" size={26}/></div></div>
    <h1 style={{fontSize:26,fontWeight:700,textAlign:'center'}}>Your consent</h1>
    <p style={{fontSize:15,color:'var(--text-2)',textAlign:'center',marginTop:8,lineHeight:1.55}}>Please review how your assessment will be used. This consent is specific to this assessment.</p>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:24,marginTop:24,boxShadow:'var(--sh-sm)'}}>
      {[['Purpose','This assessment supports a hiring decision for the Finance Manager role at Meridian Group.'],
        ['Who can see your results','Only authorised members of Meridian Group, for this stated purpose. You can also view your own report.'],
        ['How results are used','To understand your strengths and fit, alongside other information. Nexus does not make an automatic hiring decision.'],
        ['Data retention','Your responses are retained for 24 months, then anonymised or deleted, in line with GDPR.']].map((m,i)=>
        <div key={i} style={{paddingBottom:i<3?16:0,marginBottom:i<3?16:0,borderBottom:i<3?'1px solid var(--border-soft)':'none'}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--indigo-700)'}}>{m[0]}</div>
          <p style={{fontSize:13.5,color:'var(--text-2)',marginTop:5,lineHeight:1.55}}>{m[1]}</p></div>)}
    </div>
    <label onClick={()=>setAgreed(!agreed)} style={{display:'flex',alignItems:'flex-start',gap:11,padding:'16px',marginTop:16,background:agreed?'var(--teal-50)':'var(--surface)',border:'1px solid '+(agreed?'var(--teal-100)':'var(--border)'),borderRadius:'var(--r-md)',cursor:'pointer',transition:'all .15s'}}>
      <span style={{width:20,height:20,borderRadius:6,flex:'none',marginTop:1,border:'1.5px solid '+(agreed?'var(--teal-600)':'var(--border-strong)'),background:agreed?'var(--teal-600)':'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center'}}>{agreed&&<Icon name="check" size={13} color="#fff" stroke={3}/>}</span>
      <span style={{fontSize:13.5,color:'var(--text)',lineHeight:1.5}}>I understand how my assessment will be used and I consent to participate for this specific purpose.</span></label>
    <div style={{display:'flex',gap:12,marginTop:20}}>
      <Button variant="ghost" onClick={()=>go('dashboard')}>Decline</Button>
      <div style={{flex:1}}></div>
      <Button size="lg" iconRight="arrowRight" disabled={!agreed} onClick={()=>go('instructions')}>Accept & Continue</Button></div>
  </FocusFrame>;
}

/* ---------------- Instructions ---------------- */
function Instructions({ go }) {
  return <FocusFrame onExit={()=>go('dashboard')} max={640} label="Step 3 of 3">
    <h1 style={{fontSize:26,fontWeight:700,textAlign:'center'}}>Before you begin</h1>
    <p style={{fontSize:15,color:'var(--text-2)',textAlign:'center',marginTop:8,lineHeight:1.55}}>A few things that will make this smooth.</p>
    <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:24}}>
      {[['layers','Five question types','You will see agreement scales, workplace situations, and a couple of reasoning questions. Each has clear instructions.'],
        ['refresh','Answer honestly','There are no right or wrong personality answers. Honest responses give the most useful results.'],
        ['clock','One timed section','The reasoning section is gently timed. We will let you know before it starts.'],
        ['check','Auto-save','Every answer saves automatically. You can pause and pick up exactly where you left off.']].map((m,i)=>
        <div key={i} style={{display:'flex',gap:14,padding:16,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',boxShadow:'var(--sh-xs)'}}>
          <div style={{width:40,height:40,borderRadius:10,flex:'none',background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={m[0]} size={19}/></div>
          <div><div style={{fontSize:14.5,fontWeight:700}}>{m[1]}</div><p style={{fontSize:13,color:'var(--text-2)',marginTop:3,lineHeight:1.5}}>{m[2]}</p></div></div>)}
    </div>
    <Button full size="lg" icon="play" style={{marginTop:24}} onClick={()=>go('runtime')}>Begin Assessment</Button>
  </FocusFrame>;
}

/* ---------------- Runtime ---------------- */
function Runtime({ go }) {
  const Q = window.NX.QUESTIONS;
  // build a curated, varied runtime set (one of each type, plus a couple)
  const set = [
    Q.find(q=>q.format==='statement'),
    Q.find(q=>q.format==='statement'&&q.dim!=='D1-CE')||Q.filter(q=>q.format==='statement')[1],
    Q.find(q=>q.format==='paired_statement'),
    Q.find(q=>q.format==='scenario_mcq'),
    Q.find(q=>q.format==='mcq_single'),
    Q.find(q=>q.format==='single_best_answer'),
  ].filter(Boolean);
  const SECTIONS=[
    {name:'Character & Work Style',from:0,to:1,timed:false},
    {name:'Emotional Intelligence',from:2,to:2,timed:false},
    {name:'Situational Judgement',from:3,to:3,timed:false},
    {name:'Reasoning',from:4,to:5,timed:true},
  ];
  const KEY='nexus_runtime_v1';
  const [i,setI]=useState(()=>{ try{return JSON.parse(localStorage.getItem(KEY))?.i||0;}catch(e){return 0;} });
  const [ans,setAns]=useState(()=>{ try{return JSON.parse(localStorage.getItem(KEY))?.ans||{};}catch(e){return {};} });
  const [saved,setSaved]=useState(false);
  const [paused,setPaused]=useState(false);

  useEffect(()=>{ try{localStorage.setItem(KEY,JSON.stringify({i,ans}));}catch(e){} },[i,ans]);
  const setAnswer=(v)=>{ setAns(a=>({...a,[i]:v})); setSaved(true); setTimeout(()=>setSaved(false),1400); };
  const q=set[i];
  const section=SECTIONS.find(s=>i>=s.from&&i<=s.to)||SECTIONS[0];
  const pct=Math.round((Object.keys(ans).length)/set.length*100);
  const isLast=i===set.length-1;

  if(paused) return <PauseScreen go={go} onResume={()=>setPaused(false)} progress={pct}/>;

  return <div style={{minHeight:'100vh',background:'var(--canvas)',display:'flex',flexDirection:'column'}}>
    {/* top progress bar */}
    <div style={{flex:'none',background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
      <div style={{height:54,display:'flex',alignItems:'center',gap:16,padding:'0 24px'}}>
        <window.NexusMark size={24}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:13,fontWeight:700}}>{section.name}</span>
            {section.timed && <Chip tone="amber" icon="clock" style={{padding:'2px 8px',fontSize:11}}>Timed</Chip>}
          </div>
        </div>
        <span style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600}}>Question {i+1} of {set.length}</span>
        <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:saved?'var(--teal-600)':'var(--text-3)',fontWeight:600,transition:'color .3s',minWidth:74}}>
          {saved?<><Icon name="check" size={14}/> Saved</>:<><Icon name="refresh" size={13}/> Auto-save</>}</div>
        <window.ThemeToggle/>
        <Button size="sm" variant="secondary" icon="pause" onClick={()=>setPaused(true)}>Pause</Button>
      </div>
      <div style={{height:4,background:'var(--canvas-2)'}}>
        <div style={{height:'100%',width:((i+ (ans[i]!==undefined?1:0))/set.length*100)+'%',background:'var(--indigo-500)',transition:'width .4s var(--ease-out)'}}></div></div>
    </div>
    {/* question */}
    <div style={{flex:1,overflow:'auto',display:'flex',justifyContent:'center',padding:'48px 24px'}}>
      <div key={i} style={{width:'100%',maxWidth:680,animation:'fadeUp .4s var(--ease-out) both'}}>
        <QuestionCard q={q} value={ans[i]} onChange={setAnswer}/>
      </div>
    </div>
    {/* nav */}
    <div style={{flex:'none',height:74,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
      <Button variant="ghost" icon="arrowLeft" disabled={i===0} onClick={()=>setI(i-1)}>Previous</Button>
      <div style={{display:'flex',gap:6}}>{set.map((_,k)=><span key={k} style={{width:8,height:8,borderRadius:99,
        background:k===i?'var(--indigo-500)':ans[k]!==undefined?'var(--indigo-300)':'var(--border-strong)',transition:'all .2s'}}></span>)}</div>
      {isLast ? <Button icon="check" disabled={ans[i]===undefined} onClick={()=>{localStorage.removeItem(KEY);go('completion');}}>Submit Assessment</Button>
        : <Button iconRight="arrowRight" disabled={ans[i]===undefined} onClick={()=>setI(i+1)}>Next</Button>}
    </div>
  </div>;
}

/* ---------------- Question Card (all 5 types) ---------------- */
function QuestionCard({ q, value, onChange }) {
  const QT=window.NX.QTYPES;
  const meta=QT[q.format]||{label:'Question',tone:'#4F46E5'};
  return <div>
    <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 11px',borderRadius:99,background:meta.tone+'15',color:meta.tone,fontSize:11.5,fontWeight:700,marginBottom:18}}>
      <Icon name={q.format==='statement'?'check':q.format==='paired_statement'?'compare':q.format==='scenario_mcq'?'briefcase':'target'} size={13}/>{meta.label}</div>
    <h2 style={{fontSize:23,fontWeight:700,lineHeight:1.35,letterSpacing:'-.01em'}}>{q.text}</h2>

    {/* Likert / frequency */}
    {q.format==='statement' && <div style={{marginTop:32}}>
      <LikertScale scale={q.scale&&q.scale.includes('Frequency')?window.NX.FREQ_SCALE:QT.statement.scale} value={value} onChange={onChange}/></div>}

    {/* forced choice */}
    {q.format==='paired_statement' && <div className="nx-g2" style={{marginTop:28,gap:14}}>
      {[['A',q.options[0]],['B',q.options[1]]].map(o=>{ const on=value===o[0];
        return <button key={o[0]} onClick={()=>onChange(o[0])} style={{padding:'24px 20px',borderRadius:'var(--r-lg)',textAlign:'left',minHeight:140,
          border:'2px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',transition:'all .15s',boxShadow:on?'var(--sh-md)':'var(--sh-xs)'}}>
          <div style={{width:30,height:30,borderRadius:8,background:on?'var(--indigo-500)':'var(--canvas-2)',color:on?'#fff':'var(--text-3)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',marginBottom:14}}>{o[0]}</div>
          <div style={{fontSize:15,lineHeight:1.5,fontWeight:500}}>{o[1]}</div></button>;})}
    </div>}

    {/* SJT / MCQ / best answer */}
    {(q.format==='scenario_mcq'||q.format==='mcq_single'||q.format==='single_best_answer') && <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:11}}>
      {q.options.map((opt,k)=>{ const L=String.fromCharCode(65+k); const on=value===L;
        return <button key={k} onClick={()=>onChange(L)} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 18px',borderRadius:'var(--r-md)',textAlign:'left',
          border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',transition:'all .14s',boxShadow:on?'var(--sh-sm)':'none'}}>
          <span style={{width:28,height:28,borderRadius:8,flex:'none',background:on?'var(--indigo-500)':'var(--canvas-2)',color:on?'#fff':'var(--text-3)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>{L}</span>
          <span style={{fontSize:14.5,lineHeight:1.45,fontWeight:500}}>{opt}</span>
          {on && <Icon name="check" size={18} color="var(--indigo-500)" style={{marginLeft:'auto'}}/>}</button>;})}
    </div>}
  </div>;
}
function LikertScale({ scale, value, onChange }) {
  return <div>
    <div style={{display:'flex',gap:10,justifyContent:'space-between'}}>
      {scale.map((s,k)=>{ const v=k+1; const on=value===v;
        return <button key={k} onClick={()=>onChange(v)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'18px 6px',borderRadius:'var(--r-md)',
          border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',transition:'all .15s'}}>
          <span style={{width:34,height:34,borderRadius:99,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',fontSize:15,
            background:on?'var(--indigo-500)':'var(--canvas-2)',color:on?'#fff':'var(--text-3)',transition:'all .15s'}}>{v}</span>
          <span style={{fontSize:11,fontWeight:600,color:on?'var(--indigo-700)':'var(--text-3)',textAlign:'center',lineHeight:1.25}}>{s}</span></button>;})}
    </div>
  </div>;
}

/* ---------------- Pause ---------------- */
function PauseScreen({ go, onResume, progress }) {
  return <FocusFrame onExit={()=>go('dashboard')} max={520}>
    <div style={{textAlign:'center',paddingTop:30}}>
      <div style={{width:64,height:64,borderRadius:18,margin:'0 auto 18px',background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="pause" size={28}/></div>
      <h1 style={{fontSize:26,fontWeight:700}}>Assessment paused</h1>
      <p style={{fontSize:15,color:'var(--text-2)',marginTop:10,lineHeight:1.55,maxWidth:380,marginInline:'auto'}}>Your progress is saved. You can resume anytime before the deadline — you will pick up exactly where you left off.</p>
      <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center',margin:'24px 0',padding:'14px 20px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',maxWidth:320,marginInline:'auto'}}>
        <window.Ring value={progress} size={48} stroke={5} color="var(--indigo-500)"/>
        <div style={{textAlign:'left'}}><div style={{fontSize:13,fontWeight:700}}>{progress}% complete</div>
          <div style={{fontSize:12,color:'var(--text-3)'}}>Due June 25, 2026</div></div></div>
      <div style={{display:'flex',gap:12,justifyContent:'center'}}>
        <Button variant="secondary" onClick={()=>go('dashboard')}>Return to Dashboard</Button>
        <Button icon="play" onClick={onResume}>Continue</Button></div>
    </div>
  </FocusFrame>;
}

/* ---------------- Completion ---------------- */
function Completion({ go }) {
  const [phase,setPhase]=useState('celebrate');
  useEffect(()=>{ const t=setTimeout(()=>setPhase('processing'),2200); return ()=>clearTimeout(t); },[]);
  return <div style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 30%, #EEF0FE, var(--canvas) 60%)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
    <div style={{textAlign:'center',maxWidth:480,animation:'fadeUp .5s var(--ease-out) both'}}>
      <div style={{position:'relative',width:96,height:96,margin:'0 auto 24px'}}>
        <div style={{position:'absolute',inset:0,borderRadius:99,background:'var(--teal-50)',animation:'pulse 2s infinite'}}></div>
        <div style={{position:'absolute',inset:0,borderRadius:99,background:'var(--teal-600)',display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 12px 32px -8px rgba(13,148,136,.5)'}}>
          <Icon name="check" size={48} color="#fff" stroke={2.4} style={{animation:'checkPop .5s var(--ease-out) .2s both'}}/></div>
      </div>
      <h1 style={{fontSize:30,fontWeight:700,letterSpacing:'-.02em'}}>All done, {ME.first}!</h1>
      <p style={{fontSize:16,color:'var(--text-2)',marginTop:12,lineHeight:1.6}}>Thank you for completing the {ME.active.role} assessment. Your responses have been submitted securely.</p>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'18px 20px',marginTop:24,boxShadow:'var(--sh-sm)',display:'flex',alignItems:'center',gap:14,textAlign:'left'}}>
        {phase==='processing'?<div style={{width:36,height:36,flex:'none',border:'3px solid var(--indigo-100)',borderTopColor:'var(--indigo-500)',borderRadius:99,animation:'spin .8s linear infinite'}}></div>
          :<div style={{width:36,height:36,flex:'none',borderRadius:10,background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="reports" size={18}/></div>}
        <div><div style={{fontSize:14,fontWeight:700}}>{phase==='processing'?'Your report is being prepared':'Submission confirmed'}</div>
          <div style={{fontSize:12.5,color:'var(--text-3)',marginTop:2}}>{phase==='processing'?'Meridian Group will be notified when it is ready.':'You will be notified when your results are available.'}</div></div></div>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:26}}>
        <Button size="lg" icon="dashboard" onClick={()=>go('dashboard')}>Return to Dashboard</Button></div>
    </div>
  </div>;
}

/* ---------------- User Report ---------------- */
function UserReport({ go }) {
  const R=window.NX.REPORT_DETAIL;
  return <div style={{animation:'fadeUp .4s var(--ease-out) both',maxWidth:760,margin:'0 auto'}}>
    <button onClick={()=>go('reports')} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--text-3)',fontWeight:600,marginBottom:18}}><Icon name="arrowLeft" size={15}/> My Reports</button>
    {/* hero */}
    <div style={{background:'linear-gradient(135deg,#4338CA,#3730A3)',borderRadius:'var(--r-xl)',padding:'30px 32px',color:'#fff',marginBottom:22,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:.5,background:'radial-gradient(circle at 90% 10%,rgba(255,255,255,.18),transparent 45%)'}}></div>
      <div style={{position:'relative'}}>
        <Chip style={{background:'rgba(255,255,255,.14)',color:'#fff'}}>Your results</Chip>
        <h1 style={{fontSize:28,fontWeight:700,color:'#fff',marginTop:12}}>Your Strengths & Growth</h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,.78)',marginTop:8,lineHeight:1.55,maxWidth:520}}>
          This report highlights what you do well and where you can grow. It's written to support your development — not to label you.</p>
      </div>
    </div>
    {/* intro */}
    <Block title="A note on your results">
      <p style={{fontSize:15,lineHeight:1.7,color:'var(--text)'}}>You bring a <strong>dependable, principled and clear-thinking</strong> style to your work. You follow through on commitments, hold to your standards under pressure, and think carefully with numbers and structure. Your biggest opportunity is leaning into new and unfamiliar approaches — a strength you can build deliberately.</p>
    </Block>
    {/* strengths */}
    <Block title="Your strengths">
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {R.strengths.map((s,i)=><div key={i} style={{display:'flex',gap:14,padding:16,background:'var(--teal-50)',borderRadius:'var(--r-md)'}}>
          <div style={{width:40,height:40,borderRadius:10,flex:'none',background:'var(--teal-600)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="star" size={19}/></div>
          <div><div style={{fontSize:15,fontWeight:700}}>{s.dim}</div><p style={{fontSize:13.5,color:'var(--text-2)',marginTop:4,lineHeight:1.55}}>{s.text}</p></div></div>)}
      </div>
    </Block>
    {/* development themes */}
    <Block title="Where you can grow">
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {R.stretch.map((s,i)=><div key={i} style={{display:'flex',gap:14,padding:16,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--border)'}}>
          <div style={{width:40,height:40,borderRadius:10,flex:'none',background:'var(--indigo-100)',color:'var(--indigo-600)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="trending" size={19}/></div>
          <div><div style={{fontSize:15,fontWeight:700}}>{s.dim}</div>
            <p style={{fontSize:13.5,color:'var(--text-2)',marginTop:4,lineHeight:1.55}}>Try seeking out one unfamiliar approach each month and reflecting on what you learned. Small, deliberate experiments build comfort over time.</p></div></div>)}
      </div>
    </Block>
    {/* allowed dimensions — friendly bars */}
    <Block title="How you work — a closer look">
      <div style={{display:'flex',flexDirection:'column',gap:13}}>
        {[['Following through reliably',84],['Thinking with numbers',88],['Staying composed under pressure',81],['Working with people',66],['Exploring new approaches',58]].map((d,i)=>
          <div key={i} style={{display:'flex',alignItems:'center',gap:14}}>
            <span style={{width:200,fontSize:13.5,fontWeight:500,flex:'none'}}>{d[0]}</span>
            <div style={{flex:1}}><window.ScoreBar value={d[1]} color="var(--indigo-500)" delay={i*60} height={9}/></div>
            <span style={{fontSize:12.5,fontWeight:700,color:'var(--text-3)',width:64}}>{d[1]>=80?'Strong':d[1]>=65?'Effective':'Developing'}</span></div>)}
      </div>
      <div style={{display:'flex',gap:9,marginTop:16,padding:'12px 14px',background:'var(--indigo-50)',borderRadius:'var(--r-md)'}}>
        <Icon name="info" size={15} color="var(--indigo-600)"/>
        <span style={{fontSize:12.5,color:'var(--indigo-700)',lineHeight:1.5}}>These reflect patterns from your responses, not fixed traits. Everyone grows with practice and support.</span></div>
    </Block>
    <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
      <Button size="lg" icon="download" onClick={()=>toast('Generating PDF','info','Your report is being prepared.')}>Download my report (PDF)</Button></div>
  </div>;
}
function Block({ title, children }) {
  return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:24,boxShadow:'var(--sh-sm)',marginBottom:18}}>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:14,letterSpacing:'-.01em'}}>{title}</h3>{children}</div>;
}

Object.assign(window.USER_PAGES, {
  overview:Overview, consent:Consent, instructions:Instructions, runtime:Runtime,
  completion:Completion, 'user-report':UserReport,
});
})();
