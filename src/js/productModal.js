/**
 * Product modal — the dialog, its two option groups, and the live total.
 *
 * The dialog is built from the *same* product object the clicked card was built
 * from (see `productFor` in catalog.js), so a card and its dialog can never
 * show different data. The selection itself is per-visit state and lives only
 * in the inputs rendered on each open — never in the data file.
 */
import { formatPrice } from './utils.js'
import { lockScroll, unlockScroll } from './scrollLock.js'
import { productFor } from './catalog.js'

/** Only one size can be chosen, so the radios need a shared name. */
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

/**
 * `sizes` is an object keyed s/m/l, `additives` is an array — two different
 * shapes for the same "list of choices" idea, so they are both turned into a
 * plain list of { value, label, addPrice } here and rendered by one function.
 */
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
    // Figma numbers the additive chips 1, 2, 3.
    icon: String(index + 1),
    addPrice: Number(additive['add-price']),
  }))
}

/** One pill: a native input for the behaviour, a label for the appearance. */
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
  /** The card that opened the dialog, so focus can go back where it came from. */
  let opener = null
  let hideTimer = 0

  // `product` doubles as the open flag: a null product means the dialog is
  // closed, which keeps a second boolean from drifting out of sync with it.

  /**
   * base price + the chosen size + every chosen additive.
   * `add-price` arrives as a string, so it is converted before it is added.
   */
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

  /** Takes the rest of the page out of reach while the dialog is open. */
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

    // Reused from the card rather than resolved again, so the dialog and the
    // card always show the very same file.
    image.src = trigger.querySelector('img').src
    name.textContent = nextProduct.name
    description.textContent = nextProduct.description

    // Rendered fresh on every open. Reusing a single set of inputs would let a
    // previous card's additive checkboxes survive — and because Sugar and
    // Syrup exist in more than one category, a stale selection can look
    // plausible enough to go unnoticed.
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
    // `hidden` means display:none, which cannot be transitioned — reveal first,
    // then add the class on the next frame so there is a start value.
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

  /** Anything interactive currently inside the dialog. */
  function focusableElements() {
    return [
      ...dialog.querySelectorAll('input:not([disabled]), button:not([disabled])'),
    ]
  }

  // Delegated from the grid so re-rendering the cards does not need the
  // handler to be re-attached. The card itself is a button filling the tile,
  // so clicking any part of the card reaches this.
  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card')
    if (!card) return

    const selected = productFor(card)
    if (!selected) return

    open(selected, card.querySelector('.product-card__trigger'))
  })

  closeButton.addEventListener('click', close)

  // Checking `event.target` is what keeps a click *inside* the dialog from
  // closing it — the handler sits on the backdrop, and clicks from the dialog
  // bubble up through it.
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close()
  })

  // One delegated document listener installed once, so repeated open/close
  // cycles cannot accumulate handlers.
  document.addEventListener('keydown', (event) => {
    if (!product) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    // The dialog is modal, so Tab must cycle inside it rather than reaching the
    // page dimmed behind it.
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

  // Live total: any change to either option group re-reads the form state.
  backdrop.addEventListener('change', updateTotal)
}
