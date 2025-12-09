import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // garante acesso ao fs no servidor

type GalleryPhoto = {
  id: string;
  url: string;
  filename: string;
  title: string;
};

type GalleryEvent = {
  id: string;
  name: string;
  date?: string;
  photos: GalleryPhoto[];
};

// Simple in-memory cache
let cache: { data: { events: GalleryEvent[] }; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function toTitleCaseFromFolder(folderName: string): string {
  // ex: "training-nov-2024" -> "Training Nov 2024"
  return folderName
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export async function GET() {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return Response.json(cache.data, { status: 200 });
    }

    const galleryRoot = path.join(process.cwd(), "public", "assets", "gallery");

    if (!fs.existsSync(galleryRoot)) {
      return Response.json({ events: [] }, { status: 200 });
    }

    const dirEntries = fs.readdirSync(galleryRoot, { withFileTypes: true });
    const eventDirs = dirEntries.filter((d) => d.isDirectory());

    const events: GalleryEvent[] = eventDirs.map((dir) => {
      const eventId = dir.name; // ex: "training-nov-2024"
      const eventName = toTitleCaseFromFolder(dir.name);

      const eventPath = path.join(galleryRoot, dir.name);
      const files = fs.readdirSync(eventPath, { withFileTypes: true });

      const imageFiles = files.filter(
        (f) =>
          f.isFile() &&
          [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(
            path.extname(f.name).toLowerCase()
          )
      );

      const photos: GalleryPhoto[] = imageFiles.map((file, index) => {
        const filename = file.name;
        const base = filename.replace(/\.[^.]+$/, "");

        return {
          id: `${eventId}-${index}`, // id estável baseado na pasta + índice
          filename,
          url: `/assets/gallery/${eventId}/${filename}`,
          title: toTitleCaseFromFolder(base),
        };
      });

      return {
        id: eventId,
        name: eventName,
        photos,
      };
    });

    // opcional: ordenar eventos alfabeticamente ou por nome
    events.sort((a, b) => a.name.localeCompare(b.name));

    const responseData = { events };
    
    // Update cache
    cache = { data: responseData, timestamp: Date.now() };

    return Response.json(responseData, { status: 200 });
  } catch (err) {
    console.error("❌ Erro ao ler galeria:", err);
    return Response.json(
      { events: [], error: "Erro ao ler galeria" },
      { status: 500 }
    );
  }
}
