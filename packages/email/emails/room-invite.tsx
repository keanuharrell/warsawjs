import { Layout } from "./components/layout";
import { Text, Button, Section } from "@react-email/components";

interface RoomInviteProps {
  roomTitle: string;
  joinCode: string;
  joinUrl: string;
  hostName: string;
}

export function RoomInvite({ roomTitle, joinCode, joinUrl, hostName }: RoomInviteProps) {
  return (
    <Layout title={`Join ${roomTitle}`}>
      <Text style={heading}>You're invited to join a room</Text>

      <Text style={text}>
        {hostName} has invited you to join:
      </Text>

      <Section style={roomCard}>
        <Text style={roomTitleStyle}>{roomTitle}</Text>
        <Section style={codeSection}>
          <Text style={codeLabel}>Join code</Text>
          <Text style={codeText}>{joinCode}</Text>
        </Section>
      </Section>

      <Section style={buttonContainer}>
        <Button href={joinUrl} style={button}>
          Join room
        </Button>
      </Section>

      <Text style={smallText}>
        Or enter the code manually at askmyroom.dev
      </Text>
    </Layout>
  );
}

export default RoomInvite;

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
  margin: "0 0 24px",
};

const roomCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "24px",
  margin: "0 0 32px",
};

const roomTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0 0 16px",
};

const codeSection = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px",
  textAlign: "center" as const,
};

const codeLabel = {
  fontSize: "12px",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px",
};

const codeText = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#2563eb",
  letterSpacing: "0.05em",
  margin: "0",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0 24px",
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
  textAlign: "center" as const,
};