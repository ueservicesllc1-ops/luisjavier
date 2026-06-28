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
    <section id="contacto" className="section" style={{ background: "var(--color-bg-card)", borderTop: "1px solid var(--color-border)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(3rem, 7vw, 7rem)", alignItems: "start" }} className="contact-grid">
          {/* Info side */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>Contáctame</p>
            <h2 className="heading-section" style={{ marginBottom: "1.5rem" }}>
              Hagamos algo<br />
              <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>increíble</span>
            </h2>
            <span className="gold-line" />

            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.8, marginTop: "1.5rem", marginBottom: "3rem" }}>
              ¿Tienes un proyecto en mente? Me encantaría escucharte. 
              Cuéntame sobre tu idea y planificaremos juntos algo memorable.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { icon: <MapPin size={16} />, label: "Ubicación", value: "Paterson, New Jersey, USA · Disponible para viajar" },
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
          <div className="card" style={{ padding: "2.5rem" }}>
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
                  ¡Mensaje enviado!
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
                  Te responderé en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      Nombre
                    </label>
                    <input
                      className="input"
                      type="text"
                      required
                      placeholder="Tu nombre"
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
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Servicio
                  </label>
                  <select
                    className="input"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    style={{ appearance: "none" }}
                  >
                    <option value="" style={{ background: "#111" }}>Selecciona un servicio</option>
                    <option value="boda" style={{ background: "#111" }}>Bodas & Celebraciones</option>
                    <option value="retrato" style={{ background: "#111" }}>Retratos de Arte</option>
                    <option value="comercial" style={{ background: "#111" }}>Fotografía Comercial</option>
                    <option value="destino" style={{ background: "#111" }}>Destino & Viajes</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Mensaje
                  </label>
                  <textarea
                    className="input"
                    rows={5}
                    required
                    placeholder="Cuéntame sobre tu proyecto o fecha especial..."
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
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={15} />
                      Enviar Mensaje
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
