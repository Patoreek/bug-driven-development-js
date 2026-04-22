# Hint 2 (Medium)

The tests expect every error response to have the shape `{ error: { code: string, message: string } }`. Validation errors should return status 400 with code `"VALIDATION_ERROR"`. Not-found errors should return status 404 with code `"NOT_FOUND"`. Consider creating a helper function to build these responses consistently.
