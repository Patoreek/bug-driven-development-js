# Hint 3 (Strong)

Here's the fixed `prepareForClient`:

```typescript
export function prepareForClient(events: ServerEvent[]): SerializedEvent[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    date: { __type: TYPE_MARKERS.DATE, value: event.date.toISOString() },
    attendees: { __type: TYPE_MARKERS.SET, values: Array.from(event.attendees) },
    metadata: { __type: TYPE_MARKERS.MAP, entries: Array.from(event.metadata.entries()) },
    formatter: { __type: TYPE_MARKERS.FUNCTION, name: event.formatter.name || "anonymous" },
    pattern: { __type: TYPE_MARKERS.REGEXP, source: event.pattern.source, flags: event.pattern.flags },
  }));
}
```

And the fixed `reconstructOnClient`:

```typescript
return events.map((event) => {
  const dateField = event.date as { __type: string; value: string };
  const attendeesField = event.attendees as { __type: string; values: string[] };
  const metadataField = event.metadata as { __type: string; entries: [string, string][] };
  const formatterField = event.formatter as { __type: string; name: string };
  const patternField = event.pattern as { __type: string; source: string };
  return {
    id: event.id, title: event.title,
    date: new Date(dateField.value),
    attendees: attendeesField.values,
    metadata: Object.fromEntries(metadataField.entries),
    formatterName: formatterField.name || "none",
    patternSource: patternField.source,
  };
});
```
