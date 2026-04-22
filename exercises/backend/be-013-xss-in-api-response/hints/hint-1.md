# Hint 1 (Mild)

Look at the `escapeHtml` function. Does it actually do anything to the input string? Now look at `renderUserCard` and `renderSearchResults` -- are they even calling `escapeHtml` on user input before placing it in HTML?
