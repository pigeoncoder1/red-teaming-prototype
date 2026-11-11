// Shared types describing the shape of results.json produced by
// run_attacks.py. Kept in one place so App/AttackList/DetailPanel all agree
// on the shape without re-declaring it.

export type Role = "user" | "assistant";

export interface TranscriptTurn {
  role: Role;
  content: string;
}

// The runner can also emit "ERROR" (the /chat or judge call failed) or
// "UNKNOWN" (the judge didn't follow the expected response format), so the
// UI needs to handle more than just SUCCESS/FAILURE.
export type Verdict = "SUCCESS" | "FAILURE" | "ERROR" | "UNKNOWN";

export interface AttackResult {
  id: string;
  category: string;
  description: string;
  transcript: TranscriptTurn[];
  heuristic_verdict: Verdict;
  llm_verdict: Verdict;
  llm_reason: string;
  error: string | null;
}

/** True when the two scoring methods reached different conclusions. */
export function verdictsDisagree(r: AttackResult): boolean {
  return (
    r.heuristic_verdict !== r.llm_verdict &&
    r.heuristic_verdict !== "ERROR" &&
    r.llm_verdict !== "ERROR"
  );
}

/** "authority_impersonation" -> "Authority impersonation" (ASR stays uppercase). */
export function formatCategory(category: string): string {
  const words = category.split("_").map((w) => (w === "asr" ? "ASR" : w));
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
