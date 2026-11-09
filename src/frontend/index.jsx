import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Text,
  Heading,
  Lozenge,
  Stack,
  Inline,
  SectionMessage,
  Spinner,
  Button,
  Box,
} from '@forge/react';
import { invoke } from '@forge/bridge';

const getBadgeAppearance = (level) => {
  switch (level) {
    case 'CRITICAL':
    case 'HIGH':
      return 'removed';
    case 'MEDIUM':
      return 'moved';
    default:
      return 'success';
  }
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalysis = async () => {
    setLoading(true);
    const result = await invoke('getIssueBlastRadius');
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <Inline space="space.100" alignBlock="center">
        <Spinner size="medium" />
        <Text>Scanning cross-product context (Jira, JSM Incidents, Confluence Specs)...</Text>
      </Inline>
    );
  }

  if (!data || data.error) {
    return (
      <SectionMessage appearance="warning" title="BlastRadius Analysis Unavailable">
        <Text>{data?.message || 'Could not retrieve context for this issue.'}</Text>
      </SectionMessage>
    );
  }

  return (
    <Stack space="space.200">
      <Inline spread="space-between" alignBlock="center">
        <Inline space="space.100" alignBlock="center">
          <Heading as="h3">Blast Radius Score: {data.riskScore}/100</Heading>
          <Lozenge appearance={getBadgeAppearance(data.riskLevel)} isBold>
            {data.riskLevel} RISK
          </Lozenge>
        </Inline>
        <Button appearance="subtle" onClick={loadAnalysis}>
          Refresh Radar
        </Button>
      </Inline>

      <SectionMessage
        appearance={data.riskScore >= 50 ? 'warning' : 'information'}
        title={
          data.riskScore >= 50
            ? 'Hold Merge: Cross-Team Dependencies or Past Incidents Found'
            : 'Ready to Ship with Confidence'
        }
      >
        <Stack space="space.050">
          {data.riskFactors.map((factor, idx) => (
            <Text key={idx}>• {factor}</Text>
          ))}
        </Stack>
      </SectionMessage>

      <Box>
        <Heading as="h4">1. Cross-Team Jira Dependencies ({data.linkedTickets.length})</Heading>
        {data.linkedTickets.length === 0 ? (
          <Text>No blocking or dependent downstream tickets linked.</Text>
        ) : (
          <Stack space="space.050">
            {data.linkedTickets.map((item, idx) => (
              <Text key={idx}>
                • [{item.key}] {item.summary} ({item.relation} — Status: {item.status})
              </Text>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Heading as="h4">2. Historical Bugs & JSM Incidents ({data.pastIncidents.length})</Heading>
        {data.pastIncidents.length === 0 ? (
          <Text>No prior incidents matched this component.</Text>
        ) : (
          <Stack space="space.050">
            {data.pastIncidents.map((inc, idx) => (
              <Text key={idx}>
                • [{inc.key}] {inc.summary} (Priority: {inc.priority}, Status: {inc.status})
              </Text>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Heading as="h4">3. Confluence Architecture & Runbooks ({data.confluenceDocs.length})</Heading>
        {data.confluenceDocs.length === 0 ? (
          <Text>⚠️ No matching architecture spec found. Ask BlastRadius Rovo Agent to generate one!</Text>
        ) : (
          <Stack space="space.050">
            {data.confluenceDocs.map((doc, idx) => (
              <Text key={idx}>• 📄 {doc.title} (Page ID: {doc.id})</Text>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
