// BUG: Serialization utilities that don't properly handle non-JSON-safe types

import type { ServerEvent } from "./serverData";

// Type markers for reconstruction
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

// BUG: This function is supposed to convert non-serializable types to
// JSON-safe representations, but it just passes everything through as-is.
// When JSON.stringify runs (as RSC serialization does), Date becomes a string,
// Map/Set become {}, and functions are dropped entirely.
export function prepareForClient(events: ServerEvent[]): SerializedEvent[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    // BUG: Date object will be auto-converted to string by JSON, but without
    // a type marker, the client can't know to reconstruct it as a Date
    date: event.date,
    // BUG: Set becomes {} when JSON.stringified
    attendees: event.attendees,
    // BUG: Map becomes {} when JSON.stringified
    metadata: event.metadata,
    // BUG: Functions are silently dropped by JSON.stringify
    formatter: event.formatter,
    // BUG: RegExp becomes {} when JSON.stringified
    pattern: event.pattern,
  }));
}

// BUG: This function is supposed to reconstruct the original types from
// the serialized representation, but since prepareForClient doesn't
// create proper serialized forms, there's nothing to reconstruct.
export function reconstructOnClient(events: SerializedEvent[]): {
  id: string;
  title: string;
  date: Date;
  attendees: string[];
  metadata: Record<string, string>;
  formatterName: string;
  patternSource: string;
}[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    // BUG: Tries to use event.date as-is — but after JSON round-trip it's a string
    date: event.date as unknown as Date,
    // BUG: Tries to spread a Set, but after JSON round-trip it's {}
    attendees: Array.from(event.attendees as Set<string>),
    // BUG: Tries to use Object.fromEntries on a Map, but after JSON round-trip it's {}
    metadata: Object.fromEntries(event.metadata as Map<string, string>),
    // BUG: Function was dropped — this will be undefined
    formatterName: typeof event.formatter === "function" ? "custom" : "none",
    // BUG: RegExp was lost — this will fail
    patternSource: (event.pattern as RegExp)?.source ?? "unknown",
  }));
}

// Simulates the JSON round-trip that happens in RSC serialization
export function simulateRSCRoundTrip<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
