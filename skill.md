---
name: blastradius-premerge-context
description: Evaluate deployment blast radius, cross-team Jira blockers, JSM incidents, and Confluence architecture guardrails via the BlastRadius Atlassian MCP Server before merging a Pull Request.
---

# BlastRadius AI — Pre-Merge Context Skill

Use this skill whenever a developer asks whether a feature branch, Pull Request, or Jira ticket is safe to merge or deploy.

## Available MCP Tools (via `blastradius-mcp-server`)

1. **`analyze-blast-radius`**
   - **Input:** `issueKey` (string, e.g., `"PROJ-101"`)
   - **Purpose:** Retrieves real-time context across Jira linked issues, historical JSM incidents/bugs, and Confluence runbooks to compute a deterministic `riskScore` (0-100) and `riskLevel`.

2. **`publish-confluence-audit`**
   - **Input:** `issueKey` (string), `spaceId` (string), `summaryReport` (string)
   - **Purpose:** Publishes an immutable Pre-Merge Risk & Confidence Report page directly to the team's Confluence space.

## Agent Workflow Instructions

1. Extract the Jira Issue Key from the current git branch name (e.g., `feature/PROJ-101-payment-retry` -> `PROJ-101`) or commit message.
2. Call `analyze-blast-radius` with `issueKey`.
3. Inspect the returned `riskScore` and `riskFactors`:
   - If `riskLevel` is `CRITICAL` or `HIGH`, warn the developer immediately and list all blocking `linkedTickets` and `pastIncidents`.
   - Verify whether `confluenceDocs` is empty; if empty, offer to draft an architecture runbook and publish it via `publish-confluence-audit`.
4. Conclude with a clear **SHIP WITH CONFIDENCE** or **HOLD MERGE** verdict.
