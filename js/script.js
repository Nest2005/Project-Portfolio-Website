(function () {
  var pages = [['index.html','Home'],['about.html','About'],['skills.html','Skills'],['projects.html','Projects'],['resume.html','Resume'],['contact.html','Contact']];
  var current = location.pathname.split('/').pop() || 'index.html';
  var links = pages.map(function (p) {
    return '<a href="' + p[0] + '"' + (p[0] === current ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
  }).join('');
  var header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = '<div class="wrap bar"><a class="brand" href="index.html"><img src="assets/images/logo.png" alt="" width="38" height="38"><span>Ralph</span></a>' +
      '<div class="nav-wrap" id="nav-wrap"><nav id="nav" aria-label="Main">' + links + '<a class="nav-cta" href="assets/Ralph_Hulguin_Resume.pdf" download>Download CV/Resume</a></nav>' +
      '<span class="nav-edge nav-edge-l" aria-hidden="true">&#8249;</span><span class="nav-edge nav-edge-r" aria-hidden="true">&#8250;</span>' +
      '<div class="nav-hint" aria-hidden="true"><span class="nav-hand">&#9756;</span> Swipe to see more pages <span class="nav-arrows">&#8594;</span></div>' +
      '<div class="nav-progress" aria-hidden="true"><span></span></div></div>' +
      '<button class="theme-btn" id="theme-btn" type="button"><img class="theme-ico" src="assets/images/theme-icon-light.png" alt="" width="28" height="28"><span class="theme-txt"></span></button></div>';
    var nav = header.querySelector('nav'), wrap = document.getElementById('nav-wrap');
    var act = header.querySelector('[aria-current]');
    if (act) nav.scrollLeft = Math.max(0, act.offsetLeft - 24);

    var bar = wrap.querySelector('.nav-progress span'), hint = wrap.querySelector('.nav-hint'), touched = false;
    var update = function () {
      var max = nav.scrollWidth - nav.clientWidth, pos = nav.scrollLeft;
      wrap.classList.toggle('can-scroll', max > 4);
      wrap.classList.toggle('at-start', pos <= 4);
      wrap.classList.toggle('at-end', pos >= max - 4);
      var ratio = max > 0 ? nav.clientWidth / nav.scrollWidth : 1;
      bar.style.width = (ratio * 100) + '%';
      bar.style.transform = 'translateX(' + (max > 0 ? (pos / max) * (1 / ratio - 1) * 100 : 0) + '%)';
      if (pos > 24 && !touched) { touched = true; hint.classList.add('gone'); }
    };
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    var dismiss = function () { if (!touched) { touched = true; hint.classList.add('gone'); } };
    nav.addEventListener('touchstart', dismiss, { passive: true });
    setTimeout(dismiss, 7000);

    wrap.querySelector('.nav-edge-l').addEventListener('click', function () { nav.scrollBy({ left: -nav.clientWidth * 0.6, behavior: 'smooth' }); });
    wrap.querySelector('.nav-edge-r').addEventListener('click', function () { nav.scrollBy({ left: nav.clientWidth * 0.6, behavior: 'smooth' }); });

    var down = false, sx = 0, sl0 = 0, moved = false;
    nav.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl0 = nav.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) moved = true; nav.scrollLeft = sl0 - dx; });
    window.addEventListener('pointerup', function () { down = false; });
    nav.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    update();
  }
  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = '<div class="wrap foot"><div><strong class="fname">Ralph Ernest D. Hulguin</strong><p>BSIT student<br>Cebu Eastern College, Inc.</p></div>' +
      '<div><h4>Contact</h4><div class="crow"><img src="assets/icons/gmail.png" alt="" width="26" height="26"><span>tomiok4san17@gmail.com</span></div>' +
      '<div class="crow"><img src="assets/icons/phone.png" alt="" width="26" height="26"><span>09276066228</span></div>' +
      '<a class="crow" href="https://github.com/Nest2005" target="_blank" rel="noopener"><img src="assets/icons/github.png" alt="" width="26" height="26"><span>github.com/Nest2005</span></a></div></div>' +
      '<div class="wrap copy">&copy; 2026 Ralph Ernest D. Hulguin. All rights reserved.</div>';
  }

  var root = document.documentElement, themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    var ico = themeBtn.querySelector('.theme-ico'), txt = themeBtn.querySelector('.theme-txt'), rot = root.dataset.theme === 'blue' ? 180 : 0;
    var label = function () {
      var blue = root.dataset.theme === 'blue';
      txt.textContent = blue ? 'Blue' : 'Green';
      themeBtn.setAttribute('aria-label', 'Current theme: ' + (blue ? 'blue' : 'green') + '. Switch to ' + (blue ? 'green' : 'blue') + ' theme');
      themeBtn.title = 'Switch to ' + (blue ? 'green' : 'blue') + ' theme';
      ico.src = 'assets/images/theme-icon-' + (blue ? 'green' : 'blue') + '.png';
      ico.style.setProperty('--rot', rot + 'deg');
    };
    label();
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'blue' ? 'green' : 'blue';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      rot += 180; label();
    });
  }

  var copy = document.getElementById('copy-email'), note = document.getElementById('copy-msg');
  if (copy) {
    copy.addEventListener('click', function () {
      var email = copy.dataset.email;
      var done = function (t) { note.textContent = t; };
      if (navigator.clipboard) { navigator.clipboard.writeText(email).then(function () { done('Email copied.'); }, function () { done('Copy failed. Select the address and copy it manually.'); }); }
      else { done('Copy is not supported here. Select the address and copy it manually.'); }
    });
  }

  var lb = null, lastFocus = null;
  function closeLb() { if (!lb) return; lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  function openLb(src, cap) {
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
      lb.innerHTML = '<button class="lb-close" type="button" aria-label="Close image viewer">&times; Close</button><figure><img alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(lb);
      lb.querySelector('.lb-close').addEventListener('click', closeLb);
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
    }
    lb.querySelector('img').src = src; lb.querySelector('img').alt = cap;
    lb.querySelector('figcaption').textContent = cap;
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  document.querySelectorAll('.zoom').forEach(function (b) {
    b.addEventListener('click', function () { lastFocus = b; openLb(b.dataset.full, b.dataset.caption); });
  });

  document.querySelectorAll('.skill').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('active'); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('active'); } });
  });

  var sl = document.getElementById('skill-slider');
  if (sl) {
    var data = [['c','C','General-purpose language for system-level and structured programming.'],['cpp','C++','Object-oriented extension of C, widely used for software and game development.'],['csharp','C#','Object-oriented language for desktop applications and games.'],['java','Java','Object-oriented language for building cross-platform applications.'],['php','PHP','Server-side scripting language for dynamic, database-driven websites.'],['html','HTML','Markup language that gives web pages their structure and content.'],['css','CSS','Styling language for layout, color, and responsive design.'],['js','JavaScript','Language that makes web pages interactive in the browser.'],['mysql','MySQL','Relational database system for storing and querying application data.'],['networking','Networking','How devices connect, communicate, and are managed on a network.']];
    var track = sl.querySelector('.s-track'), thumbs = sl.querySelector('.s-thumbs'), count = sl.querySelector('.s-count'), cur = 0;
    data.forEach(function (d, k) {
      track.insertAdjacentHTML('beforeend', '<div class="s-slide" role="group" aria-roledescription="slide" aria-label="' + (k + 1) + ' of ' + data.length + '"><img src="assets/images/skills/' + d[0] + '.png" alt="' + d[1] + ' logo"><h3>' + d[1] + '</h3><p>' + d[2] + '</p></div>');
      thumbs.insertAdjacentHTML('beforeend', '<button type="button" aria-label="Show ' + d[1] + '"><img src="assets/images/skills/' + d[0] + '.png" alt=""></button>');
    });
    var slides = track.children, tbs = thumbs.children;
    function go(n) {
      cur = (n + data.length) % data.length;
      track.style.transform = 'translateX(-' + cur * 100 + '%)';
      count.textContent = (cur + 1) + ' / ' + data.length;
      for (var k = 0; k < data.length; k++) {
        slides[k].setAttribute('aria-hidden', k !== cur);
        tbs[k].classList.toggle('on', k === cur);
        tbs[k].setAttribute('aria-current', k === cur);
      }
    }
    sl.querySelector('.prev').addEventListener('click', function () { go(cur - 1); });
    sl.querySelector('.next').addEventListener('click', function () { go(cur + 1); });
    Array.prototype.forEach.call(tbs, function (t, k) { t.addEventListener('click', function () { go(k); }); });
    sl.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
    var x0 = null;
    sl.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    sl.addEventListener('pointerup', function (e) { if (x0 !== null && Math.abs(e.clientX - x0) > 50) go(cur + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  var items = document.querySelectorAll('.acc-item');
  items.forEach(function (it) {
    it.querySelector('.acc-head').addEventListener('click', function () {
      items.forEach(function (o) { var on = o === it; o.classList.toggle('open', on); o.querySelector('.acc-head').setAttribute('aria-expanded', on); });
    });
  });
  var ptrack = document.getElementById('proj-track');
  if (ptrack) {
    var step = function (dir) { var c = ptrack.querySelector('.card'); ptrack.scrollBy({ left: dir * (c.offsetWidth + 20), behavior: 'smooth' }); };
    document.getElementById('sl-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('sl-next').addEventListener('click', function () { step(1); });
  }
})();
