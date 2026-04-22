# Hint 3 (Strong)

Add state for each field and bind them to the inputs:
```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");

// In the JSX:
<input value={name} onChange={(e) => setName(e.target.value)} ... />

// In handleReset:
function handleReset() {
  setName("");
  setEmail("");
  setMessage("");
  setSubmitted(false);
}
```
Also update `handleSubmit` to read from state instead of the DOM.
