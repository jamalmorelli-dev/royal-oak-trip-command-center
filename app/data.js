export const trip = {
  traveler: 'Benjamin Prentiss',
  student: 'Susu (Royal Oak High School)',
  confirmation: 'G82B6L',
  ticket: '0062455565576',
  dates: 'Sep 14–25, 2026',
  base: 'Royal Oak, Michigan',
  school: 'Royal Oak High School, 1500 Lexington Blvd',
  hostArea: '4322 Buckingham Rd area',
  ticketMAD: 13231,
  ticketUSD: 1412.26,
  flights: [
    ['Sep 14', 'DL 8491', 'Air France', 'Rabat RBA', '10:35 AM', 'Paris CDG', '2:40 PM', 'Economy X'],
    ['Sep 14', 'DL 8719', 'Air France', 'Paris CDG', '4:05 PM', 'Detroit DTW', '6:50 PM', 'Economy X'],
    ['Sep 24', 'DL 228', 'Delta', 'Detroit DTW', '6:40 PM', 'Paris CDG', '8:40 AM Sep 25', 'Delta Main L'],
    ['Sep 25', 'DL 8271 / AF1258', 'Air France', 'Paris CDG', '11:15 AM', 'Rabat RBA', '1:10 PM', 'VERIFIED 2026-09-08 — was 12:10 PM; updated per Morocco UTC+1 legal-time change. Re-verify 24–48h before return.']
  ],
  baggage: 'Carry-on + first + second checked bags free; checked bags up to 50 lb / 23 kg each.',

  plane: {
    checkInOpens: 'Sun Sep 13, 2026 — about 10:35 AM Morocco time (24h before RBA departure)',
    departureTarget: 'Mon Sep 14 — leave Fès about 4:45–5:00 AM; target RBA by 7:00–7:30 AM',
    airportRule: 'Rabat departure may require collecting the boarding pass at the Air France airport desk even after online check-in.',
    primaryFlight: 'DL 8491 / Air France — RBA 10:35 AM → CDG 2:40 PM',
    connection: 'DL 8719 / Air France — CDG 4:05 PM → DTW 6:50 PM',
    checkin: [
      ['Physical passport', 'CRITICAL', 'Carry on your person; ticket name is BENJAMIN PRENTISS. Never place passport in checked baggage.'],
      ['Passport scan/photo', 'BACKUP', 'Save the photo page offline on the phone plus one separate backup location.'],
      ['Delta itinerary / receipt', 'PRINT + OFFLINE', 'Confirmation G82B6L; ticket 0062455565576. Print one copy and save screenshots/PDF offline.'],
      ['Online check-in', 'DO SEP 13', 'Attempt as soon as the airline opens check-in. Enter passport details exactly and confirm both outbound segments.'],
      ['Boarding passes', 'AIRPORT BACKUP', 'Save any mobile passes, screenshot them, and collect paper boarding passes at RBA if required.'],
      ['Checked-bag routing', 'ASK AT RBA', 'Confirm the bag tag destination is DTW, not CDG.'],
      ['Bag weight', 'BEFORE LEAVING FÈS', 'Ticket currently shows first and second checked bags free, each up to 23 kg / 50 lb.'],
      ['Carry-on essentials', 'CRITICAL', 'Passport, medication, wallet/cards/cash, phone, charger/power bank and essential documents stay in carry-on.'],
      ['Security prep', 'READY', 'Liquids/security rules; power banks stay in carry-on; keep laptop/tablet accessible.'],
      ['Phone readiness', 'READY', 'Fully charged; Delta/Air France access; offline screenshots of itinerary, confirmation, ticket number and boarding passes.']
    ],
    nightBefore: [
      'Passport physically in travel wallet',
      'Phone fully charged',
      'Wallet/cards/cash',
      'Printed itinerary/receipt',
      'Carry-on packed and weighed',
      'Checked bags weighed and tagged with contact info',
      'Alarm(s) set for Fès departure',
      'Car/driver to RBA confirmed'
    ],
    rbaSequence: [
      ['~7:00–7:30 AM', 'Arrive RBA with a large buffer.'],
      ['Immediately', 'Go to Air France desk; passport/document check; collect paper boarding pass if required.'],
      ['Bag drop', 'Confirm checked bag is tagged through to DTW.'],
      ['Security / exit control', 'Proceed immediately after check-in; do not linger landside.'],
      ['Gate', 'Re-check gate/boarding time on airport screens and airline app.'],
      ['10:35 AM', 'DL8491 scheduled departure to Paris CDG.']
    ]
  },
  budget: [
    ['Airfare', 1412.26],
    ['Groceries', 299],
    ['Dining / coffee', 450],
    ['School transportation', 80],
    ['Other local transport', 118],
    ['Activities', 62],
    ['Clothes / essentials', 220],
    ['School / child costs', 104],
    ['Phone / connectivity', 30],
    ['Medical / pharmacy', 50],
    ['Gifts', 50],
    ['Miscellaneous', 100]
  ],
  local: [
    ['Culture / Arts', 'Detroit Institute of Arts (DIA)', '5200 Woodward Ave, Detroit', 'Diego Rivera murals, world-class collection. Open till 9 PM Fri. Dance City Festival Fri Sep 18 @ 5 PM.', 'FREE w/ Tri-County ID (Oakland/Wayne/Macomb) or student doc; else $20 adult / $8 youth (6–17)'],
    ['Architecture / Walk', 'Guardian Building', '500 Griswold St, Detroit', '1929 Art Deco cathedral landmark; stunning color tile lobby & promenade. Downtown near transit.', 'FREE ($0)'],
    ['Waterfront / Public Space', 'Detroit Riverwalk & Campus Martius', 'Detroit Downtown / Riverfront', 'River views, plaza, people-watching, parks. Ranked #1 riverwalk in USA.', 'FREE ($0)'],
    ['Food / Market', 'Eastern Market', '2934 Russell St, Detroit', 'Historic 6-block public food & arts market; murals, specialty vendors. Saturday market 6 AM–4 PM.', 'Free walk / food budget'],
    ['Special Event', 'Dance City Festival @ DIA', 'DIA Rivera Court, 5200 Woodward Ave', 'Live performance in Rivera Court Fri Sep 18 at 5:00 PM. DIA open till 9 PM.', 'Included w/ DIA general admission ($0 w/ ID)'],
    ['Groceries + basics', 'Meijer', '5150 Coolidge Hwy, Royal Oak', 'Main stock-up; groceries, household, apparel, pharmacy', '$110 primary run'],
    ['Groceries', 'Hollywood Markets', '714 N Main St, Royal Oak', 'Smaller top-up, meat, produce', '$60'],
    ['Prepared/specialty food', 'Holiday Market', '1203 S Main St, Royal Oak', 'Bakery, prepared food, specialty groceries', '$35 selective'],
    ['Clothes + essentials', 'Target', '32001 John R Rd, Madison Heights', 'Clothes, shoes, toiletries, household', '$100–150'],
    ['Cheap clothes', 'Salvation Army Family Store', '114 E 4th St, Royal Oak', 'Secondhand basics', '$35'],
    ['Discount clothes', 'Citi Trends', '22106 Coolidge Hwy, Oak Park', 'Low-cost casual clothes/shoes', '$50'],
    ['Food delivery', "Leo's Coney Island", '110 S Main St, Royal Oak', 'Cheap-ish breakfast/sandwich fallback', '~$18'],
    ['Food delivery', 'Royal Oak Masala', '106 S Main St, Royal Oak', 'Indian / biryani / vegetarian', '~$25'],
    ['Food delivery', 'Saab Sis Thai', '515 S Lafayette Ave, Royal Oak', 'Thai takeout', '~$25'],
    ['Food delivery', "McDonald's", 'Woodward area', 'Emergency cheap order', '~$16']
  ],
  transport: [
    ['FAST Woodward (Route 461/462)', '$2.00 (Jam) / $0 (Susu w/ ID)', 'Direct corridor spine', 'FAST bus down Woodward Ave from Royal Oak to Downtown Detroit; frequent, rapid transit. Replaces $40–80 Uber.'],
    ['QLINE Streetcar', 'FREE ($0)', 'Downtown ↔ Midtown', 'Modern Woodward streetcar connecting Downtown, Campus Martius, Midtown, DIA Cultural Center, and New Center.'],
    ['SMART Student Bus', 'FREE ($0) with valid student ID', 'School commutes + fixed routes', 'Susu royal Oak High School ID qualifies for free fixed-route SMART rides ($1 without ID). Benchmark best option.'],
    ['SMART Flex', '$2–8 one way', 'Zone-dependent on-demand', 'Microtransit within local zone. Check address eligibility.'],
    ['Private ride target', '$5 one way', '$200 / 20 school days', 'Desired recurring contract price for school commute.'],
    ['Ride Fair', 'Quote pending', 'Local mileage model', '248-410-7640'],
    ['ServiCar', 'Quote pending', 'Student transport', '248-549-6840'],
    ['Ace Transportation', 'Emailed', 'Student transport', 'Oakland County candidate'],
    ['Darbak / Zoom Ride / Rides by Roy / NEX / King Metro', 'Emailed', 'Alternatives', 'Awaiting quotes'],
    ['Uber / Lyft', 'Live surge ($25–50+ one way)', 'Fallback only', 'Late-night or severe weather emergency backup only. Woodward transit is the primary corridor spine.']
  ],
  days: [
    ['Sep 14 Mon', 'Travel RBA→CDG→DTW; arrive 6:50 PM', 'Simple arrival food', 'None', 'Settle in; do nothing ambitious', 'DTW→Royal Oak', '$45'],
    ['Sep 15 Tue', 'Recover + orient; school weekday', 'Main groceries/home meals', 'Meijer main stock-up + basic clothes', 'Neighborhood/downtown walk', 'Bundle errands', '$85'],
    ['Sep 16 Wed', 'Normal family/school day', 'Home breakfast + cheap lunch', 'Target only if essentials missing', 'Cummingston/Tenhave nature walk', 'Minimal local rides', '$55'],
    ['Sep 17 Thu', 'Royal Oak day', 'Home meals + one takeout', 'None', 'Downtown Royal Oak / Centennial Commons', 'One round-trip max', '$70'],
    ['Sep 18 Fri', 'DIA + Dance City after school (open till 9 PM)', 'Home lunch + Midtown/DIA dinner', 'Top-up only', 'DIA Rivera Court 5 PM Dance City Festival; gallery explore (Zoo fallback only)', 'FAST Woodward (Susu $0 w/ student ID, Jam $2.00)', '$75'],
    ['Sep 19 Sat', 'MAIN DETROIT DAY: Full Father/Daughter loop', 'Breakfast home + Detroit lunch/treats', 'Eastern Market / Detroit souvenirs', 'Guardian Bldg → Campus Martius → Riverwalk → QLINE to Midtown → opt. Eastern Market', 'FAST Woodward ↔ Detroit + Free QLINE streetcar', '$95'],
    ['Sep 20 Sun', 'Reset / cheap local recovery day', 'Cook at home', 'Grocery top-up', 'Farmers Market / park', 'Walk/local', '$55'],
    ['Sep 21 Mon', 'School restart', 'Home meals', 'None', 'Free local activity', 'Minimal rides', '$45'],
    ['Sep 22 Tue', 'Detroit evening (Midtown/QLINE/Riverwalk fallback)', 'Flexible / casual Detroit dinner', 'Final clothing needs if any', 'Midtown & Downtown stroll / QLINE (DIA CLOSED at 4 PM - no DIA)', 'FAST Woodward + Free QLINE (Susu $0 w/ ID)', '$65'],
    ['Sep 23 Wed', 'Final full day', 'Use remaining groceries + celebratory dinner', 'Gifts only', 'Family evening / Royal Oak', 'Minimal rides', '$80'],
    ['Sep 24 Thu', 'Departure; DTW 6:40 PM', 'Home lunch + airport buffer', 'Last essentials only', 'Pack / family time', 'Leave ~3:15–3:30 PM for DTW', '$90'],
    ['Sep 25 Fri', 'CDG→Rabat (AF1258 arrives 1:10 PM)', 'Airport food', 'None', 'Travel only; arrival home', 'Arrival ground transport', '$35']
  ]
};
