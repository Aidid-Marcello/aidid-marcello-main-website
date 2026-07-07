'use strict';

/* ── theme toggle (light default, dark opt-in, persisted) ── */
var THEME_KEY = 'theme';
function applyTheme(theme){
  if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  document.querySelectorAll('.theme-toggle').forEach(function(b){ b.setAttribute('aria-pressed', theme === 'dark'); });
}
function initTheme(){
  var stored = null;
  try{ stored = localStorage.getItem(THEME_KEY); }catch(e){}
  applyTheme(stored === 'dark' ? 'dark' : 'light');
  document.querySelectorAll('.theme-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
    });
  });
}

/* ── scroll signal bar ── */
var signal = document.getElementById('signal');
function onScrollSignal(){
  var max = document.documentElement.scrollHeight - window.innerHeight;
  signal.style.width = max > 0 ? ((window.scrollY / max) * 100).toFixed(2) + '%' : '0';
}

/* ── nav materialise ── */
var nav = document.getElementById('nav');
function onScrollNav(){ nav.classList.toggle('scrolled', window.scrollY > 60); }

window.addEventListener('scroll', function(){ onScrollSignal(); onScrollNav(); }, {passive:true});

/* ── hero entrance ── */
function initHero(){
  var media = document.getElementById('hero-media');
  var n1 = document.getElementById('n1'), n2 = document.getElementById('n2');
  var intro = document.querySelector('.hero-intro');
  var actions = document.querySelector('.hero-actions');
  var roles = document.querySelector('.hero-roles');
  setTimeout(function(){ media.classList.add('in'); }, 150);
  setTimeout(function(){ n1.classList.add('in'); }, 300);
  setTimeout(function(){ n2.classList.add('in'); }, 440);
  setTimeout(function(){ intro.classList.add('in'); }, 900);
  setTimeout(function(){ actions.classList.add('in'); }, 1100);
  if (roles) setTimeout(function(){ roles.classList.add('in'); }, 1350);
}

/* ── reveal on scroll ── */
function initReveal(){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      obs.unobserve(e.target);
    });
  }, {threshold:0.12, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
}

/* ── seamless logo marquee: clone track for 50% loop ── */
function initMarquee(){
  var track = document.getElementById('logo-track');
  if(!track) return;
  track.innerHTML += track.innerHTML;
}

/* ── Content Universe: scroll-driven card stack ──
   The .uni-pin deck is pinned by CSS position:sticky. Cards are absolutely
   stacked in one spot; the bottom-most (first) is the base, the rest start
   translated 100% below. As scroll progresses through the tall .uni-stack,
   each card is pushed straight up into place to cover the previous one — a
   physical, weighted slide (transform only, no fade). Reduced motion / no-JS
   is handled by CSS (static vertical list) — we bail out here. */
function initUniverse(){
  var stack = document.getElementById('uni-stack');
  var deck = document.getElementById('uni-deck');
  if(!stack || !deck) return;
  var cards = Array.prototype.slice.call(deck.querySelectorAll('.deck-card'));
  if(!cards.length) return;
  cards.forEach(function(c, i){ c.style.zIndex = i + 1; });
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var n = cards.length;
  var seg = n > 1 ? 1 / (n - 1) : 1;
  var ticking = false;
  function frame(){
    var vh = window.innerHeight;
    var total = stack.offsetHeight - vh;
    var top = stack.getBoundingClientRect().top;
    var p = total > 0 ? Math.min(Math.max(-top / total, 0), 1) : 0;
    for(var i = 0; i < n; i++){
      var ty;
      if(i === 0){
        ty = 0;
      } else {
        var local = (p - (i - 1) * seg) / seg;
        if(local < 0) local = 0; else if(local > 1) local = 1;
        ty = (1 - local) * 100;
      }
      cards[i].style.transform = 'translate3d(0,' + ty.toFixed(2) + '%,0)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ window.requestAnimationFrame(frame); ticking = true; }
  }, {passive:true});
  window.addEventListener('resize', frame, {passive:true});
  frame();
}

/* ── mobile drawer ── */
var drawer = document.getElementById('drawer');
var burger = document.getElementById('burger');
var dclose = document.getElementById('drawer-close');
function openDrawer(){ drawer.classList.add('open'); burger.classList.add('open'); drawer.setAttribute('aria-hidden','false'); burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
function closeDrawer(){ drawer.classList.remove('open'); burger.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
function toggleDrawer(){ drawer.classList.contains('open') ? closeDrawer() : openDrawer(); }
burger.addEventListener('click', toggleDrawer);
dclose.addEventListener('click', closeDrawer);
drawer.addEventListener('click', function(e){ if(e.target===drawer) closeDrawer(); });
drawer.querySelectorAll('[data-close]').forEach(function(a){ a.addEventListener('click', closeDrawer); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && drawer.classList.contains('open')) closeDrawer(); });

/* ── stat number counter animation ── */
function animateCount(el){
  var original = el.textContent.trim();
  var m = original.match(/^([\d.]+)([^\d.]*)$/);
  if(!m) return;
  var end = parseFloat(m[1]);
  var suffix = m[2] || '';
  var decimals = m[1].indexOf('.') !== -1 ? m[1].split('.')[1].length : 0;
  var start = null;
  var dur = 1400;
  function tick(ts){
    if(!start) start = ts;
    var p = Math.min((ts - start) / dur, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (ease * end).toFixed(decimals) + suffix;
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  }
  requestAnimationFrame(tick);
}
function initCounters(){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      animateCount(e.target);
      obs.unobserve(e.target);
    });
  }, {threshold:0.6});
  document.querySelectorAll('#connect .stat-num').forEach(function(el){
    if(!el.querySelector('.ph-inline')) obs.observe(el);
  });
}

/* ── hero portrait parallax (desktop only, starts after entrance) ── */
function initParallax(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if(window.matchMedia('(max-width:980px)').matches) return;
  var portrait = document.querySelector('.hero-portrait');
  if(!portrait) return;
  var heroH = window.innerHeight;
  var ticking = false;
  function applyPx(){
    var y = window.scrollY;
    if(y <= heroH) portrait.style.transform = 'scale(1) translateY(' + (y * 0.1).toFixed(1) + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(applyPx); ticking = true; }
  }, {passive:true});
}

/* ── make entire stat cards clickable ── */
function initStatCards(){
  document.querySelectorAll('#connect .stat').forEach(function(card){
    var link = card.querySelector('.stat-follow');
    if(!link || !link.href) return;
    var href = link.href;
    card.addEventListener('click', function(e){
      if(e.target.tagName === 'A' || e.target.closest('a')) return;
      window.open(href, '_blank', 'noopener');
    });
  });
}

/* ── universe section: tint background glow to active card colour ── */
function initUniverseTint(){
  var pin = document.querySelector('.uni-pin');
  var stack = document.getElementById('uni-stack');
  var deck = document.getElementById('uni-deck');
  if(!pin || !stack || !deck) return;
  var cards = Array.prototype.slice.call(deck.querySelectorAll('.deck-card'));
  if(!cards.length) return;
  var n = cards.length;
  var seg = n > 1 ? 1 / (n - 1) : 1;
  var ticking = false;
  function frame(){
    var vh = window.innerHeight;
    var total = stack.offsetHeight - vh;
    var top = stack.getBoundingClientRect().top;
    var p = total > 0 ? Math.min(Math.max(-top / total, 0), 1) : 0;
    var idx = Math.min(Math.round(p / seg), n - 1);
    var c = getComputedStyle(cards[idx]).getPropertyValue('--c').trim();
    if(c) pin.style.setProperty('--glow', c);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(frame); ticking = true; }
  }, {passive:true});
  frame();
}

/* ── init ── */
function boot(){
  initTheme(); initHero(); initReveal(); initMarquee(); initUniverse();
  initCounters(); initStatCards(); initUniverseTint();
  onScrollSignal(); onScrollNav();
  setTimeout(initParallax, 1950);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
