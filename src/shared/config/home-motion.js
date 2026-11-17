// One timeline shared by the page transition and its independent widgets.
export const homeMotion = Object.freeze({
  enter: 760,
  sheet: 820,
  dissolve: 1250,
  chartDelay: 600,
  chart: 1100,
  onboardingHold: 1800,
})

export function getHomeMotionStyle() {
  return Object.fromEntries(Object.entries(homeMotion).map(([key, value]) => [`--motion-${key}`, `${value}ms`]))
}
