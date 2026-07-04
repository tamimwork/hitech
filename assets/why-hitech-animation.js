(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ════════════════════════════════════════════════════════════
      STEP 1 — CHAR-SPLIT HEADING PREP
      .why-hitech সেকশনের ভেতরে .at-char-animation ক্লাসওয়ালা হেডিং-এর
      প্রতিটি character আলাদা span-এ wrap করা হচ্ছে, যাতে
      character-by-character clip-reveal করা যায়।
   ════════════════════════════════════════════════════════════ */
  function prepareCharHeadings() {
    document.querySelectorAll('.why-hitech .why-hitech__heading h2').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML     = '';
      el.style.display = 'block';

      words.forEach((word, wi) => {
        const wordSpan = document.createElement('span');
        wordSpan.className     = 'js-char-word';
        wordSpan.style.cssText = 'display:inline-block; white-space:nowrap;';

        [...word].forEach(ch => {
          const outer = document.createElement('span');
          outer.className     = 'js-char-outer';
          outer.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:top;';

          const inner = document.createElement('span');
          inner.className     = 'js-char-inner';
          inner.style.cssText = 'display:inline-block; will-change:transform;';
          inner.textContent   = ch;

          outer.appendChild(inner);
          wordSpan.appendChild(outer);
        });

        el.appendChild(wordSpan);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 2 — INITIAL STATES
      Animation শুরুর আগেই সব element hide/reset করে রাখা হচ্ছে
      (FOUC এড়ানোর জন্য)।
   ════════════════════════════════════════════════════════════ */
  function setInitialStates() {
    gsap.set('.why-hitech .heading-tag-box', { autoAlpha: 0, y: 18 });
    gsap.set('.why-hitech .js-char-inner',   { yPercent: 115, skewY: 4 });
    gsap.set('.why-hitech__img-box',         { clipPath: 'inset(0% 0% 100% 0% round 12px)' });
    gsap.set('.why-hitech__item',            { autoAlpha: 0, y: 46 });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 3 — NUMBER COUNTER
      .why-hitech__number h5 (01, 02, 03, 04) — 0 থেকে count-up,
      leading-zero ফরম্যাট ঠিক রেখে (hero counter-এর মতো expo.out snap)।
   ════════════════════════════════════════════════════════════ */
  function runNumberCounters() {
    document.querySelectorAll('.why-hitech__number h5').forEach((h5, i) => {
      const original = h5.textContent.trim();
      const digits    = original.length;
      const endVal    = parseInt(original, 10);
      if (isNaN(endVal)) return;

      const proxy = { n: 0 };
      gsap.to(proxy, {
        n        : endVal,
        duration : 1.4,
        delay    : i * 0.12,
        ease     : 'expo.out',
        onUpdate()  { h5.textContent = String(Math.round(proxy.n)).padStart(digits, '0'); },
        onComplete(){ h5.textContent = original; },
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 4 — ENTRANCE TIMELINE
      hero-র মতো page-load-এ না চলে, এখানে section viewport-এ
      আসলে (ScrollTrigger) সব animation একসাথে চলবে।
   ════════════════════════════════════════════════════════════ */
  function buildEntrance() {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      scrollTrigger: {
        trigger : '.why-hitech',
        start   : 'top 70%',
        once    : true,
      },
    });

    // ① ট্যাগ লেবেল ("Why Hi-Tech")
    tl.to('.why-hitech .heading-tag-box',
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0
    );

    // ② হেডিং — character-by-character clip-reveal
    tl.to('.why-hitech .js-char-inner',
      {
        yPercent : 0,
        skewY    : 0,
        duration : 0.9,
        stagger  : { each: 0.018, from: 'start' },
      },
      0.15
    );

    // ③ ইমেজ-বক্স — নিচ থেকে clip-reveal (hero__autoplay-video-র প্যাটার্ন)
    tl.to('.why-hitech__img-box',
      { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.3, ease: 'expo.inOut' },
      0.3
    );

    // ④ আইটেমগুলো — stagger করে উপরে উঠে আসবে, সাথে number count-up শুরু
    tl.to('.why-hitech__item',
      {
        autoAlpha : 1,
        y         : 0,
        duration  : 0.8,
        stagger   : 0.12,
        onStart   : runNumberCounters,
      },
      0.55
    );

    return tl;
  }

  /* ════════════════════════════════════════════════════════════
      STEP 5 — IMAGE SWAP (hover interaction)
      .why-hitech__item-এ hover করলে data-content অনুযায়ী
      ম্যাচিং data-img-ওয়ালা ছবিটা crossfade হয়ে সামনে আসবে।
   ════════════════════════════════════════════════════════════ */
  function initImageSwap() {
    const items  = document.querySelectorAll('.why-hitech__item');
    const images = document.querySelectorAll('.why-hitech__img');
    if (!items.length || !images.length) return;

    function activate(key) {
      images.forEach(img => {
        const isMatch = img.dataset.img === key;
        gsap.to(img, {
          opacity   : isMatch ? 1 : 0,
          scale     : isMatch ? 1 : 1.06,
          duration  : 0.7,
          ease      : 'power3.out',
          overwrite : 'auto',
        });
      });
    }

    items.forEach(item => {
      item.addEventListener('mouseenter', () => activate(item.dataset.content));
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 6 — SHAPE MOTION (load + infinite float + scroll parallax)
      hero__shape অ্যানিমেশনের প্যাটার্ন অনুসরণ করে .why-hitech__shape-এ প্রয়োগ।
      Transform (x/y) এর বদলে left/bottom property ব্যবহার করা হয়েছে,
      যাতে অন্য কোনো transform animation-এর সাথে conflict না হয়।
   ════════════════════════════════════════════════════════════ */
  function initShapeMotion() {
    const shape = document.querySelector('.why-hitech__shape');
    if (!shape) return;

    // ১. Load animation — বামদিক থেকে ভেতরে চলে আসবে
    gsap.fromTo(shape,
      { left: -60 },
      { left: 0, duration: 1.6, ease: 'power3.out', delay: 0.2 }
    );

    // ২. Infinite float — bottom নিয়ে আস্তে আস্তে দোলনা (loop)
    gsap.fromTo(shape,
      { bottom: -16 },
      { bottom: 0, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2 }
    );

    // ৩. Scroll parallax — স্ক্রল করলে শেপ আবার বামে সরে যাবে
    gsap.to(shape, {
      left: -40,
      ease: 'none',
      scrollTrigger: {
        trigger : '.why-hitech',
        start   : 'top bottom',
        end     : 'bottom top',
        scrub   : 1.2,
      },
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 7 — MAGNETIC HOVER (big number)
      hero__video-icon-এর magnetic effect-টা .why-hitech__number-এ প্রয়োগ —
      mouse কাছে গেলে বড় নাম্বারটা হালকা সেদিকে সরে যাবে।
   ════════════════════════════════════════════════════════════ */
  function initMagneticNumbers() {
    document.querySelectorAll('.why-hitech__number').forEach(num => {
      num.addEventListener('mousemove', e => {
        const rect = num.getBoundingClientRect();
        const cx   = rect.left + rect.width  * 0.5;
        const cy   = rect.top  + rect.height * 0.5;
        const dx   = (e.clientX - cx) * 0.18;
        const dy   = (e.clientY - cy) * 0.18;

        gsap.to(num, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      });

      num.addEventListener('mouseleave', () => {
        gsap.to(num, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 8 — COLUMN PARALLAX (depth)
      left/right কলাম দুটো স্ক্রলে বিপরীত দিকে হালকা নড়বে (hero__heading-র মতো)।
   ════════════════════════════════════════════════════════════ */
  function initColumnParallax() {
    gsap.to('.why-hitech__left', {
      yPercent: -6,
      ease    : 'none',
      scrollTrigger: { trigger: '.why-hitech', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });

    gsap.to('.why-hitech__right', {
      yPercent: 6,
      ease    : 'none',
      scrollTrigger: { trigger: '.why-hitech', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 9 — LEFT IMAGE FULL SCROLL PARALLAX
      .why-hitech__img-box (frame) এবং তার ভেতরের আসল <img> — দুটো
      ভিন্ন গতিতে move করবে পুরো section scroll-এ (hero__autoplay-video
      + video-inner প্যারালাক্স প্যাটার্ন অনুসরণ করে), যাতে depth feel আসে।
   ════════════════════════════════════════════════════════════ */
  function initImageParallax() {
    const box  = document.querySelector('.why-hitech__img-box');
    const imgs = document.querySelectorAll('.why-hitech__img-box .why-hitech__img img');
    if (!box || !imgs.length) return;

    // ছবিগুলো box-এর চেয়ে বড় করে center করে রাখা হচ্ছে,
    // যাতে parallax-এ move করলেও কোনো ফাঁকা edge না দেখায়
    imgs.forEach(img => {
      img.style.width    = '140%';
      img.style.height   = '140%';
      img.style.maxWidth = 'none';
      img.style.position = 'relative';
      img.style.left     = '-20%';
      img.style.top      = '-20%';
    });

    // ১. Frame (.why-hitech__img-box) — হালকা parallax
    gsap.to(box, {
      yPercent: 12,
      ease    : 'none',
      scrollTrigger: {
        trigger : '.why-hitech',
        start   : 'top bottom',
        end     : 'bottom top',
        scrub   : 1.3,
      },
    });

    // ২. ভেতরের আসল ছবি — frame-এর চেয়ে দ্রুত/গভীর move করবে
    gsap.fromTo(imgs,
      { yPercent: -10 },
      {
        yPercent : 10,
        ease     : 'none',
        scrollTrigger: {
          trigger : '.why-hitech',
          start   : 'top bottom',
          end     : 'bottom top',
          scrub   : 1.6,
        },
      }
    );
  }

  /* ════════════════════════════════════════════════════════════
      BOOT — সব function একসাথে চালানো হচ্ছে
   ════════════════════════════════════════════════════════════ */
  function boot() {
    prepareCharHeadings();
    setInitialStates();
    buildEntrance();
    initImageSwap();
    initImageParallax();
    initShapeMotion();
    initMagneticNumbers();
    initColumnParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();