import type { ServerEvent } from "./serverData";

export const TYPE_MARKERS = {
  DATE: "__date__",
  MAP: "__map__",
  SET: "__set__",
  REGEXP: "__regexp__",
  FUNCTION: "__function__",
} as const;

export interface SerializedEvent {
  id: string;
  title: string;
  date: unknown;
  attendees: unknown;
  metadata: unknown;
  formatter: unknown;
  pattern: unknown;
}

// FIX: Properly serialize non-JSON-safe types with type markers
export function prepareForClient(events: ServerEvent[]): SerializedEvent[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    // FIX: Date -> { __type, value: ISO string }
    date: {
      __type: TYPE_MARKERS.DATE,
      value: event.date.toISOString(),
    },
    // FIX: Set -> { __type, values: array }
    attendees: {
      __type: TYPE_MARKERS.SET,
      values: Array.from(event.attendees),
    },
    // FIX: Map -> { __type, entries: [key, value][] }
    metadata: {
      __type: TYPE_MARKERS.MAP,
      entries: Array.from(event.metadata.entries()),
    },
    // FIX: Function -> { __type, name: identifier }
    formatter: {
      __type: TYPE_MARKERS.FUNCTION,
      name: event.formatter.name || "anonymous",
    },
    // FIX: RegExp -> { __type, source, flags }
    pattern: {
      __type: TYPE_MARKERS.REGEXP,
      source: event.pattern.source,
      flags: event.pattern.flags,
    },
  }));
}

// FIX: Reconstruct original types from serialized representation
export function reconstructOnClient(events: SerializedEvent[]): {
  id: string;
  title: string;
  date: Date;
  attendees: string[];
  metadata: Record<string, string>;
  formatterName: string;
  patternSource: string;
}[] {
  return events.map((event) => {
    const dateField = event.date as { __type: string; value: string };
    const attendeesField = event.attendees as { __type: string; values: string[] };
    const metadataField = event.metadata as { __type: string; entries: [string, string][] };
    const formatterField = event.formatter as { __type: string; name: string };
    const patternField = event.pattern as { __type: string; source: string; flags: string };

    return {
      id: event.id,
      title: event.title,
      // FIX: Reconstruct Date from ISO string
      date: new Date(dateField.value),
      // FIX: Use the values array directly
      attendees: attendeesField.values,
      // FIX: Reconstruct record from entries
      metadata: Object.fromEntries(metadataField.entries),
      // FIX: Use the stored name
      formatterName: formatterField.name || "none",
      // FIX: Use the stored source
      patternSource: patternField.source,
    };
  });
}

export function simulateRSCRoundTrip<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
