/**
 * Trip iCalendar (.ics) Generator
 * Generates standard RFC 5545 calendar events with alarms for Delta check-in,
 * flights, and key Detroit milestones.
 */

export function generateTripICS() {
  const events = [
    {
      title: "🚨 Delta Check-In Window Opens (G82B6L)",
      start: "20260913T093500Z", // 10:35 AM GMT+1
      end: "20260913T100500Z",
      description: "Check in online immediately on Delta or Air France app.\nConfirmation: G82B6L\nTicket: 0062455565576\nPassenger: BENJAMIN PRENTISS\nPortal: https://www.delta.com/my-trips/search?staticurl=t",
      alarmMinutes: 15,
    },
    {
      title: "🛫 Flight DL8491: Rabat RBA → Paris CDG",
      start: "20260914T093500Z", // 10:35 AM GMT+1
      end: "20260914T134000Z",
      description: "Leave Fès by 4:45 AM. Arrive RBA airport desk by 7:30 AM for document verification & bag tag to DTW.\nConfirmation: G82B6L",
      alarmMinutes: 180,
    },
    {
      title: "🛫 Flight DL8719: Paris CDG → Detroit DTW",
      start: "20260914T140500Z", // 4:05 PM CEST = 14:05 UTC
      end: "20260914T225000Z", // 6:50 PM EDT = 22:50 UTC
      description: "Transatlantic flight to Detroit DTW McNamara Terminal.\nConfirmation: G82B6L",
      alarmMinutes: 60,
    },
    {
      title: "🎭 DIA + Dance City Festival (Rivera Court)",
      start: "20260918T210000Z", // 5:00 PM EDT = 21:00 UTC
      end: "20260919T010000Z", // 9:00 PM EDT
      description: "Detroit Institute of Arts open until 9 PM. Dance City Festival performance in Rivera Court at 5 PM.\nFree admission with student / Oakland County ID.",
    },
    {
      title: "🌟 Main Detroit Excursion Loop",
      start: "20260919T140000Z", // 10:00 AM EDT
      end: "20260919T220000Z",
      description: "Royal Oak → FAST Woodward bus ($2 Jam, $0 Susu w/ student ID) → Guardian Building → Campus Martius → Riverwalk → Free QLINE streetcar to Midtown → optional Eastern Market.",
    },
    {
      title: "🛫 Return Flight DL228: Detroit DTW → Paris CDG",
      start: "20260924T224000Z", // 6:40 PM EDT = 22:40 UTC
      end: "20260925T064000Z",
      description: "Leave for DTW airport ~3:15–3:30 PM.\nConfirmation: G82B6L",
      alarmMinutes: 180,
    },
    {
      title: "🛬 Return Flight AF1258 / DL8271: Paris CDG → Rabat RBA",
      start: "20260925T091500Z", // 11:15 AM CEST = 09:15 UTC
      end: "20260925T121000Z", // 1:10 PM GMT+1 = 12:10 UTC
      description: "Return leg landing at Rabat-Salé RBA at 1:10 PM (Morocco GMT+1).\nConfirmation: G82B6L",
    },
  ];

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Royal Oak Trip Command Center//Trip Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Royal Oak Trip 2026",
    "X-WR-TIMEZONE:UTC",
  ];

  events.forEach((ev, idx) => {
    ics.push("BEGIN:VEVENT");
    ics.push("UID:ro-trip-" + idx + "@royaloak.trip");
    ics.push("DTSTAMP:20260911T110000Z");
    ics.push("DTSTART:" + ev.start);
    ics.push("DTEND:" + ev.end);
    ics.push("SUMMARY:" + ev.title);
    ics.push("DESCRIPTION:" + ev.description.replace(/\n/g, "\\n"));
    if (ev.alarmMinutes) {
      ics.push("BEGIN:VALARM");
      ics.push("ACTION:DISPLAY");
      ics.push("DESCRIPTION:" + ev.title);
      ics.push("TRIGGER:-PT" + ev.alarmMinutes + "M");
      ics.push("END:VALARM");
    }
    ics.push("END:VEVENT");
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

export function downloadTripCalendar() {
  if (typeof window === "undefined") return;
  const content = generateTripICS();
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Royal_Oak_Trip_2026.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
