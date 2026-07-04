

(() => {
  'use strict';
 
  gsap.registerPlugin(ScrollTrigger);
 
  /* ════════════════════════════════════════════════════════════
      STEP 1 — HEADING PREP
      প্রতিটি h2-এর ভেতরে একটি wrapper div তৈরি করা হয়
      যাতে overflow:hidden দিয়ে নিচ থেকে clip-reveal হয়।
   ════════════════════════════════════════════════════════════ */
  function prepareHeadings() {
    document.querySelectorAll('.hero__heading h2').forEach(h2 => {
      h2.style.overflow = 'hidden';
      h2.style.display  = 'block';
 
      const inner = document.createElement('div');
      inner.className = 'js-h2-inner';
      inner.style.cssText = 'display:block; will-change:transform;';
      inner.innerHTML = h2.innerHTML;
 
      h2.innerHTML = '';
      h2.appendChild(inner);
    });
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 2 — INITIAL STATES
      Flash of Un-Animated Content (FOUC) রোধ করার জন্য
      সব animatable element আগেই hide করা হচ্ছে।
   ════════════════════════════════════════════════════════════ */
  function setInitialStates() {
    // Right-side video: নিচ থেকে clip করা (height = 0 effect)
    gsap.set('.hero__autoplay-video', {
      clipPath: 'inset(0% 0% 100% 0% round 20px)',
    });
 
    // Individually hide করা হচ্ছে যাতে specific animation দেওয়া যায়
    gsap.set('.hero-tag-line-wrap',          { autoAlpha: 0 });
    gsap.set('.hero__video',                 { autoAlpha: 0, x: -28 });
    gsap.set('.hero__video-icon',            { autoAlpha: 0, scale: 0 });
    gsap.set('.hero__count-item',            { autoAlpha: 0, y: 44 });
    gsap.set('.hero__right-video-content p', { autoAlpha: 0, y: 22 });
    gsap.set('.hero__video-tag-text',        { autoAlpha: 0, y: 30 });
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 3 — NUMBER COUNTER
      expo.out easing দিয়ে slot-machine / snap effect তৈরি।
      প্রতিটি h4 থেকে number parse করে 0 থেকে count-up করে।
   ════════════════════════════════════════════════════════════ */
  function runCounters() {
    document.querySelectorAll('.hero__count-item h4').forEach((h4, i) => {
      const original = h4.textContent.trim();
      const match    = original.match(/(\d+)/);
      if (!match) return; // যদি কোনো number না থাকে skip
 
      const endVal = +match[0];
      const prefix = original.slice(0, match.index);
      const suffix = original.slice(match.index + match[0].length);
      const proxy  = { n: 0 };
 
      gsap.to(proxy, {
        n        : endVal,
        duration : 2.4,
        delay    : i * 0.15,
        ease     : 'expo.out', // শেষে snap করে থামে — slot machine feel
        onUpdate()  { h4.textContent = prefix + Math.round(proxy.n) + suffix; },
        onComplete(){ h4.textContent = original; }, // exact original text restore
      });
    });
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 4 — ENTRANCE TIMELINE
      সব animation একটি master timeline-এ সাজানো।
   ════════════════════════════════════════════════════════════ */
  function buildEntrance() {
    const tl = gsap.timeline({
      defaults : { ease: 'power4.out' },
      delay    : 0.1,
    });
 
    // ① Rotated tag-line label
    tl.to('.hero-tag-line-wrap',
      { autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
      0
    );
 
    // ② H2 headings — Webflow / Framer-style clip-reveal
    tl.fromTo('.js-h2-inner',
      { yPercent: 115, skewY: 3.5 },
      {
        yPercent : 0,
        skewY    : 0,
        duration : 1.3,
        stagger  : { amount: 0.22 },
      },
      0.1
    );
 
    // ③ Right-side video — উপর থেকে নিচে reveal (0 → full height)
    tl.to('.hero__autoplay-video',
      {
        clipPath : 'inset(0% 0% 0% 0% round 20px)',
        duration : 1.55,
        ease     : 'expo.inOut',
      },
      0.28
    );
 
    // ④ Video tag text — video reveal শেষ হলে slide up করে আসে
    tl.to('.hero__video-tag-text',
      { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out' },
      1.5
    );
 
    // ⑤ Play-button group — বামদিক থেকে slide in
    tl.to('.hero__video',
      { autoAlpha: 1, x: 0, duration: 0.88, ease: 'power3.out' },
      0.9
    );
 
    // ⑥ Play icon — spring/bounce করে pop হয়
    tl.to('.hero__video-icon',
      { autoAlpha: 1, scale: 1, duration: 0.66, ease: 'back.out(1.8)' },
      1.02
    );
 
    // ⑦ Count items — stagger করে উপরে উঠে আসে
    tl.to('.hero__count-item',
      {
        autoAlpha : 1,
        y         : 0,
        duration  : 0.82,
        stagger   : 0.1,
        onComplete: runCounters,
      },
      1.12
    );
 
    // ⑧ Right-side description paragraph
    tl.to('.hero__right-video-content p',
      { autoAlpha: 1, y: 0, duration: 0.78 },
      1.24
    );
 
    return tl;
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 5 — PARALLAX
      Video-এর ভেতরের content scroll-এর চেয়ে ধীরে নড়ে।
      Overflow clipping যেন কাজ করে তার জন্য video একটু বড় করা হচ্ছে।
   ════════════════════════════════════════════════════════════ */
  function initParallax() {
    
    // .hero__bg Full Parallax Effect
    gsap.to('.hero__bg', {
      yPercent : 30,
      ease     : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.2,
      },
    });

    // .hero__autoplay-video (Container) Full Parallax Effect
    gsap.to('.hero__autoplay-video', {
      yPercent : 15,
      ease     : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.2,
      },
    });

    // Video element একটু বড় করো parallax headroom-এর জন্য
    const vid = document.querySelector('.hero__autoplay-video video');
    if (vid) {
      vid.style.height    = '118%';
      vid.style.marginTop = '-9%';
      vid.style.objectFit = 'cover';
    }
 
    // Video inner parallax
    gsap.fromTo('.hero__autoplay-video video',
      { y: -35 },
      {
        y    : 35,
        ease : 'none',
        scrollTrigger: {
          trigger : '.hero',
          start   : 'top top',
          end     : 'bottom top',
          scrub   : 1.6,
        },
      }
    );
 
    // Heading — scroll করলে সামান্য উপরে সরে (depth effect)
    gsap.to('.hero__heading', {
      yPercent : -9,
      ease     : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.1,
      },
    });
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 6 — SCROLL ANIMATIONS
      Scroll down করলে বিভিন্ন element-এ extra animation।
   ════════════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    gsap.to('.hero-tag-line-wrap', {
      yPercent : -12,
      ease     : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.5,
      },
    });
 
    gsap.to('.hero__count-items', {
      yPercent  : -9,
      ease      : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.4,
      },
    });
 
    gsap.to('.hero__video', {
      yPercent : -8,
      ease     : 'none',
      scrollTrigger: {
        trigger : '.hero',
        start   : 'top top',
        end     : 'bottom top',
        scrub   : 1.3,
      },
    });
  } 
 
  /* ════════════════════════════════════════════════════════════
      STEP 7 — MAGNETIC HOVER  (video play icon)
      Mouse icon-এর কাছে গেলে icon সেদিকে সামান্য সরে যায়।
   ════════════════════════════════════════════════════════════ */
  function initMagneticIcon() {
    const icon = document.querySelector('.hero__video-icon');
    if (!icon) return;
 
    icon.addEventListener('mousemove', e => {
      const rect = icon.getBoundingClientRect();
      const cx   = rect.left + rect.width  * 0.5;
      const cy   = rect.top  + rect.height * 0.5;
      const dx   = (e.clientX - cx) * 0.32;
      const dy   = (e.clientY - cy) * 0.32;
 
      gsap.to(icon, {
        x         : dx,
        y         : dy,
        duration  : 0.35,
        ease      : 'power2.out',
        overwrite : 'auto',
      });
    });
 
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        x         : 0,
        y         : 0,
        duration  : 0.75,
        ease      : 'elastic.out(1, 0.4)',
        overwrite : 'auto',
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
      STEP 8 — HERO SHAPE ANIMATION
      Load, Infinite Float, এবং Scroll Animation একসাথে।
   ════════════════════════════════════════════════════════════ */
  function initHeroShape() {
    const shape = document.querySelector('.hero__shape');
    if (!shape) return;

    // ১. Load Animation: ডানদিক থেকে (0 থেকে 98px) আসবে
    gsap.fromTo(shape, 
      { right: 0 }, 
      { right: 98, duration: 1.8, ease: 'power3.out', delay: 0.2 }
    );

    // ২. Infinite Move (hero__shape-moving effect): উপর-নিচ করবে
    gsap.fromTo(shape, 
      { bottom: -20 }, 
      { 
        bottom: 0, 
        duration: 2.2, 
        ease: 'sine.inOut', 
        repeat: -1, 
        yoyo: true,
        delay: 0.2 
      }
    );

    // ৩. Scroll Animation: স্ক্রল করে নিচে গেলে আবার right 0 তে ফিরে যাবে
    gsap.to(shape, {
      right: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }
 
  /* ════════════════════════════════════════════════════════════
      BOOT — সব function একসাথে চালানো হচ্ছে
   ════════════════════════════════════════════════════════════ */
  function boot() {
    prepareHeadings();
    setInitialStates();
    buildEntrance();
    initParallax();
    initScrollAnimations();
    initMagneticIcon();
    initHeroShape(); // নতুন যোগ করা হলো
  }
 
  // DOM ready হলে boot করো
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot(); 
  }
 
})();


