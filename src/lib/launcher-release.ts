/**
 * Resolves the current launcher build from the manifest that electron-builder
 * publishes next to the installer, so download links follow new releases
 * without a code change.
 */

export interface LauncherSource {
  /** Directory the installer and its latest.yml live in, without a trailing slash. */
  baseUrl: string;
  /** Used when the manifest is unreachable or malformed. */
  fallback: { version: string; fileName: string };
}

export const ENEMIES_LAUNCHER: LauncherSource = {
  baseUrl: 'https://mods.adaptaweb.cl/launcher',
  fallback: {
    version: '1.0.1',
    fileName: 'EnemiesLand Launcher Setup 1.0.1.exe',
  },
};

export const RPG_LAUNCHER: LauncherSource = {
  baseUrl: 'https://mods.adaptaweb.cl/keo/launcher',
  fallback: {
    version: '1.0.0',
    fileName: 'KEO-RPG-Launcher-Setup-1.0.0.exe',
  },
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

export async function getLauncherRelease(
  source: LauncherSource,
): Promise<LauncherRelease> {
  const fallback: LauncherRelease = {
    version: source.fallback.version,
    fileName: source.fallback.fileName,
    url: `${source.baseUrl}/${encodeURIComponent(source.fallback.fileName)}`,
    stale: true,
  };

  try {
    const response = await fetch(`${source.baseUrl}/latest.yml`, {
      signal: AbortSignal.timeout(4000),
      headers: { accept: 'text/yaml, text/plain' },
    });
    if (!response.ok) return fallback;

    const manifest = await response.text();
    const fileName = readField(manifest, 'path');
    if (!fileName || !isSafeFileName(fileName)) return fallback;

    return {
      version: readField(manifest, 'version'),
      fileName,
      url: `${source.baseUrl}/${encodeURIComponent(fileName)}`,
      stale: false,
    };
  } catch {
    return fallback;
  }
}
