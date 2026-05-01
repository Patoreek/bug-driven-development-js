# Hint 2 - Technique

Use the **two-pointer** technique. Place one pointer at the start and one at the end of the string.

Move each pointer inward, but **skip** any character that is not alphanumeric (not a letter or digit). When both pointers land on alphanumeric characters, compare them in lowercase.

You can check if a character is alphanumeric with a regex like `/[a-zA-Z0-9]/`.
