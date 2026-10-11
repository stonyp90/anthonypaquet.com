"use client";

/* ==========================================================================
   ITERATION LOOP — the studio's product development lifecycle, animated.
   Four phases orbit a fixed centre (product–market fit). A glowing comet
   glides into each phase, dwells so it can be read, then moves on — lighting
   each phase's icon node and narrating it. Every phase is interactive: hover,
   tap, or keyboard-focus a node to pause the loop and snap to it. Fully
   localized via props; honours prefers-reduced-motion. Reused by FR & EN.
   ========================================================================== */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  m,
  animate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useInView,
  type MotionValue,
  type Easing,
} from "framer-motion";
import { useMotionPreference } from "./useMotionPreference";
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
  /** Exactly four phases, ordered clockwise starting at the top. */
  phases: [LoopPhase, LoopPhase, LoopPhase, LoopPhase];
  /** Small eyebrow above the centre label, e.g. "La cible". */
  centerEyebrow: string;
  /** The gravitational centre everything orbits, e.g. "Adéquation produit–marché". */
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
const R = 98; // ring radius (node dots sit on this circle)
const NODE_ANGLES = [0, 90, 180, 270]; // top · right · bottom · left (clockwise)
const ORBIT_SECONDS = 15;
const DEG = Math.PI / 180;

/* Looping orbit: glide into a node, then dwell on it, four times per lap. */
const KF_TIMES = [0, 0.13, 0.25, 0.38, 0.5, 0.63, 0.75, 0.88, 1];
const KF_EASE: Easing[] = ["easeInOut", "linear", "easeInOut", "linear", "easeInOut", "linear", "easeInOut", "linear"];
const buildLoop = (base: number) => [
  base, base + 90, base + 90, base + 180, base + 180, base + 270, base + 270, base + 360, base + 360,
];

/** Shortest signed path from the current angle to node j's angle. */
function snapTarget(current: number, j: number) {
  let d = (((j * 90 - current) % 360) + 360) % 360;
  if (d > 180) d -= 360;
  return current + d;
}

/** Point on the ring at a given angle (0° = top, increasing clockwise). */
function nodePoint(angleDeg: number, r = R) {
  return {
    x: C + r * Math.sin(angleDeg * DEG),
    y: C - r * Math.cos(angleDeg * DEG),
  };
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
  { off: 5, r: 5.4, o: 0.72 },
  { off: 10, r: 4.9, o: 0.54 },
  { off: 16, r: 4.3, o: 0.41 },
  { off: 23, r: 3.7, o: 0.31 },
  { off: 31, r: 3.1, o: 0.23 },
  { off: 40, r: 2.6, o: 0.16 },
  { off: 50, r: 2.1, o: 0.11 },
  { off: 61, r: 1.6, o: 0.07 },
];

/* Absolute placement for each phase station, by node index.
   All four center the chip above the title (text below the logo). */
const STATION_POS = [
  "left-1/2 top-0 -translate-x-1/2 items-center text-center", // top
  "right-0 top-1/2 -translate-y-1/2 items-center text-center", // right
  "left-1/2 bottom-0 -translate-x-1/2 items-center text-center", // bottom
  "left-0 top-1/2 -translate-y-1/2 items-center text-center", // left
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

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);

  // Hover wins over a pin; null means the loop runs freely.
  const focusIdx = hovered ?? pinned;

  // Active phase follows the comet while running, and the focused node while paused.
  useMotionValueEvent(angle, "change", (a) => {
    const i = ((Math.round(a / 90) % 4) + 4) % 4;
    setActive((prev) => (prev === i ? prev : i));
  });
  useEffect(() => {
    if (focusIdx !== null) setActive(focusIdx);
  }, [focusIdx]);

  // Drive the orbit: free-running dwell loop, or a snap to the focused node.
  useEffect(() => {
    if (reduce || !inView || !pageVisible) return;
    controlRef.current?.stop();
    if (focusIdx === null) {
      const base = Math.round(angle.get() / 90) * 90;
      controlRef.current = animate(angle, buildLoop(base), {
        duration: ORBIT_SECONDS,
        times: KF_TIMES,
        ease: KF_EASE,
        repeat: Infinity,
      });
    } else {
      controlRef.current = animate(angle, snapTarget(angle.get(), focusIdx), {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      });
    }
    return () => controlRef.current?.stop();
  }, [focusIdx, reduce, angle, inView, pageVisible]);

  const enter = (i: number) => {
    setHovered(i);
    setInteracted(true);
  };
  const leave = () => setHovered(null);
  const togglePin = (i: number) => {
    setInteracted(true);
    setPinned((p) => (p === i ? null : i));
  };

  return (
    <section ref={sectionRef} id={id} className="py-24 lg:py-32 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="section-label mb-8">
          <span className="num">{sectionNum}</span>
          <span className="name">{sectionName}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ------------------------------ Copy ------------------------------ */}
          {/* lg:mb-32 offsets the caption+hint below the loop so the copy's
              vertical center lines up with the orbit circle, not the column. */}
          <div className="lg:mb-32">
            <h2 className="editorial-h2 text-2xl lg:text-4xl mb-6">{heading}</h2>
            <p className="editorial-lead max-w-xl mb-8">{lead}</p>
            <div className="pull-quote text-lg lg:text-xl max-w-xl">{pull}</div>
          </div>

          {/* --------------------------- Animated loop ------------------------ */}
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
              {/* soft radial glow behind the centre */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--color-accent-bg), transparent 70%)",
                }}
              />

              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {/* base ring + faint inner dashed ring */}
                <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-border-strong)" strokeWidth={1.25} />
                <circle
                  cx={C}
                  cy={C}
                  r={R - 16}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth={1}
                  strokeDasharray="2 8"
                  opacity={0.7}
                />

                {/* centre hub — a clean surface the phases orbit, keeps the
                    label legible and clear of the ring + comet */}
                <circle cx={C} cy={C} r={76} fill="var(--color-paper)" />
                <circle cx={C} cy={C} r={76} fill="none" stroke="var(--color-border)" strokeWidth={1} opacity={0.55} />

                {/* comet (motion only) */}
                {!reduce && inView && pageVisible &&
                  COMET.map((c, i) => (
                    <CometDot key={i} angle={angle} offset={c.off} r={c.r} opacity={c.o} />
                  ))}

                {/* small node markers on the ring */}
                {NODE_ANGLES.map((a, i) => {
                  const pt = nodePoint(a);
                  const on = active === i;
                  return (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={on ? 5 : 3.5}
                      fill={on ? "var(--color-accent)" : "var(--color-paper)"}
                      stroke="var(--color-accent)"
                      strokeWidth={1.25}
                      style={{ transition: "r .35s ease, fill .35s ease" }}
                    />
                  );
                })}
              </svg>

              {/* fixed centre — the gravitational target */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[30%] text-center pointer-events-none">
                <span className="editorial-eyebrow mb-1">{centerEyebrow}</span>
                <span className="editorial-h3 text-sm leading-tight text-balance">
                  {centerLabel}
                  <span className="accent-text">.</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  <m.span
                    animate={reduce || !inView || !pageVisible ? undefined : { rotate: 360 }}
                    transition={{ duration: ORBIT_SECONDS, ease: "linear", repeat: Infinity }}
                    className="inline-flex"
                  >
                    <RotateCw className="h-3 w-3" />
                  </m.span>
                  {loopHint}
                </span>
              </div>

              {/* phase stations — interactive icon chip + tag + title */}
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
                    className={`group absolute z-10 flex max-w-[6.5rem] cursor-pointer gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)] ${i === 0 ? "flex-col-reverse" : "flex-col"} ${STATION_POS[i]}`}
                  >
                    <span className="relative inline-flex">
                      {on && !reduce && inView && pageVisible && (
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
                      className={`whitespace-nowrap font-display text-sm font-bold leading-none transition-colors duration-300 ${
                        on ? "text-ink" : "text-[var(--color-ink-soft)]"
                      }`}
                    >
                      {phase.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* narration — active phase under motion, full list when reduced */}
            {reduce ? (
              <ul className="clean-list mx-auto mt-10 max-w-md">
                {phases.map((phase) => (
                  <li key={phase.title}>
                    <strong>{phase.title}</strong>. {phase.blurb}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div className="mt-10 min-h-[3.75rem] text-center">
                  <m.p
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto max-w-md font-display leading-snug text-[var(--color-ink-soft)]"
                  >
                    <span className="mr-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {phases[active].tag}
                    </span>
                    <span className="font-bold text-ink">{phases[active].title}</span>
                    <span className="italic">. {phases[active].blurb}</span>
                  </m.p>
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
        {footer}
      </div>
    </section>
  );
}
