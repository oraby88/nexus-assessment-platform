/* ============================================================
   NEXUS — Create Assessment step components (window.__CA)
   ============================================================ */
(function(){
const { useState, useEffect, useRef } = React;
const CA = window.__CA = window.__CA || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, toast, ScoreBar } = window;
const StepHead = window.__StepHead;

/* ============================================================
   STEP 3 — AI DISCOVERY CHAT
   ============================================================ */
function AgentAvatar({ size=34, thinking }) {
  return <div style={{width:size,height:size,borderRadius:11,flex:'none',position:'relative',
    background:'linear-gradient(140deg,#4F46E5,#3730A3)',display:'flex',alignItems:'center',justifyContent:'center',
    boxShadow:'0 4px 12px -2px rgba(79,70,229,.5)'}}>
    <Icon name="sparkles" size={size*0.5} color="#fff"/>
    {thinking && <span style={{position:'absolute',inset:-3,borderRadius:13,border:'2px solid var(--indigo-300)',animation:'pulse 1.2s infinite'}}></span>}
  </div>;
}
function Typing() {
  return <div style={{display:'flex',gap:4,padding:'14px 16px'}}>
    {[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:99,background:'var(--indigo-400)',
      animation:`typing 1.3s ${i*0.16}s infinite`}}></span>)}</div>;
}

function DiscoveryChat({ data, set, onComplete }) {
  const SCRIPT = window.NX.AI_SCRIPT;
  const [msgs,setMsgs]=useState([]);          // {from, text, why, section}
  const [idx,setIdx]=useState(0);             // current script question index
  const [typing,setTyping]=useState(true);
  const [input,setInput]=useState('');
  const [live,setLive]=useState(false);
  const [whyOpen,setWhyOpen]=useState(null);
  const [reveal,setReveal]=useState(0);       // how many profile sections revealed
  const scrollRef=useRef(null);

  // initial AI message
  useEffect(()=>{ const t=setTimeout(()=>{ setTyping(false);
    setMsgs([{...SCRIPT[0]}]); },900); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[msgs,typing]);

  const answer=(text)=>{
    if(!text.trim()) return;
    setMsgs(m=>[...m,{from:'user',text}]); setInput('');
    setReveal(r=>Math.min(r+1,6));
    const ni=idx+1;
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      if(ni<SCRIPT.length){ setMsgs(m=>[...m,{...SCRIPT[ni]}]); setIdx(ni); }
      else { setMsgs(m=>[...m,{from:'ai',text:"Perfect — I have everything I need. I've assembled a structured **Job Requirements Profile** from your answers. Let's review it.",done:true}]);
        setIdx(ni); onComplete&&onComplete(); }
    }, live? 700 : 1100);
  };

  const liveAnswer=async(text)=>{
    if(!window.claude||!window.claude.complete){ answer(text); return; }
    setMsgs(m=>[...m,{from:'user',text}]); setInput(''); setReveal(r=>Math.min(r+1,6)); setTyping(true);
    try{
      const prompt=`You are the Nexus AI assessment-discovery agent interviewing a hiring manager to design a workforce assessment. You NEVER write test questions. You ask ONE concise, warm follow-up question to understand the role's requirements (responsibilities, decision complexity, pressure, non-negotiables). Conversation so far:\n${msgs.concat([{from:'user',text}]).map(m=>`${m.from==='ai'?'Agent':'Manager'}: ${m.text}`).join('\n')}\n\nReply with ONLY your next short question (max 35 words).`;
      const res=await window.claude.complete(prompt);
      setTyping(false);
      setMsgs(m=>[...m,{from:'ai',text:res.trim(),why:'Live response generated for this role.',section:'Live interview'}]);
    }catch(e){ setTyping(false); answer(text); }
  };

  const submit=()=>{ if(live) liveAnswer(input); else answer(input); };
  const cur = SCRIPT[idx];
  const total=SCRIPT.length;
  const answered=msgs.filter(m=>m.from==='user').length;

  return (
    <div style={{display:'flex',height:'100%',minHeight:0}}>
      {/* chat column */}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',height:'100%'}}>
        {/* chat header */}
        <div style={{padding:'16px 28px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12,background:'var(--surface)'}}>
          <AgentAvatar thinking={typing}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14.5,fontWeight:700,display:'flex',alignItems:'center',gap:8}}>Nexus Discovery Agent
              <span style={{fontSize:10.5,fontWeight:700,padding:'2px 7px',borderRadius:99,background:'var(--teal-50)',color:'var(--teal-700)'}}>● ONLINE</span></div>
            <div style={{fontSize:12,color:'var(--text-3)'}}>Interviewing you about the role — selects only from the governed bank</div>
          </div>
          {/* progress */}
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>{Math.min(answered,total)}/{total}</div>
            <div style={{width:90,height:6,background:'var(--canvas-2)',borderRadius:99,overflow:'hidden'}}>
              <div style={{width:(Math.min(answered,total)/total*100)+'%',height:'100%',background:'var(--indigo-500)',borderRadius:99,transition:'width .4s'}}></div></div>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:600,color:live?'var(--indigo-600)':'var(--text-3)',cursor:'pointer'}}>
            <Icon name="zap" size={13}/> Live AI <window.Toggle on={live} onChange={setLive}/></label>
        </div>
        {/* messages */}
        <div ref={scrollRef} style={{flex:1,overflow:'auto',padding:'24px 28px',background:'var(--canvas)'}}>
          {live && <div style={{textAlign:'center',marginBottom:16}}>
            <span style={{fontSize:11.5,color:'var(--indigo-600)',background:'var(--indigo-50)',padding:'5px 12px',borderRadius:99,fontWeight:600}}>
              ⚡ Live mode — type freely and the agent responds in real time</span></div>}
          {msgs.map((m,i)=> m.from==='ai'
            ? <div key={i} style={{display:'flex',gap:12,marginBottom:18,maxWidth:680,animation:'fadeUp .35s var(--ease-out) both'}}>
                <AgentAvatar size={32}/>
                <div style={{flex:1}}>
                  {m.section && <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--indigo-400)',marginBottom:5}}>{m.section}</div>}
                  <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'4px 16px 16px 16px',padding:'13px 16px',
                    fontSize:14.5,lineHeight:1.55,boxShadow:'var(--sh-xs)'}} dangerouslySetInnerHTML={{__html:mdBold(m.text)}}></div>
                  {m.why && <button onClick={()=>setWhyOpen(whyOpen===i?null:i)} style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:8,
                    fontSize:11.5,fontWeight:600,color:'var(--text-3)'}}>
                    <Icon name="help" size={13}/> Why are we asking this?</button>}
                  {whyOpen===i && <div style={{marginTop:8,padding:'11px 13px',background:'var(--indigo-50)',borderRadius:'var(--r-md)',
                    fontSize:12.5,color:'var(--indigo-700)',lineHeight:1.5,animation:'fadeUp .2s'}}>{m.why}</div>}
                </div>
              </div>
            : <div key={i} style={{display:'flex',justifyContent:'flex-end',marginBottom:18,animation:'fadeUp .3s var(--ease-out) both'}}>
                <div style={{maxWidth:520,background:'var(--indigo-500)',color:'#fff',borderRadius:'16px 4px 16px 16px',padding:'12px 16px',
                  fontSize:14.5,lineHeight:1.5,boxShadow:'var(--sh-indigo)'}}>{m.text}</div>
              </div>
          )}
          {typing && <div style={{display:'flex',gap:12,marginBottom:18}}>
            <AgentAvatar size={32} thinking/>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'4px 16px 16px 16px',boxShadow:'var(--sh-xs)'}}><Typing/></div></div>}
        </div>
        {/* input */}
        <div style={{padding:'16px 28px',borderTop:'1px solid var(--border)',background:'var(--surface)'}}>
          {cur && cur.chips && !typing && idx<total && <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
            {cur.chips.map(c=><button key={c} onClick={()=>answer(c)} style={{padding:'7px 13px',borderRadius:99,border:'1px solid var(--indigo-200,#C7CEFB)',
              background:'var(--indigo-50)',color:'var(--indigo-700)',fontSize:12.5,fontWeight:600,transition:'all .14s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--indigo-500)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--indigo-50)';e.currentTarget.style.color='var(--indigo-700)';}}>{c}</button>)}
          </div>}
          <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();}}}
              placeholder={idx>=total?'Discovery complete — continue to the summary →':'Type your answer, or pick a suggestion above…'}
              disabled={idx>=total}
              style={{flex:1,padding:'12px 14px',borderRadius:'var(--r-md)',border:'1px solid var(--border-strong)',fontSize:14,resize:'none',
                minHeight:46,maxHeight:120,background:idx>=total?'var(--canvas-2)':'var(--surface)',fontFamily:'var(--font-ui)'}}/>
            <Button icon="send" onClick={submit} disabled={idx>=total||!input.trim()} style={{height:46}}>Send</Button>
          </div>
        </div>
      </div>
      {/* requirements side panel */}
      <ReqPanel reveal={reveal}/>
    </div>
  );
}
function mdBold(t){ return (t||'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); }

function ReqPanel({ reveal }) {
  const P=window.NX.JOB_PROFILE;
  const blocks=[
    {show:reveal>=1,el:<PanelKV k="Role" v={P.role}/>},
    {show:reveal>=1,el:<PanelKV k="Job Family" v={P.family}/>},
    {show:reveal>=2,el:<PanelKV k="Level" v={P.level}/>},
    {show:reveal>=3,el:<PanelChips title="Responsibilities" items={P.responsibilities} tone="indigo"/>},
    {show:reveal>=3,el:<PanelChips title="Required Skills" items={P.skills} tone="teal"/>},
    {show:reveal>=4,el:<PanelDims dims={P.dimensions.slice(0,4)}/>},
    {show:reveal>=5,el:<PanelChips title="Context Signals" items={P.context} tone="violet"/>},
    {show:reveal>=6,el:<PanelDims dims={P.dimensions.slice(4)}/>},
    {show:reveal>=6,el:<PanelChips title="Non-Negotiables" items={P.nonNegotiables} tone="amber"/>},
  ];
  return <div style={{width:300,flex:'none',borderLeft:'1px solid var(--border)',background:'var(--surface)',display:'flex',flexDirection:'column',height:'100%'}}>
    <div style={{padding:'18px 20px',borderBottom:'1px solid var(--border-soft)'}}>
      <div style={{display:'flex',alignItems:'center',gap:9}}>
        <Icon name="layers" size={17} color="var(--indigo-500)"/>
        <div style={{fontSize:14,fontWeight:700}}>Job Requirements Profile</div></div>
      <div style={{fontSize:12,color:'var(--text-3)',marginTop:4}}>Assembled live from your answers</div></div>
    <div style={{flex:1,overflow:'auto',padding:20}}>
      {reveal===0 && <div style={{textAlign:'center',padding:'40px 12px',color:'var(--text-3)'}}>
        <div style={{width:48,height:48,borderRadius:14,margin:'0 auto 12px',background:'var(--canvas-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="sparkles" size={22} color="var(--text-3)"/></div>
        <p style={{fontSize:13,lineHeight:1.5}}>As you answer, structured requirements will appear here in real time.</p></div>}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {blocks.map((b,i)=> b.show && <div key={i} style={{animation:'fadeUp .4s var(--ease-out) both'}}>{b.el}</div>)}
      </div>
    </div>
  </div>;
}
function PanelKV({ k, v }) {
  return <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>{k}</span>
    <span style={{fontSize:13.5,fontWeight:600}}>{v}</span></div>;
}
function PanelChips({ title, items, tone }) {
  const t=window.TONES[tone];
  return <div><div style={{fontSize:11,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:8}}>{title}</div>
    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
      {items.map((it,i)=><span key={i} style={{padding:'5px 10px',borderRadius:8,background:t.bg,color:t.fg,fontSize:12,fontWeight:600,
        animation:`fadeUp .35s ${i*0.06}s var(--ease-out) both`}}>{it}</span>)}</div></div>;
}
function PanelDims({ dims }) {
  const wm={Critical:'rose',High:'indigo',Moderate:'slate'};
  return <div><div style={{fontSize:11,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:8}}>Critical Dimensions</div>
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {dims.map((d,i)=>{ const t=window.TONES[wm[d.weight]];
        return <div key={i} style={{display:'flex',alignItems:'center',gap:9,animation:`fadeUp .35s ${i*0.07}s var(--ease-out) both`}}>
          <span className="mono" style={{fontSize:10,fontWeight:700,color:'var(--text-3)',width:20}}>{d.domain}</span>
          <span style={{flex:1,fontSize:12.5,fontWeight:600}}>{d.name}</span>
          <span style={{fontSize:10.5,fontWeight:700,padding:'2px 7px',borderRadius:99,background:t.bg,color:t.fg}}>{d.weight}</span></div>;})}</div></div>;
}
CA.DiscoveryChat = DiscoveryChat;

window.__ReqHelpers = { PanelChips, PanelDims, PanelKV };
})();
