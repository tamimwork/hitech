(() => {
  'use strict';
 
  gsap.registerPlugin(ScrollTrigger);
 
  /* ════════════════════════════════════════════════════════════
      STEP 1 — HEADING ANIMATION (Hero Style)
      h2-এর ভেতরে wrapper div তৈরি করে নিচ থেকে clip-reveal করা
   ════════════════════════════════════════════════════════════ */
  function initManufacturingHeading() {
    document.querySelectorAll('.manufacturing__heading h2').forEach(h2 => {
      h2.style.overflow = 'hidden';
      h2.style.display  = 'block';
 
      const inner = document.createElement('div');
      inner.className = 'js-mfg-h2-inner';
      inner.style.cssText = 'display:block; will-change:transform;';
      inner.innerHTML = h2.innerHTML;
 
      h2.innerHTML = '';
      h2.appendChild(inner);
    });

    // ScrollTrigger দিয়ে Heading রিভিল করা
    gsap.fromTo('.js-mfg-h2-inner',
      { yPercent: 115, skewY: 3.5 },
      {
        yPercent : 0,
        skewY    : 0,
        duration : 1.3,
        ease     : 'power4.out',
        scrollTrigger: {
          trigger: '.manufacturing__heading',
          start: 'top 85%', // স্ক্রিনের ৮৫% এ আসলে এনিমেশন শুরু হবে
        }
      }
    );
  }
 
  /* ════════════════════════════════════════════════════════════
      STEP 2 — SHAPES ANIMATION
      ScrollTrigger + Infinite Yoyo Animation
   ════════════════════════════════════════════════════════════ */
  function initManufacturingShapes() {
    const shape1 = document.querySelector('.manufacturing__shape1');
    const shape2 = document.querySelector('.manufacturing__shape2');

    if (shape1) {
      // 1. Infinite Scale (1 to 1.1)
      gsap.to(shape1, {
        scale: 1.1,
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
      
      // 2. Scroll Trigger Parallax (উপর থেকে নিচে মুভ করবে)
      gsap.to(shape1, {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.manufacturing',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

if (shape2) {
    // 1. Infinite Move Right (0 to 25px) - আপনার আগের কোড ঠিক আছে
    gsap.to(shape2, {
      x: 25, 
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // 2. Scroll Trigger - টপ থেকে বটম ফুল স্ক্রল এনিমেশন
    // CSS-এ শেপটির পজিশনিং (top/transform) এর ওপর ভিত্তি করে y বা yPercent এডজাস্ট করতে হবে
    gsap.fromTo(shape2, 
      { y: 0 }, // স্ক্রল এর শুরুতে এটি তার অরিজিনাল পজিশনে থাকবে
      {
        y: () => {
          // পুরো .manufacturing সেকশনের টোটাল হাইট থেকে শেপের নিজের হাইট বাদ দিলে পারফেক্ট বটমে পৌঁছাবে
          const sectionHeight = document.querySelector('.manufacturing').offsetHeight;
          const shapeHeight = shape2.offsetHeight;
          return sectionHeight - shapeHeight;
        },
        ease: 'none', // স্ক্রলের সাথে সমানুপাতিক মুভমেন্টের জন্য none ব্যবহার করা জরুরি
        scrollTrigger: {
          trigger: '.manufacturing',
          start: 'top top',    // সেকশনটি যখন স্ক্রিনের একদম উপরে আসবে তখন শুরু হবে
          end: 'bottom bottom',// সেকশনটির শেষ অংশ যখন স্ক্রিনের নিচে চলে যাবে তখন শেষ হবে
          scrub: true,         // বা ১.২ দিতে পারেন। true দিলে স্ক্রলের সাথে একদম নিখুঁতভাবে লেগে থাকবে
          invalidateOnRefresh: true // স্ক্রিন রিসাইজ বা রিলোড হলে হাইট পুনরায় ক্যালকুলেট করবে
        }
      }
    );
  }
  }

  /* ════════════════════════════════════════════════════════════
      STEP 3 — IMAGE REVEAL & FULL PARALLAX
      Height 0 থেকে 100% হবে এবং স্ক্রল এর সাথে ভেতরের ছবি মুভ করবে
   ════════════════════════════════════════════════════════════ */
  function initManufacturingImages() {
    const items = document.querySelectorAll('.manufacturing__item');

    items.forEach((item) => {
      const imgContainer = item.querySelector('.manufacturing__item-right');
      const img = item.querySelector('.manufacturing__item-right img');

      if (!imgContainer || !img) return;

      // Parallax-এর জন্য ছবিকে একটু বড় করতে হবে এবং কন্টেইনারে overflow hidden দিতে হবে
      imgContainer.style.overflow = 'hidden';
      img.style.height = '120%'; 
      img.style.objectFit = 'cover';
      img.style.transformOrigin = 'center center';

      // Initial State: নিচ থেকে হাইড করা (Height 0 effect)
      gsap.set(imgContainer, { clipPath: 'inset(100% 0% 0% 0%)' });

      // 1. Reveal Animation (Height 0 to 100%)
      gsap.to(imgContainer, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.5,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%', 
        }
      });

      // 2. Inner Image Parallax (স্ক্রল করলে ছবি উপরে/নিচে মুভ করবে)
      gsap.fromTo(img, 
        { yPercent: -10 }, 
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: imgContainer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5 // Smooth parallax 
          }
        }
      );
    });
  }

  /* ════════════════════════════════════════════════════════════
      BOOT — সব ফাংশন কল করা হচ্ছে
   ════════════════════════════════════════════════════════════ */
  function bootManufacturing() {
    initManufacturingHeading();
    initManufacturingShapes();
    initManufacturingImages();
  }
 
  // DOM লোড হলে Boot করো
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootManufacturing);
  } else {
    bootManufacturing(); 
  }
 
})();