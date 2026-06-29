"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay — left side darker for text contrast, right side shows image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(105deg,
              rgba(8,8,8,0.82) 0%,
              rgba(8,8,8,0.65) 45%,
              rgba(8,8,8,0.25) 70%,
              rgba(8,8,8,0.15) 100%
            ),
            linear-gradient(180deg,
              rgba(8,8,8,0.3) 0%,
              rgba(8,8,8,0.0) 40%,
              rgba(8,8,8,0.55) 85%,
              rgba(8,8,8,1.00) 100%
            )
          `,
          zIndex: 2,
        }}
      />

      {/* Hero background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/hero_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Decorative bokeh circles */}
      {[
        { top: "15%", left: "10%", size: 300, opacity: 0.025 },
        { top: "60%", right: "8%", size: 200, opacity: 0.035 },
        { top: "35%", right: "25%", size: 400, opacity: 0.015 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            right: (c as any).right,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(201,169,110,${c.opacity}) 0%, transparent 70%)`,
            filter: "blur(40px)",
            zIndex: 1,
          }}
        />
      ))}

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "6rem" }}>
        <div style={{ maxWidth: "800px" }}>
          {/* Eyebrow */}
          <p
            className="eyebrow"
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.2s ease forwards",
              marginBottom: "1.5rem",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            Fine Art Photography
          </p>

          {/* Main heading */}
          <h1
            className="heading-display"
            style={{
              opacity: 0,
              animation: "fadeUp 0.9s 0.4s ease forwards",
              marginBottom: "0.25rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.6)",
            }}
          >
            Moments
          </h1>
          <h1
            className="heading-display"
            style={{
              opacity: 0,
              animation: "fadeUp 0.9s 0.55s ease forwards",
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, var(--color-gold-light) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "2rem",
              filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.8))",
            }}
          >
            that Last
          </h1>

          {/* Gold line */}
          <span
            className="gold-line"
            style={{
              opacity: 0,
              animation: "fadeUp 0.7s 0.7s ease forwards",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(220, 210, 190, 0.92)",
              lineHeight: 1.7,
              maxWidth: 520,
              opacity: 0,
              animation: "fadeUp 0.8s 0.85s ease forwards",
              marginBottom: "3rem",
              textShadow: "0 1px 12px rgba(0,0,0,0.9)",
            }}
          >
            Capturing the essence of every moment with an artistic vision
            that turns the ephemeral into eternal.
          </p>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              opacity: 0,
              animation: "fadeUp 0.8s 1.05s ease forwards",
            }}
          >
            <a href="#gallery" className="btn btn-gold hero-btn">
              View Gallery
            </a>
            <Link href="/sesiones" className="btn btn-outline hero-btn" style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}>
              Client Portal
            </Link>
            <a href="#contact" className="btn btn-outline hero-btn">
              Book Session
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="hero-stats"
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "5rem",
            opacity: 0,
            animation: "fadeUp 0.8s 1.25s ease forwards",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "15+",  label: "Years of experience" },
            { num: "2.4K", label: "Completed sessions" },
            { num: "340+", label: "Happy clients" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: "var(--color-gold)",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 10,
          opacity: 0,
          animation: "fadeIn 1s 1.8s ease forwards",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-text-faint)",
          }}
        >
          Explore
        </span>
        <ChevronDown size={16} color="var(--color-gold)" style={{ animation: "bounce 2s infinite" }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @media (max-width: 480px) {
          .hero-ctas {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .hero-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .hero-stats {
            gap: 1.5rem !important;
            margin-top: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
