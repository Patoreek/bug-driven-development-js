/**
 * LeetCode 642 - Design Search Autocomplete System
 *
 * Design a search autocomplete system that returns top 3 suggestions
 * based on prefix matching, ranked by frequency then alphabetically.
 *
 * SOLUTION: Uses a Trie where each node stores sentence->frequency pairs
 * for all sentences passing through that node. Maintains a current node
 * pointer for incremental traversal.
 */

interface TrieNode {
  children: Map<string, TrieNode>;
  sentences: Map<string, number>; // sentence -> frequency
}

function createNode(): TrieNode {
  return { children: new Map(), sentences: new Map() };
}

export class AutocompleteSystem {
  private root: TrieNode;
  private currentInput: string;
  private currentNode: TrieNode | null;

  constructor(sentences: string[], times: number[]) {
    this.root = createNode();
    this.currentInput = "";
    this.currentNode = this.root;

    for (let i = 0; i < sentences.length; i++) {
      this.addSentence(sentences[i], times[i]);
    }
  }

  private addSentence(sentence: string, count: number): void {
    let node = this.root;
    for (const c of sentence) {
      if (!node.children.has(c)) {
        node.children.set(c, createNode());
      }
      node = node.children.get(c)!;
      node.sentences.set(
        sentence,
        (node.sentences.get(sentence) || 0) + count
      );
    }
  }

  private getTop3(node: TrieNode): string[] {
    const entries = Array.from(node.sentences.entries());
    entries.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
    return entries.slice(0, 3).map(([s]) => s);
  }

  input(c: string): string[] {
    if (c === "#") {
      this.addSentence(this.currentInput, 1);
      this.currentInput = "";
      this.currentNode = this.root;
      return [];
    }

    this.currentInput += c;

    if (!this.currentNode || !this.currentNode.children.has(c)) {
      this.currentNode = null;
      return [];
    }

    this.currentNode = this.currentNode.children.get(c)!;
    return this.getTop3(this.currentNode);
  }
}
