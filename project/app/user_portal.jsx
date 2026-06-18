/* ============================================================
   NEXUS — User Portal (login, shell, dashboard, lists, report)
   ============================================================ */
(function(){
const { useState, useEffect } = React;
const { Button, IconButton, StatusBadge, Avatar, Chip, PageHeader, EmptyState, ConfidenceChip, toast } = window;
window.USER_PAGES = {};

/* candidate's data */
const ME = {
  name:'Amara Okonkwo', first:'Amara', org:'Meridian Group',
  active:{role:'Finance Manager',purpose:'Hiring Support',deadline:'June 25, 2026',progress:0,sections:4,duration:'42 min'},
};

/* ---------------- Login / Invitation ---------------- */
function UserLogin({ onLogin, onAdmin, onHome }) {
  return <div style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,
    background:'radial-gradient(circle at 50% 0%, var(--indigo-50), var(--canvas) 60%)'}}>
    <div style={{position:'absolute',top:20,right:24,display:'flex',alignItems:'center',gap:8}}>
      {onHome && <button onClick={onHome} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'var(--text-3)'}}><Icon name="arrowLeft" size={14}/> Home</button>}
      <window.ThemeToggle/>
    </div>
    <div style={{width:'100%',maxWidth:420,animation:'fadeUp .5s var(--ease-out) both'}}>
      <div style={{textAlign:'center',marginBottom:8}}>
        <div style={{display:'inline-flex'}}><window.NexusWordmark sub="Candidate Portal"/></div></div>
      <div style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:32,boxShadow:'var(--sh-lg)',border:'1px solid var(--border)',marginTop:20}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'var(--indigo-50)',borderRadius:'var(--r-md)',marginBottom:22}}>
          <Icon name="mail" size={18} color="var(--indigo-600)"/>
          <div style={{fontSize:13,color:'var(--indigo-700)',fontWeight:600}}>You've been invited by Meridian Group</div></div>
        <h2 style={{fontSize:21,fontWeight:700}}>Welcome, Amara</h2>
        <p style={{fontSize:14,color:'var(--text-2)',marginTop:6,lineHeight:1.5}}>Verify your identity to access your assessment. Your responses are private and used only for the stated purpose.</p>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:14}}>
          <window.Field label="Email"><input defaultValue="amara.okonkwo@meridian.co" style={window.inpStyle}/></window.Field>
          <window.Field label="Access Code" right={<a style={{fontSize:12.5,color:'var(--indigo-600)',fontWeight:600}}>Resend code</a>}>
            <input defaultValue="••••••" style={window.inpStyle}/></window.Field>
          <Button full size="lg" onClick={onLogin} iconRight="arrowRight">Access my assessment</Button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:18,padding:'10px 0',justifyContent:'center'}}>
          <Icon name="shieldCheck" size={15} color="var(--teal-600)"/>
          <span style={{fontSize:12,color:'var(--text-3)'}}>Private & secure · GDPR compliant</span></div>
      </div>
      <div style={{textAlign:'center',marginTop:16}}>
        <button onClick={onAdmin} style={{fontSize:13,color:'var(--text-3)',fontWeight:600}}>← Back to admin sign-in</button></div>
    </div>
  </div>;
}
window.UserLogin = UserLogin;

/* ---------------- Shell ---------------- */
function UserShell({ go, route, onExit }) {
  const [navOpen,setNavOpen]=useState(false);
  const Comp = window.USER_PAGES[route.page] || window.USER_PAGES.dashboard;
  // assessment runtime is full-bleed
  const fullBleed = ['runtime','consent','overview','instructions','completion'].includes(route.page);
  const goNav = (p,params)=>{ go(p,params); setNavOpen(false); };
  if(fullBleed) return <><Comp go={go} route={route} onExit={onExit}/><window.ToastHost/></>;
  return <div style={{display:'flex',minHeight:'100vh'}}>
    <window.Sidebar nav={window.NAV_USER} active={route.page} onNav={goNav}
      footerName={ME.name} footerRole="Candidate · Meridian"
      onSwitch={onExit} switchLabel="Exit to sign-in"
      open={navOpen} onClose={()=>setNavOpen(false)}/>
    <main id="user-scroll" style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',height:'100vh',overflow:'auto'}}>
      <window.Topbar onSearch={()=>{}} onMenu={()=>setNavOpen(true)} right={<div style={{display:'flex',alignItems:'center',gap:8}}>
        <window.ThemeToggle/>
        <window.IconButton name="bell" tip="Notifications" onClick={()=>go('notifications')}/>
        <window.IconButton name="help" tip="Help" onClick={()=>go('help')}/>
        <div style={{width:1,height:24,background:'var(--border)'}}></div>
        <window.Popover align="right" width={230} trigger={<div style={{cursor:'pointer'}}><window.Avatar name={ME.name} size={34}/></div>}>
          <window.MenuHeader name={ME.name} sub="amara.okonkwo@meridian.co"/>
          <window.MenuItem icon="profile" label="Profile & Privacy" onClick={()=>go('profile')}/>
          <window.MenuItem icon="reports" label="My Reports" onClick={()=>go('reports')}/>
          <window.MenuItem icon="help" label="Help & Support" onClick={()=>go('help')}/>
          <window.MenuDivider/>
          <window.MenuItem icon="logout" label="Exit to sign-in" danger onClick={onExit}/>
        </window.Popover></div>}/>
      <div style={{flex:1,padding:'clamp(16px,3vw,26px) clamp(14px,3vw,28px) 60px',maxWidth:1080,width:'100%',margin:'0 auto'}}>
        <window.PageFX pageKey={route.page}>
          <Comp go={go} route={route} onExit={onExit}/>
        </window.PageFX></div>
    </main>
    <window.ToastHost/>
    <window.RobotCompanion page={route.page} greeting="Hi! I'm Nex. I'll guide you through your assessment."/>
  </div>;
}
window.UserShell = UserShell;

/* ---------------- Dashboard ---------------- */
function UDashboard({ go }) {
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-.02em'}}>Welcome back, {ME.first}</h1>
      <p style={{fontSize:15,color:'var(--text-2)',marginTop:6}}>You have one assessment in progress. Take your time — you can pause and resume whenever you need.</p>
    </div>
    {/* active assessment hero */}
    <div style={{background:'linear-gradient(135deg,#11141B,#1E2840)',borderRadius:'var(--r-xl)',padding:'28px 32px',color:'#fff',marginBottom:22,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:.6,background:'radial-gradient(circle at 85% 20%,rgba(79,70,229,.4),transparent 50%)'}}></div>
      <div style={{position:'relative',display:'flex',alignItems:'center',gap:28,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:240}}>
          <Chip tone="indigo" style={{background:'rgba(255,255,255,.12)',color:'#C7CEFB'}}>Active assessment</Chip>
          <h2 style={{fontSize:24,fontWeight:700,color:'#fff',marginTop:12}}>{ME.active.role} Assessment</h2>
          <div style={{fontSize:14,color:'rgba(255,255,255,.65)',marginTop:6}}>{ME.org} · {ME.active.sections} sections · about {ME.active.duration}</div>
          <div style={{display:'flex',alignItems:'center',gap:18,marginTop:18}}>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'rgba(255,255,255,.8)'}}><Icon name="calendar" size={15} color="#A5B0F8"/> Due {ME.active.deadline}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'rgba(255,255,255,.8)'}}><Icon name="clock" size={15} color="#A5B0F8"/> Not started</div>
          </div>
          <div style={{marginTop:20}}><Button size="lg" icon="play" onClick={()=>go('overview')}>Start Assessment</Button></div>
        </div>
        <window.Ring value={0} size={120} stroke={9} color="#4F46E5" track="rgba(255,255,255,.14)" label={<span style={{color:'#fff',fontSize:13}}>0%</span>}/>
      </div>
    </div>
    <div className="nx-rail" style={{gap:20}}>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <UPanel title="Completed Assessments">
          {[['Leadership Development','Developmental','Mar 2026','Released']].map((r,i)=>
            <div key={i} onClick={()=>go('reports')} style={{display:'flex',alignItems:'center',gap:12,padding:'14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)',cursor:'pointer'}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--teal-50)',color:'var(--teal-600)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="checkCircle" size={18}/></div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{r[0]}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{r[1]} · {r[2]}</div></div>
              <Button size="sm" variant="secondary" onClick={(e)=>{e.stopPropagation();go('reports');}}>View Report</Button></div>)}
        </UPanel>
        <UPanel title="Available Reports">
          <div onClick={()=>go('reports')} style={{display:'flex',alignItems:'center',gap:12,padding:'14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)',cursor:'pointer'}}>
            <div style={{width:36,height:36,borderRadius:10,background:'var(--violet-100)',color:'var(--violet-600)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="reports" size={18}/></div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>Leadership Development Report</div><div style={{fontSize:12,color:'var(--text-3)'}}>Your strengths & growth themes</div></div>
            <Icon name="chevronRight" size={18} color="var(--text-3)"/></div>
        </UPanel>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <UPanel title="Recent Notifications">
          {[['Assessment invitation','Finance Manager assessment','2d ago'],['Report available','Leadership Development','Mar 18']].map((n,i)=>
            <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<1?'1px solid var(--border-soft)':'none'}}>
              <span style={{width:7,height:7,borderRadius:99,background:i===0?'var(--indigo-500)':'transparent',marginTop:6,flex:'none'}}></span>
              <div><div style={{fontSize:13,fontWeight:600}}>{n[0]}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{n[1]} · {n[2]}</div></div></div>)}
        </UPanel>
        <div style={{background:'var(--indigo-50)',borderRadius:'var(--r-lg)',padding:18,border:'1px solid var(--indigo-100)'}}>
          <Icon name="help" size={20} color="var(--indigo-600)"/>
          <div style={{fontSize:14,fontWeight:700,marginTop:8}}>Need a hand?</div>
          <p style={{fontSize:12.5,color:'var(--text-2)',marginTop:4,lineHeight:1.5}}>Questions about your assessment or privacy? We're here to help.</p>
          <button onClick={()=>go('help')} style={{fontSize:13,fontWeight:600,color:'var(--indigo-600)',marginTop:10}}>Visit Help & Support →</button>
        </div>
      </div>
    </div>
  </div>;
}
function UPanel({ title, children }) {
  return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>{title}</h3>{children}</div>;
}
window.__UPanel = UPanel; window.__ME = ME;

/* ---------------- My Assessments ---------------- */
function MyAssessments({ go }) {
  const rows=[
    {role:'Finance Manager',org:'Meridian Group',status:'Not Started',deadline:'June 25, 2026',progress:0},
    {role:'Leadership Development',org:'Meridian Group',status:'Completed',deadline:'Mar 18, 2026',progress:100},
  ];
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="My Assessments" sub="Your active and completed assessments."/>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {rows.map((r,i)=><div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:20,boxShadow:'var(--sh-sm)',display:'flex',alignItems:'center',gap:20}}>
        <window.Ring value={r.progress} size={56} stroke={6} color={r.progress===100?'var(--teal-600)':'var(--indigo-500)'} label={r.progress+'%'}/>
        <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:16,fontWeight:700}}>{r.role}</span><StatusBadge status={r.status} size="sm"/></div>
          <div style={{fontSize:13,color:'var(--text-3)',marginTop:4}}>{r.org} · due {r.deadline}</div></div>
        {r.status==='Completed'?<Button variant="secondary" icon="reports" onClick={()=>go('reports')}>View Report</Button>
          :<Button icon="play" onClick={()=>go('overview')}>Start</Button>}</div>)}
    </div>
  </div>;
}

/* ---------------- My Reports + History + Notifications + Help + Profile ---------------- */
function MyReports({ go }) {
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="My Reports" sub="Your assessment results, written to be clear and supportive."/>
    <div onClick={()=>go('user-report')} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)',cursor:'pointer',display:'flex',alignItems:'center',gap:18,maxWidth:640}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--sh-md)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--sh-sm)'}>
      <div style={{width:48,height:48,borderRadius:12,background:'var(--violet-100)',color:'var(--violet-600)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="reports" size={22}/></div>
      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700}}>Leadership Development Report</div>
        <div style={{fontSize:13,color:'var(--text-3)',marginTop:3}}>Released · March 2026</div></div>
      <StatusBadge status="Released"/><Icon name="chevronRight" size={20} color="var(--text-3)"/></div>
  </div>;
}
function UHistory({ go }) {
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Assessment History"/>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
      {[['Leadership Development','Developmental','Mar 18, 2026','Released'],['Finance Manager','Hiring Support','In progress','—']].map((r,i)=>
        <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 18px',borderTop:i?'1px solid var(--border-soft)':'none'}}>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{r[0]}</div><div style={{fontSize:12.5,color:'var(--text-3)'}}>{r[1]} · {ME.org}</div></div>
          <span style={{fontSize:12.5,color:'var(--text-2)'}}>{r[2]}</span>
          {r[3]!=='—'?<Button size="sm" variant="secondary" onClick={()=>go('reports')}>Open Report</Button>:<StatusBadge status="In Progress" size="sm"/>}</div>)}
    </div>
  </div>;
}
function UNotifications({ go }) {
  const items=[['Assignment received','Finance Manager assessment from Meridian Group','2d ago','send','indigo'],
    ['Deadline reminder','Finance Manager assessment is due June 25','1d ago','clock','amber'],
    ['Report available','Your Leadership Development report is ready','Mar 18','reports','teal']];
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Notifications"/>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
      {items.map((n,i)=>{ const t=window.TONES[n[4]];
        return <div key={i} style={{display:'flex',gap:14,padding:'15px 18px',borderTop:i?'1px solid var(--border-soft)':'none'}}>
          <div style={{width:38,height:38,borderRadius:10,flex:'none',background:t.bg,color:t.dot,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={n[3]} size={18}/></div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{n[0]}</div><div style={{fontSize:13,color:'var(--text-2)',marginTop:2}}>{n[1]}</div>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:4}}>{n[2]}</div></div></div>;})}
    </div>
  </div>;
}
function Help({ go }) {
  const faqs=[['How long does the assessment take?','Most people finish in about 40–45 minutes. You can pause and resume at any time.'],
    ['Can I change my answers?','Yes — within a section you can move back and forth. Timed sections will be clearly marked.'],
    ['Who can see my results?','Only the organization that invited you, for the specific purpose you consented to. You can also see your own report.'],
    ['What if I lose connection?','Your progress is auto-saved continuously. Just sign back in and continue where you left off.']];
  const [open,setOpen]=useState(0);
  return <div style={{animation:'fadeUp .4s var(--ease-out) both',maxWidth:680}}>
    <PageHeader title="Help & Support" sub="Answers to common questions, and how to reach us."/>
    <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
      {faqs.map((f,i)=><div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',overflow:'hidden',boxShadow:'var(--sh-sm)'}}>
        <button onClick={()=>setOpen(open===i?null:i)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'15px 18px',textAlign:'left'}}>
          <span style={{fontSize:14,fontWeight:600}}>{f[0]}</span>
          <Icon name="chevronDown" size={18} color="var(--text-3)" style={{transform:open===i?'rotate(180deg)':'none',transition:'transform .2s'}}/></button>
        {open===i && <div style={{padding:'0 18px 16px',fontSize:13.5,color:'var(--text-2)',lineHeight:1.6,animation:'fadeUp .2s'}}>{f[1]}</div>}</div>)}
    </div>
    <div className="nx-g2" style={{gap:14}}>
      {[['mail','Contact Support','support@nexus.io'],['shield','Privacy Questions','privacy@nexus.io']].map((c,i)=>
        <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:18,boxShadow:'var(--sh-sm)'}}>
          <Icon name={c[0]} size={20} color="var(--indigo-500)"/><div style={{fontSize:14,fontWeight:700,marginTop:8}}>{c[1]}</div>
          <div style={{fontSize:13,color:'var(--indigo-600)',marginTop:3,fontWeight:600}}>{c[2]}</div></div>)}
    </div>
  </div>;
}
function UProfile({ go, onExit }) {
  return <div style={{animation:'fadeUp .4s var(--ease-out) both',maxWidth:600}}>
    <PageHeader title="Profile & Privacy"/>
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)'}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}><Avatar name={ME.name} size={56} ring/>
          <div><div style={{fontSize:17,fontWeight:700}}>{ME.name}</div><div style={{fontSize:13,color:'var(--text-2)'}}>amara.okonkwo@meridian.co</div></div></div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <window.Field label="Full Name"><input defaultValue={ME.name} style={window.inpStyle}/></window.Field>
          <window.Field label="Language"><select style={window.inpStyle}><option>English (UK)</option><option>Français</option></select></window.Field>
        </div>
        <div style={{marginTop:18,display:'flex',gap:10}}><Button variant="secondary" icon="lock">Change Password</Button><Button onClick={()=>toast('Saved','success')}>Save</Button></div>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>Privacy & Consent</h3>
        <p style={{fontSize:13,color:'var(--text-2)',lineHeight:1.5,marginBottom:16}}>You control how your data is used. Consent is always specific to each assessment's purpose.</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[['Finance Manager · Hiring Support','Active'],['Leadership Development','Active']].map((c,i)=>
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)'}}>
              <Icon name="shieldCheck" size={17} color="var(--teal-600)"/><span style={{flex:1,fontSize:13.5,fontWeight:600}}>{c[0]}</span><StatusBadge status="Active" size="sm"/></div>)}
        </div>
        <div style={{marginTop:16,display:'flex',gap:10}}><Button variant="secondary" icon="trash" style={{color:'var(--rose-600)'}}>Request Data Deletion</Button></div>
      </div>
    </div>
  </div>;
}

Object.assign(window.USER_PAGES, {
  dashboard:UDashboard, 'my-assessments':MyAssessments, reports:MyReports,
  history:UHistory, notifications:UNotifications, help:Help, profile:UProfile,
});
})();
