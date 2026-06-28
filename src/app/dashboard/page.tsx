"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getClientSessions, getClientProfile, Session, ClientProfile } from "@/lib/firestore";
import Link from "next/link";
import { Calendar, Images, Clock, ChevronRight, Sparkles } from "lucide-react";

function formatDate(ts: any) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

const STATUS_MAP = {
  ready: { label: "Lista", class: "badge-ready" },
  processing: { label: "Procesando", class: "badge-processing" },
  archived: { label: "Archivada", class: "badge-gold" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      let targetClientId = user.uid;

      if (user.isAnonymous) {
        const cached = localStorage.getItem("client_session");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            targetClientId = parsed.id;
          } catch (e) {
            console.error("Error parsing client session", e);
          }
        }
      }

      const [prof, sess] = await Promise.all([
        getClientProfile(targetClientId),
        getClientSessions(targetClientId),
      ]);
      setProfile(prof);
      setSessions(sess);
      setLoading(false);
    })();
  }, [user]);

  const readySessions   = sessions.filter((s) => s.status === "ready");
  const totalPhotos     = sessions.reduce((a, s) => a + (s.photoCount || 0), 0);

  if (loading) {
    return (
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ height: 100, background: "var(--color-bg-card)" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.04), transparent)", backgroundSize: "200%", animation: "shimmer 1.5s infinite" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Cliente";

  return (
    <div className="container">
      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-bg-card) 0%, rgba(201,169,110,0.05) 100%)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 2.5rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Sparkles size={16} color="var(--color-gold)" style={{ marginBottom: "0.75rem" }} />
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 400,
            color: "var(--color-cream)",
            marginBottom: "0.4rem",
          }}
        >
          Bienvenido,{" "}
          <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>{displayName}</span>
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Aquí encontrarás todas tus sesiones fotográficas. Descarga tus fotos cuando quieras.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
        className="stats-grid"
      >
        {[
          { icon: <Images size={20} color="var(--color-gold)" />, label: "Sesiones totales", value: sessions.length },
          { icon: <Calendar size={20} color="var(--color-gold)" />, label: "Sesiones listas", value: readySessions.length },
          { icon: <Clock size={20} color="var(--color-gold)" />, label: "Fotos disponibles", value: totalPhotos.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{
              padding: "1.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: "var(--color-gold-muted)",
                border: "1px solid rgba(201,169,110,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.8rem",
                  fontWeight: 300,
                  color: "var(--color-cream)",
                  lineHeight: 1,
                  marginBottom: "0.2rem",
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "var(--color-cream)",
          }}
        >
          Mis Sesiones
        </h2>
      </div>

      {sessions.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📷</div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
            Sin sesiones aún
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-faint)" }}>
            Cuando tu fotógrafo suba tus fotos, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const statusInfo = STATUS_MAP[session.status] || STATUS_MAP.processing;

  return (
    <Link
      href={`/dashboard/session/${session.id}`}
      style={{
        display: "block",
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(201,169,110,0.4)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(201,169,110,0.06)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", paddingBottom: "58%", background: "var(--color-bg-elevated)" }}>
        {session.coverImageUrl ? (
          <img
            src={session.coverImageUrl}
            alt={session.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--color-bg-card), var(--color-bg-elevated))",
            }}
          >
            <Images size={40} color="var(--color-text-faint)" />
          </div>
        )}
        {/* Status badge overlay */}
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
          <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
        </div>
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "var(--color-cream)",
            marginBottom: "0.35rem",
          }}
        >
          {session.title}
        </h3>

        {session.location && (
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
            📍 {session.location}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              📷 {session.photoCount || 0} fotos
            </span>
            {(session.videoCount ?? 0) > 0 && (
              <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                🎬 {session.videoCount} videos
              </span>
            )}
          </div>
          <ChevronRight size={16} color="var(--color-gold)" />
        </div>

        <p style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginTop: "0.5rem" }}>
          {formatDate(session.date)}
        </p>
      </div>
    </Link>
  );
}
