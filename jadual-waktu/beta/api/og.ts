import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Zone {
  jakimCode: string;
  negeri: string;
  daerah: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const location = req.query.location as string;

  // Read static HTML from disk
  const htmlPath = join(process.cwd(), 'index.html');
  let html = readFileSync(htmlPath, 'utf-8');

  if (!location) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  try {
    // Fetch zone data
    const zonesResponse = await fetch('https://api.waktusolat.app/zones');
    const zones: Zone[] = await zonesResponse.json();
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
  return res.send(html);
}
