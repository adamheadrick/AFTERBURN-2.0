const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),path=require('node:path');
const compile=f=>ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
require.extensions['.ts']=(m,f)=>m._compile(compile(f),f);
const {emptyPlan}=require('../lib/planning-profile.ts');
const lib=require('../lib/planning-analysis.ts');
const {analysisContext,analysisRequestPlan,verifyAnalysis,allowedAnalysisUser,createAnalysisLimiter}=lib;
const plan=emptyPlan();plan.answers.purpose={text:'Practice coordination between public works and fire.',kind:'fact',confirmer:''};
const context=analysisContext(plan);
const report={summary:'Clarify the timing.',findings:[{kind:'gap',title:'Timing is not recorded',explanation:'Teams need a shared deadline.',suggestion:'Ask the planning lead for the deadline.',sources:[{id:'plan.timing',quote:'[not recorded]'}]}],questions:['When is the plan due?'],nextStep:'Confirm the deadline.'};
assert.deepEqual(verifyAnalysis(report,context.fields),report);
assert.throws(()=>verifyAnalysis({...report,findings:[{...report.findings[0],sources:[{id:'not-real',quote:'fake'}]}]},context.fields));
assert.throws(()=>verifyAnalysis({...report,findings:[{...report.findings[0],sources:[{id:'plan.purpose',quote:'invented evidence'}]}]},context.fields));
plan.design.history=[{at:'now',by:'private name',reason:'history',revisit:true,snapshot:'DO NOT SEND HISTORY'}];plan.design.choiceBy='private attribution';
const sanitized=analysisRequestPlan(plan);assert.equal(JSON.stringify(sanitized).includes('DO NOT SEND HISTORY'),false);assert.equal(sanitized.design.choiceBy,'');assert.equal(plan.design.history.length,1);
assert.equal(allowedAnalysisUser('user1','owner@test.invalid',' owner@test.invalid '),true);assert.equal(allowedAnalysisUser('user1','other@test.invalid','owner@test.invalid'),false);assert.equal(allowedAnalysisUser('user1',undefined,undefined),false);
const claim=createAnalysisLimiter();assert.equal(claim('a',1000),true);assert.equal(claim('a',2000),false);for(let i=1;i<20;i++)assert.equal(claim('a',1000+i*20000),true);assert.equal(claim('a',500000),false);assert.equal(claim('a',3601001),true);
let configured=false,user=null,providerCalls=0,providerReport=report;
class FakeOpenAI{constructor(){this.chat={completions:{create:async()=>{providerCalls++;return {model:'test-model',choices:[{finish_reason:'stop',message:{content:JSON.stringify(providerReport)}}]};}}};}}
function route(){const filename=path.resolve('app/api/planning-analysis/route.ts');const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const req=Module.createRequire(filename);m.require=(id)=>id==='openai'?FakeOpenAI:id==='@/lib/config'?{hasOpenAIConfig:()=>configured,hasSupabaseConfig:()=>configured}:id==='@/lib/supabase/server'?{createClient:async()=>({auth:{getUser:async()=>({data:{user},error:null})}})}:id==='@/lib/planning-analysis'?lib:id==='@/lib/planning-storage'?require('../lib/planning-storage.ts'):req(id);m._compile(compile(filename),filename);return m.exports;}
const post=(r,p=plan,origin='https://afterburn.test')=>r.POST(new Request('https://afterburn.test/api/planning-analysis',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify({plan:p})}));
(async()=>{process.env.PLANNING_AI_ALLOWED_USERS='owner@test.invalid';
let r=route();assert.equal((await (await r.GET()).json()).state,'setup_required');assert.equal((await post(r)).status,503);assert.equal(providerCalls,0);
configured=true;r=route();assert.equal((await post(r)).status,401);assert.equal(providerCalls,0);
user={id:'u1',email:'other@test.invalid'};assert.equal((await post(r)).status,403);assert.equal(providerCalls,0);
user={id:'u1',email:'owner@test.invalid'};assert.equal((await post(r,plan,'https://other.test')).status,403);assert.equal((await post(r,{})).status,400);assert.equal(providerCalls,0);
assert.equal((await post(r)).status,200);assert.equal(providerCalls,1);assert.equal((await post(r)).status,429);assert.equal(providerCalls,1);
r=route();providerReport={...report,findings:[{...report.findings[0],sources:[{id:'plan.timing',quote:'fabrication'}]}]};assert.equal((await post(r)).status,502);
assert.equal((await r.POST(new Request('https://afterburn.test/api/planning-analysis',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(100001)}))).status,413);
function moduleWith(file,overrides){const filename=path.resolve(file);const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const req=Module.createRequire(filename);m.require=id=>id in overrides?overrides[id]:req(id);m._compile(compile(filename),filename);return m.exports;}
const access=moduleWith('lib/ai/access.ts',{'@/lib/config':{hasSupabaseConfig:()=>configured},'@/lib/supabase/server':{createClient:async()=>({auth:{getUser:async()=>({data:{user},error:null})}})},'@/lib/planning-analysis':lib});
const generator=moduleWith('lib/ai/generate.ts',{'openai':FakeOpenAI,'@/lib/ai/access':access});
process.env.OPENAI_API_KEY='test-only-no-network';const before=providerCalls;
configured=false;await assert.rejects(()=>generator.generateText({system:'s',prompt:'p',fallback:'f'}));
configured=true;user=null;await assert.rejects(()=>generator.generateText({system:'s',prompt:'p',fallback:'f'}));
user={id:'outsider',email:'other@test.invalid'};await assert.rejects(()=>generator.generateText({system:'s',prompt:'p',fallback:'f'}));assert.equal(providerCalls,before);
user={id:'owner',email:'owner@test.invalid'};await generator.generateText({system:'s',prompt:'p',fallback:'f'});assert.equal(providerCalls,before+1);
console.log('AI checks passed: grounded citations, history exclusion, allowlist, throttling, setup/auth failures, valid response, invalid output, request limit. No live provider calls.');
})().catch(e=>{console.error(e);process.exitCode=1;});
