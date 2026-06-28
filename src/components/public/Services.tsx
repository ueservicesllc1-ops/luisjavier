"use client";

const SERVICES = [
  {
    icon: "💍",
    title: "Bodas & Celebraciones",
    desc: "Capturamos cada emoción de tu día especial. Desde los preparativos hasta el último baile, preservamos cada momento con sensibilidad artística.",
    includes: ["Cobertura completa", "2 fotógrafos", "Álbum premium", "Galería digital"],
    price: "desde $1,800",
  },
  {
    icon: "🎭",
    title: "Retratos de Arte",
    desc: "Sesiones individuales o familiares con dirección creativa personalizada. Buscamos revelar tu esencia auténtica en cada toma.",
    includes: ["2 horas de sesión", "Locación a elegir", "50 fotos editadas", "Galería privada"],
    price: "desde $350",
  },
  {
    icon: "🏢",
    title: "Fotografía Comercial",
    desc: "Productos, marcas, espacios y equipos. Imágenes profesionales que elevan tu presencia visual y conectan con tu audiencia.",
    includes: ["Estudio o locación", "Dirección de arte", "Entrega en 72h", "Licencia comercial"],
    price: "desde $600",
  },
  {
    icon: "✈️",
    title: "Destino & Viajes",
    desc: "Te acompaño a cualquier rincón del mundo. Sesiones en destinos nacionales e internacionales con estética editorial.",
    includes: ["Viaje incluido en cotización", "Sesión amanecer/atardecer", "Edición cinemática"],
    price: "Cotización especial",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="section" style={{ background: "var(--color-bg-card)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>Lo que ofrezco</p>
          <h2 className="heading-section">Servicios</h2>
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
                  href="#contacto"
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
                  Consultar →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
