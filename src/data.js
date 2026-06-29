// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to change the timetable. Everything below feeds
// the page. Running totals are computed automatically from WEEK_MAX.
// ─────────────────────────────────────────────────────────────

// Points you can earn EVERY week (W1–W14)
export const WEEKLY_TASKS = [
  {
    icon: "⚖️",
    title: "Weigh-in",
    cap: "cap 40/wk",
    desc: "Every Monday. Photo/video of scale (feet + display visible). Only losses score.",
    rows: [
      ["Maintain or gain", 0],
      ["Lose > 0.5 kg", 10],
      ["Lose > 1 kg", 40],
    ],
  },
  {
    icon: "👣",
    title: "Step count",
    cap: "cap 100/wk",
    desc: "Log once weekly. Screenshot of any step app (Google Fit, Fitbit…).",
    rows: [
      ["20k steps", 20],
      ["25k steps", 25],
      ["30k steps", 30],
      ["35k steps", 35],
      ["> 40k steps", 100],
    ],
  },
  {
    icon: "🏃",
    title: "Workouts",
    cap: "cap 100/wk",
    desc: "On separate days. Photo/video showing your face.",
    rows: [
      ["1 workout", 30],
      ["2 workouts", 60],
      ["3+ workouts", 100],
    ],
  },
];

// Bonus actionables — BOOSTERS ONLY
export const BONUS_TASKS = [
  {
    icon: "📲",
    title: "Join booster (Lark Base)",
    badge: "30 pts",
    desc: "Complete the week's booster and upload your proof to the Lark Base Tracker. Required — earns the base 30 pts.",
  },
  {
    icon: "📣",
    title: "Post on ZUS Moments",
    badge: "+10 pts",
    desc: "On a booster, also posting to ZUS Moments with the hashtags lifts that booster from 30 → 40 pts.",
  },
  {
    icon: "🥤",
    title: "Show your ZUS merch",
    badge: "in clip",
    desc: "In Pace / Hydration booster clips, feature your ZUS tumbler, cup, canned drink, or merch to strengthen the submission.",
  },
];

// Challenge start (W1 Monday). Weeks are exactly 7 days; the current-week
// highlight is computed from this date, so the display strings below stay free-text.
export const CHALLENGE_START = new Date(2026, 5, 22); // 22 Jun 2026 (month is 0-based)

// Realistic max points per week, used as the leaderboard benchmark.
// Weigh-in is excluded — hitting the >1 kg (40 pt) tier every single week
// isn't achievable, so it's left out of the ceiling.
//   100 steps + 100 workouts + 40 booster (Lark + ZUS Moments) = 240/week
export const BOOSTER_MAX = 40; // booster portion (Lark + ZUS Moments)
export const WEEK_MAX = 240; // = 200 baseline (100 steps + 100 workouts) + 40 booster
export const BIWEEKLY_MAX = WEEK_MAX * 2; // 480 over each 2-week booster phase

// Per-phase booster meta for the day-plan strip.
//   isWorkout: the booster itself counts as one of the 3 weekly workouts
//              (so it fills a workout slot instead of needing its own day).
//   proof: the actionable / evidence to capture for that booster.
//   wikiUrl: deep link to this booster's section in the official Lark wiki.
const WIKI_BASE = "https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb";
export const BOOSTER_META = {
  buddy: {
    isWorkout: true,
    proof: "photo/video during the walk/jog",
    wikiUrl: `${WIKI_BASE}#CX0zd3agVowO5Rx8aFQlGLXbgHc`,
  },
  snapfuel: {
    isWorkout: false,
    proof: "time-lapse cooking video",
    wikiUrl: `${WIKI_BASE}#QUngdKhz7oihbCxIRLtlazlUgWb`,
  },
  pace1: {
    isWorkout: true,
    proof: "screenshot: 2km distance + time",
    wikiUrl: `${WIKI_BASE}#ZfdQdbrUQoRcRxxKiIBlx8KFgnc`,
  },
  hydration: {
    isWorkout: false,
    proof: "15–30s clip: sip + 1 health fact",
    wikiUrl: `${WIKI_BASE}#LgCsdWFgroUG5exYu4Xl05vdggf`,
  },
  pace2: {
    isWorkout: true,
    proof: "screenshot: 2km distance + time",
    wikiUrl: `${WIKI_BASE}#HEiSdJjuPotWZDxrWuxlkZAKgjg`,
  },
  zen: {
    isWorkout: true,
    proof: "15–30s timelapse of the session",
    wikiUrl: `${WIKI_BASE}#XkzrdeMzsoyryOxiXcJlja67gBf`,
  },
  mind: {
    isWorkout: false,
    proof: "reflection or photo at the talk",
    wikiUrl: `${WIKI_BASE}#I6FUdjwEOoVWY0xxTnllBhfIgIb`,
  },
};

// Build this week's checklist, split into the two submission bookends:
//
//  • START — on Monday, open the week with a weigh-in form: pick THIS week, enter your
//    Monday-morning weight, leave the rest blank. (W1 is just the baseline weight.)
//
//  • REPORT — fill the week's activities (steps + workouts + booster + bonus) on a form
//    where you pick THIS week and leave the weight blank. Due by the following Monday,
//    but you can submit earlier (each workout on its day, etc.) — the user's choice.
//
// Note: each Lark Base form takes only ONE workout ("Type Of Activity" is single-select),
// so the 3 workouts need 3 separate forms. And even when the booster is a workout-type
// activity (Buddy Steps, Pace), it does NOT count as one of the 3 workouts.
//
// Returns [{ group, heading, items: [{ kind, label, cue, pts, note, tags }] }];
// kind drives each card's colour.
export function buildDayPlan(booster) {
  const m = BOOSTER_META[booster.phase] || {};
  const isFirstWeek = booster.wk === "W1";

  return [
    {
      group: "start",
      heading: "① Open the week — Monday weigh-in (leave the rest blank)",
      items: [
        {
          kind: "report",
          label: isFirstWeek ? "Initial weigh-in (baseline)" : "Weigh-in",
          cue: "own form · pick this week · weight + scale photo (feet + number)",
          pts: isFirstWeek ? "baseline" : "+0 / 10 / 40",
        },
      ],
    },
    {
      group: "report",
      heading: "② Report the week — by next Monday (leave weight blank)",
      items: [
        {
          kind: "steps",
          label: "40k+ Walking step count",
          cue: "this week's total steps · screenshot from any step app",
          pts: "+100",
        },
        {
          kind: "workout",
          label: "3 Workout days",
          cue: "separate day · face photo/video · capped at 3+ workouts",
          pts: "+100",
        },
        {
          kind: "booster",
          label: `Booster: ${booster.name}`,
          cue: m.proof,
          pts: "+30",
        },
        {
          kind: "booster",
          label: "BONUS: Post on ZUS Moments",
          cue: "with the hashtags below · screenshot it as proof",
          pts: "+10",
          note: booster.extra ? `tip: ${booster.extra.toLowerCase()}` : undefined,
          tags: booster.tags,
        },
      ],
    },
  ];
}

// Bi-weekly booster rotation. phase = colour-band grouping.
export const BOOSTERS = [
  {
    wk: "W1",
    dates: "22–28 Jun",
    phase: "buddy",
    icon: "👣",
    name: "Buddy Steps",
    desc: "Walk/jog with a buddy (incl. family/pets). Photo or video during the activity.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Tag a colleague",
    tags: "#ZUSBuddySteps #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W2",
    dates: "29 Jun–5 Jul",
    phase: "buddy",
    icon: "👣",
    name: "Buddy Steps",
    desc: "Walk/jog with a buddy (incl. family/pets). Photo or video during the activity. Max 2 submissions across W1+W2.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Tag a colleague",
    tags: "#ZUSBuddySteps #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W3",
    dates: "6–12 Jul",
    phase: "snapfuel",
    icon: "🥗",
    name: "ZUS SnapFuel",
    desc: "Cook a healthy homemade meal/smoothie. Upload a short time-lapse video.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Add a catchy title",
    tags: "#ZUSSnapFuel #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W4",
    dates: "13–19 Jul",
    phase: "snapfuel",
    icon: "🥗",
    name: "ZUS SnapFuel",
    desc: "Cook a healthy homemade meal/smoothie. Upload a short time-lapse video. Only meals cooked during the challenge weeks count.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Add a catchy title",
    tags: "#ZUSSnapFuel #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W5",
    dates: "20–26 Jul",
    phase: "pace1",
    icon: "🏃",
    name: "ZUS Pace Challenge",
    desc: "Complete 2km within 20 min. Show distance + time.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSPaceChallenge #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W6",
    dates: "27 Jul–2 Aug",
    phase: "pace1",
    icon: "🏃",
    name: "ZUS Pace Challenge",
    desc: "Complete 2km within 20 min. Show distance + time.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSPaceChallenge #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W7",
    dates: "3–9 Aug",
    phase: "hydration",
    icon: "💧",
    name: "Hydration Hustle",
    desc: "Drink ≥2L water daily. Film a 15–30s clip: take a sip + share 1 health fact.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSHydrationHustle #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W8",
    dates: "10–16 Aug",
    phase: "hydration",
    icon: "💧",
    name: "Hydration Hustle",
    desc: "Drink ≥2L water daily. Film a 15–30s clip: take a sip + share 1 health fact.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSHydrationHustle #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W9",
    dates: "17–23 Aug",
    phase: "pace2",
    icon: "⚡",
    name: "Pace Challenge: Level Up",
    desc: "Complete 2km within 15 min. Show distance + time.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSPaceUp #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W10",
    dates: "24–30 Aug",
    phase: "pace2",
    icon: "⚡",
    name: "Pace Challenge: Level Up",
    desc: "Complete 2km within 15 min. Show distance + time.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Show ZUS merch/tumbler",
    tags: "#ZUSPaceUp #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W11",
    dates: "31 Aug–6 Sep",
    phase: "zen",
    icon: "🧘",
    name: "ZUS Zen Time",
    desc: "Join a yoga/Zumba/meditation/wellness class (online or in person). 15–30s time-lapse.",
    bonus: "Post on ZUS Moments: +10 pts",
    tags: "#ZUSZenTime #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W12",
    dates: "7–13 Sep",
    phase: "zen",
    icon: "🧘",
    name: "ZUS Zen Time",
    desc: "Join a yoga/Zumba/meditation/wellness class (online or in person). 15–30s time-lapse. No duplicate submissions of the same session.",
    bonus: "Post on ZUS Moments: +10 pts",
    tags: "#ZUSZenTime #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W13",
    dates: "14–20 Sep",
    phase: "mind",
    icon: "🧠",
    name: "ZUS Mind Break Mission",
    desc: "Attend a ZUS Mental Health Talk / Wellness session. Log a reflection or photo.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Add a fun caption",
    tags: "#ZUSMindBreakMission #ChampionsFuelChampions",
    pts: "30 / 40",
  },
  {
    wk: "W14",
    dates: "21–27 Sep",
    phase: "mind",
    icon: "🧠",
    name: "ZUS Mind Break Mission",
    desc: "Attend a ZUS Mental Health Talk / Wellness session. Log a reflection or photo. Submission required after attending.",
    bonus: "Post on ZUS Moments: +10 pts",
    extra: "Add a fun caption",
    tags: "#ZUSMindBreakMission #ChampionsFuelChampions",
    pts: "30 / 40",
  },
];
