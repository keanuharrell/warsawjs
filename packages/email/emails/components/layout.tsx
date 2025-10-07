import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title = "WarsawJS Live Demo" }: LayoutProps) {
  return (
    <Html>
      <Head>
        <title>{title}</title>
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={brandName}>WarsawJS × SST</Text>
            <Text style={tagline}>Live Real-time Demo</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} WarsawJS Demo · Powered by SST & AWS IoT Core
            </Text>
            <Text style={footerLinks}>
              <Link href="https://github.com/keanuharrell/warsawjs" style={link}>
                View on GitHub
              </Link>
              {" · "}
              <Link href="https://sst.dev" style={link}>
                Built with SST
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles - Clean, minimal, shadcn-inspired
const main = {
  backgroundColor: "#fafafa",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "0",
  maxWidth: "560px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
};

const header = {
  padding: "32px 40px 24px",
};

const brandName = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0",
  letterSpacing: "-0.025em",
};

const tagline = {
  fontSize: "12px",
  fontWeight: "400",
  color: "#6b7280",
  margin: "4px 0 0 0",
};

const content = {
  padding: "0 40px 32px",
};

const hr = {
  borderColor: "#e5e7eb",
  borderTop: "1px solid #e5e7eb",
  borderBottom: "none",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
};

const footerText = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const footerLinks = {
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0",
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
};