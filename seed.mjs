// seed.mjs — Script de seed para Firestore + Firebase Auth
// Crea usuario demo, sesiones y fotos de ejemplo
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// ─── CONFIG ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDtAas-IqDO1YTj6Ykj4mrpL3zFZ7ql8Ao",
  authDomain:        "photoluis-e53e7.firebaseapp.com",
  projectId:         "photoluis-e53e7",
  storageBucket:     "photoluis-e53e7.firebasestorage.app",
  messagingSenderId: "431040191047",
  appId:             "1:431040191047:web:2b1c3bf0b478318e7a2f62",
};

// ─── DEMO DATA ────────────────────────────────────────────────────────
// Cliente de prueba — puedes cambiar email/password
const DEMO_CLIENT = {
  email:    "cliente@demo.com",
  password: "Demo1234!",
  name:     "Ana Martínez",
  phone:    "+58 412 555 0001",
};

// Fotos de Unsplash (públicas) que simularán los b2Keys
const UNSPLASH_PHOTOS = [
  { key:"photo_001.jpg", thumb:"photo_001_thumb.jpg", w:1200, h:800,  size:1048576 },
  { key:"photo_002.jpg", thumb:"photo_002_thumb.jpg", w:800,  h:1200, size:983040  },
  { key:"photo_003.jpg", thumb:"photo_003_thumb.jpg", w:1200, h:900,  size:1126400 },
  { key:"photo_004.jpg", thumb:"photo_004_thumb.jpg", w:900,  h:1350, size:896000  },
  { key:"photo_005.jpg", thumb:"photo_005_thumb.jpg", w:1350, h:900,  size:1200000 },
  { key:"photo_006.jpg", thumb:"photo_006_thumb.jpg", w:800,  h:1200, size:1050000 },
  { key:"photo_007.jpg", thumb:"photo_007_thumb.jpg", w:1200, h:800,  size:970000  },
  { key:"photo_008.jpg", thumb:"photo_008_thumb.jpg", w:900,  h:900,  size:880000  },
];

const SESSIONS_DATA = [
  {
    title:         "Boda Ana & Carlos",
    description:   "Celebración íntima en hacienda colonial. Luz dorada al atardecer.",
    location:      "Hacienda La Providencia, Caracas",
    date:          new Date("2026-05-15"),
    status:        "ready",
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=70",
    photoCount:    8,
    videoCount:    1,
    photos: UNSPLASH_PHOTOS,
    videos: [
      { filename:"highlights_boda.mp4", key:"video_001.mp4", thumb:"video_001_thumb.jpg", duration:180, size:52428800 },
    ],
  },
  {
    title:         "Sesión Retratos Familia Rodríguez",
    description:   "Sesión familiar en el parque. Ambiente natural y espontáneo.",
    location:      "Parque del Este, Caracas",
    date:          new Date("2026-06-01"),
    status:        "ready",
    coverImageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=70",
    photoCount:    5,
    videoCount:    0,
    photos: UNSPLASH_PHOTOS.slice(0, 5),
    videos: [],
  },
  {
    title:         "Sesión Corporativa TechVen",
    description:   "Fotografía corporativa para equipo directivo.",
    location:      "Oficinas TechVen, Las Mercedes",
    date:          new Date("2026-06-20"),
    status:        "processing",
    coverImageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=70",
    photoCount:    3,
    videoCount:    0,
    photos: UNSPLASH_PHOTOS.slice(0, 3),
    videos: [],
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────
async function seed() {
  console.log("\n🌱  Iniciando seed de Firestore...\n");

  const app  = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db   = getFirestore(app);

  // 1. Crear o iniciar sesión con usuario demo
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      DEMO_CLIENT.email,
      DEMO_CLIENT.password
    );
    await updateProfile(userCredential.user, { displayName: DEMO_CLIENT.name });
    console.log(`✅  Usuario creado: ${DEMO_CLIENT.email}`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      userCredential = await signInWithEmailAndPassword(
        auth,
        DEMO_CLIENT.email,
        DEMO_CLIENT.password
      );
      console.log(`ℹ️   Usuario ya existía — logueado: ${DEMO_CLIENT.email}`);
    } else {
      throw err;
    }
  }

  const uid = userCredential.user.uid;

  // 2. Crear perfil en /clients/{uid}
  await setDoc(doc(db, "clients", uid), {
    name:      DEMO_CLIENT.name,
    email:     DEMO_CLIENT.email,
    phone:     DEMO_CLIENT.phone,
    createdAt: Timestamp.now(),
  });
  console.log(`✅  Perfil de cliente guardado (/clients/${uid})`);

  // 3. Crear sesiones + fotos + videos
  for (const sessionData of SESSIONS_DATA) {
    const { photos, videos, ...sessionFields } = sessionData;

    const sessionRef = await addDoc(collection(db, "sessions"), {
      ...sessionFields,
      clientId:  uid,
      date:      Timestamp.fromDate(sessionFields.date),
      createdAt: Timestamp.now(),
    });
    console.log(`\n📸  Sesión creada: "${sessionFields.title}" → /sessions/${sessionRef.id}`);

    // Fotos
    let order = 0;
    for (const photo of photos) {
      await addDoc(collection(db, "photos"), {
        sessionId:     sessionRef.id,
        filename:      photo.key,
        b2Key:         photo.key,
        thumbnailKey:  photo.thumb,
        width:         photo.w,
        height:        photo.h,
        size:          photo.size,
        downloadCount: 0,
        order:         order++,
        createdAt:     Timestamp.now(),
      });
    }
    console.log(`   ├─ ${photos.length} foto(s) creadas`);

    // Videos
    for (const video of videos) {
      await addDoc(collection(db, "videos"), {
        sessionId:    sessionRef.id,
        filename:     video.filename,
        b2Key:        video.key,
        thumbnailKey: video.thumb,
        duration:     video.duration,
        size:         video.size,
        createdAt:    Timestamp.now(),
      });
    }
    if (videos.length > 0) {
      console.log(`   └─ ${videos.length} video(s) creados`);
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  SEED COMPLETADO

📧  Email:     ${DEMO_CLIENT.email}
🔑  Password:  ${DEMO_CLIENT.password}
👤  UID:       ${uid}

Ahora puedes ir a http://localhost:3000/login
e ingresar con esas credenciales para ver el
dashboard con las 3 sesiones de ejemplo.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌  Error en seed:", err.message || err);
  process.exit(1);
});
