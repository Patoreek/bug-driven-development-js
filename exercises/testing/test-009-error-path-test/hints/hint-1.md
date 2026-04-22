# Hint 1 (Mild)

Read through the `FileUploader.ts` source carefully. Count the `if` branches in `validateFile` (there are 4 rejection cases), the `catch` branches in `uploadFile` (there are 5 different error types), and the edge cases in `uploadMultipleFiles` (empty array, partial failures). Each of these branches needs at least one test.
