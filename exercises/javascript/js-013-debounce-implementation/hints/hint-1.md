# Hint 1 -- Mild

For debounce: what happens to the **previous** timer when the function is called again? Is it being canceled?

For throttle: the `inThrottle` flag is set to `true`, but when does it ever become `false` again?
