const pullPoint = .34
const landing = { x: 63.5, y: 354 }

export class PulseShape {
  #body
  #heart
  #core
  #glow
  #strands
  #rings
  #lastPull

  constructor(svg) {
    this.#body = svg.querySelector('#pulse-body')
    this.#heart = svg.querySelector('#pulse-heart')
    this.#core = svg.querySelector('#pulse-core')
    this.#glow = svg.querySelector('#pulse-glow')
    this.#strands = svg.querySelector('#pulse-strands')
    this.#rings = Array.from(svg.querySelectorAll('[data-rest]'), (ring) => {
      const paths = Array.from(ring.querySelectorAll('path'))
      if (ring.dataset.kind !== 'core') {
        const edge = paths.at(-1).cloneNode()
        edge.removeAttribute('id')
        edge.setAttribute('class', 'pulse-light')
        edge.setAttribute('pathLength', '100')
        paths.at(-1).after(edge)
        paths.push(edge)
      }

      const keys = ['rest', 'pull', 'drop']
      return {
        paths,
        restPath: paths[0].getAttribute('d'),
        points: keys.map((key) => ring.dataset[key].split(' ').map(Number)),
      }
    })
  }

  draw(pull, merge) {
    const pullStage = Math.min(pull / pullPoint, 1)
    const dropStage = Math.max((pull - pullPoint) / (1 - pullPoint), 0)
    const pin = 648 - 4 * pullStage - 20 * dropStage

    // Контуры, нити и ядро сходятся в одну точку внутри логотипа.
    const scale = 1 - merge * .985
    this.#body.setAttribute('transform',
      `translate(${landing.x} ${landing.y}) scale(${scale}) translate(${-landing.x} ${-landing.y})`)
    this.#body.setAttribute('opacity', Math.min(1, (1 - merge) * 6))
    if (this.#lastPull === pull) return
    this.#lastPull = pull

    this.#core.setAttribute('opacity', 1 - .67 * dropStage)
    this.#heart.setAttribute('transform',
      `translate(62 ${pin}) scale(${1 + .23 * dropStage}) translate(-62 -648)`)
    this.#glow.setAttribute('transform', `translate(2.48 ${591.872 + pin - 648})`)

    const stretch = .145 * pullStage + .255 * dropStage
    this.#strands.setAttribute('transform', `translate(62 ${pin + 5}) scale(.62 ${Math.max(stretch, .001)}) translate(-106 -681)`)
    this.#strands.setAttribute('opacity', pullStage * (.66 + .34 * dropStage))

    for (const ring of this.#rings) {
      const [rest, pulled, drop] = ring.points
      const points = pull <= pullPoint
        ? mixPoints(rest, pulled, pullStage)
        : mixPoints(pulled, drop, dropStage)
      const path = pull === 0 ? ring.restPath : getCurve(points)
      for (const layer of ring.paths) layer.setAttribute('d', path)
    }
  }
}

function mixPoints(from, to, progress) {
  return from.map((value, index) => value + (to[index] - value) * progress)
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
