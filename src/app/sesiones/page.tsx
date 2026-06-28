"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAnonymously, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Key, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function GeneralClientPortal() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setError("");
    setVerifying(true);

    try {
      // 1. Sign in anonymously first to satisfy Firestore read rules
      await signInAnonymously(auth);

      // 2. Look up client by PIN
      const q = query(collection(db, "clients"), where("pin", "==", pin.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Sign out if PIN check fails
        await signOut(auth);
        setError("PIN de acceso incorrecto. Por favor verifícalo con tu fotógrafo.");
        setVerifying(false);
        return;
      }

      const clientDoc = snap.docs[0];
      const clientData = clientDoc.data();

      // 3. Cache details
      localStorage.setItem(
        "client_session",
        JSON.stringify({
          id: clientDoc.id,
          name: clientData.name,
          pin: pin.trim(),
        })
      );

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Error al autorizar el acceso: " + (err.message || err));
      // Sign out on error
      try { await signOut(auth); } catch {}
    } finally {
      setVerifying(false);
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
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ width: "100%", maxWidth: 440, padding: "1.5rem", zIndex: 1, animation: "fadeUp 0.6s ease" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="serif" style={{ fontSize: "2rem", color: "var(--color-cream)", display: "block" }}>Luis</span>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-gold)" }}>Fotografía</span>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: "2.5rem", background: "var(--color-bg-card)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ textAlign: "center", marginBottom: "0.55rem" }}>
            <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>Portal de Clientes</span>
            <h1 className="serif" style={{ fontSize: "1.6rem", color: "var(--color-cream)", marginTop: "0.25rem" }}>
              Ver Mis Fotos
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
              Ingresa el PIN de acceso único que te proporcionó tu fotógrafo.
            </p>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-md)", padding: "0.85rem", fontSize: "0.82rem", color: "#f87171", textAlign: "center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAccess} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                PIN de Acceso
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input"
                  required
                  placeholder="Ej. 1619"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  style={{ paddingLeft: "3rem", textAlign: "center", letterSpacing: pin ? "0.3em" : "normal", fontSize: pin ? "1.2rem" : "0.9rem" }}
                />
                <Key size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-gold" disabled={verifying} style={{ justifyContent: "center" }}>
              {verifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Accediendo...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  Ingresar
                </>
              )}
            </button>
          </form>

        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "0.78rem", color: "var(--color-text-faint)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            ← Volver al inicio
          </Link>
          <Link href="/login" style={{ fontSize: "0.78rem", color: "var(--color-gold)", transition: "opacity 0.2s" }}>
            Acceso Fotógrafo →
          </Link>
        </div>

      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
