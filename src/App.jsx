import { Fragment, useEffect, useRef, useState } from "react";

import { BookOpen, Check, ClipboardList, Copy, ExternalLink, Info } from "lucide-react";

import { track } from "./utils/analytics.js";
import { BIWEEKLY_MAX, BONUS_TASKS, BOOSTER_META, BOOSTERS, buildDayPlan, CHALLENGE_START, WEEK_MAX, WEEKLY_TASKS } from "./data.js";

// Challenge reference (every-week tasks, bonus actionables, how-to-read) lives in a
// right-side drawer so the booster table is the first thing in the main scroll flow.
function DetailsDrawer({ open, target = "top", onClose }) {
  const fmt = (n) => n.toLocaleString("en-US");
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const bonusRef = useRef(null);

  // Lock body scroll, close on Esc, and move focus into the drawer while it's open.
  useEffect(() => {
    if (!open) {
      return;
    }
    // Land on the requested section: the bonus block for booster/bonus cards,
    // otherwise the top. Defer to the next frame so the panel has finished opening
    // (and laid out) before we measure/scroll.
    requestAnimationFrame(() => {
      if (!bodyRef.current) {
        return;
      }
      if (target === "bonus" && bonusRef.current) {
        // Offset the section's viewport position into the scroller's own coordinate
        // space — robust regardless of which ancestor is the section's offsetParent.
        const bodyRect = bodyRef.current.getBoundingClientRect();
        const sectionRect = bonusRef.current.getBoundingClientRect();
        bodyRef.current.scrollTop += sectionRect.top - bodyRect.top;
      } else {
        bodyRef.current.scrollTop = 0;
      }
    });
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, target, onClose]);

  return (
    <div className={`drawer-root${open ? " open" : ""}`} aria-hidden={!open}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="drawer-backdrop" onClick={onClose} />
      {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Challenge details" aria-hidden={!open}>
        <div className="drawer-head">
          <h2 className="drawer-title">📖 Challenge details</h2>
          <button ref={closeRef} type="button" className="drawer-close" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </div>
        <div className="drawer-body" ref={bodyRef}>
          {/* Every-week tasks */}
          <section className="recurring">
            <h2>
              🔁 Do these EVERY week (W1–W14) <span className="maxbadge">upto {WEEK_MAX} pt/wk</span>
            </h2>
            <p className="scope everyweek-scope">— All submissions go to the Lark Base Tracker</p>
            <div className="pill-row">
              {WEEKLY_TASKS.map((t) => (
                <div className="pill" key={t.title}>
                  <div className="t">
                    <span>
                      {t.icon} {t.title}
                    </span>
                    <span className="cap">{t.cap}</span>
                  </div>
                  <div className="d">{t.desc}</div>
                  <table className="ptab">
                    <tbody>
                      {(() => {
                        const maxVal = Math.max(...t.rows.map(([, v]) => v));
                        return t.rows.map(([label, val]) => (
                          <tr key={label} className={val === maxVal ? "target" : ""}>
                            <td>{label}</td>
                            <td>{val}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          {/* Bonus actionables — boosters only */}
          <section className="recurring bonus" ref={bonusRef}>
            <h2>
              <span className="h2-title">🌟 Bonus actionables</span>
              <span className="maxbadge bonus-max">upto 40++ pt/wk</span>
            </h2>
            <p className="scope">— BOOSTERS ONLY (does NOT apply to weigh-in / steps / workouts)</p>
            <div className="pill-row">
              {BONUS_TASKS.map((t) => (
                <div className="pill" key={t.title}>
                  <div className="t">
                    <span>
                      {t.icon} {t.title}
                    </span>
                    <span className="cap bonus-cap">{t.badge}</span>
                  </div>
                  <div className="d">{t.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="legend">
            <h2>📌 How to read this</h2>
            <ul>
              <li>
                <b>The 3 every-week tasks above happen every single week</b> — weigh-in (Monday), step log, and 3 workouts.
              </li>
              <li>
                <b>The booster changes every 2 weeks.</b> Just check your week's row for what's special.
              </li>
              <li>
                <b>Booster pts = 30 / 40:</b> <span className="req">30</span> = Lark Base submission (required for any points).{" "}
                <span className="opt">40</span> = Lark Base <i>+</i> post on ZUS Moments with the hashtags.
              </li>
              <li>
                <b>Week target = {WEEK_MAX}:</b> the realistic ceiling — 100 steps + 100 workouts + 40 booster. <b>Weigh-in is excluded</b> (you can't
                bank the 40-pt loss tier every week). Bi-weekly max is <b>{fmt(BIWEEKLY_MAX)}</b>; the full-challenge ceiling is{" "}
                <b>{fmt(WEEK_MAX * BOOSTERS.length)}</b> — your leaderboard benchmark.
              </li>
              <li>
                <b>Each week has two submission bookends</b> (expand a week to see them): <b>① Open</b> — on Monday, a weigh-in form: pick that week,
                enter your Monday-morning weight, leave the rest blank. <b>② Report</b> — the week's activities (steps + workouts + booster + bonus),
                with the weight left blank.
              </li>
              <li>
                <b>The report is due by the FOLLOWING Monday</b> — but you can submit earlier (e.g. each workout on the day it happens).{" "}
                <b>Week 1 is just the baseline weigh-in</b> to open the challenge.
              </li>
              <li>
                <b>Each Lark Base form takes only ONE workout</b> ("Type Of Activity" is single-select), so 3 workouts means 3 forms. Steps, booster
                and the ZUS Moments post can ride on any of those forms, or go on their own — your choice.
              </li>
              <li>
                <b>Every field reveals its own proof upload</b> once you fill it — weight needs a scale photo, steps a screenshot, each workout a face
                photo/video, the booster its proof, and the ZUS Moments post a screenshot.
              </li>
              <li>
                Even when the booster is a workout-type activity (Buddy Steps, Pace), it does <b>not</b> count as one of your 3 workouts — the booster
                and each workout are separate submissions.
              </li>
              <li>
                All activities must be done <b>outside working hours</b>. Only weight <i>losses</i> earn points (maintain/gain = 0).
              </li>
              <li>
                <b>Final report: 28 Sep</b> — the day after W14 closes; final standings are tallied then.
              </li>
            </ul>
          </section>

          <section className="links">
            <h2>🔗 Official links</h2>
            <ul>
              <li>
                <a
                  href="https://zuscoffee.sg.larksuite.com/share/base/form/shrlgeDUcryNnylIhAM8JL6li1e"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("open_link", { link: "tracker_drawer" })}
                >
                  📋 Lark Base Tracker
                </a>
                <span className="link-note">Submit every weigh-in, step log, workout &amp; booster here</span>
              </li>
              <li>
                <a
                  href="https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("open_link", { link: "wiki_drawer" })}
                >
                  📖 Official challenge wiki
                </a>
                <span className="link-note">Full rules &amp; details from the organisers</span>
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}

// Copy-to-clipboard button for a week's hashtag line. Lives in a toggle-able row,
// so it stops click/keyboard events from bubbling up and collapsing the week.
// Renders as a full-width tappable button showing the hashtags + a "Copy" label.
function CopyTags({ text, week }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = (event) => {
    event.stopPropagation();
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      track("copy_tags", { week });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      className="copytags"
      onClick={copy}
      onKeyDown={(event) => event.stopPropagation()}
      aria-label={copied ? "Hashtags copied" : "Copy hashtags"}
    >
      <span className="copytags-text">{text}</span>
      <span className="copytags-cta">
        {copied ? (
          <>
            <Check size={13} strokeWidth={2.5} aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={13} strokeWidth={2.25} aria-hidden="true" />
            Copy
          </>
        )}
      </span>
    </button>
  );
}

export default function App() {
  // Which week is "now"? 0-based index into BOOSTERS; -1 if outside the challenge.
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor((Date.now() - CHALLENGE_START.getTime()) / msPerWeek);
  const currentWeek = weeksSinceStart >= 0 && weeksSinceStart < BOOSTERS.length ? weeksSinceStart : -1;

  // flag current week + phase starts
  const rows = BOOSTERS.map((b, i) => {
    const phaseStart = i === 0 || BOOSTERS[i - 1].phase !== b.phase;
    return { ...b, isCurrent: i === currentWeek, phaseStart };
  });

  // Challenge-details drawer (every-week tasks, bonus actionables, how-to-read).
  // `detailsTarget` picks which section the drawer lands on when it opens.
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState("top");
  const openDetails = (source, target = "top") => {
    setDetailsTarget(target);
    setDetailsOpen(true);
    track("open_details", { source });
  };

  // Expandable 7-day plan: which week index is open (current week by default).
  const [openWeek, setOpenWeek] = useState(currentWeek);
  const rowRefs = useRef({});
  const scrollRowIntoView = (i) => {
    const row = rowRefs.current[i];
    if (!row) {
      return;
    }
    // Land the row's top flush with the header's pinned bottom edge. The header
    // pins at --hero-h; its visible bottom is --hero-h + the header cell's full
    // height. Measure the TH (not the THEAD) so the cell's border-bottom is
    // included — the thead's box doesn't grow by the collapsed border, which left
    // the row landing ~2px low.
    const heroPin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hero-h")) || 0;
    const th = document.querySelector(".tablecard thead th");
    const headerH = th ? th.getBoundingClientRect().height : 0;
    // +1: land the row 1px lower so it clears the header's bottom edge, hiding the
    // sub-pixel hairline that otherwise shows between them. The first row (W1) is an
    // exception: it sits at the very top, so the +1 would push it off scrollY=0.
    const nudge = i === 0 ? 0 : 1;
    const top = Math.round(row.getBoundingClientRect().top + window.scrollY - heroPin - headerH) + nudge;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const toggleWeek = (i) =>
    setOpenWeek((cur) => {
      const next = cur === i ? -1 : i;
      // scroll the row into view when it opens (after the plan row renders)
      if (next === i) {
        requestAnimationFrame(() => scrollRowIntoView(i));
        track("expand_week", { week: BOOSTERS[i]?.wk ?? i + 1 });
      }
      return next;
    });

  // The hero and the table header are two stacked sticky bars; the lower one
  // (table header, top: var(--hero-h)) must know where the hero's bottom sits.
  // CSS can't measure that, so we compute --hero-h from the hero's height and
  // keep it live with a ResizeObserver — covers CSS/HMR edits, late font loads,
  // and window resizes alike (not just mount). Also auto-scrolls the current
  // week into view on load.
  useEffect(() => {
    const hero = document.querySelector("header.hero");
    if (!hero) {
      return;
    }
    const setHeroH = () => {
      document.documentElement.style.setProperty(
        "--hero-h",
        // Where the table header pins, measured from viewport top:
        // 8px body top-padding (where the hero pins) + hero height + the hero's
        // 8px margin-bottom + the table card's 1px top border (the header rests
        // 1px below the card edge, so it must pin 1px lower to not jump up).
        // Round to a whole pixel so the header pins on the device-pixel grid — a
        // fractional pin leaves a sub-pixel hairline/gap against the row below it.
        `${Math.round(hero.getBoundingClientRect().height + 8 + 8 + 1)}px`,
      );
    };
    setHeroH();
    const ro = new ResizeObserver(setHeroH);
    ro.observe(hero);
    // Auto-scroll the current week into view on load.
    if (currentWeek >= 0) {
      scrollRowIntoView(currentWeek);
    }
    return () => ro.disconnect();
    // mount-only: currentWeek is derived from Date.now() and is stable for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <header className="hero">
        <button type="button" className="hero-info" onClick={() => openDetails("hero_info")} aria-label="Open challenge details">
          <Info size={20} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <h1>🏋️ SlimPossible Challenge 2026</h1>
        <div className="sub">
          14-week weekly timetable · Challenge runs <span className="gold">22 Jun – 27 Sep 2026</span> · Cash prizes up to RM5,000
        </div>
        <div className="hero-links">
          <a
            className="hero-link"
            href="https://zuscoffee.sg.larksuite.com/share/base/form/shrlgeDUcryNnylIhAM8JL6li1e"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_link", { link: "tracker" })}
          >
            <ClipboardList size={15} strokeWidth={2.25} aria-hidden="true" />
            Lark Base Tracker
          </a>
          <a
            className="hero-link"
            href="https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_link", { link: "wiki" })}
          >
            <BookOpen size={15} strokeWidth={2.25} aria-hidden="true" />
            Official wiki
          </a>
        </div>
      </header>

      {/* Booster rotation table */}
      <div className="tablecard">
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th className="th-wk">Week</th>
                <th className="th-booster">Bi-Weekly Booster</th>
                <th>Week target</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => {
                const open = openWeek === i;
                return (
                  <Fragment key={b.wk}>
                    {/* eslint-disable jsx-a11y/prefer-tag-over-role -- a <tr> can't be a <button>; keyboard handler + aria-labelledby below provide button semantics */}
                    <tr
                      ref={(el) => (rowRefs.current[i] = el)}
                      data-phase={b.phase}
                      role="button"
                      tabIndex={0}
                      aria-labelledby={`week-toggle-label-${i}`}
                      onClick={() => toggleWeek(i)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleWeek(i);
                        }
                      }}
                      className={`wkrow${b.isCurrent ? " current" : ""}${b.phaseStart ? " phase-start" : ""}${open ? " open" : ""}`}
                    >
                      {/* eslint-enable jsx-a11y/prefer-tag-over-role */}
                      <td className="wk">
                        <span
                          id={`week-toggle-label-${i}`}
                          style={{
                            position: "absolute",
                            width: "1px",
                            height: "1px",
                            padding: 0,
                            margin: "-1px",
                            overflow: "hidden",
                            clip: "rect(0,0,0,0)",
                            whiteSpace: "nowrap",
                            border: 0,
                          }}
                        >
                          Toggle week {b.wk} plan
                        </span>
                        {b.isCurrent && <span className="caret">{open ? "▼" : "▶"}</span>}
                        {b.wk}
                        <span className="dates">{b.dates}</span>
                      </td>
                      <td>
                        <span className="booster">
                          {b.icon} {b.name}
                        </span>
                        <br />
                        <span className="post">{b.desc}</span>
                        {/* wiki link only shows when the week is expanded */}
                        {open && BOOSTER_META[b.phase]?.wikiUrl && (
                          <>
                            <br />
                            <a
                              className="wikilink"
                              href={BOOSTER_META[b.phase].wikiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              // the row is itself a toggle button — don't let the link
                              // click (or keyboard activation) bubble up and collapse it
                              onClick={(event) => {
                                event.stopPropagation();
                                track("open_link", { link: "booster_wiki", week: b.wk });
                              }}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              Click here to see booster's wiki
                              <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" />
                            </a>
                          </>
                        )}
                      </td>
                      <td className="wkmax">
                        <span className="wkmax-total">{WEEK_MAX}</span>
                      </td>
                    </tr>
                    {open && (
                      <tr className={`planrow${b.isCurrent ? " current" : ""}`}>
                        <td colSpan={3} aria-label={`Week ${b.wk} day plan`}>
                          <div className="wp-strip">
                            {buildDayPlan(b).map((g) => (
                              <div key={g.group} className={`wp-group wp-group-${g.group}`}>
                                <p className="wp-ghead">{g.heading}</p>
                                <ul className="wp-actions">
                                  {g.items.map((d) => (
                                    <li key={d.label} className={`wp-act ${d.kind}`}>
                                      {/* row 1: title on the left, points on the right */}
                                      <div className="wp-row wp-row-head">
                                        <span className="wp-clabel">{d.label}</span>
                                        {d.pts && <span className="wp-pts">{d.pts}</span>}
                                      </div>
                                      {/* row 2: description on the left, info icon on the right */}
                                      <div className="wp-row wp-row-body">
                                        <span className="wp-cdesc">
                                          {d.cue && <span className="wp-ccue">{d.cue}</span>}
                                          {d.note && <span className="wp-cnote">{d.note}</span>}
                                        </span>
                                        {d.pts && (
                                          <button
                                            type="button"
                                            className="wp-pts-info"
                                            aria-label="How points are scored — open challenge details"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              // booster + bonus cards point at the bonus section; everything else lands at the top
                                              openDetails("card_points", d.kind === "booster" ? "bonus" : "top");
                                            }}
                                            onKeyDown={(event) => event.stopPropagation()}
                                          >
                                            <Info size={18} strokeWidth={2.5} aria-hidden="true" />
                                          </button>
                                        )}
                                      </div>
                                      {d.tags && <CopyTags text={d.tags} week={b.wk} />}
                                    </li>
                                  ))}
                                </ul>
                                {g.group === "report" && (
                                  <p className="wp-deadline">
                                    🗓️ Due by the <b>following Monday</b>
                                    {rows[i + 1] ? (
                                      <>
                                        {" "}
                                        (before you do your <b>{rows[i + 1].wk}</b> weigh-in)
                                      </>
                                    ) : null}
                                    , or submit earlier on the same day of each activity.
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DetailsDrawer open={detailsOpen} target={detailsTarget} onClose={() => setDetailsOpen(false)} />

      <footer className="footer">
        © 2026 Jasper Loo Zhu Hang · All rights reserved · <span className="ver">v{import.meta.env.VITE_APP_VERSION}</span>
      </footer>
    </div>
  );
}
