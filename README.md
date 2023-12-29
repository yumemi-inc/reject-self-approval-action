# Reject Self Approval Action

> [!WARNING]
> yumemi-inc/reject-self-approval-action is abandoned since GitHub now officially supports preventing self reviews.
> Please update your workflow to remove the action and turn on the prevention on your environments.
> 
> https://github.blog/changelog/2023-10-16-actions-prevent-self-reviews-for-secure-deployments-across-actions-environments/

> [!WARNING]
> This is not an official product of YUMEMI Inc.

Reject self approved deployments.


## Why?

We can enforce one or more review before running deployments. However the review can be bypassed by approving themselves.
Using this action, we can reject accidental deployments made by self approvals.


## Getting Started

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-22.04
    environment: production
    permissions:
      actions: read
      contents: read
    steps:
      - uses: actions/checkout@v3

      - uses: yumemi-inc/reject-self-approval-action@v1

      - run: terraform apply
```


## Advanced Usages

### Allow no reviews

To allow force deployments without any reviews, pass `true` to `allow-no-reviews` input:

```yaml
- uses: yumemi-inc/reject-self-approval-action@v1
  with:
    allow-no-reviews: true
```
