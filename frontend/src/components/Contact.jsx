import { useState } from "react";
import { api } from "../App";
import { MailIcon, PhoneIcon, PinIcon, GithubIcon, LinkedinIcon } from "./icons";

export default function Contact({ profile }) {
  const p = profile || {};
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState({ sending: false, ok: "", err: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, ok: "", err: "" });
    try {
      const res = await api("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setState({ sending: false, ok: res.message || "Message sent!", err: "" });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState({ sending: false, ok: "", err: "Could not send. Please email me directly." });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section id="contact" aria-labelledby="contactTitle">
      <div className="container">
        <div className="contact-wrap">
          <div data-reveal>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Contact</span>
            <h2 className="contact-title" id="contactTitle">
              Let's build <span className="hl">data pipelines</span> together.
            </h2>
            <p className="contact-sub">
              Have an internship, opportunity, or just want to talk data? My inbox is open.
            </p>
          </div>
          <div className="contact-grid" data-reveal>
            <a className="contact-card" href={`mailto:${p.email}`}>
              <span className="contact-ic"><MailIcon /></span>
              <span><span className="k">Email</span><span className="v">{p.email}</span></span>
            </a>
            <div className="contact-card">
              <span className="contact-ic"><PhoneIcon /></span>
              <span><span className="k">Phone</span><span className="v">{p.phone}</span></span>
            </div>
            <div className="contact-card">
              <span className="contact-ic"><PinIcon /></span>
              <span><span className="k">Location</span><span className="v">{p.location}</span></span>
            </div>
            <a className="contact-card" href={p.linkedin} target="_blank" rel="noreferrer">
              <span className="contact-ic"><LinkedinIcon /></span>
              <span><span className="k">LinkedIn</span><span className="v">Connect with me</span></span>
            </a>
          </div>
          <form className="contact-form" onSubmit={submit} data-reveal>
            {state.ok && <div className="form-ok">{state.ok}</div>}
            {state.err && <div className="form-err">{state.err}</div>}
            <div className="field">
              <label htmlFor="cf-name">Your name</label>
              <input id="cf-name" value={form.name} onChange={set("name")} required minLength={2} placeholder="Jane Doe" />
            </div>
            <div className="field">
              <label htmlFor="cf-email">Your email</label>
              <input id="cf-email" type="email" value={form.email} onChange={set("email")} required placeholder="jane@company.com" />
            </div>
            <div className="field">
              <label htmlFor="cf-msg">Message</label>
              <textarea id="cf-msg" value={form.message} onChange={set("message")} required minLength={5} placeholder="Hi Adnan, …" />
            </div>
            <button className="btn btn-primary" disabled={state.sending} style={{ width: "100%" }}>
              {state.sending ? "Sending…" : "Send Message"}
            </button>
          </form>
          {p.github && (
            <div style={{ marginTop: 28 }} data-reveal>
              <a href={p.github} target="_blank" rel="noreferrer"
                 style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--muted)", textDecoration: "none", fontSize: 14 }}>
                <span style={{ width: 20, height: 20, display: "inline-block" }}><GithubIcon /></span>
                github.com/adnanshaikh313
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
