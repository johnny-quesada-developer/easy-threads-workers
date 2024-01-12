export const generatedId = (): string =>
  `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

/**
 * This function contains an offuscated version of the StaticEasyWebWorker internal auto invocable function,
 * this template is used to create dynamic workers from strings templates
 * PLEASE KEEP THIS FUNCTION UPDATED WITH THE LATEST VERSION OF THE StaticEasyWebWorker CLASS
 * [IMPORTANT] Avoid ";" at the end of the template
 */
export const getWorkerTemplate = () => {
  const template = `(()=>{let e=new Map,a=new Map([["",()=>{throw"you didn't define a message-callback, please assign a callback by calling IEasyWorkerInstance.onMessage"}],]),o=({messageId:a,payload:o,method:t})=>{let s=new Set,r="pending",n=(o,s)=>{let n=r,l=o.resolved?"resolved":o.rejected?"rejected":o.worker_cancelation?"canceled":r;if(!e.has(a)){let c="%cMessage Not Found%cMessage %c"+a+" %cwas not found: This means that the message was already resolved | rejected | canceled. To avoid this error, please make sure that you are not resolving | rejecting | canceling the same message twice. Also make sure that you are not reporting progress after the message was processed. Remember each message can handle his one cancelation by adding a handler with the %cmessage.onCancel%c method. To now more about this method, please check the documentation at: %chttps://www.npmjs.com/package/easy-web-worker#ieasywebworkermessageipayload--null-iresult--void %cTrying to process message:";console.error(c,"color: darkorange; font-size: 12px; font-weight: bold;","color: black;","font-weight: bold;","font-weight: normal;","font-weight: bold;","font-weight: normal;","color: lightblue; font-size: 10px; font-weight: bold;","font-weight: bold; color: darkorange;",{messageId:a,status:{current:n,target:l},method:t,data:o});return}let{progress:d}=o;d||e.delete(a),parentPort?.postMessage({messageId:a,...o},s),r=l};return{messageId:a,getStatus:()=>r,isPending:()=>"pending"===r,method:t,payload:o,resolve(e,a){n({resolved:{payload:void 0===e?[]:[e]}},a)},reject(e){n({rejected:{reason:e}},[])},cancel(e){[...s].forEach(a=>a(e)),n({worker_cancelation:{reason:e}},[])},onCancel:e=>(s.add(e),()=>s.delete(e)),reportProgress(e,a,o){n({progress:{percentage:e,payload:a}},o)}}},t=(...e)=>{let[o,t]=e;if("string"==typeof o){let s=o,r=t;a.set(s,r);return}let n=o;a.set("",n)},s=()=>{[...e.values()].forEach(e=>e.reject(Error("worker closed"))),parentPort?.close()};return parentPort?.on("message",t=>{let{messageId:s,cancelation:r}=t;if(r){let{reason:n}=r;e.get(s).cancel(n);return}let{method:l,execution:c}=t,{payload:d}=c,g=o({method:l,messageId:s,payload:d});e.set(s,g);a.get(l||"")(g,t)}),{onMessage:t,close:s}})()`;

  return template;
};
