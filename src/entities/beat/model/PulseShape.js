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
    const dragY = rest.y - travel * pull
    const arrival = easeBetween(0, .93, merge)
    const x = mix(rest.x, heart.x, arrival)
    const y = mix(dragY, heart.y + 2, arrival)
    const pinch = easeBetween(.32, .95, merge)
    const width = mix(1, .04, pinch)
    const height = mix(1, .05, easeBetween(.6, 1, merge))

    // Линии доходят до входа первыми, кольца сужаются следом.
    this.#drawThreads(pull, merge, dragY, x, y, width)
    this.#center.setAttribute('transform',
      `translate(${x} ${y}) scale(${width} ${height}) translate(${-rest.x} ${-rest.y})`)
    this.#center.setAttribute('opacity', 1 - easeBetween(.93, 1, merge))

    const shape = Math.max(easeBetween(0, .58, pull), .77 * easeBetween(.05, .44, merge))
    const neck = easeBetween(.09, .55, merge) * (1 - .6 * pinch)
    for (const ring of this.#rings) {
      const points = ring.rest.map((value, index) => mix(value, ring.pull[index], shape))
      for (let i = 0; i < points.length; i += 2) {
        const tip = Math.max(0, Math.min(1, (ring.y - points[i + 1]) / 66))
        points[i] = mix(points[i], ring.x, neck * tip * .71)
        points[i + 1] -= neck * tip ** 2 * 43
      }

      const path = pull === 0 && merge === 0 ? ring.restPath : getCurve(points)
      for (const layer of ring.paths) layer.setAttribute('d', path)
    }
  }

  #drawThreads(pull, merge, dragY, x, y, width) {
    const reach = easeBetween(0, .34, merge)
    const retract = easeBetween(.53, 1, merge)
    const top = mix(Math.max(heart.y, dragY - 28 - 144 * pull ** .7), heart.y, reach)
    const bottom = mix(y + 16 * width, heart.y + 2, retract)
    const strength = Math.max(easeBetween(0, .36, pull), reach)
    this.#strands.setAttribute('opacity', strength * (1 - easeBetween(.88, 1, merge)))

    const flow = easeBetween(.13, .93, merge)
    const streamOpacity = .55 * easeBetween(.13, .4, merge) * (1 - easeBetween(.82, .99, merge))
    const count = this.#threads.length
    this.#threads.forEach(({ path, stream }, index) => {
      const offset = (2 * index) / (count - 1) - 1
      const wave = Math.sin(index * .71 + pull * 4 - merge * 12) * width
      const startX = mix(x, heart.x, reach) + offset * (6 + 8 * pull) * (1 - reach)
      const startY = top + (index % 5) * 3 * (1 - reach)
      const endX = x + offset * (19 + 12 * pull) * width
      const endY = bottom + (index % 4) * 3 * width
      const bend = x + offset * 9 * width + wave * 11
      const curve = `M${startX} ${startY} C${startX + wave * 5} ${mix(startY, endY, .28)} ${bend} ${mix(startY, endY, .67)} ${endX} ${endY}`

      path.setAttribute('d', curve)
      if (stream) {
        stream.setAttribute('d', curve)
        stream.setAttribute('opacity', streamOpacity)
        stream.setAttribute('stroke-dashoffset', mix(-92 + index * .2, -1, flow))
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

function getCurve(points) {
  const size = points.length
  const valueAt = (index) => points[(index + size) % size]
  const format = (value) => value.toFixed(2)
  let path = `M${format(points[0])} ${format(points[1])}`

  // Сглаживаем пары точек, сохраняя замкнутый контур SVG.
  for (let i = 0; i < size; i += 2) {
    const x = valueAt(i)
    const y = valueAt(i + 1)
    const nextX = valueAt(i + 2)
    const nextY = valueAt(i + 3)
    const firstX = x + (nextX - valueAt(i - 2)) / 6
    const firstY = y + (nextY - valueAt(i - 1)) / 6
    const lastX = nextX - (valueAt(i + 4) - x) / 6
    const lastY = nextY - (valueAt(i + 5) - y) / 6
    path += `C${[firstX, firstY, lastX, lastY, nextX, nextY].map(format).join(' ')}`
  }

  return path + 'Z'
}
