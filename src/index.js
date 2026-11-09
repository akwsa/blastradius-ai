import api, { route, storage } from '@forge/api';
import Resolver from '@forge/resolver';

const resolver = new Resolver();

async function computeContextAndRisk(issueKey) {
  // 1. Ambil detail Jira Issue
  const issueRes = await api.asApp().requestJira(
    route`/rest/api/3/issue/${issueKey}?fields=summary,priority,issuelinks,components,labels`
  );

  if (!issueRes.ok) {
    return {
      error: true,
      message: `Failed to fetch Jira issue ${issueKey} (Status: ${issueRes.status})`,
    };
  }

  const issueData = await issueRes.json();
  const summary = issueData.fields?.summary || '';
  const priority = issueData.fields?.priority?.name || 'Medium';
  const components = (issueData.fields?.components || []).map((c) => c.name);
  const labels = issueData.fields?.labels || [];

  // 2. Kumpulkan tiket yang terhubung (linked issues)
  const rawLinks = issueData.fields?.issuelinks || [];
  const linkedTickets = rawLinks
    .map((link) => {
      const linked = link.outwardIssue || link.inwardIssue;
      if (!linked) return null;
      return {
        key: linked.key,
        relation: link.type?.name || 'relates to',
        summary: linked.fields?.summary || '',
        status: linked.fields?.status?.name || 'Unknown',
      };
    })
    .filter(Boolean);

  // 3. Cari bug/insiden masa lalu yang relevan (misal berdasarkan komponen atau summary keyword)
  const searchKeyword = components[0] || labels[0] || summary.split(' ')[0] || 'core';
  let pastIncidents = [];
  try {
    const jql = `issuetype in (Bug, Incident) AND text ~ "${searchKeyword.replace(/"/g, '')}" ORDER BY created DESC`;
    const searchRes = await api.asApp().requestJira(
      route`/rest/api/3/search?jql=${jql}&maxResults=3&fields=summary,status,priority`
    );
    if (searchRes.ok) {
      const searchJson = await searchRes.json();
      pastIncidents = (searchJson.issues || []).map((i) => ({
        key: i.key,
        summary: i.fields?.summary,
        status: i.fields?.status?.name,
        priority: i.fields?.priority?.name,
      }));
    }
  } catch (err) {
    console.warn('Incident search fallback:', err);
  }

  // 4. Cari dokumentasi arsitektur / runbook terkait di Confluence
  let confluenceDocs = [];
  try {
    const cql = `type=page AND text ~ "${searchKeyword.replace(/"/g, '')}"`;
    const confRes = await api.asApp().requestConfluence(
      route`/wiki/rest/api/content/search?cql=${cql}&limit=3`
    );
    if (confRes.ok) {
      const confJson = await confRes.json();
      confluenceDocs = (confJson.results || []).map((doc) => ({
        id: doc.id,
        title: doc.title,
      }));
    }
  } catch (err) {
    console.warn('Confluence search fallback:', err);
  }

  // 5. Kalkulasi Skor Risiko (0 - 100)
  let riskScore = 20; // Baseline
  const riskFactors = [];

  if (priority === 'Highest' || priority === 'High') {
    riskScore += 25;
    riskFactors.push(`High priority ticket (${priority}) increases operational criticality.`);
  }

  if (linkedTickets.length > 0) {
    riskScore += Math.min(linkedTickets.length * 12, 30);
    riskFactors.push(`${linkedTickets.length} cross-team linked ticket(s) detected in blast radius.`);
  }

  if (pastIncidents.length > 0) {
    riskScore += Math.min(pastIncidents.length * 10, 25);
    riskFactors.push(`${pastIncidents.length} historical bug(s)/incident(s) matched module "${searchKeyword}".`);
  }

  if (confluenceDocs.length === 0) {
    riskScore += 15;
    riskFactors.push(`Missing Confluence architecture/runbook documentation for "${searchKeyword}".`);
  } else {
    riskFactors.push(`Verified ${confluenceDocs.length} Confluence architecture spec(s) available.`);
  }

  riskScore = Math.min(riskScore, 100);

  let riskLevel = 'LOW';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 35) riskLevel = 'MEDIUM';

  const resultPayload = {
    issueKey,
    summary,
    priority,
    components,
    labels,
    riskScore,
    riskLevel,
    riskFactors,
    linkedTickets,
    pastIncidents,
    confluenceDocs,
    analyzedAt: new Date().toISOString(),
  };

  // Simpan snapshot terakhir di Forge Storage untuk audit trail
  await storage.set(`audit:${issueKey}`, resultPayload);

  return resultPayload;
}

/**
 * Handler untuk Rovo Action & MCP: analyze-blast-radius
 */
export async function analyzeBlastRadius(payload) {
  const issueKey = payload?.issueKey || payload?.context?.jira?.issueKey;
  if (!issueKey) {
    return { error: true, message: 'Please provide a valid Jira issueKey (e.g., PROJ-101).' };
  }
  return await computeContextAndRisk(issueKey);
}

/**
 * Handler untuk Rovo Action & MCP: publish-confluence-audit
 */
export async function publishConfluenceAudit(payload) {
  const { issueKey, spaceId, summaryReport } = payload;

  const bodyData = {
    spaceId: String(spaceId),
    status: 'current',
    title: `[BlastRadius Audit] Pre-Merge Confidence Report: ${issueKey} (${new Date().toISOString().slice(0, 10)})`,
    body: {
      representation: 'storage',
      value: `
        <h2>BlastRadius AI — Pre-Merge Risk & Context Audit</h2>
        <p><strong>Audited Jira Issue:</strong> ${issueKey}</p>
        <p><strong>Generated Timestamp:</strong> ${new Date().toUTCString()}</p>
        <hr />
        <h3>Executive Risk Summary</h3>
        <p>${(summaryReport || 'Automated pre-merge check completed.').replace(/\n/g, '<br/>')}</p>
      `,
    },
  };

  const res = await api.asApp().requestConfluence(route`/wiki/api/v2/pages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  if (!res.ok) {
    const errText = await res.text();
    return {
      success: false,
      message: `Failed to create Confluence audit page: ${res.status} - ${errText}`,
    };
  }

  const pageJson = await res.json();
  return {
    success: true,
    pageId: pageJson.id,
    title: pageJson.title,
    message: `Successfully published Confluence Audit Report (Page ID: ${pageJson.id})`,
  };
}

/**
 * Resolver untuk Jira Issue Panel UI
 */
resolver.define('getIssueBlastRadius', async (req) => {
  const issueKey = req.context?.extension?.issue?.key;
  if (!issueKey) {
    return { error: true, message: 'No Jira issue context found.' };
  }
  return await computeContextAndRisk(issueKey);
});

export const uiHandler = resolver.getDefinitions();
