"use client";
import Link from "next/link";
import { Camera, Video, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        padding: "3rem 0 2rem",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "0.75rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: "var(--color-cream)",
                  lineHeight: 1,
                  display: "block",
                  letterSpacing: "-0.02em",
                }}
              >
                Luis
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                }}
              >
                Photography
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", maxWidth: 240, lineHeight: 1.7 }}>
              Capturing moments with soul. Professional photographer available for travel.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>Navigate</p>
              {["Gallery", "Services", "About Me", "Contact"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(" ", "-")}`}
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.6rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gold)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
                >
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>Clients</p>
              <Link
                href="/login"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.6rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gold)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>Social</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { icon: <Camera size={16} />, href: "#", label: "Instagram" },
                { icon: <Video size={16} />, href: "#", label: "YouTube" },
                { icon: <Mail size={16} />, href: "mailto:luisuf@gmail.com", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-muted)",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--color-gold)";
                    el.style.color = "var(--color-gold)";
                    el.style.background = "var(--color-gold-muted)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--color-border)";
                    el.style.color = "var(--color-text-muted)";
                    el.style.background = "transparent";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-faint)" }}>
            © {year} Luis Photography. All rights reserved.
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-faint)" }}>
            Made with{" "}
            <span style={{ color: "var(--color-gold)" }}>♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
