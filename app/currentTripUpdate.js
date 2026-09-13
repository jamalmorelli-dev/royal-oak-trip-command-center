import { trip } from './data';

// Sep 13 authoritative airport/check-in overlay.
// Kept as a small mutation layer so the mature Sep 11 app architecture and local plans stay intact.
trip.traveler = 'Benjamin Swayne Prentiss';
trip.flights = [
  ['Sep 14','DL 8491','Air France','Rabat RBA','10:35 AM','Paris CDG','2:40 PM','CHECKED IN • Seat 22D • Boarding 10:05'],
  ['Sep 14','DL 8719','Air France','Paris CDG','4:05 PM','Detroit DTW','6:50 PM','CHECKED IN • Seat 38H • Boarding 15:10'],
  ['Sep 24','DL 228','Delta','Detroit DTW','6:40 PM','Paris CDG','8:40 AM Sep 25','Delta Main L'],
  ['Sep 25','DL 8271 / AF1258','Air France','Paris CDG','VERIFY IN MY BOOKINGS','Rabat RBA','VERIFY IN MY BOOKINGS','SCHEDULE CHANGED — original receipt time is stale']
];
trip.baggage = 'Original Delta receipt: carry-on FREE + first checked bag FREE up to 23 kg / 50 lb + second checked bag FREE up to 23 kg / 50 lb, both directions.';

trip.airportDocs = [
  { id:'checkin', title:'Air France check-in confirmation', kind:'PRIVATE', privateKey:'checkin', filename:'AirFrance_CheckIn_Confirmation.pdf', description:'Official successful check-in confirmation for both outbound segments. It is NOT the boarding pass.' },
  { id:'passport', title:'U.S. passport copy', kind:'PRIVATE', privateKey:'passport', filename:'Benjamin_Prentiss_Passport.jpeg', description:'Backup identity-page image. The original passport is mandatory and stays on your person.' },
  { id:'tempdl', title:'PennDOT temporary license / camera card', kind:'PRIVATE', privateKey:'tempdl', filename:'PennDOT_Temporary_License_Camera_Card.pdf', description:'Driving/rental backup. Temporary paper is valid only through Sep 17.' },
  { id:'dlfront', title:'Prior PA photo credential — front', kind:'PRIVATE', privateKey:'dlfront', filename:'PA_Driver_License_Front.jpeg', description:'Photo/record-matching backup for rental review.' },
  { id:'dlback', title:'Prior PA photo credential — back', kind:'PRIVATE', privateKey:'dlback', filename:'PA_Driver_License_Back.jpeg', description:'Back image of prior PA credential.' },
  { id:'penndotverify', title:'PennDOT record verification', kind:'PRIVATE', privateKey:'penndotverify', filename:'PennDOT_Record_Verification.txt', description:'PennDOT correspondence summary: underlying PA license record is current through Jan 12, 2028.' },
  { id:'penndotreceipt', title:'PennDOT duplicate receipt', kind:'PRIVATE', privateKey:'penndotreceipt', filename:'PennDOT_Duplicate_Receipt.pdf', description:'Duplicate credential transaction receipt.' },
  { id:'employment', title:'Talk Today employment verification', kind:'PRIVATE', privateKey:'employment', filename:'Talk_Today_Employment_Verification_Benjamin_Prentiss.pdf', description:'Morocco employment support document for PennDOT/rental review.' },
  { id:'tripref', title:'Private trip/contact reference', kind:'PRIVATE', privateKey:'tripref', filename:'Travel_Vault_Metadata.json', description:'Booking references, ticket references and exact Detroit arrival contact details.' },
  { id:'printing', title:'What must be printed?', kind:'REFERENCE', href:'/travel-docs/PRINTING_RULES.txt', filename:'PRINTING_RULES.txt', description:'Flight printing rule plus separate PennDOT-paper reminder.' }
];

trip.airportQuick = [
  ['Check-in','COMPLETE','Air France confirms successful check-in for both outbound segments.'],
  ['Boarding pass','GET AT RBA','Air France could not issue it online. Go to the Air France counter.'],
  ['Original passport','MANDATORY','Physical U.S. passport on your person. A phone image is backup only.'],
  ['Outbound seats','22D / 38H','DL8491 seat 22D; DL8719 seat 38H.'],
  ['Bags','2 × 23 kg FREE','Original Delta receipt shows first and second checked bags free; verify bag tags show DTW.'],
  ['Self-print flight docs','NOT REQUIRED','Optional backup print only. Air France supplies the required boarding pass at RBA.']
];

trip.plane = {
  checkInStatus:'CHECKED IN',
  checkInCompleted:'Air France successful check-in confirmation received Sep 13',
  departureTarget:'Leave Marina Rabat Suites / Salé about 6:30–6:45 AM; target RBA around 7:00–7:15 AM.',
  airportRule:'Online check-in succeeded, but Air France could not issue the boarding pass online. Collect it from an Air France agent at RBA.',
  primaryFlight:'DL 8491 / Air France — RBA 10:35 AM → CDG 2:40 PM — seat 22D — boarding 10:05',
  connection:'DL 8719 / Air France — CDG 4:05 PM → DTW 6:50 PM — seat 38H — boarding 15:10',
  checkin:[
    ['Physical U.S. passport','CRITICAL','Carry the original on your person; never put it in checked baggage.'],
    ['Air France check-in','DONE','Both outbound segments are checked in.'],
    ['Boarding pass','RBA DESK','Air France must issue it at the airport counter.'],
    ['Airport Docs vault','READY','Unlock the vault and save all required backups offline on your phone.'],
    ['Checked-bag routing','ASK AT RBA','Verify every checked-bag tag shows final destination DTW, not CDG.'],
    ['Bag weight','READY','Two free checked bags, each up to 23 kg / 50 lb, per original Delta receipt.'],
    ['Carry-on essentials','CRITICAL','Passport, medication, wallet/cards/cash, phone, charger/power bank and essential documents stay in carry-on.'],
    ['Return leg','REVERIFY LATER','AF1258 schedule changed; do not rely on the old return time.']
  ],
  nightBefore:[
    'Original passport physically in travel wallet',
    'Phone fully charged + power bank charged',
    'Wallet/cards/cash ready',
    'Airport Docs tab opens successfully',
    'Unlock Private Travel Vault and tap “Save ALL docs offline”',
    'PennDOT temporary credential printed/signed if you want the rental-driving backup',
    'Checked bags weighed — stay below 23 kg each',
    'Carry-on essentials separated from checked luggage',
    'Hotel → RBA ride confirmed for about 6:30–6:45 AM',
    'Two alarms set'
  ],
  rbaSequence:[
    ['~7:00–7:15 AM','Arrive RBA with a large buffer.'],
    ['Immediately','Go to Air France desk with original passport; say online check-in is complete but boarding pass must be issued at airport.'],
    ['Boarding passes','Verify you receive what you need for RBA→CDG and CDG→DTW.'],
    ['Bag drop','Confirm checked-bag tags show final destination DTW.'],
    ['Security / exit control','Proceed immediately after counter formalities.'],
    ['Gate','Re-check gate and boarding time on airport screens / airline app.'],
    ['10:05 AM','Scheduled boarding shown on Air France confirmation.'],
    ['10:35 AM','DL8491 scheduled departure.']
  ]
};
