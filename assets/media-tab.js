
$(function(){

  /* ----------------------------------------------------------------
     ICONS
  ---------------------------------------------------------------- */
  var ICON_STACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="13" height="13" rx="2"/><path d="M7 7V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3"/></svg>';
  var ICON_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg>';

  /* ==================================================================
     DATA
     ------------------------------------------------------------------
     প্রতিটা object একটা "গ্রুপ"। একটা গ্রুপের ভেতরে যত খুশি ইমেজ
     রাখা যাবে "images" array এ — কার্ডে শুধু একটা thumb (cover)
     দেখাবে, কিন্তু modal খুললে ঐ গ্রুপের সবগুলো ছবি prev/next দিয়ে
     ব্রাউজ করা যাবে।

     ইমেজ গ্রুপ:
       type   : 'image'
       thumb  : কার্ডে যেই cover ছবিটা দেখাবে
       images : [ 'url1', 'url2', 'url3', ... ]   <-- এখানে আপনার
                সব ছবির লিংক বসান, যত খুশি দিতে পারবেন

     ভিডিও গ্রুপ:
       type    : 'video'
       videoId : YouTube video ID (লিংক না, শুধু আইডি অংশ)
  ================================================================== */
  var media = [

    {
      id: 1,
      type: 'image',
      title: 'Product Showcase',
      sub: 'Grade 60 reformed bars, bundled for dispatch.',
      thumb: 'assets/product1.jpg',
      images: [
        'assets/product1.jpg',
        'assets/product2.jpg',
        'assets/product3.jpg'
      ]
    },

    {
      id: 2,
      type: 'image',
      title: 'Manufacturing',
      sub: 'From molten metal to monumental strength',
      thumb: 'assets/mfg1.jpg',
      images: [
        'assets/mfg1.jpg',
        'assets/mfg2.jpg',
        'assets/mfg3.jpg',
        'assets/mfg4.jpg',
        'assets/mfg5.jpg',
        'assets/mfg6.jpg'
      ]
    },

    {
      id: 3,
      type: 'image',
      title: 'Why Hitech',
      sub: 'Universal Structural Certification',
      thumb: 'assets/why-hitech1.jpg',
      images: [
        'assets/why-hitech1.jpg',
        'assets/why-hitech2.jpg',
        'assets/why-hitech3.jpg',
        'assets/why-hitech4.jpg'
      ]
    },

    {
      id: 4,
      type: 'video',
      title: 'Forging the Future',
      sub: 'Inside the rolling mill — raw billet takes shape under fire.',
      videoId: 'TLkA0RELQ1g',
      thumb: 'https://img.youtube.com/vi/TLkA0RELQ1g/hqdefault.jpg'
    },

    {
      id: 5,
      type: 'video',
      title: 'Forging the Future',
      sub: 'Sparks fly as the forging line runs around the clock.',
      videoId: 'aqz-KE-bpKQ',
      thumb: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg'
    },

    {
      id: 6,
      type: 'video',
      title: 'Forging the Future',
      sub: 'Grinding and finishing — the final pass before QC.',
      videoId: 'YE7VzlLtp-4',
      thumb: 'https://img.youtube.com/vi/YE7VzlLtp-4/hqdefault.jpg'
    }

  ];

  var currentTab = 'image';
  var currentGroupIdx = 0;   // media array এর কোন গ্রুপ খোলা আছে
  var currentImgIdx = 0;     // ঐ গ্রুপের কোন ছবি দেখানো হচ্ছে

  /* ----------------------------------------------------------------
     RENDER GRID (filtered by active tab)
  ---------------------------------------------------------------- */
  function renderGrid(tab){
    var $grid = $('#galleryGrid').empty();
    var items = media.filter(function(m){ return m.type === tab; });

    items.forEach(function(item, i){
      var isVideo = item.type === 'video';
      var icon = isVideo ? ICON_PLAY : ICON_STACK;
      var count = isVideo ? null : item.images.length;
      var badgeText = isVideo ? 'Video' : (count + (count > 1 ? ' Photos' : ' Photo'));
      var num = String(i + 1).padStart(2, '0');

      var $card = $(
        '<div class="g-card" data-id="'+ item.id +'">' +
          '<span class="badge">'+ icon +' '+ badgeText +'</span>' +
          '<img src="'+ item.thumb +'" alt="'+ item.title +'" loading="lazy">' +
          '<div class="center-btn"><span class="ring"></span><span class="core">'+ icon +'</span></div>' +
          '<div class="grad"></div>' +
          '<div class="info">' +
            '<span class="num">'+ num +'</span>' +
            '<span class="title">'+ item.title +'</span>' +
          '</div>' +
        '</div>'
      );
      $grid.append($card);
    });
  }

  renderGrid(currentTab);

  /* ----------------------------------------------------------------
     TAB SWITCH
  ---------------------------------------------------------------- */
  $('.tab-toggle button').on('click', function(){
    $('.tab-toggle button').removeClass('active');
    $(this).addClass('active');
    currentTab = $(this).data('tab');
    renderGrid(currentTab);
  });

  /* ----------------------------------------------------------------
     OPEN MODAL — গ্রুপের প্রথম ছবি/ভিডিও থেকে শুরু হবে
  ---------------------------------------------------------------- */
  $('#galleryGrid').on('click', '.g-card', function(){
    var id = $(this).data('id');
    var idx = media.findIndex(function(m){ return m.id === id; });
    openModal(idx);
  });

  function openModal(groupIdx){
    currentGroupIdx = groupIdx;
    currentImgIdx = 0;
    renderStage();
    $('#modalOverlay').addClass('open');
    $('body').css('overflow','hidden');
  }

  function closeModal(){
    $('#modalOverlay').removeClass('open');
    $('body').css('overflow','');
    $('#modalStage').empty(); // iframe বন্ধ করতে
  }

  function renderStage(){
    var item = media[currentGroupIdx];
    var $stage = $('#modalStage').empty();
    var isVideo = item.type === 'video';

    if(isVideo){
      var $frame = $('<div class="video-frame"></div>');
      var $iframe = $('<iframe allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>')
        .attr('src', 'https://www.youtube.com/embed/' + item.videoId + '?autoplay=1&rel=0');
      $frame.append($iframe);
      $stage.append($frame);
    } else {
      $stage.append($('<img>').attr('src', item.images[currentImgIdx]).attr('alt', item.title));
    }

    $('#modalTitle').text(item.title);
    $('#modalSubtitle').text(item.sub);

    // ভিডিও হলে নেভিগেশন/থাম্বনেইল লুকানো (একটাই ভিডিও থাকে গ্রুপে)
    var multiImage = !isVideo && item.images.length > 1;
    $('#modalPrev, #modalNext').toggleClass('hidden', !multiImage);
    $('#modalThumbs').toggleClass('hidden', isVideo || item.images.length <= 1);

    if(isVideo){
      $('#modalCounter').text('');
    } else {
      $('#modalCounter').text(
        String(currentImgIdx + 1).padStart(2,'0') + ' / ' + String(item.images.length).padStart(2,'0')
      );
    }

    renderThumbs();
  }

  function renderThumbs(){
    var item = media[currentGroupIdx];
    var $thumbs = $('#modalThumbs').empty();
    if(item.type === 'video') return;

    item.images.forEach(function(src, i){
      var $t = $('<div class="m-thumb" data-idx="'+ i +'"></div>');
      $t.append($('<img>').attr('src', src).attr('alt', item.title + ' ' + (i+1)));
      if(i === currentImgIdx) $t.addClass('active');
      $thumbs.append($t);
    });
  }

  $('#modalThumbs').on('click', '.m-thumb', function(){
    currentImgIdx = parseInt($(this).data('idx'), 10);
    renderStage();
  });

  function goPrev(){
    var item = media[currentGroupIdx];
    if(item.type === 'video') return;
    currentImgIdx = (currentImgIdx - 1 + item.images.length) % item.images.length;
    renderStage();
  }
  function goNext(){
    var item = media[currentGroupIdx];
    if(item.type === 'video') return;
    currentImgIdx = (currentImgIdx + 1) % item.images.length;
    renderStage();
  }

  $('#modalPrev').on('click', goPrev);
  $('#modalNext').on('click', goNext);
  $('#modalClose').on('click', closeModal);

  // overlay-র খালি জায়গায় ক্লিক করলে বন্ধ হবে
  $('#modalOverlay').on('click', function(e){
    if(e.target.id === 'modalOverlay'){ closeModal(); }
  });

  // কীবোর্ড সাপোর্ট
  $(document).on('keydown', function(e){
    if(!$('#modalOverlay').hasClass('open')) return;
    if(e.key === 'Escape') closeModal();
    if(e.key === 'ArrowLeft') goPrev();
    if(e.key === 'ArrowRight') goNext();
  });

});