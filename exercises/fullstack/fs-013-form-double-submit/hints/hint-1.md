# Hint 1 (Mild)

Look at the `SubmitButton` component. It renders a plain `<button>` with no way to know if the form is currently submitting. React 19 provides a hook specifically for this use case — check the `react-dom` hooks.

Also notice: the form sends product and quantity, but no unique identifier to prevent the server from processing the same submission twice.
