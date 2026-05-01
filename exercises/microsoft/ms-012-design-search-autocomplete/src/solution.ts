/**
 * LeetCode 642 - Design Search Autocomplete System
 *
 * Design a search autocomplete system that returns top 3 suggestions
 * based on prefix matching, ranked by frequency then alphabetically.
 *
 * BUG 1: When recording a sentence via '#', it sets the frequency to 1
 * instead of incrementing the existing frequency. Repeated entries don't
 * accumulate properly.
 *
 * BUG 2: Uses brute-force linear scan + full sort on every keystroke
 * instead of a Trie. O(n*m) per keystroke.
 */
export class AutocompleteSystem {
  private sentences: Map<string, number>;
  private currentInput: string;

  constructor(sentences: string[], times: number[]) {
    this.sentences = new Map();
    for (let i = 0; i < sentences.length; i++) {
      this.sentences.set(sentences[i], times[i]);
    }
    this.currentInput = "";
  }

  input(c: string): string[] {
    if (c === "#") {
      // BUG: Sets frequency to 1 instead of incrementing
      // Should be: this.sentences.set(this.currentInput, (this.sentences.get(this.currentInput) || 0) + 1)
      this.sentences.set(this.currentInput, 1);
      this.currentInput = "";
      return [];
    }

    this.currentInput += c;

    // O(n) scan of ALL sentences for matching prefix
    const matches: [string, number][] = [];
    for (const [sentence, freq] of this.sentences) {
      if (sentence.startsWith(this.currentInput)) {
        matches.push([sentence, freq]);
      }
    }

    // O(n log n) sort of ALL matches
    matches.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

    return matches.slice(0, 3).map(([s]) => s);
  }
}
