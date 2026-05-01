# Hint 3: Incremental traversal

Instead of re-scanning from the root on each keystroke, maintain a `currentNode` pointer:

```typescript
input(c: string): string[] {
  if (c === "#") {
    this.addSentence(this.currentInput, 1);
    this.currentInput = "";
    this.currentNode = this.root;
    return [];
  }

  this.currentInput += c;

  // Move to child node (or null if no match)
  if (!this.currentNode || !this.currentNode.children.has(c)) {
    this.currentNode = null;
    return [];
  }

  this.currentNode = this.currentNode.children.get(c)!;
  // Sort and return top 3 from currentNode.sentences
  return this.getTop3(this.currentNode);
}
```

When `currentNode` is null (no match for current prefix), all subsequent characters also return empty until `'#'` resets the state.
