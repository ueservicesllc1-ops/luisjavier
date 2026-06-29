"use client";
import { useState } from "react";
import { Send, MapPin, Mail, Phone, Camera } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  };

  return (
    <section id="contact" className="section" style={{ background: "var(--color-bg-card)", borderTop: "1px solid var(--color-border)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(3rem, 7vw, 7rem)", alignItems: "start" }} className="contact-grid">
          {/* Info side */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>Contact Me</p>
            <h2 className="heading-section" style={{ marginBottom: "1.5rem" }}>
              Let's make something<br />
              <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>incredible</span>
            </h2>
            <span className="gold-line" />

            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.8, marginTop: "1.5rem", marginBottom: "3rem" }}>
              Have a project in mind? I'd love to hear from you. 
              Tell me about your idea and we will plan something memorable together.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { icon: <MapPin size={16} />, label: "Location", value: "Paterson, New Jersey, USA · Available to travel" },
                { icon: <Mail size={16} />, label: "Email", value: "luisuf@gmail.com" },
                { icon: <Phone size={16} />, label: "WhatsApp", value: "+1 (201) 708-4725" },
                { icon: <Camera size={16} />, label: "Instagram", value: "@luisfotografia" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--color-gold-muted)",
                      border: "1px solid rgba(201,169,110,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-gold)",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.2rem" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "var(--color-text)" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="card" style={{ padding: "clamp(1.25rem, 4vw, 2.5rem)" }}>
            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--color-gold-muted)",
                    border: "1px solid rgba(201,169,110,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginInline: "auto",
                    marginBottom: "1.5rem",
                    fontSize: "1.75rem",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--color-cream)", marginBottom: "0.75rem" }}>
                  Message Sent!
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
                  I will get back to you in less than 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      Name
                    </label>
                    <input
                      className="input"
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      Email
                    </label>
                    <input
                      className="input"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Service
                  </label>
                  <select
                    className="input"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    style={{ appearance: "none" }}
                  >
                    <option value="" style={{ background: "#111" }}>Select a service</option>
                    <option value="boda" style={{ background: "#111" }}>Weddings & Celebrations</option>
                    <option value="retrato" style={{ background: "#111" }}>Fine Art Portraits</option>
                    <option value="comercial" style={{ background: "#111" }}>Commercial Photography</option>
                    <option value="destino" style={{ background: "#111" }}>Destination & Travel</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Message
                  </label>
                  <textarea
                    className="input"
                    rows={5}
                    required
                    placeholder="Tell me about your project or special date..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={status === "sending"}
                  style={{ justifyContent: "center", opacity: status === "sending" ? 0.7 : 1 }}
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
