import { Layout } from "./components/layout";
import { Text, Section } from "@react-email/components";

interface AuthCodeProps {
  email: string;
  code: string;
}

export function AuthCode({ email, code }: AuthCodeProps) {
  return (
    <Layout title="Sign in to AskMyRoom">
      <Text style={heading}>Sign in to AskMyRoom</Text>

      <Text style={text}>
        Enter this code to complete your sign in:
      </Text>

      <Section style={codeContainer}>
        <Text style={codeText}>{code}</Text>
      </Section>

      <Text style={text}>
        This code expires in 10 minutes.
      </Text>

      <Text style={smallText}>
        If you didn't request this code, you can safely ignore this email.
      </Text>
    </Layout>
  );
}

export default AuthCode;

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

const codeContainer = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const codeText = {
  fontSize: "32px",
  fontWeight: "600",
  color: "#09090b",
  letterSpacing: "0.1em",
  margin: "0",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
};

const smallText = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "0",
};