import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";

export default function Footer({ profile }) {
  const p = profile || {};
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            {p.name || "Adnan Samir Shaikh"}
            <span>Aspiring Data Engineer · Pune, India</span>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
            {p.github && <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>}
            {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>}
            {p.email && <a href={`mailto:${p.email}`} aria-label="Email"><MailIcon /></a>}
          </nav>
        </div>
        <p className="copyright">© {year} {p.name || "Adnan Samir Shaikh"}. Built with React, FastAPI & MongoDB.</p>
      </div>
    </footer>
  );
}
