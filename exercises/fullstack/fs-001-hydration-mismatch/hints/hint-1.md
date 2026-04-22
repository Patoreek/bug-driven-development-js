# Hint 1 (Mild)

Think about when `useState(getTimeOfDayGreeting())` runs. The initializer function executes during the first render -- which happens on both the server and the client. What if the server is in a different timezone, or renders at a different second than the client?
