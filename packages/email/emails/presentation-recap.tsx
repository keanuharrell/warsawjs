import { Layout } from "./components/layout";
import { Text, Button, Section, Hr, Link } from "@react-email/components";

interface PresentationRecapProps {
  recipientEmail: string;
  presentationDate: string;
}

export function PresentationRecap({
  recipientEmail,
  presentationDate
}: PresentationRecapProps) {
  return (
    <Layout title="WarsawJS × SST - Presentation Recap">
      <Text style={greeting}>Hi there! 👋</Text>

      <Text style={text}>
        Thanks for attending the <strong>WarsawJS × SST</strong> presentation on {presentationDate}!
        We hope you enjoyed exploring real-time serverless applications with AWS IoT Core,
        DynamoDB, and SST.
      </Text>

      <Text style={text}>
        Here's everything you need to dive deeper into what we built together:
      </Text>

      {/* Main Demo Section */}
      <Section style={highlightBox}>
        <Text style={sectionTitle}>🚀 Demo Application</Text>
        <Text style={text}>
          The live demo showcased real-time chat, voting, and email collection -
          all powered by AWS serverless technologies.
        </Text>
        <Section style={buttonContainer}>
          <Button href="https://github.com/keanuharrell/warsawjs" style={primaryButton}>
            View Source Code on GitHub
          </Button>
        </Section>
      </Section>

      <Hr style={divider} />

      {/* Technologies Section */}
      <Text style={sectionTitle}>🛠️ Technologies Used</Text>

      <Section style={techSection}>
        <Text style={techCategory}>Frontend & UI</Text>
        <Text style={techItem}>• <strong>Next.js 15</strong> - React framework with App Router</Text>
        <Text style={techItem}>• <strong>Tailwind CSS</strong> - Utility-first styling</Text>
        <Text style={techItem}>• <strong>shadcn/ui</strong> - Beautiful component library</Text>
        <Text style={techItem}>• <strong>Slidev</strong> - Markdown-based presentation slides</Text>
      </Section>

      <Section style={techSection}>
        <Text style={techCategory}>Real-time & Backend</Text>
        <Text style={techItem}>• <strong>AWS IoT Core</strong> - MQTT real-time messaging</Text>
        <Text style={techItem}>• <strong>DynamoDB</strong> - NoSQL database with ElectroDB</Text>
        <Text style={techItem}>• <strong>AWS SES</strong> - Email delivery service</Text>
        <Text style={techItem}>• <strong>AWS Cognito</strong> - Authentication via OpenAuth</Text>
      </Section>

      <Section style={techSection}>
        <Text style={techCategory}>Infrastructure & DevOps</Text>
        <Text style={techItem}>• <strong>SST</strong> - Infrastructure as Code</Text>
        <Text style={techItem}>• <strong>AWS Lambda</strong> - Serverless functions</Text>
        <Text style={techItem}>• <strong>Bun</strong> - Fast JavaScript runtime</Text>
        <Text style={techItem}>• <strong>TypeScript</strong> - Type-safe development</Text>
      </Section>

      <Hr style={divider} />

      {/* Key Features Section */}
      <Text style={sectionTitle}>✨ Key Features Demonstrated</Text>

      <Section style={featureBox}>
        <Text style={featureTitle}>💬 Real-time Chat</Text>
        <Text style={featureDesc}>
          Live messaging using MQTT over WebSockets with AWS IoT Core.
          Messages persist in DynamoDB and sync across all connected clients instantly.
        </Text>
      </Section>

      <Section style={featureBox}>
        <Text style={featureTitle}>🗳️ Live Voting</Text>
        <Text style={featureDesc}>
          Interactive polls with real-time results visualization.
          Vote counts update live using MQTT pub/sub pattern with unique user tracking.
        </Text>
      </Section>

      <Section style={featureBox}>
        <Text style={featureTitle}>📧 Email Collection</Text>
        <Text style={featureDesc}>
          Serverless email capture and delivery using AWS SES with React Email templates.
          Beautiful, responsive emails sent automatically.
        </Text>
      </Section>

      <Section style={featureBox}>
        <Text style={featureTitle}>🔐 Three-Level Security</Text>
        <Text style={featureDesc}>
          Read-only, write, and admin tokens with JWT verification.
          MQTT authorizer validates permissions using JWKS from OpenAuth.
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Resources Section */}
      <Text style={sectionTitle}>📚 Learning Resources</Text>

      <Section style={resourceSection}>
        <Text style={resourceCategory}>SST Documentation</Text>
        <Text style={resourceItem}>
          • <Link href="https://sst.dev" style={link}>SST Official Docs</Link> - Complete SST guide
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://sst.dev/docs/start/aws/nextjs" style={link}>Next.js on SST</Link> - Deploy Next.js to AWS
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://sst.dev/docs/component/aws/realtime" style={link}>Realtime Component</Link> - AWS IoT Core MQTT
        </Text>
      </Section>

      <Section style={resourceSection}>
        <Text style={resourceCategory}>AWS Services</Text>
        <Text style={resourceItem}>
          • <Link href="https://docs.aws.amazon.com/iot/latest/developerguide/mqtt.html" style={link}>AWS IoT Core MQTT</Link> - MQTT protocol guide
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/" style={link}>DynamoDB Guide</Link> - NoSQL database concepts
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://electrodb.dev/" style={link}>ElectroDB</Link> - DynamoDB data modeling
        </Text>
      </Section>

      <Section style={resourceSection}>
        <Text style={resourceCategory}>Frontend & UI</Text>
        <Text style={resourceItem}>
          • <Link href="https://ui.shadcn.com/" style={link}>shadcn/ui</Link> - Component library
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://react.email/" style={link}>React Email</Link> - Email templates
        </Text>
        <Text style={resourceItem}>
          • <Link href="https://sli.dev/" style={link}>Slidev</Link> - Developer-friendly slides
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Getting Started Section */}
      <Text style={sectionTitle}>🏁 Get Started</Text>

      <Section style={codeBlock}>
        <Text style={codeTitle}>Clone and Run</Text>
        <Text style={code}>git clone https://github.com/keanuharrell/warsawjs.git</Text>
        <Text style={code}>cd warsawjs</Text>
        <Text style={code}>bun install</Text>
        <Text style={code}>sst dev</Text>
      </Section>

      <Text style={text}>
        The project includes a complete setup with all three applications (web, admin, slides)
        and infrastructure code. Check out the README for detailed setup instructions.
      </Text>

      <Hr style={divider} />

      {/* Community Section */}
      <Text style={sectionTitle}>🤝 Connect & Learn More</Text>

      <Section style={communityBox}>
        <Text style={text}>
          <strong>SST Community:</strong> Join the{" "}
          <Link href="https://discord.gg/sst" style={link}>SST Discord</Link>
          {" "}for help and discussions
        </Text>
        <Text style={text}>
          <strong>WarsawJS:</strong> Follow{" "}
          <Link href="https://warsawjs.com" style={link}>WarsawJS</Link>
          {" "}for future events
        </Text>
        <Text style={text}>
          <strong>GitHub:</strong> Star{" "}
          <Link href="https://github.com/sst/sst" style={link}>sst/sst</Link>
          {" "}on GitHub
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Closing */}
      <Text style={text}>
        Thank you for your interest in serverless and real-time applications!
        If you build something cool with SST, we'd love to hear about it.
      </Text>

      <Text style={signature}>
        Happy coding! 🚀<br />
        Keanu Harrell
      </Text>

      <Section style={buttonContainer}>
        <Button href="https://github.com/keanuharrell/warsawjs" style={primaryButton}>
          Explore the Demo Code
        </Button>
      </Section>
    </Layout>
  );
}

export default PresentationRecap;

// Styles
const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0 0 16px",
};

const text = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#09090b",
  margin: "24px 0 16px",
  letterSpacing: "-0.025em",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const highlightBox = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px",
};

const techSection = {
  margin: "0 0 20px",
};

const techCategory = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0369a1",
  margin: "0 0 8px",
};

const techItem = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "24px",
  margin: "4px 0",
  paddingLeft: "8px",
};

const featureBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 12px",
};

const featureTitle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0 0 8px",
};

const featureDesc = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "0",
};

const resourceSection = {
  margin: "0 0 20px",
};

const resourceCategory = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#7c3aed",
  margin: "0 0 8px",
};

const resourceItem = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "24px",
  margin: "4px 0",
  paddingLeft: "8px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const codeBlock = {
  backgroundColor: "#09090b",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
};

const codeTitle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#a1a1aa",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const code = {
  fontSize: "13px",
  color: "#22c55e",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
  lineHeight: "20px",
  margin: "4px 0",
};

const communityBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
};

const signature = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "24px",
  margin: "24px 0 16px",
  fontStyle: "italic" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const primaryButton = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};
