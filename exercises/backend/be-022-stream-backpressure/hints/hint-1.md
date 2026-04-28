# Hint 1 -- Mild

Look at what `destination.write(transformed)` returns. It returns a `boolean` -- `true` means the buffer has room, `false` means it is full. The buggy code discards this return value entirely. When it is `false`, you need to tell the source to stop sending data until the destination catches up.

The `Readable` stream has `.pause()` and `.resume()` methods for exactly this purpose.
