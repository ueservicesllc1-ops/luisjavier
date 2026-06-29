"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";

const navLinks = [
  { href: "#gallery",   label: "Gallery" },
  { href: "#services",  label: "Services" },
  { href: "#about-me",  label: "About Me" },
  { href: "#contact",   label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        padding: scrolled ? "0.9rem 0" : "1.5rem 0",
        background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.12)" : "1px solid transparent",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: 400,
              color: "var(--color-cream)",
              lineHeight: 1,
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
        </Link>

        {/* Desktop Nav */}
        <ul
          style={{
            display: "flex",
            gap: "2.5rem",
            listStyle: "none",
            alignItems: "center",
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  transition: "color 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gold)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-text-muted)")}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/sesiones" className="btn btn-outline" style={{ padding: "0.55rem 1.2rem", fontSize: "0.72rem" }}>
              Client Portal
            </Link>
            <Link href="/login" className="btn btn-gold" style={{ padding: "0.55rem 1.2rem", fontSize: "0.72rem" }}>
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="menu-toggle"
          aria-label="Menú"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none" }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(8,8,8,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--color-border)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text)",
              }}
            >
              {link.label}
            </a>
          ))}
          <Link href="/sesiones" className="btn btn-outline" style={{ textAlign: "center", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
            Client Portal
          </Link>
          <Link href="/login" className="btn btn-gold" style={{ textAlign: "center", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .menu-toggle { display: flex !important; flex-direction: column; gap: 5px; }
          .menu-toggle span { width: 24px; height: 1px; background: var(--color-cream); transition: all 0.3s; }
        }
      `}</style>
    </nav>
  );
}
