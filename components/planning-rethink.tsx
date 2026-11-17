"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Plan } from '@/lib/planning-profile';
import { planningStorageKey, validSaved } from '@/lib/planning-storage';
import { ReframeControl } from './planning-design';
import styles from './planning-guide.module.css';
export function PlanningRethink({phase}:{phase:'execute'|'review'}){
 const [plan,setPlan]=useState<Plan|null>(null),[error,setError]=useState('');const router=useRouter();
 useEffect(()=>{function read(){try{const raw=localStorage.getItem(planningStorageKey);const p:unknown=raw?JSON.parse(raw):null;setPlan(validSaved(p)?p:null);}catch{setError('The planning draft could not be read. Open the planning guide to check it.');}}read();window.addEventListener('storage',read);window.addEventListener('afterburn:planning-updated',read);return()=>{window.removeEventListener('storage',read);window.removeEventListener('afterburn:planning-updated',read);};},[]);
 if(!plan||plan.design?.choice!=='use')return error?<p>{error}</p>:null;
 function save(p:Plan){try{localStorage.setItem(planningStorageKey,JSON.stringify(p));setPlan(p);setError('');window.dispatchEvent(new Event('afterburn:planning-updated'));}catch{setError('The rethink decision could not be saved. Return to the planning guide and export your work.');throw Error('The rethink decision could not be saved.');}}
 return <section className={styles.guide}><p className={styles.eyebrow}>Your browser planning draft</p><h2>Is the big picture still accurate?</h2><p>Rethink triggers: {plan.design.answers.triggers?.text||'Not yet recorded'}</p><p>Report a trigger below when it occurs. This check uses your browser draft; it does not automatically monitor live events.</p>{phase==='review'&&<p><strong>Did we frame the right problem?</strong> Compare what happened with the approved approach and desired end state.</p>}<ReframeControl plan={plan} onChange={save} onRevisit={()=>router.push('/planning-guide?bigPicture=1')}/>{error&&<p role="alert">{error}</p>}</section>;
}
