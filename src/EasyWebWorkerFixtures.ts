export const generatedId = (): string =>
  `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

/**
 * This function contains an offuscated version of the StaticEasyWebWorker internal auto invocable function,
 * this template is used to create dynamic workers from strings templates
 * PLEASE KEEP THIS FUNCTION UPDATED WITH THE LATEST VERSION OF THE StaticEasyWebWorker CLASS
 */
export const getWorkerTemplate = () => {
  const template = `(()=>{let e=new Map,t=new Map([["",()=>{throw"you didn't defined a message-callback, please assign a callback by calling IEasyWorkerInstance.onMessage"},],]),a=({messageId:t,payload:a,method:o})=>{let s=new Set,r="pending",n=(a,s)=>{let n=r,l=a.resolved?"resolved":a.rejected?"rejected":a.worker_cancelation?"canceled":r;if(!e.has(t)){let c=\`
%cMessage Not Found

%cMessage %c\${t} %cwas not found:

This means that the message was already resolved | rejected | canceled. To avoid this error, please make sure that you are not resolving | rejecting | canceling the same message twice. Also make sure that you are not reporting progress after the message was processed.

Remember each message can handle his one cancelation by adding a handler with the %cmessage.onCancel%c method. 

To now more about this method, please check the documentation at:
 %chttps://www.npmjs.com/package/easy-web-worker#ieasywebworkermessageipayload--null-iresult--void

%cTrying to process message:
\`;console.error(c,"color: darkorange; font-size: 12px; font-weight: bold;","color: black;","font-weight: bold;","font-weight: normal;","font-weight: bold;","font-weight: normal;","color: lightblue; font-size: 10px; font-weight: bold;","font-weight: bold; color: darkorange;",{messageId:t,status:{current:n,target:l},method:o,data:a});return}let{progress:d}=a;d||e.delete(t),parentPort?.postMessage({messageId:t,...a},s),r=l},l=(e,t)=>{n({resolved:{payload:void 0===e?[]:[e]}},t)},c=e=>{n({rejected:{reason:e}},[])},d=e=>{let t=[...s];t.forEach(t=>t(e)),n({worker_cancelation:{reason:e}},[])},i=(e,t,a)=>{n({progress:{percentage:e,payload:t}},a)},g=e=>(s.add(e),()=>s.delete(e));return{messageId:t,getStatus:()=>r,isPending:()=>"pending"===r,method:o,payload:a,resolve:l,reject:c,cancel:d,onCancel:g,reportProgress:i}},o=(...e)=>{let[a,o]=e,s="string"==typeof a;if(s){let r=a,n=o;t.set(r,n);return}let l=a;t.set("",l)},s=()=>{let t=[...e.values()];t.forEach(e=>e.reject(Error("worker closed"))),parentPort?.close()};return parentPort?.on("message",o=>{let{messageId:s,cancelation:r}=o;if(r){let{reason:n}=r,l=e.get(s);l.cancel(n);return}let{method:c,execution:d}=o,{payload:i}=d,g=a({method:c,messageId:s,payload:i});e.set(s,g);let h=t.get(c||"");h(g,o)}),{onMessage:o,close:s}})()`;

  return template;
};
