import { status } from 'minecraft-server-util';

export interface ServerTarget {
  host: string;
  port: number;
}

/**
 * Both modpacks run on the same box — EnemiesLand was reinstalled as KEO RPG
 * on NeoForge — so the two pages report the same player count.
 */
export const MAIN_SERVER: ServerTarget = { host: 'va23.holy.gg', port: 25962 };

export interface ServerStatus {
  online: boolean;
  players: number;
  max: number;
}

export async function getServerStatus(
  target: ServerTarget = MAIN_SERVER,
): Promise<ServerStatus> {
  try {
    const result = await status(target.host, target.port, { timeout: 4000 });
    return {
      online: true,
      players: result.players.online ?? 0,
      max: result.players.max ?? 0,
    };
  } catch {
    return { online: false, players: 0, max: 0 };
  }
}
