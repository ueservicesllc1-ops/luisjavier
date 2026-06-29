"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession, getSessionPhotos, getSessionVideos, Session, Photo, Video } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Download, ArrowLeft, X, ChevronLeft, ChevronRight, Play, Package } from "lucide-react";

function formatDate(ts: any) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [photos, setPhotos]   = useState<Photo[]>([]);
  const [videos, setVideos]   = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [sess, ph, vid] = await Promise.all([
        getSession(id as string),
        getSessionPhotos(id as string),
        getSessionVideos(id as string),
      ]);
      setSession(sess);
      setPhotos(ph);
      setVideos(vid);
      setLoading(false);
    })();
  }, [id]);

  const downloadPhoto = async (photo: Photo) => {
    setDownloading(photo.id);
    try {
      const idx = photos.findIndex((p) => p.id === photo.id);
      const extension = photo.filename.split(".").pop() || "jpg";
      const newFilename = `photo${idx !== -1 ? idx + 1 : 1}.${extension}`;

      const res = await fetch(`/api/download?key=${encodeURIComponent(photo.b2Key)}&filename=${encodeURIComponent(newFilename)}`);
      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = newFilename;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const folder = zip.folder(session?.title || "sesion");

      await Promise.all(
        photos.map(async (photo, index) => {
          const res = await fetch(`/api/download?key=${encodeURIComponent(photo.b2Key)}`);
          const { url } = await res.json();
          const blob = await fetch(url).then((r) => r.blob());
          const extension = photo.filename.split(".").pop() || "jpg";
          const newFilename = `photo${index + 1}.${extension}`;
          folder?.file(newFilename, blob);
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `${session?.title || "sesion"}.zip`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingAll(false);
    }
  };


  if (loading) {
    return (
      <div className="container">
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, border: "2px solid var(--color-border)", borderTopColor: "var(--color-gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Sesión no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="btn btn-ghost"
        style={{ marginBottom: "1.5rem", paddingLeft: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} />
        My Sessions
      </button>

      {/* Session header */}
      <div
        className="session-header"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(1.25rem, 4vw, 2.5rem)",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--color-gold), transparent)" }} />

        <div>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Photography Session</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 400,
              color: "var(--color-cream)",
              marginBottom: "0.5rem",
            }}
          >
            {session.title}
          </h1>
          {session.location && (
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>
              📍 {session.location}
            </p>
          )}
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-faint)" }}>{formatDate(session.date)}</p>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>📷 {photos.length} photos</span>
            {videos.length > 0 && <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>🎬 {videos.length} videos</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="session-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {photos.length > 0 && (
            <button
              className="btn btn-gold"
              onClick={downloadAll}
              disabled={downloadingAll}
              style={{ opacity: downloadingAll ? 0.75 : 1 }}
            >
              {downloadingAll ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Preparing ZIP...
                </>
              ) : (
                <>
                  <Package size={15} />
                  Download All
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Photos masonry */}
      {photos.length > 0 && (
        <>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "var(--color-cream)",
              marginBottom: "1.25rem",
            }}
          >
            Photos
          </h2>

          <div className="photo-masonry">
            {photos.map((photo, globalIdx) => (
              <div key={photo.id} className="photo-masonry-item">
                <PhotoTile
                  photo={photo}
                  onOpen={() => setLightbox(globalIdx)}
                  onDownload={() => downloadPhoto(photo)}
                  isDownloading={downloading === photo.id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Videos section */}
      {videos.length > 0 && (
        <>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--color-cream)", marginBottom: "1.25rem" }}>
            Videos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      )}

      {photos.length === 0 && videos.length === 0 && (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <p style={{ color: "var(--color-text-muted)" }}>This session does not have any files available yet.</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-cream)", cursor: "pointer", background: "rgba(255,255,255,0.03)", zIndex: 2 }}>
            <X size={18} />
          </button>

          {/* Nav */}
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + photos.length) % photos.length); }} style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-cream)", cursor: "pointer", background: "rgba(255,255,255,0.03)", zIndex: 2 }}>
            <ChevronLeft size={22} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % photos.length); }} style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-cream)", cursor: "pointer", background: "rgba(255,255,255,0.03)", zIndex: 2 }}>
            <ChevronRight size={22} />
          </button>

          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "88vh", position: "relative" }}>
            <img
              src={`${process.env.NEXT_PUBLIC_B2_URL || ""}/${photos[lightbox].b2Key}`}
              alt={photos[lightbox].filename}
              style={{ maxWidth: "88vw", maxHeight: "83vh", objectFit: "contain", borderRadius: 4 }}
            />
            {/* Download btn in lightbox */}
            <button
              onClick={() => downloadPhoto(photos[lightbox])}
              style={{
                position: "absolute",
                bottom: "-3.5rem",
                right: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 1.25rem",
                background: "var(--color-gold-muted)",
                border: "1px solid rgba(201,169,110,0.4)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-gold)",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Download size={14} />
              Download photo
            </button>
            <span style={{ position: "absolute", bottom: "-3.2rem", left: 0, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {lightbox + 1} / {photos.length}
            </span>
          </div>
        </div>
      )}

      <style>{`
        .photo-masonry {
          column-count: 4;
          column-gap: 8px;
          width: 100%;
          margin-bottom: 3rem;
        }
        .photo-masonry-item {
          break-inside: avoid;
          margin-bottom: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .photo-masonry { column-count: 3; }
        }
        @media (max-width: 768px) {
          .photo-masonry { column-count: 2; }
        }
        @media (max-width: 600px) {
          .session-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .session-actions {
            width: 100% !important;
          }
          .session-actions button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 480px) {
          .photo-masonry { column-count: 1; }
        }
      `}</style>
    </div>
  );
}

function PhotoTile({ photo, onOpen, onDownload, isDownloading }: {
  photo: Photo;
  onOpen: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const b2Base = process.env.NEXT_PUBLIC_B2_URL || "";
  const thumbSrc = photo.thumbnailKey ? `${b2Base}/${photo.thumbnailKey}` : `${b2Base}/${photo.b2Key}`;

  const aspect = photo.height && photo.width ? `${(photo.height / photo.width) * 100}%` : "100%";

  return (
    <div
      style={{ position: "relative", paddingBottom: aspect, borderRadius: "var(--radius-md)", overflow: "hidden", cursor: "pointer", background: "var(--color-bg-elevated)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={thumbSrc} alt={photo.filename} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} loading="lazy" />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", opacity: hovered ? 1 : 0, transition: "opacity 0.25s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
        <button onClick={onOpen} style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "1.2rem" }}>
          🔍
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          disabled={isDownloading}
          style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)", background: "rgba(201,169,110,0.1)", cursor: "pointer" }}
        >
          {isDownloading ? <span style={{ width: 14, height: 14, border: "2px solid rgba(201,169,110,0.3)", borderTopColor: "var(--color-gold)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <Download size={16} />}
        </button>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  const b2Base = process.env.NEXT_PUBLIC_B2_URL || "";

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--color-bg-elevated)" }}>
        {video.thumbnailKey ? (
          <img src={`${b2Base}/${video.thumbnailKey}`} alt={video.filename} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={32} color="var(--color-text-faint)" />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(201,169,110,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={20} color="#000" fill="#000" style={{ marginLeft: 3 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>
        <p style={{ fontSize: "0.88rem", color: "var(--color-cream)", marginBottom: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.filename}</p>
        <a
          href={`/api/download?key=${encodeURIComponent(video.b2Key)}&filename=${encodeURIComponent(video.filename)}`}
          className="btn btn-outline"
          style={{ fontSize: "0.72rem", padding: "0.45rem 1rem", width: "100%", justifyContent: "center" }}
        >
          <Download size={13} />
          Download video
        </a>
      </div>
    </div>
  );
}
