"use client";

export default function About() {
  return (
    <section id="about-me" className="section" style={{ background: "var(--color-bg)", overflow: "hidden" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(3rem, 8vw, 8rem)",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Image side */}
          <div style={{ position: "relative" }}>
            {/* Gold frame decoration */}
            <div
              className="about-image-decor-1"
              style={{
                position: "absolute",
                top: "-20px",
                left: "-20px",
                width: "60%",
                height: "60%",
                border: "1px solid rgba(201,169,110,0.2)",
                borderRadius: "var(--radius-md)",
                zIndex: 0,
              }}
            />
            <div
              className="about-image-decor-2"
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                width: "60%",
                height: "60%",
                border: "1px solid rgba(201,169,110,0.1)",
                borderRadius: "var(--radius-md)",
                zIndex: 0,
              }}
            />

            {/* Main portrait */}
            <div
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                aspectRatio: "4/5",
                zIndex: 1,
                background: "var(--color-bg-card)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80"
                alt="Luis — Fotógrafo"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(0.85)" }}
              />
              {/* Gold overlay strip */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                }}
              >
                <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Luis Javier</p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: "var(--color-cream)",
                  }}
                >
                  Fine Art Photographer
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                right: "-1.5rem",
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-hover)",
                borderRadius: "var(--radius-md)",
                padding: "1rem 1.25rem",
                zIndex: 2,
                textAlign: "center",
                boxShadow: "var(--shadow-deep)",
              }}
              className="about-badge"
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.2rem",
                  fontWeight: 300,
                  color: "var(--color-gold)",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                15+
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                Years
              </span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>About me</p>
            <h2 className="heading-section" style={{ marginBottom: "0.5rem" }}>
              A unique
            </h2>
            <h2
              className="heading-section"
              style={{
                color: "var(--color-gold)",
                marginBottom: "1.5rem",
                fontStyle: "italic",
              }}
            >
              artistic vision
            </h2>
            <span className="gold-line" />

            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.85,
                marginBottom: "1.5rem",
              }}
            >
              My name is Luis Javier. I have been capturing moments that define stories for over 15 years. 
              Born in Venezuela, my work is deeply influenced by natural light and human emotion.
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.85,
                marginBottom: "2.5rem",
              }}
            >
              I believe the best photography isn't planned — it is felt. My approach is minimalist: 
              less posing, more authenticity. Every session is a dialogue between the lens and the soul.
            </p>

            {/* Skills/values */}
            <div
              className="about-skills-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {[
                { label: "Natural Light", icon: "☀️" },
                { label: "Artistic Editing", icon: "🎨" },
                { label: "Soul Portraits", icon: "🎭" },
                { label: "Unique Moments", icon: "✨" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 1rem",
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "var(--color-text)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn-gold">
              Let's Chat →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-badge { right: 0.5rem !important; }
        }
        @media (max-width: 480px) {
          .about-skills-grid { grid-template-columns: 1fr !important; }
          .about-image-decor-1 { top: -10px !important; left: -10px !important; }
          .about-image-decor-2 { bottom: -10px !important; right: -10px !important; }
        }
      `}</style>
    </section>
  );
}
