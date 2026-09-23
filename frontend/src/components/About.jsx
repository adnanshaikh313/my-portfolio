const FOCUS = [
  {
    n: "01",
    title: "Data Pipelines",
    text: "Batch and streaming pipelines in Python — moving data from source systems into clean, analytics-ready stores.",
  },
  {
    n: "02",
    title: "ETL & Orchestration",
    text: "Airflow DAGs that extract, transform and load on schedule, with retries, logging and data quality checks.",
  },
  {
    n: "03",
    title: "Stream Processing",
    text: "Real-time event flows with Apache Kafka — ingesting, transforming and serving data with low latency.",
  },
  {
    n: "04",
    title: "Analytics & Modeling",
    text: "Pandas and SQL for exploration, KPI computation and dimensional modeling that analysts can trust.",
  },
];

export default function About({ profile }) {
  const p = profile || {};
  return (
    <section id="about" aria-labelledby="aboutTitle">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">About</span>
          <h2 className="section-title" id="aboutTitle">
            Turning raw data into<br />reliable pipelines.
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <p className="lead">
              I'm an MCA student from Pune, working toward becoming a{" "}
              <strong>data engineer</strong> who ships clean, scalable data platforms.
            </p>
            <p>
              {p.about ||
                "I work with Python, SQL, Kafka, Airflow and modern data tooling to build ETL workflows and analytics-ready systems."}
            </p>
            <p>
              I care about <strong>data quality, automation and observability</strong> — pipelines
              that validate what they move, retry what fails, and make it obvious when something
              goes wrong. Currently pursuing my MCA at{" "}
              <strong>Allana Institute of Management Sciences and Information Technology</strong>, Pune.
            </p>
          </div>
          <div className="focus-grid">
            {FOCUS.map((f, i) => (
              <div className="focus-card" data-reveal key={f.n} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="focus-num">{f.n}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
