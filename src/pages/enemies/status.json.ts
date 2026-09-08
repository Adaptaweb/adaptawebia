import type { APIRoute } from 'astro';
import { getServerStatus } from '../../lib/server-status';

/**
 * Live player count for the landing page. Fetched from the browser after
 * load so a slow or unreachable server never delays the page itself.
 */
export const GET: APIRoute = async () => {
  const serverStatus = await getServerStatus();

  return new Response(JSON.stringify(serverStatus), {
    headers: {
      'Content-Type': 'application/json',
      // Cheap enough to keep fresh, cached briefly so a burst of visitors
      // doesn't turn into a burst of pings.
      'Cache-Control': 'public, max-age=30, s-maxage=30',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
