import { exit } from 'node:process';

import { error, getInput, group, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';

const getInputRequired = (name: string) =>
  getInput(name, {
    required: true,
  });

(async () => {
  const token = getInputRequired('token');

  const octokit = new Octokit({
    auth: token,
  });

  const response = await octokit.actions.getReviewsForRun({
    ...context.repo,
    run_id: context.runId,
  });

  const reviews = response.data;
  await group('Reviews', async () => {
    reviews.forEach((a) => {
      info(`@${a.user.login} ${a.state}: ${a.comment ?? '<none>'}`);
    });
  });

  const approvals = reviews.filter((a) => a.state === 'approved');
  await group('Approvals', async () => {
    approvals.forEach((a) => {
      info(`@${a.user.login} approved: ${a.comment ?? '<none>'}`);
    });
  });

  if (!approvals.some((a) => a.user.login !== context.actor)) {
    setFailed('One or more approvals from others are required.');
    exit(1);
  }
})()
  .then()
  .catch((e) => {
    error(e);
    exit(1);
  });
