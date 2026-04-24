import { describe, it, expect } from "vitest";
import { getServerEvents } from "../serverData";
import {
  prepareForClient,
  reconstructOnClient,
  simulateRSCRoundTrip,
  TYPE_MARKERS,
} from "../serialize";

describe("prepareForClient - serialization", () => {
  const events = getServerEvents();

  it("converts Date objects to a serializable format with type marker", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    // After JSON round-trip, the date should still be reconstructable
    const dateField = roundTripped[0].date as { __type: string; value: string };
    expect(dateField.__type).toBe(TYPE_MARKERS.DATE);
    expect(typeof dateField.value).toBe("string");
    // The ISO string should be parseable back to the original date
    expect(new Date(dateField.value).toISOString()).toBe("2026-04-22T09:00:00.000Z");
  });

  it("converts Set objects to a serializable format with type marker", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    const attendeesField = roundTripped[0].attendees as { __type: string; values: string[] };
    expect(attendeesField.__type).toBe(TYPE_MARKERS.SET);
    expect(Array.isArray(attendeesField.values)).toBe(true);
    expect(attendeesField.values).toContain("alice");
    expect(attendeesField.values).toContain("bob");
    expect(attendeesField.values).toContain("charlie");
    expect(attendeesField.values).toHaveLength(3);
  });

  it("converts Map objects to a serializable format with type marker", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    const metadataField = roundTripped[0].metadata as { __type: string; entries: [string, string][] };
    expect(metadataField.__type).toBe(TYPE_MARKERS.MAP);
    expect(Array.isArray(metadataField.entries)).toBe(true);
    expect(metadataField.entries).toContainEqual(["location", "Room A"]);
    expect(metadataField.entries).toContainEqual(["recurring", "daily"]);
    expect(metadataField.entries).toContainEqual(["priority", "high"]);
  });

  it("converts functions to a serializable marker", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    const formatterField = roundTripped[0].formatter as { __type: string; name: string };
    expect(formatterField.__type).toBe(TYPE_MARKERS.FUNCTION);
    expect(typeof formatterField.name).toBe("string");
  });

  it("converts RegExp to a serializable format with type marker", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    const patternField = roundTripped[0].pattern as { __type: string; source: string; flags: string };
    expect(patternField.__type).toBe(TYPE_MARKERS.REGEXP);
    expect(patternField.source).toBe("standup");
    expect(patternField.flags).toBe("i");
  });

  it("preserves plain serializable fields unchanged", () => {
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);

    expect(roundTripped[0].id).toBe("evt-1");
    expect(roundTripped[0].title).toBe("Team Standup");
    expect(roundTripped[1].id).toBe("evt-2");
    expect(roundTripped[1].title).toBe("Sprint Review");
  });
});

describe("reconstructOnClient - deserialization", () => {
  it("reconstructs Dates from serialized format", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    expect(reconstructed[0].date).toBeInstanceOf(Date);
    expect(reconstructed[0].date.toISOString()).toBe("2026-04-22T09:00:00.000Z");
    expect(reconstructed[1].date).toBeInstanceOf(Date);
    expect(reconstructed[1].date.toISOString()).toBe("2026-04-25T14:00:00.000Z");
  });

  it("reconstructs attendees as an array from serialized Set", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    expect(Array.isArray(reconstructed[0].attendees)).toBe(true);
    expect(reconstructed[0].attendees).toContain("alice");
    expect(reconstructed[0].attendees).toContain("bob");
    expect(reconstructed[0].attendees).toContain("charlie");
    expect(reconstructed[0].attendees).toHaveLength(3);
  });

  it("reconstructs metadata as a Record from serialized Map", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    expect(reconstructed[0].metadata).toEqual({
      location: "Room A",
      recurring: "daily",
      priority: "high",
    });
  });

  it("extracts function name from serialized marker", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    // Functions can't cross the boundary, but we preserve their name/identifier
    expect(typeof reconstructed[0].formatterName).toBe("string");
    expect(reconstructed[0].formatterName.length).toBeGreaterThan(0);
    expect(reconstructed[0].formatterName).not.toBe("none");
  });

  it("extracts regex source from serialized marker", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    expect(reconstructed[0].patternSource).toBe("standup");
    expect(reconstructed[1].patternSource).toBe("review");
  });
});

describe("full round-trip integrity", () => {
  it("survives JSON round-trip without data loss", () => {
    const events = getServerEvents();
    const serialized = prepareForClient(events);
    const roundTripped = simulateRSCRoundTrip(serialized);
    const reconstructed = reconstructOnClient(roundTripped);

    // All events should be present
    expect(reconstructed).toHaveLength(2);

    // First event fully intact
    expect(reconstructed[0].id).toBe("evt-1");
    expect(reconstructed[0].title).toBe("Team Standup");
    expect(reconstructed[0].date.getFullYear()).toBe(2026);
    expect(reconstructed[0].attendees).toHaveLength(3);
    expect(Object.keys(reconstructed[0].metadata)).toHaveLength(3);

    // Second event fully intact
    expect(reconstructed[1].id).toBe("evt-2");
    expect(reconstructed[1].title).toBe("Sprint Review");
    expect(reconstructed[1].date.getFullYear()).toBe(2026);
    expect(reconstructed[1].attendees).toHaveLength(2);
  });
});
