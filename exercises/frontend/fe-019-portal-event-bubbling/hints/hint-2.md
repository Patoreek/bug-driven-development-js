React portals preserve the React tree's event bubbling, meaning clicks inside the portal will bubble up to the `Toolbar`'s `onClick` handler. You need to stop this propagation at the portal boundary.
