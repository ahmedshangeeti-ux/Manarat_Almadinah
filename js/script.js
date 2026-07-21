(function () {
  "use strict";

  var STORAGE_KEY = "manarat_lang";
  var dict = window.SITE_I18N || { en: {}, ar: {} };

  /* ---------------- Language ---------------- */
  function applyLanguage(lang) {
    var t = dict[lang] || dict.en;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.classList.toggle("lang-ar", lang === "ar");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.setAttribute("placeholder", t[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (t[key] !== undefined) el.setAttribute("aria-label", t[key]);
    });

    if (t["meta.title"]) document.title = t["meta.title"];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t["meta.description"]) metaDesc.setAttribute("content", t["meta.description"]);

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function currentLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return stored === "ar" || stored === "en" ? stored : "en";
  }

  function initLanguage() {
    applyLanguage(currentLang());
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("lang") === "ar" ? "en" : "ar";
        applyLanguage(next);
      });
    });
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.querySelector(".mobile-nav");
    var closeBtn = document.querySelector(".mobile-nav-close");
    if (!toggle || !drawer) return;
    function open() { drawer.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    function close() { drawer.classList.remove("is-open"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Project filter ---------------- */
  function initProjectFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll("[data-sector]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var sector = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = sector === "all" || card.getAttribute("data-sector") === sector;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Back to top ---------------- */
  function initToTop() {
    var btn = document.querySelector(".to-top");
    if (!btn) return;
    function onScroll() { btn.classList.toggle("is-visible", window.scrollY > 480); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Contact form ---------------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      var data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      }).then(function () {
        form.reset();
        if (status) {
          var lang = document.documentElement.getAttribute("lang") || "en";
          status.textContent = (dict[lang] || dict.en)["form.success"];
          status.classList.add("success");
        }
      }).catch(function () {
        form.submit();
      });
    });
  }

  /* ---------------- Year ---------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguage();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initProjectFilter();
    initToTop();
    initContactForm();
    initYear();
  });
})();
