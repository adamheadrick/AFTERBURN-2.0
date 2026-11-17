import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { NextResponse } from 'next/server';
import { hasOpenAIConfig, hasSupabaseConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import { validSaved } from '@/lib/planning-storage';
import { allowedAnalysisUser, analysisContext, analysisPrompt, analysisSchema, createAnalysisLimiter, verifyAnalysis } from '@/lib/planning-analysis';
export const maxDuration=60;
export const dynamic='force-dynamic';
const claim=createAnalysisLimiter();
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
function configured(){return hasOpenAIConfig()&&hasSupabaseConfig()&&!!process.env.PLANNING_AI_ALLOWED_USERS?.trim();}
export async function GET(){
 if(!configured())return json({state:'setup_required',message:'AI review is not activated for this workspace yet. Your draft stays in this browser.'});
 try{const db=await createClient();const {data:{user},error}=await db.auth.getUser();if(error||!user)return json({state:'sign_in',message:'Sign in to request an AI review.'});
 if(!allowedAnalysisUser(user.id,user.email,process.env.PLANNING_AI_ALLOWED_USERS))return json({state:'not_enabled',message:'AI review is not enabled for this account. Ask the workspace owner for access.'});
 return json({state:'ready',message:'AI review is available. Suggestions require your review.'});}catch{return json({state:'unavailable',message:'AI availability could not be checked. Try again later.'},503);}
}
export async function POST(request:Request){
 // Reject cross-site browser submissions. Authentication and allowlist checks remain authoritative.
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Open AFTERBURN directly to request a review.'},403);
 if(!configured())return json({error:'AI review needs workspace setup before it can run.',state:'setup_required'},503);
 try{
  const db=await createClient();const {data:{user},error}=await db.auth.getUser();if(error||!user)return json({error:'Sign in to request an AI review.',state:'sign_in'},401);
  if(!allowedAnalysisUser(user.id,user.email,process.env.PLANNING_AI_ALLOWED_USERS))return json({error:'AI review is not enabled for this account.'},403);
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Send a planning draft as JSON.'},415);
  const reader=request.body?.getReader();if(!reader)return json({error:'The planning draft is missing.'},400);
  let size=0;let raw='';const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>100000){await reader.cancel();return json({error:'This draft is too large to review at once. Shorten the planning text.'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  let input:unknown;try{input=JSON.parse(raw);}catch{return json({error:'The planning draft could not be read.'},400);}
  if(!input||typeof input!=='object'||!('plan'in input)||!validSaved(input.plan))return json({error:'The planning draft is incomplete or invalid.'},400);
  const context=analysisContext(input.plan);if(!context.fields.some(f=>f.id.startsWith('plan.')&&f.text!=='[not recorded]'))return json({error:'Add planning information before asking for analysis.'},400);
  if(!claim(user.id))return json({error:'Please wait before requesting another review. Reviews are limited to reduce duplicate usage.'},429);
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:45000,maxRetries:0});
  const response=await client.chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',store:false,max_tokens:4000,response_format:zodResponseFormat(analysisSchema,'planning_analysis'),messages:[{role:'system',content:analysisPrompt},{role:'user',content:JSON.stringify(context)}]});
  const choice=response.choices[0];if(choice?.message.refusal)return json({error:'The AI service could not review this material. Your draft is unchanged.'},422);
  if(choice?.finish_reason!=='stop'||!choice.message.content)return json({error:'The review did not finish. Your draft is unchanged; try again later.'},502);
  const analysis=verifyAnalysis(JSON.parse(choice.message.content),context.fields);
  return json({analysis,reviewedAt:new Date().toISOString(),model:response.model});
 }catch{return json({error:'AI review could not finish. Your draft is unchanged. Check the connection or try again later.'},502);}
}
