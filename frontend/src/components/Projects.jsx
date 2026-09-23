import { useEffect, useState } from "react";
import { api } from "../App";
import { GithubIcon, ArrowUpRight, DbIcon } from "./icons";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api("/api/projects").then(setProjects).catch(() => {});
  }, []);

  return (
    <section id="projects" aria-labelledby="projectsTitle">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Projects</span>
          <h2 className="section-title" id="projectsTitle">Built to move data.</h2>
          <p className="section-sub">
            Pipelines, ETL workflows and analytics builds — managed from the admin panel.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <article className="project-card" data-reveal key={p.id || i} style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
              <div className="proj-top">
                <span className="proj-num">PROJECT {String(i + 1).padStart(2, "0")}</span>
                <span className="proj-icon" aria-hidden="true"><DbIcon /></span>
              </div>
              {p.sample && <span className="sample-pill">SAMPLE</span>}
              <h3>{p.title}</h3>
              <p className="proj-desc">{p.description}</p>
              <div className="proj-tags tag-row">
                {(p.tech || []).map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
              {(p.github || p.demo) && (
                <div className="proj-links">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer"><GithubIcon /> Code</a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer"><ArrowUpRight /> Live demo</a>
                  )}
                </div>
              )}
            </article>
          ))}
          {projects.length === 0 && (
            <div className="project-card" data-reveal>
              <h3>Projects loading…</h3>
              <p className="proj-desc">Start the backend to load projects from MongoDB.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
