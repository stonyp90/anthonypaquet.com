"use client";

/* ==========================================================================
   ITERATION LOOP — the whole lifecycle as one ring, animated.
   Any number of steps sit evenly on a ring around a fixed centre (the
   target). A glowing comet dwells on each step so it can be read, then glides
   to the next — lighting its icon chip and narrating it. Every step is
   interactive: hover, tap, or keyboard-focus a chip to pause the loop and
   snap to it. From sm up each chip carries its title, pointing outward; on
   narrower screens the narration names the step. Fully localized via props;
   honours prefers-reduced-motion. Reused by FR & EN.
   ========================================================================== */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  m,
  animate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useInView,
  type MotionValue,
} from "framer-motion";
import { useMotionPreference } from "./useMotionPreference";
import { buildLoop, labelSide, snapTarget, stepAngle, stepAt } from "@/lib/loopOrbit";
import { RotateCw, type LucideIcon } from "lucide-react";

export type LoopPhase = {
  tag: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

type IterationLoopSectionProps = {
  /** Anchor id for the <section>. */
  id: string;
  /** Monospace eyebrow number, e.g. "01". */
  sectionNum: string;
  /** Monospace eyebrow label, e.g. "Cycle de développement". */
  sectionName: string;
  /** H2 content (may contain an accent <span>). */
  heading: ReactNode;
  /** Lead paragraph. */
  lead: ReactNode;
  /** Short italic pull quote reinforcing the thesis. */
  pull: string;
  /** The steps of the loop, ordered clockwise starting at the top. */
  phases: LoopPhase[];
  /** Small eyebrow above the centre label, e.g. "La cible". */
  centerEyebrow: string;
  /** The gravitational centre everything orbits, e.g. "Résultats d’affaires". */
  centerLabel: string;
  /** Tiny caption next to the rotating loop icon, e.g. "boucle continue". */
  loopHint: string;
  /** One-line affordance shown until the user interacts, e.g. "Explorez chaque étape". */
  interactHint: string;
  /** Optional content rendered under the loop, inside the same section. */
  footer?: ReactNode;
};

/* ----------------------------- Ring geometry ------------------------------ */
const SIZE = 360;
const C = SIZE / 2;
const RING = 0.4; // ring radius as a share of the orbit box (chips sit on it)
const R = SIZE * RING;
const HUB = R - 34; // centre surface, clear of the chips
const STEP_SECONDS = 4; // time given to each step: dwell, then glide on
const DEG = Math.PI / 180;

/** A station's offset from the centre, as a share of the orbit box. */
function stationOffset(angleDeg: number) {
  return {
    "--x": (RING * Math.sin(angleDeg * DEG)).toFixed(4),
    "--y": (RING * Math.cos(angleDeg * DEG)).toFixed(4),
  } as CSSProperties;
}

/** A single comet dot, deriving its ring position from the shared angle. */
function CometDot({
  angle,
  offset,
  r,
  opacity,
}: {
  angle: MotionValue<number>;
  offset: number;
  r: number;
  opacity: number;
}) {
  const x = useTransform(angle, (a) => C + R * Math.sin((a - offset) * DEG));
  const y = useTransform(angle, (a) => C - R * Math.cos((a - offset) * DEG));
  return <m.circle cx={x} cy={y} r={r} fill="var(--color-accent)" style={{ opacity }} />;
}

/* Comet: soft halo + bright head, then a tapering fading tail behind it. */
const COMET = [
  { off: 0, r: 10, o: 0.14 }, // halo
  { off: 0, r: 6, o: 1 }, // head
  { off: 3, r: 5.4, o: 0.72 },
  { off: 6, r: 4.9, o: 0.54 },
  { off: 10, r: 4.3, o: 0.41 },
  { off: 14, r: 3.7, o: 0.31 },
  { off: 19, r: 3.1, o: 0.23 },
  { off: 24, r: 2.6, o: 0.16 },
  { off: 30, r: 2.1, o: 0.11 },
  { off: 37, r: 1.6, o: 0.07 },
];

export function IterationLoopSection({
  id,
  sectionNum,
  sectionName,
  heading,
  lead,
  pull,
  phases,
  centerEyebrow,
  centerLabel,
  loopHint,
  interactHint,
  footer,
}: IterationLoopSectionProps) {
  const reduce = useMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const angle = useMotionValue(0);
  const controlRef = useRef<ReturnType<typeof animate> | null>(null);

  const count = phases.length;
  const step = stepAngle(count);
  const moving = !reduce && inView && pageVisible;

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);

  // Hover wins over a pin; null means the loop runs freely.
  const focusIdx = hovered ?? pinned;

  // Active step follows the comet while running, and the focused chip while paused.
  useMotionValueEvent(angle, "change", (a) => {
    const i = stepAt(a, count);
    setActive((prev) => (prev === i ? prev : i));
  });
  useEffect(() => {
    if (focusIdx !== null) setActive(focusIdx);
  }, [focusIdx]);

  // Drive the orbit: free-running dwell loop, or a snap to the focused chip.
  useEffect(() => {
    if (reduce || !inView || !pageVisible) return;
    controlRef.current?.stop();
    if (focusIdx === null) {
      const loop = buildLoop(stepAt(angle.get(), count) * step, count);
      controlRef.current = animate(angle, loop.angles, {
        duration: STEP_SECONDS * count,
        times: loop.times,
        ease: loop.ease,
        repeat: Infinity,
      });
    } else {
      controlRef.current = animate(angle, snapTarget(angle.get(), focusIdx, count), {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      });
    }
    return () => controlRef.current?.stop();
  }, [focusIdx, reduce, angle, inView, pageVisible, count, step]);

  const enter = (i: number) => {
    setHovered(i);
    setInteracted(true);
  };
  const leave = () => setHovered(null);
  const togglePin = (i: number) => {
    setInteracted(true);
    setPinned((p) => (p === i ? null : i));
  };

  const activePhase = phases[active] ?? phases[0];
  const ActiveIcon = activePhase.icon;

  return (
    <section ref={sectionRef} id={id} className="py-24 lg:py-32 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="section-label mb-8">
          <span className="num">{sectionNum}</span>
          <span className="name">{sectionName}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ------------------------------ Copy ------------------------------ */}
          {/* The bottom margin offsets the narration below the loop so the
              copy's vertical center lines up with the ring, not the column. */}
          <div className={reduce ? undefined : "lg:mb-36"}>
            <h2 className="editorial-h2 text-2xl lg:text-4xl mb-6">{heading}</h2>
            <p className="editorial-lead max-w-xl mb-8">{lead}</p>
            <div className="pull-quote text-lg lg:text-xl max-w-xl">{pull}</div>
          </div>

          {/* --------------------------- Animated loop ------------------------ */}
          <div className="loop-stage">
            <div className="loop-stage-meta" aria-hidden="true">
              <span>{loopHint}</span>
              <span className="loop-stage-count">
                <span className="loop-stage-pulse" />
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
            <div className="loop-orbit">
              {/* soft radial glow behind the centre */}
              <div aria-hidden="true" className="loop-glow" />

              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {/* base ring */}
                <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-border-strong)" strokeWidth={1.25} />

                {/* centre hub — a clean surface the steps orbit, keeps the
                    label legible and clear of the chips + comet */}
                <circle cx={C} cy={C} r={HUB} fill="var(--color-paper)" />
                <circle cx={C} cy={C} r={HUB} fill="none" stroke="var(--color-border)" strokeWidth={1} opacity={0.55} />

                {/* comet (motion only) */}
                {moving &&
                  COMET.map((c, i) => (
                    <CometDot key={i} angle={angle} offset={c.off} r={c.r} opacity={c.o} />
                  ))}
              </svg>

              {/* fixed centre — the gravitational target */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[23%] text-center pointer-events-none">
                <span className="editorial-eyebrow mb-1">{centerEyebrow}</span>
                <span className="editorial-h3 text-sm leading-tight text-balance">
                  {centerLabel}
                  <span className="accent-text">.</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  <m.span
                    animate={moving ? { rotate: 360 } : undefined}
                    transition={{ duration: STEP_SECONDS * 4, ease: "linear", repeat: Infinity }}
                    className="inline-flex"
                  >
                    <RotateCw className="h-3 w-3" />
                  </m.span>
                  {loopHint}
                </span>
              </div>

              {/* step stations — interactive icon chip on the ring, title outside */}
              {phases.map((phase, i) => {
                const on = active === i;
                const isPinned = pinned === i;
                const Icon = phase.icon;
                return (
                  <button
                    type="button"
                    key={phase.title}
                    onMouseEnter={() => enter(i)}
                    onMouseLeave={leave}
                    onFocus={() => enter(i)}
                    onBlur={leave}
                    onClick={() => togglePin(i)}
                    aria-pressed={isPinned}
                    aria-label={`${phase.tag} · ${phase.title}. ${phase.blurb}`}
                    style={stationOffset(i * step)}
                    className="loop-station group z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    <span className="relative inline-flex">
                      {on && moving && (
                        <m.span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-[var(--color-accent)]"
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.85, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <m.span
                        animate={{ scale: on ? 1.12 : 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 17 }}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                          on
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-paper)]"
                            : "border-[var(--color-border-strong)] bg-[var(--color-paper)] text-[var(--color-ink-soft)] group-hover:border-[var(--color-accent)]"
                        } ${isPinned ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-cream)]" : ""}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </m.span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`loop-label loop-label--${labelSide(i * step)} ${on ? "text-ink" : "text-[var(--color-ink-soft)]"}`}
                    >
                      {phase.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* live console — the active step, under motion */}
            {!reduce && (
              <>
                <div className="loop-console" aria-live="polite">
                  <m.div
                    key={active}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="loop-console-card"
                  >
                    <span className="loop-console-icon" aria-hidden="true">
                      <ActiveIcon className="h-4 w-4" />
                    </span>
                    <span className="loop-console-copy">
                      <span className="loop-console-tag">
                        {activePhase.tag}/{String(count).padStart(2, "0")}
                      </span>
                      <strong>{activePhase.title}</strong>
                      <span className="loop-console-blurb">{activePhase.blurb}</span>
                    </span>
                  </m.div>
                  <div className="loop-console-progress" aria-hidden="true">
                    <m.span
                      key={active}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STEP_SECONDS, ease: "linear" }}
                    />
                  </div>
                </div>
                <p
                  aria-hidden="true"
                  className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-gray)] transition-opacity duration-500"
                  style={{ opacity: interacted ? 0 : 1 }}
                >
                  {interactHint}
                </p>
              </>
            )}
          </div>
        </div>

        {/* every step at once, when nothing moves */}
        {reduce && (
          <ol className="clean-list loop-steps">
            {phases.map((phase) => (
              <li key={phase.title}>
                <span className="loop-step-tag">{phase.tag}</span>
                <strong>{phase.title}</strong>. {phase.blurb}
              </li>
            ))}
          </ol>
        )}
        {footer}
      </div>
    </section>
  );
}
