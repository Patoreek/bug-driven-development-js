# Solution: Uncontrolled Form Reset

## The Bug

The form inputs are "uncontrolled" -- they have no `value` prop and React doesn't track their state. Values are read from the DOM via `form.elements.namedItem()` only on submit:

```tsx
const name = (form.elements.namedItem("name") as HTMLInputElement).value;
```

When the form is "reset" by toggling `submitted` back to `false`, there's no way to clear the input values because React doesn't control them:

```tsx
function handleReset() {
  setSubmitted(false); // Only resets the flag, not the inputs
}
```

## The Fix

Convert to controlled inputs by adding state for each field:

```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
```

Bind them to the inputs:
```tsx
<input value={name} onChange={(e) => setName(e.target.value)} ... />
```

Then clear everything in `handleReset`:
```tsx
function handleReset() {
  setName("");
  setEmail("");
  setMessage("");
  setSubmitted(false);
}
```

## Key Takeaway

Controlled components give React full control over form values, making features like reset, validation, and conditional logic straightforward. Uncontrolled components (reading from the DOM) bypass React's state model and make it impossible to programmatically clear or modify input values. Use controlled components whenever you need to reset, transform, or validate form data.
