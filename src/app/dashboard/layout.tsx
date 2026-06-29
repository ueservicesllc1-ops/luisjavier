"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LogOut, Camera, LayoutDashboard, User as UserIcon, Shield } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "2px solid var(--color-border)",
            borderTopColor: "var(--color-gold)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: "rgba(8,8,8,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0.85rem 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container header-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                color: "var(--color-cream)",
                letterSpacing: "-0.02em",
              }}
            >
              Luis
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.55rem",
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              Photography
            </span>
          </Link>

          {/* Nav pills */}
          <nav style={{ display: "flex", gap: "0.25rem", alignItems: "center" }} className="dash-nav">
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--color-gold-muted)";
                el.style.color = "var(--color-gold)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "var(--color-text-muted)";
              }}
            >
              <LayoutDashboard size={14} />
              My Sessions
            </Link>

            {user && (user.email === "ueservicesllc1@gmail.com" || user.email === "cliente@demo.com") && (
              <Link
                href="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.78rem",
                  color: "var(--color-gold)",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--color-gold-muted)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                }}
              >
                <Shield size={14} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* User info + logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 0.9rem",
                background: "var(--color-bg-elevated)",
                borderRadius: "100px",
                border: "1px solid var(--color-border)",
              }}
              className="user-pill"
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--color-gold-muted)",
                  border: "1px solid rgba(201,169,110,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserIcon size={13} color="var(--color-gold)" />
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--color-text)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.displayName || user.email?.split("@")[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                transition: "all 0.2s",
                cursor: "pointer",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#f87171";
                el.style.color = "#f87171";
                el.style.background = "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-border)";
                el.style.color = "var(--color-text-muted)";
                el.style.background = "transparent";
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, paddingBlock: "2.5rem" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 600px) {
          .header-container {
            flex-direction: column !important;
            gap: 0.75rem !important;
            align-items: center !important;
          }
          .user-pill span { display: none !important; }
        }
      `}</style>
    </div>
  );
}
