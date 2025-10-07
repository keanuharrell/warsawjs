import { Layout } from "./components/layout";
import { Text, Button, Section, Hr } from "@react-email/components";

interface DemoStartedProps {
  sessionId: string;
  publicUrl: string;
  adminUrl: string;
  timestamp: string;
}

export function DemoStarted({ sessionId, publicUrl, adminUrl, timestamp }: DemoStartedProps) {
  return (
    <Layout title="Demo Started - WarsawJS">
      <Text style={heading}>🎉 Demo Session Started!</Text>

      <Text style={text}>
        Your WarsawJS live demo session is now active and ready for your presentation.
      </Text>

      <Section style={infoContainer}>
        <Text style={infoLabel}>Session ID</Text>
        <Text style={infoValue}>{sessionId}</Text>

        <Hr style={divider} />

        <Text style={infoLabel}>Started at</Text>
        <Text style={infoValue}>{timestamp}</Text>
      </Section>

      <Text style={sectionTitle}>📱 Share with Your Audience</Text>
      <Section style={linkContainer}>
        <Text style={linkLabel}>Public Demo URL:</Text>
        <Text style={linkValue}>{publicUrl}</Text>
      </Section>

      <Section style={buttonContainer}>
        <Button href={publicUrl} style={publicButton}>
          View Public Demo
        </Button>
      </Section>

      <Hr style={sectionDivider} />

      <Text style={sectionTitle}>🎛️ Your Control Panel</Text>

      <Section style={buttonContainer}>
        <Button href={adminUrl} style={adminButton}>
          Open Admin Dashboard
        </Button>
      </Section>

      <Section style={tipsContainer}>
        <Text style={tipsTitle}>💡 Quick Tips:</Text>
        <Text style={tipItem}>• Use "Enable Chat" to activate the live chat feature</Text>
        <Text style={tipItem}>• Use "Enable Vote" to start the poll</Text>
        <Text style={tipItem}>• Monitor participant activity in real-time</Text>
        <Text style={tipItem}>• Use "Reset All" if you need to restart the demo</Text>
      </Section>

      <Text style={smallText}>
        Good luck with your presentation! 🚀
      </Text>
    </Layout>
  );
}

export default DemoStarted;

// Styles
const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0 0 24px",
  letterSpacing: "-0.025em",
};

const text = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#09090b",
  margin: "24px 0 12px",
};

const infoContainer = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "0 0 24px",
};

const infoLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const infoValue = {
  fontSize: "14px",
  color: "#09090b",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
  margin: "0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "12px 0",
};

const sectionDivider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const linkContainer = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "0 0 16px",
};

const linkLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#0369a1",
  margin: "0 0 4px",
};

const linkValue = {
  fontSize: "13px",
  color: "#0c4a6e",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
  wordBreak: "break-all" as const,
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "16px 0",
};

const publicButton = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const adminButton = {
  backgroundColor: "#09090b",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const tipsContainer = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "24px 0",
};

const tipsTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#92400e",
  margin: "0 0 8px",
};

const tipItem = {
  fontSize: "13px",
  color: "#78350f",
  lineHeight: "20px",
  margin: "4px 0",
};

const smallText = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "24px 0 0 0",
  textAlign: "center" as const,
};
