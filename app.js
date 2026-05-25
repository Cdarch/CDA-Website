/* =========================================================================
   A.H.D Architects — app.js
   Hash-based router + page renderers + lightbox + a11y menu + mobile nav.
   No bundler, no dependencies.
   ========================================================================= */
(function () {
  'use strict';

  const PROJECTS = window.PROJECTS || [];
  const CLIENTS = window.CLIENTS || [];
  const FEATURED_IDS = window.FEATURED_IDS || [];

  const main = document.getElementById('main');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === 'dataset') {
          for (const dk in v) node.dataset[dk] = v[dk];
        } else {
          node.setAttribute(k, v === true ? '' : v);
        }
      }
    }
    if (children) {
      const arr = Array.isArray(children) ? children : [children];
      for (const c of arr) {
        if (c == null || c === false) continue;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return node;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
    });
  }

  function findProject(id) {
    return PROJECTS.find(function (p) { return p.id === id; });
  }

  // ---------- mobile nav ----------
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  function setMobileNav(open) {
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    if (open) navMobile.removeAttribute('hidden');
    else navMobile.setAttribute('hidden', '');
  }
  hamburger.addEventListener('click', function () {
    const open = hamburger.getAttribute('aria-expanded') !== 'true';
    setMobileNav(open);
  });

  // ---------- header scroll state ----------
  const header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- nav active state ----------
  function updateNavActive(path) {
    document.querySelectorAll('[data-route]').forEach(function (a) {
      const r = a.getAttribute('data-route');
      let active = false;
      if (r === '/') active = path === '/';
      else active = path === r || path.indexOf(r + '/') === 0;
      a.classList.toggle('active', active);
    });
  }

  // ---------- lightbox ----------
  const lb = {
    el: document.getElementById('lightbox'),
    img: document.getElementById('lb-img'),
    cap: document.getElementById('lb-caption'),
    closeBtn: document.getElementById('lb-close'),
    prevBtn: document.getElementById('lb-prev'),
    nextBtn: document.getElementById('lb-next'),
    images: [],
    index: 0,
    caption: '',
  };

  function lbRender() {
    const src = lb.images[lb.index];
    lb.img.src = src;
    lb.img.alt = lb.caption || '';
    let cap = lb.caption || '';
    if (lb.images.length > 1) {
      cap += ' · ' + (lb.index + 1) + ' / ' + lb.images.length;
    }
    lb.cap.textContent = cap;
    lb.prevBtn.toggleAttribute('hidden', lb.images.length <= 1);
    lb.nextBtn.toggleAttribute('hidden', lb.images.length <= 1);
  }
  function lbOpen(images, index, caption) {
    lb.images = images;
    lb.index = index || 0;
    lb.caption = caption || '';
    lbRender();
    lb.el.removeAttribute('hidden');
    document.body.classList.add('lock-scroll');
  }
  function lbClose() {
    lb.el.setAttribute('hidden', '');
    document.body.classList.remove('lock-scroll');
  }
  function lbNext() { lb.index = (lb.index + 1) % lb.images.length; lbRender(); }
  function lbPrev() { lb.index = (lb.index - 1 + lb.images.length) % lb.images.length; lbRender(); }

  lb.closeBtn.addEventListener('click', lbClose);
  lb.prevBtn.addEventListener('click', lbPrev);
  lb.nextBtn.addEventListener('click', lbNext);
  lb.el.addEventListener('click', function (e) { if (e.target === lb.el) lbClose(); });
  document.addEventListener('keydown', function (e) {
    if (lb.el.hasAttribute('hidden')) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbNext();   // RTL: ← advances
    else if (e.key === 'ArrowRight') lbPrev();
  });

  // ---------- accessibility menu ----------
  const A11Y_KEY = 'ahd_a11y_v1';
  const a11yDefaults = {
    contrastHigh: false,
    textSize: 'normal',
    underlineLinks: false,
    reduceMotion: false,
  };
  let a11y = Object.assign({}, a11yDefaults);

  function applyA11y() {
    document.body.classList.toggle('contrast-high', a11y.contrastHigh);
    document.body.classList.toggle('text-larger', a11y.textSize === 'larger');
    document.body.classList.toggle('text-largest', a11y.textSize === 'largest');
    document.body.classList.toggle('links-underlined', a11y.underlineLinks);
    document.body.classList.toggle('reduce-motion', a11y.reduceMotion);
    // Reflect in panel UI
    document.querySelectorAll('.switch[data-pref]').forEach(function (sw) {
      const pref = sw.getAttribute('data-pref');
      sw.setAttribute('aria-checked', a11y[pref] ? 'true' : 'false');
    });
    document.querySelectorAll('.a11y-segments[data-pref] button').forEach(function (b) {
      const pref = b.parentElement.getAttribute('data-pref');
      b.setAttribute('aria-pressed', a11y[pref] === b.getAttribute('data-value') ? 'true' : 'false');
    });
  }
  function saveA11y() {
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11y)); } catch (e) {}
  }
  function loadA11y() {
    try {
      const raw = localStorage.getItem(A11Y_KEY);
      if (raw) a11y = Object.assign({}, a11yDefaults, JSON.parse(raw));
    } catch (e) {}
  }

  const a11yToggle = document.getElementById('a11y-toggle');
  const a11yPanel = document.getElementById('a11y-panel');
  const a11yClose = document.getElementById('a11y-close');
  const a11yReset = document.getElementById('a11y-reset');

  function setA11yPanel(open) {
    a11yToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) a11yPanel.removeAttribute('hidden');
    else a11yPanel.setAttribute('hidden', '');
  }
  a11yToggle.addEventListener('click', function () {
    const open = a11yToggle.getAttribute('aria-expanded') !== 'true';
    setA11yPanel(open);
  });
  a11yClose.addEventListener('click', function () { setA11yPanel(false); });
  a11yReset.addEventListener('click', function () {
    a11y = Object.assign({}, a11yDefaults);
    applyA11y();
    saveA11y();
  });
  document.querySelectorAll('.switch[data-pref]').forEach(function (sw) {
    sw.addEventListener('click', function () {
      const pref = sw.getAttribute('data-pref');
      a11y[pref] = !a11y[pref];
      applyA11y();
      saveA11y();
    });
  });
  document.querySelectorAll('.a11y-segments[data-pref] button').forEach(function (b) {
    b.addEventListener('click', function () {
      const pref = b.parentElement.getAttribute('data-pref');
      a11y[pref] = b.getAttribute('data-value');
      applyA11y();
      saveA11y();
    });
  });

  loadA11y();
  applyA11y();

  // ---------- shared components (HTML strings) ----------
  function projectCardHTML(p, opts) {
    opts = opts || {};
    const dev = p.developer ? '<p class="o-dev">יזם: ' + escapeHtml(p.developer) + '</p>' : '';
    const devMeta = p.developer ? '<span class="dev">' + escapeHtml(p.developer) + '</span>' : '';
    const delay = opts.delay ? ' delay-' + opts.delay : '';
    return (
      '<article class="project-card fade-up' + delay + '">' +
        '<button type="button" class="image-frame" data-open-project="' + escapeHtml(p.id) + '" aria-label="פתיחת תמונה: ' + escapeHtml(p.name) + '">' +
          '<img src="' + escapeHtml(p.cover) + '" alt="' + escapeHtml(p.name) + '" loading="' + (opts.priority ? 'eager' : 'lazy') + '" />' +
          '<span class="overlay">' +
            '<span class="o-title">' + escapeHtml(p.name) + '</span>' +
            dev +
            '<span class="o-cta">לחצו לצפייה</span>' +
          '</span>' +
        '</button>' +
        '<div class="meta-row">' +
          '<a class="name" href="#/projects/' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + '</a>' +
          devMeta +
        '</div>' +
      '</article>'
    );
  }

  function trustedByHTML() {
    const items = CLIENTS.map(function (c) {
      return '<li><img src="' + escapeHtml(c.logo) + '" alt="' + escapeHtml(c.name) + '" loading="lazy" /></li>';
    }).join('');
    return (
      '<section class="trusted">' +
        '<div class="container">' +
          '<h2>סומכים עלינו</h2>' +
          '<ul class="trusted-grid">' + items + '</ul>' +
        '</div>' +
      '</section>'
    );
  }

  // ---------- pages ----------
  function pageHome() {
    const featured = FEATURED_IDS.map(findProject).filter(Boolean);
    const cards = featured.map(function (p, i) {
      return projectCardHTML(p, { priority: i < 3, delay: i < 3 ? 0 : 1 });
    }).join('');

    return (
      '<div class="fade-in">' +
        '<section class="container hero">' +
          '<div class="fade-up">' +
            '<p class="eyebrow">A.H.D · א.ח.ד אדריכלים</p>' +
            '<h1 class="h1">אדריכלות שמשלבת אסתטיקה,<br>פונקציונליות וחדשנות.</h1>' +
          '</div>' +
          '<div class="fade-up delay-1">' +
            '<p class="lede">משרד האדריכלים של חיים דוד מתמחה בתכנון פרויקטים מורכבים — מהתחדשות עירונית ועד למגורים, מסחר ותעשייה.</p>' +
            '<a href="#/projects" class="btn-link" style="margin-top:24px;">לכל הפרויקטים →</a>' +
          '</div>' +
        '</section>' +

        '<section class="container" style="padding-bottom:64px;">' +
          '<div class="proj-grid">' + cards + '</div>' +
        '</section>' +

        trustedByHTML() +

        '<section class="section section-divider">' +
          '<div class="container cta-row">' +
            '<h2 class="h2">יש לכם פרויקט בתכנון?<br>נשמח לשמוע עליו.</h2>' +
            '<div>' +
              '<p class="lede" style="margin:0 0 24px;">צרו איתנו קשר לשיחת היכרות. אנחנו מלווים את הפרויקט מהרעיון הראשוני ועד למימוש בשטח.</p>' +
              '<a href="#/contact" class="btn">ליצירת קשר</a>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>'
    );
  }

  function pageProjects() {
    const cards = PROJECTS.map(function (p, i) {
      return projectCardHTML(p, { priority: i < 3, delay: i < 3 ? 0 : 1 });
    }).join('');
    return (
      '<div class="fade-in">' +
        '<section class="container" style="padding:56px 0 24px;">' +
          '<p class="eyebrow">פרויקטים</p>' +
          '<h1 class="h1">תיק עבודות</h1>' +
          '<p class="lede" style="margin-top:16px;">אוסף הפרויקטים של המשרד — מבני מגורים, התחדשות עירונית ופרויקטים מסחריים. לחיצה על תמונה תפתח תצוגה מורחבת.</p>' +
        '</section>' +
        '<section class="container" style="padding-bottom:80px;">' +
          '<div class="proj-grid">' + cards + '</div>' +
        '</section>' +
      '</div>'
    );
  }

  function pageProjectDetail(id) {
    const p = findProject(id);
    if (!p) {
      return (
        '<div class="container" style="padding:80px 20px; text-align:center;">' +
          '<p class="muted" style="margin-bottom:16px;">הפרויקט לא נמצא.</p>' +
          '<a href="#/projects" style="text-decoration:underline;">חזרה לכל הפרויקטים</a>' +
        '</div>'
      );
    }
    const facts = [
      ['יזם', p.developer],
      ['סוג פרויקט', p.type],
      ['סטטוס', p.status],
      ['בניינים', p.buildings],
      ['יחידות', p.units],
      ['קומות', p.floors],
      ['מרתפי חניה', p.parking],
      ['שטח', p.area],
      ['מיקום', p.location],
    ].filter(function (kv) { return kv[1]; });

    const factsHTML = facts.map(function (kv) {
      return '<li><dt>' + escapeHtml(kv[0]) + '</dt><dd>' + escapeHtml(kv[1]) + '</dd></li>';
    }).join('');

    const galleryHTML = p.images.map(function (src, i) {
      return (
        '<button type="button" class="image-frame" data-open-gallery="' + i + '" aria-label="תמונה ' + (i + 1) + ' של ' + escapeHtml(p.name) + '">' +
          '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(p.name) + ' – תמונה ' + (i + 1) + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" />' +
        '</button>'
      );
    }).join('');

    const note = p.note ? '<p class="note">* ' + escapeHtml(p.note) + '</p>' : '';
    const loc = p.location ? '<p class="muted" style="margin-top:8px;">' + escapeHtml(p.location) + '</p>' : '';

    return (
      '<div class="fade-in" data-detail="' + escapeHtml(p.id) + '">' +
        '<section class="container" style="padding:56px 0 24px;">' +
          '<a href="#/projects" class="back-link">← חזרה לפרויקטים</a>' +
          '<h1 class="h1" style="margin-top:16px;">' + escapeHtml(p.name) + '</h1>' +
          loc +
        '</section>' +
        '<section class="container" style="padding-bottom:48px;">' +
          '<div class="detail-grid">' +
            '<div><div class="gallery">' + galleryHTML + '</div></div>' +
            '<aside><div class="facts-card">' +
              '<h2>פרטי הפרויקט</h2>' +
              '<ul class="facts-list">' + factsHTML + '</ul>' +
              note +
            '</div></aside>' +
          '</div>' +
        '</section>' +
      '</div>'
    );
  }

  function pageAbout() {
    return (
      '<div class="fade-in">' +
        '<section class="container" style="padding:56px 20px 32px; max-width:880px;">' +
          '<p class="eyebrow">אודות</p>' +
          '<h1 class="h1">המשרד פועל מתוך אמונה<br>שאדריכלות איכותית נוצרת<br>במפגש שבין חזון, עיצוב מדויק<br>והבנה עסקית מעמיקה.</h1>' +
        '</section>' +

        '<section class="container" style="padding:0 20px 32px; max-width:880px;">' +
          '<div class="prose">' +
            '<p>משרדנו מתמחה בתכנון ויצירת מבנים המשלבים בין אסתטיקה, פונקציונליות וחדשנות. המשרד, שנוסד על ידי האדריכל חיים דוד, מחויב לספק פתרונות אדריכליים מותאמים אישית לכל פרויקט, תוך תשומת לב מרבית לכל פרט ופרט. במהלך השנים, המשרד צבר ניסיון רב בפרויקטים מגוונים — החל ממגורים פרטיים, דרך תכנון מסחרי ותעשייתי, ועד לפרויקטים ציבוריים.</p>' +
            '<p>כל פרויקט, קטן כגדול, מקבל את תשומת הלב והאכפתיות המרבית כדי להבטיח תוצאה מושלמת שמתאימה לצרכים ולדרישות הלקוח. אנו פועלים בשיתוף פעולה צמוד עם לקוחותינו, לאורך כל שלבי התכנון והביצוע.</p>' +
            '<p>אנו מלווים יזמים, חברות בנייה ולקוחות פרטיים לאורך כל שלבי הפרויקט — משלב הרעיון וההיתכנות, דרך תכנון מוקפד ורישוי, ועד למימוש מלא בשטח. בכל פרויקט אנו שואפים למצות את זכויות הבנייה, לייעל את התהליך ולהעניק ערך מוסף אמיתי — תכנוני, כלכלי ואסתטי גם יחד.</p>' +
            '<p>כחלק מהתפיסה הכוללת של תכנון מדייק, אינטגרטיבי ויעיל, המשרד מספק גם שירותי ניהול BIM ותיאום מערכות. העבודות שלנו משלבות קווים נקיים עם רגישות לחומר, לסביבה ולחוויה האנושית. אנו שואפים ליצור מרחבים שמעניקים השראה, אך גם מתפקדים ביעילות ובחכמה לאורך זמן.</p>' +
          '</div>' +
        '</section>' +

        '<section class="container" style="padding:0 20px 64px; max-width:880px;">' +
          '<div class="prose-divider"></div>' +
          '<div class="prose">' +
            '<p class="eyebrow" style="margin-bottom:16px;">על האדריכל</p>' +
            '<p>המשרד הוקם על ידי <strong>האדריכל חיים דוד</strong>, בעל ניסיון של למעלה מ־11 שנה בתכנון, הובלת צוותים וניהול פרויקטים מורכבים. טרם ייסוד המשרד, שימש חיים כאדריכל וראש צוות במשרדים המובילים בישראל — <strong>אתגר נול אדריכלים</strong>, <strong>קולקר־קולקר־אפשטיין</strong>, ו<strong>דאובר אדריכלים</strong> — שם היה שותף לתכנון פרויקטים ציבוריים, מסחריים ופרטיים רחבי היקף. מרבית הפרויקטים המוצגים באתר נוהלו ותוכננו תחת אחריותו הישירה, ומשקפים את הקו המקצועי והערכים המנחים את פעילות המשרד.</p>' +
            '<p>האדריכלות עבורנו היא שפה — שפה שמתרגמת צרכים עסקיים ופרקטיים לחוויה מרחבית, אנושית ומרגשת.</p>' +
          '</div>' +
        '</section>' +

        trustedByHTML() +

        '<section class="section section-divider" style="text-align:center;">' +
          '<div class="container">' +
            '<h2 class="h2" style="margin-bottom:16px;">מעוניינים לשמוע עוד?</h2>' +
            '<a href="#/contact" class="btn">צרו קשר</a>' +
          '</div>' +
        '</section>' +
      '</div>'
    );
  }

  function pageContact() {
    const subject = encodeURIComponent('פנייה מאתר א.ח.ד אדריכלים');
    return (
      '<div class="fade-in">' +
        '<section class="container" style="padding:56px 0 32px;">' +
          '<p class="eyebrow">צור קשר</p>' +
          '<h1 class="h1">בואו נדבר.</h1>' +
          '<p class="lede" style="margin-top:20px;">לכל פנייה — ייעוץ ראשוני, תיאום פגישה, שיתוף פעולה או בקשת הצעת מחיר — ניתן ליצור איתנו קשר בערוצים הבאים.</p>' +
        '</section>' +

        '<section class="container" style="padding-bottom:80px;">' +
          '<div class="contact-grid">' +
            '<div>' +
              '<div class="contact-item"><p class="label">דוא״ל</p>' +
                '<a href="mailto:chaim.david.arc@gmail.com?subject=' + subject + '" dir="ltr">chaim.david.arc@gmail.com</a>' +
              '</div>' +
              '<div class="contact-item"><p class="label">טלפון</p>' +
                '<a href="tel:+972503898979" dir="ltr">+972 50 389 89 79</a>' +
              '</div>' +
              '<div class="contact-item"><p class="label">WhatsApp</p>' +
                '<a href="https://wa.me/972503898979" target="_blank" rel="noopener noreferrer">שליחת הודעה</a>' +
              '</div>' +
            '</div>' +
            '<form class="form" action="mailto:chaim.david.arc@gmail.com?subject=' + subject + '" method="post" enctype="text/plain" aria-label="טופס יצירת קשר">' +
              '<h2>שלחו הודעה</h2>' +
              '<div class="field"><label for="f-name">שם מלא *</label><input id="f-name" name="name" type="text" required /></div>' +
              '<div class="field"><label for="f-phone">טלפון</label><input id="f-phone" name="phone" type="tel" inputmode="tel" /></div>' +
              '<div class="field"><label for="f-email">דוא״ל</label><input id="f-email" name="email" type="email" /></div>' +
              '<div class="field"><label for="f-msg">הודעה *</label><textarea id="f-msg" name="message" rows="5" required></textarea></div>' +
              '<button type="submit" class="btn" style="width:100%;">שליחה</button>' +
              '<p class="form-note">ההודעה תיפתח בתוכנת הדוא״ל המוגדרת במכשיר שלכם. ניתן גם לפנות ישירות לכתובת המייל למעלה.</p>' +
            '</form>' +
          '</div>' +
        '</section>' +
      '</div>'
    );
  }

  // ---------- router ----------
  function parsePath() {
    const raw = (location.hash || '#/').replace(/^#/, '');
    return raw === '' ? '/' : raw;
  }

  function render() {
    const path = parsePath();
    let html;
    let title = 'א.ח.ד אדריכלים | חיים דוד';

    if (path === '/' || path === '') {
      html = pageHome();
    } else if (path === '/projects') {
      html = pageProjects();
      title = 'פרויקטים | א.ח.ד אדריכלים';
    } else if (path.indexOf('/projects/') === 0) {
      const id = path.slice('/projects/'.length);
      const p = findProject(id);
      html = pageProjectDetail(id);
      if (p) title = p.name + ' | א.ח.ד אדריכלים';
    } else if (path === '/about') {
      html = pageAbout();
      title = 'אודות | א.ח.ד אדריכלים';
    } else if (path === '/contact') {
      html = pageContact();
      title = 'צור קשר | א.ח.ד אדריכלים';
    } else {
      html = pageHome();
    }

    main.innerHTML = html;
    document.title = title;

    // Close mobile nav on navigation
    setMobileNav(false);

    // Update nav active states
    let navPath = path;
    if (navPath.indexOf('/projects/') === 0) navPath = '/projects';
    updateNavActive(navPath);

    // Wire interactions inside the page
    wirePageInteractions();

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }

  function wirePageInteractions() {
    // Project cards (cover image opens lightbox of all images of that project)
    main.querySelectorAll('[data-open-project]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const p = findProject(btn.getAttribute('data-open-project'));
        if (!p) return;
        lbOpen(p.images, 0, p.name);
      });
    });

    // Project detail gallery: each image opens lightbox at its own index, with all images
    const detail = main.querySelector('[data-detail]');
    if (detail) {
      const id = detail.getAttribute('data-detail');
      const p = findProject(id);
      detail.querySelectorAll('[data-open-gallery]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!p) return;
          const idx = parseInt(btn.getAttribute('data-open-gallery'), 10) || 0;
          lbOpen(p.images, idx, p.name);
        });
      });
    }
  }

  // ---------- boot ----------
  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
