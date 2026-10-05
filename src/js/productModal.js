

import { formatPrice } from './utils.js'
import { lockScroll, unlockScroll } from './scrollLock.js'
import { productFor } from './catalog.js'

const SIZE_INPUT = 'product-size'
const ADDITIVE_INPUT = 'product-additive'

const FALLBACK_DURATION_MS = 300
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function closeDuration() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-duration')
    .trim()

  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value)) return FALLBACK_DURATION_MS

  return raw.endsWith('ms') ? value : value * 1000
}

function sizeChoices(product) {
  return Object.entries(product.sizes).map(([key, size]) => ({
    value: key,
    label: size.size,
    icon: key.toUpperCase(),
    addPrice: Number(size['add-price']),
  }))
}

function additiveChoices(product) {
  return product.additives.map((additive, index) => ({
    value: String(index),
    label: additive.name,

    icon: String(index + 1),
    addPrice: Number(additive['add-price']),
  }))
}

function createOption({ value, label, icon }, inputName, type, checked) {
  const option = document.createElement('label')
  option.className = 'product-modal__option'

  const input = document.createElement('input')
  input.type = type
  input.name = inputName
  input.value = value
  input.className = 'visually-hidden product-modal__option-input'
  input.checked = checked

  const chip = document.createElement('span')
  chip.className = 'product-modal__option-icon'
  chip.setAttribute('aria-hidden', 'true')
  chip.textContent = icon

  const text = document.createElement('span')
  text.className = 'product-modal__option-label'
  text.textContent = label

  option.append(input, chip, text)

  return option
}

export function initProductModal() {
  const backdrop = document.querySelector('[data-product-modal]')
  const grid = document.querySelector('.menu__grid')

  if (!backdrop || !grid) return

  const dialog = backdrop.querySelector('.product-modal')
  const image = backdrop.querySelector('[data-modal-image]')
  const name = backdrop.querySelector('[data-modal-name]')
  const description = backdrop.querySelector('[data-modal-description]')
  const sizesBox = backdrop.querySelector('[data-modal-sizes]')
  const additivesBox = backdrop.querySelector('[data-modal-additives]')
  const totalBox = backdrop.querySelector('[data-modal-total]')
  const closeButton = backdrop.querySelector('[data-modal-close]')

  let product = null

  let opener = null
  let hideTimer = 0

  function updateTotal() {
    if (!product) return

    let total = Number(product.price)

    const chosenSize = dialog.querySelector(`input[name="${SIZE_INPUT}"]:checked`)
    if (chosenSize) {
      total += Number(product.sizes[chosenSize.value]['add-price'])
    }

    for (const chosen of dialog.querySelectorAll(`input[name="${ADDITIVE_INPUT}"]:checked`)) {
      total += Number(product.additives[Number(chosen.value)]['add-price'])
    }

    totalBox.textContent = formatPrice(total)
  }

  function setBackgroundInert(inert) {
    for (const region of document.querySelectorAll('header[id="site-header"], main, footer')) {
      region.toggleAttribute('inert', inert)
    }
  }

  function open(nextProduct, trigger) {
    product = nextProduct
    opener = trigger

    window.clearTimeout(hideTimer)
    setBackgroundInert(true)

    image.src = trigger.querySelector('img').src
    name.textContent = nextProduct.name
    description.textContent = nextProduct.description

    const sizes = sizeChoices(nextProduct)
    const defaultSize = sizes.find((size) => size.addPrice === 0) ?? sizes[0]
    const additives = additiveChoices(nextProduct)

    sizesBox.replaceChildren(
      ...sizes.map((size) => createOption(size, SIZE_INPUT, 'radio', size === defaultSize)),
    )
    additivesBox.replaceChildren(
      ...additives.map((additive) => createOption(additive, ADDITIVE_INPUT, 'checkbox', false)),
    )

    updateTotal()

    backdrop.hidden = false

    window.requestAnimationFrame(() => backdrop.classList.add('is-open'))

    lockScroll()
    closeButton.focus()
  }

  function close() {
    if (!product) return
    product = null

    backdrop.classList.remove('is-open')
    unlockScroll()
    setBackgroundInert(false)
    opener?.focus()

    if (reduceMotion.matches) {
      backdrop.hidden = true
      return
    }

    hideTimer = window.setTimeout(() => {
      if (!product) backdrop.hidden = true
    }, closeDuration())
  }

  function focusableElements() {
    return [
      ...dialog.querySelectorAll('input:not([disabled]), button:not([disabled])'),
    ]
  }

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card')
    if (!card) return

    const selected = productFor(card)
    if (!selected) return

    open(selected, card.querySelector('.product-card__trigger'))
  })

  closeButton.addEventListener('click', close)

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close()
  })

  document.addEventListener('keydown', (event) => {
    if (!product) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = focusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })

  backdrop.addEventListener('change', updateTotal)
}
