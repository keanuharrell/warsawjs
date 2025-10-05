import { Layout } from "./components/layout";
import { Text, Button, Section } from "@react-email/components";

interface WelcomeProps {
  name: string;
  dashboardUrl: string;
}

export function Welcome({ name, dashboardUrl }: WelcomeProps) {
  return (
    <Layout title="Welcome to AskMyRoom">
      <Text style={heading}>Welcome to AskMyRoom</Text>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Your account is ready! You can now create interactive rooms for real-time Q&A sessions,
        polls, and audience feedback.
      </Text>

      <Section style={featuresContainer}>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Create rooms instantly with unique join codes
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Real-time questions and voting
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Live polls with instant results
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Audience feedback and ratings
        </Text>
        <Text style={featureItem}>
          <span style={checkmark}>✓</span> Moderation controls
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <Button href={dashboardUrl} style={button}>
          Create your first room
        </Button>
      </Section>

      <Text style={smallText}>
        Questions? Just reply to this email and we'll help you get started.
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