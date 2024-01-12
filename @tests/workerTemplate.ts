// backup of the worker template
import { parentPort } from 'worker_threads';

/**
 * This is the template of the worker, should be and string to avoid compilation issues
 */
const getWorkerTemplateBK = () => {
  const template = `const cw$ = () => {
    /* Keep track of the messages sent allowing us to cancel them */
    const workerMessages = new Map();

    /* This structure allows us to have multiple callbacks for the same worker */
    const workerCallbacks = new Map([
      [
        '',
        () => {
          throw "you didn't defined a message-callback, please assign a callback by calling IEasyWorkerInstance.onMessage";
        },
      ],
    ]);

    const createMessage = ({ messageId, payload }) => {
      const cancelCallbacks = new Set();

      const postMessage = (data, transfer) => {
        const { progress } = data;

        if (!progress) {
          /* If it's not a progress message means that the message is resolved | rejected | canceled */
          workerMessages.delete(messageId);
        }

        parentPort?.postMessage({ messageId, ...data }, transfer);
      };

      const resolve = (result, transfer) => {
        postMessage({ resolved: { payload: result } }, transfer);
      };

      const reject = (reason) => {
        postMessage({ rejected: { reason } }, []);
      };

      const cancel = (reason) => {
        const callbacks = [...cancelCallbacks];

        callbacks.forEach((callback) => callback(reason));

        postMessage({ worker_cancelation: { reason } }, []);
      };

      const reportProgress = (percentage, payload, transfer) => {
        postMessage({ progress: { percentage, payload } }, transfer);
      };

      /* Returns a function that can be used to unsubscribe from the cancelation */
      const onCancel = (callback) => {
        cancelCallbacks.add(callback);

        return () => cancelCallbacks.delete(callback);
      };

      return {
        payload,
        resolve,
        reject,
        cancel,
        onCancel,
        reportProgress,
      };
    };

    const onMessage = (...args) => {
      const [param1, param2] = args;
      const hasCustomCallbackKey = typeof param1 === 'string';

      if (hasCustomCallbackKey) {
        const callbackKey = param1;
        const callback = param2;

        workerCallbacks.set(callbackKey, callback);

        return;
      }

      const callback = param1;
      workerCallbacks.set('', callback);
    };

    const close = () => {
      /* should cancel all the promises of the main thread */
      const messages = [...workerMessages.values()];

      messages.forEach((message) => message.reject(new Error('worker closed')));

      parentPort?.close();
    };

    parentPort?.on('message', (data) => {
      const { messageId, cancelation } = data;

      if (cancelation) {
        const { reason } = cancelation;

        const message = workerMessages.get(messageId);

        message.cancel(reason);

        return;
      }

      const { method, execution } = data;
      const { payload } = execution;

      const message = createMessage({
        messageId,
        payload,
      });

      workerMessages.set(messageId, message);

      const callback = workerCallbacks.get(method || '');

      callback(message, data);
    });

    return {
      importScripts,
      onMessage,
      close,
    };
  };`;

  return template;
};

const workerTemplateResult = (self) => {
  const cw$ = () => {
    const a = new Map(),
      b = new Map([
        [
          '',
          () => {
            throw 'undefined message-callback';
          },
        ],
      ]);
    parentPort?.on('message', (d) => {
      const e = d.messageId || '',
        f =
          a.get(e) ||
          ((g, h) => {
            a.set(e, {
              resolve: (i) => g?.postMessage({ messageId: e, resolved: i }),
              reject: (j) => g?.postMessage({ messageId: e, rejected: j }),
              cancel: () => a.delete(e),
            });
            return a.get(e);
          })(parentPort, e);
      (d.cancel ? f.cancel : b.get(d.method || '') || (() => {}))(f, d);
    });
    return {
      close: () => {
        a.forEach((c) => c.reject('Worker closed'));
        parentPort?.close();
      },
      onMessage: (e, f) => b.set(e, f),
    };
  };
};

const OfuscateTemplateBK = () => {
  `const cw$ = () => { const a = new Map(), b = new Map([['', () => { throw "undefined message-callback" }]]); parentPort?.on('message', d => { const e = d.messageId || '', f = a.get(e) || ((g, h) => { a.set(e, { resolve: i => g.postMessage({ messageId: e, resolved: i }), reject: j => g.postMessage({ messageId: e, rejected: j }), cancel: () => a.delete(e) }); return a.get(e); })(parentPort, e); (d.cancel ? f.cancel : b.get(d.method || '') || (() => {}))(f, d); }); return { close: () => { a.forEach(c => c.reject('Worker closed')); parentPort?.close(); }, onMessage: (e, f) => b.set(e, f) }; };`;
};
