import { forwardRef } from "react";
import { Brain, Sparkles } from "lucide-react";

interface StoryCardProps {
  caseId: string;
  recipientPersona: string;
  manipulationScore: number;
  topMotive: string;
  language: "ar" | "en";
}

/**
 * Aesthetically pleasing 9:16 share image used by "Export to Story".
 * Off-screen rendered DOM that html-to-image converts to PNG.
 */
export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ caseId, recipientPersona, manipulationScore, topMotive, language }, ref) => {
    const isAr = language === "ar";
    return (
      <div
        ref={ref}
        dir={isAr ? "rtl" : "ltr"}
        style={{
          width: 1080,
          height: 1920,
          padding: 80,
          background:
            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(56,160,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 100%, rgba(180,90,255,0.18) 0%, transparent 60%), #0a0a14",
          color: "#f5f6fb",
          fontFamily: 'Cairo, "Geist", system-ui, sans-serif',
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "rgba(56,160,255,0.15)",
              border: "2px solid rgba(56,160,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={48} color="#5cb6ff" />
          </div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>
              PersonaPulse AI
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#9aa0b4",
                marginTop: 8,
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              CASE · {caseId}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
          <div
            style={{
              padding: 50,
              borderRadius: 40,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: "#9aa0b4",
                letterSpacing: 6,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              {isAr ? "شخصية المتلقي" : "Recipient Persona"}
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.25 }}>
              {recipientPersona}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: 40,
                borderRadius: 32,
                background: "rgba(255,107,107,0.08)",
                border: "1px solid rgba(255,107,107,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: "#ff9b9b",
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {isAr ? "مؤشر التلاعب" : "Manipulation"}
              </div>
              <div
                style={{ fontSize: 96, fontWeight: 900, color: "#ff6b6b", lineHeight: 1 }}
              >
                {manipulationScore}
                <span style={{ fontSize: 36, color: "#9aa0b4" }}>/100</span>
              </div>
            </div>

            <div
              style={{
                flex: 1.2,
                padding: 40,
                borderRadius: 32,
                background: "rgba(92,182,255,0.08)",
                border: "1px solid rgba(92,182,255,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: "#9bd0ff",
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {isAr ? "الدافع الرئيسي" : "Top Motive"}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}>
                {topMotive}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 30,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Sparkles size={24} color="#5cb6ff" />
            <span style={{ fontSize: 22, color: "#9aa0b4" }}>
              {isAr ? "حلّل محادثاتك بنفسك" : "Decode any conversation"}
            </span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#5cb6ff" }}>
            personapulse.ai
          </span>
        </div>
      </div>
    );
  },
);
StoryCard.displayName = "StoryCard";
