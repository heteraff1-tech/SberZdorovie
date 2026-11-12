import { easeBetween } from '@/shared/lib/easing'

const rest = { x: 62, y: 648 }
const heart = { x: 63.5, y: 354 }
const travel = 176
const TARGET_THREADS = 200

export class PulseShape {
  #center
  #rings
  #strands
  #frontStrands
  #threads

  constructor(svg) {
    this.#center = svg.querySelector('#pulse-center')
    this.#rings = Array.from(svg.querySelectorAll('[data-rest]'), getRing)
    this.#strands = svg.querySelector('#pulse-strands')

    // Создаем передний 3D-слой ПОВЕРХ сердца
    this.#frontStrands = this.#strands.cloneNode(false)
    this.#center.after(this.#frontStrands)

    this.#strands.style.mixBlendMode = 'screen'
    this.#frontStrands.style.mixBlendMode = 'screen'
    this.#strands.style.pointerEvents = 'none'
    this.#frontStrands.style.pointerEvents = 'none'

    const templatePaths = Array.from(this.#strands.querySelectorAll('path'))
    const backFrag = document.createDocumentFragment()
    const frontFrag = document.createDocumentFragment()
    const threads = new Array(TARGET_THREADS)
    const invCount = 2 / (TARGET_THREADS - 1)

    for (let i = 0; i < TARGET_THREADS; i++) {
      const path =
        i < templatePaths.length
          ? templatePaths[i]
          : templatePaths[i % templatePaths.length].cloneNode()

      const isFront = i % 2 === 1
      const container = isFront ? frontFrag : backFrag

      // Высокая яркость основных нитей (без белых пунктиров)
      path.setAttribute('stroke-opacity', isFront ? '0.95' : '0.8')
      container.append(path)

      // Потоки pulse-stream оставляем только для финального влета, не меняя их родной stroke-opacity
      let stream = null
      if (i % 10 === 2) {
        stream = path.cloneNode()
        stream.setAttribute('class', 'pulse-stream')
        stream.setAttribute('pathLength', '100')
        stream.setAttribute('opacity', '0')
        container.append(stream)
      }

      // Предрасчет тригонометрии для высокого FPS
      const offset = i * invCount - 1
      const absOffset = offset < 0 ? -offset : offset
      const layerSign = isFront ? 1 : -1

      const theta = offset * (Math.PI * 0.5)
      const endAngle = theta * 0.54
      const mainDome = Math.cos(offset * Math.PI * 0.48) ** 1.4

      const pOrb = i * 0.05
      const pBelly = i * 0.06
      const pTongue1 = offset * Math.PI * 3.5 + layerSign * 0.6
      const pTongue2 = offset * Math.PI * 6.0
      const pSway = -absOffset * 3.2 + (i % 7) * 0.25 + layerSign * 0.5
      const pCtrl1 = offset * 2.5 * layerSign

      threads[i] = {
        path,
        stream,
        isFront,
        layerSign,
        offset,
        absOffset,
        sinT: Math.sin(theta),
        cosT: Math.cos(theta),
        endSin: Math.sin(endAngle) * 0.58,
        endCos: Math.cos(endAngle),
        invDome: 1 - mainDome,
        flickerWeight: 1 - absOffset * 0.5,
        bellyScale: isFront ? 1.42 : 1.28,
        dashStart: -92 + (i % 16) * 0.25,
        sinOrb: Math.sin(pOrb),
        cosOrb: Math.cos(pOrb),
        sinBelly: Math.sin(pBelly),
        cosBelly: Math.cos(pBelly),
        sinT1: Math.sin(pTongue1),
        cosT1: Math.cos(pTongue1),
        sinT2: Math.sin(pTongue2),
        cosT2: Math.cos(pTongue2),
        sinSway: Math.sin(pSway),
        cosSway: Math.cos(pSway),
        sinC1: Math.sin(pCtrl1),
        cosC1: Math.cos(pCtrl1),
      }
    }

    this.#strands.append(backFrag)
    this.#frontStrands.append(frontFrag)
    this.#threads = threads
  }

  draw(rawPull, rawMerge) {
    const pull = Math.max(0, rawPull)
    const merge = Math.max(0, rawMerge)

    // Фаза зависит строго от жеста (pull и merge) — никакого дерганья от таймера
    const flowPhase = pull * 5.5 + merge * 16

    const dragY = rest.y - travel * pull

    // Мгновенный подхват при отпускании пальца
    const rawArrival = easeBetween(0, 0.86, merge)
    const arrival = 1 - (1 - rawArrival) ** 1.85

    const x = mix(rest.x, heart.x, arrival)
    const y = mix(dragY, heart.y + 2, arrival)

    const pinch = easeBetween(0.02, 0.85, merge)
    const width = mix(1, 0.04, pinch)
    const height = mix(1, 0.05, easeBetween(0.12, 0.9, merge))

    // 1. Отрисовка 3D-нитей вокруг сердца
    this.#drawThreads(pull, merge, arrival, dragY, x, y, width, flowPhase)

    this.#center.setAttribute(
      'transform',
      `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${width.toFixed(3)} ${height.toFixed(3)}) translate(${-rest.x} ${-rest.y})`
    )
    this.#center.setAttribute('opacity', (1 - easeBetween(0.86, 1, merge)).toFixed(3))

    // 2. Кольца: плавно тянутся и растворяются
    const shape = Math.max(easeBetween(0, 0.58, pull), 0.77 * easeBetween(0, 0.35, merge))
    const neck = Math.max(
      easeBetween(0.05, 0.5, pull) * 0.45,
      easeBetween(0, 0.45, merge) * (1 - 0.6 * pinch)
    )

    const ringCount = this.#rings.length
    for (let r = 0; r < ringCount; r++) {
      const ring = this.#rings[r]
      const layerLag = ringCount > 1 ? r / (ringCount - 1) : 0

      const fadePull = 1 - easeBetween(0.08, 0.75 - layerLag * 0.12, pull)
      const fadeMerge = 1 - easeBetween(0, 0.22, merge)
      const ringOpacity = fadePull * fadeMerge

      ring.element.setAttribute('opacity', ringOpacity.toFixed(3))
      if (ringOpacity <= 0.002) continue

      const points = ring.rest.map((value, index) => mix(value, ring.pull[index], shape))
      for (let i = 0; i < points.length; i += 2) {
        const tip = Math.max(0, Math.min(1, (ring.y - points[i + 1]) / 66))
        points[i] = mix(points[i], ring.x, neck * tip * 0.71)
        points[i + 1] -= neck * tip ** 2 * 43
      }

      const path = pull === 0 && merge === 0 ? ring.restPath : getCurve(points)
      for (const layer of ring.paths) layer.setAttribute('d', path)
    }
  }

  #drawThreads(pull, merge, arrival, dragY, x, y, width, flowPhase) {
    const reach = 1 - (1 - easeBetween(0, 0.24, merge)) ** 1.6
    const retract = easeBetween(0.04, 0.88, merge) ** 1.15
    const whip = Math.sin(arrival * Math.PI)

    const topCenterY = mix(
      Math.max(heart.y, dragY - 28 - 150 * pull ** 0.72),
      heart.y,
      Math.max(reach, (pull ** 1.5) * 0.45)
    )

    const bowlCenterY = mix(y + 4 * width, heart.y + 2, retract)
    const bowlRadiusX = (26 + 11 * pull - 5 * whip) * width
    const bowlRadiusY = (25 + 6 * pull - 4 * whip) * width * (1 - retract * 0.9)

    // Яркое свечение самих нитей с начала свайпа
    const appear = Math.max(easeBetween(0, 0.12, pull), reach)
    const ignition = 0.85 + 0.15 * pull
    const mergeFade = 1 - easeBetween(0.84, 0.99, merge)

    this.#strands.setAttribute('opacity', (0.95 * appear * ignition * mergeFade).toFixed(3))
    this.#frontStrands.setAttribute('opacity', (1.0 * appear * ignition * mergeFade).toFixed(3))

    // Потоки pulse-stream выключены во время pull (0), чтобы не было белых полосок над сердцем
    const showStreams = merge > 0.05
    const flow = showStreams ? easeBetween(0.08, 0.9, merge) : 0
    const streamOpacity = showStreams
      ? (0.35 * easeBetween(0.08, 0.35, merge) * (1 - easeBetween(0.8, 0.98, merge))).toFixed(3)
      : '0'

    const sOrbT = Math.sin(flowPhase * 0.85)
    const cOrbT = Math.cos(flowPhase * 0.85)
    const sBellyT = Math.sin(flowPhase * 1.15)
    const cBellyT = Math.cos(flowPhase * 1.15)
    const sT1 = Math.sin(flowPhase * 0.9)
    const cT1 = Math.cos(flowPhase * 0.9)
    const sT2 = Math.sin(flowPhase * 1.3)
    const cT2 = Math.cos(flowPhase * 1.3)
    const sSw = Math.sin(flowPhase * 1.4)
    const cSw = Math.cos(flowPhase * 1.4)
    const sC1 = Math.sin(flowPhase * 1.35)
    const cC1 = Math.cos(flowPhase * 1.35)

    const baseStartX = mix(x, heart.x, Math.max(reach, pull * 0.4))
    const invReach = 1 - reach
    const topReachFade = 1 - reach * 0.95
    const dropScale = (40 + 26 * pull) * (1 - reach * 0.92)
    const flickerScale = (12 + 16 * pull) * invReach
    const swayAmp = (5 + 9 * pull + 10 * whip) * width * (1 - reach * 0.85)
    const ctrl1SwayAmp = (8 + 13 * pull + 15 * whip) * width
    const waistMix = 0.5 - 0.15 * pull
    const ctrl1YMix = 0.42 - 0.1 * reach
    const perspScale = 6.5 * width * (1 - retract)
    const swirlScale = (7 + 9 * pull) * width

    const threads = this.#threads
    const count = threads.length

    for (let i = 0; i < count; i++) {
      const t = threads[i]

      const orbitShift = (t.sinOrb * cOrbT + t.cosOrb * sOrbT) * 0.32 * t.layerSign
      const sinT = t.sinT + t.cosT * orbitShift
      const cosT = t.cosT - t.sinT * orbitShift

      const perspectiveY = t.layerSign * cosT * perspScale

      // Нижний 3D-полукруг
      const endSin = t.endSin + t.endCos * orbitShift * 0.3
      const endCos = t.endCos - t.endSin * orbitShift * 0.3
      const endX = x + endSin * bowlRadiusX
      const endY = bowlCenterY + endCos * bowlRadiusY + perspectiveY * 0.6

      // Широкая 3D-чаша вокруг сердца
      const swirl3D = cosT * swirlScale * t.layerSign
      const bellyWave = (t.sinBelly * cBellyT - t.cosBelly * sBellyT) * 2.5 * width
      const ctrl2X = x + sinT * bowlRadiusX * t.bellyScale + bellyWave + swirl3D
      const ctrl2Y = bowlCenterY + cosT * bowlRadiusY * 0.44 + perspectiveY

      // Верхняя часть — языки костра
      const tongue1 = t.sinT1 * cT1 - t.cosT1 * sT1
      const tongue2 = t.cosT2 * cT2 - t.sinT2 * sT2
      const flameTongues = 0.5 + 0.3 * tongue1 + 0.2 * tongue2

      const startY = topCenterY + t.invDome * dropScale - flameTongues * flickerScale * t.flickerWeight
      const fireSway = (t.sinSway * cSw + t.cosSway * sSw) * swayAmp
      const topSpread = (5 + 8 * t.invDome * (1 - pull * 0.35)) * topReachFade
      const startX = baseStartX + t.offset * topSpread + fireSway

      // Перекрестный 3D-изгиб в талии костра
      const ctrl1Sway = (t.cosC1 * cC1 - t.sinC1 * sC1) * ctrl1SwayAmp
      const ctrl1X =
        mix(startX, ctrl2X, waistMix) - t.offset * 7 * width * invReach + ctrl1Sway - swirl3D * 0.65
      const ctrl1Y = mix(startY, ctrl2Y, ctrl1YMix)

      const curve = `M${startX.toFixed(2)} ${startY.toFixed(2)} C${ctrl1X.toFixed(2)} ${ctrl1Y.toFixed(2)} ${ctrl2X.toFixed(2)} ${ctrl2Y.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`

      t.path.setAttribute('d', curve)
      if (t.stream) {
        if (showStreams) {
          t.stream.setAttribute('d', curve)
          t.stream.setAttribute('opacity', streamOpacity)
          t.stream.setAttribute('stroke-dashoffset', mix(t.dashStart, -1, flow).toFixed(2))
        } else {
          t.stream.setAttribute('opacity', '0')
        }
      }
    }
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
    element: ring,
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