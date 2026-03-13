import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Zap,
  Target,
  Gauge,
  Plus,
  Minus,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import Navbar from "../components/Navbar";
import { useSession } from "../lib/auth";

export default function Home() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is PulseAPI?",
      answer:
        "PulseAPI is a simple API monitoring tool. Add your endpoint and we continuously check if it's up or down, while tracking response time and failures.",
    },
    {
      question: "How does monitoring work?",
      answer:
        "PulseAPI periodically sends requests to your API endpoint and records the response status and latency. If the endpoint fails or becomes unreachable, it is marked as down in the dashboard.",
    },
    {
      question: "How often are endpoints checked?",
      answer:
        "Endpoints are checked every 30 seconds to detect downtime as quickly as possible without overwhelming your servers.",
    },
    {
      question: "What kind of endpoints can I monitor?",
      answer:
        "Any public HTTP or HTTPS API endpoint can be monitored using PulseAPI.",
    },
    {
      question: "Do I need to install anything?",
      answer:
        "No installation is required. Simply add your API endpoint in the dashboard and monitoring starts automatically.",
    },
    {
      question: "Is this a production tool?",
      answer:
        "PulseAPI is currently a hackathon project built to demonstrate real-time API monitoring and uptime tracking.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="landing-page">
      <Navbar />
      <div className="noise-overlay"></div>
      <div className="grid-bg"></div>
      <div className="ambient-glow"></div>

      <motion.header
        className="hero container-lg"
        id="demo"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          Monitor your APIs in <br />
          <span style={{ color: "var(--accent-primary)", fontStyle: "italic" }}>real-time.</span>
        </motion.h1>

        <motion.p variants={itemVariants}>
          Know instantly when your APIs go down. Pulse checks your endpoints
          continuously and alerts you before your users notice.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to={session ? "/dashboard" : "/signup"}
            className="btn btn-primary"
            style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}
          >
            Add Your First Endpoint{" "}
            <ArrowUpRight size={18} className="cta-arrow" />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="metrics-display">
          <div className="metric-card">
            <div className="metric-value">
              99.98
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--text-muted)",
                  marginTop: "1rem",
                }}
              >
                %
              </span>
            </div>
            <div className="metric-label">Uptime</div>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              Track the availability of your endpoints in real-time with
              continuous health checks.
            </p>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              245
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--text-muted)",
                  marginTop: "1rem",
                }}
              >
                ms
              </span>
            </div>
            <div className="metric-label">Average Response Time</div>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              Measure how fast your APIs respond and detect latency spikes
              instantly.
            </p>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              30<span style={{ fontSize: "2.5rem" }}>s</span>
            </div>
            <div className="metric-label">Health Checks</div>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              Pulse continuously pings your endpoints to detect downtime
              immediately.
            </p>
          </div>
        </motion.div>
      </motion.header>

      <section className="pipeline container-lg" id="features">
        <motion.div
          className="pipeline-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>Built for developers.</h2>
          <p>Add an endpoint. Pulse handles the rest.</p>
        </motion.div>

        <motion.div
          className="pipeline-track"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="pipeline-step">
            <div className="step-indicator">
              <Activity size={16} /> Uptime
            </div>
            <h3>Uptime Monitoring</h3>
            <p>
              Continuous health checks ensure your APIs are always reachable and
              functioning properly.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pipeline-step">
            <div className="step-indicator">
              <Zap size={16} /> Latency
            </div>
            <h3>Latency Tracking</h3>
            <p>
              Visualize response times and performance trends across all your
              endpoints.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pipeline-step">
            <div className="step-indicator">
              <Target size={16} /> Alerts
            </div>
            <h3>Failure Alerts</h3>
            <p>
              Get notified immediately via email when an endpoint goes down or
              degrades.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pipeline-step">
            <div className="step-indicator">
              <Gauge size={16} /> Dashboard
            </div>
            <h3>Simple Dashboard</h3>
            <p>
              All your APIs, metrics, and alerts organized in one clean,
              developer-friendly view.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="faq container-lg" id="faq">
        <motion.div
          className="faq-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about monitoring your APIs.</p>
        </motion.div>

        <motion.div
          className="faq-accordion"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`faq-item ${openFaq === index ? "active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {faq.question}
                <span className="faq-icon">
                  {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              <div
                className="faq-answer-wrapper"
                style={{
                  height: openFaq === index ? "auto" : 0,
                  opacity: openFaq === index ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="landing-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Activity size={20} color="var(--accent-primary)" />
          <span
            style={{
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
            }}
          >
            <span style={{ color: "var(--text-main)" }}>Pulse</span>
            <span style={{ color: "var(--accent-primary)" }}>API</span>
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} PulseAPI.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a
            href="https://x.com/quantapar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              transition: "var(--transition-fast)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = "var(--text-main)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            X (Twitter)
          </a>
          <a
            href="https://github.com/Quantapar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              transition: "var(--transition-fast)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = "var(--text-main)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
