/* ============================================================
   NEXUS — Shared UI primitives  (exports to window)
   ============================================================ */
(function(){
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- responsive viewport hook ---------- */
function useVW(){
  const [w,setW]=useState(typeof window!=='undefined'?window.innerWidth:1280);
  useEffect(()=>{ let raf; const h=()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>setW(window.innerWidth)); };
    window.addEventListener('resize',h); return ()=>{ window.removeEventListener('resize',h); cancelAnimationFrame(raf); }; },[]);
  return { w, isMobile:w<700, isTablet:w>=700&&w<1040, isDesktop:w>=1040 };
}
/* pick a value by breakpoint: cols(w,{base, md, sm}) */
function bp(w, { base, md, sm }){ if(w<700 && sm!==undefined) return sm; if(w<1040 && md!==undefined) return md; return base; }

/* ---------- scroll reveal ---------- */
function Reveal({ children, delay=0, y=18, once=true, as='div', style={}, className='' }){
  const ref=useRef(null); const [vis,setVis]=useState(false);
  useEffect(()=>{ const el=ref.current; if(!el) return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){ setVis(true); return; }
    let io;
    try{
      io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ setVis(true); if(once&&io) io.unobserve(el); } else if(!once) setVis(false); }); },{threshold:0.08, rootMargin:'0px 0px -8% 0px'});
      io.observe(el);
    }catch(e){ setVis(true); }
    const fb=setTimeout(()=>setVis(true), 600); // safety: never leave content hidden
    return ()=>{ if(io)io.disconnect(); clearTimeout(fb); }; },[]);
  const Tag=as;
  return <Tag ref={ref} className={className} style={{...style,
    opacity:vis?1:0, transform:vis?'none':`translateY(${y}px)`,
    transition:`opacity .6s var(--ease-out) ${delay}s, transform .6s var(--ease-out) ${delay}s`}}>{children}</Tag>;
}

/* ---------- count-up number ---------- */
function CountUp({ to, dur=1100, prefix='', suffix='', className='', style={} }){
  const ref=useRef(null); const [val,setVal]=useState(0); const started=useRef(false);
  const numeric = typeof to==='number'? to : parseFloat(String(to).replace(/[^0-9.]/g,''))||0;
  const tail = typeof to==='number'? '' : String(to).replace(/[0-9.,]/g,'');
  useEffect(()=>{
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ setVal(numeric); started.current=true; return; }
    const run=()=>{ if(started.current) return; started.current=true;
      const t0=performance.now(); const tick=(t)=>{ const p=Math.min(1,(t-t0)/dur); const eased=1-Math.pow(1-p,3);
        setVal(numeric*eased); if(p<1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
    let io;
    try{
      io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ run(); io.disconnect(); } }); },{threshold:0.3});
      if(ref.current) io.observe(ref.current);
    }catch(e){}
    // fallback: ensure it runs even if IO never fires (nested scroll roots)
    const fb=setTimeout(run, 350);
    return ()=>{ if(io)io.disconnect(); clearTimeout(fb); };
  },[numeric]);
  const display = numeric%1===0 ? Math.round(val) : val.toFixed(1);
  return <span ref={ref} className={className} style={style}>{prefix}{display}{tail}{suffix}</span>;
}

/* ---------- theme ---------- */
const THEME_KEY = 'nexus_theme';
function getTheme(){ try{ return localStorage.getItem(THEME_KEY) || 'light'; }catch(e){ return 'light'; } }
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem(THEME_KEY, t); }catch(e){} window.dispatchEvent(new CustomEvent('nx-theme',{detail:t})); }
function toggleTheme(){ const cur=getTheme(); const next=cur==='dark'?'light':'dark';
  document.documentElement.classList.add('theme-anim'); applyTheme(next);
  setTimeout(()=>document.documentElement.classList.remove('theme-anim'),420); }
applyTheme(getTheme());

function useTheme(){ const [t,setT]=useState(getTheme());
  useEffect(()=>{ const h=e=>setT(e.detail); window.addEventListener('nx-theme',h); return ()=>window.removeEventListener('nx-theme',h); },[]);
  return t; }

function ThemeToggle({ variant='surface', size=36 }) {
  const t=useTheme(); const dark=t==='dark';
  const onShell = variant==='shell';
  return (
    <button onClick={toggleTheme} title={dark?'Switch to light':'Switch to dark'} aria-label="Toggle theme"
      style={{position:'relative',width:size,height:size,borderRadius:'var(--r-sm)',display:'inline-flex',alignItems:'center',justifyContent:'center',
        color:onShell?'var(--shell-muted)':'var(--text-2)',
        background:onShell?'transparent':'var(--surface)',border:onShell?'1px solid transparent':'1px solid var(--border)',
        transition:'all .18s var(--ease)',overflow:'hidden'}}
      onMouseEnter={e=>{e.currentTarget.style.background=onShell?'var(--shell-800)':'var(--canvas-2)';}}
      onMouseLeave={e=>{e.currentTarget.style.background=onShell?'transparent':'var(--surface)';}}>
      <span style={{position:'absolute',transition:'transform .4s var(--ease-out), opacity .3s',
        transform:dark?'translateY(0) rotate(0)':'translateY(-26px) rotate(-90deg)',opacity:dark?1:0}}>
        <Icon name="sparkles" size={17}/></span>
      <span style={{position:'absolute',transition:'transform .4s var(--ease-out), opacity .3s',
        transform:dark?'translateY(26px) rotate(90deg)':'translateY(0) rotate(0)',opacity:dark?0:1}}>
        <SunMoon dark={false}/></span>
    </button>
  );
}
function SunMoon({ dark }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.5"/><path d="M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4"/></svg>;
}

/* ---------- status → visual mapping ---------- */
const STATUS_MAP = {
  // assessment
  'Completed':{t:'teal'}, 'In Progress':{t:'indigo'}, 'Not Started':{t:'slate'},
  'Valid':{t:'teal'}, 'Pass With Limits':{t:'amber'}, 'Incomplete':{t:'amber'},
  'Valid but Uninterpretable':{t:'amber'}, 'Invalid':{t:'rose'}, 'Deferred':{t:'slate'},
  'Cancelled':{t:'slate'}, 'Expired':{t:'rose'},
  // report
  'Processing':{t:'indigo'}, 'Released':{t:'teal'}, 'Released with Caution':{t:'amber'},
  'Partial Release':{t:'amber'}, 'Blocked Section':{t:'rose'}, 'Unavailable':{t:'slate'},
  // blueprint
  'Draft':{t:'slate'}, 'Under Review':{t:'amber'}, 'Active':{t:'indigo'},
  'Validated':{t:'teal'}, 'Archived':{t:'slate'},
  '—':{t:'slate'},
};
const TONES = {
  indigo:{bg:'var(--tone-indigo-bg)',fg:'var(--tone-indigo-fg)',dot:'#4F46E5'},
  teal:{bg:'var(--tone-teal-bg)',fg:'var(--tone-teal-fg)',dot:'#0D9488'},
  amber:{bg:'var(--tone-amber-bg)',fg:'var(--tone-amber-fg)',dot:'#C2820B'},
  rose:{bg:'var(--tone-rose-bg)',fg:'var(--tone-rose-fg)',dot:'#D03A2C'},
  slate:{bg:'var(--tone-slate-bg)',fg:'var(--tone-slate-fg)',dot:'#94A0B0'},
  violet:{bg:'var(--tone-violet-bg)',fg:'var(--tone-violet-fg)',dot:'#7C3AED'},
};

function StatusBadge({ status, dot=true, size='md' }) {
  const m = STATUS_MAP[status] || {t:'slate'};
  const t = TONES[m.t];
  const pad = size==='sm'?'2px 8px':'4px 10px';
  const fs = size==='sm'?11:12;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:6,background:t.bg,color:t.fg,
      padding:pad,borderRadius:999,fontSize:fs,fontWeight:600,lineHeight:1.2,whiteSpace:'nowrap',
      fontFamily:'var(--font-ui)'}}>
      {dot && <span style={{width:6,height:6,borderRadius:99,background:t.dot,flex:'none'}}></span>}
      {status}
    </span>
  );
}

function Chip({ children, tone='slate', active=false, onClick, icon, style={} }) {
  const t = TONES[tone]||TONES.slate;
  return (
    <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,
      padding:'6px 12px',borderRadius:999,fontSize:13,fontWeight:600,cursor:onClick?'pointer':'default',
      background:active?t.dot:t.bg,color:active?'#fff':t.fg,border:'1px solid '+(active?t.dot:'transparent'),
      transition:'all .15s var(--ease)',fontFamily:'var(--font-ui)',...style}}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

function Button({ children, variant='primary', size='md', icon, iconRight, onClick, disabled, full, style={}, type='button' }) {
  const sizes = { sm:{p:'7px 12px',fs:13,h:34}, md:{p:'9px 16px',fs:14,h:40}, lg:{p:'12px 22px',fs:15,h:48} };
  const s = sizes[size];
  const variants = {
    primary:{background:'var(--indigo-500)',color:'#fff',boxShadow:'var(--sh-indigo)',border:'1px solid transparent'},
    secondary:{background:'var(--surface)',color:'var(--text)',border:'1px solid var(--border-strong)',boxShadow:'var(--sh-xs)'},
    ghost:{background:'transparent',color:'var(--text-2)',border:'1px solid transparent'},
    soft:{background:'var(--indigo-50)',color:'var(--indigo-600)',border:'1px solid transparent'},
    danger:{background:'var(--rose-600)',color:'#fff',border:'1px solid transparent'},
    dark:{background:'var(--ink-900)',color:'#fff',border:'1px solid transparent'},
  };
  const [hov,setHov]=useState(false);
  return (
    <button type={type} onClick={disabled?undefined:onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
        padding:s.p,fontSize:s.fs,fontWeight:600,borderRadius:'var(--r-md)',whiteSpace:'nowrap',
        fontFamily:'var(--font-ui)',transition:'all .16s var(--ease)',
        width:full?'100%':'auto',opacity:disabled?.5:1,cursor:disabled?'not-allowed':'pointer',
        transform:hov&&!disabled?'translateY(-1px)':'none',
        filter:hov&&!disabled?'brightness(1.04)':'none',
        ...variants[variant],...style}}>
      {icon && <Icon name={icon} size={size==='sm'?15:17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size==='sm'?15:17} />}
    </button>
  );
}

function IconButton({ name, onClick, size=18, tip, variant='ghost', active, style={} }) {
  const [hov,setHov]=useState(false);
  const bg = variant==='solid'?'var(--surface)':'transparent';
  return (
    <button onClick={onClick} title={tip} aria-label={tip}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:36,height:36,
        borderRadius:'var(--r-sm)',color:active?'var(--indigo-600)':'var(--text-2)',
        background:hov||active?'var(--canvas-2)':bg,transition:'all .14s var(--ease)',
        border:variant==='solid'?'1px solid var(--border)':'1px solid transparent',...style}}>
      <Icon name={name} size={size} />
    </button>
  );
}

function Avatar({ name, size=38, src, ring }) {
  const initials = (name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const palette = ['#4F46E5','#0D9488','#C2820B','#7C3AED','#0EA5E9','#D03A2C','#3730A3','#0F766E'];
  const idx = (name||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%palette.length;
  const c = palette[idx];
  return (
    <div style={{width:size,height:size,borderRadius:'30%',flex:'none',
      background:`linear-gradient(140deg, ${c}, ${c}cc)`,color:'#fff',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:size*0.38,fontWeight:700,fontFamily:'var(--font-display)',letterSpacing:'-.02em',
      boxShadow:ring?'0 0 0 3px var(--surface), 0 0 0 4px '+c+'40':'none'}}>
      {initials}
    </div>
  );
}

function Card({ children, pad=20, hover, onClick, style={}, className='' }) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} className={className}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
        padding:pad,boxShadow:hover&&hov?'var(--sh-md)':'var(--sh-sm)',
        transform:hover&&hov?'translateY(-2px)':'none',
        transition:'box-shadow .2s var(--ease), transform .2s var(--ease)',
        cursor:onClick?'pointer':'default',...style}}>
      {children}
    </div>
  );
}

/* Animated horizontal score bar */
function ScoreBar({ value, max=100, color='var(--indigo-500)', track='var(--track)', height=8, delay=0, showReq, req }) {
  const [w,setW]=useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setW(value/max*100),60+delay); return ()=>clearTimeout(t); },[value,max,delay]);
  return (
    <div style={{position:'relative',width:'100%',height,background:track,borderRadius:99}}>
      <div style={{position:'absolute',inset:0,width:w+'%',background:color,borderRadius:99,
        transition:'width 1s var(--ease-out)'}}></div>
      {showReq && <div style={{position:'absolute',top:-3,bottom:-3,left:`calc(${req/max*100}% - 1px)`,width:2,
        background:'var(--ink-700)',borderRadius:2,opacity:.55}}></div>}
    </div>
  );
}

/* Circular progress ring */
function Ring({ value, size=52, stroke=5, color='var(--indigo-500)', track='var(--track)', label }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r;
  const [off,setOff]=useState(circ);
  useEffect(()=>{ const t=setTimeout(()=>setOff(circ*(1-value/100)),80); return ()=>clearTimeout(t); },[value,circ]);
  return (
    <div style={{position:'relative',width:size,height:size,flex:'none'}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:'stroke-dashoffset 1.1s var(--ease-out)'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:size*0.27,fontWeight:700,fontFamily:'var(--font-display)'}}>{label!==undefined?label:value}</div>
    </div>
  );
}

function ConfidenceChip({ level }) {
  const map={High:{t:'teal',n:3},Moderate:{t:'amber',n:2},Low:{t:'rose',n:1}};
  const m=map[level]||map.Moderate; const t=TONES[m.t];
  return (
    <span title={`${level} confidence`} style={{display:'inline-flex',alignItems:'center',gap:5,
      padding:'3px 9px',borderRadius:99,background:t.bg,color:t.fg,fontSize:11,fontWeight:600}}>
      <span style={{display:'flex',gap:2,alignItems:'flex-end',height:10}}>
        {[1,2,3].map(i=><span key={i} style={{width:3,height:i*3+2,borderRadius:1,
          background:i<=m.n?t.dot:t.dot+'40'}}></span>)}
      </span>
      {level}
    </span>
  );
}

function Tooltip({ children, text, side='top' }) {
  const [show,setShow]=useState(false);
  const pos = side==='top'?{bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'}
    :{top:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'};
  return (
    <span style={{position:'relative',display:'inline-flex'}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && <span style={{position:'absolute',...pos,zIndex:200,background:'var(--ink-900)',color:'#fff',
        padding:'7px 11px',borderRadius:8,fontSize:12,fontWeight:500,lineHeight:1.4,width:'max-content',
        maxWidth:240,boxShadow:'var(--sh-lg)',pointerEvents:'none',animation:'fadeIn .15s var(--ease)'}}>
        {text}</span>}
    </span>
  );
}

function Modal({ open, onClose, children, width=520, title, sub }) {
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:300,background:'rgba(15,18,28,.42)',
      backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,
      animation:'fadeIn .2s var(--ease)'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--surface)',borderRadius:'var(--r-xl)',
        width,maxWidth:'100%',maxHeight:'90vh',overflow:'auto',boxShadow:'var(--sh-xl)',
        animation:'floatUp .3s var(--ease-out)'}}>
        {title && <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
          padding:'22px 24px 0'}}>
          <div><h3 style={{fontSize:19,fontWeight:700}}>{title}</h3>
            {sub && <p style={{fontSize:13.5,color:'var(--text-2)',marginTop:4}}>{sub}</p>}</div>
          <IconButton name="x" onClick={onClose} /></div>}
        {children}
      </div>
    </div>
  );
}

/* ---------- dropdown menu / popover ---------- */
function Popover({ trigger, children, align='right', width=224 }) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ if(!open) return;
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k=(e)=>{ if(e.key==='Escape') setOpen(false); };
    document.addEventListener('mousedown',h); document.addEventListener('keydown',k);
    return ()=>{ document.removeEventListener('mousedown',h); document.removeEventListener('keydown',k); }; },[open]);
  return <div ref={ref} style={{position:'relative'}}>
    <div onClick={()=>setOpen(o=>!o)} style={{cursor:'pointer'}}>{trigger}</div>
    {open && <div className="anim-scalein" onClick={()=>setOpen(false)}
      style={{position:'absolute',top:'calc(100% + 8px)',[align]:0,width,zIndex:200,
        background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',
        boxShadow:'var(--sh-lg)',padding:6,transformOrigin:align+' top'}}>{children}</div>}
  </div>;
}
function MenuItem({ icon, label, onClick, danger, sub }) {
  return <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:11,width:'100%',padding:'9px 10px',
    borderRadius:'var(--r-sm)',fontSize:13.5,fontWeight:500,textAlign:'left',background:'transparent',
    color:danger?'var(--rose-600)':'var(--text)',transition:'background .14s'}}
    onMouseEnter={e=>e.currentTarget.style.background='var(--canvas-2)'}
    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
    {icon && <Icon name={icon} size={16} color={danger?'var(--rose-600)':'var(--text-3)'}/>}
    <span style={{flex:1}}>{label}</span>
    {sub && <span style={{fontSize:11,color:'var(--text-3)'}}>{sub}</span>}
  </button>;
}
function MenuHeader({ name, sub }) {
  return <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px 10px',marginBottom:4,
    borderBottom:'1px solid var(--border-soft)'}}>
    <Avatar name={name} size={34}/>
    <div style={{minWidth:0}}><div className="clip" style={{fontSize:13.5,fontWeight:700}}>{name}</div>
      <div className="clip" style={{fontSize:11.5,color:'var(--text-3)'}}>{sub}</div></div>
  </div>;
}
function MenuDivider(){ return <div style={{height:1,background:'var(--border-soft)',margin:'5px 4px'}}></div>; }

/* ---------- Trust Layer badge ---------- */
const TRUST = {
  governed:   { icon:'shieldCheck', label:'Selected from Governed Bank', tone:'teal' },
  locked:     { icon:'lock',        label:'Scoring Logic Locked',        tone:'indigo' },
  approval:   { icon:'flag',        label:'Admin Approval Required',     tone:'amber' },
  blueprint:  { icon:'shieldCheck', label:'Validated Blueprint',         tone:'teal' },
  context:    { icon:'context',     label:'Context Profile Active',      tone:'teal' },
  confidence: { icon:'eye',         label:'Confidence Controlled',       tone:'indigo' },
  restricted: { icon:'lock',        label:'Restricted Output',           tone:'rose' },
  withheld:   { icon:'eye',         label:'Report Section Withheld',     tone:'amber' },
};
function TrustBadge({ kind, label, size='md', tip }) {
  const p = TRUST[kind] || { icon:'shieldCheck', label:label||'Governed', tone:'teal' };
  const t = TONES[p.tone];
  const sm = size==='sm';
  const el = <span style={{display:'inline-flex',alignItems:'center',gap:sm?5:6,
    padding:sm?'3px 8px':'5px 11px',borderRadius:99,background:t.bg,color:t.fg,
    fontSize:sm?10.5:11.5,fontWeight:700,letterSpacing:'.01em',whiteSpace:'nowrap'}}>
    <Icon name={p.icon} size={sm?11:13}/>{label||p.label}</span>;
  return tip ? <Tooltip text={tip}>{el}</Tooltip> : el;
}

/* word-level diff highlighter — marks tokens in `adapted` that aren't in `original` */
function diffWords(original, adapted) {
  const baseSet = new Set((original||'').toLowerCase().replace(/[^\w\s]/g,'').split(/\s+/).filter(Boolean));
  return (adapted||'').split(/(\s+)/).map((tok,i)=>{
    const clean = tok.toLowerCase().replace(/[^\w]/g,'');
    if(!clean || /^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
    const isNew = !baseSet.has(clean);
    return isNew
      ? <mark key={i} style={{background:'var(--indigo-100)',color:'var(--indigo-700)',
          borderRadius:4,padding:'0 2px',fontWeight:600}}>{tok}</mark>
      : <span key={i}>{tok}</span>;
  });
}

function Drawer({ open, onClose, children, width=560, title, sub, actions }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:300,overflow:'hidden',pointerEvents:open?'auto':'none'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(15,18,28,.40)',
        opacity:open?1:0,transition:'opacity .3s var(--ease)',backdropFilter:open?'blur(2px)':'none'}}></div>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width,maxWidth:'94vw',background:'var(--surface)',
        boxShadow:'var(--sh-xl)',transform:open?'translateX(0)':'translateX(100%)',
        transition:'transform .36s var(--ease-out)',display:'flex',flexDirection:'column'}}>
        {title && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,
          padding:'20px 24px',borderBottom:'1px solid var(--border)'}}>
          <div><h3 style={{fontSize:18,fontWeight:700}}>{title}</h3>
            {sub && <p style={{fontSize:13,color:'var(--text-2)',marginTop:2}}>{sub}</p>}</div>
          <IconButton name="x" onClick={onClose} /></div>}
        <div style={{flex:1,overflow:'auto',padding:24}}>{children}</div>
        {actions && <div style={{padding:'16px 24px',borderTop:'1px solid var(--border)',display:'flex',
          gap:10,justifyContent:'flex-end',background:'var(--surface-2)'}}>{actions}</div>}
      </div>
    </div>
  );
}

function SegMacro({ options, value, onChange, size='md', full }) {
  const pad=size==='sm'?'6px 12px':'8px 16px';
  return (
    <div style={{display:'inline-flex',background:'var(--canvas-2)',borderRadius:'var(--r-md)',padding:3,
      gap:2,width:full?'100%':'auto'}}>
      {options.map(o=>{ const v=typeof o==='string'?o:o.value; const l=typeof o==='string'?o:o.label;
        const on=v===value;
        return <button key={v} onClick={()=>onChange(v)} style={{flex:full?1:'none',padding:pad,
          fontSize:size==='sm'?12.5:13.5,fontWeight:600,borderRadius:'calc(var(--r-md) - 3px)',
          background:on?'var(--surface)':'transparent',color:on?'var(--text)':'var(--text-2)',
          boxShadow:on?'var(--sh-xs)':'none',transition:'all .18s var(--ease)',whiteSpace:'nowrap'}}>{l}</button>;
      })}
    </div>
  );
}

function Slider({ value, onChange, min=1, max=5, color='var(--indigo-500)', labels }) {
  const pct=(value-min)/(max-min)*100;
  return (
    <div>
      <div style={{position:'relative',height:28,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',left:0,right:0,height:6,background:'var(--track)',borderRadius:99}}></div>
        <div style={{position:'absolute',left:0,width:pct+'%',height:6,background:color,borderRadius:99,
          transition:'width .2s var(--ease)'}}></div>
        <input type="range" min={min} max={max} value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:'absolute',left:0,right:0,width:'100%',opacity:0,height:28,cursor:'pointer',margin:0}}/>
        <div style={{position:'absolute',left:`calc(${pct}% - 9px)`,width:18,height:18,borderRadius:99,
          background:'#fff',border:'2px solid '+color,boxShadow:'var(--sh-sm)',
          transition:'left .2s var(--ease)',pointerEvents:'none'}}></div>
      </div>
      {labels && <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
        {labels.map((l,i)=><span key={i} style={{fontSize:10.5,color:'var(--text-3)',fontWeight:500}}>{l}</span>)}
      </div>}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={()=>onChange(!on)} style={{width:42,height:24,borderRadius:99,padding:2,
      background:on?'var(--indigo-500)':'#D4D6DC',transition:'background .2s var(--ease)'}}>
      <div style={{width:20,height:20,borderRadius:99,background:'#fff',boxShadow:'var(--sh-xs)',
        transform:on?'translateX(18px)':'none',transition:'transform .2s var(--ease-out)'}}></div>
    </button>
  );
}

function EmptyState({ icon='reports', title, sub, action }) {
  return (
    <div style={{textAlign:'center',padding:'56px 24px',animation:'fadeUp .4s var(--ease-out) both'}}>
      <div style={{width:64,height:64,borderRadius:18,margin:'0 auto 18px',background:'var(--indigo-50)',
        display:'flex',alignItems:'center',justifyContent:'center',color:'var(--indigo-400)'}}>
        <Icon name={icon} size={28}/></div>
      <h3 style={{fontSize:17,fontWeight:700}}>{title}</h3>
      {sub && <p style={{fontSize:14,color:'var(--text-2)',marginTop:6,maxWidth:380,marginInline:'auto',lineHeight:1.5}}>{sub}</p>}
      {action && <div style={{marginTop:18,display:'flex',justifyContent:'center'}}>{action}</div>}
    </div>
  );
}

function PageHeader({ title, sub, actions, breadcrumb }) {
  return (
    <div style={{marginBottom:24}}>
      {breadcrumb && <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10,fontSize:13,
        color:'var(--text-3)',fontWeight:500}}>
        {breadcrumb.map((b,i)=><React.Fragment key={i}>
          <span style={{cursor:b.onClick?'pointer':'default',color:i===breadcrumb.length-1?'var(--text-2)':'var(--text-3)'}}
            onClick={b.onClick}>{b.label}</span>
          {i<breadcrumb.length-1 && <Icon name="chevronRight" size={13}/>}
        </React.Fragment>)}
      </div>}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:700,letterSpacing:'-.02em'}}>{title}</h1>
          {sub && <p style={{fontSize:14.5,color:'var(--text-2)',marginTop:5,maxWidth:560,lineHeight:1.5}}>{sub}</p>}
        </div>
        {actions && <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{actions}</div>}
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange, style={} }) {
  return (
    <div style={{display:'flex',gap:4,borderBottom:'1px solid var(--border)',...style}}>
      {tabs.map(t=>{ const v=typeof t==='string'?t:t.value; const l=typeof t==='string'?t:t.label;
        const on=v===active;
        return <button key={v} onClick={()=>onChange(v)} style={{padding:'11px 14px',fontSize:14,fontWeight:600,
          color:on?'var(--indigo-600)':'var(--text-2)',position:'relative',transition:'color .15s'}}>
          {l}
          {on && <span style={{position:'absolute',left:8,right:8,bottom:-1,height:2.5,background:'var(--indigo-500)',
            borderRadius:2,animation:'fadeIn .2s'}}></span>}
        </button>;})}
    </div>
  );
}

/* Toast host via window event */
function ToastHost() {
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{
    const h=(e)=>{ const id=Date.now()+Math.random(); const t={id,...e.detail};
      setToasts(x=>[...x,t]); setTimeout(()=>setToasts(x=>x.filter(z=>z.id!==id)),e.detail.duration||3400); };
    window.addEventListener('nx-toast',h); return ()=>window.removeEventListener('nx-toast',h);
  },[]);
  const iconFor={success:'checkCircle',info:'info',caution:'alert',error:'x'};
  const colorFor={success:'#0D9488',info:'#4F46E5',caution:'#C2820B',error:'#D03A2C'};
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:500,display:'flex',flexDirection:'column',gap:10}}>
      {toasts.map(t=><div key={t.id} style={{display:'flex',alignItems:'flex-start',gap:12,background:'var(--ink-900)',
        color:'#fff',padding:'14px 16px',borderRadius:'var(--r-md)',boxShadow:'var(--sh-xl)',minWidth:280,maxWidth:380,
        animation:'slideInRight .34s var(--ease-out)'}}>
        <span style={{color:colorFor[t.type||'info'],marginTop:1,flex:'none'}}><Icon name={iconFor[t.type||'info']} size={18}/></span>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{t.title}</div>
          {t.body && <div style={{fontSize:13,color:'rgba(255,255,255,.7)',marginTop:2,lineHeight:1.4}}>{t.body}</div>}
        </div>
      </div>)}
    </div>
  );
}
function toast(title, type='info', body, duration){ window.dispatchEvent(new CustomEvent('nx-toast',{detail:{title,type,body,duration}})); }

Object.assign(window, {
  StatusBadge, Chip, Button, IconButton, Avatar, Card, ScoreBar, Ring, ConfidenceChip,
  Tooltip, Modal, Drawer, SegMacro, Slider, Toggle, EmptyState, PageHeader, Tabs, ToastHost, toast,
  TONES, STATUS_MAP, ThemeToggle, toggleTheme, getTheme, applyTheme, useTheme,
  useVW, bp, Reveal, CountUp, Popover, MenuItem, MenuHeader, MenuDivider, TrustBadge, diffWords
});
})();
