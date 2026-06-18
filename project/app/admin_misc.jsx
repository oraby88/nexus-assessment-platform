/* ============================================================
   NEXUS — Admin misc: History, Exports, Notifications, Settings, Profile
   ============================================================ */
(function(){
const { useState } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, ConfidenceChip, PageHeader, Tabs, Toggle, EmptyState, toast } = window;
const TableShell=window.__TableShell, Th=window.__Th, Td=window.__Td;

/* ---------------- Assessment History ---------------- */
function History({ go }) {
  const NX=window.NX;
  const done=NX.ASSESSMENTS.filter(a=>a.status==='Completed'||a.status==='Pass With Limits');
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Assessment History" sub="Every completed assessment with version references for full auditability."
      actions={<Button variant="secondary" icon="download" onClick={()=>toast('Export started','info')}>Export</Button>}/>
    <TableShell>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
          <tr><Th>Candidate</Th><Th>Type</Th><Th>Target Role</Th><Th>Blueprint Ver.</Th><Th>Context Ver.</Th><Th>Assigned</Th><Th>Completed</Th><Th>Status</Th><Th w={90}></Th></tr></thead>
        <tbody className="nx-stagger">
          {done.map(a=>(
            <tr key={a.id} style={{borderTop:'1px solid var(--border-soft)'}}>
              <Td><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={a.candidate} size={30}/><span style={{fontWeight:600,fontSize:13}}>{a.candidate}</span></div></Td>
              <Td style={{fontSize:12.5,color:'var(--text-2)'}}>{a.useCase}</Td><Td style={{fontSize:13}}>{a.role}</Td>
              <Td><span className="mono" style={{fontSize:12}}>{a.blueprint==='—'?'—':'v'+a.blueprint.match(/\d/)+'.0'}</span></Td>
              <Td><span className="mono" style={{fontSize:12,color:'var(--text-3)'}}>{a.context==='—'?'—':'v1.0'}</span></Td>
              <Td style={{fontSize:12.5,color:'var(--text-3)'}}>{a.assigned}</Td><Td style={{fontSize:12.5,color:'var(--text-2)'}}>{a.deadline}</Td>
              <Td><StatusBadge status={a.status} size="sm"/></Td>
              <Td><div style={{display:'flex',gap:4}}><IconButton name="reports" tip="Report" size={16} onClick={()=>go('report-detail',{id:'RPT-5501'})}/><IconButton name="download" tip="PDF" size={16}/></div></Td>
            </tr>))}
        </tbody>
      </table>
    </TableShell>
  </div>;
}

/* ---------------- Exports ---------------- */
function Exports({ go }) {
  const types=[['Candidate List','candidates',247],['Assessment List','assessment',34],['Assessment History','history',186],
    ['Report List','reports',172],['Candidate Comparison','compare',3],['Role Blueprint List','blueprint',7],['Context Profile List','context',5]];
  const [running,setRunning]=useState(null);
  const recent=[['Candidate List','CSV','Ready','2d ago'],['Report List','PDF','Ready','3d ago'],['Assessment History','XLSX','Processing','just now']];
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Exports" sub="Generate data exports with filters, date ranges and status scoping."/>
    <div className="nx-rail-sm" style={{gap:20}}>
      <div className="nx-g2" style={{gap:14}}>
        {types.map(t=><div key={t[0]} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
          <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:10,background:'var(--indigo-50)',color:'var(--indigo-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={t[1]} size={18}/></div>
            <div><div style={{fontSize:14,fontWeight:700}}>{t[0]}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{t[2]} records</div></div></div>
          <div style={{display:'flex',gap:8}}>
            <select style={{flex:1,padding:'7px 10px',borderRadius:'var(--r-sm)',border:'1px solid var(--border)',fontSize:12.5,background:'var(--surface)'}}><option>CSV</option><option>XLSX</option><option>PDF</option></select>
            <Button size="sm" icon="download" onClick={()=>{setRunning(t[0]);toast('Export started','info',t[0]+' is being prepared.');setTimeout(()=>{setRunning(null);toast('Export ready','success',t[0]+' is ready to download.');},1800);}}>{running===t[0]?'…':'Export'}</Button></div>
        </div>)}
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:18,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Export History</h3>
        {recent.map((r,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'11px 0',borderBottom:i<recent.length-1?'1px solid var(--border-soft)':'none'}}>
          <Icon name="reports" size={17} color="var(--text-3)"/>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{r[0]}</div><div style={{fontSize:11.5,color:'var(--text-3)'}}>{r[1]} · {r[3]}</div></div>
          {r[2]==='Ready'?<IconButton name="download" tip="Download" size={16}/>:<div style={{width:14,height:14,border:'2px solid var(--indigo-200,#C7CEFB)',borderTopColor:'var(--indigo-500)',borderRadius:99,animation:'spin .8s linear infinite'}}></div>}</div>)}
      </div>
    </div>
  </div>;
}

/* ---------------- Notifications ---------------- */
function Notifications({ go }) {
  const NX=window.NX;
  const [items,setItems]=useState(NX.NOTIFICATIONS);
  const [filter,setFilter]=useState('All');
  const iconFor={report:'reports',caution:'alert',completed:'checkCircle',deadline:'clock',started:'play',blueprint:'blueprint',invited:'send',reminder:'bell',expired:'x',export:'download',partial:'reports',upload:'upload'};
  const toneFor={report:'teal',caution:'amber',completed:'teal',deadline:'amber',started:'indigo',blueprint:'indigo',invited:'indigo',reminder:'slate',expired:'rose',export:'slate',partial:'amber',upload:'teal'};
  let rows=items; if(filter==='Unread') rows=items.filter(n=>!n.read);
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Notifications" sub="In-platform and email notifications across your workspace."
      actions={<Button variant="secondary" icon="check" onClick={()=>{setItems(i=>i.map(n=>({...n,read:true})));toast('All marked read','success');}}>Mark all as read</Button>}/>
    <div style={{display:'flex',gap:8,marginBottom:16}}>{['All','Unread'].map(f=><Chip key={f} active={filter===f} onClick={()=>setFilter(f)} tone="indigo">{f}{f==='Unread'&&' ('+items.filter(n=>!n.read).length+')'}</Chip>)}</div>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
      {rows.map((n,i)=>{ const t=window.TONES[toneFor[n.type]||'slate'];
        return <div key={n.id} onClick={()=>setItems(x=>x.map(z=>z.id===n.id?{...z,read:true}:z))} style={{display:'flex',gap:14,padding:'15px 18px',borderTop:i?'1px solid var(--border-soft)':'none',
          cursor:'pointer',background:n.read?'transparent':'var(--indigo-50)',transition:'background .15s'}}
          onMouseEnter={e=>{if(n.read)e.currentTarget.style.background='var(--surface-2)';}} onMouseLeave={e=>{if(n.read)e.currentTarget.style.background='transparent';}}>
          <div style={{width:38,height:38,borderRadius:10,flex:'none',background:t.bg,color:t.dot,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={iconFor[n.type]||'bell'} size={18}/></div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14,fontWeight:700}}>{n.title}</span>
              {!n.read && <span style={{width:7,height:7,borderRadius:99,background:'var(--indigo-500)'}}></span>}</div>
            <div style={{fontSize:13,color:'var(--text-2)',marginTop:3,lineHeight:1.4}}>{n.body}</div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
              <span style={{fontSize:11.5,color:'var(--text-3)'}}>{n.time}</span>
              {n.email && <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-3)',fontWeight:600}}><Icon name="mail" size={12}/> Emailed</span>}</div>
          </div>
        </div>;})}
    </div>
  </div>;
}

/* ---------------- Settings ---------------- */
function Settings({ go }) {
  const [tab,setTab]=useState('Organization Profile');
  const tabs=['Organization Profile','Admin Account','Assessment Defaults','Deadlines','Reminder Schedule','Notifications','Report Access','Branding','Privacy & Consent','Integrations'];
  return <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
    <PageHeader title="Organization Settings" sub="Meridian Group workspace · one Admin account in V1."/>
    <div className="nx-rail-r" style={{gap:24}}>
      <div style={{display:'flex',flexDirection:'column',gap:2,position:'sticky',top:84}} className="nx-settingsnav">
        {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{textAlign:'left',padding:'9px 12px',borderRadius:'var(--r-sm)',fontSize:13,fontWeight:tab===t?700:500,
          color:tab===t?'var(--indigo-700)':'var(--text-2)',background:tab===t?'var(--indigo-50)':'transparent',transition:'all .15s'}}>{t}</button>)}
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:24,boxShadow:'var(--sh-sm)'}}>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:18}}>{tab}</h3>
        {tab==='Organization Profile' && <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:480}}>
          {[['Organization Name','Meridian Group'],['Primary Domain','meridian.co'],['Industry','Financial Services'],['Headquarters','London, UK']].map((m,i)=>
            <window.Field key={i} label={m[0]}><input defaultValue={m[1]} style={window.inpStyle}/></window.Field>)}</div>}
        {tab==='Reminder Schedule' && <div style={{maxWidth:480}}>
          <p style={{fontSize:13.5,color:'var(--text-2)',marginBottom:16}}>Automated reminders sent before each deadline.</p>
          {[['3 days before deadline',true],['1 day before deadline',true],['On deadline day',false],['Daily after expiry',false]].map((r,i)=>
            <Row key={i} label={r[0]} on={r[1]}/>)}</div>}
        {tab==='Notifications' && <div style={{maxWidth:480}}>
          {[['Email notifications',true],['In-platform notifications',true],['Report-ready alerts',true],['Caution-flag alerts',true],['Weekly digest',false]].map((r,i)=><Row key={i} label={r[0]} on={r[1]}/>)}</div>}
        {tab==='Report Access' && <div style={{maxWidth:480}}>
          {[['Candidates can view their reports',true],['Show confidence notices to candidates',true],['Allow PDF download (candidate)',true],['Expose Domain 6 to candidates',false]].map((r,i)=><Row key={i} label={r[0]} on={r[1]}/>)}</div>}
        {!['Organization Profile','Reminder Schedule','Notifications','Report Access'].includes(tab) &&
          <p style={{fontSize:14,color:'var(--text-2)',lineHeight:1.6,maxWidth:520}}>Configure {tab.toLowerCase()} for your organization. These settings apply across all assessments in the Meridian Group workspace.</p>}
        <div style={{marginTop:24,display:'flex',gap:10}}><Button onClick={()=>toast('Settings saved','success')}>Save Changes</Button><Button variant="ghost">Cancel</Button></div>
      </div>
    </div>
  </div>;
}
function Row({ label, on }) { const [v,setV]=useState(on);
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border-soft)'}}>
    <span style={{fontSize:13.5,fontWeight:500}}>{label}</span><Toggle on={v} onChange={setV}/></div>; }

/* ---------------- Profile ---------------- */
function Profile({ go }) {
  return <div style={{animation:'fadeUp .4s var(--ease-out) both',maxWidth:560}}>
    <PageHeader title="My Profile"/>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:24,boxShadow:'var(--sh-sm)'}}>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}><Avatar name="Jordan Avery" size={64} ring/>
        <div><div style={{fontSize:18,fontWeight:700}}>Jordan Avery</div><div style={{fontSize:13.5,color:'var(--text-2)'}}>Administrator · Meridian Group</div></div></div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {[['Name','Jordan Avery'],['Email','admin@meridian.co'],['Job Title','Head of Talent Assessment']].map((m,i)=>
          <window.Field key={i} label={m[0]}><input defaultValue={m[1]} style={window.inpStyle}/></window.Field>)}
        <window.Field label="Language Preference"><select style={{...window.inpStyle}}><option>English (UK)</option><option>English (US)</option><option>Français</option></select></window.Field>
      </div>
      <div style={{marginTop:24,paddingTop:20,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between'}}>
        <Button variant="secondary" icon="lock">Change Password</Button>
        <Button onClick={()=>toast('Profile saved','success')}>Save Changes</Button></div>
    </div>
  </div>;
}

window.ADMIN_PAGES.history = History;
window.ADMIN_PAGES.exports = Exports;
window.ADMIN_PAGES.notifications = Notifications;
window.ADMIN_PAGES.settings = Settings;
window.ADMIN_PAGES.profile = Profile;
window.__SettingsRow = Row;
})();
