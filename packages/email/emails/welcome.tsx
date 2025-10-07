import { Layout } from "./components/layout";
import { Text, Button, Section } from "@react-email/components";

interface WelcomeProps {
  name: string;
  dashboardUrl: string;
}

export function Welcome({ name, dashboardUrl }: WelcomeProps) {
  return (
    <Layout title="Welcome to WarsawJS Admin">
      <Text style={heading}>🎉 Welcome to WarsawJS Admin</Text>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Your admin access is ready! You can now control the live demo for your WarsawJS presentation.
      </Text>

      <Section style={featuresContainer}>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Real-time control of chat and voting features
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Live monitoring of participants and activity
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Instant demo reset capabilities
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> MQTT connection status monitoring
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Session statistics and export
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <Button href={dashboardUrl} style={button}>
          Open Admin Dashboard
        </Button>
      </Section>

      <Text style={smallText}>
        This admin panel is for your WarsawJS presentation. Keep the URL secure!
      </Text>
    </Layout>
  );
}

export default Welcome;

// Clean, minimal styles
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
  margin: "0 0 16px",
};

const featuresContainer = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "20px",
  margin: "24px 0",
};

const featureItem = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "20px",
  margin: "0 0 12px",
  display: "block",
};

const checkmark = {
  color: "#10b981",
  fontWeight: "600",
  marginRight: "8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
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

const smallText = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "0",
};