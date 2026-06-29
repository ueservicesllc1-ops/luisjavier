"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Key, LogIn, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ClientData {
  id: string;
  name: string;
  pin: string;
}

export default function ClientSessionPortal() {
  const router = useRouter();
  const { slug } = useParams();

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
        const q = query(collection(db, "clients"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const doc = snap.docs[0];
          setClient({
            id: doc.id,
            name: doc.data().name,
            pin: doc.data().pin,
          });
        }
      } catch (err) {
        console.error("Error fetching client by slug:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !pin) return;
    setError("");
    setVerifying(true);

    if (pin.trim() !== client.pin) {
      setError("Incorrect access PIN. Please double-check it.");
      setVerifying(false);
      return;
    }

    try {
      // Sign in anonymously to satisfy security rules
      await signInAnonymously(auth);

      // Save session info
      localStorage.setItem(
        "client_session",
        JSON.stringify({
          id: client.id,
          name: client.name,
          pin: client.pin,
        })
      );

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Error authorizing access: " + (err.message || err));
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-gold)" }} />
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", gap: "1rem" }}>
        <h1 className="serif" style={{ fontSize: "2rem", color: "var(--color-cream)" }}>Session Not Found</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>The link you entered is invalid or has expired.</p>
        <Link href="/" className="btn btn-gold" style={{ marginTop: "1rem" }}>Back to site</Link>
      </div>
    );
  }

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
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-gold)" }}>Photography</span>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: "2.5rem", background: "var(--color-bg-card)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>Private Gallery</span>
            <h1 className="serif" style={{ fontSize: "1.6rem", color: "var(--color-cream)", marginTop: "0.25rem" }}>
              {client.name}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
              Please enter your security PIN to access your photos.
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
                Access PIN
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input"
                  required
                  placeholder="Enter your PIN"
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
                  Accessing...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  View My Photos
                </>
              )}
            </button>
          </form>

        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "0.78rem", color: "var(--color-text-faint)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            ← Back to home
          </Link>
          <Link href="/login" style={{ fontSize: "0.78rem", color: "var(--color-gold)", transition: "opacity 0.2s" }}>
            Photographer Access →
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
