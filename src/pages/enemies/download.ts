import type { APIRoute } from 'astro';
import { getLauncherRelease } from '../../lib/launcher-release';

/**
 * Stable download link for the launcher: redirects to whatever build the
 * release manifest currently points at.
 */
export const GET: APIRoute = async () => {
  const release = await getLauncherRelease();

  return new Response(null, {
    status: 302,
    headers: {
      Location: release.url,
      // Short window so a new release is picked up quickly, but repeated
      // clicks don't hit the manifest every time.
      'Cache-Control': release.stale
        ? 'no-store'
        : 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
