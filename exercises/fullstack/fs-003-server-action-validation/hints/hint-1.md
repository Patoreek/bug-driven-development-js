# Hint 1 (Mild)

The `formData.get()` method returns `FormDataEntryValue | null`. Casting it with `as string` doesn't actually validate anything -- it just tells TypeScript to stop complaining. What happens if the field is missing or empty?
