import { easeBetween } from '@/shared/lib/easing'

const rest = { x: 62, y: 648 }
const heart = { x: 63.5, y: 354 }
const travel = 176

export class PulseShape {
  #center
  #rings
  #strands
  #threads

  constructor(svg) {
    this.#center = svg.querySelector('#pulse-center')
    this.#rings = Array.from(svg.querySelectorAll('[data-rest]'), getRing)
    this.#strands = svg.querySelector('#pulse-strands')
    this.#threads = Array.from(this.#strands.querySelectorAll('path'), (path, index) => {
      if (index % 6 !== 2) return { path }

      const stream = path.cloneNode()
      stream.setAttribute('class', 'pulse-stream')
      stream.setAttribute('pathLength', '100')
      this.#strands.append(stream)
      return { path, stream }
    })
  }

  draw(pull, merge) {
    // 1. Нелинейный свайп: мягкий старт с нарастающим магнитным притяжением к точке входа
    const magneticPull = pull * (0.65 + 0.35 * pull * pull)
    const dragY = rest.y - travel * magneticPull

    // 2. Пружинный импульс (coil -> launch):
    // В начале merge ядро чуть приседает/группируется, накапливая энергию, и затем выстреливает вверх
    const coil = Math.sin(easeBetween(0, 0.28, merge) * Math.PI) * (1 - easeBetween(0.2, 0.5, merge))
    const launch = easeBetween(0.08, 0.92, merge) ** 1.35
    const whipWave = Math.sin(launch * Math.PI)

    const x = mix(rest.x, heart.x, easeBetween(0, 0.9, merge))
    const y = mix(dragY + coil * 18, heart.y + 2, launch)

    // Эластичное сжатие ядра (squash & stretch при старте и полете)
    const pinch = easeBetween(0.28, 0.95, merge)
    const stretchY = 1 + 0.18 * whipWave - 0.08 * coil
    const squashX = 1 - 0.12 * whipWave + 0.06 * coil
    const width = mix(1, 0.04, pinch) * squashX
    const height = mix(1, 0.05, easeBetween(0.58, 1, merge)) * stretchY

    // Сначала рисуем объемные нити, затем ядро и кольца
    this.#drawThreads(pull, merge, dragY, x, y, width, whipWave, coil)

    this.#center.setAttribute(
      'transform',
      `translate(${x} ${y}) scale(${width} ${height}) translate(${-rest.x} ${-rest.y})`
    )
    this.#center.setAttribute('opacity', 1 - easeBetween(0.92, 1, merge))

    // 3. Объемная физика колец с послойной инерцией
    const ringCount = this.#rings.length
    for (let r = 0; r < ringCount; r++) {
      const ring = this.#rings[r]
      // Фазовый сдвиг между кольцами: внешние и внутренние слои реагируют с микро-задержкой, создавая объем
      const layerLag = ringCount > 1 ? r / (ringCount - 1) : 0
      const ringPull = Math.max(0, Math.min(1, pull * (1.08 - layerLag * 0.16)))
      const ringMerge = Math.max(0, Math.min(1, (merge - layerLag * 0.045) / (1 - layerLag * 0.045)))

      const shape = Math.max(
        easeBetween(0, 0.65, ringPull),
        0.85 * easeBetween(0.02, 0.48, ringMerge)
      )

      // Натяжение «носика» к логотипу (начинает тянуться еще на свайпе и выстреливает при merge)
      const pullTension = easeBetween(0.35, 1, ringPull) * 0.42
      const mergeNeck = easeBetween(0.02, 0.58, ringMerge) * (1 - 0.55 * easeBetween(0.35, 0.96, ringMerge))
      const neck = Math.max(pullTension * (1 - ringMerge), mergeNeck)

      // Догоняющий импульс для нижней части капли («хвоста»), чтобы она влетала как пружина
      const tailSnap = easeBetween(0.18, 0.88, ringMerge) ** 1.6
      const springRipple = Math.sin((ringPull * 2.2 + ringMerge * 5.5 - layerLag * 0.9) * Math.PI)

      const points = ring.rest.map((value, index) => mix(value, ring.pull[index], shape))

      for (let i = 0; i < points.length; i += 2) {
        const px = points[i]
        const py = points[i + 1]
        const dy = ring.y - py // > 0 — верхняя часть (носик), < 0 — нижняя часть (дно капли)

        const tip = Math.max(0, Math.min(1, dy / 68))
        const belly = Math.max(0, 1 - Math.abs(dy) / 56)
        const bottom = Math.max(0, Math.min(1, -dy / 60))

        // Плавная колоколообразная кривая для острия вместо жесткого излома
        const smoothTip = tip * tip * (3 - 2 * tip)

        // Втягивание носика к центральной оси + легкое «дыхание» в средней части для объема
        const neckPinch = neck * smoothTip * 0.78
        const volumeSwell = belly * (0.08 * ringPull + 0.06 * coil - 0.14 * whipWave)
        points[i] = mix(px, ring.x, Math.max(0, neckPinch - volumeSwell))

        // Вертикальная физика:
        // - носик тянется к логотипу с эффектом магнита
        // - при свайпе дно чуть сопротивляется (натягивая пружину), а при merge хлестко подлетает к heart.y
        const tipStretch = neck * (smoothTip ** 1.6) * (48 + 18 * whipWave)
        const bottomLag = bottom * (ringPull * 14 * (1 - ringMerge) + coil * 12)
        const waveOffset = belly * springRipple * (3.5 * ringPull + 6 * whipWave) * (1 - pinch)

        let nextY = py - tipStretch + bottomLag + waveOffset
        nextY = mix(nextY, heart.y + 4, tailSnap * (0.35 + 0.65 * bottom))

        // При финальном влете стягиваем все кольцо точно в точку входа
        points[i] = mix(points[i], heart.x, tailSnap * 0.85)
        points[i + 1] = nextY
      }

      const path = pull === 0 && merge === 0 ? ring.restPath : getCurve(points, 5.4)
      for (const layer of ring.paths) layer.setAttribute('d', path)
    }
  }

  #drawThreads(pull, merge, dragY, x, y, width, whipWave, coil) {
    const reach = easeBetween(0, 0.36, merge)
    const retract = easeBetween(0.48, 1, merge) ** 1.25

    // Плавный выход верхушки нитей к точке логотипа без резких скачков
    const pullReach = (pull ** 0.85) * 148
    const top = mix(Math.max(heart.y, dragY - 24 - pullReach), heart.y, reach)
    const bottom = mix(y + 18 * width + coil * 10, heart.y + 2, retract)

    const strength = Math.max(easeBetween(0, 0.32, pull), reach)
    this.#strands.setAttribute('opacity', strength * (1 - easeBetween(0.88, 1, merge)))

    const flow = easeBetween(0.1, 0.92, merge)
    const streamOpacity = 0.65 * easeBetween(0.1, 0.38, merge) * (1 - easeBetween(0.82, 0.99, merge))
    const count = this.#threads.length

    this.#threads.forEach(({ path, stream }, index) => {
      const offset = (2 * index) / (count - 1) - 1 // от -1 (край) до 1 (край)
      const absOffset = Math.abs(offset)

      // Параболический купол (dome): крайние нити ниже центральных, чтобы не торчать углами из капли
      const domeArch = (1 - absOffset ** 1.8)
      const phase = index * 0.55 + pull * 4.5 - merge * 14
      const wave = Math.sin(phase) * width

      // Верхняя точка собирается в мягкий фокус у носика
      const topSpread = (4 + 6 * pull) * (1 - reach * 0.92)
      const startX = mix(x, heart.x, reach) + offset * topSpread
      const startY = top + (1 - domeArch) * 26 * (1 - reach) + (index % 3) * 1.5 * (1 - reach)

      // Нижняя точка огибает дно капли полукругом, создавая 3D-кокон вокруг сердечка
      const endSpread = (20 + 14 * pull - 6 * whipWave) * width
      const endX = x + offset * endSpread
      const endY = bottom - (1 - domeArch) * 8 * width + (index % 4) * 2 * width

      // Контрольные точки Безье создают объемное «брюшко» внизу и упругую S-волну при слиянии
      const upperNeckX = mix(startX, x, 0.25) + offset * 4 * width * (1 - reach) + wave * (4 + 6 * whipWave)
      const lowerBellyX = x + offset * (28 + 18 * pull) * width * (1 - 0.4 * whipWave) - wave * 9

      const ctrl1Y = mix(startY, endY, 0.32 - 0.08 * reach)
      const ctrl2Y = mix(startY, endY, 0.68 + 0.07 * pull)

      const curve = `M${startX.toFixed(2)} ${startY.toFixed(2)} C${upperNeckX.toFixed(2)} ${ctrl1Y.toFixed(2)} ${lowerBellyX.toFixed(2)} ${ctrl2Y.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`

      path.setAttribute('d', curve)
      if (stream) {
        stream.setAttribute('d', curve)
        stream.setAttribute('opacity', streamOpacity)
        stream.setAttribute('stroke-dashoffset', mix(-92 + index * 0.2, -1, flow))
      }
    })
  }
}

function getRing(ring) {
  const paths = Array.from(ring.querySelectorAll('path'))
  const edge = paths.at(-1).cloneNode()
  edge.removeAttribute('id')
  edge.setAttribute('class', 'pulse-light')
  edge.setAttribute('pathLength', '100')
  paths.at(-1).after(edge)
  paths.push(edge)

  const [x, y] = ring.dataset.center.split(' ').map(Number)
  return {
    x,
    y,
    paths,
    restPath: paths[0].getAttribute('d'),
    rest: ring.dataset.rest.split(' ').map(Number),
    pull: ring.dataset.pull.split(' ').map(Number),
  }
}

function mix(from, to, progress) {
  return from + (to - from) * progress
}

function getCurve(points, tension = 6) {
  const size = points.length
  const valueAt = (index) => points[(index + size) % size]
  const format = (value) => value.toFixed(2)
  let path = `M${format(points[0])} ${format(points[1])}`

  // Сглаживаем пары точек с чуть более мягким натяжением (tension = 5.4), чтобы убрать угловатость
  for (let i = 0; i < size; i += 2) {
    const x = valueAt(i)
    const y = valueAt(i + 1)
    const nextX = valueAt(i + 2)
    const nextY = valueAt(i + 3)
    const firstX = x + (nextX - valueAt(i - 2)) / tension
    const firstY = y + (nextY - valueAt(i - 1)) / tension
    const lastX = nextX - (valueAt(i + 4) - x) / tension
    const lastY = nextY - (valueAt(i + 5) - y) / tension
    path += `C${[firstX, firstY, lastX, lastY, nextX, nextY].map(format).join(' ')}`
  }

  return path + 'Z'
}
