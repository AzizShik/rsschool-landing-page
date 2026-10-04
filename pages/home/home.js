/* empty css              */
import { i as initTheme, t as initBurgerMenu } from "../../js/main.js";
//#region src/js/slider.js
function wrapIndex(target, length) {
	return (target % length + length) % length;
}
function initSlider() {
	const slider = document.querySelector(".slider");
	const controls = document.querySelector(".slider__controls");
	const status = document.querySelector("[data-slider-status]");
	if (!slider || !controls) return;
	const track = slider.querySelector(".slider__track");
	const viewport = slider.querySelector(".slider__viewport");
	const slides = [...slider.querySelectorAll(".slide")];
	const prevButton = slider.querySelector(".slider__arrow--prev");
	const nextButton = slider.querySelector(".slider__arrow--next");
	if (!track || !viewport || slides.length === 0) return;
	const SWIPE_THRESHOLD_PX = 40;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let index = 0;
	let position = 1;
	let touchStartX = null;
	let dragStartX = null;
	const firstClone = slides[0].cloneNode(true);
	const lastClone = slides[slides.length - 1].cloneNode(true);
	firstClone.setAttribute("aria-hidden", "true");
	lastClone.setAttribute("aria-hidden", "true");
	track.prepend(lastClone);
	track.append(firstClone);
	const indicators = slides.map((_, position) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "slider__control";
		button.setAttribute("aria-label", `Go to slide ${position + 1} of ${slides.length}`);
		button.addEventListener("click", () => goTo(position));
		controls.append(button);
		return button;
	});
	function paint() {
		track.style.transform = `translateX(-${position * 100}%)`;
	}
	function paintWithoutAnimation() {
		track.style.transition = "none";
		paint();
		track.offsetWidth;
		track.style.transition = "";
	}
	function render() {
		paint();
		indicators.forEach((indicator, position) => {
			const isCurrent = position === index;
			indicator.classList.toggle("is-active", isCurrent);
			indicator.toggleAttribute("aria-current", isCurrent);
		});
		if (status) status.textContent = `Slide ${index + 1} of ${slides.length}`;
	}
	function goTo(target) {
		const next = wrapIndex(target, slides.length);
		if (position === 0 || position === slides.length + 1) {
			position = position === 0 ? slides.length : 1;
			paintWithoutAnimation();
		}
		if (reduceMotion.matches) position = next + 1;
		else if (next === wrapIndex(index - 1, slides.length)) position -= 1;
		else if (next === wrapIndex(index + 1, slides.length)) position += 1;
		else position = next + 1;
		index = next;
		render();
	}
	track.addEventListener("transitionend", (event) => {
		if (event.propertyName !== "transform") return;
		if (position === 0 || position === slides.length + 1) {
			position = position === 0 ? slides.length : 1;
			paintWithoutAnimation();
		}
	});
	prevButton?.addEventListener("click", () => goTo(index - 1));
	nextButton?.addEventListener("click", () => goTo(index + 1));
	function finishSwipe(deltaX) {
		if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
		goTo(index + (deltaX < 0 ? 1 : -1));
	}
	viewport.addEventListener("touchstart", (event) => {
		touchStartX = event.touches[0].clientX;
	}, { passive: true });
	viewport.addEventListener("touchend", (event) => {
		if (touchStartX === null) return;
		const deltaX = event.changedTouches[0].clientX - touchStartX;
		touchStartX = null;
		finishSwipe(deltaX);
	});
	viewport.addEventListener("touchcancel", () => {
		touchStartX = null;
	});
	viewport.addEventListener("mousedown", (event) => {
		if (event.button !== 0) return;
		dragStartX = event.clientX;
		event.preventDefault();
	});
	viewport.addEventListener("mouseup", (event) => {
		if (dragStartX === null) return;
		const deltaX = event.clientX - dragStartX;
		dragStartX = null;
		finishSwipe(deltaX);
	});
	viewport.addEventListener("mouseleave", () => {
		dragStartX = null;
	});
	paintWithoutAnimation();
	render();
}
//#endregion
//#region src/js/heroVideo.js
var REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function initHeroVideo() {
	const video = document.querySelector("[data-hero-video]");
	if (!video) return;
	if (window.matchMedia(REDUCED_MOTION).matches) return;
	video.play().catch(() => {});
}
//#endregion
//#region src/pages/home/home.js
initTheme();
initBurgerMenu();
initSlider();
initHeroVideo();
//#endregion
