# Uncontrolled Form Reset

**ID:** `fe-010-uncontrolled-form`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `react`, `forms`, `controlled-components`, `useRef`, `state`  
**Prerequisites:** None

---

## The Scenario

Your team built a contact form that shows a success message after submission, with a "Send Another" button to reset the form. During QA, a tester noticed that after clicking "Send Another", the form reappears but the previous values are still in the input fields. The user expects a blank form, but their old name, email, and message are still there.

## The Bug

The form inputs are uncontrolled -- React doesn't manage their values through state. The form reads values directly from the DOM on submit. When the "reset" happens, it only toggles the `submitted` flag back to `false`, which remounts the form. But since the inputs don't have a `value` prop tied to state, there's no mechanism to clear them when the form reappears, and the browser may retain the old values.

## Your Task

1. Convert the form to use controlled inputs with React state
2. Clear all field values when resetting the form
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/ContactForm.tsx` | Contact form with uncontrolled inputs and broken reset |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Controlled vs Uncontrolled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components) -- React form patterns
- [Responding to Input with State](https://react.dev/learn/reacting-to-input-with-state) -- managing form state
