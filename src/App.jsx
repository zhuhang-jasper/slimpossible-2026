import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { BookOpen, Check, CircleHelp, ClipboardList, Copy, ExternalLink, Info } from "lucide-react";

import InstallPrompt, { InstallCard } from "./components/InstallPrompt.jsx";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import { track } from "./utils/analytics.js";
import { BIWEEKLY_MAX, BONUS_TASKS, BOOSTER_META, BOOSTERS, buildDayPlan, CHALLENGE_START, WEEK_MAX, WEEKLY_TASKS } from "./data.js";

// Shared <Trans> rich-text element map. The legend strings embed <b>/<i> for emphasis
// and <req>/<opt> spans that colour the 30/40-pt callouts — these components fill them in.
const RICH = {
  b: <b />,
  i: <i />,
  req: <span className="req" />,
  opt: <span className="opt" />,
};

// Feature flag: pin the expanded week's row under the table header while scrolling its
// (often tall) action plan. Off for now — flip to true to re-enable. Adds a class on
// .tablecard that the sticky CSS keys off (see .sticky-week-row in index.css).
const STICKY_WEEK_ROW = false;

// Challenge reference (every-week tasks, bonus actionables, how-to-read) lives in a
// right-side drawer so the booster table is the first thing in the main scroll flow.
function DetailsDrawer({ open, target = "top", onClose }) {
  const { t, i18n } = useTranslation();
  const fmt = (n) => n.toLocaleString(i18n.resolvedLanguage === "ms" ? "ms-MY" : "en-US");
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
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label={t("drawer.ariaLabel")} aria-hidden={!open}>
        <div className="drawer-head">
          <h2 className="drawer-title">{t("drawer.title")}</h2>
          <button ref={closeRef} type="button" className="drawer-close" onClick={onClose} aria-label={t("drawer.close")}>
            ✕
          </button>
        </div>
        <div className="drawer-body" ref={bodyRef}>
          {/* Every-week tasks */}
          <section className="recurring">
            <h2>
              {t("drawer.everyWeekTitle")} <span className="maxbadge">{t("drawer.everyWeekMax", { max: WEEK_MAX })}</span>
            </h2>
            <p className="scope everyweek-scope">{t("drawer.everyWeekScope")}</p>
            <div className="pill-row">
              {WEEKLY_TASKS.map((task) => (
                <div className="pill" key={task.key}>
                  <div className="t">
                    <span>
                      {task.icon} {t(`weeklyTasks.${task.key}.title`)}
                    </span>
                    <span className="cap">{t(`weeklyTasks.${task.key}.cap`)}</span>
                  </div>
                  <div className="d">{t(`weeklyTasks.${task.key}.desc`)}</div>
                  <table className="ptab">
                    <tbody>
                      {(() => {
                        const maxVal = Math.max(...task.rows.map(([, v]) => v));
                        return task.rows.map(([labelKey, val]) => (
                          <tr key={labelKey} className={val === maxVal ? "target" : ""}>
                            <td>{t(`weeklyTasks.${task.key}.${labelKey}`)}</td>
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
              <span className="h2-title">{t("drawer.bonusTitle")}</span>
              <span className="maxbadge bonus-max">{t("drawer.bonusMax")}</span>
            </h2>
            <p className="scope">{t("drawer.bonusScope")}</p>
            <div className="pill-row">
              {BONUS_TASKS.map((task) => (
                <div className="pill" key={task.key}>
                  <div className="t">
                    <span>
                      {task.icon} {t(`bonusTasks.${task.key}.title`)}
                    </span>
                    <span className="cap bonus-cap">{t(`bonusTasks.${task.key}.badge`)}</span>
                  </div>
                  <div className="d">{t(`bonusTasks.${task.key}.desc`)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="legend">
            <h2>{t("drawer.legendTitle")}</h2>
            <ul>
              <li>
                <Trans i18nKey="drawer.legend.everyWeek" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.boosterRotates" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.boosterPts" components={RICH} />
              </li>
              <li>
                <Trans
                  i18nKey="drawer.legend.weekTarget"
                  components={RICH}
                  values={{ weekMax: WEEK_MAX, biweekly: fmt(BIWEEKLY_MAX), full: fmt(WEEK_MAX * BOOSTERS.length) }}
                />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.bookends" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.dueDate" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.oneWorkout" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.proof" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.boosterNotWorkout" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.outsideHours" components={RICH} />
              </li>
              <li>
                <Trans i18nKey="drawer.legend.finalReport" components={RICH} />
              </li>
            </ul>
          </section>

          <section className="links">
            <h2>{t("drawer.linksTitle")}</h2>
            <ul>
              <li>
                <a
                  href="https://zuscoffee.sg.larksuite.com/share/base/form/shrlgeDUcryNnylIhAM8JL6li1e"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("open_link", { link: "tracker_drawer" })}
                >
                  {t("drawer.trackerLink")}
                </a>
                <span className="link-note">{t("drawer.trackerNote")}</span>
              </li>
              <li>
                <a
                  href="https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("open_link", { link: "wiki_drawer" })}
                >
                  {t("drawer.wikiLink")}
                </a>
                <span className="link-note">{t("drawer.wikiNote")}</span>
              </li>
            </ul>
          </section>

          <InstallCard />
        </div>
      </aside>
    </div>
  );
}

// Copy-to-clipboard button for a week's hashtag line. Lives in a toggle-able row,
// so it stops click/keyboard events from bubbling up and collapsing the week.
// Renders as a full-width tappable button showing the hashtags + a "Copy" label.
function CopyTags({ text, week }) {
  const { t } = useTranslation();
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
      aria-label={copied ? t("copy.copiedLabel") : t("copy.copyLabel")}
    >
      <span className="copytags-text">{text}</span>
      <span className="copytags-cta">
        {copied ? (
          <>
            <Check size={13} strokeWidth={2.5} aria-hidden="true" />
            {t("copy.copied")}
          </>
        ) : (
          <>
            <Copy size={13} strokeWidth={2.25} aria-hidden="true" />
            {t("copy.copy")}
          </>
        )}
      </span>
    </button>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();

  // Which week is "now"? 0-based index into BOOSTERS; -1 if outside the challenge.
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor((Date.now() - CHALLENGE_START.getTime()) / msPerWeek);
  const currentWeek = weeksSinceStart >= 0 && weeksSinceStart < BOOSTERS.length ? weeksSinceStart : -1;

  // flag current week + phase starts. Resolve the booster's localized name/desc here so the
  // table cells and buildDayPlan() (which interpolates `name`) share one translated value.
  const rows = BOOSTERS.map((b, i) => {
    const phaseStart = i === 0 || BOOSTERS[i - 1].phase !== b.phase;
    return { ...b, name: t(`boosters.${b.nameKey}`), desc: t(`boosters.${b.descKey}`), isCurrent: i === currentWeek, phaseStart };
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
  const scrollRowIntoView = (i, behavior = "smooth") => {
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
    window.scrollTo({ top, behavior });
  };

  // Recompute the sticky offsets (--hero-h, --header-h) from the live DOM. Driven by a
  // ResizeObserver for CSS/HMR/font/resize changes, but also called synchronously before a
  // language-switch re-anchor: a translated hero can change height, and the observer fires
  // only after paint, so without this scrollRowIntoView would read a stale --hero-h.
  const setHeroH = useCallback(() => {
    const hero = document.querySelector("header.hero");
    if (hero) {
      document.documentElement.style.setProperty(
        // Where the table header pins, measured from viewport top:
        // 8px body top-padding (where the hero pins) + hero height + the hero's
        // 8px margin-bottom + the table card's 1px top border (the header rests
        // 1px below the card edge, so it must pin 1px lower to not jump up).
        // Round to a whole pixel so the header pins on the device-pixel grid — a
        // fractional pin leaves a sub-pixel hairline/gap against the row below it.
        "--hero-h",
        `${Math.round(hero.getBoundingClientRect().height + 8 + 8 + 1)}px`,
      );
    }
    // --header-h = the table header's own height, so an expanded week row can pin
    // directly under it via top: calc(--hero-h + --header-h). Measure the TH (not
    // the THEAD) so the cell's collapsed border-bottom is included.
    const th = document.querySelector(".tablecard thead th");
    if (th) {
      document.documentElement.style.setProperty("--header-h", `${Math.round(th.getBoundingClientRect().height)}px`);
    }
  }, []);
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
    setHeroH();
    const ro = new ResizeObserver(setHeroH);
    ro.observe(hero);
    const th = document.querySelector(".tablecard thead th");
    if (th) {
      ro.observe(th);
    }
    // Auto-scroll the current week into view on load.
    if (currentWeek >= 0) {
      scrollRowIntoView(currentWeek);
    }
    return () => ro.disconnect();
    // mount-only: currentWeek is derived from Date.now() and is stable for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching language reflows every cell (EN/BM strings differ in length), shifting the
  // layout out from under an expanded week. Re-anchor that row under the pinned header —
  // instantly (behavior "auto"), in a layout effect that runs after React commits the new
  // text but before the browser paints, so the correction lands on the same frame and no
  // scrolling is ever visible. Skip the initial mount (ref starts false) so this doesn't
  // fight the mount effect's own scroll.
  const didMountLang = useRef(false);
  useLayoutEffect(() => {
    if (!didMountLang.current) {
      didMountLang.current = true;
      return;
    }
    // Refresh the sticky offsets from the just-committed translated DOM first — the hero
    // can change height between languages, and scrollRowIntoView reads --hero-h.
    setHeroH();
    if (openWeek >= 0) {
      scrollRowIntoView(openWeek, "auto");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <div className="wrap">
      <header className="hero">
        <div className="hero-titlerow">
          <h1>{t("hero.title")}</h1>
          <div className="hero-controls">
            <LanguageSwitcher />
            <button type="button" className="hero-info" onClick={() => openDetails("hero_info")} aria-label={t("hero.infoLabel")}>
              <CircleHelp size={22} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="sub">
          {t("hero.sub")} · <span className="gold">{t("hero.dates")}</span>
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
            {t("hero.trackerLink")}
          </a>
          <a
            className="hero-link"
            href="https://zuscoffee.sg.larksuite.com/wiki/J4yCw1lWSiCBIKkjpqilg7FwgZb"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_link", { link: "wiki" })}
          >
            <BookOpen size={15} strokeWidth={2.25} aria-hidden="true" />
            {t("hero.wikiLink")}
          </a>
        </div>
      </header>

      {/* Booster rotation table */}
      <div className={`tablecard${STICKY_WEEK_ROW ? " sticky-week-row" : ""}`}>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th className="th-wk">{t("table.week")}</th>
                <th className="th-booster">{t("table.booster")}</th>
                <th>{t("table.weekTarget")}</th>
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
                          {t("table.toggleWeekPlan", { wk: b.wk })}
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
                      </td>
                      <td className="wkmax">
                        <span className="wkmax-total">{b.weekMax ?? WEEK_MAX}</span>
                      </td>
                    </tr>
                    {/* wiki link as its own row (Week + Target cells blank), so it reads as a
                        continuation of the week row — but it's a SEPARATE row, so only the week
                        row above pins on scroll and the wiki line scrolls away with the plan */}
                    {open && BOOSTER_META[b.phase]?.wikiUrl && (
                      <tr className={`wikirow${b.isCurrent ? " current" : ""}`}>
                        <td className="wk" aria-hidden="true" />
                        <td>
                          <a
                            className="wikilink"
                            href={BOOSTER_META[b.phase].wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track("open_link", { link: "booster_wiki", week: b.wk })}
                          >
                            {t("table.boosterWiki")}
                            <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" />
                          </a>
                        </td>
                        <td className="wkmax" aria-hidden="true" />
                      </tr>
                    )}
                    {open && (
                      <tr className={`planrow${b.isCurrent ? " current" : ""}`}>
                        <td colSpan={3} aria-label={t("table.dayPlanLabel", { wk: b.wk })}>
                          <div className="wp-strip">
                            {buildDayPlan(b).map((g) => (
                              <div key={g.group} className={`wp-group wp-group-${g.group}`}>
                                {g.headingKey && <p className="wp-ghead">{t(g.headingKey)}</p>}
                                {/* deadline footnote sits under the "② Submit report" heading */}
                                {g.group === "report" && (
                                  <p className="wp-deadline">
                                    <Trans i18nKey="plan.report.dueNote" components={RICH} />
                                    {rows[i + 1] ? (
                                      <Trans i18nKey="plan.report.dueNoteWeek" components={RICH} values={{ wk: rows[i + 1].wk }} />
                                    ) : null}
                                    {t("plan.report.dueNoteTail")}
                                  </p>
                                )}
                                {/* Report-side actions are bracketed by which Lark form they ride on:
                                    a thick left bezel with a vertical "FORM N" label. Each workout needs
                                    its own form (single-select activity), so Forms 2 & 3 hold one workout. */}
                                <div className={g.form ? "wp-form" : undefined}>
                                  {g.form && <span className="wp-formlabel">{g.form}</span>}
                                  <ul className="wp-actions">
                                    {g.items.map((d) => {
                                      // Resolve the bonus tip: extras.<key> → text, wrapped in plan.report.tip.
                                      const note = d.extraKey ? t("plan.report.tip", { tip: t(`extras.${d.extraKey}`).toLowerCase() }) : undefined;
                                      return (
                                        <li key={d.labelKey} className={`wp-act ${d.kind}`}>
                                          {/* row 1: title on the left, points on the right */}
                                          <div className="wp-row wp-row-head">
                                            <span className="wp-clabel">
                                              {d.badgeKey && <span className="wp-badge">{t(d.badgeKey)}</span>}
                                              {t(d.labelKey, d.labelVars)}
                                            </span>
                                            {d.pts && <span className="wp-pts">{d.pts}</span>}
                                          </div>
                                          {/* row 2: description on the left, info icon on the right */}
                                          <div className="wp-row wp-row-body">
                                            <span className="wp-cdesc">
                                              {d.cueKey && <span className="wp-ccue">{t(d.cueKey)}</span>}
                                              {note && <span className="wp-cnote">{note}</span>}
                                            </span>
                                            {d.pts && (
                                              <button
                                                type="button"
                                                className="wp-pts-info"
                                                aria-label={t("pointsInfoLabel")}
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
                                      );
                                    })}
                                  </ul>
                                </div>
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

      <InstallPrompt />

      <footer className="footer">
        {t("footer.rights")} <span className="ver">v{import.meta.env.VITE_APP_VERSION}</span>
      </footer>
    </div>
  );
}
