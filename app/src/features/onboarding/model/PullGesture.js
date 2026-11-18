const limits = { distance: 196, flickDistance: 30, flickSpeed: 0.78, sampleAge: 85 };

/** Вычисляет прогресс и скорость свайпа; не изменяет интерфейс самостоятельно. */
export class PullGesture {
  #press;
  #sample;
  #speed = 0;

  /** Показывает, захвачен ли сейчас основной указатель. */
  get active() {
    return Boolean(this.#press);
  }

  /** Начинает жест для основного указателя с учётом масштаба экрана. */
  start(event, scale, progress) {
    if (this.active || !event.isPrimary || event.button !== 0) return false;

    this.#press = { id: event.pointerId, y: event.clientY, scale, progress };
    this.#sample = { y: event.clientY, time: event.timeStamp };
    this.#speed = 0;
    return true;
  }

  /** Возвращает новый прогресс и сглаженную скорость движения. */
  move(event) {
    if (event.pointerId !== this.#press?.id) return null;

    const time = event.timeStamp - this.#sample.time;
    if (time > 0 && event.clientY !== this.#sample.y) {
      this.#speed = (this.#sample.y - event.clientY) / this.#press.scale / time;
      this.#sample = { y: event.clientY, time: event.timeStamp };
    }

    const progress = Math.max(
      0,
      Math.min(1, this.#press.progress + this.#distance(event) / limits.distance),
    );
    const speed = event.timeStamp - this.#sample.time <= limits.sampleAge ? this.#speed : 0;
    return { progress, speed };
  }

  /** Решает, завершён ли жест; отмена указателя всегда возвращает фигуру. */
  end(event, cancelled = false) {
    if (event.pointerId !== this.#press?.id) return null;

    const { progress, speed } = this.move(event);
    const distance = this.#distance(event);
    // Давний импульс не считается быстрым свайпом после паузы.
    const flick = distance >= limits.flickDistance && speed >= limits.flickSpeed;

    this.#press = undefined;
    return { speed, complete: !cancelled && (progress === 1 || flick) };
  }

  /** Считает вертикальное смещение относительно точки захвата. */
  #distance(event) {
    return (this.#press.y - event.clientY) / this.#press.scale;
  }
}
