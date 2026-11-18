import { easeBetween } from '@/shared/lib/easing';

const physics = { pullSpring: 34, returnSpring: 18 };

/** Управляет этапами онбординга, таймерами и пружиной жеста без привязки к DOM. */
export class OnboardingFlow {
  #state;
  #timer;
  #frame;
  #reduced;
  #duration;
  #target = 0;
  #speed = 0;
  #impulse = 0;
  #spring = physics.pullSpring;

  /** Получает реактивное состояние и функции чтения настроек движения. */
  constructor(state, reduced, duration) {
    this.#state = state;
    this.#reduced = reduced;
    this.#duration = duration;
  }

  /** Показывает вступление и переводит экран в приветствие. */
  start() {
    this.#after(this.#duration('blank'), () => {
      this.#state.phase = 'intro';
      const intro = this.#reduced() ? 0 : this.#duration('intro');
      this.#after(intro + this.#duration('intro-hold'), () => {
        this.#state.phase = 'welcome';
      });
    });
  }

  /** Переключает приветствие, подключение и штору перед жестом. */
  advance() {
    const state = this.#state;
    if (state.phase === 'welcome') {
      state.phase = 'connect';
      return;
    }
    if (state.phase !== 'connect' || state.curtain !== 'off') return;

    state.curtain = 'closed';
    this.#after(this.#duration('curtain'), () => {
      state.phase = 'pull';
      this.#after(this.#duration('curtain-hold'), () => {
        state.curtain = 'opening';
        this.#after(this.#duration('curtain'), () => {
          state.curtain = 'off';
        });
      });
    });
  }

  /** Разрешает жест только после открытия шторы и до завершения подключения. */
  get canPull() {
    const { phase, curtain, finishing } = this.#state;
    return phase === 'pull' && curtain === 'off' && !finishing;
  }

  /** Перехватывает текущую фигуру, не сбрасывая видимый прогресс. */
  grab() {
    this.#stopFrame();
    this.#speed = 0;
    this.#impulse = 0;
    if (this.#state.tension) this.#follow(this.#state.pull, physics.pullSpring);
  }

  /** Обновляет цель пружины и добавляет импульс от скорости указателя. */
  setPull(value, speed) {
    if (!this.canPull) return;
    this.#impulse = value > 0 || this.#state.pull > 0 ? getImpulse(speed) : 0;
    this.#follow(value, physics.pullSpring);
  }

  /** Возвращает фигуру после незавершённого жеста. */
  release() {
    if (this.canPull) this.#follow(0, physics.returnSpring);
  }

  /** Доводит слияние до конца и переводит сценарий в фазу done. */
  finish(speed = 0) {
    if (!this.canPull) return;
    this.#stopFrame();

    const state = this.#state;
    state.finishing = true;
    const start = performance.now();
    const duration = this.#reduced() ? 0 : this.#duration('merge');
    const tension = state.tension;
    const impulse = getImpulse(speed);
    const tick = (time) => {
      state.merge = duration ? Math.max(0, Math.min(1, (time - start) / duration)) : 1;
      const push = easeBetween(0, 0.18, state.merge);
      state.tension =
        (tension + (impulse - tension) * push) * (1 - easeBetween(0.18, 0.85, state.merge));
      if (state.merge < 1) {
        this.#frame = requestAnimationFrame(tick);
        return;
      }
      this.#frame = undefined;
      state.phase = 'done';
      state.finishing = false;
    };

    if (duration) this.#frame = requestAnimationFrame(tick);
    else tick(start);
  }

  /** Освобождает таймер и requestAnimationFrame при уходе со страницы. */
  dispose() {
    clearTimeout(this.#timer);
    this.#stopFrame();
  }

  /** Планирует следующий этап сценария. */
  #after(duration, run) {
    this.#timer = setTimeout(run, duration);
  }

  /** Останавливает текущий покадровый расчёт. */
  #stopFrame() {
    cancelAnimationFrame(this.#frame);
    this.#frame = undefined;
  }

  /** Плавно ведёт прогресс к цели с затухающей пружиной. */
  #follow(target, spring) {
    this.#target = target;
    this.#spring = spring;
    if (this.#reduced()) {
      this.#stopFrame();
      this.#speed = 0;
      this.#impulse = 0;
      this.#state.tension = 0;
      this.#state.pull = target;
      return;
    }
    if (this.#frame !== undefined) return;

    let last = performance.now();
    const tick = (time) => {
      // Затухающая пружина сохраняет скорость при смене направления.
      const seconds = Math.max(0, Math.min(0.064, (time - last) / 1000));
      last = time;
      const gap = this.#state.pull - this.#target;
      const drift = this.#speed + this.#spring * gap;
      const decay = Math.exp(-this.#spring * seconds);
      const next = this.#target + (gap + drift * seconds) * decay;
      this.#speed = (this.#speed - this.#spring * drift * seconds) * decay;
      this.#state.pull = Math.max(0, Math.min(1, next));

      // Натяжение от пальца затухает, инерция корпуса остаётся на пружине.
      this.#impulse *= Math.exp(-10 * seconds);
      const force = this.#impulse * 0.68 + Math.tanh(this.#speed / 4.6) * 0.32;
      this.#state.tension += (force - this.#state.tension) * (1 - Math.exp(-24 * seconds));

      const still =
        Math.abs(this.#state.pull - this.#target) < 0.001 && Math.abs(this.#speed) < 0.018;
      if (still && Math.abs(this.#state.tension) < 0.005 && Math.abs(this.#impulse) < 0.005) {
        this.#state.pull = this.#target;
        this.#state.tension = 0;
        this.#speed = 0;
        this.#impulse = 0;
        this.#frame = undefined;
        return;
      }
      this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }
}

/** Ограничивает импульс, чтобы быстрый жест не деформировал фигуру чрезмерно. */
function getImpulse(speed) {
  return Math.tanh(speed / 1.15);
}
