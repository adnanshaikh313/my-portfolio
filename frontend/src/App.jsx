import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import { ArrowUp } from "./components/icons";
const API_BASE = "https://adnan-portfolio-api-jef5.onrender.com";

export async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const fn = () => setHash(window.location.hash);
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return hash;
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    let raf = 0;
    let x = -100, y = -100, rx = -100, ry = -100;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const t = e.target.closest("a,button,.chip,.badge");
      if (ring.current) ring.current.classList.toggle("grow", !!t);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
    </>
  );
}

function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      id="toTop" className={show ? "show" : ""} aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={show ? 0 : -1}
    >
      <ArrowUp />
    </button>
  );
}

export default function App() {
  const hash = useHashRoute();
  const [profile, setProfile] = useState(null);
  const progress = useRef(null);

  useEffect(() => {
    api("/api/profile").then(setProfile).catch(() => {});
  }, []);

  // Preloader
  useEffect(() => {
    const done = () => document.body.classList.add("loaded");
    if (document.readyState === "complete") {
      const t = setTimeout(done, 500);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(done, 2500); // fallback
    window.addEventListener("load", done);
    return () => {
      window.removeEventListener("load", done);
      clearTimeout(t1);
    };
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const v = max > 0 ? h.scrollTop / max : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${v})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (hash === "#admin") return;
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [hash, profile]);

  if (hash === "#admin") {
    return (
      <>
        <a className="skip-link" href="#main">Skip to content</a>
        <main id="main"><Admin /></main>
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="preloader" role="status" aria-label="Loading">
        <div className="loader-bars" aria-hidden="true"><span /><span /><span /><span /></div>
        <p>INITIALIZING PIPELINE</p>
      </div>
      <div id="progress" aria-hidden="true"><span ref={progress} /></div>
      <Cursor />
      <Navbar profile={profile} />
      <main id="main">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills />
        <Projects />
        <Education />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <ToTop />
    </>
  );
}
