//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/theme.js
var THEME_STORAGE_KEY = "theme";
var THEME_ATTRIBUTE = "data-theme";
var THEMES = ["light", "dark"];
function normalizeTheme(value) {
	return THEMES.includes(value) ? value : null;
}
function getStoredTheme() {
	try {
		return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
	} catch {
		return null;
	}
}
function getPreferredTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function getCurrentTheme() {
	return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
function syncButton(button, theme) {
	const isDark = theme === "dark";
	const isActive = button.dataset.themeButton === (isDark ? "dark" : "light");
	button.classList.toggle("theme-switch__button--active", isActive);
	button.setAttribute("aria-pressed", String(isActive));
}
function syncButtons() {
	const theme = getCurrentTheme();
	document.querySelectorAll("[data-theme-button]").forEach((button) => {
		syncButton(button, theme);
	});
}
function setTheme(theme) {
	const next = normalizeTheme(theme) ?? "light";
	document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
	try {
		localStorage.setItem(THEME_STORAGE_KEY, next);
	} catch {}
	syncButtons();
}
/**
* Applies the stored/preferred theme and wires up the theme switch buttons.
* Call after the shared Header has been rendered, so the switch exists in the DOM.
*/
function initTheme() {
	setTheme(getStoredTheme() ?? getPreferredTheme());
	document.addEventListener("click", (event) => {
		const button = event.target.closest("[data-theme-button]");
		if (!button) return;
		setTheme(button.dataset.themeButton === "dark" ? "dark" : "light");
	});
}
//#endregion
//#region src/js/scrollLock.js
/**
* Shared page scroll lock.
*
* Both the burger menu and the product modal need to block page scrolling
* while they are open, so the behaviour lives here once instead of being
* written twice. Two independent implementations would fight each other:
* opening the modal while the menu is open and then closing the modal would
* restore scrolling while the menu is still showing.
*/
var holders = 0;
var previousOverflow = "";
var previousPaddingRight = "";
/**
* Width of the classic scrollbar, i.e. the space that frees up when it
* disappears. On Windows this is ~15px; on overlay-scrollbar systems (macOS,
* mobile) it is 0 and no compensation is needed.
*/
function scrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}
/** Prevents the page from scrolling until the matching `unlockScroll()`. */
function lockScroll() {
	holders += 1;
	if (holders > 1) return;
	const body = document.body;
	previousOverflow = body.style.overflow;
	previousPaddingRight = body.style.paddingRight;
	const width = scrollbarWidth();
	const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
	body.style.overflow = "hidden";
	if (width > 0) body.style.paddingRight = `${currentPadding + width}px`;
}
/** Releases one hold on the page. Scrolling resumes at the last release. */
function unlockScroll() {
	if (holders === 0) return;
	holders -= 1;
	if (holders > 0) return;
	document.body.style.overflow = previousOverflow;
	document.body.style.paddingRight = previousPaddingRight;
}
//#endregion
//#region src/js/burgerMenu.js
/**
* Burger menu — shared Header behaviour, runs on both pages.
*
* The markup already exists in `components/Header/header.html` and is injected
* into every page by the `sharedHeader` Vite plugin, so nothing here builds
* DOM. This module only wires behaviour to it.
*
* Design notes (Figma frames `[M] Burger` / `[T] Burger`):
*   - the panel is not a full-screen overlay: it starts 20px below the 60px
*     header bar and runs to the bottom of the viewport, full width
*   - the close icon is an 11.31px box, which is exactly what two 16px lines
*     rotated ±45° produce — the burger icon is morphed, not swapped
*/
/** The assignment fixes the mobile menu at 768px and below. */
var MOBILE_QUERY$1 = "(max-width: 768px)";
var LABEL_CLOSED = "Open menu";
var LABEL_OPEN = "Close menu";
/** Used only if the duration token is missing or unparseable. */
var FALLBACK_DURATION_MS$1 = 300;
/**
* With reduced motion the CSS transition is disabled, so there is nothing to
* wait for. Hiding the panel on a timer anyway would leave it in the document
* — and its links still reachable by Tab — for no visual reason.
*/
var reduceMotion$1 = window.matchMedia("(prefers-reduced-motion: reduce)");
/**
* Reads the close animation length from the design token so the timer that
* re-applies `hidden` never disagrees with the CSS transition.
*/
function closeDuration$1() {
	const raw = getComputedStyle(document.documentElement).getPropertyValue("--transition-duration").trim();
	const value = Number.parseFloat(raw);
	if (!Number.isFinite(value)) return FALLBACK_DURATION_MS$1;
	return raw.endsWith("ms") ? value : value * 1e3;
}
function initBurgerMenu() {
	const trigger = document.querySelector(".header__burger");
	const panel = document.querySelector(".burger-menu");
	if (!trigger || !panel) return;
	const mobile = window.matchMedia(MOBILE_QUERY$1);
	const panelLinks = [...panel.querySelectorAll("a")];
	let isOpen = false;
	let hideTimer = 0;
	const focusable = [trigger, ...panelLinks];
	/** Moves the page behind the panel out of reach while it is open. */
	function setBackgroundInert(inert) {
		for (const region of document.querySelectorAll("main, footer")) region.toggleAttribute("inert", inert);
	}
	function open() {
		if (isOpen) return;
		isOpen = true;
		window.clearTimeout(hideTimer);
		panel.hidden = false;
		window.requestAnimationFrame(() => panel.classList.add("is-open"));
		trigger.setAttribute("aria-expanded", "true");
		trigger.setAttribute("aria-label", LABEL_OPEN);
		lockScroll();
		setBackgroundInert(true);
		panelLinks[0]?.focus();
	}
	/**
	* @param {object} [options]
	* @param {boolean} [options.restoreFocus=true] Return focus to the trigger.
	*   Pass false when closing because of navigation or a breakpoint change —
	*   yanking focus back to the button after the user has moved on is worse
	*   than leaving it where the browser puts it.
	*/
	function close({ restoreFocus = true } = {}) {
		if (!isOpen) return;
		isOpen = false;
		panel.classList.remove("is-open");
		trigger.setAttribute("aria-expanded", "false");
		trigger.setAttribute("aria-label", LABEL_CLOSED);
		unlockScroll();
		setBackgroundInert(false);
		if (restoreFocus) trigger.focus();
		if (reduceMotion$1.matches) {
			panel.hidden = true;
			return;
		}
		hideTimer = window.setTimeout(() => {
			if (!isOpen) panel.hidden = true;
		}, closeDuration$1());
	}
	trigger.addEventListener("click", () => isOpen ? close() : open());
	document.addEventListener("keydown", (event) => {
		if (!isOpen) return;
		if (event.key === "Escape") {
			event.preventDefault();
			close();
			return;
		}
		if (event.key !== "Tab") return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;
		if (event.shiftKey && (active === first || !panel.contains(active))) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	});
	panel.addEventListener("click", (event) => {
		if (event.target.closest("a")) close({ restoreFocus: false });
	});
	mobile.addEventListener("change", (event) => {
		if (!event.matches) close({ restoreFocus: false });
	});
}
//#endregion
//#region src/js/slider.js
/**
* Favorite coffee slider — home page.
*
* The slides and arrows already exist as static markup in `home/index.html`;
* this module only adds the movement, the indicators, and the ARIA state.
*
* Design notes (Figma frames `[D] slider` / `[M] slider`):
*   - each slide is one full viewport wide and holds a single 480px card
*     centred inside it, so exactly one card is on screen and the neighbours
*     sit outside the clipped viewport
*   - the arrows exist at 1440px and 768px but not at 380px, so the indicator
*     bars are the only control on a phone
*/
/**
* Wraps into 0..length-1 for any input, which is what makes the last → first
* and first → last steps cycle without a branch. The double modulo normalises
* a negative index, so going back from the first slide lands on the last.
*/
function wrapIndex(target, length) {
	return (target % length + length) % length;
}
function initSlider() {
	const slider = document.querySelector(".slider");
	const controls = document.querySelector(".slider__controls");
	const status = document.querySelector("[data-slider-status]");
	if (!slider || !controls) return;
	const track = slider.querySelector(".slider__track");
	const slides = [...slider.querySelectorAll(".slide")];
	const prevButton = slider.querySelector(".slider__arrow--prev");
	const nextButton = slider.querySelector(".slider__arrow--next");
	if (!track || slides.length === 0) return;
	let index = 0;
	const indicators = slides.map((_, position) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "slider__control";
		button.setAttribute("aria-label", `Go to slide ${position + 1} of ${slides.length}`);
		button.addEventListener("click", () => goTo(position));
		controls.append(button);
		return button;
	});
	function render() {
		track.style.transform = `translateX(-${index * 100}%)`;
		indicators.forEach((indicator, position) => {
			const isCurrent = position === index;
			indicator.classList.toggle("is-active", isCurrent);
			indicator.toggleAttribute("aria-current", isCurrent);
		});
		if (status) status.textContent = `Slide ${index + 1} of ${slides.length}`;
	}
	function goTo(target) {
		index = wrapIndex(target, slides.length);
		render();
	}
	prevButton?.addEventListener("click", () => goTo(index - 1));
	nextButton?.addEventListener("click", () => goTo(index + 1));
	render();
}
//#endregion
//#region src/assets/img/about-1.png?url
var about_1_default = new URL("about-1-Mq-8Pdin.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-2.png?url
var about_2_default = new URL("about-2-CFmbl5CC.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-3.png?url
var about_3_default = new URL("about-3-DiybgY9Y.png", import.meta.url).href;
//#endregion
//#region src/assets/img/about-4.png?url
var about_4_default = new URL("about-4-Be9Cj0Qu.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-1.png?url
var coffee_1_default = new URL("coffee-1-P1Tt4h1s.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-2.png?url
var coffee_2_default = new URL("coffee-2-S4wZ_dJd.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-3.png?url
var coffee_3_default = new URL("coffee-3-CvnxGWji.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-4.png?url
var coffee_4_default = new URL("coffee-4-D63FSmNd.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-5.png?url
var coffee_5_default = new URL("coffee-5-XbVI-Chi.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-6.png?url
var coffee_6_default = new URL("coffee-6-CbEljEv4.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-7.png?url
var coffee_7_default = new URL("coffee-7-sCNPjK1B.png", import.meta.url).href;
//#endregion
//#region src/assets/img/coffee-8.png?url
var coffee_8_default = new URL("coffee-8-oi760d9X.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-1.png?url
var dessert_1_default = new URL("dessert-1-DaV3Yocv.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-2.png?url
var dessert_2_default = new URL("dessert-2-CizDYdy9.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-3.png?url
var dessert_3_default = new URL("dessert-3-mbmSJ7k2.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-4.png?url
var dessert_4_default = new URL("dessert-4-BjR3Ou1v.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-5.png?url
var dessert_5_default = new URL("dessert-5-CQjPVQQD.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-6.png?url
var dessert_6_default = new URL("dessert-6-mIYCh6xB.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-7.png?url
var dessert_7_default = new URL("dessert-7-DTbdyUay.png", import.meta.url).href;
//#endregion
//#region src/assets/img/dessert-8.png?url
var dessert_8_default = new URL("dessert-8-Bp3jGYKt.png", import.meta.url).href;
//#endregion
//#region src/assets/img/hero.png?url
var hero_default = new URL("hero-BDQukNNa.png", import.meta.url).href;
//#endregion
//#region src/assets/img/mobile-screens.png?url
var mobile_screens_default = new URL("mobile-screens-BSS9A04m.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-1.png?url
var slider_1_default = new URL("slider-1-CSZnqGHJ.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-2.png?url
var slider_2_default = new URL("slider-2-D1KETiEZ.png", import.meta.url).href;
//#endregion
//#region src/assets/img/slider-3.png?url
var slider_3_default = new URL("slider-3-doFXNm0X.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-1.png?url
var tea_1_default = new URL("tea-1-DHwU-FF6.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-2.png?url
var tea_2_default = new URL("tea-2-Boapf4cK.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-3.png?url
var tea_3_default = new URL("tea-3-D_9atn-T.png", import.meta.url).href;
//#endregion
//#region src/assets/img/tea-4.png?url
var tea_4_default = new URL("tea-4-I33OWOTM.png", import.meta.url).href;
//#endregion
//#region src/products.json
var products_default = /*#__PURE__*/ JSON.parse("[{\"name\":\"Irish coffee\",\"description\":\"Fragrant black coffee with Jameson Irish whiskey and whipped milk\",\"price\":\"7.00\",\"category\":\"coffee\",\"image\":\"coffee-1.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Kahlua coffee\",\"description\":\"Classic coffee with milk and Kahlua liqueur under a cap of frothed milk\",\"price\":\"7.00\",\"category\":\"coffee\",\"image\":\"coffee-2.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Honey raf\",\"description\":\"Espresso with frothed milk, cream and aromatic honey\",\"price\":\"5.50\",\"category\":\"coffee\",\"image\":\"coffee-3.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Ice cappuccino\",\"description\":\"Cappuccino with soft thick foam in summer version with ice\",\"price\":\"5.00\",\"category\":\"coffee\",\"image\":\"coffee-4.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Espresso\",\"description\":\"Classic black coffee\",\"price\":\"4.50\",\"category\":\"coffee\",\"image\":\"coffee-5.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Latte\",\"description\":\"Espresso coffee with the addition of steamed milk and dense milk foam\",\"price\":\"5.50\",\"category\":\"coffee\",\"image\":\"coffee-6.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Latte macchiato\",\"description\":\"Espresso with frothed milk and chocolate\",\"price\":\"5.50\",\"category\":\"coffee\",\"image\":\"coffee-7.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Coffee with cognac\",\"description\":\"Fragrant black coffee with cognac and whipped cream\",\"price\":\"6.50\",\"category\":\"coffee\",\"image\":\"coffee-8.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Cinnamon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Moroccan\",\"description\":\"Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint\",\"price\":\"4.50\",\"category\":\"tea\",\"image\":\"tea-1.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Lemon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Ginger\",\"description\":\"Original black tea with fresh ginger, lemon and honey\",\"price\":\"5.00\",\"category\":\"tea\",\"image\":\"tea-2.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Lemon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Cranberry\",\"description\":\"Invigorating black tea with cranberry and honey\",\"price\":\"5.00\",\"category\":\"tea\",\"image\":\"tea-3.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Lemon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Sea buckthorn\",\"description\":\"Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon\",\"price\":\"5.50\",\"category\":\"tea\",\"image\":\"tea-4.png\",\"sizes\":{\"s\":{\"size\":\"200 ml\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"300 ml\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"400 ml\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Sugar\",\"add-price\":\"0.50\"},{\"name\":\"Lemon\",\"add-price\":\"0.50\"},{\"name\":\"Syrup\",\"add-price\":\"0.50\"}]},{\"name\":\"Marble cheesecake\",\"description\":\"Philadelphia cheese with lemon zest on a light sponge cake and red currant jam\",\"price\":\"3.50\",\"category\":\"dessert\",\"image\":\"dessert-1.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Red velvet\",\"description\":\"Layer cake with cream cheese frosting\",\"price\":\"4.00\",\"category\":\"dessert\",\"image\":\"dessert-2.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Cheesecakes\",\"description\":\"Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar\",\"price\":\"4.50\",\"category\":\"dessert\",\"image\":\"dessert-3.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Creme brulee\",\"description\":\"Delicate creamy dessert in a caramel basket with wild berries\",\"price\":\"4.00\",\"category\":\"dessert\",\"image\":\"dessert-4.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Pancakes\",\"description\":\"Tender pancakes with strawberry jam and fresh strawberries\",\"price\":\"4.50\",\"category\":\"dessert\",\"image\":\"dessert-5.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Honey cake\",\"description\":\"Classic honey cake with delicate custard\",\"price\":\"4.50\",\"category\":\"dessert\",\"image\":\"dessert-6.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Chocolate cake\",\"description\":\"Cake with hot chocolate filling and nuts with dried apricots\",\"price\":\"5.50\",\"category\":\"dessert\",\"image\":\"dessert-7.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]},{\"name\":\"Black forest\",\"description\":\"A combination of thin sponge cake with cherry jam and light chocolate mousse\",\"price\":\"6.50\",\"category\":\"dessert\",\"image\":\"dessert-8.png\",\"sizes\":{\"s\":{\"size\":\"50 g\",\"add-price\":\"0.00\"},\"m\":{\"size\":\"100 g\",\"add-price\":\"0.50\"},\"l\":{\"size\":\"200 g\",\"add-price\":\"1.00\"}},\"additives\":[{\"name\":\"Berries\",\"add-price\":\"0.50\"},{\"name\":\"Nuts\",\"add-price\":\"0.50\"},{\"name\":\"Jam\",\"add-price\":\"0.50\"}]}]");
//#endregion
//#region src/js/utils.js
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
function formatPrice(value) {
	const amount = Number(value);
	return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "";
}
//#endregion
//#region src/js/catalog.js
/**
* Vite resolves these at build time into hashed output URLs, which is what
* keeps `base: './'` working when the site is served from a sub-path such as
* GitHub Pages. A path built by hand (`assets/img/${name}`) would not resolve,
* because the built page lives in dist/pages/menu/ while assets go to
* dist/assets/.
*/
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
/** The assignment splits the catalogue at 768px, the same line as the header. */
var MOBILE_QUERY = "(max-width: 768px)";
var MOBILE_VISIBLE = 4;
/**
* Presentation only. The category *keys* still come from the data in
* first-appearance order — this just supplies the label and the icon the Figma
* design shows on each pill.
*/
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
/** The categories in the order they first appear in the data. */
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
/** Resolves the product a card was built from. Used by the modal. */
function productFor(card) {
	return products_default[Number(card.dataset.productIndex)];
}
function initCatalog() {
	const tabs = document.querySelector(".menu__tabs");
	const grid = document.querySelector(".menu__grid");
	const more = document.querySelector(".menu__more");
	if (!tabs || !grid || !more) return;
	const mobile = window.matchMedia(MOBILE_QUERY);
	const categories = categoriesOf(products_default);
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
		more.hidden = limit >= total;
	}
	function showCategory(category) {
		activeCategory = category;
		revealed = false;
		for (const tab of tabs.children) {
			const isActive = tab.dataset.category === category;
			tab.classList.toggle("menu__tab--active", isActive);
			tab.setAttribute("aria-pressed", String(isActive));
		}
		const indexes = products_default.map((product, index) => ({
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
/**
* Product modal — the dialog, its two option groups, and the live total.
*
* The dialog is built from the *same* product object the clicked card was built
* from (see `productFor` in catalog.js), so a card and its dialog can never
* show different data. The selection itself is per-visit state and lives only
* in the inputs rendered on each open — never in the data file.
*/
/** Only one size can be chosen, so the radios need a shared name. */
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
/** One pill: a native input for the behaviour, a label for the appearance. */
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
	/** The card that opened the dialog, so focus can go back where it came from. */
	let opener = null;
	let hideTimer = 0;
	/**
	* base price + the chosen size + every chosen additive.
	* `add-price` arrives as a string, so it is converted before it is added.
	*/
	function updateTotal() {
		if (!product) return;
		let total = Number(product.price);
		const chosenSize = dialog.querySelector(`input[name="${SIZE_INPUT}"]:checked`);
		if (chosenSize) total += Number(product.sizes[chosenSize.value]["add-price"]);
		for (const chosen of dialog.querySelectorAll(`input[name="${ADDITIVE_INPUT}"]:checked`)) total += Number(product.additives[Number(chosen.value)]["add-price"]);
		totalBox.textContent = formatPrice(total);
	}
	/** Takes the rest of the page out of reach while the dialog is open. */
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
	/** Anything interactive currently inside the dialog. */
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
//#region src/js/heroVideo.js
/**
* Hero background video.
*
* Playback is started from here rather than by an `autoplay` attribute, so that
* `prefers-reduced-motion` can hold the element on its poster. A decorative
* loop is motion the visitor never asked for, and the poster is the same
* photograph as the CSS fallback, so nothing is lost by not playing it.
*
* The `muted` attribute lives in the HTML on purpose: the autoplay policy only
* exempts a video that is already silent at the moment playback is requested,
* and setting `video.muted` from script is not reliably honoured.
*
* Without JavaScript the video simply stays on its poster, which is the
* intended static appearance.
*/
var REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function initHeroVideo() {
	const video = document.querySelector("[data-hero-video]");
	if (!video) return;
	if (window.matchMedia(REDUCED_MOTION).matches) return;
	video.play().catch(() => {});
}
//#endregion
//#region src/js/main.js
initTheme();
initBurgerMenu();
initSlider();
initHeroVideo();
initCatalog();
initProductModal();
//#endregion

//# sourceMappingURL=main-O0Fz5wcq.js.map