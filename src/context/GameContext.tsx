"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { CRISIS_BAIL, MAX_TURNS, STARTING_CASH, tiles } from "@/lib/gameData";
import { questions, type Question } from "@/lib/questions";
import type {
  LogEntry,
  OwnedProperty,
  Player,
  PlayerId,
  PlayerToken,
  Tile,
} from "@/lib/types";
import { useSession } from "@/context/SessionContext";

type ActiveModal =
  | { kind: "tileFlashcard"; tileIndex: number }
  | { kind: "question"; question: Question }
  | { kind: "none" };

type GameState = {
  turn: number; // 1..MAX_TURNS for the human cycle
  currentPlayerIndex: number; // 0..3
  players: Player[];
  owned: OwnedProperty[]; // kept for compatibility, not used in race mode
  logs: LogEntry[];
  dice: { a: number; b: number; total: number } | null;
  activeModal: ActiveModal;
  message: string | null; // transient error/info (e.g. Marx rule)
  questionPointer: number;
  questionForTurn: Question | null;
  diceAllowance: 1 | 2 | null; // null => chưa trả lời câu hỏi lượt này
  awaitingDecision: null | { kind: "buyProperty"; tileIndex: number };
  hasActedThisTurn: boolean; // for human: once Buy/Build => cannot roll again; must end turn
};

const PLAYER_IDS: PlayerId[] = [
  "PLAYER_0",
  "PLAYER_1",
  "PLAYER_2",
  "PLAYER_3",
  "PLAYER_4",
  "PLAYER_5",
];
const PLAYER_TOKENS: PlayerToken[] = [
  { name: "CN", icon: "Hammer", colorClass: "text-red-600" },
  { name: "TB", icon: "Crown", colorClass: "text-gray-800" },
  { name: "TG", icon: "Book", colorClass: "text-blue-800" },
  { name: "ĐC", icon: "Key", colorClass: "text-green-800" },
  { name: "XH", icon: "Hammer", colorClass: "text-pink-600" },
  { name: "KT", icon: "Crown", colorClass: "text-cyan-600" },
];

function makePlayers(count: number = 4, names?: string[]): Player[] {
  const validCount = Math.min(6, Math.max(1, count));
  return Array.from({ length: validCount }, (_, idx) => ({
    id: PLAYER_IDS[idx],
    name: names?.[idx] ?? `Người ${idx + 1}`,
    isHuman: true,
    token: PLAYER_TOKENS[idx],
    position: 0,
    cash: STARTING_CASH,
    skipTurns: 0,
    correct: 0,
    wrong: 0,
    laps: 0,
  }));
}

const initialState: GameState = {
  turn: 1,
  currentPlayerIndex: 0,
  players: makePlayers(),
  owned: [],
  logs: [],
  dice: null,
  activeModal: { kind: "none" },
  message: null,
  questionPointer: 0,
  questionForTurn: null,
  diceAllowance: null,
  awaitingDecision: null,
  hasActedThisTurn: false,
};

type Action =
  | { type: "ROLL_DICE" }
  | { type: "OPEN_QUESTION" }
  | { type: "ANSWER_QUESTION"; correct: boolean }
  | { type: "CLOSE_MODAL" }
  | { type: "CLEAR_MESSAGE" }
  | { type: "BUY_CONFIRMED" }
  | { type: "BUILD_UPGRADE"; tileIndex: number }
  | { type: "END_TURN" }
  | { type: "PAY_BAIL" }
  | { type: "BOT_TAKE_TURN" }
  | { type: "RESET" }
  | { type: "SYNC_PLAYERS"; names: string[]; count: number };

function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

function nextIndex(pos: number, steps: number) {
  const n = tiles.length;
  const next = (pos + steps) % n;
  const passedGo = pos + steps >= n;
  return { next, passedGo };
}

function addLog(state: GameState, text: string): GameState {
  const entry: LogEntry = { id: crypto.randomUUID(), turn: state.turn, text };
  return { ...state, logs: [entry, ...state.logs].slice(0, 100) };
}

function drawQuestion(state: GameState): {
  nextState: GameState;
  question: Question;
} {
  const pointer = state.questionPointer;
  const q = questions[pointer % questions.length];
  const next = { ...state, questionPointer: (pointer + 1) % questions.length };
  return { nextState: next, question: q };
}

function updatePlayer(
  state: GameState,
  playerId: PlayerId,
  fn: (p: Player) => Player,
): GameState {
  return {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? fn(p) : p)),
  };
}

function handleLanding(state: GameState, tile: Tile): GameState {
  const current = state.players[state.currentPlayerIndex];

  // Race mode: chỉ log vị trí, không mua/bán/thuê
  let next = state;

  if (tile.type === "GO")
    return addLog(next, `${current.name} đi qua ô START.`);
  if (tile.type === "GO_TO_CRISIS") {
    next = addLog(next, `${current.name} bị đưa tới ô Khủng hoảng.`);
    next = updatePlayer(next, current.id, (p) => ({
      ...p,
      position: 10,
    }));
    return next;
  }
  if (tile.type === "ECONOMIC_CRISIS") {
    return addLog(next, `${current.name} đang ở ô Khủng hoảng.`);
  }
  if (tile.type === "SOCIAL_WELFARE") {
    return addLog(next, `${current.name} nghỉ tại ô Phúc lợi xã hội.`);
  }
  return addLog(next, `${current.name} dừng tại ô số ${tile.index}.`);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SYNC_PLAYERS": {
      const { names, count } = action;
      const validCount = Math.min(6, Math.max(1, count));
      const playerIds: PlayerId[] = [
        "PLAYER_0",
        "PLAYER_1",
        "PLAYER_2",
        "PLAYER_3",
        "PLAYER_4",
        "PLAYER_5",
      ];
      const tokens: PlayerToken[] = [
        { name: "CN", icon: "Hammer", colorClass: "text-red-600" },
        { name: "TB", icon: "Crown", colorClass: "text-gray-800" },
        { name: "TG", icon: "Book", colorClass: "text-blue-800" },
        { name: "ĐC", icon: "Key", colorClass: "text-green-800" },
        { name: "XH", icon: "Hammer", colorClass: "text-pink-600" },
        { name: "KT", icon: "Crown", colorClass: "text-cyan-600" },
      ];

      const newPlayers: Player[] = Array.from(
        { length: validCount },
        (_, idx) => ({
          id: playerIds[idx],
          name: names[idx] ?? `Người ${idx + 1}`,
          isHuman: true,
          token: tokens[idx],
          position: 0,
          cash: STARTING_CASH,
          skipTurns: 0,
          correct: 0,
          wrong: 0,
          laps: 0,
        }),
      );

      return {
        ...state,
        players: newPlayers,
        currentPlayerIndex: Math.min(state.currentPlayerIndex, validCount - 1),
      };
    }
    case "RESET":
      return initialState;
    case "CLOSE_MODAL":
      return { ...state, activeModal: { kind: "none" } };
    case "OPEN_QUESTION": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      if (state.diceAllowance) return state; // đã trả lời rồi
      const drawn = state.questionForTurn
        ? { nextState: state, question: state.questionForTurn }
        : drawQuestion(state);
      let next = drawn.nextState;
      next = {
        ...next,
        questionForTurn: drawn.question,
        activeModal: { kind: "question", question: drawn.question },
      };
      next = addLog(
        next,
        `${current.name} nhận câu hỏi triết học trước khi gieo xúc xắc.`,
      );
      return next;
    }
    case "ANSWER_QUESTION": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      if (!state.questionForTurn) return state;
      const allowance: 1 | 2 = action.correct ? 2 : 1;

      let next = state;
      next = updatePlayer(next, current.id, (p) => ({
        ...p,
        correct: p.correct + (action.correct ? 1 : 0),
        wrong: p.wrong + (action.correct ? 0 : 1),
      }));
      next = addLog(
        next,
        action.correct
          ? `${current.name} trả lời ĐÚNG → được gieo 2 xúc xắc.`
          : `${current.name} trả lời SAI → chỉ được gieo 1 xúc xắc.`,
      );
      return {
        ...next,
        diceAllowance: allowance,
        activeModal: { kind: "none" },
      };
    }
    case "CLEAR_MESSAGE":
      return { ...state, message: null };
    case "ROLL_DICE": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state; // bots handled elsewhere
      if (state.hasActedThisTurn)
        return {
          ...state,
          message: "Bạn đã gieo trong lượt này. Hãy kết thúc lượt.",
        };

      // Must answer question before rolling (Marx-opoly học trước chơi sau)
      if (!state.diceAllowance) {
        const drawn = state.questionForTurn
          ? { nextState: state, question: state.questionForTurn }
          : drawQuestion(state);
        const next: GameState = {
          ...drawn.nextState,
          questionForTurn: drawn.question,
          activeModal: { kind: "question", question: drawn.question },
        };
        return addLog(
          next,
          `${current.name} chưa trả lời câu hỏi → mở câu hỏi.`,
        );
      }

      const a = rollDie();
      const b = state.diceAllowance === 2 ? rollDie() : 0;
      const total = a + b;
      const moved = nextIndex(current.position, total);
      let next = addLog(
        state,
        `${current.name} gieo được ${a} + ${b} = ${total}.`,
      );

      next = updatePlayer(next, current.id, (p) => ({
        ...p,
        position: moved.next,
      }));
      if (moved.passedGo) {
        next = updatePlayer(next, current.id, (p) => ({
          ...p,
          laps: p.laps + 1,
        }));
        next = addLog(
          next,
          `${current.name} hoàn thành 1 vòng bàn cờ (tổng ${current.laps + 1} vòng).`,
        );
      }

      next = {
        ...next,
        dice: { a, b, total },
        diceAllowance: null, // chỉ gieo 1 lần mỗi lượt
        questionForTurn: null,
        hasActedThisTurn: true,
      };
      const tile = tiles[moved.next];
      return handleLanding(next, tile);
    }
    case "BOT_TAKE_TURN": {
      return state;
    }
    case "BUY_CONFIRMED": {
      return state;
    }
    case "BUILD_UPGRADE": {
      return state;
    }
    case "PAY_BAIL": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      if (current.cash < CRISIS_BAIL)
        return { ...state, message: "Không đủ MV để trả bảo lãnh." };
      let next = updatePlayer(state, current.id, (p) => ({
        ...p,
        cash: p.cash - CRISIS_BAIL,
        skipTurns: 0,
      }));
      next = addLog(
        next,
        `${current.name} trả ${CRISIS_BAIL} MV bảo lãnh và được đi tiếp.`,
      );
      return next;
    }
    case "END_TURN": {
      let next = state;
      const nextIndex = (next.currentPlayerIndex + 1) % next.players.length;
      const wraps = nextIndex === 0;
      next = {
        ...next,
        currentPlayerIndex: nextIndex,
        dice: null,
        message: null,
        questionForTurn: null,
        diceAllowance: null,
        awaitingDecision: null,
        hasActedThisTurn: false,
      };
      if (wraps) next = { ...next, turn: Math.min(MAX_TURNS, next.turn + 1) };
      return next;
    }
    default:
      return state;
  }
}

type GameApi = {
  state: GameState;
  tiles: Tile[];
  rollDice: () => void;
  openQuestion: () => void;
  answerQuestion: (correct: boolean) => void;
  endTurn: () => void;
  buy: () => void;
  build: (tileIndex: number) => void;
  payBail: () => void;
  closeModal: () => void;
  clearMessage: () => void;
  reset: () => void;
};

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: session } = useSession();

  // Sync player names from Session registration (variable humans)
  useEffect(() => {
    const names = session.players.map((p) => p.name);
    const count = session.playerCount;
    dispatch({ type: "SYNC_PLAYERS", names, count });
  }, [session.players, session.playerCount]);

  const api = useMemo<GameApi>(
    () => ({
      state,
      tiles,
      rollDice: () => dispatch({ type: "ROLL_DICE" }),
      openQuestion: () => dispatch({ type: "OPEN_QUESTION" }),
      answerQuestion: (correct) =>
        dispatch({ type: "ANSWER_QUESTION", correct }),
      endTurn: () => dispatch({ type: "END_TURN" }),
      buy: () => dispatch({ type: "BUY_CONFIRMED" }),
      build: (tileIndex) => dispatch({ type: "BUILD_UPGRADE", tileIndex }),
      payBail: () => dispatch({ type: "PAY_BAIL" }),
      closeModal: () => dispatch({ type: "CLOSE_MODAL" }),
      clearMessage: () => dispatch({ type: "CLEAR_MESSAGE" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
