import { designReady, designExport, emptyDesign, approachCriterion, type Design } from './planning-design';
export type Answer = { text: string; kind: 'fact' | 'assumption' | 'unknown'; confirmer: string };
export type Decision = { by: string; at: string; mission: string; goals: string; direction: string; questions: string; selection: string; risk: string };
export type Plan = { design?: Design; inherited?: Record<string,string>; version: 1; mode: 'full' | 'fast'; answers: Record<string, Answer>; confirmed: number[]; decisions: Record<number, Decision>; criteria: { name: string; weight: number; scores: number[] }[] };
export type Question = { id: string; label: string; example: string; required?: boolean };
export type Step = { title: string; formal: string; questions: Question[]; products: { title: string; fields: string[] }[] };
const q = (id: string, label: string, example: string, required = false): Question => ({ id, label, example, required });
const p = (title: string, ...fields: string[]) => ({ title, fields });
export const steps: Step[] = [
 { title: 'Before we begin', formal: 'Planning setup', questions: [
 q('purpose','What are we planning for?','An exercise, a real event, or a possible emergency.',true),
 q('leader','Who will make the final decisions?','A role such as county emergency manager or incident lead.',true),
 q('team','Who is on the planning team, and what does each organization do?','Public works maintains roads; fire provides rescue.'),
 q('familiarity','Is this familiar, or new and complicated?','Choose familiar; new or messy; or many organizations with different goals.'),
 q('timing','When must the plan be finished, and when does the event or response start?','Plan due Tuesday at noon; activity begins Thursday at 08:00. Include the time zone.'),
 ], products: [p('Planning team [Staff]','purpose','leader','team','timing')] },
 { title: 'Get started', formal: 'Receipt of Mission', questions: [
 q('request','Who gave you this task, and what did they ask for?','Paste the relevant directive, email, or request. Use unclassified information only.'),
 q('partners','Who else is already working on this?','Neighboring jurisdictions, partner agencies, or utilities.'),
 q('hours','How many hours are available before work must begin?','Enter a number such as 72. Use the same start point for planning and preparation.'),
 q('deadline','When must the people carrying out the plan receive it?','Tuesday at noon, with two days left for their preparation.'),
 q('prepare','What should teams begin preparing now?','Check vehicle availability; confirm a contact in each agency. Include an owner and a time.'),
 q('info','What information do you already have, and what do you still need?','Have: road map from public works. Need: updated bridge status from the county engineer.')
 ], products: [p('Planning timeline [Initial Timeline / Time Analysis]','timing','hours','deadline'),p('Heads-up message #1 [Warning Order 1 (WARNO)]','request','timing','team','prepare'),p('Starter information list [Receipt of Mission]','info','partners')] },
 { title: 'Understand the problem', formal: 'Mission Analysis', questions: [
 q('why','Why does the person who gave you this task want it done?','Keep critical services running and protect residents.'),
 q('area','What about the area and conditions matters?','Roads, key buildings, terrain, critical sites, and weather concerns. Include the source and date of confirmed information.'),
 q('hazard','What are we up against, and what is most likely?','A flood; use the latest forecast from the responsible agency. Do not guess the forecast.'),
 q('worst','What is the worst the hazard could reasonably do?','A documented worst-case scenario, or an assumption with someone assigned to confirm it.'),
 q('people','Who lives or works there, and what support might they need?','Language access, mobility support, or isolated communities. Do not enter personal information.'),
 q('resources','What people, equipment, supplies, and funds are available or short?','Two confirmed crews; vehicle availability still unknown.'),
 q('limits','What must we do, and what are we not allowed to do?','Budget limits, required permissions, laws, and policies. Identify who confirms authority.'),
 q('military','Does this plan involve military support to civilian authorities?','No; or yes, with legal or operations staff confirming legal status and the approval chain.'),
 q('risks','What could go wrong and harm people or the mission?','An access route could close. Include the possible harm and a way to reduce it.'),
 q('tasks','What tasks were requested, what else is necessary, and which tasks define success?','Separate told-to-do, necessary supporting, and essential tasks. Give each task an owner and time.'),
 q('problem','What is the gap between where things are and where they need to be?','Teams receive conflicting requests and need one agreed priority list.'),
 q('mission','Who will do what, when, where, and why?','County teams restore critical services within 72 hours in the north district to protect life.'),
 q('questions','What key questions must the decision-maker have answered?','Hazard: will the route flood? Our resources: when will the backup crew arrive?'),
 q('lessons','What earlier lessons should change our risks or assumptions?','A previous exercise found that backup radios had not been tested.')
 ], products: [p('Situation briefing [Mission Analysis Brief]','why','area','hazard','worst','people','resources','limits','military','tasks','problem','mission','questions','risks','lessons'),p('Our mission [Restated Mission Statement]','mission'),p("Decision-maker’s goals [Commander’s Intent]"),p("Decision-maker’s direction [Commander’s Planning Guidance]"),p('Key questions list [CCIRs]','questions'),p('Assumptions / unknowns / risks list [Mission Analysis]','risks'),p('Heads-up message #2 [WARNO 2]','mission','deadline','prepare')] },
 { title: 'Build options', formal: 'Course of Action Development', questions: [
 q('decisive','What is the single most important thing that must go right?','Keep the hospital powered.'),
 q('support','What else must happen to make that possible?','Deliver fuel and maintain an accessible route.'),
 q('optionA','Describe option A: who does what, where, when, why, and how?','Area teams: each team handles all needs in its area. Include phases, task owners, times, and a simple table or sketch description.'),
 q('optionB','Describe a genuinely different option B.','Function teams: each team handles one service across the whole area.'),
 q('optionC','Would a third option be useful?','A phased approach. Enter “Not needed” if two options are enough.'),
 q('alignment','Do all proposed options fit the approved approach and areas of work?','Check each option against the approved approach. A departure requires the decision-maker to reconsider the approach.'),
 q('screen','Does each option pass all five tests?','For each: can we do it; is the cost worth it; does it achieve the mission; is it different; is it complete? Record pass, fail, or unknown with reasons. Fix or exclude failed options.')
 ], products: [p('Options summary [COA Statements and Sketches]','decisive','support','optionA','optionB','optionC'),p('Option tests table [COA Screening Criteria]','screen')] },
 { title: 'Test the options', formal: 'COA Analysis / War Game', questions: [
 q('walk','Walk through each approved option: what do we do, what happens in response, and how do we adjust?','Use both the most likely and worst case. In Fast mode, test the worst case only. Label predicted reactions as assumptions.'),
 q('sync','Who does what, and when?','Team | phase or time | task | dependency. Include every team and an owner for each task.'),
 q('triggers','What information triggers a decision, and who decides?','Decision | trigger | key question | available choices | decision-maker.'),
 q('testedRisk','What new risks, resource gaps, and coordination gaps did the walk-through reveal?','For each risk: possible harm, control, responsible person, and remaining risk.'),
 q('strengths','What are each option’s strengths and weaknesses?','Option A is faster but depends on an unconfirmed resource. Explain the evidence behind each score.')
 ], products: [p('Walk-through notes [War-Game Results]','walk','strengths'),p('Who-does-what-when table [Synchronization Matrix]','sync'),p('Decision guide [Decision Support Matrix]','triggers'),p('Updated risk list [Risk Assessment]','testedRisk')] },
 { title: 'Compare the options', formal: 'COA Comparison', questions: [
 q('comparison','What explains the scores, and which weak assumptions could change the result?','A small difference in speed may disappear if the backup crew is unavailable.'),
 q('recommendation','Which option does the team recommend, and why?','Give two or three reasons and the main remaining risk. The decision-maker still decides.')
 ], products: [p('Scoring table [Decision Matrix]','comparison'),p('Recommendation [COA Comparison]','recommendation')] },
 { title: 'Decide', formal: 'COA Approval', questions: [
 q('briefing','What should the decision-maker hear before choosing?','Summarize the mission, options, scoring, recommendation, and key risks.'),
 q('earlyTasks','What preparation can teams start after the decision?','List early tasks with owners and times; keep them within confirmed authority.')
 ], products: [p('Decision briefing [COA Decision Brief]','mission','briefing','recommendation','testedRisk'),p('Decision record [COA Approval]'),p('Heads-up message #3 [WARNO 3]','earlyTasks','deadline')] },
 { title: 'Write the plan', formal: 'Orders Production, Dissemination, and Transition', questions: [
 q('situation','Summarize the situation, hazard, partners, and assumptions still in effect.','Use confirmed information from the earlier steps. Keep any remaining assumptions labeled.'),
 q('execution','How will teams carry out the chosen approach?','Phases, each team’s task and time, shared rules, decision triggers, risk controls, and reporting.'),
 q('sustainment','What supplies and support will teams need?','Transportation, fuel, food, medical support, and personnel. Name the provider and timing.'),
 q('command','Who leads, who takes over, and how will people communicate?','Lead role, alternate, coordination location, primary and backup communication methods. Avoid sensitive personal information.'),
 q('share','How will you share the plan, and will teams walk through it before starting?','Send through the approved channel by Tuesday; rehearse on Wednesday. Record who confirms understanding.'),
 q('quality','What final checks are complete, and what remains unresolved?','Mission has who/what/when/where/why; each task has an owner and time; authority is confirmed; military legal status and approvals are checked if applicable.')
 ], products: [p('Final plan [Operation Order (OPORD)]','situation','mission','execution','sustainment','command'),p('The situation [Paragraph 1: Situation]','situation'),p('Our mission [Paragraph 2: Mission]','mission'),p("How we’ll do it [Paragraph 3: Execution]",'execution'),p('Supplies and support [Paragraph 4: Sustainment]','sustainment'),p("Who’s in charge and how we communicate [Paragraph 5: Command and Signal]",'command'),p('Sharing and rehearsal [Dissemination / Confirmation Brief]','share','quality')] }
];
export const emptyPlan = (): Plan => ({design:emptyDesign(),version:1,mode:'full',answers:{},confirmed:[],decisions:{},criteria:[{name:'Safety',weight:1,scores:[0,0,0]},{name:'Speed',weight:1,scores:[0,0,0]},{name:'Simplicity',weight:1,scores:[0,0,0]}]});
export const value = (plan: Plan,id: string) => plan.answers[id]?.text.trim() || '';
export function questionsFor(plan: Plan,step: number) { return steps[step].questions.filter(q=> !(plan.mode==='fast' && q.id==='optionC') && !(q.id==='alignment' && plan.design?.choice!=='use')); }
export function invalidate(plan: Plan,step: number): Plan { return {...plan,confirmed:plan.confirmed.filter(s=>s<step),decisions:Object.fromEntries(Object.entries(plan.decisions).filter(([s])=>Number(s)<step))}; }
export function gateErrors(plan: Plan,step: number): string[] {
 const errors: string[]=[];
 if(step===0 && (!plan.design || plan.design.choice==='pending' || !plan.design.choiceBy.trim() || !plan.design.choiceAt)) errors.push('Record the decision-maker’s choice to use or skip the big-picture step, with name and date.');
 if(step>0 && !designReady(plan)) errors.push('Complete the big-picture review or record the decision-maker’s choice to skip it.');
 if(step===3 && plan.design?.choice==='use' && value(plan,'alignment')!=='Fits approved approach') errors.push('An option departs from the approved approach or has not been checked. Revisit the big picture with the decision-maker, or revise the option before continuing.');
 if(step>=4 && plan.design?.choice==='use' && !plan.criteria.some(c=>c.name===approachCriterion)) errors.push('Include the criterion: '+approachCriterion+'.');
 for(const q of questionsFor(plan,step)) {const a=plan.answers[q.id]; if(q.required && (!a?.text.trim() || a.kind!=='fact')) errors.push(`Confirm: ${q.label}`); if(a?.kind==='assumption' && !a.confirmer.trim()) errors.push(`Name who can confirm: ${q.label}`);}
 if([2,3,6].includes(step)) {const d=plan.decisions[step]; const fields=step===2?['mission','goals','direction','questions']:step===3?['selection','direction']:['selection','goals','risk','questions']; if(!d?.by.trim() || !d.at || fields.some(f=>!d[f as keyof Decision]?.trim())) errors.push('Record all decision-maker responses, their name or role, and the date before continuing.');}
 if(step===3 && !value(plan,'optionA')) errors.push('Describe at least one option.');
 if(step===3 && plan.mode==='full' && !value(plan,'optionB')) errors.push('Full mode requires at least two different options.');
 return errors;
}
export function canAccess(plan: Plan,step: number) {return (step===0 || designReady(plan)) && Array.from({length:step},(_,i)=>i).every(i=>plan.confirmed.includes(i) && gateErrors(plan,i).length===0);}
export function timeSplit(hours: string) {const n=Number(hours);return Number.isFinite(n)&&n>0?{planning:n/3,preparation:n*2/3}:null;}
export function optionCount(plan: Plan) {return value(plan,'optionC') && !/not needed/i.test(value(plan,'optionC')) && plan.mode==='full'?3:value(plan,'optionB') && !/not needed/i.test(value(plan,'optionB'))?2:1;}
export function totals(plan: Plan) {return Array.from({length:optionCount(plan)},(_,i)=>plan.criteria.reduce((s,c)=>s+c.weight*(c.scores[i]||0),0));}
const fieldLabel=(id:string)=>steps.flatMap(s=>s.questions).find(q=>q.id===id)?.label??id;
function answerText(plan: Plan,id: string) {const a=plan.answers[id];return !a?.text.trim()?`UNKNOWN: ${fieldLabel(id)}`:`${a.kind==='fact'?'TEAM INPUT':a.kind.toUpperCase()}: ${a.text}${a.kind==='assumption'?`\nConfirm with: ${a.confirmer||'UNASSIGNED'}`:''}`;}
export function productText(plan: Plan,step: number,title: string,fields: string[]) {
 const warning=plan.mode==='fast'?`FAST MODE: reduced analysis. Main risks: ${value(plan,'testedRisk')||value(plan,'risks')||'UNKNOWN — not yet recorded'}\n\n`:'';
 const a=Object.entries(plan.answers);
 const evidence=['FACTS / TEAM-REPORTED INPUTS',...a.filter(([,v])=>v.kind==='fact'&&v.text.trim()).map(([k,v])=>`${fieldLabel(k)} ${v.text}`),'ASSUMPTIONS',...a.filter(([,v])=>v.kind==='assumption').map(([,v])=>`ASSUMPTION: ${v.text}\nConfirm with: ${v.confirmer||'UNASSIGNED'}`),'UNKNOWNS',...steps.slice(0,step+1).flatMap(s=>s.questions).filter(q=>!value(plan,q.id)||plan.answers[q.id]?.kind==='unknown').map(q=>`${q.label} ${value(plan,q.id)||'Not recorded'}`)].join('\n\n');
 let body=fields.map(id=>answerText(plan,id)).join('\n\n');
 if(title.startsWith('Final plan')) body=steps[7].products.filter(p=>p.title.includes('Paragraph')).map(p=>p.title+'\n'+p.fields.map(id=>id==='mission'?(plan.decisions[2]?.mission||'UNKNOWN: approved mission'):answerText(plan,id)).join('\n')).join('\n\n');
 if(title.startsWith('Planning timeline')) {const t=timeSplit(value(plan,'hours'));body+=t?`\n\nPlanning team: at most ${t.planning.toFixed(1)} hours. Teams preparing: at least ${t.preparation.toFixed(1)} hours. Confirm against the actual deadline.`:'\n\nUNKNOWN: available hours; time allocation not calculated.';}
 if(step>0 && plan.design?.choice==='use') body+='\n\nBig-picture handoff [Army Design Methodology]:\nApproved problem: '+(plan.design.approved?plan.design.decision.problem:'DRAFT — review required')+'\nApproved approach: '+(plan.design.approved?plan.design.decision.approach:'DRAFT — review required')+'\nFirst direction: '+plan.design.decision.direction+'\nAreas of work: '+(plan.design.answers.work?.text||'UNKNOWN')+'\nRethink triggers: '+(plan.design.answers.triggers?.text||'UNKNOWN');
 const decision=plan.decisions[step===7?6:step];
 if(decision) body+='\n\nRecorded decision-maker input (verbatim; identity not independently verified):\n'+Object.entries(decision).map(([k,v])=>`${k}: ${v}`).join('\n');
 if(step===7) body+='\n\nApproved mission record:\n'+(plan.decisions[2]?.mission||'UNKNOWN: mission approval missing');
 if(title.startsWith('Scoring')) {body+='\n\n'+(plan.mode==='fast'&&optionCount(plan)===1?'Single option: scoring table skipped.':`Scores: 1 (least favorable) to 5 (most favorable); 0 means unscored.\nCriterion | Weight | ${['A','B','C'].slice(0,optionCount(plan)).join(' | ')}\n`+plan.criteria.map(c=>`${c.name} | ${c.weight} | ${c.scores.slice(0,optionCount(plan)).join(' | ')}`).join('\n')+`\nWeighted totals: ${totals(plan).join(' / ')}\n${plan.criteria.some(c=>c.scores.slice(0,optionCount(plan)).some(s=>s===0))?'INCOMPLETE: one or more options remain unscored.':'Scores inform the decision; they do not approve an option.'}`);}
 return `${warning}${title}\nSource: ${step===0?'Setup':`Step ${step} of 7: ${steps[step].title}`} [${steps[step].formal}]\nStatus: ${plan.confirmed.includes(step)?'Reviewed team draft':'UNREVIEWED DRAFT'} — not execution authorization.\n\n${body}\n\n${evidence}`;
}
export function exportPlan(plan:Plan) {return '# AFTERBURN — Plain-language planning\n\nProfile v1.1 · 16 Nov 2026 · Based on the supplied ADM + MDMP planning profile.\nTeam-authored draft; approvals are recorded statements, not authenticated signatures.\n\n'+designExport(plan)+'\n\n'+steps.flatMap((s,i)=>s.products.map(p=>'## '+productText(plan,i,p.title,p.fields))).join('\n\n---\n\n');}
export const glossary:Record<string,string>={ADM:'A method for understanding a complex situation and framing the right problem before detailed planning.', 'Environmental frame':'A description of who and what matters, how they connect, and what success looks like.', 'Operational approach':'The broad direction from today’s situation to success.', 'Lines of effort':'The main areas of work that together reach the end state.', 'Decisive point':'A key moment or place that gives a major advantage toward success.', Reframing:'Re-examining the problem when the situation changes.', MDMP:"The Army’s seven-step planning method.",Commander:'The person with final authority over the plan.',Staff:'The people who analyze the situation and draft products.',PIR:'Key questions about the hazard or threat.',FFIR:'Key questions about our own people and resources.',DSCA:'Military support to civil authorities during emergencies.',Constraint:'A rule that requires or forbids an action.', 'End state':"What the situation looks like when we are done.", 'Decision point':'A choice triggered by information that requires the decision-maker.', 'Synchronization matrix':'A grid of each team’s actions over time.', 'Decision matrix':'A side-by-side score of the options.', 'War game':'Testing an option step by step against what could happen.', WARNO:'An early notice so people can start preparing.',CCIR:'Information the decision-maker most needs to make decisions.',COA:'One way of accomplishing the mission.',OPORD:'The finished five-part plan.',Assumption:"Something believed true and necessary for planning, but not yet confirmed.",Risk:'A chance that something harms people, resources, or the mission.',AAR:'A structured look back at what happened and why.'};
