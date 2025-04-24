import fs from 'fs/promises';

const Base_url = "https://api.comick.fun/publisher/";
const Publisher = "lezhin";
const targets = ["yuri"];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    const response = await fetch(Base_url + Publisher);
    const data = await response.json();

    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
    console.log("Saved data.json");

    const slugs = data.mu_comic_publishers.flatMap(p =>
      p.mu_comics.md_comics.map(c => c.slug)
    );

    await fs.writeFile('slugs.json', JSON.stringify(slugs, null, 2));
    console.log("Saved slugs.json");

    await fs.writeFile('data.txt', '');
    const allComics = [];

    for (const slug of slugs) {
      try {
        console.log(`🔄 Fetching ${slug}...`);
        const res = await fetch(`https://api.comick.fun/comic/${slug}`);

        if (!res.ok) {
          switch (res.status) {
            case 404:
              console.warn(`❌ ${slug} - Not Found (404)`);
              break;
            case 403:
              console.warn(`🚫 ${slug} - Forbidden (403)`);
              break;
            case 429:
              console.warn(`🧃 ${slug} - Rate Limited (429), waiting 5 seconds...`);
              await sleep(5000); // cool-down only on rate limit
              break;
            case 500:
              console.warn(`💥 ${slug} - Internal Server Error (500)`);
              break;
            case 503:
              console.warn(`🛠️ ${slug} - Service Unavailable (503)`);
              break;
            default:
              console.warn(`❓ ${slug} - Unexpected HTTP ${res.status} ${res.statusText}`);
          }
          continue;
        }

        const comicData = await res.json();
        const genreInfo = comicData.comic.md_comic_md_genres || [];
        const comicGenres = genreInfo.map(g =>
          g.md_genres.name.toLowerCase()
        );

        allComics.push({ slug, genres: comicGenres });

        console.log(`🔎 ${slug} genres: ${comicGenres.join(', ') || 'None'}`);

        if (!comicGenres.length) {
          console.log(`⚠️ Skipping ${slug} - no genres`);
          continue;
        }

        const matches = targets.every(target =>
          comicGenres.includes(target)
        );

        if (matches) {
          const url = `https://comick.io/comic/${slug}\n`;
          await fs.appendFile('data.txt', url);
          console.log(`✅ Added ${slug} to data.txt`);
        } else {
          console.log(`⏭️ Skipped ${slug} - doesn't match required genres`);
        }
      } catch (err) {
        console.error(`🔥 Error processing ${slug}:`, err.message);
      }
    }

    await fs.writeFile('all_comics.json', JSON.stringify(allComics, null, 2));
    console.log("📄 Saved all comic slugs and genres to all_comics.json");

    await fs.unlink('data.json');
    console.log("🗑️ Deleted data.json");

  } catch (err) {
    console.error("💥 Fatal error:", err.message);
  }
}

main();
