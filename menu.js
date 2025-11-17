const header = document.querySelector('.site-header')
const burger = document.querySelector('.burger')
const megaWho = document.getElementById('mega-who')
const megaWhat = document.getElementById('mega-what')

function setHeaderSolid(on) {
  header.classList.toggle('solid', !!on)
}

function openMega(panel) {
  megaWho.classList.remove('open')
  megaWhat.classList.remove('open')
  if (panel === 'who') megaWho.classList.add('open')
  if (panel === 'what') megaWhat.classList.add('open')
  const isWhat = panel === 'what'
  burger.classList.toggle('open', isWhat)
  burger.setAttribute('aria-expanded', String(isWhat))
  setHeaderSolid(true)
  document.querySelectorAll('.nav-item.has-mega .nav-link').forEach(l => l.classList.remove('active'))
  const activeBtn = document.querySelector(`.nav-item.has-mega[data-panel="${panel}"] .nav-link`)
  if (activeBtn) activeBtn.classList.add('active')
}

function closeMega() {
  megaWho.classList.remove('open')
  megaWhat.classList.remove('open')
  burger.classList.remove('open')
  burger.setAttribute('aria-expanded', 'false')
  setHeaderSolid(false)
  document.querySelectorAll('.nav-item.has-mega .nav-link').forEach(l => l.classList.remove('active'))
}

document.querySelectorAll('.nav-item.has-mega .nav-link').forEach(btn => {
  const panel = btn.parentElement.dataset.panel
  btn.addEventListener('mouseenter', () => {
    if (window.matchMedia('(pointer:fine)').matches) openMega(panel)
  })
  btn.addEventListener('focusin', () => openMega(panel))
  btn.addEventListener('click', e => {
    e.preventDefault()
    openMega(panel)
  })
})

header.addEventListener('mouseleave', () => {
  if (window.matchMedia('(pointer:fine)').matches) closeMega()
})

burger.addEventListener('click', () => {
  if (megaWhat.classList.contains('open')) closeMega()
  else openMega('what')
})

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMega()
})

document.addEventListener('click', e => {
  if (!header.contains(e.target)) closeMega()
})
