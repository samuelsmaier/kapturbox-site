/* KapturBox — engraved studio.
   Core navigation and proof interactions work everywhere. Capable desktops
   add still Hermes, hero grain, and restrained entrances. */

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wide = window.matchMedia("(min-width: 821px)").matches;
  var enhanced = wide && !reduce && window.gsap && window.ScrollTrigger;
  var darkMode = document.body.classList.contains("dark");

  /* ---- auto-meter helpers (countdown bar before next step) ---- */
  function meterStop(el) {
    if (!el) return;
    el.classList.remove("is-running", "is-paused");
  }
  function meterRun(el, ms) {
    if (!el || reduce) return;
    meterStop(el);
    el.style.setProperty("--auto-ms", ms + "ms");
    /* restart CSS animation cleanly */
    void el.offsetWidth;
    el.classList.add("is-running");
  }
  function meterPause(el) {
    if (!el) return;
    el.classList.add("is-paused");
  }
  function meterResume(el) {
    if (!el) return;
    el.classList.remove("is-paused");
  }

  /* ---- testimonial deck: buttons, keyboard, swipe, auto-advance ---- */
  var reviews = document.getElementById("reviews");
  if (reviews) {
    var deckEl = reviews.querySelector(".deck");
    var deckItems = [].slice.call(deckEl.children);
    var deckCounter = reviews.querySelector(".deck-counter");
    var deckMeter = reviews.querySelector("[data-deck-meter]");
    var deckFill = deckMeter && deckMeter.querySelector(".auto-meter-fill");
    var quoteIndex = 0;
    var swipeStart = null;
    var deckPaused = false;
    var deckInView = false;
    var DECK_MS = 7000;

    function setQuote(index) {
      quoteIndex = (index + deckItems.length) % deckItems.length;
      deckEl.style.setProperty("--di", quoteIndex);
      deckItems.forEach(function (item, itemIndex) {
        item.setAttribute("aria-hidden", itemIndex === quoteIndex ? "false" : "true");
      });
      if (deckCounter) deckCounter.textContent = (quoteIndex + 1) + " / " + deckItems.length;
    }

    function stopDeckAuto() {
      meterStop(deckMeter);
    }

    function startDeckTimer() {
      if (reduce || deckPaused || !deckInView || deckItems.length < 2) {
        stopDeckAuto();
        return;
      }
      meterRun(deckMeter, DECK_MS);
    }

    function bumpDeck(delta) {
      setQuote(quoteIndex + delta);
      startDeckTimer();
    }

    if (deckFill) {
      deckFill.addEventListener("animationend", function () {
        if (deckPaused || !deckInView) return;
        setQuote(quoteIndex + 1);
        startDeckTimer();
      });
    }

    setQuote(0);
    reviews.querySelector("[data-deck-prev]").addEventListener("click", function () {
      bumpDeck(-1);
    });
    reviews.querySelector("[data-deck-next]").addEventListener("click", function () {
      bumpDeck(1);
    });
    deckEl.addEventListener("pointerdown", function (event) { swipeStart = event.clientX; });
    deckEl.addEventListener("pointerup", function (event) {
      if (swipeStart === null) return;
      var distance = event.clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(distance) < 45) return;
      bumpDeck(distance < 0 ? 1 : -1);
    });
    deckEl.addEventListener("pointercancel", function () { swipeStart = null; });

    /* pause auto while hovered / focused (bar freezes, does not reset) */
    reviews.addEventListener("pointerenter", function () {
      deckPaused = true;
      meterPause(deckMeter);
    });
    reviews.addEventListener("pointerleave", function () {
      deckPaused = false;
      if (deckMeter && deckMeter.classList.contains("is-running")) meterResume(deckMeter);
      else startDeckTimer();
    });
    reviews.addEventListener("focusin", function () {
      deckPaused = true;
      meterPause(deckMeter);
    });
    reviews.addEventListener("focusout", function (event) {
      if (reviews.contains(event.relatedTarget)) return;
      deckPaused = false;
      if (deckMeter && deckMeter.classList.contains("is-running")) meterResume(deckMeter);
      else startDeckTimer();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          deckInView = entry.isIntersecting;
          if (deckInView) startDeckTimer();
          else stopDeckAuto();
        });
      }, { threshold: 0.35 }).observe(reviews);
    } else {
      deckInView = true;
      startDeckTimer();
    }
  }

  /* ---- in-page navigation ---- */
  [].slice.call(document.querySelectorAll("[data-goto]")).forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.getElementById(link.dataset.goto);
      if (!target) return;
      event.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });

  if (!enhanced) return;

  document.body.classList.add("page");
  document.documentElement.style.scrollBehavior = "auto";
  gsap.registerPlugin(ScrollTrigger);

  /* ---- hero plate ----
     Dark: still cutout only. Motion video + CSS mask kept leaving a dark
     matte on charcoal; the engraving still is the plate that already looks
     right (Sam's reference). Light can still use masked motion if present. */
  var heroStill = darkMode ? "assets/hermes-dark.png" : "assets/hermes-cut.png";
  var heroImg = document.querySelector(".hero-art img");
  if (heroImg) {
    heroImg.src = heroStill;
    if (!darkMode) {
      var motion = document.createElement("video");
      motion.className = "hero-motion";
      motion.muted = true;
      motion.loop = true;
      motion.autoplay = true;
      motion.playsInline = true;
      motion.setAttribute("aria-hidden", "true");
      motion.poster = heroStill;
      motion.src = "assets/hermes-motion.mp4";
      motion.width = 828;
      motion.height = 1108;
      heroImg.parentNode.appendChild(motion);
      motion.play().catch(function () { motion.remove(); });
    }
  }

  /* ---- hero atmosphere: charcoal + aquatint only (no clouds, no city).
     Grain eases slightly from hero → mid-page. */
  function paintGrain() {
    var fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9));
    var grain = (0.07 + 0.03 * fade).toFixed(3); /* ~0.10 hero → 0.07 mid */
    if (document.body.__grain !== grain) {
      document.body.__grain = grain;
      document.body.style.setProperty("--grain", grain);
    }
  }
  window.addEventListener("scroll", paintGrain, { passive: true });
  paintGrain();

  /* ---- quiet entrances ---- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  [].slice.call(document.querySelectorAll(".stop--brands, .stop--about, .stop--join")).forEach(function (section) {
    observer.observe(section);
  });

  gsap.from(".stop--work .eyebrow, .stop--work .section-title", {
    opacity: 0, y: 18, duration: 0.7, ease: "power2.out", stagger: 0.08,
    scrollTrigger: { trigger: ".stop--work", start: "top 72%", once: true }
  });

  /* frieze: seamless infinite row. Originals are cloned once so Cuts
     is followed by Mixed in the track; after each step we modulo the
     translate so the loop never jumps. Auto + chevrons step one panel.
     Transform is only on #frieze — never on tiles (hover/entrance stay
     off the item box so originals and clones stay the same size). */
  var frieze = document.getElementById("frieze");
  var friezeViewport = document.getElementById("frieze-viewport");
  var friezePrev = document.querySelector("[data-frieze-prev]");
  var friezeNext = document.querySelector("[data-frieze-next]");
  var friezeMeter = document.querySelector("[data-frieze-meter]");
  var friezeFill = friezeMeter && friezeMeter.querySelector(".auto-meter-fill");
  var friezeRack = document.querySelector(".frieze-rack");
  var friezeX = 0;
  var friezePaused = false;
  var friezeInView = false;
  var friezeTweening = false;
  var friezeLoopW = 0;
  var friezeStep = 0;
  var FRIEZE_MS = 4500;
  var FRIEZE_TILE = 228;
  var FRIEZE_GAP = 18;

  function measureFrieze() {
    /* fixed geometry — don't re-read offsetWidth after hover/transform */
    var originals = frieze
      ? frieze.querySelectorAll(".frieze-item:not(.frieze-item--clone)")
      : [];
    var n = originals.length || 10;
    friezeStep = FRIEZE_TILE + FRIEZE_GAP;
    friezeLoopW = n * friezeStep;
  }

  function normalizeFriezeX(x) {
    if (friezeLoopW < 1) return 0;
    x = x % friezeLoopW;
    if (x < 0) x += friezeLoopW;
    return x;
  }

  if (frieze && friezeViewport) {
    /* clone before any GSAP touches the tiles */
    var seed = [].slice.call(frieze.querySelectorAll(".frieze-item:not(.frieze-item--clone)"));
    seed.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.classList.add("frieze-item--clone");
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("style");
      var imgs = clone.querySelectorAll("img");
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].alt = "";
        imgs[i].removeAttribute("style");
      }
      frieze.appendChild(clone);
    });

    measureFrieze();

    /* opacity-only entrance — never y/transform on tiles (breaks seamless) */
    gsap.from(".frieze-item:not(.frieze-item--clone)", {
      opacity: 0,
      duration: 0.85,
      ease: "power2.out",
      stagger: 0.06,
      clearProps: "opacity",
      scrollTrigger: { trigger: ".stop--work", start: "top 72%", once: true }
    });

    function applyFriezeX(x, duration) {
      var dur = duration == null ? 0 : duration;
      friezeTweening = true;
      gsap.to(frieze, {
        x: -x,
        duration: dur,
        ease: dur < 0.05 ? "none" : "power2.out",
        overwrite: true,
        force3D: true,
        onComplete: function () {
          var n = normalizeFriezeX(x);
          friezeX = n;
          gsap.set(frieze, { x: -n, force3D: true });
          friezeTweening = false;
        }
      });
    }

    function stepFrieze(direction, duration) {
      if (friezeStep < 1 || friezeLoopW < 1) measureFrieze();
      if (friezeStep < 1 || friezeLoopW < 1) return;
      var live = -parseFloat(gsap.getProperty(frieze, "x"));
      if (!isFinite(live)) live = friezeX;
      var target = live + direction * friezeStep;
      friezeX = target;
      applyFriezeX(target, duration == null ? 0.48 : duration);
    }

    function stopFriezeAuto() {
      meterStop(friezeMeter);
    }

    function startFriezeTimer() {
      if (reduce || friezePaused || !friezeInView || friezeLoopW < 8) {
        stopFriezeAuto();
        return;
      }
      meterRun(friezeMeter, FRIEZE_MS);
    }

    if (friezeFill) {
      friezeFill.addEventListener("animationend", function () {
        if (friezePaused || !friezeInView || friezeTweening) return;
        stepFrieze(1, 0.7);
        startFriezeTimer();
      });
    }

    if (friezePrev) {
      friezePrev.disabled = false;
      friezePrev.addEventListener("click", function (event) {
        event.preventDefault();
        stepFrieze(-1);
        startFriezeTimer();
      });
    }
    if (friezeNext) {
      friezeNext.disabled = false;
      friezeNext.addEventListener("click", function (event) {
        event.preventDefault();
        stepFrieze(1);
        startFriezeTimer();
      });
    }

    if (friezeRack) {
      friezeRack.addEventListener("pointerenter", function () {
        friezePaused = true;
        meterPause(friezeMeter);
      });
      friezeRack.addEventListener("pointerleave", function () {
        friezePaused = false;
        if (friezeMeter && friezeMeter.classList.contains("is-running")) meterResume(friezeMeter);
        else startFriezeTimer();
      });
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        friezeInView = entry.isIntersecting;
        if (friezeInView) startFriezeTimer();
        else stopFriezeAuto();
      });
    }, { threshold: 0.3 }).observe(document.querySelector(".stop--work") || friezeViewport);

    gsap.set(frieze, { x: 0, force3D: true });
  }

  window.addEventListener("resize", function () { ScrollTrigger.refresh(); });
})();
