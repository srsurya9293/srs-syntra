// ================================
// HOME PAGE PARALLAX
// ================================

const background = document.querySelector(".parallax-bg");
const app = document.getElementById("app");

const parallaxStrength = 0.025;

function isHomePage() {
    return location.hash === "#home";
}

function updateParallax() {
    if (!isHomePage()) return;

    const scrollY = window.scrollY;
    const movement = scrollY * parallaxStrength;

    background.style.transform =
        `translate3d(0, ${-movement}px, 0)`;
}

function showParallax() {
    background.style.display = "block";

    requestAnimationFrame(() => {
        background.classList.add("visible");
        updateParallax();
    });
}

function hideParallax() {
    background.classList.remove("visible");

    setTimeout(() => {
        if (!isHomePage()) {
            background.style.display = "none";
        }
    }, 200);

    background.style.transform =
        "translate3d(0, 0, 0)";
}

/*
    The router adds .page-fade while loading a page
    and removes it when the page is ready.

    The parallax appears only when .page-fade is removed.
*/

const observer = new MutationObserver(() => {

    if (
        isHomePage() &&
        !app.classList.contains("page-fade")
    ) {
        showParallax();
    }

});

observer.observe(app, {
    attributes: true,
    attributeFilter: ["class"]
});

window.addEventListener("scroll", updateParallax);

window.addEventListener("popstate", () => {

    if (!isHomePage()) {
        hideParallax();
    }

});

const originalPushState = history.pushState;

history.pushState = function (...args) {

    originalPushState.apply(this, args);

    if (!isHomePage()) {
        hideParallax();
    }

};

if (!isHomePage()) {
    background.style.display = "none";
} else {
    background.style.display = "none";
}

// ================================
// EXPANDED PLAYER PARALLAX
// ================================

