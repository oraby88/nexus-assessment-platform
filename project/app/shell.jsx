/* ============================================================
   NEXUS — App Shell (logo, sidebars, topbars, login)
   ============================================================ */
const { useState:useStateS, useEffect:useEffectS } = React;

function NexusMark({ size=28, light }) {
  const c1 = light ? '#fff' : '#4F46E5';
  const c2 = light ? '#A5B0F8' : '#0D9488';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={light?'rgba(255,255,255,.12)':'#11141B'}/>
      <circle cx="16" cy="16" r="9" stroke={c1} strokeWidth="2" opacity=".55"/>
      <path d="M11 21V11l10 10V11" stroke={c1} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="11" r="2" fill={c2}/>
      <circle cx="21" cy="21" r="2" fill={c2}/>
    </svg>
  );
}
function NexusWordmark({ light, sub }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:11}}>
      <NexusMark size={30} light={light}/>
      <div style={{lineHeight:1}}>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:17,letterSpacing:'-.02em',
          color:light?'#fff':'var(--text)'}}>Nexus</div>
        {sub && <div style={{fontSize:10.5,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',
          color:light?'rgba(255,255,255,.45)':'var(--text-3)',marginTop:3}}>{sub}</div>}
      </div>
    </div>
  );
}
window.NexusMark = NexusMark; window.NexusWordmark = NexusWordmark;

const NAV_ADMIN = [
  {section:'Overview', items:[
    {id:'dashboard',label:'Dashboard',icon:'dashboard'},
    {id:'candidates',label:'Candidates',icon:'candidates'},
    {id:'assessments',label:'Assessments',icon:'assessment'},
  ]},
  {section:'Design', items:[
    {id:'blueprints',label:'Role Blueprints',icon:'blueprint'},
    {id:'contexts',label:'Context Profiles',icon:'context'},
  ]},
  {section:'Insight', items:[
    {id:'reports',label:'Reports',icon:'reports'},
    {id:'comparison',label:'Candidate Comparison',icon:'compare'},
    {id:'history',label:'Assessment History',icon:'history'},
    {id:'exports',label:'Exports',icon:'exports'},
  ]},
  {section:'System', items:[
    {id:'notifications',label:'Notifications',icon:'bell',badge:3},
    {id:'settings',label:'Organization Settings',icon:'settings'},
    {id:'profile',label:'My Profile',icon:'user'},
  ]},
];
const NAV_USER = [
  {section:null, items:[
    {id:'dashboard',label:'Dashboard',icon:'dashboard'},
    {id:'my-assessments',label:'My Assessments',icon:'assessment'},
    {id:'history',label:'Assessment History',icon:'history'},
    {id:'reports',label:'My Reports',icon:'reports'},
    {id:'notifications',label:'Notifications',icon:'bell',badge:1},
    {id:'help',label:'Help & Support',icon:'help'},
    {id:'profile',label:'Profile & Privacy',icon:'shield'},
  ]},
];
window.NAV_ADMIN = NAV_ADMIN; window.NAV_USER = NAV_USER;

function Sidebar({ nav, active, onNav, footerName, footerRole, onSwitch, switchLabel, open, onClose }) {
  const { isDesktop } = window.useVW();
  const mobile = !isDesktop;
  const handleNav = (id)=>{ onNav(id); if(mobile && onClose) onClose(); };
  const asideStyle = mobile ? {
      width:260,flex:'none',background:'var(--shell-850)',display:'flex',flexDirection:'column',
      height:'100vh',position:'fixed',top:0,left:0,zIndex:120,borderRight:'1px solid var(--shell-line)',
      transform:open?'translateX(0)':'translateX(-102%)',transition:'transform .34s var(--ease-out)',
      boxShadow:open?'var(--sh-xl)':'none'
    } : {
      width:248,flex:'none',background:'var(--shell-850)',display:'flex',flexDirection:'column',
      height:'100vh',position:'sticky',top:0,borderRight:'1px solid var(--shell-line)'
    };
  return (
    <React.Fragment>
      {mobile && <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:110,background:'rgba(6,8,15,.5)',
        backdropFilter:'blur(2px)',opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity .3s var(--ease)'}}></div>}
    <aside className="shell-scroll" style={asideStyle}>
      <div style={{padding:'20px 18px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <NexusWordmark light sub="Assessment Platform"/>
        {mobile && <button onClick={onClose} aria-label="Close menu" style={{color:'var(--shell-muted)',padding:4}}><Icon name="x" size={20}/></button>}
      </div>
      <nav className="shell-scroll" style={{flex:1,overflow:'auto',padding:'8px 12px'}}>
        {nav.map((grp,gi)=>(
          <div key={gi} style={{marginBottom:14}}>
            {grp.section && <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',
              color:'var(--shell-muted)',padding:'8px 10px 6px'}}>{grp.section}</div>}
            {grp.items.map(it=>{
              const on = it.id===active;
              return (
                <button key={it.id} onClick={()=>handleNav(it.id)} style={{display:'flex',alignItems:'center',gap:11,
                  width:'100%',padding:'9px 10px',borderRadius:'var(--r-sm)',marginBottom:2,
                  color:on?'#fff':'var(--shell-text)',background:on?'var(--shell-700)':'transparent',
                  fontSize:13.5,fontWeight:on?600:500,transition:'all .15s var(--ease)',position:'relative',
                  textAlign:'left'}}
                  onMouseEnter={e=>{if(!on)e.currentTarget.style.background='var(--shell-800)';}}
                  onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent';}}>
                  {on && <span style={{position:'absolute',left:-12,top:8,bottom:8,width:3,background:'var(--indigo-400)',
                    borderRadius:'0 3px 3px 0'}}></span>}
                  <Icon name={it.icon} size={17} color={on?'#A5B0F8':'var(--shell-muted)'}/>
                  <span style={{flex:1}}>{it.label}</span>
                  {it.badge && <span style={{minWidth:18,height:18,padding:'0 5px',borderRadius:99,
                    background:'var(--indigo-500)',color:'#fff',fontSize:11,fontWeight:700,
                    display:'flex',alignItems:'center',justifyContent:'center'}}>{it.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{padding:12,borderTop:'1px solid var(--shell-line)'}}>
        {onSwitch && <button onClick={onSwitch} style={{display:'flex',alignItems:'center',gap:9,width:'100%',
          padding:'9px 10px',borderRadius:'var(--r-sm)',color:'var(--shell-text)',fontSize:12.5,fontWeight:600,
          background:'var(--shell-800)',marginBottom:8,justifyContent:'center'}}>
          <Icon name="refresh" size={15} color="var(--shell-muted)"/>{switchLabel}</button>}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 6px'}}>
          <Avatar name={footerName} size={34}/>
          <div style={{flex:1,minWidth:0}}>
            <div className="clip" style={{fontSize:13,fontWeight:600,color:'#fff'}}>{footerName}</div>
            <div className="clip" style={{fontSize:11.5,color:'var(--shell-muted)'}}>{footerRole}</div>
          </div>
          <Icon name="logout" size={16} color="var(--shell-muted)"/>
        </div>
      </div>
    </aside>
    </React.Fragment>
  );
}
window.Sidebar = Sidebar;

function Topbar({ onSearch, search, children, right, onMenu }) {
  const { isDesktop } = window.useVW();
  return (
    <header style={{height:64,flex:'none',background:'var(--topbar-bg)',backdropFilter:'blur(10px)',
      borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',
      position:'sticky',top:0,zIndex:50}}>
      {!isDesktop && <button onClick={onMenu} aria-label="Open menu" style={{display:'flex',alignItems:'center',justifyContent:'center',
        width:38,height:38,borderRadius:'var(--r-sm)',color:'var(--text-2)',flex:'none',border:'1px solid var(--border)',background:'var(--surface)'}}>
        <Icon name="menu" size={18}/></button>}
      <div style={{position:'relative',flex:1,maxWidth:440,minWidth:0}}>
        <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)'}}>
          <Icon name="search" size={16}/></span>
        <input value={search||''} onChange={e=>onSearch&&onSearch(e.target.value)}
          placeholder={isDesktop?"Search candidates, assessments, reports…":"Search…"}
          style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:'var(--r-md)',border:'1px solid var(--border)',
            background:'var(--surface)',fontSize:13.5,color:'var(--text)',outline:'none'}}/>
      </div>
      <div style={{flex:1}}></div>
      {children}
      {right}
    </header>
  );
}
window.Topbar = Topbar;

/* ---------------- LOGIN ---------------- */
function AdminLogin({ onLogin, onUser, onHome }) {
  const [email,setEmail]=useStateS('admin@meridian.co');
  const [pw,setPw]=useStateS('••••••••••');
  const [remember,setRemember]=useStateS(true);
  return (
    <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1.05fr .95fr'}}>
      {/* left brand panel */}
      <div style={{background:'linear-gradient(160deg,#0C111C 0%,#141C2E 55%,#1E2840 100%)',position:'relative',
        overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'48px 56px'}}>
        <div style={{position:'absolute',inset:0,opacity:.5,
          background:'radial-gradient(circle at 78% 18%, rgba(79,70,229,.32), transparent 42%), radial-gradient(circle at 14% 86%, rgba(13,148,136,.22), transparent 44%)'}}></div>
        <div style={{position:'relative'}}><NexusWordmark light sub="Assessment Platform"/></div>
        <div style={{position:'relative',maxWidth:440}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:99,
            background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',marginBottom:24}}>
            <Icon name="shieldCheck" size={14} color="#A5B0F8"/>
            <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.8)'}}>Governed · Explainable · Context-aware</span>
          </div>
          <h1 style={{fontSize:38,fontWeight:700,color:'#fff',lineHeight:1.12,letterSpacing:'-.025em'}}>
            Workforce assessment, measured with scientific discipline.</h1>
          <p style={{fontSize:15.5,color:'rgba(255,255,255,.62)',marginTop:18,lineHeight:1.6}}>
            Six domains. Governed question banks. Context-aware reports that support human judgement — never replace it.</p>
          <div style={{display:'flex',gap:28,marginTop:36}}>
            {[['6','Measured domains'],['35+','Validated dimensions'],['100%','Audited outputs']].map((s,i)=>(
              <div key={i}><div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,color:'#fff'}}>{s[0]}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginTop:2}}>{s[1]}</div></div>
            ))}
          </div>
        </div>
        <div style={{position:'relative',fontSize:12,color:'rgba(255,255,255,.4)'}}>© 2026 Nexus · Meridian Group deployment</div>
      </div>
      {/* right form */}
      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',padding:32,background:'var(--canvas)'}}>
        <div style={{position:'absolute',top:20,right:24,display:'flex',alignItems:'center',gap:8}}>
          {onHome && <button onClick={onHome} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'var(--text-3)'}}><Icon name="arrowLeft" size={14}/> Home</button>}
          <window.ThemeToggle/>
        </div>
        <div style={{width:'100%',maxWidth:380,animation:'fadeUp .5s var(--ease-out) both'}}>
          <h2 style={{fontSize:24,fontWeight:700}}>Welcome back</h2>
          <p style={{fontSize:14,color:'var(--text-2)',marginTop:6}}>Sign in to your Meridian Group workspace.</p>
          <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:16}}>
            <Field label="Email"><input value={email} onChange={e=>setEmail(e.target.value)} style={inp}/></Field>
            <Field label="Password" right={<a style={{fontSize:12.5,color:'var(--indigo-600)',fontWeight:600}}>Forgot password?</a>}>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} style={inp}/></Field>
            <label style={{display:'flex',alignItems:'center',gap:9,fontSize:13.5,color:'var(--text-2)',cursor:'pointer'}}>
              <span onClick={()=>setRemember(!remember)} style={{width:18,height:18,borderRadius:5,
                border:'1.5px solid '+(remember?'var(--indigo-500)':'var(--border-strong)'),
                background:remember?'var(--indigo-500)':'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {remember && <Icon name="check" size={12} color="#fff"/>}</span>
              Remember me on this device</label>
            <Button full size="lg" onClick={onLogin} iconRight="arrowRight">Sign in</Button>
          </div>
          <div style={{marginTop:24,paddingTop:20,borderTop:'1px solid var(--border)',textAlign:'center'}}>
            <p style={{fontSize:13,color:'var(--text-3)'}}>Have an assessment invitation?</p>
            <button onClick={onUser} style={{fontSize:13.5,fontWeight:600,color:'var(--indigo-600)',marginTop:4}}>
              Go to the candidate portal →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
const inp = {width:'100%',padding:'11px 13px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',
  background:'var(--surface)',fontSize:14,color:'var(--text)',outline:'none'};
function Field({ label, children, right }) {
  return (<label style={{display:'block'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
      <span style={{fontSize:12.5,fontWeight:600,color:'var(--text-2)'}}>{label}</span>{right}</div>
    {children}</label>);
}
window.AdminLogin = AdminLogin; window.Field = Field; window.inpStyle = inp;
