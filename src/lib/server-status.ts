import { status } from 'minecraft-server-util';

/** Same host the launcher connects to. */
const SERVER_HOST = 'va23.holy.gg';
const SERVER_PORT = 25962;

export interface ServerStatus {
  online: boolean;
  players: number;
  max: number;
}

export async function getServerStatus(): Promise<ServerStatus> {
  try {
    const result = await status(SERVER_HOST, SERVER_PORT, { timeout: 4000 });
    return {
      online: true,
      players: result.players.online ?? 0,
      max: result.players.max ?? 0,
    };
  } catch {
    return { online: false, players: 0, max: 0 };
  }
}
