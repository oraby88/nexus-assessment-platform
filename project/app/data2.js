/* ============================================================
   NEXUS — Questions, AI Discovery Script, Report Detail
   ============================================================ */
(function () {
  const NX = window.NX;

  /* ---------------- Real governed question bank (curated) ---------------- */
  NX.QUESTIONS = [
 {
  "id": "NEX-GMB-001",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Dependability",
  "format": "statement",
  "text": "I often struggle to keep my commitments when unexpected tasks come up.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": true,
  "meaning": "Measures reliability in honoring commitments despite workload changes.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-002",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Dependability",
  "format": "statement",
  "text": "I often need reminders to complete assigned tasks on time.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": true,
  "meaning": "Measures punctuality and dependability in task completion.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-003",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Follow-Through",
  "format": "statement",
  "text": "I frequently leave projects unfinished when they become difficult.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": true,
  "meaning": "Measures persistence in completing projects despite challenges.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-004",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Follow-Through",
  "format": "statement",
  "text": "I avoid leaving tasks unfinished at the end of the day.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": false,
  "meaning": "Measures tendency to close out work within the workday.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-005",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Organization",
  "format": "statement",
  "text": "I keep my work area and files systematically arranged for easy access.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": false,
  "meaning": "Measures organizational skills for workspace and document management.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-006",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Organization",
  "format": "statement",
  "text": "I plan my tasks in advance to prevent last-minute pressure.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": false,
  "meaning": "Measures proactive organization and planning to avoid urgency.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-009",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Self-Discipline",
  "format": "statement",
  "text": "I resist distractions and stay focused on work until it is done.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": false,
  "meaning": "Measures self-discipline in maintaining focus until task completion.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-010",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Self-Discipline",
  "format": "statement",
  "text": "I stick to my priorities even when others ask me to change plans.",
  "scale": "1-5 Agreement",
  "options": [],
  "keyed": "",
  "reverse": false,
  "meaning": "Measures ability to maintain discipline in prioritization under interruptions.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-007",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Conscientious Execution Overlay 1",
  "format": "paired_statement",
  "text": "Choose the statement that is more like you at work.",
  "scale": "forced_choice_binary",
  "options": [
   "I prefer to complete tasks thoroughly before moving on to new work.",
   "I prefer to balance completing tasks with adapting to new priorities as they arise."
  ],
  "keyed": "A_or_B",
  "reverse": false,
  "meaning": "Measures preference for thorough task completion versus flexible adaptation.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-008",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-CE",
  "dimName": "Conscientious Execution",
  "facet": "Conscientious Execution Overlay 2",
  "format": "paired_statement",
  "text": "Choose the statement that is more like you at work.",
  "scale": "forced_choice_binary",
  "options": [
   "I structure my day with strict time blocks to ensure productivity.",
   "I keep my schedule flexible to respond quickly to changes in workload."
  ],
  "keyed": "A_or_B",
  "reverse": false,
  "meaning": "Measures preference for structured time management versus flexibility.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-023",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-EO",
  "dimName": "Exploratory Openness",
  "facet": "Exploratory Openness Overlay 1",
  "format": "paired_statement",
  "text": "Choose the statement that is more like you at work.",
  "scale": "forced_choice_binary",
  "options": [
   "I prefer to quickly decide on tasks even if some details are unclear.",
   "I prefer to gather more information before making decisions when details are lacking."
  ],
  "keyed": "A_or_B",
  "reverse": false,
  "meaning": "Measures preference balance between quick action under ambiguity and cautious information gathering.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-024",
  "domain": "D1",
  "domainName": "Personality Architecture",
  "dim": "D1-EO",
  "dimName": "Exploratory Openness",
  "facet": "Exploratory Openness Overlay 2",
  "format": "paired_statement",
  "text": "Choose the statement that is more like you at work.",
  "scale": "forced_choice_binary",
  "options": [
   "I enjoy trying new learning methods even if it means adapting my usual approach.",
   "I prioritize using familiar methods to focus my learning efficiently."
  ],
  "keyed": "A_or_B",
  "reverse": false,
  "meaning": "Measures preference balance between exploratory learning and efficiency in learning approach.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-223",
  "domain": "D4",
  "domainName": "Interpersonal and Emotional Functioning",
  "dim": "D4-RC",
  "dimName": "Resilience Capacity",
  "facet": "Resilience Capacity Overlay 1",
  "format": "scenario_mcq",
  "text": "You receive critical feedback on a project you led that was not successful. What is the strongest response?",
  "scale": "sjt_single_best",
  "options": [
   "Listen carefully, acknowledge valid points, and plan improvements based on the feedback.",
   "Defend your decisions strongly to show confidence in your approach.",
   "Ignore the feedback and focus on your next task immediately.",
   "Discuss the feedback with colleagues to find out if others agree before responding.",
   "Request that your manager handle the feedback discussion to avoid conflict."
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures the ability to productively respond to negative feedback and setbacks.",
  "validation": "calibration,discriminant",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-236",
  "domain": "D4",
  "domainName": "Interpersonal and Emotional Functioning",
  "dim": "D4-RM",
  "dimName": "Relationship Management",
  "facet": "Relationship Management Overlay 1",
  "format": "scenario_mcq",
  "text": "A team member shares that they feel excluded from important decisions. How should you respond to best manage the relationship?",
  "scale": "sjt_single_best",
  "options": [
   "Acknowledge their feelings and involve them in upcoming discussions to rebuild trust.",
   "Explain that decisions are made by leadership and cannot include everyone.",
   "Suggest they improve communication skills to stay more informed.",
   "Ignore the comment to avoid escalating tensions.",
   "Offer to discuss their concerns privately but keep decisions unchanged."
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures ability to repair trust and manage inclusion-related conflict constructively.",
  "validation": "calibration,criterion",
  "jobLevel": "manager_plus"
 },
 {
  "id": "NEX-GMB-254",
  "domain": "D4",
  "domainName": "Interpersonal and Emotional Functioning",
  "dim": "D4-SO",
  "dimName": "Social Awareness",
  "facet": "Social Awareness Overlay 1",
  "format": "scenario_mcq",
  "text": "During a team meeting, two coworkers exchange brief glances and tense expressions after a proposal is made. What is the strongest way to respond?",
  "scale": "sjt_single_best",
  "options": [
   "Acknowledge the tension by inviting their input to understand any concerns.",
   "Ignore the nonverbal cues and proceed with the agenda to save time.",
   "Change the subject quickly to avoid conflict within the team.",
   "Privately ask one coworker later what the expression meant.",
   "Ask the entire team to vote on the proposal without discussion."
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures ability to recognize and respond appropriately to subtle social tensions during interactions.",
  "validation": "calibration,discriminant",
  "jobLevel": "manager_plus"
 },
 {
  "id": "NEX-GMB-274",
  "domain": "D4",
  "domainName": "Interpersonal and Emotional Functioning",
  "dim": "D4-TC",
  "dimName": "Team Collaboration Style",
  "facet": "Team Collaboration Style Overlay 1",
  "format": "scenario_mcq",
  "text": "During a team project, a colleague misses a deadline which puts the group behind schedule. What is the strongest response?",
  "scale": "sjt_single_best",
  "options": [
   "Discuss the issue privately with the colleague to understand the cause and offer help to get back on track.",
   "Publicly point out the missed deadline to ensure accountability is clear to everyone.",
   "Ignore the delay and focus on completing your own tasks.",
   "Take over the colleague&#8217;s tasks immediately without discussing the situation.",
   "Suggest the team reassign tasks by vote to handle the delay."
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures the ability to manage delays through constructive, private communication and support.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-075",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Analogical Logic",
  "format": "mcq_single",
  "text": "If the relationship between a compass and direction is like a clock to what?",
  "scale": "cognitive_mcq",
  "options": [
   "Time",
   "Weight",
   "Distance",
   "Speed",
   "Temperature"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures the ability to understand analogies involving functional relationships.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-076",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Analogical Logic",
  "format": "mcq_single",
  "text": "A key opens a lock in the same way a password does what?",
  "scale": "cognitive_mcq",
  "options": [
   "Unlock a device",
   "Lock a door",
   "Open a window",
   "Close a file",
   "Start a car"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures the capacity to reason by analogy with security functions.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-077",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Analogical Logic",
  "format": "mcq_single",
  "text": "Just as a painter uses colors, a writer uses what?",
  "scale": "cognitive_mcq",
  "options": [
   "Words",
   "Canvas",
   "Brush",
   "Ink",
   "Clay"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures understanding of analogous tools in creative work.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-078",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Matrix Logic",
  "format": "mcq_single",
  "text": "In a 3x3 matrix of shapes where each row increases the number of sides by one starting with triangle, square, which shape should complete the third row?",
  "scale": "cognitive_mcq",
  "options": [
   "Pentagon",
   "Hexagon",
   "Heptagon",
   "Square",
   "Circle"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures ability to identify numeric progression in shape properties.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-079",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Matrix Logic",
  "format": "mcq_single",
  "text": "If the first column in a matrix shows a small circle, second column a medium circle, what would logically be in the third column?",
  "scale": "cognitive_mcq",
  "options": [
   "Large circle",
   "Small square",
   "Medium triangle",
   "Large square",
   "Small triangle"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures recognition of size progression in visual patterns.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-080",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Matrix Logic",
  "format": "mcq_single",
  "text": "A matrix shows shapes rotating 90 degrees clockwise each step. What is the next shape orientation after three rotations?",
  "scale": "cognitive_mcq",
  "options": [
   "270 degrees clockwise",
   "0 degrees",
   "90 degrees counterclockwise",
   "180 degrees",
   "360 degrees"
  ],
  "keyed": "A",
  "reverse": false,
  "meaning": "Measures understanding of rotational sequence in matrix logic.",
  "validation": "calibration,criterion",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-386",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Analogical Logic",
  "format": "single_best_answer",
  "text": "Which option best reflects stronger abstract reasoning in a workplace task involving analogical logic?",
  "scale": "cognitive_mcq",
  "options": [
   "Act on the first superficially plausible option without checking the stated rule or constraint.",
   "Match the answer to the structure of the problem before deciding.",
   "Delay the choice until unrelated information becomes available.",
   "Choose the option that sounds most confident instead of most valid."
  ],
  "keyed": "B",
  "reverse": false,
  "meaning": "Adds precision-building cognitive coverage for Abstract Reasoning.",
  "validation": "calibration,remediation,precision",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-387",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Matrix Logic",
  "format": "single_best_answer",
  "text": "In a job-relevant problem about matrix logic, which response shows better abstract reasoning?",
  "scale": "cognitive_mcq",
  "options": [
   "Act on the first superficially plausible option without checking the stated rule or constraint.",
   "Match the answer to the structure of the problem before deciding.",
   "Delay the choice until unrelated information becomes available.",
   "Choose the option that sounds most confident instead of most valid."
  ],
  "keyed": "B",
  "reverse": false,
  "meaning": "Adds precision-building cognitive coverage for Abstract Reasoning.",
  "validation": "calibration,remediation,precision",
  "jobLevel": "all_levels"
 },
 {
  "id": "NEX-GMB-388",
  "domain": "D2",
  "domainName": "Cognitive Architecture",
  "dim": "D2-AR",
  "dimName": "Abstract Reasoning",
  "facet": "Pattern Detection",
  "format": "single_best_answer",
  "text": "Which choice most directly demonstrates effective abstract reasoning under routine workplace constraints?",
  "scale": "cognitive_mcq",
  "options": [
   "Act on the first superficially plausible option without checking the stated rule or constraint.",
   "Match the answer to the structure of the problem before deciding.",
   "Delay the choice until unrelated information becomes available.",
   "Choose the option that sounds most confident instead of most valid."
  ],
  "keyed": "B",
  "reverse": false,
  "meaning": "Adds precision-building cognitive coverage for Abstract Reasoning.",
  "validation": "calibration,remediation,precision",
  "jobLevel": "all_levels"
 }
];

  /* Question type display meta */
  NX.QTYPES = {
    statement:        { label:'Likert Agreement',        tone:'#4F46E5', scale:['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'] },
    paired_statement: { label:'Forced Choice',           tone:'#0D9488', scale:[] },
    scenario_mcq:     { label:'Situational Judgement',   tone:'#C2820B', scale:[] },
    mcq_single:       { label:'Cognitive Reasoning',     tone:'#7C3AED', scale:[] },
    single_best_answer:{ label:'Cognitive — Best Answer', tone:'#0EA5E9', scale:[] }
  };
  NX.FREQ_SCALE = ['Never','Rarely','Sometimes','Often','Always'];

  /* ---------------- AI Discovery Chat script ---------------- */
  NX.AI_SCRIPT = [
    { from:'ai', section:'Role basics', why:'We anchor the assessment to a real role, not a generic title. Job family and level shape which governed dimensions are relevant.',
      text:"Let's design the right assessment together. To start — what's the **target job title**, and which department or job family does it sit in?",
      chips:['Finance Manager · Finance','Director of Operations · Operations','Customer Success Manager · People'] },
    { from:'ai', section:'Job level', why:'Job level changes the relevance weighting of dimensions and the difficulty band of cognitive items.',
      text:"Got it. What **job level** best describes this role?",
      chips:['Individual Contributor','Professional','Manager','Senior Manager','Director','Executive'] },
    { from:'ai', section:'Responsibilities', why:'Responsibilities tell us which behaviours the assessment must actually predict.',
      text:"Thanks. In a sentence or two, what are the **core responsibilities and daily tasks** that define success here?",
      chips:['Owns budget & forecasting','Leads a team of 6–10','Manages regulated reporting','Cross-functional delivery'] },
    { from:'ai', section:'Decision complexity', why:'Decision complexity drives the weighting of Cognitive (D2) dimensions and Domain 6 decision-influence indices.',
      text:"How would you describe the **decision-making complexity** — how ambiguous and high-stakes are the calls this person makes?",
      chips:['High stakes, low ambiguity','High stakes, high ambiguity','Moderate & structured','Mostly operational'] },
    { from:'ai', section:'Pressure & constraints', why:'Pressure and regulatory load feed the Context Profile and Domain 6 pressure-distortion and ethical-stability indices.',
      text:"What's the **work pressure and regulatory environment** like? Think deadlines, compliance, and the cost of getting it wrong.",
      chips:['Heavily regulated','High time pressure','Strict accuracy demands','Relatively flexible'] },
    { from:'ai', section:'Non-negotiables', why:'Non-negotiables become critical thresholds — dimensions where a low score blocks a positive role-fit indicator.',
      text:"Last one: are there any **non-negotiable requirements** — qualities this role simply cannot succeed without?",
      chips:['Unwavering integrity','Dependable follow-through','Composure under pressure','Sound judgement'] }
  ];

  /* The Job Requirements Profile that assembles as the chat progresses */
  NX.JOB_PROFILE = {
    role:'Finance Manager', level:'Manager', family:'Finance',
    responsibilities:['Budget ownership & forecasting','Regulated monthly reporting','Leads a team of 6','Partners with Operations & Risk'],
    skills:['Financial modelling','Regulatory reporting','Stakeholder communication','Team leadership'],
    behaviours:['Dependable follow-through','Composure under deadline','Evidence-based decisions','Integrity in ambiguity'],
    dimensions:[
      {name:'Conscientious Execution',domain:'D1',weight:'Critical'},
      {name:'Integrity Orientation',domain:'D1',weight:'Critical'},
      {name:'Decision Complexity',domain:'D2',weight:'High'},
      {name:'Numerical Reasoning',domain:'D2',weight:'High'},
      {name:'Self-Regulation',domain:'D4',weight:'High'},
      {name:'Emotional Steadiness',domain:'D1',weight:'Moderate'}
    ],
    context:['Regulated environment','High failure cost','Moderate ambiguity','Manager scope'],
    success:['Accurate, on-time regulated reporting','Calm, structured decisions under deadline','Reliable team delivery'],
    risks:['Errors under time pressure','Integrity lapses in ambiguity','Inconsistent follow-through'],
    nonNegotiables:['Integrity Orientation ≥ threshold','Conscientious Execution ≥ threshold'],
    focus:['Character & Work Style','Thinking & Problem Solving','Emotional Intelligence'],
    duration:'38–45 min'
  };

  /* ---------------- Selected & adapted questions (Step 7) ---------------- */
  NX.SELECTED_QUESTIONS = [
    { id:'NEX-GMB-006', original:'I plan my tasks in advance to prevent last-minute pressure.',
      adapted:'I plan reporting cycles well in advance so monthly close is never last-minute.',
      domain:'D1', dim:'Conscientious Execution', facet:'Organization', type:'Likert Agreement',
      requirement:'Dependable follow-through', relevance:'all_levels', scoring:'D1-CE · forward', gov:'Operational', val:'Calibrated', status:'approved' },
    { id:'NEX-GMB-010', original:'I stick to my priorities even when others ask me to change plans.',
      adapted:'I hold to reporting priorities even when stakeholders push competing requests.',
      domain:'D1', dim:'Conscientious Execution', facet:'Self-Discipline', type:'Likert Agreement',
      requirement:'Dependable follow-through', relevance:'all_levels', scoring:'D1-CE · forward', gov:'Operational', val:'Calibrated', status:'approved' },
    { id:'NEX-GMB-223', original:'You receive critical feedback on a project you led that was not successful. What is the strongest response?',
      adapted:'A regulated report you owned contained an error flagged by audit. What is the strongest response?',
      domain:'D4', dim:'Resilience Capacity', facet:'Resilience Overlay', type:'Situational Judgement',
      requirement:'Composure under pressure', relevance:'all_levels', scoring:'D4-RC · SJT keyed', gov:'Operational', val:'Calibrated', status:'review' },
    { id:'NEX-GMB-075', original:'If the relationship between a compass and direction is like a clock to what?',
      adapted:'If the relationship between a compass and direction is like a clock to what?',
      domain:'D2', dim:'Abstract Reasoning', facet:'Analogical Logic', type:'Cognitive Reasoning',
      requirement:'Decision complexity', relevance:'all_levels', scoring:'D2-AR · keyed A', gov:'Operational', val:'Calibrated', status:'approved' },
    { id:'NEX-GMB-007', original:'Choose the statement that is more like you at work.',
      adapted:'Choose the statement that is more like you when managing the close.',
      domain:'D1', dim:'Conscientious Execution', facet:'Overlay', type:'Forced Choice',
      requirement:'Dependable follow-through', relevance:'all_levels', scoring:'D1-CE · forced choice', gov:'Operational', val:'Calibrated', status:'approved' }
  ];

  window.NX = NX;
})();
