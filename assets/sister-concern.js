/* ════════════════════════════════════════════════════════════
   SISTER CONCERNS — cards animation + dynamic modal (jQuery + GSAP)

   Load order on the page:
     jQuery → GSAP → ScrollTrigger → sister-concerns-modal.js

   এই file টা ৩টা কাজ করে:
     ১. .sister-concerns__item card গুলোর scroll-in entrance animation
     ২. card hover micro-interaction (video zoom, logo lift, arrow shift)
     ৩. ক্লিক করলে jQuery দিয়ে dynamically modal বানিয়ে, GSAP দিয়ে animate
        করে খোলে — content + gallery সবই SISTER_CONCERNS_DATA থেকে আসে।
   ════════════════════════════════════════════════════════════ */

(function ($) {
    'use strict';

    if (window.gsap && window.ScrollTrigger && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ────────────────────────────────────────────────────────
        DATA SOURCE
        modal এর "নাম" section এর নামের সাথে মিল রেখে (sister-concerns
        prefix) class বানানো হয়েছে। id গুলো HTML এর data-modal এর
        সাথে মিলতে হবে। gallery path গুলো placeholder — client এর
        আসল ছবি বসালে replace করে দিও।
     ──────────────────────────────────────────────────────── */
    const SISTER_CONCERNS_DATA = [
        {
            id: 'rahman',
            tag: 'RMG Industry',
            title: 'Rahman Knit Garments Ltd.',
            description:
                'A 100% export-oriented vertically integrated knit composite factory established in 1991 at Fatullah, Narayanganj, with spinning, knitting, fabric & yarn dyeing, and sewing & finishing units producing approximately 50,000–55,000 pieces per day.',
            points: [
                'Complete composite unit with knitting, dyeing, yarn dyeing, sewing and finishing divisions.',
                'Principal buyers include reputed companies across Europe — quality production and punctual shipment are the company\u2019s motto.',
                'Prime Customer Award from Janata Bank (2002) and a CSR Award for establishing Mahbubur Rahman Memorial Hospital.',
            ],
            website: '#',
            gallery: [
                'assets/maksuda.mp4',
                'assets/hospital.mp4',
                'assets/why-hitech3.jpg',
            ],
        },
        {
            id: 'maksuda',
            tag: 'Spinning & Yarn',
            title: 'Maksuda Spinning Mills Ltd.',
            description:
                'Acquired in 2018 to vertically integrate the textile business. The quality of any fabric depends on its yarn — here we never compromise, selecting the best raw cotton and processing it through advanced machinery.',
            points: [
                'Mission: to provide customers the best possible satisfaction by facilitating reliable, best-quality yarn.',
                'Vision: to emerge as a premier yarn manufacturer that fabric producers can rely on.',
                'Quality · Commitment · Consistency — the guiding principles of Maksuda Spinning Mills.',
            ],
            website: '#',
            gallery: [
                'assets/why-hitech1.jpg',
                'assets/why-hitech2.jpg',
                'assets/why-hitech3.jpg',
            ],
        },
        {
            id: 'hospital',
            tag: 'Healthcare & CSR',
            title: 'Mahbubur Rahman Memorial Hospital',
            description:
                'A 65-bed modern hospital at Rupasdi, Brahmanbaria, providing medicare to the poor at a very nominal rate on a no-profit, no-loss basis. Total establishment cost of USD 2.5 million, donated by Rahman Knit Garments Ltd.',
            points: [
                'Departments include Pharmacy, Operation Theater, Laboratory, Neonatal, Eye, Physiotherapy, Emergency, ECG and more.',
                'Diagnostic facilities: Digital X-ray, 4D Ultrasonogram, Echo color Doppler, ECG and advanced laboratory equipment.',
                'Service to Humanity — running for the poor and needy people of the owners\u2019 native village.',
            ],
            website: '#',
            gallery: [
                'assets/hospital.mp4',
                'assets/why-hitech2.jpg',
                'assets/why-hitech2.jpg',
            ],
        },
    ];

    let $overlay, $modal;
    let currentSlide = 0;

    /* ════════════════════════════════════════════════════════
        STEP 1 — CARD SCROLL-IN ENTRANCE
     ════════════════════════════════════════════════════════ */
    function initItemEntrance() {
        if (reduceMotion || !window.gsap) return;

        gsap.utils.toArray('.sister-concerns__item').forEach((item, i) => {
            gsap.fromTo(
                item,
                { autoAlpha: 0, y: 60 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power4.out',
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 88%',
                    },
                }
            );
        });
    }

    /* ════════════════════════════════════════════════════════
        STEP 2 — CARD HOVER MICRO-INTERACTION
     ════════════════════════════════════════════════════════ */
    function initItemHover() {
        $('.sister-concerns__item').each(function () {
            const $item = $(this);
            const video = $item.find('.sister-concerns__video video').get(0);
            const logo = $item.find('.sister-concerns__logo').get(0);
            const arrow = $item.find('.btn__right-arrow').get(0);

            $item.on('mouseenter focus', function () {
                if (reduceMotion || !window.gsap) return;
                gsap.to($item, { y: -8, boxShadow: '0 30px 60px rgba(0,0,0,0.28)', duration: 0.5, ease: 'power3.out' });
                if (video) gsap.to(video, { scale: 1.08, duration: 0.9, ease: 'power3.out' });
                if (logo) gsap.to(logo, { y: -6, duration: 0.5, ease: 'power3.out' });
                if (arrow) gsap.to(arrow, { x: 4, duration: 0.4, ease: 'power3.out' });
            });

            $item.on('mouseleave blur', function () {
                if (reduceMotion || !window.gsap) return;
                gsap.to($item, { y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: 0.5, ease: 'power3.out' });
                if (video) gsap.to(video, { scale: 1, duration: 0.9, ease: 'power3.out' });
                if (logo) gsap.to(logo, { y: 0, duration: 0.5, ease: 'power3.out' });
                if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: 'power3.out' });
            });
        });
    }

    /* ════════════════════════════════════════════════════════
        STEP 3 — BUILD MODAL SKELETON (একবারই body তে inject হয়)
     ════════════════════════════════════════════════════════ */
    function buildModalSkeleton() {
        const markup = `
            <div class="sister-concerns-overlay" id="sisterConcernsOverlay">
                <div class="sister-concerns-modal" id="sisterConcernsModal" role="dialog" aria-modal="true" aria-labelledby="sisterConcernsModalTitle">
                    <button type="button" class="sister-concerns-modal__close" aria-label="Close">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    </button>

                    <div class="sister-concerns-modal__gallery">
                        <div class="sister-concerns-modal__slides"></div>
                        <button type="button" class="sister-concerns-modal__nav sister-concerns-modal__nav--prev" aria-label="Previous image">
                            <svg viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="sister-concerns-modal__nav sister-concerns-modal__nav--next" aria-label="Next image">
                            <svg viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <div class="sister-concerns-modal__dots"></div>
                    </div>

                    <div class="sister-concerns-modal__content">
                        <div class="sister-concerns-modal__tag">
                            <span class="sister-concerns-modal__tag-dot"></span>
                            <span class="sister-concerns-modal__tag-text"></span>
                        </div>
                        <h3 class="sister-concerns-modal__title" id="sisterConcernsModalTitle"></h3>
                        <p class="sister-concerns-modal__desc"></p>
                        <ul class="sister-concerns-modal__points"></ul>
                        <a href="#" target="_blank" rel="noopener" class="btn btn-white sister-concerns-modal__cta">
                            <span class="btn__left-arrow"><img src="assets/button-arrow-black.svg" alt=""></span>
                            <span class="btn__text">Visit company website</span>
                            <span class="btn__right-arrow"><img src="assets/btn-arrow-white.svg" alt=""></span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        $('body').append(markup);
        $overlay = $('#sisterConcernsOverlay');
        $modal = $('#sisterConcernsModal');
    }

    /* ════════════════════════════════════════════════════════
        STEP 4 — POPULATE MODAL FROM DATA
     ════════════════════════════════════════════════════════ */
    function populateModal(data) {
        $modal.attr('data-modal-name', 'sister-concerns-modal--' + data.id);
        $modal.find('.sister-concerns-modal__tag-text').text(data.tag);
        $modal.find('.sister-concerns-modal__title').text(data.title);
        $modal.find('.sister-concerns-modal__desc').text(data.description);

        const $points = $modal.find('.sister-concerns-modal__points').empty();
        data.points.forEach((point) => {
            $points.append(`
                <li class="sister-concerns-modal__point">
                    <span class="sister-concerns-modal__point-icon">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M2 7.2L5.3 10.5L12 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="sister-concerns-modal__point-text">${point}</span>
                </li>
            `);
        });

        $modal.find('.sister-concerns-modal__cta').attr('href', data.website);
        renderGallery(data.gallery);
    }

    /* ────────────────────────────────────────────────────────
        Gallery (slick-style prev/next + dots, GSAP crossfade)
        — image অথবা video, যেটাই হোক, একই class দিয়ে একইভাবে
          width:100% / height:100% / object-fit:cover বসে (CSS দেখো)
     ──────────────────────────────────────────────────────── */
    const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)$/i;
    const isVideoSrc = (src) => VIDEO_EXT.test(src);

    function buildSlideMarkup(src, isFirst) {
        const visibility = `style="opacity:${isFirst ? 1 : 0}"`;

        if (isVideoSrc(src)) {
            return `
                <video class="sister-concerns-modal__slide" ${visibility}
                    muted playsinline loop preload="metadata">
                    <source src="${src}" type="video/mp4">
                </video>
            `;
        }

        return `<img src="${src}" class="sister-concerns-modal__slide" ${visibility} alt="">`;
    }

    function renderGallery(images) {
        const $slides = $modal.find('.sister-concerns-modal__slides').empty();
        const $dots = $modal.find('.sister-concerns-modal__dots').empty();

        images.forEach((src, i) => {
            $slides.append(buildSlideMarkup(src, i === 0));
            $dots.append(`<span class="sister-concerns-modal__dot${i === 0 ? ' is-active' : ''}"></span>`);
        });

        currentSlide = 0;
        $modal.find('.sister-concerns-modal__nav').toggle(images.length > 1);
        $modal.find('.sister-concerns-modal__dots').toggle(images.length > 1);
        playActiveSlide();
    }

    // active slide-এ যদি video থাকে তাহলে play করো, বাকি সব video pause
    function playActiveSlide() {
        const $slides = $modal.find('.sister-concerns-modal__slide');

        $slides.each(function (i) {
            if (this.tagName !== 'VIDEO') return;
            if (i === currentSlide) {
                const playPromise = this.play();
                if (playPromise && playPromise.catch) playPromise.catch(() => {});
            } else {
                this.pause();
            }
        });
    }

    function pauseAllSlides() {
        $modal.find('.sister-concerns-modal__slide').each(function () {
            if (this.tagName === 'VIDEO') this.pause();
        });
    }

    function goToSlide(index) {
        const $slides = $modal.find('.sister-concerns-modal__slide');
        const total = $slides.length;
        if (!total) return;

        index = (index + total) % total;
        if (index === currentSlide) return;

        if (window.gsap && !reduceMotion) {
            gsap.to($slides.eq(currentSlide), { opacity: 0, duration: 0.45, ease: 'power2.inOut' });
            gsap.to($slides.eq(index), { opacity: 1, duration: 0.45, ease: 'power2.inOut' });
        } else {
            $slides.eq(currentSlide).css('opacity', 0);
            $slides.eq(index).css('opacity', 1);
        }

        $modal.find('.sister-concerns-modal__dot').removeClass('is-active').eq(index).addClass('is-active');
        currentSlide = index;
        playActiveSlide();
    }

    /* ════════════════════════════════════════════════════════
        STEP 5 — OPEN / CLOSE MODAL (GSAP animated)
     ════════════════════════════════════════════════════════ */
    function openModal(id) {
        const data = SISTER_CONCERNS_DATA.find((d) => d.id === id);
        if (!data) return;

        populateModal(data);
        $('html, body').addClass('sister-concerns-lock');
        $overlay.addClass('is-active');

        if (reduceMotion || !window.gsap) {
            gsap && gsap.set($overlay, { opacity: 1 });
            gsap && gsap.set($modal, { autoAlpha: 1, y: 0, scale: 1 });
            return;
        }

        gsap.fromTo($overlay, { opacity: 0 }, { opacity: 0.92, duration: 0.45, ease: 'power2.out' });

        gsap.fromTo(
            $modal,
            { autoAlpha: 0, y: 40, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.08 }
        );

        gsap.fromTo(
            $modal.find(
                '.sister-concerns-modal__tag, .sister-concerns-modal__title, .sister-concerns-modal__desc, .sister-concerns-modal__points li, .sister-concerns-modal__cta'
            ),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, delay: 0.32 }
        );
    }

    function closeModal() {
        if (!$overlay.hasClass('is-active')) return;

        const finish = () => {
            $overlay.removeClass('is-active');
            $('html, body').removeClass('sister-concerns-lock');
            pauseAllSlides();
        };

        if (reduceMotion || !window.gsap) {
            finish();
            return;
        }

        gsap.to($modal, { autoAlpha: 0, y: 24, scale: 0.97, duration: 0.32, ease: 'power2.inOut' });
        gsap.to($overlay, { opacity: 0, duration: 0.32, ease: 'power2.inOut', delay: 0.05, onComplete: finish });
    }

    /* ════════════════════════════════════════════════════════
        STEP 6 — EVENT BINDINGS
     ════════════════════════════════════════════════════════ */
    function bindEvents() {
        // card click → open modal (Visit button click বাদ দিয়ে)
        $(document).on('click', '.sister-concerns__item', function (e) {
            if ($(e.target).closest('.sister-concerns__btn').length) return;
            openModal($(this).data('modal'));
        });

        // keyboard accessibility (Enter / Space)
        $(document).on('keydown', '.sister-concerns__item', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            if ($(e.target).closest('.sister-concerns__btn').length) return;
            e.preventDefault();
            openModal($(this).data('modal'));
        });

        // close: close-button, overlay backdrop click, ESC
        $(document).on('click', '.sister-concerns-modal__close', closeModal);

        $(document).on('click', '.sister-concerns-overlay', function (e) {
            if (e.target === this) closeModal();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $overlay.hasClass('is-active')) closeModal();
        });

        // gallery nav
        $(document).on('click', '.sister-concerns-modal__nav--next', () => goToSlide(currentSlide + 1));
        $(document).on('click', '.sister-concerns-modal__nav--prev', () => goToSlide(currentSlide - 1));
        $(document).on('click', '.sister-concerns-modal__dot', function () {
            goToSlide($(this).index());
        });
    }

    /* ════════════════════════════════════════════════════════
        BOOT
     ════════════════════════════════════════════════════════ */
    $(function () {
        buildModalSkeleton();
        initItemEntrance();
        initItemHover();
        bindEvents();
    });
})(jQuery);