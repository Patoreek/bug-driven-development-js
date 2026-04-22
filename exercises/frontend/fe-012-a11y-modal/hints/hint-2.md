You need to add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title's `id`. You also need a `useEffect` that listens for keyboard events — specifically Escape and Tab.
