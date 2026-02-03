export const config = {
  runtime: 'edge',
};

interface Zone {
  jakimCode: string;
  negeri: string;
  daerah: string;
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const location = url.searchParams.get('location');
  const testDate = url.searchParams.get('testDate');

  // Build the original URL to fetch (without the rewrite)
  const baseUrl = url.origin;
  const originalUrl = new URL('/index.html', baseUrl);
  if (testDate) {
    originalUrl.searchParams.set('testDate', testDate);
  }

  try {
    // Fetch the original HTML
    const htmlResponse = await fetch(originalUrl.toString());
    let html = await htmlResponse.text();

    // If no location, return original HTML
    if (!location) {
      return new Response(html, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    // Fetch zone data from API
    const zonesResponse = await fetch('https://api.waktusolat.app/zones', {
      headers: { 'Accept': 'application/json' },
    });
    const zones: Zone[] = await zonesResponse.json();
    const zone = zones.find((z) => z.jakimCode === location);

    // If zone not found, return original HTML
    if (!zone) {
      return new Response(html, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    // Generate dynamic OG content
    const zoneNumber = parseInt(location.slice(-2), 10);
    const ogDescription = `Bagi Negeri ${zone.negeri} (Zon ${zoneNumber})`;
    const ogUrl = `${baseUrl}/?location=${location}`;

    // Replace OG meta tags
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${ogDescription}" />`
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${ogUrl}" />`
    );

    // Also update the page title for better sharing
    const pageTitle = `Jadual Waktu Ramadan 2026 - ${zone.negeri} (Zon ${zoneNumber})`;
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${pageTitle}</title>`
    );
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${pageTitle}" />`
    );

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    // On error, try to serve the original page
    try {
      const fallbackResponse = await fetch(originalUrl.toString());
      const fallbackHtml = await fallbackResponse.text();
      return new Response(fallbackHtml, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    } catch {
      return new Response('Error loading page', { status: 500 });
    }
  }
}
