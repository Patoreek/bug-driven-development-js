# Hint 1 (Mild)

Look at what's inside `startTransition` and what's outside it. A text input's value needs to update at **urgent** priority so the user sees what they typed immediately. Is that happening here?
