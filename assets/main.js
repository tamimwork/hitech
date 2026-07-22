// -----------smooth scroll start------------


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

if ($('#smooth-wrapper').length && $('#smooth-content').length) {
    ScrollSmoother.create({
        smooth: 1.85,
        effects: true,
        smoothTouch: .1,
        ignoreMobileResize: false
    });
}

// -----------smooth scroll end------------

// Start Header Fixed & Scroll

$(document).ready(function () {
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 25) {
            $('.header__inner').addClass('active');
        } else {
            $('.header__inner').removeClass('active');
        }
    });
});

// End Header Fixed & Scroll


// Start About Tab 

$(document).ready(function() {
    $('.about__tab-btn').on('click', function() {
        if ($(this).hasClass('active')) return;
        $('.about__tab-btn').removeClass('active');
        $(this).addClass('active');
        var targetContent = $(this).attr('data-btn');
        var $targetItem = $('.about__tab-item[data-content="' + targetContent + '"]');
        $('.about__tab-item.active').fadeOut(300, function() {
            $(this).removeClass('active');
            $targetItem.addClass('active').hide().fadeIn(400);
        });
    });
});

// End About Tab 


// Start White Hitech Item Hover Tab

$(document).ready(function() {
    $('.why-hitech__item').on('mouseenter', function() {
        const targetId = $(this).attr('data-content');
        $('.why-hitech__img').stop().animate({ opacity: 0 }, 400); 
        $(`.why-hitech__img[data-img="${targetId}"]`).stop().animate({ opacity: 1 }, 400);
    });
});

// End White Hitech Item Hover Tab


// Start Manufacturing Card Swipe

$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger);

    // ধাপ ১: HTML স্পর্শ না করেই card-কে wrap করা
    $('.manufacturing__item').each(function () {
        $(this).wrap('<div class="manufacturing__item-wrap"></div>');
    });

    let scrollTriggersReady = false;
    let mm = gsap.matchMedia();

    function setupScrollTriggers() {
        mm.add("(min-width: 1025px)", () => {
            const wraps = gsap.utils.toArray('.manufacturing__item-wrap');
            let triggers = [];

            wraps.forEach((wrap, i) => {
                const card = wrap.querySelector('.manufacturing__item');
                card.style.zIndex = i + 1;

                const pinST = ScrollTrigger.create({
                    trigger: wrap,
                    start: 'top top+=80',
                    end: 'bottom top+=80',
                    pin: card,
                    pinSpacing: false,
                    invalidateOnRefresh: true, // refresh হলে নতুন করে height মাপবে
                });

                let scaleST = null;
                if (i < wraps.length - 1) {
                    scaleST = gsap.to(card, {
                        scale: 0.95,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: wrap,
                            start: 'top top+=80',
                            end: 'bottom top+=80',
                            scrub: true,
                            invalidateOnRefresh: true,
                        }
                    }).scrollTrigger;
                }

                triggers.push(pinST, scaleST);
            });

            return () => triggers.forEach(t => t && t.kill());
        });
    }

    setupScrollTriggers();

    // ================================
    // ধাপ ২: সব ছবি লোড হওয়ার পর height ঠিকভাবে recalculate
    // এইটাই মূল ফিক্স — কালো গ্যাপ এখান থেকেই হচ্ছিল
    // ================================
    function refreshAfterImages() {
        const images = document.querySelectorAll('.manufacturing__item img');
        let loaded = 0;
        const total = images.length;

        if (total === 0) {
            ScrollTrigger.refresh();
            return;
        }

        images.forEach((img) => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener('load', () => {
                    loaded++;
                    if (loaded === total) {
                        ScrollTrigger.refresh();
                    }
                });
                img.addEventListener('error', () => {
                    loaded++;
                    if (loaded === total) {
                        ScrollTrigger.refresh();
                    }
                });
            }
        });

        if (loaded === total) {
            ScrollTrigger.refresh();
        }
    }

    refreshAfterImages();

    // ================================
    // ধাপ ৩: window পুরোপুরি load হলে (fonts সহ) আরেকবার refresh
    // (at-char-animation টেক্সট অ্যানিমেশন থাকায় height পরে বদলাতে পারে)
    // ================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300); // animation/font settle হওয়ার জন্য সামান্য delay
    });

    // resize হলে recalc
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});

// End Manufacturing Card Swipe











// Start Hero Button Modal Open

$(document).ready(function() {
    $('.hero__video').on('click', function(e) {
        e.preventDefault();
        var videoSrc = "assets/intro.mp4"; 
        var modalHtml = `
            <div class="hero__overlay"></div>
            <div class="hero__video-modal">
                <span class="close-modal">&times;</span>
                <div class="video-container">
                    <video src="${videoSrc}" controls autoplay playsinline></video>
                </div>
            </div>
        `;

        $('body').append(modalHtml);
        $('.hero__overlay, .hero__video-modal').fadeIn(300);
    });
    $(document).on('click', '.close-modal, .hero__overlay', function() {
        $('.hero__overlay, .hero__video-modal').fadeOut(300, function() {
            $(this).remove();
        });
    });
});

// End Hero Button Modal Open

































