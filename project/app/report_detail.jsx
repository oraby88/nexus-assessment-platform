/* ============================================================
   NEXUS — Admin Report Detail (premium report + Domain 6)
   ============================================================ */
(function(){
const { useState, useRef, useEffect } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, ConfidenceChip, toast } = window;

/* person-vs-required radar */
function FitRadar({ data, size=300 }) {
  const cx=size/2,cy=size/2,R=size/2-50;
  const pt=(i,r,n)=>{ const a=-Math.PI/2+i/n*2*Math.PI; return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]; };
  const n=data.length;
  const personPoly=data.map((d,i)=>pt(i,d.person/100*R,n).join(',')).join(' ');
  const reqPoly=data.map((d,i)=>pt(i,d.required/100*R,n).join(',')).join(' ');
  return <svg width={size} height={size}>
    {[.25,.5,.75,1].map(r=><circle key={r} cx={cx} cy={cy} r={r*R} fill="none" stroke="var(--grid-line-2)" strokeWidth="1"/>)}
    {data.map((d,i)=>{ const [x,y]=pt(i,R,n); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--grid-line)" strokeWidth="1"/>;})}
    <polygon points={reqPoly} fill="none" stroke="#94A0B0" strokeWidth="1.5" strokeDasharray="4 4"/>
    <polygon points={personPoly} fill="rgba(79,70,229,.15)" stroke="#4F46E5" strokeWidth="2.2" style={{animation:'scaleIn .7s var(--ease-out)',transformOrigin:'center'}}/>
    {data.map((d,i)=>pt(i,d.person/100*R,n)).map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#4F46E5"/>)}
    {data.map((d,i)=>{ const [x,y]=pt(i,R+24,n); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="600" fill="#5B6577">{d.axis}</text>;})}
  </svg>;
}

function Gauge({ value, label, sub, color='#4F46E5', risk }) {
  const tone = risk ? (value<35?'var(--teal-600)':value<60?'var(--amber-600)':'var(--rose-600)') : color;
  return <div style={{display:'flex',alignItems:'center',gap:16}}>
    <window.Ring value={value} size={76} stroke={7} color={tone}/>
    <div><div style={{fontSize:15,fontWeight:700}}>{label}</div>
      <div style={{fontSize:12.5,color:'var(--text-2)',marginTop:2,maxWidth:240,lineHeight:1.4}}>{sub}</div></div>
  </div>;
}

const SECTIONS=[
  {id:'summary',label:'Summary'},{id:'strengths',label:'Strengths'},{id:'development',label:'Development'},
  {id:'dimensions',label:'Measured Dimensions'},{id:'domain6',label:'Domain 6 · Contextual Alignment'},
  {id:'interview',label:'Interview Prompts'},{id:'confidence',label:'Confidence & Limitations'},{id:'meta',label:'Blueprint & Version'},
];

function ReportDetail({ go, route }) {
  const R=window.NX.REPORT_DETAIL;
  const [sec,setSec]=useState('summary');
  const [candidateView,setCandidateView]=useState(false);
  const refs=useRef({});
  const scrollTo=(id)=>{ setSec(id); const el=refs.current[id]; const cont=document.getElementById('admin-scroll');
    if(el&&cont){ cont.scrollTo({top:el.offsetTop-90,behavior:'smooth'}); } };

  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    {/* report header */}
    <div style={{background:'linear-gradient(135deg,#11141B 0%,#1E2840 100%)',borderRadius:'var(--r-xl)',padding:'26px 30px',color:'#fff',marginBottom:22,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:.6,background:'radial-gradient(circle at 88% 10%,rgba(79,70,229,.4),transparent 45%)'}}></div>
      <div style={{position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:18}}>
          <Avatar name={R.candidate} size={60}/>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span className="mono" style={{fontSize:11.5,color:'var(--indigo-300)'}}>{R.id}</span>
              <StatusBadge status={R.status}/></div>
            <h1 style={{fontSize:26,fontWeight:700,color:'#fff'}}>{R.candidate}</h1>
            <div style={{fontSize:14,color:'rgba(255,255,255,.62)',marginTop:4}}>{R.role} · {R.useCase} · Completed {R.completed}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <Button variant="secondary" icon="eye" onClick={()=>setCandidateView(v=>!v)}>{candidateView?'Admin view':'Preview Candidate View'}</Button>
          <Button variant="secondary" icon="compare" onClick={()=>go('comparison')} style={{background:'rgba(255,255,255,.1)',color:'#fff',border:'1px solid rgba(255,255,255,.18)'}}>Compare</Button>
          <Button icon="download" onClick={()=>toast('Generating PDF','info','Your report PDF is being prepared.')}>Download PDF</Button>
        </div>
      </div>
      {/* header KPIs */}
      <div style={{position:'relative',display:'flex',gap:30,marginTop:22,flexWrap:'wrap'}}>
        {[['Confidence',R.confidence],['Duration',R.duration],['Contextual Alignment',R.d6.cai+' / 100'],['Scoring',R.scoringVersion]].map((m,i)=>
          <div key={i}><div style={{fontSize:11,color:'rgba(255,255,255,.5)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{m[0]}</div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--font-display)',marginTop:3}}>{m[1]}</div></div>)}
      </div>
    </div>

    {candidateView && <div style={{display:'flex',gap:10,padding:'12px 16px',background:'var(--indigo-50)',border:'1px solid var(--indigo-100)',borderRadius:'var(--r-md)',marginBottom:18}}>
      <Icon name="eye" size={17} color="var(--indigo-600)"/>
      <div style={{fontSize:13,color:'var(--indigo-700)',lineHeight:1.5}}><strong>Candidate-safe preview.</strong> Internal scoring formulas, raw governance flags, restricted metrics and blocked outputs are hidden — this is exactly what {R.candidate.split(' ')[0]} sees.</div></div>}

    <div className="nx-rail-l" style={{gap:24}}>
      {/* section nav */}
      <div className="nx-secnav" style={{position:'sticky',top:84,display:'flex',flexDirection:'column',gap:2}}>
        {SECTIONS.filter(s=>!candidateView||!['domain6','confidence','meta'].includes(s.id)||s.id==='confidence').map(s=>(
          <button key={s.id} onClick={()=>scrollTo(s.id)} style={{textAlign:'left',padding:'8px 12px',borderRadius:'var(--r-sm)',fontSize:12.5,fontWeight:sec===s.id?700:500,
            color:sec===s.id?'var(--indigo-700)':'var(--text-2)',background:sec===s.id?'var(--indigo-50)':'transparent',transition:'all .15s'}}>{s.label}</button>))}
      </div>
      {/* content */}
      <div style={{display:'flex',flexDirection:'column',gap:22,minWidth:0}}>
        {/* summary */}
        <Sec id="summary" refs={refs} title="Candidate Summary">
          <p style={{fontSize:15,lineHeight:1.65,color:'var(--text)'}}>
            {R.candidate.split(' ')[0]} presents a <strong>dependable, principled and analytically strong</strong> profile well-suited to a regulated finance environment. Integrity and numerical reasoning are clear signature strengths, supported by reliable execution discipline. The main development edge is comfort with ambiguity and experimentation — a manageable stretch given this role's structured, precision-led demands.</p>
          <div style={{display:'flex',gap:24,marginTop:18,flexWrap:'wrap'}}>
            {[['Signature strength','Integrity Orientation'],['Top cognitive','Numerical Reasoning'],['Primary stretch','Exploratory Openness']].map((m,i)=>
              <div key={i}><div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase'}}>{m[0]}</div>
                <div style={{fontSize:14,fontWeight:700,marginTop:3,color:'var(--indigo-700)'}}>{m[1]}</div></div>)}
          </div>
        </Sec>

        {/* strengths */}
        <Sec id="strengths" refs={refs} title="Core Strengths">
          <div className="nx-g3" style={{gap:14}}>
            {R.strengths.map((s,i)=><div key={i} style={{background:'var(--teal-50)',border:'1px solid var(--teal-100)',borderRadius:'var(--r-md)',padding:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <Icon name="star" size={16} color="var(--teal-600)"/>
                <span style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-display)',color:'var(--teal-700)'}}>{s.score}</span></div>
              <div style={{fontSize:13.5,fontWeight:700}}>{s.dim}</div>
              <p style={{fontSize:12.5,color:'var(--text-2)',marginTop:6,lineHeight:1.5}}>{s.text}</p></div>)}
          </div>
        </Sec>

        {/* development */}
        <Sec id="development" refs={refs} title="Development Areas">
          <div className="nx-g2" style={{gap:14}}>
            {R.stretch.map((s,i)=><div key={i} style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <Icon name="trending" size={16} color="var(--amber-600)"/>
                <span style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-display)',color:'var(--amber-700)'}}>{s.score}</span></div>
              <div style={{fontSize:13.5,fontWeight:700}}>{s.dim}</div>
              <p style={{fontSize:12.5,color:'var(--text-2)',marginTop:6,lineHeight:1.5}}>{s.text}</p></div>)}
          </div>
        </Sec>

        {/* dimensions */}
        <Sec id="dimensions" refs={refs} title="Measured Dimensions">
          <div style={{display:'flex',flexDirection:'column',gap:22}}>
            {R.domains.map(dom=><div key={dom.code}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
                <span style={{width:10,height:10,borderRadius:3,background:dom.color}}></span>
                <span className="mono" style={{fontSize:11,fontWeight:700,color:'var(--text-3)'}}>{dom.code}</span>
                <h4 style={{fontSize:14,fontWeight:700}}>{dom.label}</h4></div>
              <div style={{display:'flex',flexDirection:'column',gap:11}}>
                {dom.dims.map((d,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:14}}>
                  <span style={{width:180,fontSize:13,fontWeight:500,flex:'none'}}>{d.name}</span>
                  <div style={{flex:1}}><window.ScoreBar value={d.score} color={dom.color} delay={i*50}/></div>
                  <span className="tnum" style={{fontSize:13.5,fontWeight:700,width:30,textAlign:'right'}}>{d.score}</span>
                  {!candidateView && <div style={{width:88}}><ConfidenceChip level={d.conf}/></div>}
                </div>)}
              </div>
            </div>)}
          </div>
        </Sec>

        {/* DOMAIN 6 — the signature */}
        {!candidateView && <Sec id="domain6" refs={refs} title="Domain 6 · Contextual Alignment & Decision Influence"
          badge={<Chip tone="violet" icon="layers">Derived layer</Chip>}>
          <p style={{fontSize:13.5,color:'var(--text-2)',lineHeight:1.6,marginBottom:18,maxWidth:680}}>{R.d6.narrative}</p>
          <div className="nx-rail-sm-rev nx-d6grid" style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:24,alignItems:'center'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:'var(--surface-2)',borderRadius:'var(--r-lg)',padding:'16px 10px'}}>
              <FitRadar data={R.d6.radar} size={300}/>
              <div style={{display:'flex',gap:16,fontSize:11.5,fontWeight:600}}>
                <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:14,height:3,background:'#4F46E5',borderRadius:2}}></span>Candidate</span>
                <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:14,height:0,borderTop:'2px dashed #94A0B0'}}></span>Context requirement</span></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <Gauge value={R.d6.cai} label="Contextual Alignment Index (CAI)" sub={R.d6.caiBand+' — strong match to this regulated environment.'} color="#3730A3"/>
              <Gauge value={R.d6.dii} label="Decision Influence Index (DII)" sub="Likely to shape decisions through disciplined, evidence-led judgement." color="#0D9488"/>
            </div>
          </div>
          {/* secondary indices */}
          <h4 style={{fontSize:13,fontWeight:700,margin:'24px 0 14px'}}>Secondary Indices</h4>
          <div className="nx-g3" style={{gap:12}}>
            {R.d6.secondary.map((s,i)=>{ const isRisk=s.type==='risk';
              const tone=isRisk?(s.score<35?'teal':s.score<60?'amber':'rose'):(s.score>=75?'teal':s.score>=55?'indigo':'amber'); const t=window.TONES[tone];
              return <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'14px 16px',boxShadow:'var(--sh-sm)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span className="mono" style={{fontSize:10.5,fontWeight:700,color:'var(--text-3)'}}>{s.code}</span>
                  {isRisk && <span style={{fontSize:9.5,fontWeight:700,padding:'1px 6px',borderRadius:99,background:'var(--amber-50)',color:'var(--amber-700)'}}>RISK</span>}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginTop:8}}>
                  <span style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-display)',color:t.fg}}>{s.score}</span>
                  <span style={{fontSize:12,fontWeight:600,color:'var(--text-2)'}}>{s.name}</span></div>
                <div style={{marginTop:9}}><window.ScoreBar value={s.score} color={t.dot} height={5} delay={i*40}/></div>
              </div>;})}
          </div>
          {/* contextual strengths/risks */}
          <div className="nx-g2" style={{gap:14,marginTop:18}}>
            <div style={{background:'var(--teal-50)',borderRadius:'var(--r-md)',padding:16}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--teal-700)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.04em'}}>Contextual Strengths</div>
              {R.d6.contextStrengths.map((s,i)=><div key={i} style={{display:'flex',gap:8,fontSize:13,marginBottom:7,color:'var(--text-2)'}}><Icon name="check" size={15} color="var(--teal-600)"/>{s}</div>)}</div>
            <div style={{background:'var(--amber-50)',borderRadius:'var(--r-md)',padding:16}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--amber-700)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.04em'}}>Contextual Risks</div>
              {R.d6.contextRisks.map((s,i)=><div key={i} style={{display:'flex',gap:8,fontSize:13,marginBottom:7,color:'var(--text-2)'}}><Icon name="alert" size={15} color="var(--amber-600)"/>{s}</div>)}</div>
          </div>
        </Sec>}

        {/* interview prompts */}
        <Sec id="interview" refs={refs} title="Structured Interview Prompts">
          <p style={{fontSize:13,color:'var(--text-2)',marginBottom:14}}>Evidence-based prompts to probe stretch areas in a structured interview. These support — never replace — human judgement.</p>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {R.interviewPrompts.map((p,i)=><div key={i} style={{display:'flex',gap:14,padding:16,background:'var(--surface-2)',borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)'}}>
              <div style={{width:30,height:30,borderRadius:8,flex:'none',background:'var(--indigo-100)',color:'var(--indigo-600)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)'}}>{i+1}</div>
              <div><div style={{fontSize:11,fontWeight:700,color:'var(--indigo-600)',textTransform:'uppercase',letterSpacing:'.04em'}}>{p.dim}</div>
                <p style={{fontSize:14,marginTop:5,lineHeight:1.5}}>{p.q}</p></div></div>)}
          </div>
        </Sec>

        {/* confidence & limitations */}
        <Sec id="confidence" refs={refs} title="Confidence Summary & Limitations">
          <div className="nx-g2" style={{gap:16}}>
            <div style={{background:'var(--surface-2)',borderRadius:'var(--r-md)',padding:16,border:'1px solid var(--border)'}}>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:10}}>Report Limitations</div>
              {R.limitations.map((l,i)=><div key={i} style={{display:'flex',gap:8,fontSize:12.5,marginBottom:9,color:'var(--text-2)',lineHeight:1.45}}><Icon name="info" size={14} color="var(--text-3)" style={{flexShrink:0,marginTop:1}}/>{l}</div>)}</div>
            <div style={{background:'var(--surface-2)',borderRadius:'var(--r-md)',padding:16,border:'1px solid var(--border)'}}>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:10}}>Omitted Sections</div>
              {R.omitted.map((o,i)=><div key={i} style={{display:'flex',gap:8,fontSize:12.5,marginBottom:9,color:'var(--text-2)',lineHeight:1.45}}>
                <Icon name="lock" size={14} color="var(--rose-600)" style={{flexShrink:0,marginTop:1}}/><div><strong>{o.name}.</strong> {o.reason}</div></div>)}</div>
          </div>
        </Sec>

        {/* meta */}
        {!candidateView && <Sec id="meta" refs={refs} title="Blueprint, Context & Version">
          <div className="nx-g3" style={{gap:14}}>
            {[['Blueprint',R.blueprint,'Validated'],['Context Profile',R.context,'Active'],['Version',R.scoringVersion+' · '+R.synthVersion,'']].map((m,i)=>
              <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:16,boxShadow:'var(--sh-sm)'}}>
                <div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase'}}>{m[0]}</div>
                <div style={{fontSize:14,fontWeight:700,marginTop:5}}>{m[1]}</div>
                {m[2] && <div style={{marginTop:8}}><StatusBadge status={m[2]} size="sm"/></div>}</div>)}
          </div>
        </Sec>}
      </div>
    </div>
  </div>;
}
function Sec({ id, refs, title, badge, children }) {
  return <div ref={el=>refs.current[id]=el} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:24,boxShadow:'var(--sh-sm)',scrollMarginTop:90}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
      <h3 style={{fontSize:17,fontWeight:700,letterSpacing:'-.01em'}}>{title}</h3>{badge}</div>
    {children}</div>;
}

window.ADMIN_PAGES['report-detail'] = ReportDetail;
window.__FitRadar = FitRadar;
})();
