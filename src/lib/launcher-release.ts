/**
 * Resolves the current EnemiesLand launcher build from the manifest that
 * electron-builder publishes next to the installer, so the download link
 * follows new releases without a code change.
 */

const BASE_URL = 'https://mods.adaptaweb.cl/launcher';
const MANIFEST_URL = `${BASE_URL}/latest.yml`;

/** Used when the manifest is unreachable or malformed. */
const FALLBACK: LauncherRelease = {
  version: '1.0.1',
  fileName: 'EnemiesLand Launcher Setup 1.0.1.exe',
  url: `${BASE_URL}/EnemiesLand%20Launcher%20Setup%201.0.1.exe`,
  stale: true,
};

export interface LauncherRelease {
  version: string | null;
  fileName: string;
  url: string;
  /** True when the fallback was used instead of a fresh manifest read. */
  stale: boolean;
}

function readField(manifest: string, field: string): string | null {
  const match = manifest.match(new RegExp(`^${field}:[ \\t]*(.+?)[ \\t]*$`, 'm'));
  if (!match) return null;
  return match[1].replace(/^['"]|['"]$/g, '').trim() || null;
}

/**
 * The manifest is fetched from another host, so its contents are untrusted:
 * allow only the characters electron-builder puts in an installer name, so a
 * tampered manifest cannot turn the link into a path or another host.
 */
function isSafeFileName(name: string): boolean {
  return /^[A-Za-z0-9 ._()+-]+\.exe$/i.test(name) && !name.includes('..');
}

export async function getLauncherRelease(): Promise<LauncherRelease> {
  try {
    const response = await fetch(MANIFEST_URL, {
      signal: AbortSignal.timeout(4000),
      headers: { accept: 'text/yaml, text/plain' },
    });
    if (!response.ok) return FALLBACK;

    const manifest = await response.text();
    const fileName = readField(manifest, 'path');
    if (!fileName || !isSafeFileName(fileName)) return FALLBACK;

    return {
      version: readField(manifest, 'version'),
      fileName,
      url: `${BASE_URL}/${encodeURIComponent(fileName)}`,
      stale: false,
    };
  } catch {
    return FALLBACK;
  }
}
