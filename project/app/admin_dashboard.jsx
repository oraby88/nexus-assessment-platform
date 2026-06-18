/* ============================================================
   NEXUS — Admin Dashboard
   ============================================================ */
(function(){
const { useState, useEffect } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};

function KPI({ label, value, icon, tone='indigo', delta, sub, onClick, idx=0 }) {
  const t = window.TONES[tone];
  const [hov,setHov]=useState(false);
  const isNum = /^[0-9]/.test(String(value));
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="nx-kpi"
      style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
        padding:'18px 18px 16px',boxShadow:hov?'var(--sh-md)':'var(--sh-sm)',cursor:onClick?'pointer':'default',
        transform:hov?'translateY(-3px)':'none',transition:'box-shadow .2s var(--ease), transform .2s var(--ease)',
        position:'relative',overflow:'hidden',animation:`floatUp .5s var(--ease-out) ${idx*0.06}s both`}}>
      <div aria-hidden style={{position:'absolute',top:-24,right:-24,width:90,height:90,borderRadius:'50%',
        background:t.bg,opacity:hov?.8:.45,transition:'opacity .3s, transform .3s',transform:hov?'scale(1.1)':'scale(1)'}}></div>
      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{width:38,height:38,borderRadius:11,background:t.bg,color:t.dot,display:'flex',
          alignItems:'center',justifyContent:'center',transform:hov?'scale(1.08) rotate(-4deg)':'none',transition:'transform .25s var(--ease-out)'}}><Icon name={icon} size={19}/></div>
        {delta && <span style={{fontSize:11.5,fontWeight:700,color:delta[0]==='+'?'var(--teal-600)':'var(--text-3)'}}>{delta}</span>}
      </div>
      <div style={{position:'relative',fontFamily:'var(--font-display)',fontSize:30,fontWeight:700,letterSpacing:'-.02em',marginTop:14,
        fontVariantNumeric:'tabular-nums'}}>{isNum?<window.CountUp to={value}/>:value}</div>
      <div style={{position:'relative',fontSize:12.5,color:'var(--text-2)',fontWeight:500,marginTop:2}}>{label}</div>
      {sub && <div style={{position:'relative',fontSize:11.5,color:'var(--text-3)',marginTop:3}}>{sub}</div>}
    </div>
  );
}

function QuickAction({ icon, label, onClick, primary }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'center',gap:11,padding:'12px 14px',borderRadius:'var(--r-md)',
        border:'1px solid '+(primary?'transparent':'var(--border)'),width:'100%',textAlign:'left',
        background:primary?'var(--indigo-500)':(hov?'var(--canvas-2)':'var(--surface)'),
        color:primary?'#fff':'var(--text)',transition:'all .16s var(--ease)',
        boxShadow:primary?'var(--sh-indigo)':'none',transform:hov?'translateX(2px)':'none'}}>
      <div style={{width:32,height:32,borderRadius:9,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',
        background:primary?'rgba(255,255,255,.16)':'var(--indigo-50)',color:primary?'#fff':'var(--indigo-500)'}}>
        <Icon name={icon} size={16}/></div>
      <span style={{flex:1,fontSize:13.5,fontWeight:600}}>{label}</span>
      <Icon name="chevronRight" size={15} color={primary?'rgba(255,255,255,.7)':'var(--text-3)'}/>
    </button>
  );
}

function Panel({ title, action, children, pad=0 }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
      boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'15px 18px',
        borderBottom:'1px solid var(--border-soft)'}}>
        <h3 style={{fontSize:14.5,fontWeight:700}}>{title}</h3>{action}</div>
      <div style={{padding:pad}}>{children}</div>
    </div>
  );
}

function Dashboard({ go }) {
  const NX = window.NX;
  return (
    <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
      <window.PageHeader title="Dashboard"
        sub="Tuesday, 11 June 2026 · Meridian Group workspace"
        actions={<>
          <window.Button variant="secondary" icon="upload" onClick={()=>go('candidates')}>Upload Candidates</window.Button>
          <window.Button icon="plus" onClick={()=>go('create-assessment')}>Create Assessment</window.Button>
        </>}/>

      {/* KPI grid */}
      <div className="nx-g4" style={{gap:16,marginBottom:16}}>
        <KPI idx={0} label="Total Candidates" value="247" icon="candidates" tone="indigo" delta="+12" sub="this month" onClick={()=>go('candidates')}/>
        <KPI idx={1} label="Active Assessments" value="34" icon="assessment" tone="teal" sub="18 in progress · 16 not started" onClick={()=>go('assessments')}/>
        <KPI idx={2} label="Completed" value="186" icon="checkCircle" tone="teal" delta="+23" sub="all time"/>
        <KPI idx={3} label="Available Reports" value="172" icon="reports" tone="violet" sub="14 with caution" onClick={()=>go('reports')}/>
      </div>
      <div className="nx-g4" style={{gap:16,marginBottom:24}}>
        <KPI idx={4} label="Not Started" value="16" icon="clock" tone="slate"/>
        <KPI idx={5} label="In Progress" value="18" icon="refresh" tone="indigo"/>
        <KPI idx={6} label="Reports With Caution" value="14" icon="alert" tone="amber" onClick={()=>go('reports')}/>
        <KPI idx={7} label="Validated Blueprints" value="4" icon="shieldCheck" tone="teal" sub="of 7 total" onClick={()=>go('blueprints')}/>
      </div>

      <div className="nx-rail" style={{gap:20}}>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* recent assessments */}
          <Panel title="Recent Assessments" action={<button onClick={()=>go('assessments')} style={linkBtn}>View all →</button>}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <tbody>
                {NX.ASSESSMENTS.slice(0,5).map((a,i)=>(
                  <tr key={a.id} onClick={()=>go('assessment-detail',{id:a.id})}
                    style={{cursor:'pointer',borderTop:i?'1px solid var(--border-soft)':'none'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'12px 18px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:11}}>
                        <Avatar name={a.candidate} size={32}/>
                        <div><div style={{fontWeight:600}}>{a.candidate}</div>
                          <div style={{fontSize:12,color:'var(--text-3)'}}>{a.role}</div></div>
                      </div></td>
                    <td style={{padding:'12px 8px',color:'var(--text-2)',fontSize:12.5}}>{a.useCase}</td>
                    <td style={{padding:'12px 8px',width:120}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <window.ScoreBar value={a.progress} height={6} color={a.progress===100?'var(--teal-600)':'var(--indigo-500)'} delay={i*60}/>
                        <span style={{fontSize:11,color:'var(--text-3)',fontWeight:600,width:30}}>{a.progress}%</span></div></td>
                    <td style={{padding:'12px 18px',textAlign:'right'}}><window.StatusBadge status={a.status} size="sm"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* deadline alerts + blueprint status */}
          <div className="nx-g2" style={{gap:20}}>
            <Panel title="Deadline Alerts" pad={14}>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {NX.DEADLINES.map((d,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 12px',borderRadius:'var(--r-md)',
                    background:d.days<=2?'var(--amber-50)':'var(--surface-2)',border:'1px solid '+(d.days<=2?'var(--amber-100)':'var(--border-soft)')}}>
                    <div style={{width:34,height:34,borderRadius:9,flex:'none',display:'flex',flexDirection:'column',
                      alignItems:'center',justifyContent:'center',background:d.days<=2?'var(--amber-600)':'var(--ink-600)',color:'#fff'}}>
                      <div style={{fontSize:13,fontWeight:700,lineHeight:1}}>{d.days}</div>
                      <div style={{fontSize:8,opacity:.8}}>days</div></div>
                    <div style={{flex:1,minWidth:0}}><div className="clip" style={{fontSize:13,fontWeight:600}}>{d.cnd}</div>
                      <div className="clip" style={{fontSize:11.5,color:'var(--text-3)'}}>{d.role}</div></div>
                    <span style={{fontSize:11,fontWeight:600,color:'var(--text-3)'}}>{d.progress}%</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Blueprint Status" pad={16}>
              {[['Validated',4,'teal'],['Active',2,'indigo'],['Under Review',1,'amber'],['Draft',1,'slate']].map((b,i)=>{
                const t=window.TONES[b[2]];
                return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<3?14:0}}>
                  <span style={{width:9,height:9,borderRadius:99,background:t.dot,flex:'none'}}></span>
                  <span style={{flex:1,fontSize:13,fontWeight:500}}>{b[0]}</span>
                  <div style={{width:90,height:6,background:'var(--track)',borderRadius:99,overflow:'hidden'}}>
                    <div style={{width:(b[1]/4*100)+'%',height:'100%',background:t.dot,borderRadius:99}}></div></div>
                  <span style={{fontSize:13,fontWeight:700,width:16,textAlign:'right'}}>{b[1]}</span>
                </div>);
              })}
            </Panel>
          </div>

          {/* recent candidates */}
          <Panel title="Recent Candidates" action={<button onClick={()=>go('candidates')} style={linkBtn}>View all →</button>} pad={6}>
            <div className="nx-g2" style={{gap:4}}>
              {NX.CANDIDATES.slice(0,4).map(c=>(
                <div key={c.id} onClick={()=>go('candidate-detail',{id:c.id})}
                  style={{display:'flex',alignItems:'center',gap:11,padding:'11px 12px',borderRadius:'var(--r-md)',cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <Avatar name={c.name} size={36}/>
                  <div style={{flex:1,minWidth:0}}><div className="clip" style={{fontSize:13.5,fontWeight:600}}>{c.name}</div>
                    <div className="clip" style={{fontSize:12,color:'var(--text-3)'}}>{c.target}</div></div>
                  <window.StatusBadge status={c.aStatus} size="sm" dot={false}/>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* right rail */}
        <div style={{display:'flex',flexDirection:'column',gap:20,position:'sticky',top:84}}>
          <Panel title="Quick Actions" pad={12}>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <QuickAction icon="sparkles" label="Create Assessment" primary onClick={()=>go('create-assessment')}/>
              <QuickAction icon="plus" label="Add Candidate" onClick={()=>go('candidates')}/>
              <QuickAction icon="blueprint" label="Create Role Blueprint" onClick={()=>go('create-blueprint')}/>
              <QuickAction icon="context" label="Create Context Profile" onClick={()=>go('create-context')}/>
              <QuickAction icon="compare" label="Compare Candidates" onClick={()=>go('comparison')}/>
            </div>
          </Panel>
          <Panel title="Notifications" action={<button onClick={()=>go('notifications')} style={linkBtn}>All →</button>} pad={6}>
            <div style={{display:'flex',flexDirection:'column'}}>
              {NX.NOTIFICATIONS.slice(0,5).map((n,i)=>(
                <div key={n.id} style={{display:'flex',gap:10,padding:'10px 12px',borderRadius:'var(--r-md)'}}>
                  <span style={{width:7,height:7,borderRadius:99,marginTop:6,flex:'none',
                    background:n.read?'transparent':'var(--indigo-500)'}}></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12.5,fontWeight:600,lineHeight:1.3}}>{n.title}</div>
                    <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2,lineHeight:1.35}}>{n.body}</div>
                    <div style={{fontSize:10.5,color:'var(--text-3)',marginTop:3}}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
const linkBtn = {fontSize:12.5,fontWeight:600,color:'var(--indigo-600)'};

window.ADMIN_PAGES.dashboard = Dashboard;
})();
