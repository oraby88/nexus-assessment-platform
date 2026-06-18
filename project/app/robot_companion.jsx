/* ============================================================
   NEXUS — Robot Companion (persistent GSAP-animated mascot)
   Follows the user across every page. window.RobotCompanion
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
const G = () => window.gsap;

/* contextual one-liners the companion says when you land on a page */
const HINTS = {
  dashboard:      "Here's your overview. Everything important, at a glance.",
  candidates:     "Add people individually or upload in bulk — your call.",
  'candidate-detail': "Everything about this candidate lives here.",
  assessments:    "Track every assessment's progress in real time.",
  'assessment-detail': "Full assignment, consent and timeline details here.",
  'create-assessment': "I'll help you design this assessment — let's go.",
  blueprints:     "Blueprints define what success looks like for a role.",
  'blueprint-detail': "Review, duplicate or activate this blueprint.",
  'create-blueprint': "Let's capture what great looks like, step by step.",
  contexts:       "Context profiles shape how results are interpreted.",
  'context-detail': "Here's the full context signature for this role.",
  'create-context': "Slide to set the work environment — no boring forms.",
  reports:        "Governed, explainable results — ready when you are.",
  'report-detail':"Tip: Domain 6 shows true contextual fit.",
  comparison:     "Compare candidates side by side — judgement stays yours.",
  history:        "Every past assessment, fully versioned.",
  exports:        "Export anything to CSV, XLSX or PDF.",
  notifications:  "I'll keep you posted here and by email.",
  settings:       "Tune your workspace defaults here.",
  profile:        "Your account, your preferences.",
  // user portal
  'my-assessments':"Take your time — you can pause and resume anytime.",
  help:           "Stuck? I'm right here to help.",
  'user-report':  "This is written to support you, not label you.",
};

function RobotCompanion({ page, greeting="Welcome to Nexus. I'm Nex — I'll travel with you." }) {
  const outerRef = useRef(null);   // mouse parallax
  const floatRef = useRef(null);   // float + hop
  const bubbleRef = useRef(null);
  const [open,setOpen]=useState(false);
  const [msg,setMsg]=useState(greeting);
  const hideTimer = useRef(null);
  const firstRun = useRef(true);
  const reduce = typeof window!=='undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // entrance + float + mouse parallax
  useEffect(()=>{
    const gsap=G(); if(!gsap) return;
    const ctx = gsap.context(()=>{
      gsap.set(outerRef.current,{opacity:0});
      gsap.to(outerRef.current,{opacity:1,duration:.5,delay:.4,ease:'power2.out'});
      if(!reduce){
        gsap.from(floatRef.current,{scale:0,rotate:-40,duration:.8,delay:.45,ease:'back.out(1.7)'});
        gsap.to(floatRef.current,{y:-9,duration:2.4,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.2});
      }
    });
    // mouse parallax (desktop only)
    let onMove;
    if(!reduce && window.matchMedia('(min-width:760px)').matches){
      const xTo=gsap.quickTo(outerRef.current,'x',{duration:.7,ease:'power3'});
      const yTo=gsap.quickTo(outerRef.current,'y',{duration:.7,ease:'power3'});
      onMove=(e)=>{ xTo(gsap.utils.mapRange(0,window.innerWidth,10,-10,e.clientX));
        yTo(gsap.utils.mapRange(0,window.innerHeight,8,-8,e.clientY)); };
      window.addEventListener('mousemove',onMove);
    }
    // greet shortly after load
    hideTimer.current=setTimeout(()=>{ setOpen(true); scheduleHide(4200); },1100);
    return ()=>{ ctx.revert(); if(onMove)window.removeEventListener('mousemove',onMove); clearTimeout(hideTimer.current); };
  },[]);

  const scheduleHide=(ms)=>{ clearTimeout(hideTimer.current); hideTimer.current=setTimeout(()=>setOpen(false),ms); };

  // react on page change: hop + contextual hint
  useEffect(()=>{
    if(firstRun.current){ firstRun.current=false; return; }
    const gsap=G();
    if(gsap && !reduce){
      gsap.fromTo(floatRef.current,{y:0},{keyframes:[{y:-16,duration:.22,ease:'power2.out'},{y:0,duration:.5,ease:'bounce.out'}]});
      gsap.fromTo(floatRef.current,{scaleX:1,scaleY:1},{keyframes:[{scaleX:1.12,scaleY:.88,duration:.12},{scaleX:1,scaleY:1,duration:.5,ease:'elastic.out(1,.5)'}]});
    }
    const hint = HINTS[page];
    if(hint){ setMsg(hint); setOpen(true); scheduleHide(3600); }
  },[page]);

  const toggle=()=>{ if(open){ setOpen(false); } else { setMsg(HINTS[page]||greeting); setOpen(true); scheduleHide(4200); } };

  return (
    <div ref={outerRef} style={{position:'fixed',right:'clamp(14px,3vw,30px)',bottom:'clamp(14px,3vw,30px)',zIndex:90,
      pointerEvents:'none',display:'flex',alignItems:'flex-end',gap:10,flexDirection:'column'}}>
      {/* speech bubble */}
      <div ref={bubbleRef} style={{pointerEvents:open?'auto':'none',maxWidth:240,marginRight:6,
        background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px 16px 4px 16px',
        boxShadow:'var(--sh-lg)',padding:'12px 14px',transformOrigin:'bottom right',
        opacity:open?1:0,transform:open?'translateY(0) scale(1)':'translateY(8px) scale(.92)',
        transition:'opacity .3s var(--ease-out), transform .35s var(--ease-out)'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5}}>
          <span style={{width:6,height:6,borderRadius:99,background:'var(--teal-500)',boxShadow:'0 0 8px var(--teal-500)'}}></span>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:'.06em',color:'var(--indigo-600)',textTransform:'uppercase'}}>Nex · AI guide</span>
        </div>
        <div style={{fontSize:13,lineHeight:1.5,color:'var(--text)',fontWeight:500}}>{msg}</div>
      </div>
      {/* robot button */}
      <button onClick={toggle} aria-label="Nex — your AI guide" style={{pointerEvents:'auto',position:'relative',
        background:'none',padding:0,cursor:'pointer',display:'block'}}>
        <div style={{position:'absolute',inset:'-14%',borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,.5), rgba(13,148,136,.16) 50%, transparent 70%)',
          filter:'blur(4px)',animation:reduce?'none':'auraPulse 3.4s ease-in-out infinite'}}></div>
        <div ref={floatRef} style={{position:'relative',width:'clamp(58px,9vw,74px)',height:'clamp(58px,9vw,74px)',
          borderRadius:'50%',background:'linear-gradient(160deg, rgba(20,26,44,.92), rgba(12,16,28,.95))',
          border:'1px solid rgba(165,176,248,.3)',boxShadow:'0 14px 30px -10px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12)',
          display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
          <window.NexusRobot size={66} compact/>
        </div>
        {/* status dot */}
        <span style={{position:'absolute',top:'6%',right:'6%',width:13,height:13,borderRadius:99,background:'var(--teal-500)',
          border:'2.5px solid var(--surface)',boxShadow:'0 0 8px var(--teal-500)'}}></span>
      </button>
    </div>
  );
}

window.RobotCompanion = RobotCompanion;
})();
