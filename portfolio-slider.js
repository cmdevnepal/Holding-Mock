document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.portfolio-slider')
  const tabs = document.querySelectorAll('.portfolio-tabs a[role="tab"]')
  if (!slider) return
  const data = window.PORTFOLIO_SLIDES || []
  if (data.length === 0) return

  const slides = data.map(item => {
    const slide = document.createElement('div')
    slide.className = 'hero-slide'
    slide.dataset.id = item.id
    const img = document.createElement('img')
    img.src = item.image
    img.alt = item.title + ' image'
    const box = document.createElement('div')
    box.className = 'hero-content'
    const h2 = document.createElement('h2')
    h2.textContent = item.title
    const p = document.createElement('p')
    p.textContent = item.description || ''
    const a = document.createElement('a')
    a.className = 'hero-link'
    a.textContent = 'READ MORE'
    a.href = item.link || '#'
    box.appendChild(h2)
    box.appendChild(p)
    box.appendChild(a)
    slide.appendChild(img)
    slide.appendChild(box)
    return slide
  })

  const track = document.createElement('div')
  track.className = 'hero-track'
  slides.forEach(s => track.appendChild(s))

  const firstClone = slides[0].cloneNode(true)
  const lastClone = slides[slides.length - 1].cloneNode(true)
  track.insertBefore(lastClone, track.firstChild)
  track.appendChild(firstClone)
  slider.appendChild(track)

  let index = 1
  let timer
  let isTransitioning = false
  let width = Math.round(slider.getBoundingClientRect().width)

  function render(skipTransition = false) {
    width = Math.round(slider.getBoundingClientRect().width)
    if (skipTransition) track.style.transition = 'none'
    track.style.transform = `translate3d(${-index * width}px,0,0)`
    if (skipTransition) { track.offsetHeight; track.style.transition = '' }
    const current = (index - 1 + slides.length) % slides.length
    tabs.forEach(t => {
      const id = t.getAttribute('href').slice(1)
      const isActive = data[current].id === id
      t.classList.toggle('active', isActive)
      t.setAttribute('aria-selected', String(isActive))
    })
  }

  function goTo(i) {
    if (isTransitioning) return
    index = i + 1
    render()
    reset()
  }

  function next() {
    if (isTransitioning) return
    isTransitioning = true
    index += 1
    render()
  }

  function prev() {
    if (isTransitioning) return
    isTransitioning = true
    index -= 1
    render()
  }

  track.addEventListener('transitionend', () => {
    if (index === 0) { index = slides.length; render(true) }
    else if (index === slides.length + 1) { index = 1; render(true) }
    isTransitioning = false
  })

  tabs.forEach((t, i) => {
    t.addEventListener('click', e => {
      e.preventDefault()
      goTo(i)
    })
  })

  let wheelTimeout
  slider.addEventListener('wheel', e => {
    if (!e.shiftKey || isTransitioning) return
    e.preventDefault()
    clearTimeout(wheelTimeout)
    wheelTimeout = setTimeout(() => {
      const h = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (h < 0) prev(); else next(); reset()
    }, 50)
  }, { passive: false })

  function reset() {
    clearInterval(timer)
    timer = setInterval(next, 8000)
  }

  requestAnimationFrame(() => render())
  reset()

  window.addEventListener('resize', () => {
    width = slider.clientWidth
    render(true)
  })

  slider.addEventListener('mouseenter', () => clearInterval(timer))
  slider.addEventListener('mouseleave', reset)
})