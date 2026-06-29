"use client";

const SERVICES = [
  {
    icon: "💍",
    title: "Weddings & Celebrations",
    desc: "Capturing every emotion of your special day. From preparations to the final dance, we preserve every moment with artistic sensitivity.",
    includes: ["Full coverage", "2 photographers", "Premium album", "Digital gallery"],
    price: "from $1,800",
  },
  {
    icon: "🎭",
    title: "Fine Art Portraits",
    desc: "Individual or family sessions with personalized creative direction. We aim to reveal your true essence in every frame.",
    includes: ["2-hour session", "Choice of location", "50 edited photos", "Private gallery"],
    price: "from $350",
  },
  {
    icon: "🏢",
    title: "Commercial Photography",
    desc: "Products, branding, architecture, and teams. Professional images that elevate your visual presence and connect with your audience.",
    includes: ["Studio or location", "Art direction", "72h delivery", "Commercial license"],
    price: "from $600",
  },
  {
    icon: "✈️",
    title: "Destination & Travel",
    desc: "Accompanying you to any corner of the world. Editorial-style sessions in national and international destinations.",
    includes: ["Travel expenses included", "Sunrise/sunset session", "Cinematic editing"],
    price: "Custom quote",
  },
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ background: "var(--color-bg-card)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>What I Offer</p>
          <h2 className="heading-section">Services</h2>
          <span className="gold-line centered" style={{ margin: "1.5rem auto" }} />
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="card"
              style={{
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Index number */}
              <span
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.75rem",
                  fontFamily: "var(--font-serif)",
                  fontSize: "4rem",
                  fontWeight: 300,
                  color: "rgba(201,169,110,0.06)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                0{i + 1}
              </span>

              <span style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>{s.icon}</span>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--color-cream)",
                  marginBottom: "0.9rem",
                }}
              >
                {s.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.75,
                  marginBottom: "1.5rem",
                }}
              >
                {s.desc}
              </p>

              {/* Includes list */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                {s.includes.map((inc) => (
                  <li
                    key={inc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      fontSize: "0.82rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <span style={{ width: 16, height: 1, background: "var(--color-gold)", flexShrink: 0 }} />
                    {inc}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "auto", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.2rem",
                    color: "var(--color-gold)",
                    fontWeight: 500,
                  }}
                >
                  {s.price}
                </span>
                <a
                  href="#contact"
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    transition: "color 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gold)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
                >
                  Inquire →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
