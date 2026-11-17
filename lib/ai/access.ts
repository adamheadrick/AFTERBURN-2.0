import { hasSupabaseConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import { allowedAnalysisUser, createAnalysisLimiter } from '@/lib/planning-analysis';
const claim=createAnalysisLimiter();
export function claimAiUser(user:{id:string;email?:string}){
 if(!allowedAnalysisUser(user.id,user.email,process.env.PLANNING_AI_ALLOWED_USERS))throw Error('AI is not enabled for this account. Ask the workspace owner for access.');
 if(!claim(user.id))throw Error('Please wait before requesting more AI work.');
}
export async function requireAiAccess(){
 if(!hasSupabaseConfig())throw Error('Workspace sign-in must be configured before AI is enabled.');
 const client=await createClient();const {data:{user},error}=await client.auth.getUser();
 if(error||!user)throw Error('Sign in before using AI.');
 claimAiUser(user);
}
