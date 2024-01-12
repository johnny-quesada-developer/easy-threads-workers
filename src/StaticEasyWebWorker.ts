import { parentPort } from 'node:worker_threads';

import {
  IEasyWebWorkerMessage,
  IEasyWorkerInstance,
  IMessageData,
} from './EasyWebWorker';

/**
 * Constructor for the StaticEasyWebWorker
 * @param onMessageCallback - callback to be called when a message is received
 * @param targetOrigin - the target origin to be used when sending messages
 * @returns an instance of the StaticEasyWebWorker
 * */
export const StaticEasyWebWorker = function <TPayload = null, TResult = void>(
  this: IEasyWorkerInstance,
  onMessageCallback?: (
    message: IEasyWebWorkerMessage<TPayload, TResult>,
    data: IMessageData<TPayload>
  ) => void
) {
  const { close, onMessage } = (() => {
    const workerMessages = new Map();

    /* This structure allows us to have multiple callbacks for the same worker */
    const workerCallbacks = new Map<
      string,
      (message: IEasyWebWorkerMessage, data: IMessageData) => void
    >([
      [
        '',
        () => {
          throw "you didn't defined a message-callback, please assign a callback by calling IEasyWorkerInstance.onMessage";
        },
      ],
    ]);

    const createMessage = ({
      messageId,
      payload,
      method,
    }): IEasyWebWorkerMessage => {
      const cancelCallbacks = new Set<(reason: unknown) => void>();
      let messageStatus = 'pending';

      const postMessage = (data, transfer) => {
        const currentMessageStatus = messageStatus;

        const targetMessageStatus = (() => {
          if (data.resolved) return 'resolved';
          if (data.rejected) return 'rejected';
          if (data.worker_cancelation) return 'canceled';

          return messageStatus;
        })();

        if (!workerMessages.has(messageId)) {
          const message =
            '\n%cMessage Not Found\n\n' +
            '%cMessage %c' +
            messageId +
            ' %cwas not found:\n\n' +
            'This means that the message was already resolved | rejected | canceled. To avoid this error, please make sure that you are not resolving | rejecting | canceling the same message twice. Also make sure that you are not reporting progress after the message was processed.\n\n' +
            'Remember each message can handle his one cancelation by adding a handler with the %cmessage.onCancel%c method.\n\n' +
            'To now more about this method, please check the documentation at:\n' +
            '%chttps://www.npmjs.com/package/easy-web-worker#ieasywebworkermessageipayload--null-iresult--void\n\n' +
            '%cTrying to process message:\n';

          console.error(
            message,
            'color: darkorange; font-size: 12px; font-weight: bold;',
            'color: black;',
            'font-weight: bold;',
            'font-weight: normal;',
            'font-weight: bold;',
            'font-weight: normal;',
            'color: lightblue; font-size: 10px; font-weight: bold;',
            'font-weight: bold; color: darkorange;',
            {
              messageId,
              status: {
                current: currentMessageStatus,
                target: targetMessageStatus,
              },
              method,
              data,
            }
          );

          return;
        }

        const { progress } = data;

        if (!progress) {
          /* If it's not a progress message means that the message is resolved | rejected | canceled */
          workerMessages.delete(messageId);
        }

        parentPort?.postMessage({ messageId, ...data }, transfer);

        messageStatus = targetMessageStatus;
      };

      const getStatus = () =>
        messageStatus as 'pending' | 'resolved' | 'rejected' | 'canceled';

      const isPending = () => messageStatus === 'pending';

      const resolve = ((result, transfer) => {
        postMessage(
          { resolved: { payload: result === undefined ? [] : [result] } },
          transfer
        );
      }) as IEasyWebWorkerMessage['resolve'];

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
        messageId,
        getStatus,
        isPending,
        method,
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
        method,
        messageId,
        payload,
      });

      workerMessages.set(messageId, message);

      const callback = workerCallbacks.get(method || '');

      callback(message, data);
    });

    return {
      onMessage,
      close,
    };
  })();

  this.close = close;
  this.onMessage = onMessage;

  if (onMessageCallback) {
    onMessage(onMessageCallback);
  }
} as unknown as new <TPayload = null, TResult = null>(
  onMessageCallback?: (
    message: IEasyWebWorkerMessage<TPayload, TResult>,
    data: IMessageData<TPayload>
  ) => void
) => IEasyWorkerInstance<TPayload, TResult>;

/**
 * This method is used to create a new instance of the easy static web worker
 */
export const createStaticEasyWebWorker = <TPayload = null, TResult = void>(
  onMessageCallback?: (
    message: IEasyWebWorkerMessage<TPayload, TResult>,
    data: IMessageData<TPayload>
  ) => void
) => {
  const worker = new StaticEasyWebWorker(onMessageCallback);

  return worker;
};
