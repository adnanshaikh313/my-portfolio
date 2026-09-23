import { useEffect, useState } from "react";
import { api } from "../App";

const EMPTY = { title: "", description: "", tech: "", github: "", demo: "", sample: false };

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem("admin_key") || "");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");

  const q = (k) => `?key=${encodeURIComponent(k)}`;

  const load = async (k) => {
    try {
      const [m, p] = await Promise.all([
        api(`/api/admin/messages${q(k)}`),
        api("/api/projects"),
      ]);
      setMessages(m);
      setProjects(p);
      setAuthed(true);
      setErr("");
      sessionStorage.setItem("admin_key", k);
    } catch {
      setErr("Wrong admin key.");
      setAuthed(false);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (e) => {
    e.preventDefault();
    load(key);
  };

  const markRead = async (id) => {
    await api(`/api/admin/messages/${id}/read${q(key)}`, { method: "POST" });
    load(key);
  };
  const delMsg = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api(`/api/admin/messages/${id}${q(key)}`, { method: "DELETE" });
    load(key);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    const payload = { ...form, tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editing) {
      await api(`/api/admin/projects/${editing}${q(key)}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api(`/api/admin/projects${q(key)}`, { method: "POST", body: JSON.stringify(payload) });
    }
    setForm(EMPTY);
    setEditing(null);
    load(key);
  };
  const editProject = (p) => {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description, tech: p.tech.join(", "),
              github: p.github || "", demo: p.demo || "", sample: !!p.sample });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const delProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api(`/api/admin/projects/${id}${q(key)}`, { method: "DELETE" });
    load(key);
  };

  if (!authed) {
    return (
      <div className="admin-wrap">
        <div className="admin-box" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h2>Admin Login</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 18px" }}>
            Enter your ADMIN_KEY to manage projects and messages.
          </p>
          {err && <div className="form-err" style={{ marginBottom: 14 }}>{err}</div>}
          <form onSubmit={login} style={{ display: "grid", gap: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
                     placeholder="Admin key" />
            </div>
            <button className="btn btn-primary">Unlock</button>
          </form>
          <div style={{ marginTop: 16 }}><a href="#">← Back to site</a></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Panel</h2>
        <a href="#">← Back to site</a>
      </div>
      <div className="admin-tabs">
        <button className={tab === "messages" ? "on" : ""} onClick={() => setTab("messages")}>
          Messages ({messages.filter((m) => !m.read).length} new)
        </button>
        <button className={tab === "projects" ? "on" : ""} onClick={() => setTab("projects")}>
          Projects ({projects.length})
        </button>
      </div>

      {tab === "messages" && (
        <div>
          {messages.length === 0 && <div className="admin-box"><p>No messages yet.</p></div>}
          {messages.map((m) => (
            <div className={`msg${m.read ? "" : " unread"}`} key={m.id}>
              <div className="msg-head">
                <b style={{ color: "var(--text)" }}>{m.name}</b>
                <span>{m.email}</span>
                <span>{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p>{m.message}</p>
              <div className="msg-actions">
                {!m.read && <button className="mini-btn" onClick={() => markRead(m.id)}>Mark read</button>}
                <button className="mini-btn danger" onClick={() => delMsg(m.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "projects" && (
        <div>
          <div className="admin-box" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 12 }}>{editing ? "Edit project" : "Add project"}</h3>
            <form className="proj-form" onSubmit={saveProject}>
              <input placeholder="Title" value={form.title} required
                     onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" value={form.description} required rows={3}
                     onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Tech (comma separated): Python, Kafka, MongoDB" value={form.tech}
                     onChange={(e) => setForm({ ...form, tech: e.target.value })} />
              <input placeholder="GitHub URL (optional)" value={form.github}
                     onChange={(e) => setForm({ ...form, github: e.target.value })} />
              <input placeholder="Demo URL (optional)" value={form.demo}
                     onChange={(e) => setForm({ ...form, demo: e.target.value })} />
              <label className="check-row">
                <input type="checkbox" checked={form.sample}
                       onChange={(e) => setForm({ ...form, sample: e.target.checked })} />
                Mark as sample / placeholder
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" style={{ padding: "10px 22px", minHeight: 44 }}>
                  {editing ? "Save changes" : "Add project"}
                </button>
                {editing && (
                  <button type="button" className="btn btn-ghost" style={{ padding: "10px 22px", minHeight: 44 }}
                          onClick={() => { setEditing(null); setForm(EMPTY); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          {projects.map((p) => (
            <div className="msg" key={p.id}>
              <div className="msg-head">
                <b style={{ color: "var(--text)" }}>{p.title}</b>
                <span>{p.tech.join(", ")}</span>
              </div>
              <div className="msg-actions">
                <button className="mini-btn" onClick={() => editProject(p)}>Edit</button>
                <button className="mini-btn danger" onClick={() => delProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
