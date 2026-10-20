/** Add reading stops inside tall chapters so a viewport of content is never skipped. */
export function journeyStops(starts: number[], viewport: number, documentHeight: number, landmarks: number[] = []) {
  if (viewport <= 0) return [0];
  const max = Math.max(0, documentHeight - viewport);
  const anchors = [...new Set([0, ...starts, ...landmarks, max].map(value => Math.round(Math.max(0, Math.min(max, value)))))].sort((a, b) => a - b);
  return anchors.flatMap((start, index) => {
    const gap = (anchors[index + 1] ?? start) - start;
    const steps = gap > viewport * 1.2 ? Math.ceil(gap / viewport) : 1;
    return Array.from({ length: steps }, (_, step) => Math.round(start + gap * step / steps));
  });
}

export interface ReadingItem { top: number; bottom: number }

/** Pack whole cards into the visible reading area, instead of stopping mid-card. */
export function readingStops(items: ReadingItem[], chapterTop: number, viewport: number, topInset: number, bottomInset: number) {
  const available = viewport - topInset - bottomInset;
  if (available <= 0) return [];
  const sorted = [...items].sort((a, b) => a.top - b.top || a.bottom - b.bottom);
  const stops: number[] = [];
  let visibleBottom = chapterTop + viewport - bottomInset;
  let index = 0;
  while (index < sorted.length) {
    const item = sorted[index];
    if (item.bottom <= visibleBottom + 1) { index++; continue; }
    if (item.bottom - item.top > available) {
      // A long letter still needs reading stops, even when it cannot fit in one screen.
      let target = Math.max(chapterTop, item.top - topInset);
      const last = Math.max(target, item.bottom - viewport + bottomInset);
      if (target > chapterTop + 12) stops.push(target);
      while (last - target > available) { target += available; stops.push(target); }
      if (last > target + 12) stops.push(last);
      visibleBottom = last + viewport - bottomInset;
      index++;
      continue;
    }
    let bottom = item.bottom;
    let end = index + 1;
    while (end < sorted.length && Math.max(bottom, sorted[end].bottom) - item.top <= available) {
      bottom = Math.max(bottom, sorted[end].bottom);
      end++;
    }
    const target = item.top - topInset - (available - (bottom - item.top)) / 2;
    if (target > chapterTop + 12) stops.push(target);
    visibleBottom = target + viewport - bottomInset;
    index = end;
  }
  return stops;
}

export function nextJourneyStop(stops: number[], position: number, direction: number) {
  return direction > 0 ? stops.find(stop => stop > position + 12) : [...stops].reverse().find(stop => stop < position - 12);
}

export const JOURNEY_NAVIGATE = 'birthday:journey-navigate';
export interface JourneyNavigation { target: string; onArrive: () => void }

/** Use the same interruptible transition as swiping, including the arrival callback. */
export function navigateJourney(target: string, onArrive: () => void) {
  window.dispatchEvent(new CustomEvent<JourneyNavigation>(JOURNEY_NAVIGATE, { detail: { target, onArrive } }));
}
