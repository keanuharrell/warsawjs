import { Layout } from "./components/layout";
import { Text, Section } from "@react-email/components";

interface SessionSummaryProps {
  hostName: string;
  roomTitle: string;
  duration: string;
  totalParticipants: number;
  totalQuestions: number;
  totalPollResponses: number;
  averageFeedback?: number;
  topQuestions?: Array<{ text: string; votes: number }>;
}

export function SessionSummary({
  hostName,
  roomTitle,
  duration,
  totalParticipants,
  totalQuestions,
  totalPollResponses,
  averageFeedback,
  topQuestions = []
}: SessionSummaryProps) {
  return (
    <Layout title="Session summary">
      <Text style={heading}>Session complete</Text>

      <Text style={text}>
        Hi {hostName},
      </Text>

      <Text style={text}>
        Your room "{roomTitle}" has ended. Here's your summary:
      </Text>

      <Section style={statsGrid}>
        <Section style={statCard}>
          <Text style={statValue}>{totalParticipants}</Text>
          <Text style={statLabel}>Participants</Text>
        </Section>
        <Section style={statCard}>
          <Text style={statValue}>{totalQuestions}</Text>
          <Text style={statLabel}>Questions</Text>
        </Section>
        <Section style={statCard}>
          <Text style={statValue}>{totalPollResponses}</Text>
          <Text style={statLabel}>Poll responses</Text>
        </Section>
        <Section style={statCard}>
          <Text style={statValue}>{averageFeedback ? averageFeedback.toFixed(1) : '—'}</Text>
          <Text style={statLabel}>Avg rating</Text>
        </Section>
      </Section>

      <Text style={durationText}>
        Session duration: {duration}
      </Text>

      {topQuestions.length > 0 && (
        <>
          <Text style={sectionTitle}>Top questions</Text>
          <Section style={questionsContainer}>
            {topQuestions.slice(0, 5).map((q, i) => (
              <Section key={i} style={questionItem}>
                <Text style={questionText}>
                  {q.text}
                </Text>
                <Text style={questionVotes}>
                  {q.votes} {q.votes === 1 ? 'vote' : 'votes'}
                </Text>
              </Section>
            ))}
          </Section>
        </>
      )}

      <Text style={smallText}>
        Thank you for using AskMyRoom!
      </Text>
    </Layout>
  );
}

export default SessionSummary;

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

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  margin: "24px 0",
};

const statCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px",
  textAlign: "center" as const,
};

const statValue = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#09090b",
  margin: "0 0 4px",
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const durationText = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#09090b",
  margin: "32px 0 16px",
};

const questionsContainer = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "4px",
  margin: "0 0 24px",
};

const questionItem = {
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  padding: "12px",
  margin: "4px",
};

const questionText = {
  fontSize: "14px",
  color: "#374151",
  margin: "0 0 4px",
  lineHeight: "20px",
};

const questionVotes = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0",
};

const smallText = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};