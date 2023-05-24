# Reject Self Approval Action

> **Warning**  
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
