# BlastRadius AI — 2.5 Minute Video Demo Script
**Target Duration:** 2 minutes 30 seconds (150 seconds)  
**Style:** High-energy, crisp Principal SRE / Tech Lead walk-through  
**Audio:** Clear voiceover with subtle background tech beat  

---

### [0:00 - 0:25] ACT I: The "Friday 5 PM" Horror (The Problem)
- **Visual:** Split screen. Left: Git terminal with `git push origin main` and a pending Pull Request in Bitbucket/GitHub. Right: Jira board full of active sprint tickets and a P1 Incident alerting in Slack/PagerDuty.
- **Voiceover:**
  > "Every engineering team knows this dread: you merge a seemingly innocuous 3-line change on Friday afternoon, only to realize too late that it quietly broke the downstream billing service, violated an unwritten architecture policy buried in Confluence, and triggered an all-hands P1 incident.  
  > Pull Requests review code syntax and unit tests—but they are blind to organizational context: Jira dependencies, past outage history, and architecture guardrails.  
  > Meet **BlastRadius AI**—the Pre-Merge Context & Risk Radar built natively on Atlassian Forge, Rovo, and the Atlassian MCP."

---

### [0:25 - 1:05] ACT II: In-Jira Experience (UI Kit 2 Radar Panel)
- **Visual:** Screen shares a Jira ticket (`PROJ-101: Refactor Payment Retry Queue`). Zoom in on the right-hand panel showing the **BlastRadius AI Risk Radar**.
- **Actions:**
  - The badge highlights `HIGH RISK (72/100)`.
  - Mouse hovers over the 3 breakdown sections:
    1. **Cross-Team Jira Dependencies:** 2 blocking tickets in the Checkout and Fraud teams.
    2. **Historical JSM Incidents:** 2 previous post-mortems matching the payment retry module.
    3. **Confluence Architecture Docs:** Architecture spec detected.
- **Voiceover:**
  > "Directly inside Jira, the BlastRadius panel computes a real-time risk score before code merges.  
  > Instead of relying on tribal knowledge, it automatically surfaces cross-team dependencies, alerts if this exact module has caused past production incidents, and checks if an updated Confluence runbook exists.  
  > Developers get an instant verdict: Hold Merge or Ship with Confidence."

---

### [1:05 - 1:45] ACT III: Atlassian Rovo Agent & Reusable Actions
- **Visual:** Open Atlassian Rovo chat dialog / sidebar. 
- **Actions:**
  - Type in prompt: *"@BlastRadius Risk Advisor Analyze the deployment blast radius for PROJ-101 and publish a risk audit page in Confluence."*
  - The Rovo Agent responds dynamically:
    - Invokes `analyze-blast-radius` action.
    - Displays structured risk evaluation: Risk Score 72, High Risk, downstream blockers.
    - Prompts user to generate and publish an executive audit trail.
    - Invokes `publish-confluence-audit` action and returns the created Confluence Page URL.
- **Voiceover:**
  > "For AI-first teams, the **BlastRadius Rovo Agent** brings Principal SRE intelligence straight into your conversations.  
  > Powered by native Rovo Actions, it cross-references real-time graph data across Jira and Confluence. With a single conversational request, it calculates deployment risk, outlines a go/no-go checklist, and autonomously publishes an immutable pre-merge audit report into Confluence for compliance and peer review."

---

### [1:45 - 2:15] ACT IV: Atlassian MCP Server & Third-Party Agent IDEs
- **Visual:** Switch screen to Cursor / Claude Code / Gemini CLI. Open a feature branch in local terminal.
- **Actions:**
  - The developer asks Cursor/Claude: *"Can I safely merge this PR for PROJ-101?"*
  - The agent reads `skill.md`, invokes the `blastradius-mcp-server` via Atlassian MCP, calls `analyze-blast-radius`, and returns the risk breakdown directly in the terminal before `git push`.
- **Voiceover:**
  > "And because BlastRadius implements the new **Atlassian MCP specification** using the `rovo:mcp` module and an open-source `skill.md`, your developers don't even have to leave their IDE.  
  > Whether your team uses Cursor, Claude Code, or autonomous AI agents, BlastRadius exposes its reasoning tools universally across your developer toolchain."

---

### [2:15 - 2:30] ACT V: The Vision (Conclusion & Call to Action)
- **Visual:** Fast montage of the Jira Panel, Confluence Audit Page, Rovo Chat, and Atlassian Marketplace listing. Screen displays: **BlastRadius AI — Ship Faster, With Zero Surprises.**
- **Voiceover:**
  > "BlastRadius AI bridges the gap between code changes and cross-product organizational memory.  
  > Built natively on Forge, deployed across Jira, Confluence, and Rovo, and available today on the Atlassian Marketplace.  
  > Merge fearless. Ship with confidence."
