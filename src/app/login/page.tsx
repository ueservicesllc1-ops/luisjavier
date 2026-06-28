"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      const msgs: Record<string, string> = {
        "auth/user-not-found": "No existe una cuenta con este correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-email": "Correo inválido.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
        "auth/invalid-credential": "Credenciales incorrectas.",
      };
      setError(msgs[err.code] || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "clients", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName || "Cliente Google",
          email: user.email || "",
          phone: user.phoneNumber || "",
          createdAt: Timestamp.now(),
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError("Error al iniciar sesión con Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decor */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "-15%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "clamp(1.5rem, 5vw, 3rem)",
          margin: "1rem",
          animation: "fadeUp 0.6s ease",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
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
              Fotografía
            </span>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--color-cream)",
              marginBottom: "0.5rem",
            }}
          >
            Iniciar Sesión
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
            Acceso para el fotógrafo / administrador
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Gold top line */}
          <div
            style={{
              height: "2px",
              background: "linear-gradient(90deg, var(--color-gold) 0%, transparent 100%)",
              margin: "-2rem -2rem 0",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            }}
          />

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "var(--radius-md)",
                padding: "0.85rem 1rem",
                fontSize: "0.85rem",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "0.55rem",
              }}
            >
              Correo electrónico
            </label>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "0.55rem",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPass ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gold)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{
              justifyContent: "center",
              marginTop: "0.5rem",
              opacity: loading ? 0.75 : 1,
              transition: "all 0.3s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Ingresando...
              </>
            ) : (
              <>
                <LogIn size={15} />
                Ingresar
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", marginBlock: "0.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            <span style={{ paddingInline: "1rem", fontSize: "0.72rem", color: "var(--color-text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>o</span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline"
            style={{
              justifyContent: "center",
              gap: "0.75rem",
              opacity: loading ? 0.75 : 1,
              transition: "all 0.3s",
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: "4px" }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--color-text-faint)" }}>
          ¿Problemas para acceder?{" "}
          <a href="mailto:luisuf@gmail.com" style={{ color: "var(--color-gold)", transition: "opacity 0.2s" }}>
            Contáctame
          </a>
        </p>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/" style={{ fontSize: "0.78rem", color: "var(--color-text-faint)", transition: "color 0.2s" }}>
            ← Volver al sitio
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
