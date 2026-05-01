# Hint 1: Pattern

Think about what happens when you merge lists sequentially. The first list's elements get compared over and over in every subsequent merge. Is there a way to balance the work more evenly across all lists?

Consider how merge sort works on arrays -- it doesn't sort one element at a time against the growing result. It divides the problem in half repeatedly.
