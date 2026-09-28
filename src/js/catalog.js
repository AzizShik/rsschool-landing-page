/**
 * Catalog — data loading, card rendering, category switching, and the
 * load-more mechanism.
 *
 * Everything shown on the menu page comes from `src/products.json`, which is
 * the single source of truth: the category pills, the cards, and (in
 * productModal.js) the dialog itself. The HTML contains no product data at all.
 */
import products from '../products.json';
import { formatPrice } from './utils.js';

/**
 * Vite resolves these at build time into hashed output URLs, which is what
 * keeps `base: './'` working when the site is served from a sub-path such as
 * GitHub Pages. A path built by hand (`assets/img/${name}`) would not resolve,
 * because the built page lives in dist/pages/menu/ while assets go to
 * dist/assets/.
 */
const images = import.meta.glob('../assets/img/*.png', {
	eager: true,
	query: '?url',
	import: 'default',
});
const IMAGE_KEY_PREFIX = '../assets/img/';

/** The assignment splits the catalogue at 768px, the same line as the header. */
const MOBILE_QUERY = '(max-width: 768px)';
const MOBILE_VISIBLE = 4;

/**
 * Presentation only. The category *keys* still come from the data in
 * first-appearance order — this just supplies the label and the icon the Figma
 * design shows on each pill.
 */
const CATEGORY_PRESENTATION = {
	coffee: { label: 'Coffee', icon: '☕' },
	tea: { label: 'Tea', icon: '🍵' },
	dessert: { label: 'Dessert', icon: '🍰' },
};

function imageUrl(fileName) {
	return images[`${IMAGE_KEY_PREFIX}${fileName}`] ?? '';
}

/** The categories in the order they first appear in the data. */
function categoriesOf(list) {
	const seen = [];
	for (const product of list) {
		if (!seen.includes(product.category)) seen.push(product.category);
	}
	return seen;
}

function createCard(product, index) {
	const card = document.createElement('li');
	card.className = 'product-card';
	// The modal resolves the product from this attribute, so a card and its
	// dialog are always built from one object.
	card.dataset.productIndex = String(index);

	// A real button covering the whole card, so "click any part of the card"
	// also works from the keyboard without inventing a role or a tabindex.
	const trigger = document.createElement('button');
	trigger.type = 'button';
	trigger.className = 'product-card__trigger';

	const media = document.createElement('div');
	media.className = 'product-card__media';

	const image = document.createElement('img');
	image.className = 'product-card__img';
	image.src = imageUrl(product.image);
	image.alt = product.name;
	image.width = 310;
	image.height = 310;
	image.loading = 'lazy';
	media.append(image);

	const body = document.createElement('div');
	body.className = 'product-card__body';

	const name = document.createElement('h2');
	name.className = 'product-card__name';
	name.textContent = product.name;

	const description = document.createElement('p');
	description.className = 'product-card__desc';
	description.textContent = product.description;

	const price = document.createElement('p');
	price.className = 'product-card__price';
	price.textContent = formatPrice(product.price);

	body.append(name, description, price);
	trigger.append(media, body);
	card.append(trigger);

	return card;
}

function createCategoryTab(category, index) {
	const presentation = CATEGORY_PRESENTATION[category] ?? {
		label: category,
		icon: '',
	};

	const tab = document.createElement('button');
	tab.type = 'button';
	tab.className = 'menu__tab';
	tab.dataset.category = category;
	tab.setAttribute('aria-pressed', String(index === 0));

	const icon = document.createElement('span');
	icon.className = 'menu__tab-icon';
	icon.setAttribute('aria-hidden', 'true');
	icon.textContent = presentation.icon;

	tab.append(icon, presentation.label);

	return tab;
}

/** Resolves the product a card was built from. Used by the modal. */
export function productFor(card) {
	return products[Number(card.dataset.productIndex)];
}

export function initCatalog() {
	const tabs = document.querySelector('.menu__tabs');
	const grid = document.querySelector('.menu__grid');
	const more = document.querySelector('.menu__more');

	if (!tabs || !grid || !more) return;

	const mobile = window.matchMedia(MOBILE_QUERY);
	const categories = categoriesOf(products);

	// The first category in the data is active on load and on reload. Nothing is
	// restored from storage — the requirement asks for the first category.
	let activeCategory = categories[0];
	/** Whether the user has already asked to see the rest of this category. */
	let revealed = false;
	let cards = [];

	/**
	 * How many cards the current viewport allows. Above 768px every card of the
	 * category is shown, so the load-more control has nothing left to reveal.
	 */
	function visibleLimit(total) {
		if (!mobile.matches) return total;
		return revealed ? total : MOBILE_VISIBLE;
	}

	/** Applies the visible count without rebuilding the DOM. */
	function applyVisibility() {
		const total = cards.length;
		const limit = visibleLimit(total);

		cards.forEach((card, position) => {
			card.hidden = position >= limit;
		});

		// The control is offered only while cards are actually being held back.
		// Tea has exactly four products, so on mobile it correctly never appears.
		more.hidden = limit >= total;
	}

	function showCategory(category) {
		activeCategory = category;
		revealed = false;

		for (const tab of tabs.children) {
			const isActive = tab.dataset.category === category;
			tab.classList.toggle('menu__tab--active', isActive);
			tab.setAttribute('aria-pressed', String(isActive));
		}

		const indexes = products
			.map((product, index) => ({ product, index }))
			.filter(({ product }) => product.category === category);

		// replaceChildren takes the built nodes directly — no HTML string, so
		// nothing from the data file is ever parsed as markup.
		grid.replaceChildren(
			...indexes.map(({ product, index }) => createCard(product, index)),
		);
		cards = [...grid.children];

		applyVisibility();
	}

	tabs.addEventListener('click', event => {
		const tab = event.target.closest('.menu__tab');
		if (!tab || tab.dataset.category === activeCategory) return;
		showCategory(tab.dataset.category);
	});

	more.addEventListener('click', () => {
		revealed = true;
		applyVisibility();
	});

	// Only fires when the viewport crosses 768px, which is the granularity the
	// requirement needs — not a per-pixel resize handler. The revealed choice is
	// kept across the crossing so the list is not re-trimmed under the user.
	mobile.addEventListener('change', applyVisibility);

	tabs.replaceChildren(...categories.map(createCategoryTab));
	showCategory(activeCategory);
}
