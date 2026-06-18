/* ============================================================
   NEXUS — Create Assessment steps 4–9 (window.__CA)
   ============================================================ */
(function(){
const { useState } = React;
const CA = window.__CA = window.__CA || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, toast } = window;
const StepHead = window.__StepHead;
const { PanelChips } = window.__ReqHelpers;

/* ---------------- STEP 4 — Requirements summary ---------------- */
function Requirements() {
  const P=window.NX.JOB_PROFILE;
  const Sec=({title,children})=> <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
    <h3 style={{fontSize:13.5,fontWeight:700,marginBottom:12}}>{title}</h3>{children}</div>;
  const chips=(items,tone)=><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{items.map((it,i)=>{const t=window.TONES[tone];
    return <span key={i} style={{padding:'5px 11px',borderRadius:8,background:t.bg,color:t.fg,fontSize:12.5,fontWeight:600}}>{it}</span>;})}</div>;
  return <div>
    <StepHead title="Job Requirements Profile" sub="The agent assembled this from your interview. Edit anything, return to the chat, or approve to continue."/>
    <div style={{display:'flex',gap:10,marginBottom:18}}>
      <Button variant="secondary" size="sm" icon="edit">Edit</Button>
      <Button variant="secondary" size="sm" icon="sparkles">Ask Agent to Refine</Button>
      <Button variant="ghost" size="sm" icon="arrowLeft">Return to Chat</Button>
    </div>
    {/* hero summary */}
    <div style={{background:'linear-gradient(135deg,#11141B,#1E2840)',borderRadius:'var(--r-lg)',padding:'22px 24px',marginBottom:18,color:'#fff',
      display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
      <div style={{flex:1,minWidth:200}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--indigo-300)'}}>Role Summary</div>
        <div style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-display)',marginTop:4}}>{P.role}</div>
        <div style={{fontSize:13.5,color:'rgba(255,255,255,.65)',marginTop:3}}>{P.family} · {P.level} · {P.duration} estimated</div>
      </div>
      <div style={{display:'flex',gap:28}}>
        {[['6','Critical dims'],['3','Focus domains'],['2','Non-negotiables']].map((s,i)=>
          <div key={i}><div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-display)'}}>{s[0]}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>{s[1]}</div></div>)}
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <Sec title="Main Responsibilities">{chips(P.responsibilities,'indigo')}</Sec>
      <Sec title="Required Skills">{chips(P.skills,'teal')}</Sec>
      <Sec title="Required Behaviours">{chips(P.behaviours,'violet')}</Sec>
      <Sec title="Context Requirements">{chips(P.context,'slate')}</Sec>
      <Sec title="Critical Dimensions">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {P.dimensions.map((d,i)=>{ const wm={Critical:'rose',High:'indigo',Moderate:'slate'}; const t=window.TONES[wm[d.weight]];
            return <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
              <span className="mono" style={{fontSize:10.5,fontWeight:700,color:'var(--text-3)',width:22}}>{d.domain}</span>
              <span style={{flex:1,fontSize:13,fontWeight:600}}>{d.name}</span>
              <span style={{fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:99,background:t.bg,color:t.fg}}>{d.weight}</span></div>;})}
        </div></Sec>
      <Sec title="Success & Risk">
        <div style={{fontSize:11,fontWeight:700,color:'var(--teal-700)',marginBottom:6}}>SUCCESS INDICATORS</div>
        {P.success.map((s,i)=><div key={i} style={{display:'flex',gap:8,fontSize:12.5,marginBottom:5,color:'var(--text-2)'}}>
          <Icon name="check" size={14} color="var(--teal-600)"/>{s}</div>)}
        <div style={{fontSize:11,fontWeight:700,color:'var(--rose-700)',margin:'12px 0 6px'}}>FAILURE RISKS</div>
        {P.risks.map((s,i)=><div key={i} style={{display:'flex',gap:8,fontSize:12.5,marginBottom:5,color:'var(--text-2)'}}>
          <Icon name="alert" size={14} color="var(--rose-600)"/>{s}</div>)}
      </Sec>
    </div>
    <div style={{marginTop:16,padding:16,background:'var(--amber-50)',border:'1px solid var(--amber-100)',borderRadius:'var(--r-md)',display:'flex',gap:10}}>
      <Icon name="lock" size={16} color="var(--amber-700)"/>
      <div style={{fontSize:12.5,color:'var(--amber-700)',lineHeight:1.5}}><strong>Non-negotiables:</strong> {P.nonNegotiables.join(' · ')}. A score below threshold on these blocks a positive role-fit indicator.</div>
    </div>
  </div>;
}
CA.Requirements = Requirements;

/* ---------------- STEP 5 — Blueprint ---------------- */
function PickBlueprint({ data, set }) {
  const NX=window.NX;
  const [sel,setSel]=useState(data.blueprint||'BP-301');
  return <div>
    <StepHead title="Link a Role Blueprint" sub="Hiring Support requires a validated blueprint. It defines what success looks like — beyond the job title."/>
    <div style={{display:'flex',gap:10,marginBottom:18}}>
      <Button variant="secondary" size="sm" icon="plus" onClick={()=>window.__goAdmin('create-blueprint')}>Create Blueprint</Button></div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {NX.BLUEPRINTS.filter(b=>b.family==='Finance'||b.status==='Validated').map(b=>{ const on=sel===b.id;
        return <button key={b.id} onClick={()=>{setSel(b.id);set('blueprint',b.id);}} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 18px',
          borderRadius:'var(--r-lg)',border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',textAlign:'left',transition:'all .15s'}}>
          <div style={{width:42,height:42,borderRadius:11,flex:'none',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--indigo-500)'}}><Icon name="blueprint" size={20}/></div>
          <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:15,fontWeight:700}}>{b.name}</span><StatusBadge status={b.status} size="sm"/></div>
            <div style={{fontSize:12.5,color:'var(--text-3)',marginTop:3}}>{b.role} · {b.family} · {b.version} · {b.used} assessments</div></div>
          {b.status!=='Validated' && <window.Tooltip text="Only validated blueprints can be used for Hiring Support scoring."><Icon name="alert" size={18} color="var(--amber-600)"/></window.Tooltip>}
          {on && <Icon name="checkCircle" size={22} color="var(--indigo-500)"/>}
        </button>;})}
    </div>
  </div>;
}
CA.PickBlueprint = PickBlueprint;

/* ---------------- STEP 6 — Context ---------------- */
function PickContext({ data, set }) {
  const NX=window.NX;
  const [sel,setSel]=useState(data.context||'CX-101');
  const ctx=NX.CONTEXTS.find(c=>c.id===sel);
  return <div>
    <StepHead title="Link a Context Profile" sub="The context describes the environment. It powers Domain 6 — how this person's profile fits and influences decisions here."/>
    <div style={{display:'flex',gap:10,marginBottom:18}}>
      <Button variant="secondary" size="sm" icon="plus" onClick={()=>window.__goAdmin('create-context')}>Create Context Profile</Button></div>
    <div className="nx-rail-ctx" style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:18}}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {NX.CONTEXTS.map(c=>{ const on=sel===c.id;
          return <button key={c.id} onClick={()=>{setSel(c.id);set('context',c.id);}} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',
            borderRadius:'var(--r-lg)',border:'1.5px solid '+(on?'var(--indigo-500)':'var(--border)'),background:on?'var(--indigo-50)':'var(--surface)',textAlign:'left',transition:'all .15s'}}>
            <div style={{width:40,height:40,borderRadius:11,flex:'none',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--teal-600)'}}><Icon name="context" size={19}/></div>
            <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14.5,fontWeight:700}}>{c.name}</span><StatusBadge status={c.status} size="sm"/></div>
              <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>{c.role} · {c.level}</div></div>
            {on && <Icon name="checkCircle" size={20} color="var(--indigo-500)"/>}
          </button>;})}
      </div>
      {ctx && <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)',height:'fit-content',position:'sticky',top:0}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>Context Signature</div>
        {window.__ContextMini && <window.__ContextMini vals={ctx.vals}/>}
      </div>}
    </div>
  </div>;
}
CA.PickContext = PickContext;

/* ---------------- STEP 7 — Question selection ---------------- */
function QuestionSelect() {
  const SEL=window.NX.SELECTED_QUESTIONS;
  const QT=window.NX.QTYPES;
  const [filter,setFilter]=useState('All');
  const [open,setOpen]=useState(SEL[0].id);
  let rows=SEL;
  return <div>
    <StepHead title="Question Selection & Adaptation" sub="The agent selected governed items and rephrased them for this role — preserving every scoring property. Nothing is invented."/>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
      {['All','Approved','Needs review'].map(f=><Chip key={f} active={filter===f} onClick={()=>setFilter(f)} tone="indigo">{f}</Chip>)}
      <div style={{flex:1}}></div>
      <div style={{fontSize:12.5,color:'var(--text-3)'}}><strong style={{color:'var(--text)'}}>{SEL.length}</strong> items · ~42 min · 3 domains</div>
    </div>
    {/* governance banner */}
    <div style={{display:'flex',gap:10,padding:'12px 16px',background:'var(--teal-50)',border:'1px solid var(--teal-100)',borderRadius:'var(--r-md)',marginBottom:16}}>
      <Icon name="shieldCheck" size={17} color="var(--teal-700)"/>
      <div style={{fontSize:12.5,color:'var(--teal-700)',lineHeight:1.5}}>Every adapted item keeps its original <strong>Question ID, domain, dimension, facet, scoring rule and governance status</strong>. The agent cannot create new questions or change scoring logic.</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {rows.map(qq=>{ const isOpen=open===qq.id; const meta=QT[Object.keys(QT).find(k=>QT[k].label===qq.type)]||{tone:'#4F46E5'};
        return <div key={qq.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
          <div onClick={()=>setOpen(isOpen?null:qq.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',cursor:'pointer'}}>
            <span className="mono" style={{fontSize:11,fontWeight:600,color:'var(--text-3)',width:96,flex:'none'}}>{qq.id}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:600,lineHeight:1.4}}>{qq.adapted}</div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6,flexWrap:'wrap'}}>
                <span style={{fontSize:10.5,fontWeight:700,padding:'2px 8px',borderRadius:99,background:meta.tone+'18',color:meta.tone}}>{qq.type}</span>
                <span style={{fontSize:11.5,color:'var(--text-3)'}}>{qq.domain} · {qq.dim}</span>
                <span style={{fontSize:11.5,color:'var(--text-3)'}}>· covers <strong style={{color:'var(--text-2)'}}>{qq.requirement}</strong></span>
              </div>
            </div>
            <StatusBadge status={qq.status==='approved'?'Validated':'Under Review'} size="sm"/>
            <window.TrustBadge kind="locked" size="sm" tip="Scoring construct, dimension and rule are locked to the governed bank item."/>
            <Icon name="chevronDown" size={18} color="var(--text-3)" style={{transform:isOpen?'rotate(180deg)':'none',transition:'transform .2s'}}/>
          </div>
          {isOpen && <div style={{padding:'0 18px 18px',animation:'fadeUp .25s var(--ease-out) both'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,padding:'14px 16px',background:'var(--surface-2)',borderRadius:'var(--r-md)'}}>
              <div><div style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',color:'var(--text-3)',marginBottom:4}}>Original (governed bank)</div>
                <div style={{fontSize:13,color:'var(--text-2)',lineHeight:1.45,fontStyle:'italic'}}>"{qq.original}"</div></div>
              <div><div style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',color:'var(--indigo-500)',marginBottom:4,display:'flex',alignItems:'center',gap:6}}>Adapted for this role
                <span style={{fontSize:9,fontWeight:700,color:'var(--text-3)',background:'var(--indigo-100)',padding:'1px 6px',borderRadius:99,textTransform:'none',letterSpacing:0}}>changes highlighted</span></div>
                <div style={{fontSize:13,color:'var(--text)',lineHeight:1.45}}>"{window.diffWords(qq.original,qq.adapted)}"</div></div>
            </div>
            {/* locked scoring strip */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:12,padding:'11px 14px',
              background:'var(--teal-50)',border:'1px solid var(--teal-100)',borderRadius:'var(--r-md)'}}>
              <div style={{width:30,height:30,borderRadius:8,flex:'none',background:'var(--teal-600)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="lock" size={15}/></div>
              <div style={{flex:1,fontSize:12,color:'var(--teal-700)',lineHeight:1.45}}>Wording adapted to context — <strong>construct, dimension and scoring rule are locked</strong> and identical to the bank item.</div>
              <window.TrustBadge kind="locked" size="sm"/>
            </div>
            <div style={{display:'flex',gap:18,flexWrap:'wrap',marginTop:14,padding:'0 2px'}}>
              {[['Facet',qq.facet],['Scoring',qq.scoring],['Governance',qq.gov],['Validation',qq.val],['Job-Level',qq.relevance]].map((m,i)=>
                <div key={i}><div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'var(--text-3)'}}>{m[0]}</div>
                  <div className="mono" style={{fontSize:11.5,fontWeight:600,marginTop:2}}>{m[1]}</div></div>)}
            </div>
            <div style={{display:'flex',gap:8,marginTop:16}}>
              <Button size="sm" icon="check" onClick={()=>toast('Question approved','success')}>Approve</Button>
              <Button size="sm" variant="secondary" icon="sparkles" onClick={()=>toast('Rephrasing requested','info','The agent will propose a new wording.')}>Request Rephrasing</Button>
              <Button size="sm" variant="secondary" icon="refresh">Replace</Button>
              <Button size="sm" variant="ghost" icon="eye">Preview User View</Button>
              <div style={{flex:1}}></div>
              <Button size="sm" variant="ghost" icon="trash" style={{color:'var(--rose-600)'}}>Remove</Button>
            </div>
          </div>}
        </div>;})}
    </div>
    <button style={{display:'flex',alignItems:'center',gap:9,marginTop:14,padding:'12px 14px',borderRadius:'var(--r-md)',
      border:'1.5px dashed var(--border-strong)',width:'100%',color:'var(--indigo-600)',fontWeight:600,fontSize:13.5,justifyContent:'center'}}>
      <Icon name="plus" size={16}/> Add another governed item for a dimension</button>
  </div>;
}
CA.QuestionSelect = QuestionSelect;

/* ---------------- STEP 8 — Review coverage (interactive) ---------------- */
function ReviewCoverage() {
  const initial=[
    {l:'Character & Work Style',code:'D1',v:3,color:'#4F46E5',req:2},
    {l:'Thinking & Problem Solving',code:'D2',v:1,color:'#0D9488',req:1},
    {l:'Emotional Intelligence',code:'D4',v:1,color:'#C2820B',req:1},
  ];
  const [bars,setBars]=React.useState(initial);
  const total=bars.reduce((a,b)=>a+b.v,0);
  const covered=bars.filter(b=>b.v>=b.req).length;
  const coveragePct=Math.round(covered/bars.length*100);
  const duration=Math.max(8,Math.round(total*8.4));
  const adj=(i,d)=>setBars(bs=>bs.map((b,j)=>j===i?{...b,v:Math.max(0,Math.min(6,b.v+d))}:b));
  const types=[['Likert Agreement',Math.max(1,bars[0].v),'#4F46E5'],['Situational Judgement',bars[2].v,'#C2820B'],['Forced Choice',1,'#0D9488'],['Cognitive',bars[1].v,'#7C3AED']];
  const typeTotal=types.reduce((a,t)=>a+t[1],0)||1;
  return <div>
    <StepHead title="Assessment Review" sub="A live coverage check before you approve. Adjust items per dimension and watch coverage update — balanced domains, mixed methods, full job-requirement coverage."/>
    <div className="nx-g4" style={{gap:14,marginBottom:20}}>
      {[['Total questions',total,'assessment'],['Est. duration','~'+duration+' min','clock'],['Domain coverage',covered+' of '+bars.length,'layers'],['Req. coverage',coveragePct+'%','target']].map((m,i)=>
        <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:16,boxShadow:'var(--sh-sm)'}}>
          <Icon name={m[2]} size={18} color={m[0]==='Req. coverage'&&coveragePct<100?'var(--amber-600)':'var(--indigo-500)'}/>
          <div style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-display)',marginTop:10,transition:'color .3s',color:m[0]==='Req. coverage'&&coveragePct<100?'var(--amber-700)':'var(--text)'}}>{m[1]}</div>
          <div style={{fontSize:12,color:'var(--text-3)'}}>{m[0]}</div></div>)}
    </div>
    <div className="nx-g2" style={{gap:18}}>
      {/* interactive coverage map */}
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <h3 style={{fontSize:13.5,fontWeight:700}}>Coverage Map</h3>
          <span style={{fontSize:11,color:'var(--text-3)',fontWeight:600}}>tap ± to rebalance</span></div>
        {bars.map((b,i)=>{ const under=b.v<b.req;
          return <div key={i} style={{marginBottom:15}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12.5,marginBottom:6}}>
            <span style={{fontWeight:600,display:'flex',alignItems:'center',gap:7}}>
              <span className="mono" style={{fontSize:10,fontWeight:700,color:'var(--text-3)'}}>{b.code}</span>{b.l}
              {under && <window.Tooltip text={'Below required coverage ('+b.req+' min). Add an item.'}><Icon name="alert" size={13} color="var(--amber-600)"/></window.Tooltip>}
            </span>
            <span style={{display:'flex',alignItems:'center',gap:8}}>
              <button onClick={()=>adj(i,-1)} style={stepBtn}>−</button>
              <span className="tnum" style={{fontSize:12.5,fontWeight:700,width:48,textAlign:'center',color:under?'var(--amber-700)':'var(--text-2)'}}>{b.v} item{b.v!==1?'s':''}</span>
              <button onClick={()=>adj(i,1)} style={stepBtn}>+</button>
            </span></div>
          <div style={{height:9,background:'var(--track)',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:Math.min(100,b.v/4*100)+'%',background:under?'var(--amber-500,#E0A93B)':b.color,
              borderRadius:99,transition:'width .5s var(--ease-out), background .3s'}}></div></div>
        </div>;})}
        {covered<bars.length && <div style={{display:'flex',gap:9,marginTop:6,padding:'10px 13px',background:'var(--amber-50)',border:'1px solid var(--amber-100)',borderRadius:'var(--r-md)'}}>
          <Icon name="alert" size={15} color="var(--amber-700)"/>
          <span style={{fontSize:12,color:'var(--amber-700)',lineHeight:1.45}}>{bars.length-covered} dimension{bars.length-covered>1?'s are':' is'} below required coverage. Add at least one governed item to each.</span></div>}
      </div>
      {/* type distribution */}
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:13.5,fontWeight:700,marginBottom:16}}>Question-Type Distribution</h3>
        <div style={{display:'flex',height:14,borderRadius:99,overflow:'hidden',marginBottom:16,background:'var(--track)'}}>
          {types.map((t,i)=><div key={i} style={{width:(t[1]/typeTotal*100)+'%',background:t[2],transition:'width .5s var(--ease-out)'}}></div>)}</div>
        {types.map((t,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:9,marginBottom:8}}>
          <span style={{width:9,height:9,borderRadius:99,background:t[2]}}></span>
          <span style={{flex:1,fontSize:12.5,fontWeight:500}}>{t[0]}</span>
          <span className="tnum" style={{fontSize:12.5,fontWeight:600,color:'var(--text-3)'}}>{t[1]}</span></div>)}
        <div style={{marginTop:14,display:'flex',gap:6,flexWrap:'wrap'}}>
          <window.TrustBadge kind="governed" size="sm"/><window.TrustBadge kind="locked" size="sm"/>
        </div>
      </div>
    </div>
    <div className="nx-g2" style={{gap:18,marginTop:18}}>
      <CheckCard items={[['Context alignment','FinMgr · Regulated linked'],['Scoring coverage','All items mapped'],['Job-requirement coverage',covered+' of '+bars.length+' dimensions']]}/>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:13.5,fontWeight:700,marginBottom:14}}>Deadline & Reminders</h3>
        <window.__KV k="Deadline" v="June 25, 2026"/>
        <window.__KV k="Reminders" v="3 days & 1 day before"/>
        <window.__KV k="Consent" v="Required · per use case"/>
        <div style={{marginTop:12}}><Button size="sm" variant="secondary" icon="eye">Preview Assessment</Button></div>
      </div>
    </div>
  </div>;
}
const stepBtn={width:24,height:24,borderRadius:7,border:'1px solid var(--border-strong)',background:'var(--surface)',
  color:'var(--text-2)',fontSize:15,fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center',lineHeight:1};
function CheckCard({ items }) {
  return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
    <h3 style={{fontSize:13.5,fontWeight:700,marginBottom:14}}>Governance Checks</h3>
    {items.map((it,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<items.length-1?'1px solid var(--border-soft)':'none'}}>
      <div style={{width:22,height:22,borderRadius:99,background:'var(--teal-50)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={13} color="var(--teal-600)" stroke={3}/></div>
      <span style={{flex:1,fontSize:13,fontWeight:600}}>{it[0]}</span>
      <span style={{fontSize:12,color:'var(--text-3)'}}>{it[1]}</span></div>)}
  </div>;
}
CA.ReviewCoverage = ReviewCoverage;

/* ---------------- STEP 9 — Send ---------------- */
function SendStep({ data, go }) {
  const [sent,setSent]=useState(false);
  if(sent) return <div style={{textAlign:'center',padding:'40px 0'}}>
    <window.__SuccessCheck/>
    <h2 style={{fontSize:24,fontWeight:700,marginTop:16}}>Assessment sent</h2>
    <p style={{fontSize:15,color:'var(--text-2)',marginTop:8,maxWidth:440,marginInline:'auto',lineHeight:1.55}}>
      {data.user||'The candidate'} has been invited to the Finance Manager assessment. You'll be notified at each milestone.</p>
    <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:24}}>
      <Button variant="secondary" onClick={()=>go('assessments')}>View Assessments</Button>
      <Button icon="dashboard" onClick={()=>go('dashboard')}>Back to Dashboard</Button></div>
  </div>;
  return <div>
    <StepHead title="Review & Send" sub="Final confirmation. The candidate receives an invitation with a use-case-specific consent request."/>
    <div className="nx-rail-send" style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)'}}>
        {[['Candidate',data.user||'Amara Okonkwo'],['Use Case',data.purpose],['Role','Finance Manager'],['Job Level','Manager'],
          ['Blueprint','Finance Manager v3 · Validated'],['Context Profile','FinMgr · Regulated'],['Questions','5 items · ~42 min'],
          ['Deadline','June 25, 2026'],['Reminders','3 days & 1 day before'],['Consent','Required · Hiring Support']].map((m,i)=>
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:i<9?'1px solid var(--border-soft)':'none'}}>
            <span style={{fontSize:13,color:'var(--text-3)'}}>{m[0]}</span><span style={{fontSize:13.5,fontWeight:600}}>{m[1]}</span></div>)}
      </div>
      {/* invitation preview */}
      <div>
        <div style={{fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--text-3)',marginBottom:10}}>Invitation Preview</div>
        <div style={{border:'1px solid var(--border)',borderRadius:'var(--r-lg)',overflow:'hidden',boxShadow:'var(--sh-sm)'}}>
          <div style={{background:'#11141B',padding:'16px 18px',display:'flex',alignItems:'center',gap:10}}>
            <window.NexusMark size={22} light/><span style={{color:'#fff',fontSize:13.5,fontWeight:700}}>Nexus</span></div>
          <div style={{padding:18,background:'var(--surface)'}}>
            <div style={{fontSize:14,fontWeight:700}}>You've been invited to an assessment</div>
            <p style={{fontSize:12.5,color:'var(--text-2)',marginTop:8,lineHeight:1.55}}>Hello {(data.user||'Amara').split(' ')[0]}, Meridian Group has invited you to complete a Finance Manager assessment. It takes about 42 minutes and you can pause and resume.</p>
            <div style={{marginTop:14,padding:'10px 12px',background:'var(--indigo-500)',color:'#fff',borderRadius:'var(--r-md)',textAlign:'center',fontSize:13,fontWeight:600}}>Start Assessment →</div>
            <p style={{fontSize:11,color:'var(--text-3)',marginTop:12,lineHeight:1.5}}>Deadline: June 25, 2026 · Your consent will be requested before you begin.</p>
          </div>
        </div>
        <Button full size="lg" icon="send" style={{marginTop:16}} onClick={()=>{setSent(true);toast('Invitation sent','success',(data.user||'The candidate')+' was invited.');}}>Send Assessment Invitation</Button>
      </div>
    </div>
  </div>;
}
CA.SendStep = SendStep;
})();
