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
var STORAGE_KEY = "theme";
var THEME_ATTRIBUTE = "data-theme";
function getStoredTheme() {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}
function getPreferredTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function getCurrentTheme() {
	return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "dark" ? "dark" : "light";
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
	document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
	try {
		localStorage.setItem(STORAGE_KEY, theme);
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
//#region src/js/main.js
initTheme();
//#endregion

//# sourceMappingURL=main-BOtYsQCO.js.map