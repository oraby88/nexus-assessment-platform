/* ============================================================
   NEXUS — Assessments (list + detail)
   ============================================================ */
(function(){
const { useState } = React;
window.ADMIN_PAGES = window.ADMIN_PAGES || {};
const { Button, IconButton, StatusBadge, Avatar, Chip, PageHeader, EmptyState, ScoreBar, toast } = window;
const TableShell=window.__TableShell, Th=window.__Th, Td=window.__Td;

function Assessments({ go }) {
  const NX=window.NX;
  const [tab,setTab]=useState('All');
  const [q,setQ]=useState('');
  let rows=NX.ASSESSMENTS;
  const map={All:null,'In Progress':'In Progress','Completed':'Completed','Not Started':'Not Started','Expired':'Expired'};
  if(map[tab]) rows=rows.filter(r=>r.status===map[tab]);
  if(q) rows=rows.filter(r=>(r.candidate+r.role+r.id).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
      <PageHeader title="Assessments" sub="Track every assignment from invitation to report."
        actions={<>
          <Button variant="secondary" icon="download" onClick={()=>toast('Export started','info','Assessment List is being prepared.')}>Export</Button>
          <Button icon="sparkles" onClick={()=>go('create-assessment')}>Create Assessment</Button></>}/>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,flexWrap:'wrap'}}>
        {['All','In Progress','Completed','Not Started','Expired'].map(t=>
          <Chip key={t} active={tab===t} onClick={()=>setTab(t)} tone="indigo">{t}</Chip>)}
        <div style={{flex:1}}></div>
        <div style={{position:'relative',width:260}}>
          <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)'}}><Icon name="search" size={15}/></span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search assessments…"
            style={{width:'100%',padding:'8px 12px 8px 34px',borderRadius:'var(--r-md)',border:'1px solid var(--border)',fontSize:13.5,background:'var(--surface)'}}/></div>
      </div>
      <TableShell>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
            <tr><Th>ID</Th><Th>Candidate</Th><Th>Use Case</Th><Th>Blueprint</Th><Th>Context</Th>
              <Th>Deadline</Th><Th w={130}>Progress</Th><Th>Status</Th><Th>Report</Th><Th w={44}></Th></tr>
          </thead>
          <tbody className="nx-stagger" key={rows.length}>
            {rows.map(a=>(
              <tr key={a.id} onClick={()=>go('assessment-detail',{id:a.id})} style={{borderTop:'1px solid var(--border-soft)',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <Td><span className="mono" style={{fontSize:12,color:'var(--text-2)'}}>{a.id}</span></Td>
                <Td><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={a.candidate} size={30}/>
                  <div><div style={{fontWeight:600,fontSize:13}}>{a.candidate}</div>
                    <div style={{fontSize:11.5,color:'var(--text-3)'}}>{a.role}</div></div></div></Td>
                <Td style={{fontSize:12.5,color:'var(--text-2)'}}>{a.useCase}</Td>
                <Td style={{fontSize:12.5}}>{a.blueprint==='—'?<span style={{color:'var(--text-3)'}}>—</span>:a.blueprint}</Td>
                <Td style={{fontSize:12.5}}>{a.context==='—'?<span style={{color:'var(--text-3)'}}>—</span>:a.context}</Td>
                <Td style={{fontSize:12.5,color:'var(--text-2)'}}>{a.deadline}</Td>
                <Td><div style={{display:'flex',alignItems:'center',gap:8}}>
                  <ScoreBar value={a.progress} height={6} color={a.progress===100?'var(--teal-600)':'var(--indigo-500)'}/>
                  <span style={{fontSize:11,fontWeight:600,color:'var(--text-3)',width:28}}>{a.progress}%</span></div></Td>
                <Td><StatusBadge status={a.status} size="sm"/></Td>
                <Td><StatusBadge status={a.report} size="sm" dot={a.report!=='—'}/></Td>
                <Td><div onClick={e=>e.stopPropagation()}><IconButton name="more"/></div></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length===0 && <EmptyState icon="assessment" title="No assessments here" sub="Create an assessment to get started."
          action={<Button icon="sparkles" onClick={()=>go('create-assessment')}>Create Assessment</Button>}/>}
      </TableShell>
    </div>
  );
}

/* ---------- Assessment Detail ---------- */
function AssessmentDetail({ go, route }) {
  const NX=window.NX;
  const a = NX.ASSESSMENTS.find(x=>x.id===route.params.id) || NX.ASSESSMENTS[0];
  const c = NX.CANDIDATES.find(x=>x.name===a.candidate);
  return (
    <div style={{animation:'fadeUp .4s var(--ease-out) both'}}>
      <PageHeader breadcrumb={[{label:'Assessments',onClick:()=>go('assessments')},{label:a.id}]}
        title={a.role} sub={`${a.candidate} · ${a.useCase}`}
        actions={<>
          <Button variant="secondary" icon="bell" onClick={()=>toast('Reminder sent','success','A reminder email was sent to '+a.candidate+'.')}>Send Reminder</Button>
          <Button variant="secondary" icon="calendar" onClick={()=>toast('Deadline extended','success','Deadline moved forward by 7 days.')}>Extend Deadline</Button>
          {a.report==='Released'||a.report==='Released with Caution'||a.report==='Partial Release'
            ? <Button icon="reports" onClick={()=>go('report-detail',{id:'RPT-5501'})}>Open Report</Button>
            : <Button icon="send" onClick={()=>toast('Invitation resent','success')}>Resend Invitation</Button>}</>}/>
      <div className="nx-rail" style={{gap:20}}>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {/* progress hero */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,boxShadow:'var(--sh-sm)',
            display:'flex',alignItems:'center',gap:24}}>
            <window.Ring value={a.progress} size={84} stroke={7} color={a.progress===100?'var(--teal-600)':'var(--indigo-500)'} label={a.progress+'%'}/>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <StatusBadge status={a.status}/><StatusBadge status={a.report} dot={a.report!=='—'}/></div>
              <div style={{display:'flex',gap:28,flexWrap:'wrap'}}>
                {[['Assigned',a.assigned],['Deadline',a.deadline],['Use Case',a.useCase]].map((m,i)=>(
                  <div key={i}><div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase'}}>{m[0]}</div>
                    <div style={{fontSize:13.5,fontWeight:600,marginTop:2}}>{m[1]}</div></div>))}
              </div>
            </div>
          </div>
          {/* section grid */}
          <div className="nx-g2" style={{gap:18}}>
            <window.__DetailCard title="Candidate Information">
              <KV k="Name" v={a.candidate}/><KV k="Current Role" v={c?c.current:'—'}/>
              <KV k="Target Role" v={a.role}/><KV k="Job Level" v={c?c.level:'Manager'}/>
              <div style={{marginTop:10}}><Button size="sm" variant="secondary" onClick={()=>go('candidate-detail',{id:c?c.id:'CND-2041'})}>Open Candidate</Button></div>
            </window.__DetailCard>
            <window.__DetailCard title="Role & Context">
              <KV k="Blueprint" v={a.blueprint} link={a.blueprint!=='—'?()=>go('blueprints'):null}/>
              <KV k="Context Profile" v={a.context} link={a.context!=='—'?()=>go('contexts'):null}/>
              <KV k="Domain 6 Status" v={a.context!=='—'?'Computed':'Not applicable'}/>
              <KV k="Version" v="scoring v2.0.0 · sw-1.3"/>
            </window.__DetailCard>
          </div>
          <window.__DetailCard title="Reminder History">
            <window.__Timeline items={[
              {t:'Reminder sent',d:'May 25 · automated 3-day reminder',icon:'bell',tone:'amber'},
              {t:'Invitation delivered',d:'May 20 · candidate opened email',icon:'mail',tone:'indigo'},
              {t:'Invitation sent',d:'May 20 · by Jordan Avery',icon:'send',tone:'slate'},
            ]}/>
          </window.__DetailCard>
        </div>
        {/* right rail actions */}
        <div style={{display:'flex',flexDirection:'column',gap:18,position:'sticky',top:84}}>
          <window.__DetailCard title="Consent">
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px',borderRadius:'var(--r-md)',background:'var(--teal-50)'}}>
              <Icon name="shieldCheck" size={18} color="var(--teal-600)"/>
              <div><div style={{fontSize:13,fontWeight:600}}>Consent granted</div>
                <div style={{fontSize:11.5,color:'var(--text-3)'}}>Specific to {a.useCase}</div></div></div>
          </window.__DetailCard>
          <window.__DetailCard title="Manage">
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[['refresh','Create Reassessment'],['compare','Add to Comparison'],['download','Download PDF'],['x','Cancel Assessment']].map((m,i)=>
                <button key={i} onClick={()=>m[1]==='Add to Comparison'?go('comparison'):toast(m[1],'info')} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',
                  borderRadius:'var(--r-md)',border:'1px solid var(--border-soft)',fontSize:13,fontWeight:600,
                  color:i===3?'var(--rose-600)':'var(--text)',textAlign:'left'}}>
                  <Icon name={m[0]} size={16} color={i===3?'var(--rose-600)':'var(--text-3)'}/>{m[1]}</button>)}
            </div>
          </window.__DetailCard>
        </div>
      </div>
    </div>
  );
}
function KV({ k, v, link }) {
  return <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--border-soft)'}}>
    <span style={{fontSize:12.5,color:'var(--text-3)'}}>{k}</span>
    <span onClick={link} style={{fontSize:13,fontWeight:600,textAlign:'right',color:link?'var(--indigo-600)':'var(--text)',cursor:link?'pointer':'default'}}>{v}</span></div>;
}
window.__KV = KV;

window.ADMIN_PAGES.assessments = Assessments;
window.ADMIN_PAGES['assessment-detail'] = AssessmentDetail;
})();
