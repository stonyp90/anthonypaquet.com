/* Pure geometry and timing for the How I Work loop: where each step sits on
   the ring and how the comet travels between them. No framework, no DOM. */

/** Share of a step spent gliding to the next one. The rest is the dwell. */
export const GLIDE = 0.3

/** Degrees between two neighbouring steps. */
export const stepAngle = (count: number) => 360 / count

/** Looping orbit: dwell on a step so it can be read, then glide to the next. */
export function buildLoop(base: number, count: number) {
  const step = stepAngle(count)
  const angles = [base]
  const times = [0]
  const ease: ('linear' | 'easeInOut')[] = []
  for (let i = 0; i < count; i += 1) {
    angles.push(base + i * step, base + (i + 1) * step)
    times.push((i + 1 - GLIDE) / count, (i + 1) / count)
    ease.push('linear', 'easeInOut')
  }
  return { angles, times, ease }
}

/** The step the comet is on, or nearest to, at a given angle. */
export function stepAt(angle: number, count: number) {
  return ((Math.round(angle / stepAngle(count)) % count) + count) % count
}

/** Shortest signed path from the current angle to step j's angle. */
export function snapTarget(current: number, j: number, count: number) {
  let d = (((j * stepAngle(count) - current) % 360) + 360) % 360
  if (d > 180) d -= 360
  return current + d
}

/** Which side of its chip a title sits on, so every title points outward. */
export function labelSide(angle: number) {
  if (angle === 0) return 'top'
  if (angle === 180) return 'bottom'
  return angle < 180 ? 'right' : 'left'
}
