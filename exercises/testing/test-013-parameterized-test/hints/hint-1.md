# Hint 1 -- Mild

Look at the tests that are failing. Run them against the real `validatePassword` function and check:
- What does `validatePassword("MyPassw0rd")` actually return for errors? (no special character test)
- What does `validatePassword("Abcd1!xy")` return for strength?
- How many errors does `validatePassword("ab")` actually produce?

Once you find the copy-paste bugs, think about how `it.each` could prevent them in the future by keeping inputs and expectations in a single data table.
