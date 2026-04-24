# Hint 1 (Mild)

Try this in your browser console:

```js
JSON.parse(JSON.stringify(new Date()))       // string, not Date
JSON.parse(JSON.stringify(new Map([["a",1]]))) // {}
JSON.parse(JSON.stringify(new Set([1,2,3])))   // {}
JSON.parse(JSON.stringify({ fn: () => {} }))   // {} (fn dropped)
JSON.parse(JSON.stringify(/test/i))            // {}
```

The `prepareForClient` function needs to convert these types into JSON-safe objects BEFORE they go through serialization.
