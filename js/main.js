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
var holders = 0;
var previousOverflow = "";
var previousPaddingRight = "";
function scrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}
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
function unlockScroll() {
	if (holders === 0) return;
	holders -= 1;
	if (holders > 0) return;
	document.body.style.overflow = previousOverflow;
	document.body.style.paddingRight = previousPaddingRight;
}
//#endregion
//#region src/js/burgerMenu.js
var MOBILE_QUERY = "(max-width: 768px)";
var LABEL_CLOSED = "Open menu";
var LABEL_OPEN = "Close menu";
var FALLBACK_DURATION_MS = 300;
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function closeDuration() {
	const raw = getComputedStyle(document.documentElement).getPropertyValue("--transition-duration").trim();
	const value = Number.parseFloat(raw);
	if (!Number.isFinite(value)) return FALLBACK_DURATION_MS;
	return raw.endsWith("ms") ? value : value * 1e3;
}
function initBurgerMenu() {
	const trigger = document.querySelector(".header__burger");
	const panel = document.querySelector(".burger-menu");
	if (!trigger || !panel) return;
	const mobile = window.matchMedia(MOBILE_QUERY);
	const panelLinks = [...panel.querySelectorAll("a")];
	let isOpen = false;
	let hideTimer = 0;
	const focusable = [trigger, ...panelLinks];
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
	function close({ restoreFocus = true } = {}) {
		if (!isOpen) return;
		isOpen = false;
		panel.classList.remove("is-open");
		trigger.setAttribute("aria-expanded", "false");
		trigger.setAttribute("aria-label", LABEL_CLOSED);
		unlockScroll();
		setBackgroundInert(false);
		if (restoreFocus) trigger.focus();
		if (reduceMotion.matches) {
			panel.hidden = true;
			return;
		}
		hideTimer = window.setTimeout(() => {
			if (!isOpen) panel.hidden = true;
		}, closeDuration());
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
export { initTheme as i, lockScroll as n, unlockScroll as r, initBurgerMenu as t };

//# sourceMappingURL=main.js.map