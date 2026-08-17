```javascript
/* =========================================================
   THE GREAT LIBRARY OF PHILOSOPHY
   HISTORY PAGE — ENHANCEMENT SCRIPT

   Load AFTER script.js:

       <script src="script.js" defer></script>
       <script src="history-enhance.js" defer></script>

   Adds:
   - Empty-paragraph cleanup
   - Skip link
   - Decorative emoji accessibility
   - Nested link/button accessibility fix
   - Image optimization
   - Era jump navigation
   - Scroll reveal
   - Reading progress bar

   Designed to work with:
   style.css
   home-refine.css
   history-refine.css

   Does not replace existing site-wide JavaScript.
   ========================================================= */

(function () {
    'use strict';

    /* =====================================================
       1. MOTION PREFERENCE
       ===================================================== */

    var reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!reduceMotion) {
        document.documentElement.classList.add('js-motion');
    }


    /* =====================================================
       2. DOM READY
       ===================================================== */

    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }


    ready(function () {


        /* =================================================
           3. CLEAN EMPTY INTRODUCTION PARAGRAPHS

           history.html may contain invalid nested <p>
           markup. The browser can create empty paragraphs
           during parsing.

           We remove ONLY genuinely empty paragraphs.
           ================================================= */

        document.querySelectorAll('.intro-text p').forEach(function (p) {

            var hasText = p.textContent.trim();
            var hasMedia = p.querySelector('img, a, video, figure');

            if (!hasText && !hasMedia) {
                p.remove();
            }

        });


        /* =================================================
           4. SKIP LINK + MAIN LANDMARK

           Prefer <main>.

           .home-hero is only a fallback because your
           website uses the shared hero structure.
           ================================================= */

        var main =
            document.querySelector('main') ||
            document.querySelector('.home-hero');

        if (main && !document.querySelector('.skip-link')) {

            if (!main.id) {
                main.id = 'main-content';
            }

            if (!main.hasAttribute('tabindex')) {
                main.setAttribute('tabindex', '-1');
            }

            var skip = document.createElement('a');

            skip.className = 'skip-link';
            skip.href = '#' + main.id;
            skip.textContent = 'Skip to content';

            document.body.insertBefore(
                skip,
                document.body.firstChild
            );
        }


        /* =================================================
           5. DECORATIVE EMOJIS

           Emojis used purely as visual heading decoration
           should not be unnecessarily announced by screen
           readers.

           Example:

               🏛 Ancient Greece

           becomes visually identical, while the emoji is
           aria-hidden.
           ================================================= */

        var EMOJI = /^([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\s+)/u;

        document.querySelectorAll(
            '.era-content h2, ' +
            '.philosopher-info h2, ' +
            '.world-philosophy > h2'
        ).forEach(function (heading) {

            var first = heading.firstChild;

            if (!first || first.nodeType !== Node.TEXT_NODE) {
                return;
            }

            var match = first.nodeValue.match(EMOJI);

            if (!match) {
                return;
            }

            var glyph = document.createElement('span');

            glyph.className = 'heading-glyph';
            glyph.setAttribute('aria-hidden', 'true');
            glyph.textContent = match[1];

            first.nodeValue =
                first.nodeValue.slice(match[1].length);

            heading.insertBefore(glyph, first);

        });


        /* Decorative world icons */

        document.querySelectorAll('.world-icon').forEach(function (icon) {
            icon.setAttribute('aria-hidden', 'true');
        });


        /* =================================================
           6. ACCESSIBILITY FOR <a><button>

           Existing markup may contain:

               <a>
                   <button>Start Reading</button>
               </a>

           We keep the visual button but remove the inner
           button from the keyboard/accessibility sequence.
           ================================================= */

        document.querySelectorAll('a > button').forEach(function (button) {

            button.setAttribute('tabindex', '-1');
            button.setAttribute('aria-hidden', 'true');

            var link = button.parentElement;

            if (
                link &&
                !link.hasAttribute('aria-label')
            ) {

                var label = button.textContent
                    .replace(/[→\s]+$/, '')
                    .trim();

                if (label) {
                    link.setAttribute('aria-label', label);
                }
            }

        });


        /* =================================================
           7. IMAGE OPTIMIZATION

           - Preserve existing alt text.
           - Add empty alt only when missing.
           - Add async decoding when unspecified.
           - Keep first image eager.
           - Lazy-load images after the first one.
           ================================================= */

        document.querySelectorAll('img').forEach(function (img, index) {

            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
            }

            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            if (
                index > 0 &&
                !img.hasAttribute('loading')
            ) {
                img.setAttribute('loading', 'lazy');
            }

        });


        /* =================================================
           8. ERA JUMP NAVIGATION

           Creates the small right-side navigation dots
           on larger screens.

           Includes:
           - History sections
           - Era sections
           - World philosophy section
           - Quote section
           ================================================= */

        var eras = Array.prototype.slice.call(
            document.querySelectorAll(
                '.era, ' +
                '.history-section-title, ' +
                '.world-philosophy, ' +
                '.quote'
            )
        );

        if (
            eras.length > 2 &&
            window.innerWidth > 1100 &&
            !document.querySelector('.era-nav')
        ) {

            var nav = document.createElement('nav');

            nav.className = 'era-nav';
            nav.setAttribute(
                'aria-label',
                'Jump to history section'
            );

            eras.forEach(function (section, index) {

                if (!section.id) {
                    section.id = 'era-' + (index + 1);
                }

                var heading = section.querySelector('h2');

                var label = heading
                    ? heading.textContent
                        .replace(EMOJI, '')
                        .split('(')[0]
                        .trim()
                    : 'Section ' + (index + 1);

                var link = document.createElement('a');

                link.href = '#' + section.id;
                link.setAttribute('aria-label', label);

                var tooltip = document.createElement('span');

                tooltip.textContent = label;

                link.appendChild(tooltip);
                nav.appendChild(link);

            });

            document.body.appendChild(nav);


            /* Make navigation visible after insertion */

            requestAnimationFrame(function () {
                nav.classList.add('is-ready');
            });


            /* ---------------------------------------------
               Current-section tracking
               --------------------------------------------- */

            if ('IntersectionObserver' in window) {

                var dots = nav.querySelectorAll('a');

                var spy = new IntersectionObserver(
                    function (entries) {

                        entries.forEach(function (entry) {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            var index = eras.indexOf(
                                entry.target
                            );

                            dots.forEach(function (dot, dotIndex) {

                                dot.classList.toggle(
                                    'is-current',
                                    dotIndex === index
                                );

                            });

                        });

                    },
                    {
                        rootMargin: '-45% 0px -45% 0px'
                    }
                );

                eras.forEach(function (section) {
                    spy.observe(section);
                });

            }

        }


        /* =================================================
           9. SCROLL REVEAL

           history-refine.css controls the visual animation.

           JS only adds:
               .reveal
               .is-visible
               data-delay

           If reduced motion is enabled, no reveal animation
           is created.
           ================================================= */

        if (
            !reduceMotion &&
            'IntersectionObserver' in window
        ) {

            var targets = document.querySelectorAll(
                '.schools > h2, ' +
                '.intro-text > p, ' +
                '.world-philosophy > h2, ' +
                '.world-intro, ' +
                '.world-card, ' +
                '.history-section-title > *, ' +
                '.era, ' +
                '.philosopher, ' +
                '.quote > *, ' +
                '.history-summary > *'
            );

            var counters = {};

            targets.forEach(function (element) {

                element.classList.add('reveal');

                var parentKey =
                    element.parentElement
                        ? element.parentElement.className
                        : 'history-element';

                counters[parentKey] =
                    (counters[parentKey] || 0) + 1;

                var delayIndex = counters[parentKey];

                if (
                    delayIndex > 1 &&
                    delayIndex <= 5
                ) {

                    element.setAttribute(
                        'data-delay',
                        String(delayIndex - 1)
                    );

                }

            });


            var revealObserver =
                new IntersectionObserver(
                    function (entries) {

                        entries.forEach(function (entry) {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            entry.target.classList.add(
                                'is-visible'
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        });

                    },
                    {
                        rootMargin: '0px 0px -8% 0px',
                        threshold: 0.06
                    }
                );


            targets.forEach(function (element) {
                revealObserver.observe(element);
            });

        }


        /* =================================================
           10. READING PROGRESS BAR

           Only create one progress bar.

           history-refine.css controls its appearance.
           ================================================= */

        if (
            !reduceMotion &&
            !document.querySelector('.read-progress')
        ) {

            var progress = document.createElement('div');

            progress.className = 'read-progress';
            progress.setAttribute('aria-hidden', 'true');

            document.body.appendChild(progress);


            var ticking = false;


            function updateProgress() {

                var documentElement =
                    document.documentElement;

                var max =
                    documentElement.scrollHeight -
                    documentElement.clientHeight;

                var progressValue =
                    max > 0
                        ? documentElement.scrollTop / max
                        : 0;

                progress.style.transform =
                    'scaleX(' +
                    progressValue.toFixed(4) +
                    ')';

                ticking = false;
            }


            window.addEventListener(
                'scroll',
                function () {

                    if (ticking) {
                        return;
                    }

                    ticking = true;

                    requestAnimationFrame(
                        updateProgress
                    );

                },
                {
                    passive: true
                }
            );


            updateProgress();
        }

    });

})();
```
