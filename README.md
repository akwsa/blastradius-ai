# BlastRadius AI — Pre-Merge Context & Risk Radar

> **Atlassian Codegeist 2026 Submission**  
> **Category:** Apps for Software Teams  
> **Bonus Prizes Targeted:**  
> - 🏆 Best Agents (`rovo:agent` and `rovo:action`)  
> - 🏆 Best app with Atlassian MCP (`rovo:mcp` + `skill.md`)  
> - 🏆 Best Marketplace published app  

BlastRadius AI is an omnipresent pre-merge safety net and risk radar built natively on Atlassian Forge, Atlassian Rovo, and the Atlassian Model Context Protocol (MCP).

---

## ⚡ Key Capabilities

1. **Jira Issue Risk Radar (UI Kit 2):**  
   Renders a real-time risk score (0-100) inside Jira tickets, surfacing cross-team linked blockers, historical JSM incident repetitions, and architecture spec coverage.
2. **BlastRadius Risk Advisor (Atlassian Rovo Agent):**  
   Conversational Principal SRE agent that runs pre-merge risk checks and automatically publishes immutable pre-deployment audit reports to Confluence.
3. **Universal Developer MCP Server (`rovo:mcp`):**  
   Exposes deterministic context analysis tools to third-party AI agents (Cursor, Claude Code, Gemini CLI, Windsurf) via an open-source `skill.md`.

---

## 📂 Repository Structure

```plaintext
blastradius-ai/
├── manifest.yml              # Forge manifest: Jira Issue Panel, Rovo Agent, Actions, MCP module
├── package.json              # Forge API, React UI Kit 2, Resolver dependencies
├── skill.md                  # Open-source agent skill specification for Atlassian MCP
├── PRIVACY.md                # Privacy policy (100% on-platform Forge storage, zero egress)
├── TERMS.md                  # Terms of service
├── DEMO_SCRIPT.md            # 2.5-minute video walkthrough script
├── DEVPOST_SUBMISSION.md     # Complete Devpost project submission package
└── src/
    ├── index.js              # Forge backend resolver, risk heuristics, JQL/CQL queries
    └── frontend/
        └── index.jsx         # Native Jira issue panel dashboard
```

---

## 🛠️ Installation & Local Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Deploy to Atlassian Cloud
forge deploy -e production

# 3. Install to your Jira & Confluence site
forge install -p Jira -s your-site.atlassian.net -e production
forge install -p Confluence -s your-site.atlassian.net -e production
```

---

## 📄 License & Privacy
- [Privacy Policy](PRIVACY.md)
- [Terms of Service](TERMS.md)
