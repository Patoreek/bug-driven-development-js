# Hint 1 (Mild)

Every time the provider component re-renders, it creates a brand new object for `value`. React context consumers re-render whenever the context value changes — and a new object reference counts as "changed" even if the properties are identical.
