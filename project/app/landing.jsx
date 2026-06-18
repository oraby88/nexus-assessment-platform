/* ============================================================
   NEXUS — Landing Page (cinematic, futuristic, with robot)
   window.Landing
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;

/* ---------------- The Robot ---------------- */
function NexusRobot({ size=300, compact=false }) {
  const [blink,setBlink]=useState(false);
  useEffect(()=>{ const t=setInterval(()=>{ setBlink(true); setTimeout(()=>setBlink(false),140); }, 3600);
    return ()=>clearInterval(t); },[]);
  return (
    <div style={{position:'relative',width:size,height:size,animation:compact?'none':'robotFloat 6s ease-in-out infinite'}}>
      {/* aura */}
      {!compact && <div style={{position:'absolute',inset:'-12%',borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,.42), rgba(13,148,136,.14) 45%, transparent 68%)',
        filter:'blur(6px)',animation:'auraPulse 4s ease-in-out infinite'}}></div>}

      {/* orbiting domain nodes */}
      {!compact && [0,1,2,3,4,5].map(i=>(
        <div key={i} style={{position:'absolute',inset:0,animation:`spin ${22+i*2}s linear infinite ${i%2?'reverse':''}`}}>
          <div style={{position:'absolute',top:`${50 - 46*Math.cos(i/6*Math.PI*2)}%`,left:`${50 + 46*Math.sin(i/6*Math.PI*2)}%`,
            transform:'translate(-50%,-50%)',width:11,height:11,borderRadius:'50%',
            background:['#6366F1','#14B8A6','#7C3AED','#C2820B','#0EA5E9','#4F46E5'][i],
            boxShadow:`0 0 14px 2px ${['#6366F1','#14B8A6','#7C3AED','#C2820B','#0EA5E9','#4F46E5'][i]}`}}></div>
        </div>
      ))}

      <svg viewBox="0 0 200 200" width={size} height={size} style={{position:'relative',zIndex:2,filter:'drop-shadow(0 20px 40px rgba(0,0,0,.55))'}}>
        <defs>
          <linearGradient id="rbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EEF1FF"/><stop offset="0.5" stopColor="#C9D0F2"/><stop offset="1" stopColor="#9AA6D8"/>
          </linearGradient>
          <linearGradient id="rface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10162A"/><stop offset="1" stopColor="#1B2348"/>
          </linearGradient>
          <linearGradient id="rvisor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5"/><stop offset="1" stopColor="#14B8A6"/>
          </linearGradient>
          <radialGradient id="reye" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#A5F3EC"/><stop offset="0.5" stopColor="#22D3C4"/><stop offset="1" stopColor="#0D9488"/>
          </radialGradient>
        </defs>

        {/* antenna */}
        <line x1="100" y1="34" x2="100" y2="16" stroke="#9AA6D8" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="100" cy="12" r="5" fill="#6366F1">
          <animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>
        <circle cx="100" cy="12" r="9" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity=".5">
          <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".6;0;.6" dur="1.6s" repeatCount="indefinite"/></circle>

        {/* shoulders / body hint */}
        <path d="M54 168 Q54 138 100 138 Q146 138 146 168 L146 184 Q146 190 140 190 L60 190 Q54 190 54 184 Z" fill="url(#rbody)"/>
        <rect x="86" y="128" width="28" height="20" rx="8" fill="#B5BEE6"/>
        <circle cx="100" cy="170" r="9" fill="url(#rvisor)" opacity=".9"/>
        <circle cx="100" cy="170" r="4" fill="#0B1020"/>

        {/* head */}
        <rect x="48" y="36" width="104" height="92" rx="30" fill="url(#rbody)" stroke="#fff" strokeWidth="1" strokeOpacity=".4"/>
        {/* ear pods */}
        <rect x="40" y="66" width="12" height="32" rx="6" fill="#9AA6D8"/>
        <rect x="148" y="66" width="12" height="32" rx="6" fill="#9AA6D8"/>
        <circle cx="46" cy="82" r="3" fill="#14B8A6"/><circle cx="154" cy="82" r="3" fill="#14B8A6"/>

        {/* face visor */}
        <rect x="60" y="52" width="80" height="60" rx="22" fill="url(#rface)"/>
        <rect x="60" y="52" width="80" height="60" rx="22" fill="none" stroke="url(#rvisor)" strokeWidth="1.5" strokeOpacity=".6"/>
        {/* scan line */}
        <rect x="62" y="54" width="76" height="56" rx="20" fill="none" clipPath="url(#face)"/>
        <rect x="60" y="52" width="80" height="3" fill="#22D3C4" opacity=".5">
          <animate attributeName="y" values="56;106;56" dur="3.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".0;.55;.0" dur="3.4s" repeatCount="indefinite"/></rect>

        {/* eyes */}
        <g transform={blink?'translate(0,0) scale(1,0.1)':'scale(1,1)'} style={{transformOrigin:'85px 80px',transition:'transform .1s'}}>
          <ellipse cx="85" cy="80" rx="9" ry={blink?1.5:10} fill="url(#reye)"/>
          <circle cx="83" cy="77" r="2.6" fill="#EAFFFD" opacity=".9"/>
        </g>
        <g transform={blink?'translate(0,0) scale(1,0.1)':'scale(1,1)'} style={{transformOrigin:'115px 80px',transition:'transform .1s'}}>
          <ellipse cx="115" cy="80" rx="9" ry={blink?1.5:10} fill="url(#reye)"/>
          <circle cx="113" cy="77" r="2.6" fill="#EAFFFD" opacity=".9"/>
        </g>
        {/* smile */}
        <path d="M90 98 Q100 104 110 98" stroke="#22D3C4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8"/>
      </svg>
    </div>
  );
}
window.NexusRobot = NexusRobot;

/* ---------------- Background field ---------------- */
function StarField() {
  const dots = useRef([...Array(46)].map(()=>({
    x:Math.random()*100, y:Math.random()*100, s:Math.random()*2+0.5, d:Math.random()*4+2, delay:Math.random()*4
  }))).current;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
    {dots.map((d,i)=><div key={i} style={{position:'absolute',left:d.x+'%',top:d.y+'%',width:d.s,height:d.s,borderRadius:'50%',
      background:i%3===0?'#22D3C4':'#A5B0F8',opacity:.6,animation:`twinkle ${d.d}s ease-in-out ${d.delay}s infinite`}}></div>)}
  </div>;
}

/* ---------------- Landing ---------------- */
function Landing({ onEnter, onUser }) {
  const [scrolled,setScrolled]=useState(false);
  const ref=useRef(null);
  const progRef=useRef(null);
  useEffect(()=>{ const el=ref.current; if(!el)return; const h=()=>setScrolled(el.scrollTop>20);
    el.addEventListener('scroll',h); return ()=>el.removeEventListener('scroll',h); },[]);

  // GSAP cinematic motion (scoped to the landing scroll container)
  useEffect(()=>{
    const gsap=window.gsap, ST=window.ScrollTrigger;
    const root=ref.current; if(!gsap||!root) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce) return; // CSS keyframes already show everything; skip motion
    const q=(s)=>root.querySelector(s); const qa=(s)=>gsap.utils.toArray(root.querySelectorAll(s));

    const ctx = gsap.context(()=>{
      // --- hero entrance timeline (on load) ---
      const tl=gsap.timeline({defaults:{ease:'power3.out'}});
      tl.from('.lp-badge',{opacity:0,y:18,duration:.6})
        .from('.lp-h1',{opacity:0,y:34,duration:.8},'-=0.3')
        .from('.lp-sub',{opacity:0,y:24,duration:.7},'-=0.5')
        .from('.lp-cta-row > *',{opacity:0,y:20,stagger:.12,duration:.6},'-=0.4')
        .from('.lp-stat',{opacity:0,y:18,stagger:.1,duration:.5},'-=0.3')
        .from('.lp-herobot',{opacity:0,scale:.7,rotate:-8,duration:1,ease:'back.out(1.5)'},'-=1.1');

      // --- scroll progress bar ---
      if(ST && progRef.current){
        gsap.set(progRef.current,{scaleX:0,transformOrigin:'left center'});
        ST.create({ scroller:root, start:0, end:'max',
          onUpdate:(self)=>gsap.set(progRef.current,{scaleX:self.progress}) });
      }

      // --- parallax atmosphere (scrub) ---
      if(ST){
        gsap.to('.lp-atmos',{yPercent:18,ease:'none',
          scrollTrigger:{scroller:root,trigger:'.lp-hero-wrap',start:'top top',end:'bottom top',scrub:1}});
        gsap.to('.lp-gridbg',{yPercent:30,ease:'none',
          scrollTrigger:{scroller:root,trigger:'.lp-hero-wrap',start:'top top',end:'bottom top',scrub:1}});
        gsap.to('.lp-stars',{yPercent:-22,ease:'none',
          scrollTrigger:{scroller:root,trigger:'.lp-hero-wrap',start:'top top',end:'bottom top',scrub:1.2}});
        // robot gentle scrub drift + rotate as you scroll the hero
        gsap.to('.lp-herobot',{y:60,rotate:6,ease:'none',
          scrollTrigger:{scroller:root,trigger:'.lp-hero-wrap',start:'top top',end:'bottom top',scrub:1}});
      }
      ST && ST.refresh();
    }, root);

    // --- section reveals via IntersectionObserver (reliable inside nested scroller) ---
    // Content is visible by DEFAULT; we only animate FROM hidden the moment a group
    // actually enters view, so nothing can ever get stuck invisible.
    const revealGroups = Array.from(root.querySelectorAll('.lp-reveal'));
    const heads = Array.from(root.querySelectorAll('.lp-sechead'));
    const bignums = Array.from(root.querySelectorAll('.lp-bignum'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        const g=e.target;
        if(g.classList.contains('lp-bignum')){
          const target=parseFloat(g.dataset.to)||0, suffix=g.dataset.suffix||'';
          const obj={v:0};
          gsap.to(obj,{v:target,duration:1.4,ease:'power2.out',overwrite:true,
            onUpdate:()=>{ g.textContent=(target%1===0?Math.round(obj.v):obj.v.toFixed(1))+suffix; }});
        } else {
          const kids = g.classList.contains('lp-sechead') ? [g]
            : (g.children.length ? Array.from(g.children) : [g]);
          gsap.fromTo(kids,{opacity:0,y:38},{opacity:1,y:0,duration:.7,stagger:.09,ease:'power3.out',overwrite:true});
        }
        io.unobserve(g);
      });
    }, { root, threshold:0.12, rootMargin:'0px 0px -6% 0px' });
    [...revealGroups, ...heads, ...bignums].forEach(el=>io.observe(el));

    return ()=>{ io.disconnect(); ctx.revert(); };
  },[]);

  return (
    <div ref={ref} className="lp-root" style={{height:'100vh',overflowY:'auto',overflowX:'hidden',
      background:'var(--lp-bg)',color:'var(--lp-text)',scrollBehavior:'smooth'}}>
      <style>{LP_CSS}</style>
      {/* scroll progress */}
      <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:60,pointerEvents:'none'}}>
        <div ref={progRef} style={{height:'100%',background:'linear-gradient(90deg,#4F46E5,#22D3C4)',transformOrigin:'left center',transform:'scaleX(0)'}}></div>
      </div>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',gap:16,padding:'16px 40px',
        background:scrolled?'var(--lp-nav)':'transparent',backdropFilter:scrolled?'blur(14px)':'none',
        borderBottom:'1px solid '+(scrolled?'var(--lp-line)':'transparent'),transition:'all .3s var(--ease)'}}>
        <div style={{display:'flex',alignItems:'center',gap:11}}>
          <window.NexusMark size={32} light/>
          <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:19,letterSpacing:'-.02em',color:'#fff'}}>Nexus</div>
        </div>
        <div style={{display:'flex',gap:4,marginLeft:24}} className="lp-navlinks">
          {['Platform','Domains','Intelligence','Governance'].map(l=>
            <a key={l} href={'#'+l.toLowerCase()} style={{padding:'8px 14px',fontSize:14,fontWeight:500,color:'var(--lp-dim)',borderRadius:8}} className="lp-navlink">{l}</a>)}
        </div>
        <div style={{flex:1}}></div>
        <window.ThemeToggle variant="shell"/>
        <button onClick={onUser} style={{padding:'9px 16px',fontSize:14,fontWeight:600,color:'var(--lp-dim)',borderRadius:10}} className="lp-ghost">I have an invitation</button>
        <button onClick={onEnter} className="lp-cta-sm">Enter Platform <Icon name="arrowRight" size={15}/></button>
      </nav>

      {/* HERO */}
      <header className="lp-hero-wrap" style={{position:'relative',minHeight:'calc(100vh - 72px)',display:'flex',alignItems:'center',padding:'0 40px',overflow:'hidden'}}>
        {/* atmosphere */}
        <div className="lp-atmos" style={{position:'absolute',inset:'-10% 0',background:'radial-gradient(ellipse at 72% 38%, rgba(79,70,229,.30), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(13,148,136,.18), transparent 46%)'}}></div>
        <div className="lp-gridbg" style={{position:'absolute',inset:'-10% 0',backgroundImage:'linear-gradient(var(--lp-grid) 1px, transparent 1px), linear-gradient(90deg, var(--lp-grid) 1px, transparent 1px)',
          backgroundSize:'54px 54px',maskImage:'radial-gradient(ellipse at 50% 40%, black, transparent 78%)',WebkitMaskImage:'radial-gradient(ellipse at 50% 40%, black, transparent 78%)'}}></div>
        <div className="lp-stars"><StarField/></div>

        <div style={{position:'relative',zIndex:2,maxWidth:1240,margin:'0 auto',width:'100%',display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:40,alignItems:'center'}} className="lp-hero">
          <div>
            <div className="lp-badge" style={{display:'inline-flex',alignItems:'center',gap:9,padding:'7px 14px',borderRadius:99,
              background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',marginBottom:26}}>
              <span style={{width:7,height:7,borderRadius:99,background:'#22D3C4',boxShadow:'0 0 10px #22D3C4'}}></span>
              <span style={{fontSize:12.5,fontWeight:600,color:'var(--lp-dim)',letterSpacing:'.02em'}}>The AI-native human-capability platform</span>
            </div>
            <h1 className="lp-h1" style={{fontSize:62,lineHeight:1.04,fontWeight:800,letterSpacing:'-.03em',color:'#fff',margin:0}}>
              Step into a new<br/>era of <span className="lp-grad">human insight</span>.</h1>
            <p className="lp-sub" style={{fontSize:18.5,lineHeight:1.6,color:'var(--lp-dim)',marginTop:24,maxWidth:520}}>
              Nexus measures people across six scientific domains with governed, explainable, context-aware intelligence. We don't reduce a person to one number — we reveal how they think, work, and fit.</p>
            <div className="lp-cta-row" style={{display:'flex',gap:14,marginTop:34,flexWrap:'wrap'}}>
              <button onClick={onEnter} className="lp-cta-lg">Enter the Platform <Icon name="arrowRight" size={18}/></button>
              <button onClick={onUser} className="lp-cta-ghost">Access your assessment</button>
            </div>
            <div style={{display:'flex',gap:30,marginTop:42}}>
              {[['6','Scientific domains'],['35+','Validated dimensions'],['100%','Governed & auditable']].map((s,i)=>
                <div key={i} className="lp-stat"><div style={{fontFamily:'var(--font-display)',fontSize:30,fontWeight:800,color:'#fff'}}>{s[0]}</div>
                  <div style={{fontSize:12.5,color:'var(--lp-faint)',marginTop:2}}>{s[1]}</div></div>)}
            </div>
          </div>
          <div className="lp-herobot" style={{display:'flex',justifyContent:'center'}}>
            <NexusRobot size={360}/>
          </div>
        </div>
        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,color:'var(--lp-faint)',animation:'bobble 2s ease-in-out infinite'}}>
          <span style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase'}}>Discover</span>
          <Icon name="chevronDown" size={18}/>
        </div>
      </header>

      {/* TRUST STRIP */}
      <div style={{borderTop:'1px solid var(--lp-line)',borderBottom:'1px solid var(--lp-line)',background:'var(--lp-panel)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'22px 40px',display:'flex',alignItems:'center',gap:30,flexWrap:'wrap',justifyContent:'center'}}>
          <span style={{fontSize:12.5,color:'var(--lp-faint)',fontWeight:600,letterSpacing:'.04em'}}>TRUSTED BY MODERN TALENT TEAMS</span>
          {['MERIDIAN','NORTHWIND','AXIOM','VANTAGE','HELIOS'].map(b=>
            <span key={b} style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,color:'var(--lp-faint)',letterSpacing:'.06em',opacity:.7}}>{b}</span>)}
        </div>
      </div>

      {/* PLATFORM — pillars */}
      <Section id="platform" eyebrow="Why Nexus" title="Assessment, reimagined as intelligence">
        <div className="lp-grid3 lp-reveal" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {[['agent','AI-guided design','An intelligent agent interviews you about the role, builds a structured requirements profile, and selects governed questions — adapted to your context, never invented.'],
            ['shieldCheck','Governed by design','Every item keeps its validated scoring, dimension and governance status. Outputs are confidence-gated, explainable, and audit-ready end to end.'],
            ['layers','Context-aware fit','Domain 6 fuses the person, the role blueprint and the work context into a premium contextual-alignment layer that supports real human decisions.']].map((c,i)=>
            <div key={i} className="lp-card">
              <div className="lp-cardicon"><Icon name={c[0]} size={22}/></div>
              <h3 style={{fontSize:19,fontWeight:700,color:'#fff',marginTop:18}}>{c[1]}</h3>
              <p style={{fontSize:14.5,lineHeight:1.6,color:'var(--lp-dim)',marginTop:10}}>{c[2]}</p>
            </div>)}
        </div>
      </Section>

      {/* DOMAINS */}
      <Section id="domains" eyebrow="The model" title="Six domains. One coherent picture.">
        <div className="lp-grid3 lp-reveal" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {window.NX.DOMAINS.map((d,i)=>(
            <div key={d.id} className="lp-domain">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span className="mono" style={{fontSize:12,fontWeight:700,color:d.color}}>{d.code}</span>
                {d.status!=='active' && <span style={{fontSize:9.5,fontWeight:700,padding:'2px 7px',borderRadius:99,
                  background:'rgba(255,255,255,.07)',color:'var(--lp-faint)',letterSpacing:'.04em'}}>{d.status==='derived'?'DERIVED':'PHASE 2'}</span>}
              </div>
              <h4 style={{fontSize:17,fontWeight:700,color:'#fff',marginTop:12}}>{d.label}</h4>
              <p style={{fontSize:12.5,color:'var(--lp-faint)',marginTop:5}}>{d.sci}</p>
              <div style={{height:3,borderRadius:99,marginTop:16,background:`linear-gradient(90deg, ${d.color}, transparent)`}}></div>
            </div>
          ))}
        </div>
      </Section>

      {/* INTELLIGENCE — AI agent spotlight */}
      <Section id="intelligence" eyebrow="The agent" title="An intelligence that designs with you" split robot>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[['Interviews you','It asks about responsibilities, decision complexity, pressure and non-negotiables — like a seasoned I/O psychologist.'],
            ['Builds the profile','Your answers assemble into a structured Job Requirements Profile in real time, chip by chip.'],
            ['Selects, never invents','It draws only from the governed question bank and rephrases items to your role — preserving every scoring property.']].map((s,i)=>
            <div key={i} style={{display:'flex',gap:14}}>
              <div style={{width:30,height:30,flex:'none',borderRadius:9,background:'var(--lp-accent-bg)',color:'#A5B0F8',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)'}}>{i+1}</div>
              <div><div style={{fontSize:16,fontWeight:700,color:'#fff'}}>{s[0]}</div>
                <p style={{fontSize:14,color:'var(--lp-dim)',marginTop:3,lineHeight:1.55}}>{s[1]}</p></div>
            </div>)}
        </div>
      </Section>

      {/* WHY WE EXCEL — stats band */}
      <div style={{position:'relative',padding:'58px 40px',overflow:'hidden',borderTop:'1px solid var(--lp-line)',borderBottom:'1px solid var(--lp-line)'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%, rgba(79,70,229,.20), transparent 60%)'}}></div>
        <div style={{position:'relative',maxWidth:1100,margin:'0 auto',textAlign:'center'}}>
          <div className="lp-eyebrow">Why teams choose us</div>
          <h2 style={{fontSize:40,fontWeight:800,letterSpacing:'-.025em',color:'#fff',marginTop:12,maxWidth:760,marginInline:'auto',lineHeight:1.1}}>
            We don't just assess. We set the standard for governed human intelligence.</h2>
          <div className="lp-grid4 lp-reveal" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,marginTop:38}}>
            {[['98','%','Adoption by invited candidates'],['3.2','×','Faster role-fit decisions'],['0','','Ungoverned outputs, ever'],['24','mo','Audit trail retained']].map((s,i)=>
              <div key={i}>
                <div className="lp-grad lp-bignum" data-to={s[0]} data-suffix={s[1]} style={{fontFamily:'var(--font-display)',fontSize:46,fontWeight:800,letterSpacing:'-.02em'}}>{s[0]}{s[1]}</div>
                <div style={{fontSize:13.5,color:'var(--lp-dim)',marginTop:6}}>{s[2]}</div></div>)}
          </div>
        </div>
      </div>

      {/* GOVERNANCE callout */}
      <Section id="governance" eyebrow="Trust" title="Built for decisions that matter">
        <div className="lp-grid2 lp-reveal" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
          {[['lock','Confidence-gated outputs','Low-confidence results are flagged, never silently shown.'],
            ['eye','Explainable, not black-box','Every score traces to validated items and clear logic.'],
            ['shield','Consent-first for candidates','Specific, purpose-bound consent — always.'],
            ['flag','No automatic decisions','Nexus informs human judgement; it never replaces it.']].map((c,i)=>
            <div key={i} className="lp-card" style={{display:'flex',gap:14}}>
              <div className="lp-cardicon" style={{flex:'none'}}><Icon name={c[0]} size={20}/></div>
              <div><h3 style={{fontSize:16,fontWeight:700,color:'#fff'}}>{c[1]}</h3>
                <p style={{fontSize:13.5,color:'var(--lp-dim)',marginTop:5,lineHeight:1.5}}>{c[2]}</p></div>
            </div>)}
        </div>
      </Section>

      {/* FINAL CTA */}
      <div style={{position:'relative',padding:'66px 40px 54px',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 120%, rgba(13,148,136,.22), transparent 55%)'}}></div>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><window.NexusRobot size={150}/></div>
          <h2 style={{fontSize:44,fontWeight:800,letterSpacing:'-.03em',color:'#fff',lineHeight:1.08}}>Ready to enter the world of Nexus?</h2>
          <p style={{fontSize:17,color:'var(--lp-dim)',marginTop:16,maxWidth:520,marginInline:'auto',lineHeight:1.55}}>
            Sign in to your workspace, or open your assessment invitation. The future of human-capability intelligence is one click away.</p>
          <div style={{display:'flex',gap:14,justifyContent:'center',marginTop:30,flexWrap:'wrap'}}>
            <button onClick={onEnter} className="lp-cta-lg">Enter the Platform <Icon name="arrowRight" size={18}/></button>
            <button onClick={onUser} className="lp-cta-ghost">I have an invitation</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid var(--lp-line)',padding:'28px 40px',background:'var(--lp-panel)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
          <window.NexusMark size={24} light/>
          <span style={{fontSize:13,fontWeight:700,color:'#fff'}}>Nexus Assessment Platform</span>
          <div style={{flex:1}}></div>
          <span style={{fontSize:12.5,color:'var(--lp-faint)'}}>© 2026 Nexus · Governed human-capability intelligence</span>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children, split, robot }) {
  if(split) return (
    <section id={id} style={{padding:'62px 40px'}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}} className="lp-split">
        <div style={{display:'flex',justifyContent:'center',order:1}} className="lp-split-robot">
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',inset:'-20%',background:'radial-gradient(circle, rgba(79,70,229,.28), transparent 65%)',filter:'blur(10px)'}}></div>
            {robot && <window.NexusRobot size={300}/>}
          </div>
        </div>
        <div className="lp-sechead" style={{order:2}}>
          <div className="lp-eyebrow">{eyebrow}</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:'-.025em',color:'#fff',margin:'12px 0 26px',lineHeight:1.12}}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
  return (
    <section id={id} style={{padding:'62px 40px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div className="lp-sechead" style={{textAlign:'center',marginBottom:34}}>
          <div className="lp-eyebrow">{eyebrow}</div>
          <h2 style={{fontSize:38,fontWeight:800,letterSpacing:'-.025em',color:'#fff',marginTop:12,lineHeight:1.1}}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

const LP_CSS = `
.lp-root{
  --lp-bg:#06080F; --lp-text:#E9ECF5; --lp-dim:#A6AFC4; --lp-faint:#6B7488;
  --lp-line:rgba(255,255,255,.08); --lp-panel:rgba(255,255,255,.02); --lp-nav:rgba(6,8,15,.72);
  --lp-grid:rgba(120,130,180,.08); --lp-accent-bg:rgba(99,102,241,.16);
}
html[data-theme="light"] .lp-root{
  --lp-bg:#070A14; --lp-grid:rgba(120,130,180,.10);
}
.lp-navlink:hover{ color:#fff; background:rgba(255,255,255,.06); }
.lp-grad{ background:linear-gradient(100deg,#A5B0F8,#22D3C4); -webkit-background-clip:text; background-clip:text; color:transparent; }
.lp-cta-sm{ display:inline-flex;align-items:center;gap:7px;padding:9px 17px;border-radius:11px;font-size:14px;font-weight:600;
  background:#4F46E5;color:#fff;box-shadow:0 8px 22px -6px rgba(79,70,229,.6);transition:all .18s var(--ease); }
.lp-cta-sm:hover{ transform:translateY(-1px);filter:brightness(1.08); }
.lp-cta-lg{ display:inline-flex;align-items:center;gap:9px;padding:15px 28px;border-radius:14px;font-size:16px;font-weight:700;
  background:linear-gradient(100deg,#4F46E5,#6366F1);color:#fff;box-shadow:0 14px 34px -8px rgba(79,70,229,.65);transition:all .2s var(--ease); }
.lp-cta-lg:hover{ transform:translateY(-2px);box-shadow:0 20px 44px -8px rgba(79,70,229,.8); }
.lp-cta-ghost{ display:inline-flex;align-items:center;padding:15px 26px;border-radius:14px;font-size:16px;font-weight:600;
  background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.16);transition:all .2s var(--ease); }
.lp-cta-ghost:hover{ background:rgba(255,255,255,.1); }
.lp-ghost{ transition:color .18s; } .lp-ghost:hover{ color:#fff; }
.lp-eyebrow{ display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:#22D3C4; }
.lp-card{ background:rgba(255,255,255,.025);border:1px solid var(--lp-line);border-radius:18px;padding:26px;
  transition:all .25s var(--ease); }
.lp-card:hover{ background:rgba(255,255,255,.05);transform:translateY(-3px);border-color:rgba(165,176,248,.3); }
.lp-cardicon{ width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(79,70,229,.3),rgba(13,148,136,.2));
  border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;color:#A5B0F8; }
.lp-domain{ background:rgba(255,255,255,.025);border:1px solid var(--lp-line);border-radius:16px;padding:20px;
  transition:all .25s var(--ease); }
.lp-domain:hover{ background:rgba(255,255,255,.05);transform:translateY(-3px); }
@keyframes robotFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
@keyframes auraPulse{ 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
@keyframes twinkle{ 0%,100%{opacity:.15} 50%{opacity:.75} }
@keyframes bobble{ 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,6px)} }
@media (max-width:920px){
  .lp-hero{ grid-template-columns:1fr !important; text-align:center; }
  .lp-hero h1{ font-size:44px !important; }
  .lp-navlinks{ display:none !important; }
  .lp-grid3,.lp-grid4,.lp-grid2{ grid-template-columns:1fr !important; }
  .lp-split{ grid-template-columns:1fr !important; }
  .lp-split-robot{ order:0 !important; }
}
`;

window.Landing = Landing;
})();
