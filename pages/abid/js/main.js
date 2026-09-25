/* =========================================================
   Ayesha Rahman — Portfolio · main.js
   Vanilla JS. No dependencies. ~60fps targets, mobile-safe.
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.innerWidth >= 1024;
  const mobileMq = window.matchMedia('(max-width: 1023px)');

  /* ---------------- Navbar ---------------- */
  const nav = $('#site-nav');
  const menuBtn = $('#menu-btn');
  const mobileMenu = $('#mobile-menu');

  const onNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.classList.add('glass-strong', 'shadow-2xl', 'shadow-black/30');
    } else {
      nav.classList.remove('glass-strong', 'shadow-2xl', 'shadow-black/30');
    }
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
    });
    $$('#mobile-menu a').forEach(a =>
      a.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', 'false'))
    );
  }

  /* Active section highlighting */
  const navLinks = $$('.nav-link');
  const sectionFor = link => $(link.getAttribute('href'));
  if ('IntersectionObserver' in window && navLinks.length) {
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('active', sectionFor(l) === e.target));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    navLinks.forEach(l => { const s = sectionFor(l); if (s) navObs.observe(s); });
  }

  /* ---------------- Scroll reveal ---------------- */
  const reveals = $$('.reveal');
  reveals.forEach(el => {
    const d = el.dataset.revealDelay;
    if (d) el.style.setProperty('--reveal-delay', d);
  });
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ---------------- Count-up counters ---------------- */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const runCounter = el => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    let start = null;
    const tick = ts => {
      if (!start) start = ts;
      const p = clamp((ts - start) / dur, 0, 1);
      const val = target * easeOut(p);
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    if (reducedMotion) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    $$('[data-count]').forEach(el => cObs.observe(el));
  } else {
    $$('[data-count]').forEach(runCounter);
  }

  /* ---------------- Animated bars & meters & dial ---------------- */
  $$('.bar').forEach(b => { b.dataset.h = b.style.height; });   // remember target heights
  const animateMeters = root => {
    $$('[data-meter]', root).forEach(m => { m.style.width = (m.dataset.meter || 0) + '%'; });
    $$('.bar', root).forEach(b => {
      b.style.height = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        b.style.height = (b.dataset.h || '60%');
      }));
    });
  };
  if ('IntersectionObserver' in window) {
    const mObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateMeters(e.target); mObs.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    $('#skills') && mObs.observe($('#skills'));
    $('#dashboard') && mObs.observe($('#dashboard'));
  } else {
    animateMeters(document);
  }
  const dial = $('#dial-arc');
  if (dial) {
    const target = 326.7 * (1 - 0.984);
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { dial.style.strokeDashoffset = target; obs.disconnect(); }
      });
    }, { threshold: 0.4 }).observe(dial);
  }

  /* ---------------- AI terminal typing ---------------- */
  const term = $('#ai-terminal');
  if (term) {
    const lines = [
      { text: '$ brief: "launch post for boho mug"', cls: 'text-[#00f5d4]' },
      { text: '→ ideating 12 hooks… 3 selected', cls: 'text-slate-400' },
      { text: '→ hashtag clusters: 5 groups built', cls: 'text-slate-400' },
      { text: '→ draft A: "Your morning ritual just got an upgrade ☕"', cls: 'text-[#ffd166]' },
      { text: '→ queued for human curation ✓', cls: 'text-[#c4a5ff]' },
    ];
    let li = 0, ci = 0, started = false;
    const render = () => {
      term.innerHTML = lines.slice(0, li).map(l =>
        `<p class="${l.cls} whitespace-nowrap overflow-hidden text-ellipsis">${l.text}</p>`
      ).join('') + (li < lines.length ? `<p class="${lines[li].cls} whitespace-nowrap">${lines[li].text.slice(0, ci)}<span class="animate-pulse text-[#00f5d4]">▊</span></p>` : '');
    };
    const step = () => {
      if (li >= lines.length) {
        render();
        setTimeout(() => { li = 0; ci = 0; term.innerHTML = ''; step(); }, 4200);
        return;
      }
      ci += 2;
      if (ci >= lines[li].text.length) { li++; ci = 0; render(); setTimeout(step, 340); }
      else { render(); setTimeout(step, 24); }
    };
    const start = () => { if (!started) { started = true; if (reducedMotion) { term.innerHTML = lines.map(l => `<p class="${l.cls}">${l.text}</p>`).join(''); } else step(); } };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.3 }).observe(term);
    } else start();
  }

  /* ---------------- Parallax (hero + orbs) ---------------- */
  const parallaxEls = $$('[data-parallax]');
  const cursorEls = $$('[data-cursor]');
  let mx = 0, my = 0, cmx = 0, cmy = 0, scrollY = window.scrollY, raf = null;

  const loop = () => {
    scrollY = lerp(scrollY, window.scrollY, 0.12);
    cmx = lerp(cmx, mx, 0.06);
    cmy = lerp(cmy, my, 0.06);
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || '0');
      let ty = scrollY * speed;
      if (el.dataset.speed) ty *= parseFloat(el.dataset.speed);
      if (el.dataset.cursor) { ty += cmy * parseFloat(el.dataset.cursor); }
      el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
    });
    cursorEls.forEach(el => {
      const f = parseFloat(el.dataset.cursor || '0');
      el.style.marginLeft = `${(cmx * f).toFixed(2)}px`;
    });
    if (Math.abs(scrollY - window.scrollY) > 0.1 || Math.abs(cmx - mx) > 0.1 || Math.abs(cmy - my) > 0.1) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  };
  const kick = () => { if (!raf && !reducedMotion && isDesktop()) raf = requestAnimationFrame(loop); };
  if (!reducedMotion) {
    window.addEventListener('scroll', kick, { passive: true });
    if (finePointer) {
      window.addEventListener('pointermove', e => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
        kick();
      }, { passive: true });
    }
    kick();
  }

  /* ---------------- 3D tilt cards ---------------- */
  if (finePointer && !reducedMotion) {
    $$('[data-tilt]').forEach(wrap => {
      const card = $('.tilt-card', wrap) || wrap;
      wrap.addEventListener('pointermove', e => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(-py * 7).toFixed(2)}deg)`;
      });
      wrap.addEventListener('pointerleave', () => { card.style.transform = 'rotateY(0deg) rotateX(0deg)'; });
    });
  }

  /* ---------------- Horizontal case-study rail ---------------- */
  const railWrap = $('#rail-wrap');
  const rail = $('#rail');
  const railIndex = $('#rail-index');
  const railDots = $$('#rail-dots i');
  let railAnim = null, railCurrent = 0, railTarget = 0;

  const setupRail = () => {
    if (!railWrap || !rail) return;
    if (isDesktop()) {
      const extra = rail.scrollWidth - window.innerWidth;
      railWrap.style.height = `${window.innerHeight + Math.max(extra, 1) + 80}px`;
      rail.classList.remove('flex-col', 'w-full');
      rail.classList.add('w-max');
    } else {
      railWrap.style.height = 'auto';
      rail.style.transform = 'translate3d(0,0,0)';
      rail.classList.add('flex-col', 'w-full');
      rail.classList.remove('w-max');
    }
  };

  const updateRailUI = p => {
    const idx = clamp(Math.round(p * 2), 0, 2);
    if (railIndex) railIndex.textContent = String(idx + 1).padStart(2, '0');
    railDots.forEach((d, i) => d.classList.toggle('bg-[#00f5d4]', i === idx));
    railDots.forEach((d, i) => { if (i !== idx) { d.classList.remove('bg-[#00f5d4]'); d.classList.add('bg-white/15'); } });
  };

  const railLoop = () => {
    const rect = railWrap.getBoundingClientRect();
    const total = railWrap.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / Math.max(total, 1), 0, 1);
    const extra = rail.scrollWidth - window.innerWidth;
    railTarget = p * Math.max(extra, 0);
    railCurrent = lerp(railCurrent, railTarget, 0.09);
    rail.style.transform = `translate3d(${(-railCurrent).toFixed(2)}px, 0, 0)`;
    updateRailUI(p);
    railAnim = requestAnimationFrame(railLoop);
  };
  const startRail = () => {
    if (!railWrap || reducedMotion || !isDesktop()) return;
    const rect = railWrap.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (!railAnim) railAnim = requestAnimationFrame(railLoop);
    } else if (railAnim) {
      cancelAnimationFrame(railAnim); railAnim = null;
    }
  };
  if (railWrap) {
    setupRail();
    window.addEventListener('scroll', startRail, { passive: true });
    mobileMq.addEventListener?.('change', setupRail);
  }

  /* ---------------- Marketplace tabs (bento card C) ---------------- */
  $$('[data-mp-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const which = btn.dataset.mpTab;
      $$('[data-mp-tab]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('tab-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      $$('[data-mp]').forEach(p => p.classList.toggle('hidden', p.dataset.mp !== which));
    });
  });

  /* ---------------- Dashboard tabs ---------------- */
  $$('[data-dash-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const which = btn.dataset.dashTab;
      $$('[data-dash-tab]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('tab-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      $$('[data-dash]').forEach(p => p.classList.toggle('hidden', p.dataset.dash !== which));
      const panel = $(`[data-dash="${which}"]`);
      if (panel) animateMeters(panel);
    });
  });

  /* ---------------- Live number jitter (simulated) ---------------- */
  const liveEls = $$('[data-live]');
  const fmt = (el, v) => {
    const d = parseInt(el.dataset.decimals || '0', 10);
    let s;
    if (el.dataset.min && Number(el.dataset.min) >= 1000) s = Math.round(v).toLocaleString('en-US');
    else s = v.toFixed(d);
    if (el.dataset.prefix === '$') s = '$' + Math.round(v).toLocaleString('en-US');
    return s + (el.dataset.suffix || '');
  };
  let liveTimer = null;
  const jitter = () => {
    liveEls.forEach(el => {
      const step = parseFloat(el.dataset.step || '0');
      const min = parseFloat(el.dataset.min || '0');
      const max = parseFloat(el.dataset.max || '0');
      if (!step || max <= min) return;
      const cur = parseFloat(el.dataset.cur || el.textContent.replace(/[^\d.-]/g, '')) || min;
      const next = clamp(cur + (Math.random() - 0.45) * step * 2, min, max);
      el.dataset.cur = next;
      el.textContent = fmt(el, next);
    });
  };
  const dashSection = $('#dashboard');
  if (dashSection && liveEls.length && 'IntersectionObserver' in window) {
    new IntersectionObserver((e, o) => {
      if (e[0].isIntersecting) {
        liveTimer = setInterval(jitter, 2400);
        o.disconnect();
      }
    }, { threshold: 0.15 }).observe(dashSection);
  }

  /* ---------------- Workflow simulation ---------------- */
  const steps = $$('.flow-step');
  const flowLog = $('#flow-log');
  const flowBtn = $('#flow-run');
  const stageMsgs = [
    '→ intake brief received · tagging platforms…',
    '→ AI pipeline generating hooks & hashtags…',
    '→ human pass: brand voice + fact-check ✓',
    '→ scheduled across 4 timezones · auto-publish on',
  ];
  let flowTimers = [];
  const resetFlow = () => {
    flowTimers.forEach(clearTimeout); flowTimers = [];
    steps.forEach(s => {
      const st = $('.flow-status', s);
      st.textContent = 'Queued';
      st.className = 'flow-status font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500';
      s.classList.remove('!border-[#00f5d4]/60');
      s.style.boxShadow = '';
    });
  };
  const runFlow = () => {
    resetFlow();
    if (reducedMotion) {
      steps.forEach((s, i) => {
        const st = $('.flow-status', s);
        st.textContent = 'Done ✓';
        st.className = 'flow-status font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f5d4]';
      });
      flowLog.textContent = '✓ pipeline complete — 4/4 stages passed';
      return;
    }
    steps.forEach((s, i) => {
      const t1 = setTimeout(() => {
        const st = $('.flow-status', s);
        st.textContent = i === 3 ? 'Publishing' : 'Running';
        st.className = 'flow-status font-mono text-[10px] font-bold uppercase tracking-wider text-[#ffd166] animate-pulse';
        s.style.boxShadow = '0 0 0 1px rgba(0,245,212,0.45), 0 0 28px rgba(0,245,212,0.18)';
        flowLog.textContent = stageMsgs[i];
      }, i * 950);
      const t2 = setTimeout(() => {
        const st = $('.flow-status', s);
        st.textContent = 'Done ✓';
        st.className = 'flow-status font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f5d4]';
        s.style.boxShadow = '0 0 0 1px rgba(0,245,212,0.22)';
      }, i * 950 + 700);
      flowTimers.push(t1, t2);
    });
    flowTimers.push(setTimeout(() => { flowLog.textContent = '✓ pipeline complete — 4/4 stages passed'; }, 4100));
  };
  if (flowBtn) flowBtn.addEventListener('click', runFlow);
  if (steps.length && 'IntersectionObserver' in window) {
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { setTimeout(runFlow, 500); o.disconnect(); } }, { threshold: 0.3 }).observe($('.flow-step'));
  }

  /* ---------------- Before / After slider ---------------- */
  const baRange = $('#ba-range');
  const baAfter = $('#ba-after');
  const baHandle = $('#ba-handle');
  if (baRange && baAfter && baHandle) {
    const setBA = v => {
      baAfter.style.clipPath = `inset(0 0 0 ${v}%)`;
      baHandle.style.left = v + '%';
    };
    baRange.addEventListener('input', () => setBA(baRange.value));
    setBA(baRange.value);
  }

  /* ---------------- Contact form (demo submit) ---------------- */
  const form = $('#contact-form');
  if (form) {
    const err = $('#cf-error');
    const toastZone = $('#toast-zone');
    const toastMsg = $('#toast-msg');
    const showToast = msg => {
      toastMsg.textContent = msg;
      toastZone.classList.remove('hidden');
      setTimeout(() => toastZone.classList.add('hidden'), 4200);
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const msg = $('#cf-message').value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!name || !emailOk || msg.length < 10) {
        err.textContent = !name ? 'Please tell me your name.' :
          !emailOk ? 'That email doesn\u2019t look right — mind checking it?' :
          'Give me a little more detail (10+ characters) so I can reply usefully.';
        err.classList.remove('hidden');
        return;
      }
      err.classList.add('hidden');
      const btn = $('#cf-submit');
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <svg class="h-4 w-4"><use href="#i-send"/></svg>';
        form.reset();
        showToast(`Thanks ${name.split(' ')[0]} — message sent! I'll reply within 24h.`);
      }, 900);
    });
  }

  /* ---------------- Magnetic CTA ---------------- */
  const mag = $('#magnetic-btn');
  if (mag && finePointer && !reducedMotion) {
    mag.addEventListener('pointermove', e => {
      const r = mag.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.18;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      mag.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });
    mag.addEventListener('pointerleave', () => { mag.style.transform = ''; });
  }

  /* ---------------- Back to top ---------------- */
  const toTop = $('#to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('hidden', window.scrollY < 700);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
  }

  /* ---------------- Footer year ---------------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------- Resize / init ---------------- */
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => { setupRail(); kick(); }, 150);
  });
  onNavScroll();
  window.addEventListener('scroll', onNavScroll, { passive: true });
  setupRail();
})();
