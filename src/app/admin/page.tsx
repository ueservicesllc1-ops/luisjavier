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
  query,
  where,
  orderBy,
  deleteDoc,
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
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
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

  // Photos detail modal states
  const [manageSessionId, setManageSessionId] = useState<string | null>(null);
  const [managePhotos, setManagePhotos] = useState<any[]>([]);
  const [loadingManagePhotos, setLoadingManagePhotos] = useState(false);

  // Form states
  const [editMode, setEditMode] = useState<"create" | "add_photos">("create");
  const [selectedSessionId, setSelectedSessionId] = useState("");
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

  const handleAddPhotosToSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) {
      alert("Please select a session.");
      return;
    }
    if (filesToUpload.length === 0) {
      alert("Please select at least one photo to upload.");
      return;
    }

    setUploadProgress({ current: 0, total: filesToUpload.length, filename: "", status: "uploading" });

    try {
      const sessionDoc = sessions.find((s) => s.id === selectedSessionId);
      if (!sessionDoc) throw new Error("Session not found");

      let currentPhotoCount = sessionDoc.photoCount || 0;
      let coverImageUrl = sessionDoc.coverImageUrl || "";

      // Upload photos one by one
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress({
          current: i + 1,
          total: filesToUpload.length,
          filename: file.name,
          status: "uploading",
        });

        // B2 Key structure: sessions/{sessionId}/photos/{filename}
        const b2Key = `sessions/${selectedSessionId}/photos/${Date.now()}_${file.name}`;
        
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
          sessionId: selectedSessionId,
          filename: file.name,
          b2Key,
          thumbnailKey: b2Key,
          width: dimensions.width,
          height: dimensions.height,
          size: file.size,
          downloadCount: 0,
          order: currentPhotoCount + i,
          createdAt: Timestamp.now(),
        });

        // Set cover if not set
        if (!coverImageUrl && i === 0) {
          coverImageUrl = `${process.env.NEXT_PUBLIC_B2_URL || "https://s3.us-east-005.backblazeb2.com/photogra"}/${b2Key}`;
        }
      }

      // Update session with new photoCount and coverImageUrl
      await updateDoc(doc(db, "sessions", selectedSessionId), {
        photoCount: currentPhotoCount + filesToUpload.length,
        ...(coverImageUrl ? { coverImageUrl } : {}),
      });

      setUploadProgress((prev) => ({ ...prev, status: "success" }));
      alert("Photos added to session successfully!");

      // Clear forms
      setFilesToUpload([]);
      setSelectedSessionId("");
      await fetchSessions();
    } catch (err: any) {
      console.error(err);
      setUploadProgress((prev) => ({ ...prev, status: "error" }));
      alert("An error occurred while uploading: " + err.message);
    }
  };

  const openManageModal = async (sessionId: string) => {
    setManageSessionId(sessionId);
    setLoadingManagePhotos(true);
    setManagePhotos([]);
    try {
      const q = query(
        collection(db, "photos"),
        where("sessionId", "==", sessionId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const photosList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setManagePhotos(photosList);
    } catch (err) {
      console.error("Error loading photos:", err);
    } finally {
      setLoadingManagePhotos(false);
    }
  };

  const closeManageModal = () => {
    setManageSessionId(null);
    setManagePhotos([]);
  };

  const handleDeletePhoto = async (photoId: string, sessionId: string, photoB2Key: string) => {
    if (!window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      return;
    }

    try {
      // 1. Delete Firestore document
      await deleteDoc(doc(db, "photos", photoId));

      // 2. Fetch the session to see its current state
      const sessionDoc = sessions.find((s) => s.id === sessionId);
      if (sessionDoc) {
        const newPhotoCount = Math.max(0, (sessionDoc.photoCount || 0) - 1);
        let updatedFields: any = { photoCount: newPhotoCount };

        // Check if the deleted photo was the cover image
        const isCover = sessionDoc.coverImageUrl && sessionDoc.coverImageUrl.includes(photoB2Key);
        
        // 3. Update B2 cover if needed
        if (isCover) {
          // Find another photo to set as cover
          const remainingPhotos = managePhotos.filter((p) => p.id !== photoId);
          if (remainingPhotos.length > 0) {
            const nextPhoto = remainingPhotos[0];
            const baseUrl = process.env.NEXT_PUBLIC_B2_URL || "https://s3.us-east-005.backblazeb2.com/photogra";
            updatedFields.coverImageUrl = `${baseUrl}/${nextPhoto.b2Key}`;
          } else {
            updatedFields.coverImageUrl = "";
          }
        }

        // 4. Update the session in Firestore
        await updateDoc(doc(db, "sessions", sessionId), {
          ...updatedFields
        });
      }

      // 5. Update local state
      setManagePhotos((prev) => prev.filter((p) => p.id !== photoId));

      // 6. Refresh sessions list
      await fetchSessions();
      alert("Photo deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting photo:", err);
      alert("Failed to delete photo: " + err.message);
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
            Go to Dashboard
          </Link>
          <span className="badge badge-gold">Admin Panel</span>
        </div>

        <h1 className="serif" style={{ fontSize: "2.4rem", color: "var(--color-cream)", marginBottom: "2.5rem" }}>
          Manage <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>Sessions & Projects</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }} className="admin-grid">
          
          {/* Main session configuration form */}
          <div>
            <form onSubmit={editMode === "create" ? handleUploadAndSave : handleAddPhotosToSession} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode("create");
                    setFilesToUpload([]);
                  }}
                  className={`btn ${editMode === "create" ? "btn-gold" : "btn-outline"}`}
                  style={{ flex: 1, padding: "0.5rem 1rem", fontSize: "0.75rem", justifyContent: "center" }}
                >
                  Create New Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode("add_photos");
                    setFilesToUpload([]);
                  }}
                  className={`btn ${editMode === "add_photos" ? "btn-gold" : "btn-outline"}`}
                  style={{ flex: 1, padding: "0.5rem 1rem", fontSize: "0.75rem", justifyContent: "center" }}
                >
                  Add Photos to Existing
                </button>
              </div>

              <h2 className="serif" style={{ fontSize: "1.5rem", color: "var(--color-cream)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
                {editMode === "create" ? "1. Create New Session" : "1. Add Photos to Session"}
              </h2>

              {editMode === "add_photos" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Select Session
                  </label>
                  {loadingSessions ? (
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Loading sessions...</p>
                  ) : (
                    <select
                      className="input"
                      value={selectedSessionId}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      required
                      style={{ appearance: "none" }}
                    >
                      <option value="" style={{ background: "#111" }}>Select a session</option>
                      {sessions.map((s) => {
                        const cl = clients.find((c) => c.id === s.clientId);
                        return (
                          <option key={s.id} value={s.id} style={{ background: "#111" }}>
                            {s.title} ({cl?.name || "Unknown client"})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              )}

              {editMode === "create" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      Select Client
                    </label>
                    {loadingClients ? (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Loading clients...</p>
                    ) : (
                      <select
                        className="input"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        required
                        style={{ appearance: "none" }}
                      >
                        <option value="" style={{ background: "#111" }}>Select a client</option>
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
                      Project / Session Title
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="input"
                        required
                        placeholder="e.g. Civil Wedding Maria & Juan"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row-2">
                    <div>
                      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                        Date
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
                        Location
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Caracas, Venezuela"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      Description
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Details or short description of the event..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: "none" }}
                    />
                  </div>
                </>
              )}

              {/* Upload source selectors */}
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  2. Upload Photos
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
                    Select Photos
                  </button>

                  {/* Select Folder button */}
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: "0.72rem", padding: "0.6rem 1rem", justifyContent: "center" }}
                    onClick={() => folderInputRef.current?.click()}
                  >
                    <FolderOpen size={14} />
                    Upload Folder
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
                      {filesToUpload.length} photo(s) queued:
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {filesToUpload.slice(0, 15).map((f, index) => (
                        <li key={index} style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          ✓ {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                      {filesToUpload.length > 15 && (
                        <li style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", fontStyle: "italic" }}>
                          ... and {filesToUpload.length - 15} more files.
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
                        ? `Uploading: ${uploadProgress.filename}`
                        : uploadProgress.status === "success"
                        ? "Completed!"
                        : "Upload error"}
                    </span>
                    <span style={{ color: "var(--color-gold)", fontWeight: 500 }}>
                      {uploadProgress.current} / {uploadProgress.total} photos
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
                    Uploading Photos...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    {editMode === "create" ? "Save & Upload Project" : "Add Photos to Session"}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Client creation side panel */}
          <div>
            <form onSubmit={handleCreateClient} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderStyle: "dashed" }}>
              <h2 className="serif" style={{ fontSize: "1.4rem", color: "var(--color-cream)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
                Create New Client Profile
              </h2>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="e.g. Jane Doe"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Access PIN (e.g. 4 digits)
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="e.g. 1234"
                  value={newClientPin}
                  onChange={(e) => setNewClientPin(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. +1 (201) 555-0199"
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Create Client
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Sessions List Section */}
        <div style={{ marginTop: "4rem" }}>
          <h2 className="serif" style={{ fontSize: "1.8rem", color: "var(--color-cream)", marginBottom: "1.5rem" }}>
            Created Sessions
          </h2>

          {loadingSessions ? (
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>No sessions have been created yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>📍 {sess.location || "No location"}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <p>👤 <strong>Client:</strong> {client?.name || "Unknown"}</p>
                      <p>🔑 <strong>Access PIN:</strong> <span style={{ color: "var(--color-gold)", fontWeight: "bold" }}>{client?.pin || "None"}</span></p>
                      <p>🖼️ <strong>Photos:</strong> {sess.photoCount || 0} files</p>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <button
                        onClick={() => {
                          if (accessUrl) {
                            navigator.clipboard.writeText(accessUrl);
                            alert("Access link copied to clipboard!");
                          }
                        }}
                        className="btn btn-outline"
                        style={{ width: "100%", fontSize: "0.72rem", padding: "0.5rem 1rem", justifyContent: "center", gap: "0.4rem" }}
                      >
                        Copy Access Link
                      </button>

                      <button
                        onClick={() => openManageModal(sess.id)}
                        className="btn btn-ghost"
                        style={{ width: "100%", fontSize: "0.72rem", padding: "0.5rem 1rem", justifyContent: "center", gap: "0.4rem" }}
                      >
                        <ImageIcon size={14} />
                        Manage Photos ({sess.photoCount || 0})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Manage Photos Modal */}
      {manageSessionId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "800px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              position: "relative",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeManageModal}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "transparent",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <h2 className="serif" style={{ fontSize: "1.8rem", color: "var(--color-cream)", marginBottom: "0.5rem" }}>
              {sessions.find((s) => s.id === manageSessionId)?.title || "Manage Session Photos"}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
              Review and delete photos from this session.
            </p>

            {loadingManagePhotos ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
                <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-gold)" }} />
              </div>
            ) : managePhotos.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>📷</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No photos in this session.</p>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "1rem",
                  paddingRight: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {managePhotos.map((photo) => {
                  const photoUrl = `${process.env.NEXT_PUBLIC_B2_URL || "https://s3.us-east-005.backblazeb2.com/photogra"}/${photo.b2Key}`;
                  return (
                    <div
                      key={photo.id}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        background: "var(--color-bg-elevated)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <img src={photoUrl} alt={photo.filename} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      
                      <button
                        onClick={() => handleDeletePhoto(photo.id, manageSessionId, photo.b2Key)}
                        title="Delete photo"
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          width: "32px",
                          height: "32px",
                          background: "rgba(15,15,15,0.85)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#ef4444",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.background = "rgba(15,15,15,0.85)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .form-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
