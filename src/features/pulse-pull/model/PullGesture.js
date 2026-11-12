const limits = { distance: 196, flickDistance: 30, flickSpeed: .78, sampleAge: 85 }

export class PullGesture {
  #press
  #sample
  #speed = 0

  get active() {
    return Boolean(this.#press)
  }

  start(event, scale) {
    if (this.active || !event.isPrimary || event.button !== 0) return false

    this.#press = { id: event.pointerId, y: event.clientY, scale }
    this.#sample = { y: event.clientY, time: event.timeStamp }
    this.#speed = 0
    return true
  }

  move(event) {
    if (event.pointerId !== this.#press?.id) return null

    const time = event.timeStamp - this.#sample.time
    if (time > 0 && event.clientY !== this.#sample.y) {
      this.#speed = (this.#sample.y - event.clientY) / this.#press.scale / time
      this.#sample = { y: event.clientY, time: event.timeStamp }
    }

    return Math.max(0, Math.min(1, this.#distance(event) / limits.distance))
  }

  end(event, cancelled = false) {
    if (event.pointerId !== this.#press?.id) return null

    const progress = this.move(event)
    const distance = this.#distance(event)
    // Давний импульс не считается быстрым свайпом после паузы.
    const flick = distance >= limits.flickDistance &&
      this.#speed >= limits.flickSpeed &&
      event.timeStamp - this.#sample.time <= limits.sampleAge

    this.#press = undefined
    return { progress, complete: !cancelled && (progress === 1 || flick) }
  }

  #distance(event) {
    return (this.#press.y - event.clientY) / this.#press.scale
  }
}
