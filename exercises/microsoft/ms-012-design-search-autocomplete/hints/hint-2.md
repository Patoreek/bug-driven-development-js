# Hint 2: Trie node design

Use a **Trie** (prefix tree). Each node needs:
- `children: Map<string, TrieNode>` -- child nodes by character
- `sentences: Map<string, number>` -- all sentences passing through this node, with their frequencies

When you insert a sentence, update the `sentences` map at **every** node along the path. This way, when you reach a node, you already have all candidate sentences and their frequencies ready to sort.

The key insight: store sentence information redundantly at every node in its path, trading space for lookup speed.
