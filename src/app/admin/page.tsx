"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Upload,
  FolderOpen,
  Image as ImageIcon,
  Check,
  Plus,
  Loader2,
  Calendar,
  MapPin,
  FileText,
  User,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ClientOption {
  id: string;
  name: string;
  pin: string;
  slug?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Form states
  const [selectedClientId, setSelectedClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientPin, setNewClientPin] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    filename: string;
    status: "idle" | "uploading" | "success" | "error";
  }>({ current: 0, total: 0, filename: "", status: "idle" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Auth Guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setCheckingAuth(false);
        fetchClients();
        fetchSessions();
      }
    });
    return () => unsub();
  }, [router]);

  const fetchClients = async () => {
    try {
      const snap = await getDocs(collection(db, "clients"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Sin nombre",
        pin: doc.data().pin || "",
        slug: doc.data().slug || "",
      }));
      setClients(list);
    } catch (e) {
      console.error("Error fetching clients:", e);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const snap = await getDocs(collection(db, "sessions"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(list);
    } catch (e) {
      console.error("Error fetching sessions:", e);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPin) return;
    setCreatingClient(true);
    try {
      const slug = newClientName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const clientRef = doc(collection(db, "clients"));
      await setDoc(clientRef, {
        name: newClientName,
        pin: newClientPin,
        phone: newClientPhone,
        slug,
        createdAt: Timestamp.now(),
      });
      const newOption = { id: clientRef.id, name: newClientName, pin: newClientPin, slug };
      setClients((prev) => [newOption, ...prev]);
      setSelectedClientId(clientRef.id);
      setNewClientName("");
      setNewClientPin("");
      setNewClientPhone("");
      alert(`Cliente "${newOption.name}" creado con éxito.`);
    } catch (err: any) {
      console.error(err);
      alert("Error al crear cliente: " + err.message);
    } finally {
      setCreatingClient(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800 });
      };
      img.onerror = () => {
        resolve({ width: 1200, height: 800 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFilesToUpload((prev) => [...prev, ...filesArray]);
    }
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Por favor selecciona un cliente.");
      return;
    }
    if (!title || !date) {
      alert("El título y la fecha son campos requeridos.");
      return;
    }
    if (filesToUpload.length === 0) {
      alert("Por favor selecciona al menos una foto para subir.");
      return;
    }

    setUploadProgress({ current: 0, total: filesToUpload.length, filename: "", status: "uploading" });

    try {
      // 1. Create Session in Firestore
      const sessionRef = await addDoc(collection(db, "sessions"), {
        clientId: selectedClientId,
        title,
        location,
        description,
        date: Timestamp.fromDate(new Date(date)),
        status: "ready", // or processing
        photoCount: filesToUpload.length,
        videoCount: 0,
        createdAt: Timestamp.now(),
      });

      let coverImageUrl = "";

      // 2. Upload photos one by one
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress({
          current: i + 1,
          total: filesToUpload.length,
          filename: file.name,
          status: "uploading",
        });

        // B2 Key structure: sessions/{sessionId}/photos/{filename}
        const b2Key = `sessions/${sessionRef.id}/photos/${Date.now()}_${file.name}`;
        
        // Upload to server side B2 API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("key", b2Key);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        // Get Dimensions
        const dimensions = await getImageDimensions(file);

        // Add Photo doc to Firestore
        await addDoc(collection(db, "photos"), {
          sessionId: sessionRef.id,
          filename: file.name,
          b2Key,
          thumbnailKey: b2Key,
          width: dimensions.width,
          height: dimensions.height,
          size: file.size,
          downloadCount: 0,
          order: i,
          createdAt: Timestamp.now(),
        });

        // Set first photo as session cover image url
        if (i === 0) {
          coverImageUrl = `${process.env.NEXT_PUBLIC_B2_URL || "https://s3.us-east-005.backblazeb2.com/photogra"}/${b2Key}`;
        }
      }

      // 3. Update session with coverImageUrl
      if (coverImageUrl) {
        await updateDoc(doc(db, "sessions", sessionRef.id), {
          coverImageUrl,
        });
      }

      setUploadProgress((prev) => ({ ...prev, status: "success" }));
      alert("¡Sesión creada y fotos subidas con éxito!");
      
      // Clear forms
      setTitle("");
      setLocation("");
      setDescription("");
      setDate("");
      setFilesToUpload([]);
      await fetchSessions();
    } catch (err: any) {
      console.error(err);
      setUploadProgress((prev) => ({ ...prev, status: "error" }));
      alert("Ocurrió un error al subir: " + err.message);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-gold)" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)", paddingBlock: "3rem" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* Header back link */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: 0 }}>
            <ArrowLeft size={16} />
            Ir al Dashboard
          </Link>
          <span className="badge badge-gold">Panel Administrador</span>
        </div>

        <h1 className="serif" style={{ fontSize: "2.4rem", color: "var(--color-cream)", marginBottom: "2.5rem" }}>
          Administrar <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>Sesiones & Proyectos</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }} className="admin-grid">
          
          {/* Main session configuration form */}
          <div>
            <form onSubmit={handleUploadAndSave} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h2 className="serif" style={{ fontSize: "1.5rem", color: "var(--color-cream)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
                1. Crear Nueva Sesión
              </h2>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Seleccionar Cliente
                </label>
                {loadingClients ? (
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Cargando clientes...</p>
                ) : (
                  <select
                    className="input"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                    style={{ appearance: "none" }}
                  >
                    <option value="" style={{ background: "#111" }}>Selecciona un cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} style={{ background: "#111" }}>
                        {c.name} (PIN: {c.pin})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Título del Proyecto / Sesión
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="input"
                    required
                    placeholder="Ej. Boda Civil Maria & Juan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row-2">
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="input"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Locación
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Ej. Caracas, Venezuela"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Descripción
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Detalles o descripción corta del evento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>

              {/* Upload source selectors */}
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  2. Cargar Fotos
                </label>
                
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                  {/* Select Files button */}
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: "0.72rem", padding: "0.6rem 1rem", justifyContent: "center" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={14} />
                    Seleccionar Fotos
                  </button>

                  {/* Select Folder button */}
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: "0.72rem", padding: "0.6rem 1rem", justifyContent: "center" }}
                    onClick={() => folderInputRef.current?.click()}
                  >
                    <FolderOpen size={14} />
                    Subir Carpeta
                  </button>
                </div>

                {/* Hidden input tags */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {/* Folder input uses standard directory / webkitdirectory tags to allow complete folders */}
                <input
                  type="file"
                  ref={folderInputRef}
                  style={{ display: "none" }}
                  multiple
                  // @ts-ignore
                  webkitdirectory=""
                  directory=""
                  onChange={handleFileChange}
                />

                {/* File preview summary */}
                {filesToUpload.length > 0 && (
                  <div style={{ padding: "0.75rem 1rem", background: "var(--color-bg-elevated)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", maxHeight: 150, overflowY: "auto" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-gold)", fontWeight: 500, marginBottom: "0.4rem" }}>
                      {filesToUpload.length} foto(s) en cola:
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {filesToUpload.slice(0, 15).map((f, index) => (
                        <li key={index} style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          ✓ {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                      {filesToUpload.length > 15 && (
                        <li style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", fontStyle: "italic" }}>
                          ... y {filesToUpload.length - 15} archivos más.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Progress UI */}
              {uploadProgress.status !== "idle" && (
                <div style={{ background: "var(--color-bg-elevated)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--color-cream)" }}>
                      {uploadProgress.status === "uploading"
                        ? `Subiendo: ${uploadProgress.filename}`
                        : uploadProgress.status === "success"
                        ? "¡Completado!"
                        : "Error en subida"}
                    </span>
                    <span style={{ color: "var(--color-gold)", fontWeight: 500 }}>
                      {uploadProgress.current} / {uploadProgress.total} fotos
                    </span>
                  </div>
                  
                  {/* Outer Bar */}
                  <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                        height: "100%",
                        background: "var(--color-gold)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Submit btn */}
              <button
                type="submit"
                className="btn btn-gold"
                disabled={uploadProgress.status === "uploading"}
                style={{ justifyContent: "center", marginTop: "1rem" }}
              >
                {uploadProgress.status === "uploading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Subiendo Fotos...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Guardar y Subir Proyecto
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Client creation side panel */}
          <div>
            <form onSubmit={handleCreateClient} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderStyle: "dashed" }}>
              <h2 className="serif" style={{ fontSize: "1.4rem", color: "var(--color-cream)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
                Crear Nuevo Perfil de Cliente
              </h2>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Ej. Ana Martínez"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  PIN de Acceso (Ej. 4 dígitos)
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Ej. 1234"
                  value={newClientPin}
                  onChange={(e) => setNewClientPin(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Teléfono (Opcional)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ej. +58 412 123 4567"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={creatingClient}
                style={{ justifyContent: "center", marginTop: "0.5rem" }}
              >
                {creatingClient ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Crear Cliente
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Sessions List Section */}
        <div style={{ marginTop: "4rem" }}>
          <h2 className="serif" style={{ fontSize: "1.8rem", color: "var(--color-cream)", marginBottom: "1.5rem" }}>
            Sesiones Creadas
          </h2>

          {loadingSessions ? (
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>Cargando sesiones...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>No se han creado sesiones todavía.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {sessions.map((sess) => {
                const client = clients.find((c) => c.id === sess.clientId);
                const accessUrl = typeof window !== "undefined"
                  ? `${window.location.origin}/sesiones/${client?.slug || ""}`
                  : "";

                return (
                  <div key={sess.id} className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: 60, height: 60, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-bg-elevated)", flexShrink: 0 }}>
                        {sess.coverImageUrl ? (
                          <img src={sess.coverImageUrl} alt={sess.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📷</div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 className="serif" style={{ fontSize: "1.2rem", color: "var(--color-cream)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{sess.title}</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>📍 {sess.location || "Sin ubicación"}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <p>👤 <strong>Cliente:</strong> {client?.name || "Desconocido"}</p>
                      <p>🔑 <strong>PIN de Acceso:</strong> <span style={{ color: "var(--color-gold)", fontWeight: "bold" }}>{client?.pin || "Ninguno"}</span></p>
                      <p>🖼️ <strong>Fotos:</strong> {sess.photoCount || 0} archivos</p>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                      <button
                        onClick={() => {
                          if (accessUrl) {
                            navigator.clipboard.writeText(accessUrl);
                            alert("¡Enlace de acceso copiado al portapapeles!");
                          }
                        }}
                        className="btn btn-outline"
                        style={{ width: "100%", fontSize: "0.72rem", padding: "0.5rem 1rem", justifyContent: "center", gap: "0.4rem" }}
                      >
                        Copiar Enlace de Acceso
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
