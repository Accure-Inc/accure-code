# Accure GitHub Action

A GitHub Action that integrates [Accure AI](https://accure.ai) directly into your GitHub workflow.

Mention `/accure` or `/kc` in your comment, and Accure will execute tasks within your GitHub Actions runner.

## Features

#### Explain an issue

Leave the following comment on a GitHub issue. Accure will read the entire thread, including all comments, and reply with a clear explanation.

```
/accure explain this issue
```

#### Fix an issue

Leave the following comment on a GitHub issue. Accure will create a new branch, implement the changes, and open a PR with the changes.

```
/accure fix this
```

#### Review PRs and make changes

Leave the following comment on a GitHub PR. Accure will implement the requested change and commit it to the same PR.

```
Delete the attachment from S3 when the note is removed /kc
```

#### Review specific code lines

Leave a comment directly on code lines in the PR's "Files" tab. Accure will automatically detect the file, line numbers, and diff context to provide precise responses.

```
[Comment on specific lines in Files tab]
/kc add error handling here
```

When commenting on specific lines, Accure receives:

- The exact file being reviewed
- The specific lines of code
- The surrounding diff context
- Line number information

This allows for more targeted requests without needing to specify file paths or line numbers manually.

## Installation

Run the following command in the terminal from your GitHub repo:

```bash
accure github install
```

This will walk you through installing the AccureConnect GitHub app, creating the workflow, and setting up secrets.

### Manual Setup

1. Install the AccureConnect GitHub app at https://github.com/apps/accureconnect. Make sure it is installed on the target repository.

2. Add the following workflow file to `.github/workflows/accure.yml` in your repo. Set the appropriate `model` and required API keys.

   ```yml
   name: accure

   on:
     issue_comment:
       types: [created]
     pull_request_review_comment:
       types: [created]

   jobs:
     accure:
       if: |
         contains(github.event.comment.body, '/kc') ||
         contains(github.event.comment.body, '/accure')
       runs-on: ubuntu-latest
       permissions:
         id-token: write
         contents: write
         pull-requests: write
         issues: write
       steps:
         - name: Checkout repository
           uses: actions/checkout@v6
           with:
             persist-credentials: false

         - name: Run Accure
           uses: Accure-Inc/accure-code/github@latest
           with:
             model: accure/claude-sonnet-4-20250514
             accure_api_key: ${{ secrets.ACCURECODE_API_KEY }}
             accure_org_id: ${{ secrets.ACCURECODE_ORG_ID }}
   ```

3. Store the API keys in secrets. In your organization or project **settings**, expand **Secrets and variables** on the left and select **Actions**. Add `ACCURECODE_API_KEY` and `ACCURECODE_ORG_ID`.

## Configuration

### Inputs

- `model` (required) - The AI model to use (e.g., `accure/claude-sonnet-4-20250514`)
- `accure_api_key` (optional) - Accure API key for gateway authentication
- `accure_org_id` (optional) - Accure organization ID
- `agent` (optional) - Agent to use. Must be a primary agent.
- `share` (optional) - Share the Accure session (defaults to true for public repos)
- `prompt` (optional) - Custom prompt to override the default prompt
- `mentions` (optional) - Comma-separated list of trigger phrases (defaults to `/accure,/kc`)
- `use_github_token` (optional) - Use GITHUB_TOKEN directly instead of Accure App token exchange (defaults to `false`)
- `oidc_base_url` (optional) - Base URL for OIDC token exchange API (defaults to `https://api.accurecode.ai`)

### Using Other Providers

You can also use other AI providers by setting their API keys:

```yml
- name: Run Accure
  uses: Accure-Inc/accure-code/github@latest
  with:
    model: anthropic/claude-sonnet-4-20250514
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Support

If you encounter issues or have feedback, please create an issue at https://github.com/Accure-Inc/accure-code/issues.

## Development

This directory contains the composite GitHub Action definition. The actual implementation is in the Accure CLI (`packages/opencode/src/cli/cmd/github.ts`).

To test locally, see the main [AGENTS.md](../AGENTS.md) for development instructions.
