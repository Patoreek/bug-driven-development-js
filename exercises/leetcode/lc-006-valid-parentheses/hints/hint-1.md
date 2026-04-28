# Hint 1 — Approach

Counting isn't enough because it loses information about **which** bracket was opened and **when**.

You need to track the sequence of opening brackets so that when you encounter a closing bracket, you can verify it matches the **most recently opened** bracket.

What data structure follows a "last in, first out" pattern?
