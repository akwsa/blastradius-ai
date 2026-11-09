# Devpost Submission Package: BlastRadius AI

## 1. Project Title
**BlastRadius AI — Pre-Merge Context & Risk Radar**

## 2. Tagline / Elevator Pitch
Deterministic pre-merge risk scoring across Jira dependencies, Confluence architecture guardrails, and JSM incident memory—powered by Atlassian Forge, Rovo Agents, and Atlassian MCP.

## 3. Targeted Tracks & Bonus Prizes
- **Primary Track:** Apps for Software Teams
- **Bonus Prize 1:** Best Agents (`rovo:agent` and `rovo:action`)
- **Bonus Prize 2:** Best app with Atlassian MCP (`rovo:mcp` + `skill.md`)
- **Bonus Prize 3:** Best Marketplace published app

---

## 4. Inspiration
Modern CI/CD pipelines are great at checking code syntax, linting, and running unit tests—yet production outages continue to happen because of **organizational blind spots**. A developer updates an API endpoint that looks clean in a Git diff, but nobody realized that three other teams in Jira had active blockers on that schema, the module caused a high-severity outage six months ago, and an unlinked Confluence runbook mandated special canary rollouts.

We asked: *What if every Pull Request and Jira issue had an automated Principal Site Reliability Engineer guarding it, synthesizing cross-product organizational memory across Jira, JSM, and Confluence before anything gets merged?*

That is why we built **BlastRadius AI**.

---

## 5. What it Does
BlastRadius AI serves as an omnipresent risk radar across three critical developer touchpoints:

1. **Jira Issue Panel (UI Kit 2):**
   - Renders a native, real-time risk radar inside any Jira ticket.
   - Computes a deterministic **Risk Score (0–100)** and categorizes it into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
   - Surfaces cross-team dependencies, historical bug/incident recurrences, and Confluence architectural documentation coverage.
   - Provides an actionable **"Hold Merge"** or **"Ready to Ship with Confidence"** verdict.

2. **Atlassian Rovo Agent (`rovo:agent` & `rovo:action`):**
   - The **BlastRadius Risk Advisor** agent can be invoked directly in Atlassian Rovo chat (`@BlastRadius Risk Advisor`).
   - Executes two custom actions:
     - `analyze-blast-radius`: Gathers live cross-product telemetry and calculates risk.
     - `publish-confluence-audit`: Autonomously drafts and publishes an immutable pre-deployment audit report page in Confluence.

3. **Universal Atlassian MCP Server (`rovo:mcp` + `skill.md`):**
   - Exposes BlastRadius capabilities via the Atlassian Model Context Protocol (MCP).
   - Bundles a standard `skill.md` allowing third-party AI agents (Cursor, Claude Code, Gemini CLI, Windsurf) to query Jira and Confluence risk context directly from the developer's local terminal before `git push`.

---

## 6. How We Built It
- **Atlassian Forge Platform:** Built using Forge UI Kit 2 (`@forge/react`) and `@forge/resolver` for secure, zero-infrastructure native hosting inside Atlassian Cloud.
- **Cross-Product Forge APIs (`@forge/api`):** Securely queries Jira REST API v3 (for issue fields, links, and JQL incident history), Confluence REST API v2 & CQL (for architecture specs and audit page generation), and Forge Storage for historical audit trail persistence.
- **Rovo Agent Architecture:** Configured via `manifest.yml` with custom system instructions, conversational starters, and action schemas conforming to Atlassian's latest Rovo specifications.
- **Model Context Protocol (MCP):** Configured via the `rovo:mcp` module, enabling secure, permission-scoped tool sharing to any MCP-compliant client.

---

## 7. Challenges We Overcame
- **Cross-Product Context Synthesis:** Reconciling heterogenous data formats across Jira issue links, JQL search results, and Confluence CQL queries into a normalized, low-latency risk score.
- **Safe Automated Documentation:** Designing the `publish-confluence-audit` action so that agents format structured HTML storage representations cleanly without risking overwrites.
- **MCP Tool Interoperability:** Structuring deterministic schemas in `skill.md` so that both Atlassian Rovo and external agent runtimes (Claude, Cursor) execute tools predictably with identical parameter validation.

---

## 8. Accomplishments We're Proud Of
- Created an end-to-end multi-product solution unifying Jira, JSM, Confluence, Rovo, and external developer IDEs into a single cohesive safety net.
- Zero external backend or third-party servers required—runs 100% within Atlassian's secure Forge runtime with zero egress data exposure.
- Fully qualified for all 3 Codegeist 2026 bonus prize categories simultaneously.

---

## 9. What We Learned
- The power of Atlassian Rovo when combined with Forge actions turns static ticket tracking into an active reasoning engine.
- MCP is the future of developer workflows: bringing enterprise Atlassian context directly to wherever developers write code is a game-changer for developer velocity and safety.

---

## 10. What's Next for BlastRadius AI
- Deeper integration with Bitbucket pull request automated check runs and merge gates.
- Machine-learned incident clustering based on git semantic diffs compared against historical Jira Service Management incidents.
- Automated Slack / Teams webhook notifications when a Critical Risk PR is opened.
