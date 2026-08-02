import type { AnalysisResult } from "@/lib/analyze.functions";

export interface HistoryItem {
  id: string;
  text: string;
  result: AnalysisResult;
  caseId: string;
  createdAt: number;
}

const KEY = "replygenie_history_v1";
const MAX = 30;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    // ignore quota
  }
}

export function addHistoryItem(item: HistoryItem): HistoryItem[] {
  const items = [item, ...loadHistory().filter((i) => i.id !== item.id)].slice(0, MAX);
  saveHistory(items);
  return items;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export const PENDING_LOAD_KEY = "replygenie_pending_load";
