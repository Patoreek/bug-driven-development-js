# Hint 1 (Mild)

Look at the `useEffect` in the `Row` component. It calls `addEventListener` but does the cleanup function (the return value) call `removeEventListener`? Also check the scroll handler registration in `VirtualList` -- is the third argument to `addEventListener` doing anything?
