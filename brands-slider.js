document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.brands-slider')
  const prevBtn = document.querySelector('.brand-prev')
  const nextBtn = document.querySelector('.brand-next')
  if (!root || !prevBtn || !nextBtn) return
  const data = window.BRAND_LOGOS || []
  if (data.length === 0) return

  const viewport = document.createElement('div')
  viewport.className = 'brands-viewport'
  const track = document.createElement('div')
  track.className = 'brands-track'
  viewport.appendChild(track)
  root.appendChild(viewport)

  data.forEach(item => {
    const el = document.createElement('div')
    el.className = 'brand-item'
    const img = document.createElement('img')
    img.className = 'brand-img'
    img.src = item.image
    img.alt = item.name + ' logo'
    const name = document.createElement('div')
    name.className = 'brand-name'
    name.textContent = item.name
    el.appendChild(img)
    el.appendChild(name)
    track.appendChild(el)
  })

  let index = 0
  let cardWidth = 0
  let gap = 0
  let cardsPerView = 1
  let maxIndex = Math.max(0, data.length - cardsPerView)
  let timer
  let direction = 1

  function measure() {
    const first = track.children[0]
    if (!first) return
    const style = getComputedStyle(track)
    const gapStr = style.gap || '0px'
    gap = parseFloat(gapStr)
    if (Number.isNaN(gap)) gap = 0
    cardWidth = Math.round(first.getBoundingClientRect().width)
    const viewportWidth = Math.round(viewport.getBoundingClientRect().width)
    cardsPerView = Math.max(1, Math.floor((viewportWidth + gap) / (cardWidth + gap)))
    maxIndex = Math.max(0, data.length - cardsPerView)
    if (index > maxIndex) index = maxIndex
  }

  function render(skipTransition = false) {
    if (skipTransition) track.style.transition = 'none'
    const x = -(cardWidth + gap) * index
    track.style.transform = `translate3d(${x}px,0,0)`
    if (skipTransition) { track.offsetHeight; track.style.transition = '' }
    prevBtn.disabled = index <= 0
    nextBtn.disabled = index >= maxIndex
    prevBtn.setAttribute('aria-disabled', String(prevBtn.disabled))
    nextBtn.setAttribute('aria-disabled', String(nextBtn.disabled))
  }

  function next() {
    if (index < maxIndex) {
      index += 1
      render()
    }
  }

  function prev() {
    if (index > 0) {
      index -= 1
      render()
    }
  }

  function step() {
    if (maxIndex === 0) return
    if (index >= maxIndex) direction = -1
    else if (index <= 0) direction = 1
    index += direction
    render()
  }

  function reset() {
    clearInterval(timer)
    if (maxIndex > 0) {
      timer = setInterval(step, 5000)
    }
  }

  prevBtn.addEventListener('click', () => { prev(); reset() })
  nextBtn.addEventListener('click', () => { next(); reset() })

  root.addEventListener('mouseenter', () => clearInterval(timer))
  root.addEventListener('mouseleave', reset)

  measure()
  render(true)
  reset()

  window.addEventListener('resize', () => { measure(); render(true) })
})