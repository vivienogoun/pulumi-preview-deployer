_This is a submission for the [Pulumi Deploy and Document Challenge](https://dev.to/challenges/pulumi): Get Creative with Pulumi and GitHub_

## What I Built

I created **Pulumi Preview Environment Deployer**, a Node.js-based tool that automatically deploys preview environments to AWS S3 when a pull request is opened, and tears them down when the PR is closed. It uses **Pulumi's Automation API** and the **GitHub Provider** to provide an efficient and isolated testing environment for every PR.

## Live Demo Link

The deployed preview environments are tied to active pull requests and hosted on AWS S3. You can see a typical deployed preview site using a link like:

```
http://<unique-bucket>.s3-website-us-east-1.amazonaws.com
```

> _You can test it yourself by opening a PR on the repo and watching the magic happen!_

## Project Repo

[👉 GitHub Repository: pulumi-preview-deployer](https://github.com/vivienogoun/pulumi-preview-deployer)

Includes full source code, infra setup, and instructions in the README.

## My Journey

This project was both challenging and rewarding. I started by designing a simple static site deployment to AWS using Pulumi. I ran into issues with S3 public access settings (block public ACLs and policies), which required multiple iterations and research into the correct use of `BucketV2`, `BucketPublicAccessBlock`, and ownership settings.

The real fun began with integrating Pulumi’s Automation API. I learned how to manage stacks programmatically, respond to PR events in real time, and tie everything together using GitHub webhooks and an Express server.

What stood out most was how **flexible Pulumi is**, letting me script infrastructure logic just like any other application code.

## Using Pulumi with GitHub

I used:

- **Pulumi Automation API** (in Node.js) to deploy and destroy stacks on demand
- **Pulumi AWS provider** to deploy the static site to S3
- **GitHub Webhooks** to trigger Pulumi workflows on PR events

The ability to programmatically manage stacks and resources via code is a game-changer — I didn’t have to rely on GitHub Actions or manual `pulumi up/down` commands. It’s all automatic and runs locally during development.

I didn’t use Pulumi Copilot this time, but I’m excited to try it for future use cases.

<!-- Optional: Add a cover image or GIF demo here -->

Thanks for reading and big thanks to Pulumi + DEV for hosting this challenge 🚀
