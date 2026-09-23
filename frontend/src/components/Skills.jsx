import { useEffect, useState } from "react";
import { api } from "../App";
import { CodeIcon, GearIcon, DbIcon, WrenchIcon, StreamIcon, ChartIcon } from "./icons";

const ICONS = [CodeIcon, GearIcon, StreamIcon, DbIcon, WrenchIcon, ChartIcon];
const FALLBACK = [
  { group: "Languages", items: ["Python", "SQL"] },
  { group: "Data Engineering", items: ["Apache Kafka", "Apache Airflow", "Pandas", "ETL Pipelines"] },
  { group: "Databases", items: ["MongoDB", "Data Modeling"] },
  { group: "Tools & Platforms", items: ["Git", "Docker", "Linux"] },
];

export default function Skills() {
  const [groups, setGroups] = useState(FALLBACK);

  useEffect(() => {
    api("/api/skills")
      .then((d) => { if (Array.isArray(d) && d.length) setGroups(d); })
      .catch(() => {});
  }, []);

  return (
    <section id="skills" aria-labelledby="skillsTitle">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Skills</span>
          <h2 className="section-title" id="skillsTitle">The toolbox.</h2>
          <p className="section-sub">
            The languages, platforms and tools I use to move, transform and model data.
          </p>
        </div>
        <div className="skills-grid">
          {groups.map((g, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div className="skill-card" data-reveal key={g.group} style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
                <div className="skill-card-head">
                  <span className="skill-icon" aria-hidden="true"><Icon /></span>
                  <h3>{g.group}</h3>
                </div>
                <div className="skill-badges">
                  {g.items.map((s) => (
                    <span className="badge" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
