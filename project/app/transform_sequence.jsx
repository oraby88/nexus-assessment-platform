/* ============================================================
   NEXUS — Discovery → Assessment Transformation Sequence
   Plays after the AI chat: answers → requirements → dimensions
   → questions → assembled assessment. window.__CA.TransformSequence
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
const CA = window.__CA = window.__CA || {};

const PHASES = [
  { key:'read',  label:'Reading your answers',        sub:'Interpreting the interview' },
  { key:'req',   label:'Structuring requirements',     sub:'Compressing answers into a profile' },
  { key:'dim',   label:'Mapping to dimensions',        sub:'Linking requirements to the model' },
  { key:'q',     label:'Selecting governed questions', sub:'From the validated bank — never invented' },
  { key:'done',  label:'Assessment assembled',         sub:'Ready for your review' },
];
const REQS = ['Dependable follow-through','Composure under pressure','Evidence-based decisions','Integrity in ambiguity','Regulated reporting','Team leadership'];
const DIMS = [['D1','Conscientious Execution'],['D1','Integrity Orientation'],['D2','Decision Complexity'],['D2','Numerical Reasoning'],['D4','Self-Regulation'],['D1','Emotional Steadiness']];

function TransformSequence({ onDone }) {
  const root=useRef(null);
  const [phase,setPhase]=useState(0);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(()=>{
    const gsap=window.gsap;
    if(!gsap || reduce){ // fallback: brief hold then finish
      const t=setTimeout(()=>onDone&&onDone(), reduce?600:3600); return ()=>clearTimeout(t);
    }
    const ctx=gsap.context(()=>{
      const tl=gsap.timeline({ onComplete:()=>{ setTimeout(()=>onDone&&onDone(),520); } });
      // PHASE 0 — answer bubbles converge
      tl.add(()=>setPhase(0));
      tl.from('.tf-bubble',{opacity:0,scale:0,stagger:.06,duration:.34,ease:'back.out(1.6)'});
      tl.to('.tf-bubble',{x:0,y:0,scale:.3,opacity:0,duration:.5,ease:'power2.in',stagger:.03},'+=0.35');
      tl.fromTo('.tf-core',{scale:0,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.7)'},'-=0.5');
      tl.to('.tf-core',{boxShadow:'0 0 50px 8px rgba(79,70,229,.6)',duration:.3});
      // PHASE 1 — requirements pop from core
      tl.add(()=>setPhase(1),'+=0.15');
      tl.fromTo('.tf-req',{opacity:0,scale:.4,y:14},{opacity:1,scale:1,y:0,stagger:.07,duration:.4,ease:'back.out(1.5)'});
      tl.to({}, {duration:.5});
      // PHASE 2 — requirements map to dimensions
      tl.add(()=>setPhase(2),'+=0.1');
      tl.fromTo('.tf-dim',{opacity:0,x:-26},{opacity:1,x:0,stagger:.07,duration:.4,ease:'power2.out'});
      tl.fromTo('.tf-dim .tf-track',{scaleX:0},{scaleX:1,stagger:.07,duration:.5,ease:'power2.out'},'-=0.5');
      tl.to({}, {duration:.5});
      // PHASE 3 — questions selected
      tl.add(()=>setPhase(3),'+=0.1');
      tl.fromTo('.tf-q',{opacity:0,y:18,rotateX:-30},{opacity:1,y:0,rotateX:0,stagger:.09,duration:.42,ease:'power3.out'});
      tl.to({}, {duration:.55});
      // PHASE 4 — assembled
      tl.add(()=>setPhase(4),'+=0.1');
      tl.fromTo('.tf-final',{opacity:0,scale:.85},{opacity:1,scale:1,duration:.55,ease:'back.out(1.5)'});
      tl.fromTo('.tf-check',{scale:0},{scale:1,duration:.5,ease:'back.out(2)'},'-=0.25');
      tl.fromTo('.tf-final-row',{opacity:0,x:-12},{opacity:1,x:0,stagger:.08,duration:.3},'-=0.3');
      tl.to({}, {duration:.7});
    }, root);
    return ()=>ctx.revert();
  },[]);

  return (
    <div ref={root} style={{position:'absolute',inset:0,zIndex:40,overflow:'hidden',
      background:'radial-gradient(ellipse at 50% 32%, #18203A, #0B1020 70%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      {/* grid texture */}
      <div style={{position:'absolute',inset:0,opacity:.5,
        backgroundImage:'linear-gradient(rgba(120,130,180,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(120,130,180,.08) 1px,transparent 1px)',
        backgroundSize:'46px 46px',maskImage:'radial-gradient(ellipse at 50% 40%,black,transparent 75%)',WebkitMaskImage:'radial-gradient(ellipse at 50% 40%,black,transparent 75%)'}}></div>

      {/* skip */}
      <button onClick={()=>onDone&&onDone()} style={{position:'absolute',top:18,right:22,fontSize:12.5,fontWeight:600,
        color:'rgba(255,255,255,.55)',padding:'7px 13px',borderRadius:99,border:'1px solid rgba(255,255,255,.16)'}}>Skip →</button>

      {/* header */}
      <div style={{position:'relative',textAlign:'center',marginBottom:36,minHeight:64}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:9,padding:'5px 13px',borderRadius:99,
          background:'rgba(99,102,241,.18)',border:'1px solid rgba(165,176,248,.3)',marginBottom:14}}>
          <span style={{width:6,height:6,borderRadius:99,background:'#22D3C4',boxShadow:'0 0 8px #22D3C4'}}></span>
          <span style={{fontSize:11.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#A5B0F8'}}>Nexus Agent · Synthesizing</span>
        </div>
        <h2 key={phase} style={{fontSize:26,fontWeight:800,letterSpacing:'-.02em',color:'#fff',animation:'fadeUp .4s var(--ease-out) both'}}>{PHASES[phase].label}</h2>
        <p key={'s'+phase} style={{fontSize:14,color:'rgba(255,255,255,.6)',marginTop:6,animation:'fadeIn .5s .1s both'}}>{PHASES[phase].sub}</p>
      </div>

      {/* stage */}
      <div style={{position:'relative',width:'100%',maxWidth:620,height:240,display:'flex',alignItems:'center',justifyContent:'center'}}>
        {/* PHASE 0: bubbles + core */}
        {phase===0 && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {REQS.map((_,i)=>{ const a=i/REQS.length*Math.PI*2;
            return <div key={i} className="tf-bubble" style={{position:'absolute',width:46,height:30,borderRadius:9,
              background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.16)',
              left:`calc(50% + ${Math.cos(a)*150}px - 23px)`,top:`calc(50% + ${Math.sin(a)*78}px - 15px)`}}></div>;})}
          <div className="tf-core" style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(140deg,#4F46E5,#14B8A6)',
            display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="sparkles" size={28} color="#fff"/></div>
        </div>}
        {/* PHASE 1: requirement chips */}
        {phase===1 && <div style={{position:'absolute',inset:0,display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',justifyContent:'center',padding:'0 20px'}}>
          {REQS.map((r,i)=><span key={i} className="tf-req" style={{padding:'9px 15px',borderRadius:10,
            background:'rgba(99,102,241,.2)',border:'1px solid rgba(165,176,248,.34)',color:'#E9ECF5',fontSize:13.5,fontWeight:600}}>{r}</span>)}
        </div>}
        {/* PHASE 2: dimensions */}
        {phase===2 && <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',gap:9,justifyContent:'center',maxWidth:440,margin:'0 auto'}}>
          {DIMS.map((d,i)=><div key={i} className="tf-dim" style={{display:'flex',alignItems:'center',gap:11,
            background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'9px 13px'}}>
            <span className="mono" style={{fontSize:10.5,fontWeight:700,color:'#A5B0F8',width:20}}>{d[0]}</span>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:'#fff'}}>{d[1]}</span>
            <div style={{width:60,height:5,borderRadius:99,background:'rgba(255,255,255,.1)',overflow:'hidden'}}>
              <div className="tf-track" style={{height:'100%',width:'100%',transformOrigin:'left',
                background:i<2?'#F2A096':'#A5B0F8',borderRadius:99}}></div></div>
          </div>)}
        </div>}
        {/* PHASE 3: question cards */}
        {phase===3 && <div style={{position:'absolute',inset:0,display:'flex',gap:12,alignItems:'center',justifyContent:'center',perspective:800,flexWrap:'wrap',padding:'0 16px'}}>
          {['Likert','Forced choice','Situational','Cognitive','Likert'].map((t,i)=>{ const c=['#4F46E5','#0D9488','#C2820B','#7C3AED','#4F46E5'][i];
            return <div key={i} className="tf-q" style={{width:104,height:128,borderRadius:13,background:'rgba(255,255,255,.06)',
              border:'1px solid rgba(255,255,255,.13)',padding:12,display:'flex',flexDirection:'column',gap:7}}>
              <span style={{fontSize:9,fontWeight:700,color:c,textTransform:'uppercase',letterSpacing:'.04em'}}>{t}</span>
              <div style={{height:5,borderRadius:9,background:'rgba(255,255,255,.18)'}}></div>
              <div style={{height:5,borderRadius:9,background:'rgba(255,255,255,.12)',width:'70%'}}></div>
              <div style={{flex:1}}></div>
              <Icon name="lock" size={13} color="rgba(255,255,255,.4)"/>
            </div>;})}
        </div>}
        {/* PHASE 4: assembled */}
        {phase===4 && <div className="tf-final" style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(165,176,248,.3)',borderRadius:18,padding:'24px 28px',width:'100%',maxWidth:420,boxShadow:'0 20px 50px -16px rgba(0,0,0,.5)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div className="tf-check" style={{width:42,height:42,borderRadius:12,background:'#0D9488',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="check" size={22} color="#fff" stroke={3}/></div>
              <div><div style={{fontSize:16,fontWeight:700,color:'#fff',lineHeight:1.25}}>Finance Manager Assessment</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.55)',marginTop:3}}>5 governed items · ~42 min · 3 domains</div></div>
            </div>
            {[['layers','6 requirements mapped to dimensions'],['shieldCheck','All scoring logic locked & governed'],['target','100% job-requirement coverage']].map((r,i)=>
              <div key={i} className="tf-final-row" style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0'}}>
                <Icon name={r[0]} size={15} color="#22D3C4"/><span style={{fontSize:13,color:'rgba(255,255,255,.82)'}}>{r[1]}</span></div>)}
          </div>
        </div>}
      </div>

      {/* phase progress dots */}
      <div style={{position:'relative',display:'flex',gap:8,marginTop:38}}>
        {PHASES.map((_,i)=><span key={i} style={{width:i===phase?22:8,height:8,borderRadius:99,
          background:i<=phase?'#4F46E5':'rgba(255,255,255,.18)',transition:'all .4s var(--ease-out)'}}></span>)}
      </div>
    </div>
  );
}
CA.TransformSequence = TransformSequence;
})();
