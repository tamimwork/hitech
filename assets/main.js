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

$(document).ready(function(){
gsap.registerPlugin(ScrollTrigger);
const cards = gsap.utils.toArray('.manufacturing__item');
cards.forEach((card, i) => {
    card.style.zIndex = i + 1; 
    if (i < cards.length - 1) {
        ScrollTrigger.create({
            trigger: card,
            start: 'top top+=80',
            pin: true,
            pinSpacing: false,
        });
        gsap.to(card, {
            scale: 0.95,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top top+=80',
                end: 'bottom top+=80',
                scrub: true,
            }
        });
    }
});
})


// End Manufacturing Card Swipe


// Start Bg Video Parallax

// $(document).ready(function(){
//     gsap.registerPlugin(ScrollTrigger);
//     gsap.to('.video__wrapper video', {
//         yPercent: 30,
//         ease: 'none',
//         scrollTrigger: {
//             trigger: '.video',
//             start: 'top top',
//             end: 'bottom top',
//             scrub: true,
//         }
//     });
// })

// End Bg Video Parallax


// সব সেকশন এবং মেনু লিংক সিলেক্ট করা
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__menu ul li a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // স্ক্রল পজিশন চেক করা
    if (pageYOffset >= (sectionTop - 200)) { // 200 হলো offset, আপনার প্রয়োজনমতো অ্যাডজাস্ট করবেন
      current = section.getAttribute('id');
    }
  });

  // মেনু লিংকে 'active' ক্লাস আপডেট করা
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});






$(document).ready(function() {
    // .hero__video-তে ক্লিক করলে মডাল ওপেন হবে
    $('.hero__video').on('click', function(e) {
        e.preventDefault();

        // লোকাল ভিডিওর পাথ
        var videoSrc = "assets/intro.mp4"; 

        // <iframe> এর বদলে এখানে HTML5 <video> ট্যাগ ব্যবহার করা হয়েছে
        var modalHtml = `
            <div class="hero__overlay"></div>
            <div class="hero__video-modal">
                <span class="close-modal">&times;</span>
                <div class="video-container">
                    <video src="${videoSrc}" controls autoplay playsinline></video>
                </div>
            </div>
        `;

        // বডিতে মডালটি যুক্ত করা এবং ফেড-ইন অ্যানিমেশন দেওয়া
        $('body').append(modalHtml);
        $('.hero__overlay, .hero__video-modal').fadeIn(300);
    });

    // ক্লোজ বাটন বা ওভারলেতে ক্লিক করলে মডাল বন্ধ হবে
    $(document).on('click', '.close-modal, .hero__overlay', function() {
        $('.hero__overlay, .hero__video-modal').fadeOut(300, function() {
            $(this).remove(); // অ্যানিমেশন শেষে ডম থেকে ডিভগুলো রিমুভ করে দেবে
        });
    });
});