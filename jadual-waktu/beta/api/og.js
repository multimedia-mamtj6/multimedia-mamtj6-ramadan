const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = async function handler(req, res) {
  const location = req.query.location;

  // Read static HTML from disk
  const htmlPath = join(process.cwd(), 'index.html');
  let html;

  try {
    html = readFileSync(htmlPath, 'utf-8');
  } catch (err) {
    // Fallback: try different path
    try {
      html = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
    } catch (err2) {
      res.status(500).send('Cannot read index.html');
      return;
    }
  }

  if (!location) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  try {
    // Fetch zone data
    const zonesResponse = await fetch('https://api.waktusolat.app/zones');
    const zones = await zonesResponse.json();
    const zone = zones.find((z) => z.jakimCode === location);

    if (zone) {
      const zoneNumber = parseInt(location.slice(-2), 10);
      const ogDescription = `Bagi Negeri ${zone.negeri} (Zon ${zoneNumber})`;
      const pageTitle = `Jadual Waktu Ramadan 2026 - ${zone.negeri} (Zon ${zoneNumber})`;

      // Replace OG meta tags
      html = html.replace(
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${ogDescription}" />`
      );
      html = html.replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${pageTitle}" />`
      );
      html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${pageTitle}</title>`
      );
    }
  } catch (error) {
    // On error, serve original HTML
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Vary', 'Accept-Encoding');
  return res.send(html);
};
