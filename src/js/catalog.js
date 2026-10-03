

import { formatPrice } from './utils.js';

const images = import.meta.glob('../assets/img/*.png', {
	eager: true,
	query: '?url',
	import: 'default',
});
const IMAGE_KEY_PREFIX = '../assets/img/';

const MOBILE_QUERY = '(max-width: 768px)';
const MOBILE_VISIBLE = 4;

const CATEGORY_PRESENTATION = {
	coffee: { label: 'Coffee', icon: '☕' },
	tea: { label: 'Tea', icon: '🍵' },
	dessert: { label: 'Dessert', icon: '🍰' },
};

function imageUrl(fileName) {
	return images[`${IMAGE_KEY_PREFIX}${fileName}`] ?? '';
}

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

	card.dataset.productIndex = String(index);

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

let products = []

export function productFor(card) {
	return products[Number(card.dataset.productIndex)]
}

export async function initCatalog() {
	const tabs = document.querySelector('.menu__tabs');
	const grid = document.querySelector('.menu__grid');
	const more = document.querySelector('.menu__more');
	const status = document.querySelector('[data-catalog-status]');

	if (!tabs || !grid || !more) return;

	try {
		const response = await fetch(new URL('../../data/products.json', document.baseURI));
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const loaded = await response.json();
		if (!Array.isArray(loaded)) throw new Error('expected an array');
		products = loaded;
	} catch (error) {
		console.error('Catalog data failed to load:', error);
		return;
	}

	const mobile = window.matchMedia(MOBILE_QUERY);
	const categories = categoriesOf(products);

	let activeCategory = categories[0];

	let revealed = false;
	let cards = [];

	function visibleLimit(total) {
		if (!mobile.matches) return total;
		return revealed ? total : MOBILE_VISIBLE;
	}

	function applyVisibility() {
		const total = cards.length;
		const limit = visibleLimit(total);

		cards.forEach((card, position) => {
			card.hidden = position >= limit;
		});

		more.hidden = limit >= total;

		if (status) {
			const label = (CATEGORY_PRESENTATION[activeCategory] ?? {}).label ?? activeCategory;
			const visible = cards.filter((card) => !card.hidden).length;
			status.textContent = `Showing ${visible} of ${total} ${label} products`;
		}
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

	mobile.addEventListener('change', applyVisibility);

	tabs.replaceChildren(...categories.map(createCategoryTab));
	showCategory(activeCategory);
}
