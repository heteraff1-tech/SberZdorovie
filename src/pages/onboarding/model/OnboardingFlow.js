import { motion } from '@/shared/config/motion'

export class OnboardingFlow {
  #state
  #timer
  #frame
  #reduced

  constructor(state, reduced) {
    this.#state = state
    this.#reduced = reduced
  }

  start() {
    this.#after(motion.blank, () => {
      this.#state.phase = 'intro'
      this.#after(motion.intro + motion.stagger + motion.introHold, () => {
        this.#state.phase = 'welcome'
      })
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

  setPull(value) {
    cancelAnimationFrame(this.#frame)
    this.#state.pull = value
  }

  release() {
    const start = this.#state.pull
    this.#animate(motion.release, (step) => {
      this.#state.pull = start * (1 - step)
    })
  }

  finish() {
    if (!this.canPull) return
    const state = this.#state
    state.finishing = true
    const start = state.pull
    const duration = motion.stretch * (1 - start)

    this.#animate(duration, (step) => {
      state.pull = start + (1 - start) * step
    }, () => {
      this.#animate(motion.merge, (step) => { state.merge = step }, () => {
        state.phase = 'done'
        state.finishing = false
      })
    })
  }

  dispose() {
    clearTimeout(this.#timer)
    cancelAnimationFrame(this.#frame)
  }

  #after(duration, run) {
    this.#timer = setTimeout(run, duration)
  }

  #animate(duration, update, done = () => {}) {
    cancelAnimationFrame(this.#frame)
    if (this.#reduced() || duration <= 0) {
      update(1)
      done()
      return
    }

    const start = performance.now()
    const tick = (time) => {
      const part = Math.max(0, Math.min(1, (time - start) / duration))
      update(1 - (1 - part) ** 3)
      if (part < 1) this.#frame = requestAnimationFrame(tick)
      else done()
    }
    this.#frame = requestAnimationFrame(tick)
  }
}
