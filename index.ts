import { exit } from 'node:process';

import {
  error,
  getBooleanInput,
  getInput,
  group,
  info,
  setFailed,
  warning,
} from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

const required = { required: true };

(async () => {
  warning(
    `
yumemi-inc/reject-self-approval-action is abandoned since GitHub now officially supports preventing self reviews.
Please update your workflow to remove the action and turn on the prevention on your environments.
https://github.blog/changelog/2023-10-16-actions-prevent-self-reviews-for-secure-deployments-across-actions-environments/
`.trim(),
  );

  const token = getInput('token', required);
  const allowNoReviews = getBooleanInput('allow-no-reviews', required);

  const octokit = new Octokit({
    auth: token,
    request: fetch,
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

  if (
    !(allowNoReviews && reviews.length === 0) &&
    !approvals.some((a) => a.user.login !== context.actor)
  ) {
    setFailed('One or more approvals from others are required.');
    exit(1);
  }
})()
  .then()
  .catch((e) => {
    error(e);
    exit(1);
  });
