export interface ServerEvent {
  id: string;
  title: string;
  date: Date;
  attendees: Set<string>;
  metadata: Map<string, string>;
  formatter: (title: string) => string;
  pattern: RegExp;
}

export function getServerEvents(): ServerEvent[] {
  return [
    {
      id: "evt-1",
      title: "Team Standup",
      date: new Date("2026-04-22T09:00:00Z"),
      attendees: new Set(["alice", "bob", "charlie"]),
      metadata: new Map([
        ["location", "Room A"],
        ["recurring", "daily"],
        ["priority", "high"],
      ]),
      formatter: (title: string) => title.toUpperCase(),
      pattern: /standup/i,
    },
    {
      id: "evt-2",
      title: "Sprint Review",
      date: new Date("2026-04-25T14:00:00Z"),
      attendees: new Set(["alice", "diana"]),
      metadata: new Map([
        ["location", "Room B"],
        ["recurring", "biweekly"],
        ["priority", "medium"],
      ]),
      formatter: (title: string) => `[Review] ${title}`,
      pattern: /review/i,
    },
  ];
}
