export const generatedId = (): string =>
  `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

/**
 * This function contains an obfuscated version of the StaticEasyWebWorker internal auto invocable function, without comments or types
 * this template is used to create dynamic workers from strings templates
 * PLEASE KEEP THIS FUNCTION UPDATED WITH THE LATEST VERSION OF THE StaticEasyWebWorker CLASS
 * [IMPORTANT] Avoid ";" at the end of the template
 */
export const getWorkerTemplate = () => {
  const template = `(()=>{let e=new Map,t=new Map([["",()=>{throw"you didn't defined a message-callback, please assign a callback by calling IEasyWorkerInstance.onMessage"},],]),o=({messageId:t,payload:o,method:r})=>{let l=new Set,n="pending",a=(o,l)=>{let a=n,s=o.resolved?"resolved":o.rejected?"rejected":o.worker_cancelation?"canceled":n;if(!e.has(t)){let c="%c#"+t+" Message Not Found: %cThis means that the message was already resolved | rejected | canceled.";console.error(c,"color: darkorange; font-size: 12px; font-weight: bold;","font-weight: normal;","font-weight: bold;","font-weight: normal;","color: lightblue; font-size: 10px; font-weight: bold;","font-weight: bold; color: darkorange;",{messageId:t,status:{current:a,target:s},method:r,action:o});return}let{progress:d}=o;d||e.delete(t),parentPort?.postMessage({messageId:t,...o},l),n=s},s=(e,t)=>{a({resolved:{payload:void 0===e?[]:[e]}},t)},c=e=>{a({rejected:{reason:e}},[])},d=e=>{let t=[...l];t.forEach(t=>t(e)),a({worker_cancelation:{reason:e}},[])},g=(e,t,o)=>{a({progress:{percentage:e,payload:t}},o)},i=e=>(l.add(e),()=>l.delete(e));return{messageId:t,getStatus:()=>n,isPending:()=>"pending"===n,method:r,payload:o,resolve:s,reject:c,cancel:d,onCancel:i,reportProgress:g}},r=(...e)=>{let[o,r]=e,l="string"==typeof o;if(l){let n=o,a=r;t.set(n,a);return}let s=o;t.set("",s)},l=()=>{let t=[...e.values()];t.forEach(e=>e.reject(Error("worker closed"))),parentPort?.close()};return parentPort?.on("message",r=>{let{messageId:l,cancelation:n}=r;if(n){let{reason:a}=n,s=e.get(l);s.cancel(a);return}let{method:c,execution:d}=r,{payload:g}=d,i=o({method:c,messageId:l,payload:g});e.set(l,i);let f=t.get(c||"");f(i,r)}),{onMessage:r,close:l}})()`;

  return template;
};
