import { useEffect, useState } from "react";
import { MenuIcon } from "./icons";

const LINKS = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Education", "#education"],
  ["Contact", "#contact"],
];

export default function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map(([, h]) => h.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open ]);

  const name = profile?.name || "Adnan Samir Shaikh";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label={`${name} — home`}>
            <span className="brand-mark" aria-hidden="true">{initials}</span>
            <span className="brand-name">{name}</span>
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className={active === href ? "active" : ""}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="nav-cta" href="#contact">Let's Talk</a>
          <button
            className="menu-btn" onClick={() => setOpen(true)}
            aria-label="Open menu" aria-expanded={open}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {LINKS.map(([label, href], i) => (
              <li key={href}>
                <a
                  href={href}
                  className={active === href ? "active" : ""}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="idx">0{i + 1}</span>{label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="menu-btn" onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{ position: "absolute", top: 12, right: 36 }}
          tabIndex={open ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </>
  );
}
