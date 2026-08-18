(() => {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);
  function prepareCharHeadings() {
    HT.prepareHeadingChars('.why-hitech .why-hitech__heading h2');
  }
  function setInitialStates() {
    gsap.set('.why-hitech .heading-tag-box', { autoAlpha: 0, y: 18 });
    gsap.set('.why-hitech .js-char-inner',   { yPercent: 115, skewY: 4 });
    gsap.set('.why-hitech__item',            { autoAlpha: 0, y: 46 });
  }
  function runNumberCounters() {
    HT.counterUp('.why-hitech__number h5', { duration: 1.4, stagger: 0.12, ease: 'expo.out', padZero: true });
  }
  function buildEntrance() {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      scrollTrigger: {
        trigger : '.why-hitech',
        start   : 'top 70%',
        once    : true,
      },
    });

    tl.to('.why-hitech .heading-tag-box',
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0
    );
    tl.to('.why-hitech .js-char-inner',
      {
        yPercent : 0,
        skewY    : 0,
        duration : 0.9,
        stagger  : { each: 0.018, from: 'start' },
      },
      0.15
    );
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
  function initImageSwap() {
    const items  = document.querySelectorAll('.why-hitech__item');
    if (!items.length || !images.length) return;
    items.forEach(item => {
      item.addEventListener('mouseenter', () => activate(item.dataset.content));
    });
  }
  function initShapeMotion() {
    const shape = document.querySelector('.why-hitech__shape');
    if (!shape) return;

    HT.shapeMotion(shape, {
      load  : { from: { left: -60 },  to: { left: 0, duration: 1.6 } },
      float : { from: { bottom: -16 }, to: { bottom: 0, duration: 2.4 } },
      triggerEl: '.why-hitech',
      scroll: {
        to: { left: -40 },
        scrollTriggerVars: { trigger: '.why-hitech', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      },
    });
  }
  function initMagneticNumbers() {
    HT.magneticHover('.why-hitech__number', 0.18);
  }
  function boot() {
    prepareCharHeadings();
    setInitialStates();
    buildEntrance();
    initImageSwap();
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