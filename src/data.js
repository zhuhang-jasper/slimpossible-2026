// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to change the timetable STRUCTURE (icons, points,
// dates, rotation order, wiki links). All user-facing TEXT lives in
// the i18n bundles (src/i18n/locales/{en,ms}.js) and is looked up by
// the stable keys below. Running totals are computed from WEEK_MAX.
// ─────────────────────────────────────────────────────────────

// Points you can earn EVERY week (W1–W14). `key` indexes into the
// `weeklyTasks.<key>` translation bundle for title/cap/desc; `rows`
// pair a label key with its point value.
export const WEEKLY_TASKS = [
  {
    key: "weighIn",
    icon: "⚖️",
    rows: [
      ["maintainOrGain", 0],
      ["lose05", 10],
      ["lose1", 40],
    ],
  },
  {
    key: "steps",
    icon: "👣",
    rows: [
      ["s20k", 20],
      ["s25k", 25],
      ["s30k", 30],
      ["s35k", 35],
      ["s40k", 100],
    ],
  },
  {
    key: "workouts",
    icon: "🏃",
    rows: [
      ["w1", 30],
      ["w2", 60],
      ["w3", 100],
    ],
  },
];

// Bonus actionables — BOOSTERS ONLY. `key` indexes into `bonusTasks.<key>`.
export const BONUS_TASKS = [
  { key: "joinBooster", icon: "📲" },
  { key: "postMoments", icon: "📣" },
  { key: "showMerch", icon: "🥤" },
];

// Challenge start (W1 Monday). Weeks are exactly 7 days; the current-week
// highlight is computed from this date, so the display strings stay free-text.
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
//   proofKey:  i18n key (boosterMeta.<phase>.proof) for the evidence to capture.
//   wikiUrl:   deep link to this booster's section in the official Lark wiki.
const WIKI_BASE = "https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb";
export const BOOSTER_META = {
  buddy: { isWorkout: true, wikiUrl: `${WIKI_BASE}#CX0zd3agVowO5Rx8aFQlGLXbgHc` },
  snapfuel: { isWorkout: false, wikiUrl: `${WIKI_BASE}#QUngdKhz7oihbCxIRLtlazlUgWb` },
  pace1: { isWorkout: true, wikiUrl: `${WIKI_BASE}#ZfdQdbrUQoRcRxxKiIBlx8KFgnc` },
  hydration: { isWorkout: false, wikiUrl: `${WIKI_BASE}#LgCsdWFgroUG5exYu4Xl05vdggf` },
  pace2: { isWorkout: true, wikiUrl: `${WIKI_BASE}#HEiSdJjuPotWZDxrWuxlkZAKgjg` },
  zen: { isWorkout: true, wikiUrl: `${WIKI_BASE}#XkzrdeMzsoyryOxiXcJlja67gBf` },
  mind: { isWorkout: false, wikiUrl: `${WIKI_BASE}#I6FUdjwEOoVWY0xxTnllBhfIgIb` },
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
// Returns [{ group, headingKey, form, items: [{ kind, labelKey, cueKey, pts, badgeKey,
// noteKey, noteVars, tags }] }]; kind drives each card's colour. Text is resolved by the
// caller via i18n using the *Key fields, so this stays language-neutral.
export function buildDayPlan(booster) {
  const isFirstWeek = booster.wk === "W1";

  return [
    {
      group: "start",
      headingKey: "plan.start.heading",
      form: "FORM 1",
      items: [
        {
          kind: "report",
          labelKey: isFirstWeek ? "plan.start.weighInBaseline" : "plan.start.weighIn",
          cueKey: "plan.start.weighInCue",
          pts: isFirstWeek ? "baseline" : "+0 / 10 / 40",
        },
      ],
    },
    // The report splits across THREE Lark forms — "Type Of Activity" is single-select,
    // so each workout needs its own form. Form 2 carries everything else (steps + workout 1
    // + booster + bonus); Forms 3 & 4 each hold a single workout with the rest left blank.
    {
      group: "report",
      headingKey: "plan.report.heading",
      form: "FORM 2",
      items: [
        {
          kind: "steps",
          labelKey: "plan.report.steps",
          cueKey: "plan.report.stepsCue",
          pts: "+100",
        },
        {
          kind: "workout",
          labelKey: "plan.report.workout1",
          cueKey: "plan.report.workout1Cue",
          pts: "+30",
        },
        {
          kind: "booster",
          labelKey: "plan.report.booster",
          labelVars: { name: booster.name },
          cueKey: `boosterMeta.${booster.phase}.proof`,
          pts: "+30",
        },
        {
          kind: "booster",
          badgeKey: "plan.report.bonusBadge",
          labelKey: "plan.report.postMoments",
          cueKey: "plan.report.postMomentsCue",
          pts: "+10",
          // The caller resolves extras.<extraKey> → text and wraps it in plan.report.tip.
          extraKey: booster.extraKey,
          tags: booster.tags,
        },
      ],
    },
    {
      group: "form3",
      form: "FORM 3",
      items: [
        {
          kind: "workout",
          labelKey: "plan.form3.workout2",
          cueKey: "plan.form3.workout2Cue",
          pts: "+30",
        },
      ],
    },
    {
      group: "form4",
      form: "FORM 4",
      items: [
        {
          kind: "workout",
          labelKey: "plan.form4.workout3",
          cueKey: "plan.form4.workout3Cue",
          pts: "+40",
        },
      ],
    },
  ];
}

// Bi-weekly booster rotation. phase = colour-band grouping + i18n meta key.
// `nameKey`/`descKey` index into the `boosters.<key>` bundle; `extraKey` (when present)
// indexes into `extras.<key>` for the ZUS-Moments tip. `tags` are brand hashtags (not
// translated). `dates` stay free-text here — short, locale-neutral date ranges.
export const BOOSTERS = [
  {
    wk: "W1",
    dates: "22–28 Jun",
    phase: "buddy",
    icon: "👣",
    nameKey: "buddy",
    descKey: "buddyW1",
    extraKey: "tagColleague",
    tags: "#ZUSBuddySteps #ChampionsFuelChampions",
  },
  {
    wk: "W2",
    dates: "29 Jun–5 Jul",
    phase: "buddy",
    icon: "👣",
    nameKey: "buddy",
    descKey: "buddyW2",
    extraKey: "tagColleague",
    tags: "#ZUSBuddySteps #ChampionsFuelChampions",
  },
  {
    wk: "W3",
    dates: "6–12 Jul",
    phase: "snapfuel",
    icon: "🥗",
    nameKey: "snapfuel",
    descKey: "snapfuelW3",
    extraKey: "catchyTitle",
    tags: "#ZUSSnapFuel #ChampionsFuelChampions",
  },
  {
    wk: "W4",
    dates: "13–19 Jul",
    phase: "snapfuel",
    icon: "🥗",
    nameKey: "snapfuel",
    descKey: "snapfuelW4",
    extraKey: "catchyTitle",
    tags: "#ZUSSnapFuel #ChampionsFuelChampions",
  },
  {
    wk: "W5",
    dates: "20–26 Jul",
    phase: "pace1",
    icon: "🏃",
    nameKey: "pace1",
    descKey: "pace1Desc",
    extraKey: "showMerch",
    tags: "#ZUSPaceChallenge #ChampionsFuelChampions",
  },
  {
    wk: "W6",
    dates: "27 Jul–2 Aug",
    phase: "pace1",
    icon: "🏃",
    nameKey: "pace1",
    descKey: "pace1Desc",
    extraKey: "showMerch",
    tags: "#ZUSPaceChallenge #ChampionsFuelChampions",
  },
  {
    wk: "W7",
    dates: "3–9 Aug",
    phase: "hydration",
    icon: "💧",
    nameKey: "hydration",
    descKey: "hydrationDesc",
    extraKey: "showMerch",
    tags: "#ZUSHydrationHustle #ChampionsFuelChampions",
  },
  {
    wk: "W8",
    dates: "10–16 Aug",
    phase: "hydration",
    icon: "💧",
    nameKey: "hydration",
    descKey: "hydrationDesc",
    extraKey: "showMerch",
    tags: "#ZUSHydrationHustle #ChampionsFuelChampions",
  },
  {
    wk: "W9",
    dates: "17–23 Aug",
    phase: "pace2",
    icon: "⚡",
    nameKey: "pace2",
    descKey: "pace2Desc",
    extraKey: "showMerch",
    tags: "#ZUSPaceUp #ChampionsFuelChampions",
  },
  {
    wk: "W10",
    dates: "24–30 Aug",
    phase: "pace2",
    icon: "⚡",
    nameKey: "pace2",
    descKey: "pace2Desc",
    extraKey: "showMerch",
    tags: "#ZUSPaceUp #ChampionsFuelChampions",
  },
  { wk: "W11", dates: "31 Aug–6 Sep", phase: "zen", icon: "🧘", nameKey: "zen", descKey: "zenW11", tags: "#ZUSZenTime #ChampionsFuelChampions" },
  { wk: "W12", dates: "7–13 Sep", phase: "zen", icon: "🧘", nameKey: "zen", descKey: "zenW12", tags: "#ZUSZenTime #ChampionsFuelChampions" },
  {
    wk: "W13",
    dates: "14–20 Sep",
    phase: "mind",
    icon: "🧠",
    nameKey: "mind",
    descKey: "mindW13",
    extraKey: "funCaption",
    tags: "#ZUSMindBreakMission #ChampionsFuelChampions",
  },
  {
    wk: "W14",
    dates: "21–27 Sep",
    phase: "mind",
    icon: "🧠",
    nameKey: "mind",
    descKey: "mindW14",
    extraKey: "funCaption",
    tags: "#ZUSMindBreakMission #ChampionsFuelChampions",
  },
];
