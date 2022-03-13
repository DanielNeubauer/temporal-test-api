import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});
const { fetchImage } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});
const { storeImage } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});
/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

export async function processWorkflow(imageUrl: string, name: string): Promise<string> {
  const image =  await fetchImage(imageUrl);
  return await storeImage(image, name);
}
