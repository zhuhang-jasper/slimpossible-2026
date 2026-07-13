// English (default) translation bundle. Keys mirror the BM bundle (ms.js).
// Structure/icons/points live in src/data.js; only user-facing text lives here.
const en = {
  lang: { en: "EN", ms: "BM", switchLabel: "Language", toEn: "Switch to English", toMs: "Tukar ke Bahasa Melayu" },

  hero: {
    title: "🏋️ SlimPossible 2026",
    sub: "14-week",
    dates: "22 Jun – 27 Sep 2026",
    infoLabel: "Open challenge details",
    help: "Help",
    trackerLink: "Lark Base Tracker",
    wikiLink: "Official wiki",
  },

  table: {
    week: "Week",
    booster: "Bi-Weekly Booster",
    weekTarget: "Target pts",
    toggleWeekPlan: "Toggle week {{wk}} plan",
    dayPlanLabel: "Week {{wk}} day plan",
    boosterWiki: "Click here to see booster's wiki",
  },

  copy: { copy: "Copy", copied: "Copied!", copyLabel: "Copy hashtags", copiedLabel: "Hashtags copied" },

  pointsInfoLabel: "How points are scored — open challenge details",

  drawer: {
    title: "📖 Challenge details",
    close: "Close details",
    ariaLabel: "Challenge details",

    everyWeekTitle: "🔁 Do these EVERY week (W1–W14)",
    everyWeekMax: "cap {{max}} pt/wk",
    everyWeekScope: "— All submissions go to the Lark Base Tracker",

    bonusTitle: "🌟 Bonus actionables",
    bonusMax: "cap 40++ pt/wk",
    bonusScope: "— BOOSTERS ONLY (does NOT apply to weigh-in / steps / workouts)",

    legendTitle: "📌 How to read this",
    legend: {
      everyWeek: "<b>The 3 every-week tasks above happen every single week</b> — weigh-in (Monday), step log, and 3 workouts.",
      boosterRotates: "<b>The booster changes every 2 weeks.</b> Just check your week's row for what's special.",
      boosterPts:
        "<b>Booster pts = 30 / 40:</b> <req>30</req> = Lark Base submission (required for any points). <opt>40</opt> = Lark Base <i>+</i> post on ZUS Moments with the hashtags.",
      weekTarget:
        "<b>Week target = {{weekMax}}:</b> the realistic ceiling — 100 steps + 100 workouts + 40 booster. <b>Weigh-in is excluded</b> (you can't bank the 40-pt loss tier every week). Bi-weekly max is <b>{{biweekly}}</b>; the full-challenge ceiling is <b>{{full}}</b> — your leaderboard benchmark.",
      bookends:
        "<b>Each week has two submission bookends</b> (expand a week to see them): <b>① Open</b> — on Monday, a weigh-in form: pick that week, enter your Monday-morning weight, leave the rest blank. <b>② Report</b> — the week's activities (steps + workouts + booster + bonus), with the weight left blank.",
      dueDate:
        "<b>The report is due by the FOLLOWING Monday</b> — but you can submit earlier (e.g. each workout on the day it happens). <b>Week 1 is just the baseline weigh-in</b> to open the challenge.",
      oneWorkout:
        '<b>Each Lark Base form takes only ONE workout</b> ("Type Of Activity" is single-select), so 3 workouts means 3 forms. Steps, booster and the ZUS Moments post can ride on any of those forms, or go on their own — your choice.',
      proof:
        "<b>Every field reveals its own proof upload</b> once you fill it — weight needs a scale photo, steps a screenshot, each workout a face photo/video, the booster its proof, and the ZUS Moments post a screenshot.",
      boosterNotWorkout:
        "Even when the booster is a workout-type activity (Buddy Steps, Pace), it does <b>not</b> count as one of your 3 workouts — the booster and each workout are separate submissions.",
      outsideHours: "All activities must be done <b>outside working hours</b>. Only weight <i>losses</i> earn points (maintain/gain = 0).",
      finalReport: "<b>Final report: 28 Sep</b> — the day after W14 closes; final standings are tallied then.",
    },

    linksTitle: "🔗 Official links",
    trackerLink: "📋 Lark Base Tracker",
    trackerNote: "Submit every weigh-in, step log, workout & booster here",
    wikiLink: "📖 Official challenge wiki",
    wikiNote: "Full rules & details from the organisers",
  },

  weeklyTasks: {
    weighIn: {
      title: "Weigh-in",
      cap: "cap 40/wk",
      desc: "Every Monday. Photo/video of scale (feet + display visible). Only losses score.",
      maintainOrGain: "Maintain or gain",
      lose05: "Lose > 0.5 kg",
      lose1: "Lose > 1 kg",
    },
    steps: {
      title: "Step count",
      cap: "cap 100/wk",
      desc: "Log daily or weekly. Screenshot of any step app (Google Fit, Fitbit…).",
      s20k: "20k steps",
      s25k: "25k steps",
      s30k: "30k steps",
      s35k: "35k steps",
      s40k: "> 40k steps",
    },
    workouts: {
      title: "Workouts",
      cap: "cap 100/wk",
      desc: "On separate days. Photo/video showing your face.",
      w1: "1 workout",
      w2: "2 workouts",
      w3: "3+ workouts",
    },
  },

  bonusTasks: {
    joinBooster: {
      title: "Join booster (Lark Base)",
      badge: "30 pts",
      desc: "Complete the week's booster and upload your proof to the Lark Base Tracker. Required — earns the base 30 pts.",
    },
    postMoments: {
      title: "Post on ZUS Moments",
      badge: "+10 pts",
      desc: "On a booster, also posting to ZUS Moments with the hashtags lifts that booster from 30 → 40 pts.",
    },
    showMerch: {
      title: "Show your ZUS merch",
      badge: "in clip",
      desc: "In Pace / Hydration booster clips, feature your ZUS tumbler, cup, canned drink, or merch to strengthen the submission.",
    },
  },

  boosters: {
    buddy: "Buddy Steps",
    snapfuel: "ZUS SnapFuel",
    pace1: "ZUS Pace Challenge",
    hydration: "Hydration Hustle",
    pace2: "Pace Challenge: Level Up",
    zen: "ZUS Zen Time",
    mind: "ZUS Mind Break Mission",
    buddyW1: "Walk/jog with a buddy (incl. family/pets). Photo or video during the activity.",
    buddyW2: "Walk/jog with a buddy (incl. family/pets). Photo or video during the activity. Max 2 submissions across W1+W2.",
    snapfuelW3: "Cook a healthy homemade meal/smoothie. Upload a short time-lapse video.",
    snapfuelW4: "Cook a healthy homemade meal/smoothie. Upload a short time-lapse video. Only meals cooked during the challenge weeks count.",
    pace1Desc: "Complete 2km within 20 min. Show distance + time.",
    hydrationDesc: "Drink ≥2L water daily. Film a 15–30s clip: take a sip + share 1 health fact.",
    pace2Desc: "Complete 2km within 15 min. Show distance + time.",
    zenW11: "Join a yoga/Zumba/meditation/wellness class (online or in person). 15–30s time-lapse.",
    zenW12: "Join a yoga/Zumba/meditation/wellness class (online or in person). 15–30s time-lapse. No duplicate submissions of the same session.",
    mindW13: "Attend a ZUS Mental Health Talk / Wellness session. Log a reflection or photo.",
    mindW14: "Attend a ZUS Mental Health Talk / Wellness session. Log a reflection or photo. Submission required after attending.",
  },

  boosterMeta: {
    buddy: { proof: "photo/video during the walk/jog" },
    snapfuel: { proof: "time-lapse cooking video" },
    pace1: { proof: "screenshot: 2km distance + time" },
    hydration: { proof: "15–30s clip: sip + 1 health fact" },
    pace2: { proof: "screenshot: 2km distance + time" },
    zen: { proof: "15–30s timelapse of the session" },
    mind: { proof: "reflection or photo at the talk" },
  },

  extras: {
    tagColleague: "tag a colleague",
    catchyTitle: "add a catchy title",
    showMerch: "show ZUS merch/tumbler",
    funCaption: "add a fun caption",
  },

  plan: {
    start: {
      heading: "① Start the week — Monday",
      weighIn: "Weigh-in (leave rest blank)",
      weighInBaseline: "Initial weigh-in (baseline)",
      weighInCue: "own form · pick this week · weight + scale photo (feet + number)",
    },
    report: {
      heading: "② Submit report — Sunday (leave weight blank)",
      steps: "40k+ Walking step count",
      stepsCue: "this week's total steps · screenshot from any step app",
      stepsW4Bonus: "Every extra 20k steps (W4 only)",
      stepsW4BonusCue: "on top of the 40k tier · step screenshot",
      booster: "Booster: {{name}}",
      bonusBadge: "BONUS",
      postMoments: "Post on ZUS Moments",
      postMomentsCue: "with the hashtags below · screenshot it as proof",
      tip: "tip: {{tip}}",
      dueNote: "🗓️ Due by the <b>following Monday</b>",
      dueNoteWeek: " (before you do your <b>{{wk}}</b> weigh-in)",
      dueNoteTail: ", or submit earlier on the same day of each activity.",
    },
    form3: {
      workout1: "Workout 1",
      workout1Cue: "separate day · face photo/video · leave the rest blank",
    },
    form4: {
      workout2: "Workout 2",
      workout2Cue: "separate day · face photo/video · leave the rest blank",
    },
    form5: {
      workout3: "Workout 3",
      workout3Cue: "separate day · face photo/video · capped at 3+ workouts · leave the rest blank",
    },
  },

  install: {
    bannerLabel: "Install this app",
    title: "Add to your home screen",
    text: "Add <b>SlimPossible 2026</b> to your home screen for one-tap access. It’s just this web page — nothing to download.",
    iosHintPre: "It’s just this page — nothing to download. Tap",
    iosHintMid: "then",
    iosHintAdd: "Add to Home Screen",
    shareLabel: "the Share button",
    install: "Install",
    dismiss: "Dismiss install prompt",
    cardTitle: "📲 Install this app",
    cardText: "Add <b>SlimPossible 2026</b> to your home screen for one-tap, full-screen access. It’s just this web page — nothing to download.",
  },

  footer: { rights: "© 2026 Jasper Loo Zhu Hang · All rights reserved ·" },
};

export default en;
