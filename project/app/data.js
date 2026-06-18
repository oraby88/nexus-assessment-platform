/* ============================================================
   NEXUS — Sample Data  (attached to window.NX)
   ============================================================ */
(function () {
  const NX = {};

  /* ---------------- Domains ---------------- */
  NX.DOMAINS = [
    { id:'D1', code:'D1', label:'Character & Work Style', sci:'Personality Architecture', status:'active', color:'#4F46E5',
      dims:['Conscientious Execution','Interpersonal Orientation','Emotional Steadiness','Exploratory Openness','Social Assertiveness','Integrity Orientation'] },
    { id:'D2', code:'D2', label:'Thinking & Problem Solving', sci:'Cognitive Architecture', status:'active', color:'#0D9488',
      dims:['Verbal Reasoning','Numerical Reasoning','Abstract Reasoning','Decision Complexity','Learning Agility','Strategic Systems Thinking'] },
    { id:'D3', code:'D3', label:'Drivers & Motivation', sci:'Motivational & Driver Architecture', status:'phase2', color:'#7C3AED',
      dims:['Influence Drive','Affiliation','Reward Orientation','Learning Drive','Purpose Orientation'] },
    { id:'D4', code:'D4', label:'Emotional Intelligence & Relationships', sci:'Emotional & Social Functioning', status:'active', color:'#C2820B',
      dims:['Self-Regulation','Self-Awareness','Resilience','Relationship Management','Social Awareness','Team Collaboration Style'] },
    { id:'D5', code:'D5', label:'Workplace Effectiveness', sci:'Applied Work & Leadership', status:'phase2', color:'#0EA5E9',
      dims:['Disciplined Execution','Judgment Quality','Workload Structure','Adaptability','Learning Execution'] },
    { id:'D6', code:'D6', label:'Contextual Alignment', sci:'Contextual Alignment & Decision Influence', status:'derived', color:'#3730A3',
      dims:['Contextual Alignment Index','Decision Influence Index'] },
  ];

  /* ---------------- Candidates ---------------- */
  const C = (id,name,email,cur,target,level,n,aStatus,rStatus,date,dept)=>(
    {id,name,email,current:cur,target,level,assessments:n,aStatus,rStatus,date,dept,
     initials:name.split(' ').map(w=>w[0]).slice(0,2).join('')});
  NX.CANDIDATES = [
    C('CND-2041','Amara Okonkwo','amara.okonkwo@meridian.co','Senior Analyst','Finance Manager','Manager',2,'Completed','Released','2026-05-28','Finance'),
    C('CND-2042','David Reinholt','d.reinholt@meridian.co','Operations Lead','Director of Operations','Director',1,'In Progress','Processing','2026-05-30','Operations'),
    C('CND-2043','Priya Venkatesh','priya.v@meridian.co','Product Designer','Senior Product Manager','Senior Manager',3,'Completed','Released with Caution','2026-05-22','Product'),
    C('CND-2044','Marcus Bell','marcus.bell@meridian.co','Account Executive','Regional Sales Lead','Manager',1,'Not Started','—','2026-06-02','Sales'),
    C('CND-2045','Lena Fischer','lena.fischer@meridian.co','Data Scientist','Lead Data Scientist','Senior Manager',2,'Completed','Released','2026-05-19','Engineering'),
    C('CND-2046','Tom Nakamura','tom.n@meridian.co','Support Specialist','Customer Success Manager','Manager',1,'In Progress','Processing','2026-06-01','People'),
    C('CND-2047','Sofia Marquez','sofia.m@meridian.co','Project Coordinator','Program Manager','Manager',2,'Completed','Partial Release','2026-05-15','Operations'),
    C('CND-2048','Ethan Wright','ethan.wright@meridian.co','Junior Engineer','Software Engineer II','Professional',1,'Expired','Unavailable','2026-05-10','Engineering'),
    C('CND-2049','Hana Aboud','hana.aboud@meridian.co','Marketing Lead','Head of Brand','Director',1,'Not Started','—','2026-06-03','Marketing'),
    C('CND-2050','Caleb Stone','caleb.stone@meridian.co','Risk Analyst','Compliance Manager','Manager',2,'Completed','Released','2026-05-25','Risk'),
    C('CND-2051','Yuki Tanaka','yuki.t@meridian.co','UX Researcher','Research Lead','Senior Manager',1,'In Progress','Processing','2026-06-04','Product'),
    C('CND-2052','Olivia Brandt','olivia.b@meridian.co','HRBP','People Operations Lead','Manager',1,'Completed','Released','2026-05-12','People'),
  ];

  /* ---------------- Assessments ---------------- */
  const A = (id,cnd,useCase,role,bp,ctx,assigned,deadline,progress,status,report)=>(
    {id,candidate:cnd,useCase,role,blueprint:bp,context:ctx,assigned,deadline,progress,status,report});
  NX.ASSESSMENTS = [
    A('ASM-7781','Amara Okonkwo','Hiring Support','Finance Manager','Finance Manager v3','FinMgr · Regulated',  '2026-05-20','2026-06-10',100,'Completed','Released'),
    A('ASM-7782','David Reinholt','Hiring Support','Director of Operations','Ops Director v2','Ops · High Ambiguity','2026-05-24','2026-06-12',62,'In Progress','Processing'),
    A('ASM-7783','Priya Venkatesh','Developmental Feedback','Senior Product Manager','—','—',                 '2026-05-15','2026-06-05',100,'Completed','Released with Caution'),
    A('ASM-7784','Marcus Bell','Hiring Support','Regional Sales Lead','Sales Lead v1','Sales · High Exposure', '2026-06-02','2026-06-20',0,'Not Started','—'),
    A('ASM-7785','Lena Fischer','Developmental Feedback','Lead Data Scientist','—','—',                       '2026-05-10','2026-05-30',100,'Completed','Released'),
    A('ASM-7786','Tom Nakamura','Hiring Support','Customer Success Manager','CSM v2','CSM · High Conflict',    '2026-05-28','2026-06-15',41,'In Progress','Processing'),
    A('ASM-7787','Sofia Marquez','Hiring Support','Program Manager','PM v2','PgM · Interdependent',           '2026-05-08','2026-05-28',100,'Pass With Limits','Partial Release'),
    A('ASM-7788','Ethan Wright','Hiring Support','Software Engineer II','SWE II v1','Eng · Execution',         '2026-04-28','2026-05-10',35,'Expired','Unavailable'),
    A('ASM-7789','Caleb Stone','Hiring Support','Compliance Manager','Compliance Mgr v2','Risk · Regulated',   '2026-05-18','2026-06-08',100,'Completed','Released'),
    A('ASM-7790','Olivia Brandt','Developmental Feedback','People Operations Lead','—','—',                    '2026-05-05','2026-05-25',100,'Completed','Released'),
  ];

  /* ---------------- Role Blueprints ---------------- */
  const B = (id,name,role,fam,level,status,ver,ctx,used,updated)=>(
    {id,name,role,family:fam,level,status,version:ver,context:ctx,used,updated});
  NX.BLUEPRINTS = [
    B('BP-301','Finance Manager v3','Finance Manager','Finance','Manager','Validated','v3.0','FinMgr · Regulated',4,'2026-05-18'),
    B('BP-302','Ops Director v2','Director of Operations','Operations','Director','Active','v2.1','Ops · High Ambiguity',2,'2026-05-22'),
    B('BP-303','Sales Lead v1','Regional Sales Lead','Sales','Manager','Under Review','v1.0','Sales · High Exposure',1,'2026-05-30'),
    B('BP-304','CSM v2','Customer Success Manager','People','Manager','Validated','v2.0','CSM · High Conflict',3,'2026-05-12'),
    B('BP-305','PM v2','Program Manager','Operations','Manager','Active','v2.0','PgM · Interdependent',2,'2026-05-08'),
    B('BP-306','Compliance Mgr v2','Compliance Manager','Risk','Manager','Validated','v2.0','Risk · Regulated',2,'2026-05-25'),
    B('BP-307','SWE II v1','Software Engineer II','Engineering','Professional','Draft','v0.4','Eng · Execution',0,'2026-06-01'),
  ];

  /* ---------------- Context Profiles ---------------- */
  // values 1-5 unless leadership_scope (0-4)
  const CTX = (id,name,role,fam,level,bp,status,updated,vals)=>({id,name,role,family:fam,level,blueprint:bp,status,updated,vals});
  NX.CONTEXTS = [
    CTX('CX-101','FinMgr · Regulated','Finance Manager','Finance','Manager','Finance Manager v3','Active','2026-05-18',
      {leadership_scope:2,ambiguity:2,decision_stakes:4,time_pressure:3,regulatory:5,autonomy:3,stakeholder:3,interdependence:3,innovation:2,precision:5,customer:2,conflict:2,change:2,failure_cost:5}),
    CTX('CX-102','Ops · High Ambiguity','Director of Operations','Operations','Director','Ops Director v2','Active','2026-05-22',
      {leadership_scope:4,ambiguity:5,decision_stakes:5,time_pressure:4,regulatory:2,autonomy:5,stakeholder:5,interdependence:4,innovation:4,precision:3,customer:3,conflict:4,change:5,failure_cost:4}),
    CTX('CX-103','Sales · High Exposure','Regional Sales Lead','Sales','Manager','Sales Lead v1','Draft','2026-05-30',
      {leadership_scope:2,ambiguity:3,decision_stakes:3,time_pressure:5,regulatory:1,autonomy:4,stakeholder:4,interdependence:2,innovation:3,precision:2,customer:5,conflict:3,change:4,failure_cost:3}),
    CTX('CX-104','CSM · High Conflict','Customer Success Manager','People','Manager','CSM v2','Active','2026-05-12',
      {leadership_scope:1,ambiguity:3,decision_stakes:3,time_pressure:4,regulatory:2,autonomy:3,stakeholder:5,interdependence:4,innovation:2,precision:3,customer:5,conflict:5,change:3,failure_cost:3}),
    CTX('CX-105','Risk · Regulated','Compliance Manager','Risk','Manager','Compliance Mgr v2','Active','2026-05-25',
      {leadership_scope:1,ambiguity:2,decision_stakes:5,time_pressure:2,regulatory:5,autonomy:2,stakeholder:3,interdependence:3,innovation:1,precision:5,customer:2,conflict:3,change:2,failure_cost:5}),
  ];
  NX.CONTEXT_FIELDS = [
    {key:'leadership_scope',label:'Leadership Scope',max:4,desc:'People and organizational scope the role carries.'},
    {key:'ambiguity',label:'Ambiguity Level',max:5,desc:'Strength of uncertainty and incomplete structure.'},
    {key:'decision_stakes',label:'Decision Stakes',max:5,desc:'Consequence severity of the decisions made.'},
    {key:'time_pressure',label:'Time Pressure',max:5,desc:'Pressure for speed of response and delivery.'},
    {key:'regulatory',label:'Regulatory Constraint',max:5,desc:'Degree of formal boundaries and compliance load.'},
    {key:'autonomy',label:'Autonomy Level',max:5,desc:'Decision freedom afforded to the role.'},
    {key:'stakeholder',label:'Stakeholder Complexity',max:5,desc:'Social and political complexity of stakeholders.'},
    {key:'interdependence',label:'Interdependence',max:5,desc:'Degree of coordination dependency with others.'},
    {key:'innovation',label:'Innovation Demand',max:5,desc:'Need for creativity and adaptation.'},
    {key:'precision',label:'Execution Precision',max:5,desc:'Need for consistency, accuracy and follow-through.'},
    {key:'customer',label:'Customer Exposure',max:5,desc:'External interaction and customer-facing load.'},
    {key:'conflict',label:'Conflict Load',max:5,desc:'Likelihood of disagreement and difficult influence.'},
    {key:'change',label:'Change Velocity',max:5,desc:'Speed of environmental and priority change.'},
    {key:'failure_cost',label:'Failure Cost',max:5,desc:'Practical cost of poor judgment in the role.'},
  ];

  /* ---------------- Reports ---------------- */
  const R = (id,cnd,type,role,bp,ctx,date,status,conf,d6)=>({id,candidate:cnd,type,role,blueprint:bp,context:ctx,date,status,confidence:conf,d6});
  NX.REPORTS = [
    R('RPT-5501','Amara Okonkwo','Hiring Support','Finance Manager','Finance Manager v3','FinMgr · Regulated','2026-05-28','Released','High','Strong fit'),
    R('RPT-5502','Priya Venkatesh','Developmental','Senior Product Manager','—','—','2026-05-22','Released with Caution','Moderate','—'),
    R('RPT-5503','Lena Fischer','Developmental','Lead Data Scientist','—','—','2026-05-30','Released','High','—'),
    R('RPT-5504','Sofia Marquez','Hiring Support','Program Manager','PM v2','PgM · Interdependent','2026-05-28','Partial Release','Moderate','Conditional fit'),
    R('RPT-5505','Caleb Stone','Hiring Support','Compliance Manager','Compliance Mgr v2','Risk · Regulated','2026-06-08','Released','High','Strong fit'),
    R('RPT-5506','Olivia Brandt','Developmental','People Operations Lead','—','—','2026-05-25','Released','High','—'),
  ];

  /* ---------------- Notifications ---------------- */
  const N = (id,type,title,body,time,read,email)=>({id,type,title,body,time,read,email});
  NX.NOTIFICATIONS = [
    N('NT-01','report','Report available','Amara Okonkwo · Finance Manager report has been released.','12m ago',false,true),
    N('NT-02','caution','Report released with caution','Priya Venkatesh · response-style flag applied to 2 dimensions.','1h ago',false,true),
    N('NT-03','completed','Assessment completed','Caleb Stone completed the Compliance Manager assessment.','3h ago',false,true),
    N('NT-04','deadline','Deadline approaching','David Reinholt · 2 days remaining on Director of Operations.','5h ago',true,true),
    N('NT-05','started','Candidate started assessment','Tom Nakamura began the Customer Success Manager assessment.','8h ago',true,false),
    N('NT-06','blueprint','Blueprint activated','Ops Director v2 was moved to Active status.','1d ago',true,true),
    N('NT-07','invited','Candidate invited','Marcus Bell was invited to the Regional Sales Lead assessment.','1d ago',true,true),
    N('NT-08','reminder','Reminder sent','Automated reminder sent to David Reinholt.','1d ago',true,false),
    N('NT-09','expired','Assessment expired','Ethan Wright · Software Engineer II assessment has expired.','2d ago',true,true),
    N('NT-10','export','Export ready','Candidate List export (CSV) is ready to download.','2d ago',true,false),
    N('NT-11','partial','Report partially released','Sofia Marquez · 1 section blocked pending validity review.','3d ago',true,true),
    N('NT-12','upload','Bulk upload complete','18 of 20 candidate records imported successfully.','3d ago',true,false),
  ];

  /* ---------------- Quick deadline alerts ---------------- */
  NX.DEADLINES = [
    {cnd:'David Reinholt',role:'Director of Operations',days:2,progress:62},
    {cnd:'Tom Nakamura',role:'Customer Success Manager',days:4,progress:41},
    {cnd:'Marcus Bell',role:'Regional Sales Lead',days:9,progress:0},
  ];

  window.NX = NX;
})();
