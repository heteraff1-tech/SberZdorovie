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

      const stream = copyEdge(path, 'pulse-stream')
      stream.setAttribute('pathLength', '100')
      this.#strands.append(stream)
      return { path, stream }
    })
  }

  draw(pull, merge, tension) {
    const arrival = easeBetween(0, .93, merge)
    const x = mix(rest.x, heart.x, arrival)
    const y = mix(rest.y - travel * pull, heart.y + 2, arrival)
    const width = mix(1, .04, easeBetween(.32, .95, merge))
    const height = mix(1, .05, easeBetween(.6, 1, merge))
    this.#center.setAttribute('transform',
      `translate(${x} ${y}) scale(${width} ${height}) translate(${-rest.x} ${-rest.y})`)
    this.#center.setAttribute('opacity', 1 - easeBetween(.93, 1, merge))

    const push = Math.max(0, tension)
    const recoil = Math.max(0, -tension)
    const depth = Math.min(1, .68 * easeBetween(0, .46, pull) + .85 * Math.abs(tension) +
      .3 * easeBetween(0, .45, merge)) * (1 - easeBetween(.6, .97, merge))
    const lift = Math.max(0, 133 * pull ** .8 + 132 * push - 47 * recoil +
      66 * easeBetween(.04, .48, merge)) * (1 - easeBetween(.6, .98, merge))
    const shape = Math.max(easeBetween(0, .62, pull), .77 * easeBetween(.05, .44, merge))
    const clearance = Math.max(0, (y - heart.y - 6) / height)
    const stretch = { shape, lift, clearance, depth, push, recoil, tension, pull }
    this.#center.style.setProperty('--rim-depth', depth)

    let tip = y
    for (const ring of this.#rings) {
      const rise = drawRing(ring, stretch)
      tip = Math.min(tip, y - rise * height)
    }

    this.#drawThreads({ pull, merge, x, y, width, tip, depth, tension })
  }

  #drawThreads({ pull, merge, x, y, width, tip, depth, tension }) {
    const reach = easeBetween(0, .34, merge)
    const retract = easeBetween(.53, 1, merge)
    const top = mix(Math.max(heart.y, tip - 7 - 12 * Math.max(0, tension)), heart.y, reach)
    const bottom = mix(y + (19 + depth * 8) * width, heart.y + 2, retract)
    const strength = Math.max(easeBetween(0, .34, pull), .65 * Math.max(0, tension), reach)
    this.#strands.setAttribute('opacity', strength * (1 - easeBetween(.88, 1, merge)))

    const flow = easeBetween(.13, .93, merge)
    const streamOpacity = .42 * easeBetween(.13, .4, merge) * (1 - easeBetween(.82, .99, merge))
    const count = this.#threads.length
    this.#threads.forEach(({ path, stream }, index) => {
      const offset = (2 * index) / (count - 1) - 1
      const wave = Math.sin(offset * 3.5 + pull * 2 - merge * 6) * width
      const neck = 1 - reach
      const startX = mix(x, heart.x, reach) + offset * (8 + 9 * depth) * neck
      const startY = top + (4 + 7 * Math.abs(offset)) * neck
      const endX = x + offset * (23 + 12 * depth) * width
      const endY = bottom - offset ** 2 * 13 * width
      const bend = x + offset * 16 * width + wave * (7 + 12 * depth) + tension * 8 * width
      const curve = `M${startX} ${startY} C${startX + wave * 5} ${mix(startY, endY, .31)} ${bend} ${mix(startY, endY, .72)} ${endX} ${endY}`

      path.setAttribute('d', curve)
      path.setAttribute('opacity', .12 + (1 - Math.abs(offset)) * .055 + depth * .12)
      if (stream) {
        stream.setAttribute('d', curve)
        stream.setAttribute('opacity', streamOpacity)
        stream.setAttribute('stroke-dashoffset', mix(-92 + index * .2, -1, flow))
      }
    })
  }
}

function getRing(group, index) {
  const paths = Array.from(group.querySelectorAll('path'))
  const original = paths.at(-1)
  const backGlow = copyEdge(original, 'pulse-rear pulse-rear-glow')
  const back = copyEdge(original, 'pulse-rear')
  paths[0].before(backGlow, back)

  const rim = copyEdge(original, 'pulse-rim')
  const glint = copyEdge(original, 'pulse-light')
  glint.setAttribute('pathLength', '100')
  original.after(rim, glint)

  const [x, y] = group.dataset.center.split(' ').map(Number)
  return {
    x,
    y,
    paths: [...paths, rim, glint],
    back,
    backGlow,
    rim,
    reach: index === 0 ? 1 : .9,
    restPath: original.getAttribute('d'),
    rest: group.dataset.rest.split(' ').map(Number),
    pull: group.dataset.pull.split(' ').map(Number),
  }
}

function copyEdge(path, className) {
  const edge = path.cloneNode()
  edge.removeAttribute('id')
  edge.setAttribute('class', className)
  return edge
}

function drawRing(ring, { shape, lift, clearance, depth, push, recoil, tension, pull }) {
  const { x, y, rest, paths, back, backGlow } = ring
  const front = rest.map((point, i) => mix(point, ring.pull[i], shape))
  const rear = []
  let radius = 1
  for (let i = 1; i < front.length; i += 2) radius = Math.max(radius, y - front[i])

  // Вытягиваем верх контура, оставляя нижнюю часть широкой и тяжёлой.
  const extension = Math.min(lift * ring.reach, Math.max(0, clearance - radius))
  const neck = Math.min(.79, extension / 145 + .1 * shape)
  let rise = radius
  for (let i = 0; i < front.length; i += 2) {
    const upper = Math.max(0, (y - front[i + 1]) / radius)
    const lower = Math.max(0, (front[i + 1] - y) / radius)
    const face = 1 - upper * .83
    const pitch = (4 + tension * 10) * depth * face

    front[i] = x + (front[i] - x) * (1 - neck * upper + lower * (.13 * recoil - .07 * push)) + pitch * .3
    front[i + 1] += lower ** 2 * (12 * pull + 12 * push - 9 * recoil) - extension * upper ** 1.65
    rise = Math.max(rise, y - front[i + 1])

    // Дальняя сторона смещается относительно ближней при натяжении и отдаче.
    rear.push(x + (front[i] - x) * (1 - depth * .09 * face) - pitch)
    rear.push(front[i + 1] - depth * (7 + 6 * lower) * face)
  }

  const path = shape || lift || depth ? getCurve(front) : ring.restPath
  for (const layer of paths) layer.setAttribute('d', path)
  ring.rim.setAttribute('opacity', depth * .67)
  back.setAttribute('opacity', depth * .61)
  backGlow.setAttribute('opacity', depth * .14)
  if (depth) {
    const rearPath = getCurve(rear)
    back.setAttribute('d', rearPath)
    backGlow.setAttribute('d', rearPath)
  }

  return rise
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
