import express, { Request, Response, NextFunction } from 'express';
import { Worker } from '@temporalio/worker';
import * as activities from './temporal/activities';
import { Connection, WorkflowClient } from '@temporalio/client';
import { processWorkflow } from './temporal/workflows';
var uuid = require('uuid');

const app = express();
const port = 3000;
let worker: Worker;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

app.get('/worker/run', async (request: Request, response: Response, next: NextFunction) => {
  worker = await Worker.create({
    workflowsPath: require.resolve('./temporal/workflows'),
    activities,
    taskQueue: 'api',
  });
  worker.run();
  response.status(200).json('Workflow applied');
});
app.get('/worker/stop', async () => {
  worker.shutdown();
});
app.get('/workflow/start', async (request: Request, response: Response, next: NextFunction) => {
  const connection = new Connection({
    // // Connect to localhost with default ConnectionOptions.
    // // In production, pass options to the Connection constructor to configure TLS and other settings:
    // address: 'foo.bar.tmprl.cloud', // as provisioned
    // tls: {} // as provisioned
  });

  const client = new WorkflowClient(connection.service, {
    // namespace: 'default', // change if you have a different namespace
  });
  const imageUrl: string = request.query.imageUrl as string;
  const name: string = request.query.name as string;
  if(imageUrl === ''){
    return;
  }
  const handle = await client.start(processWorkflow, {
    args: [imageUrl, name], // type inference works! args: [name: string]
    taskQueue: 'api',
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: 'wf-id-' + uuid.v4(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  // console.log(await handle.result()); // Hello, Temporal!
  response.status(200).json('Workflow applied');
});
