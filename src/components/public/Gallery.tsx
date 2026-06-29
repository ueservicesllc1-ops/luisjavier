"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder gallery items — replace with Firestore data
const GALLERY_ITEMS = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
    category: "Weddings",
    title: "Luna & Marco",
    aspect: "tall",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
    category: "Portraits",
    title: "Natural Light",
    aspect: "wide",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=70",
    category: "Weddings",
    title: "The Big Day",
    aspect: "square",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=70",
    category: "Portraits",
    title: "Serenity",
    aspect: "tall",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=70",
    category: "Commercial",
    title: "Pro Team",
    aspect: "square",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&q=70",
    category: "Weddings",
    title: "Eternal Vows",
    aspect: "wide",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=70",
    category: "Portraits",
    title: "Deep Glance",
    aspect: "tall",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=70",
    category: "Portraits",
    title: "Personality",
    aspect: "square",
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&q=70",
    category: "Weddings",
    title: "Love in Bloom",
    aspect: "wide",
  },
];

const CATEGORIES = ["All", "Weddings", "Portraits", "Commercial"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((i) => i.category === activeCategory);


  const openLightbox = (id: string) => {
    const idx = filtered.findIndex((i) => i.id === id);
    setLightboxIndex(idx);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <section id="gallery" className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>Portfolio</p>
          <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
            Work Gallery
          </h2>
          <span className="gold-line centered" />
          <p className="lead" style={{ maxWidth: 480, marginInline: "auto", marginTop: "1rem" }}>
            Every image tells a story. Here is a selection of my most memorable work.
          </p>
        </div>

        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.55rem 1.5rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid",
                transition: "all 0.25s ease",
                cursor: "pointer",
                borderColor: activeCategory === cat ? "var(--color-gold)" : "var(--color-border)",
                background: activeCategory === cat ? "var(--color-gold-muted)" : "transparent",
                color: activeCategory === cat ? "var(--color-gold)" : "var(--color-text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="gallery-grid">
          {filtered.map((item) => (
            <div key={item.id} className="gallery-grid-item">
              <GalleryItem item={item} onOpen={openLightbox} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.96)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-cream)",
              cursor: "pointer",
              zIndex: 2,
              transition: "all 0.2s",
            }}
          >
            <X size={18} />
          </button>

          {/* Nav */}
          {[
            { fn: prev, icon: <ChevronLeft size={22} />, side: "left" },
            { fn: next, icon: <ChevronRight size={22} />, side: "right" },
          ].map(({ fn, icon, side }) => (
            <button
              key={side}
              onClick={(e) => { e.stopPropagation(); fn(); }}
              style={{
                position: "absolute",
                [side]: "1.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-border)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-cream)",
                cursor: "pointer",
                zIndex: 2,
                transition: "all 0.2s",
              }}
            >
              {icon}
            </button>
          ))}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "88vh", position: "relative" }}
          >
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-2.5rem",
                left: 0,
                right: 0,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "var(--color-text-muted)",
                  fontSize: "0.95rem",
                }}
              >
                {filtered[lightboxIndex].title}
              </span>
              <span
                style={{
                  color: "var(--color-text-faint)",
                  fontSize: "0.75rem",
                  marginLeft: "1rem",
                }}
              >
                {lightboxIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-grid {
          column-count: 3;
          column-gap: 10px;
          width: 100%;
        }
        .gallery-grid-item {
          break-inside: avoid;
          margin-bottom: 10px;
        }
        @media (max-width: 768px) {
          .gallery-grid { column-count: 2; }
        }
        @media (max-width: 480px) {
          .gallery-grid { column-count: 1; }
        }
      `}</style>
    </section>
  );
}

function GalleryItem({
  item,
  onOpen,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  onOpen: (id: string) => void;
}) {
  const aspectMap = { tall: "75%", wide: "140%", square: "100%" };

  return (
    <div
      onClick={() => onOpen(item.id)}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        cursor: "pointer",
        paddingBottom: aspectMap[item.aspect as keyof typeof aspectMap] || "100%",
        background: "var(--color-bg-card)",
      }}
      className="gallery-item"
    >
      <img
        src={item.thumb}
        alt={item.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="gallery-img"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div
        className="gallery-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "0.25rem",
          }}
        >
          {item.category}
        </span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.1rem",
            color: "var(--color-cream)",
          }}
        >
          {item.title}
        </span>
        <ZoomIn
          size={18}
          color="var(--color-gold)"
          style={{ position: "absolute", top: "1rem", right: "1rem" }}
        />
      </div>
    </div>
  );
}
