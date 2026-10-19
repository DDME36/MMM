/** Add reading stops inside tall chapters so a viewport of content is never skipped. */
export function journeyStops(starts: number[], viewport: number, documentHeight: number) {
  if (viewport <= 0) return [0];
  const max = Math.max(0, documentHeight - viewport);
  const anchors = [...new Set([0, ...starts, max].map(value => Math.max(0, Math.min(max, value))))].sort((a, b) => a - b);
  return anchors.flatMap((start, index) => {
    const gap = (anchors[index + 1] ?? start) - start;
    const steps = gap > viewport * 1.2 ? Math.ceil(gap / viewport) : 1;
    return Array.from({ length: steps }, (_, step) => Math.round(start + gap * step / steps));
  });
}

export function nextJourneyStop(stops: number[], position: number, direction: number) {
  return direction > 0 ? stops.find(stop => stop > position + 12) : [...stops].reverse().find(stop => stop < position - 12);
}
