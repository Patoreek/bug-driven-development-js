# Solution: Hydration Mismatch

## The Bug

The component directly calls `new Date().getHours()` and `window.innerWidth` during the initial render via `useState` initializers:

```tsx
const [greeting] = useState(getTimeOfDayGreeting()); // Calls Date during render
const [layout] = useState(getLayout());               // Calls window.innerWidth during render
```

On the server, `window` doesn't exist (crash), and `Date` may return a different hour than the client. This causes a hydration mismatch: the server-rendered HTML says "Good morning" but the client computes "Good afternoon", and React warns about the inconsistency.

## The Fix

Start with safe defaults that work on both server and client, then measure client-only values inside `useEffect`:

```tsx
const [greeting, setGreeting] = useState<string | null>(null);
const [layout, setLayout] = useState<"compact" | "full">("full");

useEffect(() => {
  setGreeting(getTimeOfDayGreeting());
  setLayout(getLayout());
}, []);
```

The initial render uses `"Hello"` as a generic fallback and `"full"` as the default layout. After hydration, `useEffect` runs client-side and updates with the real values.

## Key Takeaway

Never access browser-only APIs (`window`, `navigator`, `document`) or time-dependent values (`Date`) during the initial render of a server-rendered component. Use `useEffect` to defer client-only computations until after hydration.
