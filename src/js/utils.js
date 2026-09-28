/**
 * Shared formatting helpers.
 *
 * Prices appear in two places — the product card and the modal — and they must
 * always agree, so the formatting lives here once.
 *
 * `price` and `add-price` are strings in products.json, so they are converted
 * before being formatted; `"7.00" + 0.5` would otherwise concatenate.
 */

/** Formats a catalog price as `$7.00`. */
export function formatPrice(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : ''
}
