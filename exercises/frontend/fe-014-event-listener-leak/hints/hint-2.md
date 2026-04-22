`useEffect` can return a cleanup function that runs when the component unmounts (or before the effect re-runs). If you add an event listener, you need to remove it in the cleanup function.
