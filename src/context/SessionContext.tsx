"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SessionPlayer = {
  id: number; // 0..3
  name: string;
  score: number;
  color: string;
  avatar: string;
};

type SessionState = {
  playerCount: number; // 1..6
  players: SessionPlayer[];
  activePlayerId: number; // 0..5
  turnOrder: number[] | null; // Thứ tự chơi sau khi xổ số, ví dụ: [2, 0, 3, 1] có nghĩa là player 2 đi trước
};

type SessionApi = {
  state: SessionState;
  setPlayerCount: (count: number) => void;
  setPlayerName: (id: number, name: string) => void;
  setPlayerColor: (id: number, color: string) => void;
  setPlayerAvatar: (id: number, avatar: string) => void;
  setActivePlayer: (id: number) => void;
  addScore: (id: number, delta: number) => void;
  resetScores: () => void;
  resetAll: () => void;
  shuffleTurnOrder: (customOrder?: number[]) => void; // Xổ số thứ tự chơi ngẫu nhiên
};

const STORAGE_KEY = "trieth-session-v1";
export const PLAYER_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#ef4444", // red
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];
export const PLAYER_AVATARS = ["🦁", "🐼", "🦉", "🐳", "🦊", "🐻"];

function buildPlayer(id: number, data?: Partial<SessionPlayer>): SessionPlayer {
  const color = data?.color ?? PLAYER_COLORS[id % PLAYER_COLORS.length];
  const avatar = data?.avatar ?? PLAYER_AVATARS[id % PLAYER_AVATARS.length];
  return {
    id,
    name: data?.name ? String(data.name) : `Người ${id + 1}`,
    score: typeof data?.score === "number" ? data.score : 0,
    color:
      typeof color === "string"
        ? color
        : PLAYER_COLORS[id % PLAYER_COLORS.length],
    avatar:
      typeof avatar === "string"
        ? avatar
        : PLAYER_AVATARS[id % PLAYER_AVATARS.length],
  };
}

function defaultPlayers(count: number = 4): SessionPlayer[] {
  const validCount = Math.min(6, Math.max(1, count));
  return Array.from({ length: validCount }, (_, i) => buildPlayer(i));
}

const Ctx = createContext<SessionApi | null>(null);

function loadFromStorage(): SessionState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (!parsed.players || typeof parsed.activePlayerId !== "number")
      return null;
    const count =
      typeof parsed.playerCount === "number"
        ? Math.min(6, Math.max(1, parsed.playerCount))
        : parsed.players.length;
    if (parsed.players.length < 1 || parsed.players.length > 6) return null;
    return {
      playerCount: count,
      players: parsed.players.map((p, i) => buildPlayer(i, p)),
      activePlayerId: Math.min(count - 1, Math.max(0, parsed.activePlayerId)),
      turnOrder: parsed.turnOrder ?? null,
    };
  } catch {
    return null;
  }
}

const DEFAULT_STATE: SessionState = {
  playerCount: 4,
  players: defaultPlayers(4),
  activePlayerId: 0,
  turnOrder: null,
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setState(stored);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const api = useMemo<SessionApi>(
    () => ({
      state,
      setPlayerCount: (count) => {
        const validCount = Math.min(6, Math.max(1, count));
        setState((s) => ({
          ...s,
          playerCount: validCount,
          players: defaultPlayers(validCount),
          activePlayerId: Math.min(validCount - 1, s.activePlayerId),
          turnOrder: null, // Reset thứ tự khi thay đổi số người
        }));
      },
      setPlayerName: (id, name) =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
      setPlayerColor: (id, color) =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) => (p.id === id ? { ...p, color } : p)),
        })),
      setPlayerAvatar: (id, avatar) =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) => (p.id === id ? { ...p, avatar } : p)),
        })),
      setActivePlayer: (id) =>
        setState((s) => ({
          ...s,
          activePlayerId: Math.min(s.playerCount - 1, Math.max(0, id)),
        })),
      addScore: (id, delta) =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) =>
            p.id === id ? { ...p, score: p.score + delta } : p,
          ),
        })),
      resetScores: () =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) => ({ ...p, score: 0 })),
        })),
      resetAll: () =>
        setState({
          playerCount: 4,
          players: defaultPlayers(4),
          activePlayerId: 0,
          turnOrder: null,
        }),
      shuffleTurnOrder: (customOrder?: number[]) =>
        setState((s) => {
          if (customOrder) {
            return { ...s, turnOrder: customOrder };
          }
          // Fisher-Yates shuffle
          const order = Array.from({ length: s.playerCount }, (_, i) => i);
          for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
          }
          return { ...s, turnOrder: order };
        }),
    }),
    [state],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
