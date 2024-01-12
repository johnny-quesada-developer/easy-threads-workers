import { Worker } from 'node:worker_threads';

import {
  EasyWebWorker,
  EasyWebWorkerBody,
  IWorkerConfig,
} from './EasyWebWorker';

export const createEasyWebWorker = <TPayload = null, TResult = void>(
  source:
    | EasyWebWorkerBody<TPayload, TResult>
    | EasyWebWorkerBody<TPayload, TResult>[]
    | string
    | URL
    | Worker
    | Worker[],
  config: Partial<IWorkerConfig> = {}
) => {
  return new EasyWebWorker(source, config);
};
