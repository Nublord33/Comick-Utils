const fs = require('fs');

const Base_url = "https://api.comick.fun/publisher/";
const Publisher = "lezhin";
const targets = ["yuri"];

fetch(Base_url + Publisher)
  .then(response => response.json())
  .then(data => {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("cant write data.json:", err);
        return;
      }
      console.log("did some cool stff");

      const slugs = data.mu_comic_publishers.flatMap(publisher => 
        publisher.mu_comics.md_comics.map(comic => comic.slug)
      );

      fs.writeFile('slugs.json', JSON.stringify(slugs, null, 2), (err) => {
        if (err) {
          console.error("Oops! Couldn't write slugs.json:", err);
          return;
        }
        console.log("let the gams begin");

        fs.open('data.txt', 'w', (err, fd) => {
          if (err) {
            console.error("Oops! Couldn't open data.txt:", err);
            return;
          }

          slugs.forEach((slug, index) => {
            const full_url = `https://api.comick.fun/comic/${slug}`;

            fetch(full_url)
              .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error(`Failed to get comic: ${slug}`);
                }
              })
              .then(comicData => {
                const comicGenres = comicData.comic.md_comic_md_genres.map(genre => 
                  genre.md_genres.name.toLowerCase()
                );

                console.log(`Comic ${slug} genres:`, comicGenres);

                const matchesAllGenres = targets.every(target => comicGenres.includes(target.toLowerCase()));

                if (matchesAllGenres) {
                  const comicUrl = `https://comick.io/comic/${slug}\n`;
                  fs.appendFile('data.txt', comicUrl, err => {
                    if (err) {
                      console.error("cant write to data.txt dont know why fix it yourself", err);
                    } else {
                      console.log(`Added ${comicUrl} to data.txt`);
                    }
                  });
                } else {
                  console.log(`Skipping comic ${slug} - not exactly what ur looking for`);
                }
              })
              .catch(error => {
                console.error(`Fetch failed for ${slug}: ${error.message}`);
              })
              .finally(() => {
                if (index === slugs.length - 1) {
                  fs.unlink('data.json', (err) => {
                    if (err) {
                      console.error("data.json isn't deleting probably your fault", err);
                    } else {
                      console.log("deleted data.json");
                    }
                  });
                }
              });
          });
        });
      });
    });
  })
  .catch(error => {
    console.error("Error fetching publisher data:", error.message);
  });
