document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.history-slider')
  const prevBtn = document.querySelector('.history-prev')
  const nextBtn = document.querySelector('.history-next')
  if (!root || !prevBtn || !nextBtn) return
  const data = window.HISTORY_CARDS || []
  if (data.length === 0) return

  const viewport = document.createElement('div')
  viewport.className = 'history-viewport'
  const track = document.createElement('div')
  track.className = 'history-track'
  viewport.appendChild(track)
  root.appendChild(viewport)

  data.forEach(item => {
    const card = document.createElement('div')
    card.className = 'history-card'
    const icon = document.createElement('div')
    icon.className = 'history-icon'
    const i = document.createElement('i')
    i.className = `fa-solid ${item.icon}`
    icon.appendChild(i)
    const h4 = document.createElement('h4')
    h4.textContent = item.period
    const p = document.createElement('p')
    p.textContent = item.text
    card.appendChild(icon)
    card.appendChild(h4)
    card.appendChild(p)
    track.appendChild(card)
  })

  function normalizeHeights() {
    let max = 0
    Array.from(track.children).forEach(el => {
      const h = el.getBoundingClientRect().height
      if (h > max) max = h
    })
    Array.from(track.children).forEach(el => {
      el.style.height = `${Math.round(max)}px`
    })
  }

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
    if (index >= maxIndex) direction = -1
    else if (index <= 0) direction = 1
    index += direction
    render()
  }

  function reset() {
    clearInterval(timer)
    timer = setInterval(step, 5000)
  }

  prevBtn.addEventListener('click', () => { prev(); reset() })
  nextBtn.addEventListener('click', () => { next(); reset() })

  root.addEventListener('mouseenter', () => clearInterval(timer))
  root.addEventListener('mouseleave', reset)

  measure()
  normalizeHeights()
  render(true)
  reset()

  window.addEventListener('resize', () => { measure(); normalizeHeights(); render(true) })
})