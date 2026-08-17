/* =========================================================
   THE GREAT LIBRARY OF PHILOSOPHY — HOME ENHANCEMENT JS
   ---------------------------------------------------------
   This file is intended for index.html ONLY.

   It does NOT replace script.js.
   It does NOT control themes, reading settings, search,
   language switching, or your existing navigation.

   It only adds:
   - accessible labels for icon controls
   - skip-to-content link
   - gentle scroll reveal
   - reading progress indicator
   - safe decorative-image handling
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     1. ENABLE ENHANCEMENT MODE
     ------------------------------------------------------- */

  document.documentElement.classList.add("js-motion");


  /* -------------------------------------------------------
     2. SKIP LINK
     ------------------------------------------------------- */

  const hero = document.querySelector(".home-hero");

  if (hero) {

    // Give the hero a stable target without changing HTML.
    if (!hero.id) {
      hero.id = "main-content";
    }

    // Create skip link only if one does not already exist.
    if (!document.querySelector(".skip-link")) {

      const skipLink = document.createElement("a");

      skipLink.className = "skip-link";
      skipLink.href = "#main-content";
      skipLink.textContent = "Skip to main content";

      document.body.prepend(skipLink);
    }
  }


  /* -------------------------------------------------------
     3. ACCESSIBLE LABELS FOR ICON-ONLY CONTROLS
     ------------------------------------------------------- */

  const controls = [
    {
      selector: ".menu-toggle",
      label: "Open navigation menu"
    },
    {
      selector: ".search-toggle",
      label: "Open search"
    },
    {
      selector: ".language-toggle",
      label: "Choose language"
    },
    {
      selector: ".appearance-toggle",
      label: "Open reading and appearance settings"
    },
    {
      selector: ".back-to-top",
      label: "Back to top"
    }
  ];

  controls.forEach(control => {

    document.querySelectorAll(control.selector).forEach(element => {

      if (
        !element.getAttribute("aria-label") &&
        !element.getAttribute("title")
      ) {
        element.setAttribute("aria-label", control.label);
      }

    });

  });


  /* -------------------------------------------------------
     4. DECORATIVE ELEMENTS
     ------------------------------------------------------- */

  // Your large Φ in the hero is decorative.
  const heroSymbol = document.querySelector(".home-hero::before");

  // CSS pseudo-elements cannot be selected with JS,
  // so nothing needs to be changed here.
  // The CSS already uses pointer-events: none.


  /* -------------------------------------------------------
     5. SCROLL REVEAL
     ------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".about-home, " +
    ".why-philosophy, " +
    ".explore, " +
    ".books, " +
    ".quotes, " +
    ".questions, " +
    ".card, " +
    ".fact-box"
  );

  revealElements.forEach((element, index) => {

    // Do not overwrite an existing reveal class.
    if (!element.classList.contains("reveal")) {
      element.classList.add("reveal");
    }

    // Small stagger between elements.
    const delay = (index % 5) + 1;
    element.dataset.delay = delay;

  });


  /* -------------------------------------------------------
     6. INTERSECTION OBSERVER
     ------------------------------------------------------- */

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            observerInstance.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    document
      .querySelectorAll(".js-motion .reveal")
      .forEach(element => observer.observe(element));

  } else {

    // Older browsers:
    document
      .querySelectorAll(".reveal")
      .forEach(element => {
        element.classList.add("is-visible");
      });

  }


  /* -------------------------------------------------------
     7. READING PROGRESS BAR
     ------------------------------------------------------- */

  if (!document.querySelector(".read-progress")) {

    const progress = document.createElement("div");

    progress.className = "read-progress";
    progress.setAttribute("aria-hidden", "true");

    document.body.appendChild(progress);

  }

  const progressBar = document.querySelector(".read-progress");


  function updateReadingProgress() {

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {

      progressBar.style.transform = "scaleX(0)";
      return;

    }

    const scrollPosition = window.scrollY;

    const percentage =
      Math.min(
        Math.max(scrollPosition / documentHeight, 0),
        1
      );

    progressBar.style.transform =
      `scaleX(${percentage})`;

  }


  window.addEventListener(
    "scroll",
    updateReadingProgress,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateReadingProgress,
    { passive: true }
  );

  updateReadingProgress();


  /* -------------------------------------------------------
     8. DECORATIVE EMOJI / SYMBOLS
     ------------------------------------------------------- */

  // Only mark elements explicitly intended as decorative.
  // This avoids accidentally hiding meaningful text.

  document
    .querySelectorAll("[data-decorative]")
    .forEach(element => {
      element.setAttribute("aria-hidden", "true");
    });


  /* -------------------------------------------------------
     9. REDUCED MOTION
     ------------------------------------------------------- */

  const reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion && reducedMotion.matches) {

    document
      .querySelectorAll(".reveal")
      .forEach(element => {
        element.classList.add("is-visible");
      });

  }

});

const hero = document.querySelector(".home-hero");

if (hero) {
    if (!hero.id) {
        hero.id = "main-content";
    }
}