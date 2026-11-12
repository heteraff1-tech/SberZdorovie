import { motion } from '@/shared/config/motion'

export class OnboardingFlow {
  #state
  #timer
  #frame
  #reduced
  #target = 0
  #speed = 0
  #spring = motion.pullSpring

  constructor(state, reduced) {
    this.#state = state
    this.#reduced = reduced
  }

  start() {
    this.#after(motion.blank, () => {
      this.#state.phase = 'intro'
      const intro = this.#reduced() ? 0 : motion.intro
      this.#after(intro + motion.introHold, () => { this.#state.phase = 'welcome' })
    })
  }

  advance() {
    const state = this.#state
    if (state.phase === 'welcome') {
      state.phase = 'connect'
      return
    }
    if (state.phase !== 'connect' || state.curtain !== 'off') return

    state.curtain = 'closed'
    this.#after(motion.curtain, () => {
      state.phase = 'pull'
      this.#after(motion.curtainHold, () => {
        state.curtain = 'opening'
        this.#after(motion.curtain, () => { state.curtain = 'off' })
      })
    })
  }

  get canPull() {
    const { phase, curtain, finishing } = this.#state
    return phase === 'pull' && curtain === 'off' && !finishing
  }

  grab() {
    this.#stopFrame()
    this.#speed = 0
  }

  setPull(value) {
    if (this.canPull) this.#follow(value, motion.pullSpring)
  }

  release() {
    if (this.canPull) this.#follow(0, motion.returnSpring)
  }

  finish() {
    if (!this.canPull) return
    this.#stopFrame()

    const state = this.#state
    state.finishing = true
    const start = performance.now()
    const duration = this.#reduced() ? 0 : motion.merge
    const tick = (time) => {
      state.merge = duration ? Math.max(0, Math.min(1, (time - start) / duration)) : 1
      if (state.merge < 1) {
        this.#frame = requestAnimationFrame(tick)
        return
      }
      this.#frame = undefined
      state.phase = 'done'
      state.finishing = false
    }

    if (duration) this.#frame = requestAnimationFrame(tick)
    else tick(start)
  }

  dispose() {
    clearTimeout(this.#timer)
    this.#stopFrame()
  }

  #after(duration, run) {
    this.#timer = setTimeout(run, duration)
  }

  #stopFrame() {
    cancelAnimationFrame(this.#frame)
    this.#frame = undefined
  }

  #follow(target, spring) {
    this.#target = target
    this.#spring = spring
    if (this.#reduced()) {
      this.grab()
      this.#state.pull = target
      return
    }
    if (this.#frame !== undefined) return

    let last = performance.now()
    const tick = (time) => {
      // Затухающая пружина сохраняет скорость при смене направления.
      const seconds = Math.max(0, Math.min(.064, (time - last) / 1000))
      last = time
      const gap = this.#state.pull - this.#target
      const drift = this.#speed + this.#spring * gap
      const decay = Math.exp(-this.#spring * seconds)
      const next = this.#target + (gap + drift * seconds) * decay
      this.#speed = (this.#speed - this.#spring * drift * seconds) * decay
      this.#state.pull = Math.max(0, Math.min(1, next))

      if (Math.abs(this.#state.pull - this.#target) < .001 && Math.abs(this.#speed) < .018) {
        this.#state.pull = this.#target
        this.#speed = 0
        this.#frame = undefined
        return
      }
      this.#frame = requestAnimationFrame(tick)
    }
    this.#frame = requestAnimationFrame(tick)
  }
}
