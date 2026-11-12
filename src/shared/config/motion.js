export const motion = Object.freeze({
  blank: 120,
  intro: 760,
  stagger: 100,
  introHold: 500,
  copy: 520,
  action: 440,
  curtain: 180,
  curtainHold: 1000,
  release: 460,
  stretch: 260,
  merge: 590,
  orbit: 5200,
  arrows: 1680,
  arrowStep: 130,
})

export function getMotionStyle() {
  return {
    '--intro-time': `${motion.intro}ms`,
    '--stagger-time': `${motion.stagger}ms`,
    '--copy-time': `${motion.copy}ms`,
    '--action-time': `${motion.action}ms`,
    '--curtain-time': `${motion.curtain}ms`,
    '--orbit-time': `${motion.orbit}ms`,
    '--arrow-time': `${motion.arrows}ms`,
    '--arrow-step': `${motion.arrowStep}ms`,
  }
}
