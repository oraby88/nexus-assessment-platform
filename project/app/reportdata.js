/* ============================================================
   NEXUS — Report Detail Data (Amara Okonkwo · Finance Manager)
   ============================================================ */
(function () {
  const NX = window.NX;

  NX.REPORT_DETAIL = {
    id:'RPT-5501', candidate:'Amara Okonkwo', role:'Finance Manager', useCase:'Hiring Support',
    blueprint:'Finance Manager v3', context:'FinMgr · Regulated', completed:'May 28, 2026',
    status:'Released', confidence:'High', duration:'42 min', scoringVersion:'v2.0.0', synthVersion:'sw-1.3',

    /* Measured dimensions by V1 domain */
    domains:[
      { code:'D1', label:'Character & Work Style', color:'#4F46E5',
        dims:[
          {name:'Conscientious Execution', score:84, conf:'High', band:'Strong'},
          {name:'Integrity Orientation',   score:91, conf:'High', band:'Strong'},
          {name:'Emotional Steadiness',    score:72, conf:'High', band:'Effective'},
          {name:'Interpersonal Orientation',score:66, conf:'Moderate', band:'Effective'},
          {name:'Exploratory Openness',    score:58, conf:'Moderate', band:'Mixed'},
          {name:'Social Assertiveness',    score:61, conf:'Moderate', band:'Effective'},
        ]},
      { code:'D2', label:'Thinking & Problem Solving', color:'#0D9488',
        dims:[
          {name:'Numerical Reasoning',   score:88, conf:'High', band:'Strong'},
          {name:'Decision Complexity',   score:79, conf:'High', band:'Effective'},
          {name:'Abstract Reasoning',    score:74, conf:'High', band:'Effective'},
          {name:'Verbal Reasoning',      score:69, conf:'Moderate', band:'Effective'},
          {name:'Learning Agility',      score:71, conf:'Moderate', band:'Effective'},
        ]},
      { code:'D4', label:'Emotional Intelligence & Relationships', color:'#C2820B',
        dims:[
          {name:'Self-Regulation',       score:81, conf:'High', band:'Strong'},
          {name:'Self-Awareness',        score:76, conf:'High', band:'Effective'},
          {name:'Resilience',            score:68, conf:'Moderate', band:'Effective'},
          {name:'Relationship Management',score:64, conf:'Moderate', band:'Mixed'},
          {name:'Team Collaboration Style',score:70, conf:'Moderate', band:'Effective'},
        ]},
    ],

    strengths:[
      {dim:'Integrity Orientation', score:91, text:'Holds firm ethical boundaries and rule-consistent choices even under deadline and ambiguity — a non-negotiable for regulated finance.'},
      {dim:'Numerical Reasoning', score:88, text:'Works fluently with quantitative structure; strong fit for forecasting, variance analysis and regulated reporting.'},
      {dim:'Conscientious Execution', score:84, text:'Plans ahead, closes work reliably, and resists distraction — dependable through monthly close cycles.'},
    ],
    stretch:[
      {dim:'Exploratory Openness', score:58, text:'Prefers proven methods over experimentation. Likely to seek established approaches first — pair with a change-comfortable partner for transformation work.'},
      {dim:'Relationship Management', score:64, text:'Effective but more task- than relationship-led. Coaching on stakeholder repair could lift influence across Operations & Risk.'},
    ],

    /* Domain 6 contextual alignment */
    d6:{
      cai:82, dii:74,
      caiBand:'Strong contextual fit',
      narrative:'Amara\u2019s profile maps closely to a regulated, high-precision finance environment. Integrity, numerical reasoning and execution discipline align with the dimensions this context weights most heavily. The main stretch is innovation demand, which this role rates low — a non-issue here.',
      secondary:[
        {code:'AFI', name:'Ambiguity Fit', score:63, type:'fit'},
        {code:'ECFI',name:'Execution-Context Fit', score:86, type:'fit'},
        {code:'SII', name:'Stakeholder Influence', score:67, type:'fit'},
        {code:'DDI', name:'Decision Discipline', score:84, type:'fit'},
        {code:'PDRI',name:'Pressure Distortion Risk', score:24, type:'risk'},
        {code:'ECSI',name:'Ethical Constraint Stability', score:89, type:'fit'},
      ],
      /* radar: person vs context requirement on 6 axes */
      radar:[
        {axis:'Decision Quality', person:82, required:80},
        {axis:'Self-Regulation', person:81, required:75},
        {axis:'Execution', person:84, required:70},
        {axis:'Influence', person:67, required:65},
        {axis:'Integrity', person:91, required:85},
        {axis:'Adaptability', person:60, required:55},
      ],
      contextStrengths:['Maintains discipline under regulatory load','Decisions stay evidence-based under deadline','Ethical boundaries hold under pressure'],
      contextRisks:['Lower comfort with weakly-structured, fast-changing mandates'],
    },

    interviewPrompts:[
      {dim:'Exploratory Openness', q:'Describe a time you had to abandon a familiar approach for an untested one. What made you change, and how did you manage the uncertainty?'},
      {dim:'Relationship Management', q:'Tell me about a stakeholder relationship you had to rebuild after a disagreement. What specifically did you do?'},
      {dim:'Decision Complexity', q:'Walk me through a high-stakes call you made with incomplete information during a reporting deadline.'},
    ],

    limitations:[
      'Domain 3 (Drivers & Motivation) and Domain 5 (Workplace Effectiveness) are deferred to Phase 2 and not measured in this report.',
      'Scores are confidence-gated; two dimensions carry Moderate confidence and should be weighted accordingly.',
      'Role-fit indicators are valid only against the validated Finance Manager v3 blueprint.',
    ],
    omitted:[
      {name:'Derailment Risk Index', reason:'Blocked entirely at V1 pending independent criterion-validity and ethics review.'},
      {name:'Values Alignment', reason:'Restricted to developmental use; suppressed in selection contexts.'},
      {name:'Percentile vs global norms', reason:'Global norm groups not yet established — Phase 2.'},
    ],
  };

  /* Comparison data — three candidates against Finance Manager v3 */
  NX.COMPARISON = {
    role:'Finance Manager', blueprint:'Finance Manager v3', context:'FinMgr · Regulated',
    dimensions:['Conscientious Execution','Integrity Orientation','Numerical Reasoning','Decision Complexity','Self-Regulation','Resilience'],
    candidates:[
      {name:'Amara Okonkwo', initials:'AO', cai:82, conf:'High', match:'Strong',
       scores:[84,91,88,79,81,68]},
      {name:'Caleb Stone', initials:'CS', cai:76, conf:'High', match:'Good',
       scores:[79,86,74,82,77,72]},
      {name:'Sofia Marquez', initials:'SM', cai:64, conf:'Moderate', match:'Conditional',
       scores:[71,73,69,66,70,61]},
    ]
  };

  window.NX = NX;
})();
