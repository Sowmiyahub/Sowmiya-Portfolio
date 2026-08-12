  // extend scrapbook treatment (paper texture, torn edges, doodles) to every section
  const TORN_PATH = "M0,20 L0,15 L9,18 L16,9 L24,16 L31,6 L39,15 L47,8 L55,18 L63,7 L71,16 L79,9 L87,19 L95,8 L103,15 L111,6 L119,17 L127,9 L135,18 L143,7 L151,15 L159,9 L167,19 L175,8 L183,16 L191,6 L199,17 L207,9 L215,18 L223,7 L231,15 L239,9 L247,19 L255,8 L263,16 L271,6 L279,17 L287,9 L295,18 L300,12 L300,20 Z";
  function tornEdgeEl(){
    const span = document.createElement('span');
    span.className = 'torn-edge';
    span.setAttribute('aria-hidden','true');
    span.innerHTML = `<svg viewBox="0 0 300 20" preserveAspectRatio="none"><path d="${TORN_PATH}" fill="var(--ink)"/></svg>`;
    return span;
  }
  const roseDoodleSVG = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none"><g stroke="var(--trace)" stroke-width="2" fill="none" opacity=".65"><path d="M50 70 C 40 55, 35 40, 50 25 C 65 40, 60 55, 50 70 Z" fill="var(--trace-dim)"/><circle cx="50" cy="40" r="9" fill="var(--signal)" opacity=".7"/><path d="M50 70 Q 45 82 30 85"/><path d="M50 70 Q 55 82 70 85"/></g></svg>`;
  const butterflyDoodleSVG = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none"><g fill="var(--signal)" opacity=".4"><path d="M50 50 C 30 20, 10 30, 15 48 C 20 62, 40 58, 50 50 Z"/><path d="M50 50 C 70 20, 90 30, 85 48 C 80 62, 60 58, 50 50 Z"/><path d="M50 50 C 34 55, 20 72, 30 85 C 40 92, 48 68, 50 50 Z"/><path d="M50 50 C 66 55, 80 72, 70 85 C 60 92, 52 68, 50 50 Z"/></g><circle cx="50" cy="50" r="4" fill="var(--trace)"/></svg>`;
  const cornerSets = [
    {top:'18px',left:'18px'}, {top:'18px',right:'18px'},
    {bottom:'18px',left:'18px'}, {bottom:'18px',right:'18px'}
  ];
  let sIdx = 0;
  document.querySelectorAll('main > section').forEach((sec) => {
    if(sec.classList.contains('hero') || sec.id === 'contact') return; // already hand-decorated
    sec.classList.add('paper-bg');
    sec.style.overflow = 'hidden';
    sec.parentNode.insertBefore(tornEdgeEl(), sec);
    const pos = cornerSets[sIdx % cornerSets.length];
    const doodle = document.createElement('div');
    doodle.className = 'doodle';
    Object.assign(doodle.style, pos);
    doodle.setAttribute('aria-hidden','true');
    doodle.innerHTML = (sIdx % 2 === 0) ? roseDoodleSVG(52) : butterflyDoodleSVG(46);
    sec.insertBefore(doodle, sec.firstChild);
    sIdx++;
  });

  // swaying bow beside every section heading
  document.querySelectorAll('.sec-head h2').forEach(h2 => {
    const bow = document.createElement('span');
    bow.className = 'sec-bow';
    bow.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 12C12 12 4 7 3 9C2 11 6 12.5 12 12C18 12.5 22 11 21 9C20 7 12 12 12 12Z" fill="currentColor" opacity="0.85"/><path d="M12 12C12 12 4 17 3 15C2 13 6 11.5 12 12C18 11.5 22 13 21 15C20 17 12 12 12 12Z" fill="currentColor" opacity="0.85"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>';
    h2.insertBefore(bow, h2.firstChild);
  });

  // mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // status panel boot sequence
  const statusText = document.getElementById('statusText');
  const sequence = [
    {t: 900, msg: 'PROVISIONING...'},
    {t: 1500, msg: 'RUNNING HAL CHECKS...'},
    {t: 1200, msg: 'REGISTERED ✓ 100%'}
  ];
  let delay = 0;
  sequence.forEach((step, i) => {
    delay += step.t;
    setTimeout(() => { statusText.textContent = step.msg; }, delay);
  });

  // stat count-up
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const span = el.querySelector('span');
      const duration = 900;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        span.textContent = Math.round(eased * target);
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, {threshold:0.4});
  document.querySelectorAll('.stat .num').forEach(el => statObserver.observe(el));

  // confetti burst on primary buttons
  const confettiColors = ['#E85D8A','#F2A6C4','#FCE1EA','#4A1B40'];
  function burstConfetti(x, y){
    const count = 14;
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = 5 + Math.random()*5;
      el.style.width = size+'px';
      el.style.height = size+'px';
      el.style.left = x+'px';
      el.style.top = y+'px';
      el.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(el);
      const angle = Math.random()*Math.PI*2;
      const dist = 40 + Math.random()*70;
      const dx = Math.cos(angle)*dist;
      const dy = Math.sin(angle)*dist - 30;
      el.animate([
        {transform:'translate(0,0) rotate(0deg)', opacity:1},
        {transform:`translate(${dx}px, ${dy+90}px) rotate(${Math.random()*360}deg)`, opacity:0}
      ], {duration: 700 + Math.random()*400, easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish = () => el.remove();
    }
  }
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => { burstConfetti(e.clientX, e.clientY); });
  });

  // light cursor sparkle trail (throttled, desktop only)
  let lastSparkle = 0;
  if(!('ontouchstart' in window)){
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if(now - lastSparkle < 140) return;
    lastSparkle = now;
    const s = document.createElement('div');
    s.className = 'mouse-sparkle';
    s.style.left = (e.clientX - 3.5) + 'px';
    s.style.top = (e.clientY - 3.5) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  });
  }

  // ---------- varied entrance animations per section ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
  }, {threshold:0.15});

  function stagger(list, base, step){
    list.forEach((el, i) => { el.style.transitionDelay = (base + i*step) + 'ms'; revealObserver.observe(el); });
  }
  function tag(el, cls){ if(el){ el.classList.add(cls); revealObserver.observe(el); } }

  // About: portrait slides from left, text+facts slide from right
  tag(document.querySelector('#about .portrait-col'), 'reveal-left');
  document.querySelectorAll('#about .about-grid > div:not(.portrait-col)').forEach((el,i) => {
    el.classList.add('reveal-right');
    el.style.transitionDelay = (i*120) + 'ms';
    revealObserver.observe(el);
  });

  // Experience: meta slides from left, bullet list from right
  tag(document.querySelector('#experience .xp-meta'), 'reveal-left');
  tag(document.querySelector('#experience .xp ul'), 'reveal-right');

  // Projects: cards pop in with stagger
  stagger(document.querySelectorAll('#projects .card'), 0, 100);

  // Skills: cells pop in with stagger
  stagger(document.querySelectorAll('#skills .skill-cell'), 0, 80);

  // Vibes / Notes sticker clusters: pop in with stagger
  stagger(document.querySelectorAll('#vibes .sticker'), 0, 90);
  stagger(document.querySelectorAll('#notes .sticker'), 0, 90);

  // Leadership: alternate left/right per item
  document.querySelectorAll('#leadership .lead-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    revealObserver.observe(el);
  });

  // Education: alternate right/left per item
  document.querySelectorAll('#education .edu-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
    revealObserver.observe(el);
  });

  // Contact: text from left, links from right
  tag(document.querySelector('#contact .contact > div:first-child'), 'reveal-left');
  tag(document.querySelector('#contact .contact-links'), 'reveal-right');

  // Stats numbers: pop in with stagger (in addition to count-up)
  stagger(document.querySelectorAll('.stat'), 0, 100);

  // sec-head bows/eyebrows and any leftover section wraps: default fade-up
  document.querySelectorAll('section .wrap').forEach(el => {
    if(!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-pop')){
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
