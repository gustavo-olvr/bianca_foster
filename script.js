(function () {
  'use strict';

  // WhatsApp: 55 + DDD + número. Confira antes de publicar.
  var WHATS = '5511961760203';
  var d = document;
  var h = d.documentElement;

  function $(selector, context) {
    return (context || d).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || d).querySelectorAll(selector));
  }

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Desenha a marca SVG.
  var logoMarkup = '<rect class="d" style="--i:0" pathLength="1" x="0" y="0" width="100" height="100"/>' +
    '<line class="d" style="--i:1" pathLength="1" x1="22.4" y1="0" x2="22.4" y2="100"/>' +
    '<line class="d" style="--i:1" pathLength="1" x1="67.2" y1="0" x2="67.2" y2="100"/>' +
    '<path class="d" style="--i:2" pathLength="1" d="M25.5 13.8V86.2"/>' +
    '<path class="d" style="--i:3" pathLength="1" d="M25.5 13.8H38A18.1 18.1 0 0 1 38 50H25.5"/>' +
    '<path class="d" style="--i:4" pathLength="1" d="M38 50A18.1 18.1 0 0 1 38 86.2H25.5"/>' +
    '<line class="d" style="--i:5" pathLength="1" x1="0" y1="50" x2="22.4" y2="50"/>' +
    '<path class="d" style="--i:5" pathLength="1" d="M67.2 13.8H100M67.2 50H100M67.2 86.2H100"/>';

  $$('svg.logo').forEach(function (svg) {
    svg.innerHTML = logoMarkup;
  });

  h.classList.add('ready');

  // Abertura: também funciona se o elemento não existir.
  var intro = $('#intro');
  var done = false;

  function start() {
    h.classList.add('go');
    if (slides.length) go(0);
    $$('.hero .clip').forEach(function (element) {
      element.classList.add('in');
    });
  }

  function closeIntro() {
    if (done) return;
    done = true;

    if (!intro) {
      start();
      return;
    }

    intro.classList.add('out');
    window.setTimeout(start, reduce ? 0 : 450);
    window.setTimeout(function () {
      intro.style.display = 'none';
    }, 1100);
  }

  if (intro) {
    intro.addEventListener('click', closeIntro);
    window.setTimeout(closeIntro, reduce ? 500 : 3900);
  } else {
    start();
  }

  // Revelação ao rolar. As imagens não ficam escondidas se o observer falhar.
  if ('IntersectionObserver' in window && !reduce) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    $$('.rv, .fade, .clip').filter(function (element) {
      return !element.closest('.hero');
    }).forEach(function (element) {
      observer.observe(element);
    });
  } else {
    $$('.rv, .fade, .clip').forEach(function (element) {
      element.classList.add('in');
    });
    h.classList.add('go');
  }

  // Paralaxe e cabeçalho.
  var px = $$('[data-px]');
  var header = $('#top');
  var lastScroll = 0;
  var ticking = false;

  function parallax() {
    var vh = window.innerHeight;
    px.forEach(function (img) {
      var parent = img.parentNode;
      var rect = parent.getBoundingClientRect();
      var center = (rect.top + rect.height / 2 - vh / 2) / vh;
      center = Math.max(-1, Math.min(1, center));
      img.style.translate = '0 ' + (-center * rect.height * 0.035).toFixed(1) + 'px';
    });
  }

  function headerScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header && !h.classList.contains('open')) {
      if (y > lastScroll + 6 && y > 240) header.classList.add('hide');
      else if (y < lastScroll - 6 || y < 120) header.classList.remove('hide');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (!reduce) parallax();
      headerScroll();
    });
  }, { passive: true });

  if (!reduce) parallax();

  // Menu em tela cheia.
  var button = $('#menuBtn');
  var menu = $('#menu');

  function setMenu(open) {
    h.classList.toggle('open', open);
    if (button) {
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Fechar' : 'Menu';
    }
    if (menu) menu.setAttribute('aria-hidden', String(!open));
    if (header) header.classList.remove('hide');
  }

  if (button) {
    button.addEventListener('click', function () {
      setMenu(!h.classList.contains('open'));
    });
  }

  $$('#menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  // Serviços.
  $$('.row-h').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var row = trigger.closest('.row');
      if (!row) return;
      var open = !row.classList.contains('open');
      row.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  // Carrossel principal.
  var slides = $$('.hero-img .slide');
  var dots = $$('.dots button');
  var slideIndex = -1;
  var slideTimer = null;

  function go(index) {
    if (!slides.length) return;
    index = (index + slides.length) % slides.length;
    if (index === slideIndex) return;

    slides.forEach(function (slide) {
      slide.classList.remove('prev');
    });

    if (slideIndex >= 0 && slides[slideIndex]) {
      slides[slideIndex].classList.remove('on');
      slides[slideIndex].classList.add('prev');
    }

    slides[index].classList.add('on');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('on', i === index);
    });

    slideIndex = index;
    window.clearTimeout(slideTimer);

    if (!reduce && slides.length > 1) {
      slideTimer = window.setTimeout(function () {
        go((slideIndex + 1) % slides.length);
      }, 5500);
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      go(index);
    });
  });

  // Lightbox dos projetos.
  var tiles = $$('.tile');
  var current = 0;
  var lightbox = d.createElement('div');

  lightbox.id = 'lb';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Imagem ampliada');
  lightbox.innerHTML =
    '<button type="button" class="x">Fechar</button>' +
    '<button type="button" class="nav prev" aria-label="Foto anterior">&#8249;</button>' +
    '<button type="button" class="nav next" aria-label="Próxima foto">&#8250;</button>' +
    '<img alt=""><p></p>';

  d.body.appendChild(lightbox);

  var lightboxImage = $('img', lightbox);
  var lightboxCaption = $('p', lightbox);

  function showImage(index) {
    if (!tiles.length) return;
    current = (index + tiles.length) % tiles.length;
    var tile = tiles[current];
    var image = $('img', tile);
    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = tile.getAttribute('data-cap') || image.alt;
  }

  function closeLightbox() {
    lightbox.classList.remove('on');
    d.body.style.overflow = '';
  }

  tiles.forEach(function (tile, index) {
    tile.addEventListener('click', function () {
      showImage(index);
      lightbox.classList.add('on');
      d.body.style.overflow = 'hidden';
      $('.x', lightbox).focus();
    });
  });

  $('.prev', lightbox).addEventListener('click', function () {
    showImage(current - 1);
  });

  $('.next', lightbox).addEventListener('click', function () {
    showImage(current + 1);
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox || event.target.classList.contains('x')) {
      closeLightbox();
    }
  });

  var touchX = 0;
  lightbox.addEventListener('touchstart', function (event) {
    touchX = event.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (event) {
    var delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) showImage(current + (delta < 0 ? 1 : -1));
  });

  d.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeLightbox();
      if (h.classList.contains('open')) setMenu(false);
    }
    if (lightbox.classList.contains('on')) {
      if (event.key === 'ArrowRight') showImage(current + 1);
      if (event.key === 'ArrowLeft') showImage(current - 1);
    }
  });

  // Formulário: abre conversa no WhatsApp.
  var form = $('#form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = form.elements.nome.value.trim();
      var message = form.elements.msg.value.trim();
      if (!name || !message) return;

      var text = 'Olá! Meu nome é ' + name + '. ' + message;
      var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Diagnóstico útil: nomes/caminhos de imagens quebrados aparecem no console.
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () {
      console.error('Não foi possível carregar a imagem: ' + img.getAttribute('src'));
    });
  });
})();
