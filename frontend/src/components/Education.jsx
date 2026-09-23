import { useEffect, useState } from "react";
import { api } from "../App";

export default function Education() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api("/api/education").then(setItems).catch(() => {});
  }, []);

  return (
    <section id="education" aria-labelledby="eduTitle">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Education</span>
          <h2 className="section-title" id="eduTitle">Where I studied.</h2>
        </div>
        <div className="edu-grid">
          {items.map((e, i) => (
            <div className="edu-card" data-reveal key={i} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="edu-years">{e.period}</div>
              <h3>{e.degree}</h3>
              <p className="edu-school">{e.school}{e.location ? ` · ${e.location}` : ""}</p>
              {e.details && <p className="edu-meta">{e.details}</p>}
              {e.status && <span className="status-pill">{e.status}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
