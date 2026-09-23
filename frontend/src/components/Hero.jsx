import { useEffect, useState } from "react";
import {
  GithubIcon, LinkedinIcon, MailIcon, ArrowUpRight,
  IngestIcon, ExtractIcon, TransformIcon, ValidateIcon, LoadIcon, ServeIcon,
} from "./icons";

const STAGES = [
  { label: "Ingest", Icon: IngestIcon, d: "0s" },
  { label: "Extract", Icon: ExtractIcon, d: ".6s" },
  { label: "Transform", Icon: TransformIcon, d: "1.2s" },
  { label: "Validate", Icon: ValidateIcon, d: "1.8s" },
  { label: "Load", Icon: LoadIcon, d: "2.4s" },
  { label: "Serve", Icon: ServeIcon, d: "3s" },
];

const STATUS = [
  <span key="0"><b>run #38</b> succeeded · 1.2M rows → warehouse</span>,
  <span key="1"><b>kafka</b> consumer lag 0 · 8.4k msgs/sec</span>,
  <span key="2"><b>validation</b> passed · 0 bad records quarantined</span>,
];

const TERM_LINES = [
  { text: "$ airflow dags trigger sales_etl", cls: "" },
  { text: "$ python -m pipeline.validate --date today", cls: "" },
  { text: "✓ 1,248,392 rows processed in 4m 12s", cls: "term-ok" },
  { text: "✓ loaded → warehouse.sales_fact", cls: "term-ok" },
];

function renderLine(text, cls) {
  if (text.startsWith("$")) {
    return (
      <>
        <span className="term-prompt">$</span>
        <span className="term-out">{text.slice(1)}</span>
      </>
    );
  }
  return <span className={cls}>{text}</span>;
}

function Terminal() {
  const [typed, setTyped] = useState([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(TERM_LINES);
      return;
    }
    let line = 0, ch = 0, timer, cancelled = false;
    const step = () => {
      if (cancelled) return;
      const target = TERM_LINES[line];
      if (ch <= target.text.length) {
        setCurrent(target.text.slice(0, ch));
        ch += 1;
        timer = setTimeout(step, target.text.startsWith("$") ? 36 : 14);
      } else {
        setTyped((prev) => [...prev, target]);
        setCurrent("");
        line += 1; ch = 0;
        if (line >= TERM_LINES.length) {
          timer = setTimeout(() => {
            if (cancelled) return;
            setTyped([]);
            line = 0;
            timer = setTimeout(step, 700);
          }, 3800);
        } else {
          timer = setTimeout(step, 340);
        }
      }
    };
    timer = setTimeout(step, 900);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  return (
    <div className="terminal" aria-label="Terminal demo">
      {typed.map((l, i) => (
        <div className="term-line" key={i}>{renderLine(l.text, l.cls)}</div>
      ))}
      <div className="term-line">
        {current ? renderLine(current, "") : null}
        <span className="term-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Hero({ profile }) {
  const p = profile || {};
  const name = p.name || "Adnan Samir Shaikh";
  const words = name.split(" ");
  const mid = words.length > 2 ? words.slice(1, -1).join(" ") : "";
  const [si, setSi] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSi((s) => (s + 1) % STATUS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="pulse" aria-hidden="true" />
              {(p.location || "Pune, India").toUpperCase()} · OPEN TO OPPORTUNITIES
            </span>
            <h1 className="hero-title">
              {words[0]} {mid && <span className="hl">{mid}</span>} {words.slice(mid ? 2 : 1).join(" ")}
            </h1>
            <p className="hero-role">
              Aspiring Data Engineer<span className="sep" aria-hidden="true">|</span>
              Python<span className="sep" aria-hidden="true">|</span>
              SQL<span className="sep" aria-hidden="true">|</span>Kafka
            </p>
            <p className="hero-desc">
              {p.about ||
                "MCA student turning raw data into reliable, production-ready pipelines with Python, SQL, Kafka, Airflow and modern data tooling."}
            </p>
            <div className="hero-chips" aria-label="Core technologies">
              {["Python", "SQL", "Kafka", "Airflow", "Pandas", "MongoDB"].map((c) => (
                <span className="chip" key={c}>{c}</span>
              ))}
            </div>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#projects">
                View Projects <ArrowUpRight />
              </a>
              <a className="btn btn-ghost" href="#contact">Let's Connect</a>
            </div>
            <div className="hero-social">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>
              )}
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
              )}
              {p.email && (
                <a href={`mailto:${p.email}`} aria-label="Email"><MailIcon /></a>
              )}
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="pipeline-card">
              <div className="pipeline-head">
                <div className="win-dots"><span /><span /><span /></div>
                <span className="fname">daily_etl.py</span>
                <span className="live-tag">LIVE</span>
              </div>
              <div className="pipeline">
                <div className="packet-track">
                  <span className="packet" style={{ "--pd": "0s" }} />
                  <span className="packet" style={{ "--pd": "1.2s" }} />
                  <span className="packet" style={{ "--pd": "2.4s" }} />
                </div>
                {STAGES.map(({ label, Icon, d }) => (
                  <div className="stage" style={{ "--d": d }} key={label}>
                    <div className="stage-icon"><Icon /></div>
                    <span className="stage-label">{label}</span>
                  </div>
                ))}
              </div>
              <div className="pipeline-status">
                <span className="status-dot" />
                <span id="pipelineStatusText">{STATUS[si]}</span>
              </div>
            </div>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
