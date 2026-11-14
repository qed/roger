import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
// Layout and wording adapted from artifacts/Circles/design/Main.dc.html.
// Canvas runtime and sample data are intentionally not shipped.
import { CirclesPrice } from "./price";
import { CirclesAgents } from "./agents";
import { CirclesProof } from "./proof";

export function CirclesHero() {
  return (
    <section
      aria-labelledby="hero-title"
      style={{
        background: "var(--color-night)",
        color: "var(--color-night-ink)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding:
            "clamp(56px, 7vw, 112px) clamp(16px, 2vw, 24px) clamp(56px, 6vw, 88px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(48px, 5vw, 72px)",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 520px", minWidth: "0" }}>
          <h1
            id="hero-title"
            style={{
              margin: "0",
              fontSize: "clamp(42px, 6vw, 88px)",
              lineHeight: "1.0",
              letterSpacing: "-0.045em",
              fontWeight: "650",
            }}
          >
            {"Stop figuring out AI agents alone."}
          </h1>
          <p
            style={{
              margin: "32px 0 0",
              maxWidth: "34rem",
              fontSize: "clamp(19px, 1.6vw, 21px)",
              lineHeight: "1.45",
              letterSpacing: "-0.012em",
              color: "var(--color-night-ink)",
            }}
          >
            {
              "A Roger Circle is a confidential group of eight people who use AI agents heavily for work. Any agent: Claude, Grok Bot, Duet, Hark and more."
            }
          </p>
          <dl
            style={{
              margin: "24px 0 0",
              maxWidth: "34rem",
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr)",
              gap: "12px 24px",
              fontSize: "17px",
              lineHeight: "1.45",
            }}
          >
            <dt style={{ fontWeight: "620", color: "var(--color-night-ink)" }}>
              {"Sunday"}
            </dt>
            <dd style={{ margin: "0", color: "var(--color-night-ink-2)" }}>
              {"An agent called Zack collects everyone's best uses."}
            </dd>
            <dt style={{ fontWeight: "620", color: "var(--color-night-ink)" }}>
              {"Monday"}
            </dt>
            <dd style={{ margin: "0", color: "var(--color-night-ink-2)" }}>
              {"The Circle's best plays arrive ranked, with your own top 3."}
            </dd>
            <dt style={{ fontWeight: "620", color: "var(--color-night-ink)" }}>
              {"Tuesday"}
            </dt>
            <dd style={{ margin: "0", color: "var(--color-night-ink-2)" }}>
              {"You get better at using agents."}
            </dd>
          </dl>
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "16px 28px",
            }}
          >
            <Link
              href="/apply"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                background: "var(--color-accent)",
                color: "var(--color-surface)",
                textDecoration: "none",
                fontSize: "17px",
                fontWeight: "550",
              }}
            >
              {"Apply for a founding Circle"}
            </Link>
            <Link
              href="/zack"
              style={{
                color: "var(--color-accent-night)",
                textDecoration: "none",
                fontSize: "17px",
                fontWeight: "500",
              }}
            >
              {"Or run Zack on yourself first ›"}
            </Link>
          </div>
          <p
            style={{
              margin: "28px 0 0",
              fontSize: "13px",
              color: "var(--color-night-ink-2)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {"Three founding Circles · 24 seats"}
          </p>
        </div>
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            role="img"
            aria-label="The weekly cycle: Deploy on Tuesday, Use all week, Collect on Sunday, Share on Monday, then Deploy again"
            style={{
              position: "relative",
              width: "min(420px, 86vw)",
              aspectRatio: "1 / 1",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "15%",
                borderRadius: "50%",
                border: "1.5px solid var(--color-night-rule)",
              }}
            ></div>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="#a3a3aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "74.75%",
                top: "25.25%",
                width: "26px",
                height: "26px",
                transform: "translate(-50%, -50%) rotate(45deg)",
                background: "var(--color-night)",
                borderRadius: "50%",
              }}
            >
              <path d="M8 5l5 5-5 5"></path>
            </svg>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="#a3a3aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "74.75%",
                top: "74.75%",
                width: "26px",
                height: "26px",
                transform: "translate(-50%, -50%) rotate(135deg)",
                background: "var(--color-night)",
                borderRadius: "50%",
              }}
            >
              <path d="M8 5l5 5-5 5"></path>
            </svg>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="#a3a3aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "25.25%",
                top: "74.75%",
                width: "26px",
                height: "26px",
                transform: "translate(-50%, -50%) rotate(225deg)",
                background: "var(--color-night)",
                borderRadius: "50%",
              }}
            >
              <path d="M8 5l5 5-5 5"></path>
            </svg>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="#a3a3aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "25.25%",
                top: "25.25%",
                width: "26px",
                height: "26px",
                transform: "translate(-50%, -50%) rotate(315deg)",
                background: "var(--color-night)",
                borderRadius: "50%",
              }}
            >
              <path d="M8 5l5 5-5 5"></path>
            </svg>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "15%",
                width: "29%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "var(--color-night-2)",
                border: "1.5px solid var(--color-night-ink)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  fontWeight: "620",
                  letterSpacing: "-0.018em",
                }}
              >
                {"Deploy"}
              </span>
              <span
                style={{
                  marginTop: "2px",
                  fontSize: "13px",
                  color: "var(--color-night-ink-2)",
                }}
              >
                {"Tuesday"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: "85%",
                top: "50%",
                width: "29%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "var(--color-night-2)",
                border: "1.5px solid var(--color-night-ink)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  fontWeight: "620",
                  letterSpacing: "-0.018em",
                }}
              >
                {"Use"}
              </span>
              <span
                style={{
                  marginTop: "2px",
                  fontSize: "13px",
                  color: "var(--color-night-ink-2)",
                }}
              >
                {"All week"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "85%",
                width: "29%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "var(--color-night-2)",
                border: "1.5px solid var(--color-night-ink)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  fontWeight: "620",
                  letterSpacing: "-0.018em",
                }}
              >
                {"Collect"}
              </span>
              <span
                style={{
                  marginTop: "2px",
                  fontSize: "13px",
                  color: "var(--color-night-ink-2)",
                }}
              >
                {"Sunday"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: "15%",
                top: "50%",
                width: "29%",
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "var(--color-night-ink)",
                color: "var(--color-night)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  fontWeight: "620",
                  letterSpacing: "-0.018em",
                }}
              >
                {"Share"}
              </span>
              <span
                style={{
                  marginTop: "2px",
                  fontSize: "13px",
                  color: "var(--color-ink-2)",
                }}
              >
                {"Monday"}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                inset: "34%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--color-night-ink-2)",
                }}
              >
                {"Every week"}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "clamp(19px, 1.8vw, 24px)",
                  lineHeight: "1.15",
                  fontWeight: "640",
                  letterSpacing: "-0.025em",
                }}
              >
                {"Get better, get sharper"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <CirclesAgents></CirclesAgents>
    </section>
  );
}

export function CirclesWhy() {
  return (
    <section
      aria-labelledby="why-title"
      style={{ background: "var(--color-ground-2)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="why-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Why use a Roger Circle"}
        </h2>
        <div
          style={{
            marginTop: "56px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "40px 48px",
          }}
        >
          <div
            style={{
              borderTop: "1px solid var(--color-ink)",
              paddingTop: "24px",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {
                "Find out what are the most useful things people do with AI Agents"
              }
            </h3>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "The best uses involve clients and money, so they rarely get posted. In a Circle, seven peers show you theirs every week."
              }
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--color-ink)",
              paddingTop: "24px",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {"Get playbooks you can send directly to your agents"}
            </h3>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Every playbook opens with one instruction to your own agent: adapt this to my setup and install it, asking me questions as needed."
              }
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--color-ink)",
              paddingTop: "24px",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {"Get better at getting better, every week"}
            </h3>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Each Monday's list is ranked for the Circle, then re-ranked for you, so you always know the one thing to try next."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CirclesHow() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      style={{
        background: "var(--color-night)",
        color: "var(--color-night-ink)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(88px, 10vw, 136px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <h2
          id="how-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"How a Circle works"}
        </h2>
        <ol
          style={{
            margin: "56px 0 0",
            padding: "0",
            listStyle: "none",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
            gap: "40px 32px",
          }}
        >
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-night-rule)",
              }}
            >
              {"1"}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Join seven other trusted professionals."}
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-night-ink-2)",
              }}
            >
              {
                "We group Circles by diverse use cases, not by agent, so you get fresh ideas for your AI agents every week."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-night-rule)",
              }}
            >
              {"2"}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Add Zack to your account."}
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-night-ink-2)",
              }}
            >
              {
                "He lives in your account and reads your week of agent activity."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-night-rule)",
              }}
            >
              {"3"}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Sunday: Zack writes up your best plays."}
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-night-ink-2)",
              }}
            >
              {
                "Each one becomes a playbook, with client details and sensitive information removed."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-night-rule)",
              }}
            >
              {"4"}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Monday: Cora ranks the Circle's plays."}
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-night-ink-2)",
              }}
            >
              {
                "Stack ranked by usefulness, ready to install. Your own top 3 are picked for the work you do."
              }
            </p>
          </li>
        </ol>
        <div
          role="img"
          aria-label="Eight members each send a Zack run. Cora merges and scores the plays. One list comes out in three tiers, plus your own top 3."
          style={{
            marginTop: "72px",
            background: "var(--color-night-2)",
            borderRadius: "8px",
            padding: "clamp(24px, 4vw, 48px)",
            boxSizing: "border-box",
            display: "flex",
            flexWrap: "wrap",
            gap: "32px 40px",
            alignItems: "stretch",
          }}
        >
          <div style={{ flex: "1 1 220px", minWidth: "0" }}>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-night-ink-2)",
              }}
            >
              {"Sunday · eight runs in"}
            </p>
            <div
              style={{
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "14px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    maxWidth: "40px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-night-ink)",
                    boxSizing: "border-box",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "44px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "var(--color-night-rule)",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: "1 1 200px",
              minWidth: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1.5px solid var(--color-night-ink)",
              borderRadius: "8px",
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-night-ink-2)",
              }}
            >
              {"Monday, 1:00 AM"}
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "28px",
                lineHeight: "1.1",
                fontWeight: "640",
                letterSpacing: "-0.03em",
              }}
            >
              {"Cora"}
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.45",
                color: "var(--color-night-ink-2)",
              }}
            >
              {
                "Merges plays that do the same job. Scores each one. Removes private details a second time."
              }
            </p>
          </div>
          <div style={{ flex: "3 1 420px", minWidth: "0" }}>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-night-ink-2)",
              }}
            >
              {"Monday morning · one list out"}
            </p>
            <div
              style={{
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{
                  background: "var(--color-night-ink)",
                  color: "var(--color-night)",
                  borderRadius: "6px",
                  padding: "16px",
                }}
              >
                <p style={{ margin: "0", fontSize: "16px", fontWeight: "620" }}>
                  {"Install this week"}
                </p>
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    width: "90%",
                    background: "var(--color-rule-strong)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "70%",
                    background: "var(--color-rule-strong)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "80%",
                    background: "var(--color-rule-strong)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  background: "var(--color-night-rule)",
                  borderRadius: "6px",
                  padding: "16px",
                }}
              >
                <p style={{ margin: "0", fontSize: "16px", fontWeight: "620" }}>
                  {"Worth trying"}
                </p>
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    width: "85%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "65%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "75%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  background: "var(--color-night-rule)",
                  borderRadius: "6px",
                  padding: "16px",
                }}
              >
                <p style={{ margin: "0", fontSize: "16px", fontWeight: "620" }}>
                  {"Niche but great"}
                </p>
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    width: "80%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "60%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  border: "1.5px solid var(--color-accent-night)",
                  borderRadius: "6px",
                  padding: "16px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    fontSize: "16px",
                    fontWeight: "620",
                    color: "var(--color-accent-night)",
                  }}
                >
                  {"Your top 3"}
                </p>
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    width: "85%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "70%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
                <div
                  style={{
                    marginTop: "8px",
                    height: "6px",
                    width: "78%",
                    background: "var(--color-ink-2)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            margin: "24px auto 0",
            maxWidth: "44rem",
            textAlign: "center",
            fontSize: "16px",
            color: "var(--color-night-ink-2)",
          }}
        >
          {
            "Cora scores every play on five things: hours saved, reach, ease to copy, proof and surprise. Time only. No income claims."
          }
        </p>
        <div
          style={{
            margin: "48px auto 0",
            maxWidth: "52rem",
            borderTop: "1px solid var(--color-night-rule)",
            paddingTop: "28px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 32px",
            alignItems: "baseline",
          }}
        >
          <p
            style={{
              margin: "0",
              flex: "0 0 auto",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--color-night-ink-2)",
            }}
          >
            {"November 13, 2026 version"}
          </p>
          <p
            style={{
              margin: "0",
              flex: "1 1 380px",
              fontSize: "17px",
              color: "var(--color-night-ink)",
            }}
          >
            {"v1: You run Zack on Sunday and email the result to "}
            <a
              href="mailto:hello@meetroger.ai"
              style={{
                color: "var(--color-accent-night)",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {"hello@meetroger.ai"}
            </a>
            {
              ". Cora ranks the Circle's plays overnight, and your list is in your inbox on Monday morning."
            }
          </p>
        </div>
      </div>
    </section>
  );
}

export function CirclesBenefits() {
  return (
    <section
      aria-labelledby="get-title"
      style={{ background: "var(--color-ground)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="get-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"What you get"}
        </h2>
        <div
          style={{
            marginTop: "56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "28px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 6h14M5 12h10M5 18h6"></path>
            </svg>
            <h3
              style={{
                margin: "20px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"A ranked list every Monday"}
            </h3>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "The Circle's best plays in three tiers. Each comes with a full playbook: what it does, how to set it up, and the time it saves."
              }
            </p>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "28px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5"></circle>
              <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.200 1.900 7 5.500"></path>
            </svg>
            <h3
              style={{
                margin: "20px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Your own top 3"}
            </h3>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Three plays you don't already run, picked for the kind of work you do."
              }
            </p>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "28px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14.5 5.5a4 4 0 0 0 4.9 4.9l-8.6 8.6a2.1 2.1 0 0 1-3-3l8.6-8.6"></path>
              <path d="M14.5 5.5 17 3l4 4-2.5 2.5"></path>
            </svg>
            <h3
              style={{
                margin: "20px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Install help"}
            </h3>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "When a play won't run on your setup, we help you get it working."
              }
            </p>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "28px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3.5" y="5" width="17" height="15" rx="1.5"></rect>
              <path d="M3.5 9.5h17M8 3v4M16 3v4"></path>
              <path d="M8 13.5h2M14 13.5h2M8 16.5h2"></path>
            </svg>
            <h3
              style={{
                margin: "20px 0 0",
                fontSize: "21px",
                lineHeight: "1.25",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Two working sessions a week"}
            </h3>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Tuesdays and Thursdays at 12:00 PM Eastern on Google Meet, one hour each, optional. Bring what you're building."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CirclesRules() {
  return (
    <section
      aria-labelledby="rules-title"
      style={{ background: "var(--color-ground-2)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="rules-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"A Circle runs on three rules."}
        </h2>
        <ol
          style={{
            margin: "56px 0 0",
            padding: "0",
            listStyle: "none",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "40px 48px",
          }}
        >
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"1"}
            </p>
            <h3
              style={{
                margin: "12px 0 0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {"Contribute."}
            </h3>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Send your Zack run by Sunday night. No run, no list that Monday. Miss three weeks in a row and your seat goes to the waiting list."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"2"}
            </p>
            <h3
              style={{
                margin: "12px 0 0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {"Confidential."}
            </h3>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                'Nothing shared in your Circle leaves it. Plays are anonymous: the list says "run by 3 members", never who.'
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "64px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"3"}
            </p>
            <h3
              style={{
                margin: "12px 0 0",
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                fontWeight: "640",
              }}
            >
              {"Candid."}
            </h3>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "17px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "Share what failed as well as what worked. A play that wasted your week saves seven other people theirs."
              }
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function CirclesEntry() {
  return (
    <section
      aria-labelledby="who-title"
      style={{ background: "var(--color-ground)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="who-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Who gets in."}
        </h2>
        <div
          style={{
            marginTop: "56px",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div
            style={{
              flex: "3 1 440px",
              minWidth: "0",
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "clamp(24px, 3vw, 40px)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-ink-2)",
              }}
            >
              {"All three"}
            </p>
            <ul
              style={{
                margin: "20px 0 0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <li
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  fontSize: "clamp(19px, 1.6vw, 21px)",
                  lineHeight: "1.4",
                  letterSpacing: "-0.012em",
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1d1d1f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", marginTop: "4px" }}
                >
                  <path d="M4 10.5l4 4 8-9"></path>
                </svg>
                {"You use AI agents for your work every day."}
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  fontSize: "clamp(19px, 1.6vw, 21px)",
                  lineHeight: "1.4",
                  letterSpacing: "-0.012em",
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1d1d1f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", marginTop: "4px" }}
                >
                  <path d="M4 10.5l4 4 8-9"></path>
                </svg>
                {"You run three or more agents, bots or scheduled routines."}
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  fontSize: "clamp(19px, 1.6vw, 21px)",
                  lineHeight: "1.4",
                  letterSpacing: "-0.012em",
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1d1d1f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", marginTop: "4px" }}
                >
                  <path d="M4 10.5l4 4 8-9"></path>
                </svg>
                {"You've run Zack and can show real plays from the past week."}
              </li>
            </ul>
          </div>
          <div
            style={{
              flex: "2 1 320px",
              minWidth: "0",
              background: "var(--color-ground-2)",
              borderRadius: "8px",
              padding: "clamp(24px, 3vw, 40px)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-ink-2)",
              }}
            >
              {"Not for you if"}
            </p>
            <ul
              style={{
                margin: "20px 0 0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                fontSize: "17px",
              }}
            >
              <li>
                <span style={{ fontWeight: "620" }}>
                  {"You're just getting started."}
                </span>
                <Link
                  href="/zack"
                  style={{
                    color: "var(--color-accent)",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  {"Run Zack for free"}
                </Link>
                {" and see where you stand."}
              </li>
              <li>
                <span style={{ fontWeight: "620" }}>
                  {"You want a course."}
                </span>
                {" Nobody teaches here. Members trade what works."}
              </li>
              <li>
                <span style={{ fontWeight: "620" }}>
                  {"You'd rather not share."}
                </span>
                {" A Circle is give to get."}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CirclesVetting() {
  return (
    <section
      aria-labelledby="vet-title"
      style={{ background: "var(--color-ground-2)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="vet-title"
          style={{
            margin: "0 auto",
            maxWidth: "46rem",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Circles work because every member is vetted."}
        </h2>
        <p
          style={{
            margin: "20px 0 0",
            textAlign: "center",
            fontSize: "clamp(19px, 1.6vw, 21px)",
            color: "var(--color-ink-2)",
          }}
        >
          {"Peter reads every application himself."}
        </p>
        <ol
          style={{
            margin: "56px 0 0",
            padding: "0",
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px 48px",
          }}
        >
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"1"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Qualify"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {"Six short questions."}
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"2"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Run Zack"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "One prompt, in your own account. Add the report to your application."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"3"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Review"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {"Peter reads your report and replies within 2 business days."}
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"4"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Call"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "A short conversation about how you work. It isn't a sales pitch."
              }
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"5"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Agreement"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {"Every member signs a confidentiality agreement before joining."}
            </p>
          </li>
          <li>
            <p
              aria-hidden="true"
              style={{
                margin: "0",
                fontSize: "56px",
                lineHeight: "1",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-rule-strong)",
              }}
            >
              {"6"}
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Kickoff"}
            </h3>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "16px",
                color: "var(--color-ink-2)",
              }}
            >
              {
                "When your Circle has eight members, you get a kickoff email. Billing starts that day."
              }
            </p>
          </li>
        </ol>
        <p style={{ margin: "48px 0 0", textAlign: "center" }}>
          <Link
            href="/apply"
            style={{
              color: "var(--color-accent)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            {"Start with the six questions ›"}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function CirclesZack() {
  return (
    <section
      aria-labelledby="zack-title"
      style={{ background: "var(--color-ground-2)" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 112px) clamp(16px, 2vw, 24px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "40px 72px",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 460px", minWidth: "0" }}>
          <h2
            id="zack-title"
            style={{
              margin: "0",
              fontSize: "clamp(34px, 4vw, 56px)",
              lineHeight: "1.06",
              letterSpacing: "-0.034em",
              fontWeight: "640",
            }}
          >
            {"Run Zack on yourself"}
          </h2>
          <p
            style={{
              margin: "24px 0 0",
              maxWidth: "36rem",
              fontSize: "clamp(19px, 1.6vw, 21px)",
              lineHeight: "1.45",
              letterSpacing: "-0.012em",
            }}
          >
            {
              "Zack reviews your past week with your agent, picks your best plays and estimates the time each saved. It runs in your own account."
            }
          </p>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: "36rem",
              fontSize: "17px",
              color: "var(--color-ink-2)",
            }}
          >
            {
              "Your report is the main part of a Circle application. Nothing reaches Roger unless you paste it."
            }
          </p>
          <Link
            href="/zack"
            style={{
              marginTop: "32px",
              display: "inline-flex",
              alignItems: "center",
              minHeight: "52px",
              padding: "0 28px",
              borderRadius: "999px",
              background: "var(--color-ink)",
              color: "var(--color-surface)",
              textDecoration: "none",
              fontSize: "17px",
              fontWeight: "550",
            }}
          >
            {"Run Zack on yourself"}
          </Link>
        </div>
        <ol
          style={{
            flex: "1 1 380px",
            minWidth: "0",
            margin: "0",
            padding: "0",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <li
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "baseline",
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-ink-2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {"1"}
            </span>
            <span style={{ fontSize: "17px" }}>
              {"Pick your agent and get the instructions by email."}
            </span>
          </li>
          <li
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "baseline",
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-ink-2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {"2"}
            </span>
            <span style={{ fontSize: "17px" }}>
              {"Paste one prompt into your agent. Zack reads your week there."}
            </span>
          </li>
          <li
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "baseline",
              background: "var(--color-surface)",
              border: "1px solid var(--color-rule)",
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--color-ink-2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {"3"}
            </span>
            <span style={{ fontSize: "17px" }}>
              {"Bring back your report, if you want to apply."}
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function CirclesLetter() {
  return (
    <section
      id="letter"
      aria-labelledby="letter-title"
      style={{ background: "var(--color-ground)" }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="letter-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Who runs this"}
        </h2>
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--color-ground-2)",
              border: "1px solid var(--color-rule)",
              boxSizing: "border-box",
              display: "grid",
              placeItems: "center",
              flexShrink: "0",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "640",
                letterSpacing: "-0.04em",
                color: "var(--color-ink-2)",
              }}
            >
              {"PK"}
            </span>
          </div>
          <div
            style={{
              flex: "1",
              height: "0",
              borderTop: "1px dashed var(--color-rule-strong)",
            }}
          ></div>
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "clamp(19px, 1.6vw, 21px)",
            lineHeight: "1.6",
            letterSpacing: "-0.012em",
          }}
        >
          <p style={{ margin: "0" }}>{"Hey there,"}</p>
          <p style={{ margin: "20px 0 0" }}>
            {
              "I'm Peter Kuperman. I run AI agents every day, including my own AI chief of staff, and I deploy them inside companies for a living."
            }
          </p>
          <p style={{ margin: "20px 0 0" }}>
            {
              "Here is what I kept noticing. The most useful things people do with agents never get posted. They involve clients, money and how the business actually runs. What does get posted is the highlight reel. So everyone works out the same things alone, a few months apart."
            }
          </p>
          <p style={{ margin: "20px 0 0" }}>
            {
              "A Circle fixes that. Eight people who already use agents heavily. Every Sunday an agent called Zack writes up what worked for each of you. Every Monday you get the best of it, ranked, with private details removed."
            }
          </p>
          <p style={{ margin: "20px 0 0" }}>
            {
              "I read every application myself, and I host the working sessions for the founding Circles."
            }
          </p>
          <p style={{ margin: "20px 0 0" }}>
            {
              "If you're already running agents and suspect you're using a fraction of what they can do, apply."
            }
          </p>
        </div>
        <p
          style={{
            margin: "32px 0 0",
            fontSize: "40px",
            lineHeight: "1",
            fontWeight: "500",
            fontStyle: "italic",
            letterSpacing: "-0.03em",
          }}
        >
          {"Peter"}
        </p>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "13px",
            color: "var(--color-ink-2)",
          }}
        >
          {
            "Peter Kuperman · 17 years in real estate finance, then software and AI · Finance and computer science, Penn"
          }
        </p>
      </div>
    </section>
  );
}

export function CirclesQuestions() {
  return (
    <section
      id="questions"
      aria-labelledby="faq-title"
      style={{ background: "var(--color-ground)" }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 120px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "0",
            height: "56px",
            margin: "0 auto 32px",
            borderLeft: "1px dashed var(--color-rule-strong)",
          }}
        ></div>
        <h2
          id="faq-title"
          style={{
            margin: "0",
            textAlign: "center",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Questions"}
        </h2>
        <div
          style={{ marginTop: "48px", borderTop: "1px solid var(--color-ink)" }}
        >
          <details
            open
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"How much time does it take?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                "Run Zack on Sunday and read Monday's list. The two working sessions are optional."
              }
            </p>
          </details>
          <details
            open
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"I use a different agent from everyone else. Does that matter?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                "No. Circles mix agents on purpose. Every playbook opens with a line that tells your own agent to adapt it to your setup and install it, asking you questions as needed. Install help is there if it gets stuck."
              }
            </p>
          </details>
          <details
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"What does Zack read?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                "Your activity inside your agent account for the past seven days. He runs there, under your account."
              }
            </p>
          </details>
          <details
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"What leaves my account?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                "Your Zack run, with client names and private details removed. In v1 you read it and email it yourself."
              }
            </p>
          </details>
          <details
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"Who sees my plays?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                'The other members of your Circle and Roger\'s host. Plays are anonymous: the list says "run by 3 members", never who.'
              }
            </p>
          </details>
          <details
            style={{
              borderBottom: "1px solid var(--color-rule)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: "21px",
                fontWeight: "620",
                letterSpacing: "-0.018em",
              }}
            >
              {"What's the guarantee?"}
            </summary>
            <p style={{ margin: "12px 0 0", color: "var(--color-ink-2)" }}>
              {
                "If a Circle isn't for you, tell us within 45 days of kickoff and we refund what you've paid."
              }
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

export function CirclesClosing() {
  return (
    <section
      aria-labelledby="close-title"
      style={{
        background: "var(--color-night)",
        color: "var(--color-night-ink)",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(72px, 8vw, 112px) clamp(16px, 2vw, 24px)",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h2
          id="close-title"
          style={{
            margin: "0",
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: "1.06",
            letterSpacing: "-0.034em",
            fontWeight: "640",
          }}
        >
          {"Already running agents every day?"}
        </h2>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "clamp(24px, 2.2vw, 32px)",
            lineHeight: "1.15",
            letterSpacing: "-0.03em",
            color: "var(--color-night-ink-2)",
          }}
        >
          {"Find out what the other seven know."}
        </p>
        <Link
          href="/apply"
          style={{
            marginTop: "40px",
            display: "inline-flex",
            alignItems: "center",
            minHeight: "52px",
            padding: "0 28px",
            borderRadius: "999px",
            background: "var(--color-accent)",
            color: "var(--color-surface)",
            textDecoration: "none",
            fontSize: "17px",
            fontWeight: "550",
          }}
        >
          {"Apply for a founding Circle"}
        </Link>
      </div>
    </section>
  );
}

export function CirclesHome() {
  return (
    <div className="circles-page">
      <CirclesHero />
      <CirclesWhy />
      <CirclesHow />
      <CirclesBenefits />
      <CirclesRules />
      <CirclesEntry />
      <CirclesVetting />
      <CirclesProof />
      <CirclesZack />
      <CirclesLetter />
      <Suspense fallback={<CirclesPrice />}>
        <CountryPrice />
      </Suspense>
      <CirclesQuestions />
      <CirclesClosing />
    </div>
  );
}
async function CountryPrice() {
  const h = await headers();
  return (
    <CirclesPrice
      initialCurrency={
        h.get("x-vercel-ip-country")?.toUpperCase() === "CA" ? "CAD" : "USD"
      }
    />
  );
            }
