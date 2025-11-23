// scripts/build_gallery_data.js
// Lê as pastas em public/assets/gallery e gera public/data/gallery.json

const fs = require("fs");
const path = require("path");

const GALLERY_DIR = path.join(process.cwd(), "public", "assets", "gallery");
const OUTPUT_FILE = path.join(process.cwd(), "public", "data", "gallery_index.json");

// extensões aceites
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

// Humanizar nome da pasta -> "meia2025" -> "Meia 2025", "10kmnovembro2025" -> "10km Novembro 2025"
function humanizeFolderName(folder) {
  let name = folder.replace(/[-_]+/g, " ");

  // inserir espaço entre letras e números (meia2025 -> meia 2025)
  name = name.replace(/([a-zA-Z])(\d)/g, "$1 $2");

  // capitalizar cada palavra
  name = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return name;
}

// Humanizar nome do ficheiro -> "foto-linha-partida.jpg" -> "Foto Linha Partida"
function humanizeFileName(file) {
  const base = file.replace(/\.[^.]+$/, ""); // remove extensão
  return base
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildGallery() {
  if (!fs.existsSync(GALLERY_DIR)) {
    console.error(`❌ Pasta não encontrada: ${GALLERY_DIR}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(GALLERY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const events = [];

  folders.forEach((dir) => {
    const slug = dir.name;
    const folderPath = path.join(GALLERY_DIR, slug);

    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter(
        (f) =>
          f.isFile() &&
          IMAGE_EXTENSIONS.includes(path.extname(f.name).toLowerCase())
      );

    if (files.length === 0) {
      return; // ignora pastas vazias
    }

    const eventName = humanizeFolderName(slug);

    const photos = files.map((file, index) => {
      // 👇 Agora bate certo com public/assets/gallery/...
      const url = `/assets/gallery/${slug}/${file.name}`;
      return {
        id: `${slug}-${index + 1}`,
        url,
        title: humanizeFileName(file.name),
        date: "", // podes editar à mão no JSON depois
        location: "",
        description: "",
      };
    });

    events.push({
      id: slug,
      name: eventName,
      date: "", // podes depois alterar no JSON
      photos,
    });
  });

  const output = {
    generatedAt: new Date().toISOString(),
    events,
  };

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log("✅ Galeria gerada com sucesso!");
  console.log(`📁 Eventos: ${events.length}`);
  events.forEach((e) =>
    console.log(`   - ${e.name} (${e.photos.length} fotos)`)
  );
  console.log(`💾 Ficheiro: ${OUTPUT_FILE}`);
}

buildGallery();
