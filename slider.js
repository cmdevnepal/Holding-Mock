document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.hero-slider')
  if (!slider) return
  const data = window.HERO_SLIDES || []
  const interval = Number(slider.dataset.interval || 6000)
  
  const originalSlides = data.map(item => {
    const slide = document.createElement('div')
    slide.className = 'hero-slide'
    const img = document.createElement('img')
    img.src = item.image
    img.alt = 'your slider image ' + item.title
    const box = document.createElement('div')
    box.className = 'hero-content'
    const h2 = document.createElement('h2')
    h2.textContent = item.title
    const a = document.createElement('a')
    a.className = 'hero-link'
    a.textContent = 'READ MORE'
    a.href = item.link || '#'
    box.appendChild(h2)
    box.appendChild(a)
    slide.appendChild(img)
    slide.appendChild(box)
    return slide
  })
  
  if (originalSlides.length === 0) return

  const track = document.createElement('div')
  track.className = 'hero-track'
  originalSlides.forEach(s => track.appendChild(s))

  const firstClone = originalSlides[0].cloneNode(true)
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true)
  track.insertBefore(lastClone, track.firstChild)
  track.appendChild(firstClone)
  slider.appendChild(track)

  const dots = document.createElement('div')
  dots.className = 'hero-dots'
  originalSlides.forEach((_, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = i === 0 ? 'dot active' : 'dot'
    b.setAttribute('aria-label', 'Slide ' + (i + 1))
    b.addEventListener('click', () => goTo(i))
    dots.appendChild(b)
  })
  slider.appendChild(dots)

  let index = 1
  let timer
  let isTransitioning = false // CRITICAL: Prevent race conditions

  let width = slider.clientWidth
  
  function render(skipTransition = false) {
    if (skipTransition) {
      track.style.transition = 'none'
    }
    track.style.transform = `translateX(${-index * width}px)`
    if (skipTransition) {
      // Force reflow properly
      track.offsetHeight
      track.style.transition = ''
    }
    const current = (index - 1 + originalSlides.length) % originalSlides.length
    Array.from(dots.children).forEach((d, i) => d.classList.toggle('active', i === current))
  }

  function goTo(i) {
    if (isTransitioning) return // Prevent double clicks
    index = i + 1
    render()
    reset()
  }

  function next() {
    if (isTransitioning) return // KEY FIX: Block rapid scrolling
    isTransitioning = true
    index += 1
    render()
  }

  function prev() {
    if (isTransitioning) return // KEY FIX: Block rapid scrolling
    isTransitioning = true
    index -= 1
    render()
  }

  track.addEventListener('transitionend', () => {
    // Handle infinite loop repositioning
    if (index === 0) {
      index = originalSlides.length
      render(true) // Skip transition
    } else if (index === originalSlides.length + 1) {
      index = 1
      render(true) // Skip transition
    }
    isTransitioning = false // KEY FIX: Re-enable scrolling
  })

  render()

  function reset() {
    clearInterval(timer)
    timer = setInterval(next, interval)
  }
  reset()

  // Debounce wheel events to prevent spam
  let wheelTimeout
  slider.addEventListener('wheel', e => {
    if (!e.shiftKey || isTransitioning) return
    e.preventDefault()
    
    // Clear previous wheel timeout
    clearTimeout(wheelTimeout)
    
    wheelTimeout = setTimeout(() => {
      const h = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (h < 0) prev()
      else next()
      reset()
    }, 50) // Debounce by 50ms
    
  }, { passive: false })

  window.addEventListener('resize', () => {
    width = slider.clientWidth
    render(true) // Skip transition on resize
  })
  
  // Pause on hover (accessibility)
  slider.addEventListener('mouseenter', () => clearInterval(timer))
  slider.addEventListener('mouseleave', reset)
})
