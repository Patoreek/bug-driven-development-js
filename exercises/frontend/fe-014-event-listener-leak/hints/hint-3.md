Add a return statement to the `useEffect` that removes the listener:

```tsx
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener("resize", handleResize);
  
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

The same function reference (`handleResize`) must be passed to both `addEventListener` and `removeEventListener`.
