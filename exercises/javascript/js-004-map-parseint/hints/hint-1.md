# Hint 1

How many arguments does `.map()` pass to its callback function? And how many arguments does `parseInt` accept? Try logging what arguments `parseInt` receives:

```js
["1", "2", "3"].map((...args) => {
  console.log(args);
  return parseInt(...args);
});
```
