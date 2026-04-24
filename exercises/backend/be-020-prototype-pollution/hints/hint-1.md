# Hint 1 (Mild)

Look at the `for...of` loop in `deepMerge`. It iterates over every key from the source object. What happens when the key is `"__proto__"`? In JavaScript, writing to `obj.__proto__` modifies the prototype chain. Consider which keys are dangerous to write to.
