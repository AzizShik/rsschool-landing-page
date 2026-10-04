/* empty css              */
import { i as initTheme, n as lockScroll, r as unlockScroll, t as initBurgerMenu } from "../../js/main.js";
//#region src/assets/img/about-1.png?url
var about_1_default = new URL("../../assets/images/about-1.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-2.png?url
var about_2_default = new URL("../../assets/images/about-2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-3.png?url
var about_3_default = new URL("../../assets/images/about-3.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-4.png?url
var about_4_default = new URL("../../assets/images/about-4.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-1.png?url
var coffee_1_default = new URL("../../assets/images/coffee-1.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-2.png?url
var coffee_2_default = new URL("../../assets/images/coffee-2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-3.png?url
var coffee_3_default = new URL("../../assets/images/coffee-3.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-4.png?url
var coffee_4_default = new URL("../../assets/images/coffee-4.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-5.png?url
var coffee_5_default = new URL("../../assets/images/coffee-5.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-6.png?url
var coffee_6_default = new URL("../../assets/images/coffee-6.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-7.png?url
var coffee_7_default = new URL("../../assets/images/coffee-7.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-8.png?url
var coffee_8_default = new URL("../../assets/images/coffee-8.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-1.png?url
var dessert_1_default = new URL("../../assets/images/dessert-1.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-2.png?url
var dessert_2_default = new URL("../../assets/images/dessert-2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-3.png?url
var dessert_3_default = new URL("../../assets/images/dessert-3.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-4.png?url
var dessert_4_default = new URL("../../assets/images/dessert-4.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-5.png?url
var dessert_5_default = new URL("../../assets/images/dessert-5.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-6.png?url
var dessert_6_default = new URL("../../assets/images/dessert-6.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-7.png?url
var dessert_7_default = new URL("../../assets/images/dessert-7.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-8.png?url
var dessert_8_default = new URL("../../assets/images/dessert-8.png", import.meta.url).href;
//#endregion
//#region src/assets/img/hero.png?url
var hero_default = new URL("../../assets/images/hero.png", import.meta.url).href;
//#endregion
//#region src/assets/img/mobile-screens.png?url
var mobile_screens_default = new URL("../../assets/images/mobile-screens.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-1.png?url
var slider_1_default = new URL("../../assets/images/slider-1.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-2.png?url
var slider_2_default = new URL("../../assets/images/slider-2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-3.png?url
var slider_3_default = new URL("../../assets/images/slider-3.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-1.png?url
var tea_1_default = new URL("../../assets/images/tea-1.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-2.png?url
var tea_2_default = new URL("../../assets/images/tea-2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-3.png?url
var tea_3_default = new URL("../../assets/images/tea-3.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-4.png?url
var tea_4_default = new URL("../../assets/images/tea-4.png", import.meta.url).href;
//#endregion
//#region src/js/utils.js
function formatPrice(value) {
	const amount = Number(value);
	return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "";
}
//#endregion
//#region src/js/catalog.js
var images = /* #__PURE__ */ Object.assign({
	"../assets/img/about-1.png": about_1_default,
	"../assets/img/about-2.png": about_2_default,
	"../assets/img/about-3.png": about_3_default,
	"../assets/img/about-4.png": about_4_default,
	"../assets/img/coffee-1.png": coffee_1_default,
	"../assets/img/coffee-2.png": coffee_2_default,
	"../assets/img/coffee-3.png": coffee_3_default,
	"../assets/img/coffee-4.png": coffee_4_default,
	"../assets/img/coffee-5.png": coffee_5_default,
	"../assets/img/coffee-6.png": coffee_6_default,
	"../assets/img/coffee-7.png": coffee_7_default,
	"../assets/img/coffee-8.png": coffee_8_default,
	"../assets/img/dessert-1.png": dessert_1_default,
	"../assets/img/dessert-2.png": dessert_2_default,
	"../assets/img/dessert-3.png": dessert_3_default,
	"../assets/img/dessert-4.png": dessert_4_default,
	"../assets/img/dessert-5.png": dessert_5_default,
	"../assets/img/dessert-6.png": dessert_6_default,
	"../assets/img/dessert-7.png": dessert_7_default,
	"../assets/img/dessert-8.png": dessert_8_default,
	"../assets/img/hero.png": hero_default,
	"../assets/img/mobile-screens.png": mobile_screens_default,
	"../assets/img/slider-1.png": slider_1_default,
	"../assets/img/slider-2.png": slider_2_default,
	"../assets/img/slider-3.png": slider_3_default,
	"../assets/img/tea-1.png": tea_1_default,
	"../assets/img/tea-2.png": tea_2_default,
	"../assets/img/tea-3.png": tea_3_default,
	"../assets/img/tea-4.png": tea_4_default
});
var IMAGE_KEY_PREFIX = "../assets/img/";
var MOBILE_QUERY = "(max-width: 768px)";
var MOBILE_VISIBLE = 4;
var CATEGORY_PRESENTATION = {
	coffee: {
		label: "Coffee",
		icon: "☕"
	},
	tea: {
		label: "Tea",
		icon: "🍵"
	},
	dessert: {
		label: "Dessert",
		icon: "🍰"
	}
};
function imageUrl(fileName) {
	return images[`${IMAGE_KEY_PREFIX}${fileName}`] ?? "";
}
function categoriesOf(list) {
	const seen = [];
	for (const product of list) if (!seen.includes(product.category)) seen.push(product.category);
	return seen;
}
function createCard(product, index) {
	const card = document.createElement("li");
	card.className = "product-card";
	card.dataset.productIndex = String(index);
	const trigger = document.createElement("button");
	trigger.type = "button";
	trigger.className = "product-card__trigger";
	const media = document.createElement("div");
	media.className = "product-card__media";
	const image = document.createElement("img");
	image.className = "product-card__img";
	image.src = imageUrl(product.image);
	image.alt = product.name;
	image.width = 310;
	image.height = 310;
	image.loading = "lazy";
	media.append(image);
	const body = document.createElement("div");
	body.className = "product-card__body";
	const name = document.createElement("h2");
	name.className = "product-card__name";
	name.textContent = product.name;
	const description = document.createElement("p");
	description.className = "product-card__desc";
	description.textContent = product.description;
	const price = document.createElement("p");
	price.className = "product-card__price";
	price.textContent = formatPrice(product.price);
	body.append(name, description, price);
	trigger.append(media, body);
	card.append(trigger);
	return card;
}
function createCategoryTab(category, index) {
	const presentation = CATEGORY_PRESENTATION[category] ?? {
		label: category,
		icon: ""
	};
	const tab = document.createElement("button");
	tab.type = "button";
	tab.className = "menu__tab";
	tab.dataset.category = category;
	tab.setAttribute("aria-pressed", String(index === 0));
	const icon = document.createElement("span");
	icon.className = "menu__tab-icon";
	icon.setAttribute("aria-hidden", "true");
	icon.textContent = presentation.icon;
	tab.append(icon, presentation.label);
	return tab;
}
var products = [];
function productFor(card) {
	return products[Number(card.dataset.productIndex)];
}
async function initCatalog() {
	const tabs = document.querySelector(".menu__tabs");
	const grid = document.querySelector(".menu__grid");
	const more = document.querySelector(".menu__more");
	const status = document.querySelector("[data-catalog-status]");
	if (!tabs || !grid || !more) return;
	try {
		const response = await fetch(new URL("../../data/products.json", document.baseURI));
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const loaded = await response.json();
		if (!Array.isArray(loaded)) throw new Error("expected an array");
		products = loaded;
	} catch (error) {
		console.error("Catalog data failed to load:", error);
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
			tab.classList.toggle("menu__tab--active", isActive);
			tab.setAttribute("aria-pressed", String(isActive));
		}
		const indexes = products.map((product, index) => ({
			product,
			index
		})).filter(({ product }) => product.category === category);
		grid.replaceChildren(...indexes.map(({ product, index }) => createCard(product, index)));
		cards = [...grid.children];
		applyVisibility();
	}
	tabs.addEventListener("click", (event) => {
		const tab = event.target.closest(".menu__tab");
		if (!tab || tab.dataset.category === activeCategory) return;
		showCategory(tab.dataset.category);
	});
	more.addEventListener("click", () => {
		revealed = true;
		applyVisibility();
	});
	mobile.addEventListener("change", applyVisibility);
	tabs.replaceChildren(...categories.map(createCategoryTab));
	showCategory(activeCategory);
}
//#endregion
//#region src/js/productModal.js
var SIZE_INPUT = "product-size";
var ADDITIVE_INPUT = "product-additive";
var FALLBACK_DURATION_MS = 300;
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function closeDuration() {
	const raw = getComputedStyle(document.documentElement).getPropertyValue("--transition-duration").trim();
	const value = Number.parseFloat(raw);
	if (!Number.isFinite(value)) return FALLBACK_DURATION_MS;
	return raw.endsWith("ms") ? value : value * 1e3;
}
function sizeChoices(product) {
	return Object.entries(product.sizes).map(([key, size]) => ({
		value: key,
		label: size.size,
		icon: key.toUpperCase(),
		addPrice: Number(size["add-price"])
	}));
}
function additiveChoices(product) {
	return product.additives.map((additive, index) => ({
		value: String(index),
		label: additive.name,
		icon: String(index + 1),
		addPrice: Number(additive["add-price"])
	}));
}
function createOption({ value, label, icon }, inputName, type, checked) {
	const option = document.createElement("label");
	option.className = "product-modal__option";
	const input = document.createElement("input");
	input.type = type;
	input.name = inputName;
	input.value = value;
	input.className = "visually-hidden product-modal__option-input";
	input.checked = checked;
	const chip = document.createElement("span");
	chip.className = "product-modal__option-icon";
	chip.setAttribute("aria-hidden", "true");
	chip.textContent = icon;
	const text = document.createElement("span");
	text.className = "product-modal__option-label";
	text.textContent = label;
	option.append(input, chip, text);
	return option;
}
function initProductModal() {
	const backdrop = document.querySelector("[data-product-modal]");
	const grid = document.querySelector(".menu__grid");
	if (!backdrop || !grid) return;
	const dialog = backdrop.querySelector(".product-modal");
	const image = backdrop.querySelector("[data-modal-image]");
	const name = backdrop.querySelector("[data-modal-name]");
	const description = backdrop.querySelector("[data-modal-description]");
	const sizesBox = backdrop.querySelector("[data-modal-sizes]");
	const additivesBox = backdrop.querySelector("[data-modal-additives]");
	const totalBox = backdrop.querySelector("[data-modal-total]");
	const closeButton = backdrop.querySelector("[data-modal-close]");
	let product = null;
	let opener = null;
	let hideTimer = 0;
	function updateTotal() {
		if (!product) return;
		let total = Number(product.price);
		const chosenSize = dialog.querySelector(`input[name="${SIZE_INPUT}"]:checked`);
		if (chosenSize) total += Number(product.sizes[chosenSize.value]["add-price"]);
		for (const chosen of dialog.querySelectorAll(`input[name="${ADDITIVE_INPUT}"]:checked`)) total += Number(product.additives[Number(chosen.value)]["add-price"]);
		totalBox.textContent = formatPrice(total);
	}
	function setBackgroundInert(inert) {
		for (const region of document.querySelectorAll("header[id=\"site-header\"], main, footer")) region.toggleAttribute("inert", inert);
	}
	function open(nextProduct, trigger) {
		product = nextProduct;
		opener = trigger;
		window.clearTimeout(hideTimer);
		setBackgroundInert(true);
		image.src = trigger.querySelector("img").src;
		name.textContent = nextProduct.name;
		description.textContent = nextProduct.description;
		const sizes = sizeChoices(nextProduct);
		const defaultSize = sizes.find((size) => size.addPrice === 0) ?? sizes[0];
		const additives = additiveChoices(nextProduct);
		sizesBox.replaceChildren(...sizes.map((size) => createOption(size, SIZE_INPUT, "radio", size === defaultSize)));
		additivesBox.replaceChildren(...additives.map((additive) => createOption(additive, ADDITIVE_INPUT, "checkbox", false)));
		updateTotal();
		backdrop.hidden = false;
		window.requestAnimationFrame(() => backdrop.classList.add("is-open"));
		lockScroll();
		closeButton.focus();
	}
	function close() {
		if (!product) return;
		product = null;
		backdrop.classList.remove("is-open");
		unlockScroll();
		setBackgroundInert(false);
		opener?.focus();
		if (reduceMotion.matches) {
			backdrop.hidden = true;
			return;
		}
		hideTimer = window.setTimeout(() => {
			if (!product) backdrop.hidden = true;
		}, closeDuration());
	}
	function focusableElements() {
		return [...dialog.querySelectorAll("input:not([disabled]), button:not([disabled])")];
	}
	grid.addEventListener("click", (event) => {
		const card = event.target.closest(".product-card");
		if (!card) return;
		const selected = productFor(card);
		if (!selected) return;
		open(selected, card.querySelector(".product-card__trigger"));
	});
	closeButton.addEventListener("click", close);
	backdrop.addEventListener("click", (event) => {
		if (event.target === backdrop) close();
	});
	document.addEventListener("keydown", (event) => {
		if (!product) return;
		if (event.key === "Escape") {
			event.preventDefault();
			close();
			return;
		}
		if (event.key !== "Tab") return;
		const focusable = focusableElements();
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	});
	backdrop.addEventListener("change", updateTotal);
}
//#endregion
//#region src/pages/menu/menu.js
initTheme();
initBurgerMenu();
initCatalog();
initProductModal();
//#endregion
