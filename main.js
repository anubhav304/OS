
/* =========================================================
   OS ATLAS — MAIN.JS
   Interaction layer for the editorial OS learning site.
   No dependencies.
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     DOM
  ------------------------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const body = document.body;

  /* -------------------------------------------------------
     GLOBAL STATE
  ------------------------------------------------------- */

  const state = {
    currentSection: null,
    menuOpen: false,
    reducedMotion: false,
    initialized: false
  };

  /* -------------------------------------------------------
     REDUCED MOTION
  ------------------------------------------------------- */

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  state.reducedMotion = motionQuery.matches;

  motionQuery.addEventListener?.("change", event => {
    state.reducedMotion = event.matches;
  });

  /* -------------------------------------------------------
     SCROLL PROGRESS
  ------------------------------------------------------- */

  function createScrollProgress() {
    let bar = $(".scroll-progress");

    if (!bar) {
      bar = document.createElement("div");
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");

      document.body.appendChild(bar);
    }

    function update() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollable > 0
          ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
          : 0;

      bar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* -------------------------------------------------------
     REVEAL ON SCROLL
  ------------------------------------------------------- */

  function initReveal() {
    const elements = $$(
      "[data-reveal], .reveal, .section-reveal, .chapter-block"
    );

    if (!elements.length) return;

    if (
      state.reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
     SMOOTH ANCHOR NAVIGATION
  ------------------------------------------------------- */

  function initAnchors() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: state.reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        history.replaceState(null, "", href);
      });
    });
  }

  /* -------------------------------------------------------
     ACTIVE SECTION TRACKING
  ------------------------------------------------------- */

  function initSectionTracking() {
    const sections = $$(
      "main section[id], [data-section-id], .chapter[id]"
    );

    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) return;

    const links = $$(
      'a[href^="#"], [data-nav-target]'
    );

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const id = visible[0].target.id;

        if (!id || state.currentSection === id) return;

        state.currentSection = id;

        links.forEach(link => {
          const target =
            link.getAttribute("href")?.replace("#", "") ||
            link.dataset.navTarget;

          link.classList.toggle(
            "is-active",
            target === id
          );
        });
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  /* -------------------------------------------------------
     MOBILE / DRAWER NAVIGATION
  ------------------------------------------------------- */

  function initMenu() {
    const toggle =
      $("[data-menu-toggle]") ||
      $(".menu-toggle") ||
      $(".nav-toggle");

    const menu =
      $("[data-menu]") ||
      $(".mobile-menu") ||
      $(".site-menu");

    if (!toggle || !menu) return;

    const closeMenu = () => {
      state.menuOpen = false;

      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      body.classList.remove("menu-open");

      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      state.menuOpen = true;

      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      body.classList.add("menu-open");

      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      state.menuOpen ? closeMenu() : openMenu();
    });

    $$("a", menu).forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && state.menuOpen) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------------
     ACCORDIONS
  ------------------------------------------------------- */

  function initAccordions() {
    const triggers = $$(
      "[data-accordion-trigger], .accordion-trigger"
    );

    triggers.forEach(trigger => {
      const item =
        trigger.closest("[data-accordion]") ||
        trigger.closest(".accordion") ||
        trigger.parentElement;

      if (!item) return;

      const panel =
        item.querySelector("[data-accordion-panel]") ||
        item.querySelector(".accordion-panel");

      if (!panel) return;

      trigger.setAttribute(
        "aria-expanded",
        item.classList.contains("is-open")
          ? "true"
          : "false"
      );

      trigger.addEventListener("click", () => {
        const open = item.classList.toggle("is-open");

        trigger.setAttribute(
          "aria-expanded",
          String(open)
        );

        if (open) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        } else {
          panel.style.maxHeight = "0px";
        }
      });
    });
  }

  /* -------------------------------------------------------
     TABS
  ------------------------------------------------------- */

  function initTabs() {
    $$("[data-tabs]").forEach(tabGroup => {
      const tabs = $$(
        "[data-tab]",
        tabGroup
      );

      const panels = $$(
        "[data-tab-panel]",
        tabGroup
      );

      if (!tabs.length || !panels.length) return;

      function activate(id) {
        tabs.forEach(tab => {
          const active =
            tab.dataset.tab === id;

          tab.classList.toggle("is-active", active);
          tab.setAttribute(
            "aria-selected",
            String(active)
          );
        });

        panels.forEach(panel => {
          const active =
            panel.dataset.tabPanel === id;

          panel.classList.toggle(
            "is-active",
            active
          );

          panel.hidden = !active;
        });
      }

      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          activate(tab.dataset.tab);
        });

        tab.addEventListener("keydown", event => {
          if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft"
          ) {
            return;
          }

          event.preventDefault();

          const current =
            tabs.indexOf(tab);

          const direction =
            event.key === "ArrowRight"
              ? 1
              : -1;

          const next =
            (current + direction + tabs.length) %
            tabs.length;

          tabs[next].focus();
          activate(tabs[next].dataset.tab);
        });
      });

      const initial =
        tabs.find(tab =>
          tab.classList.contains("is-active")
        )?.dataset.tab ||
        tabs[0].dataset.tab;

      activate(initial);
    });
  }

  /* -------------------------------------------------------
     PROCESS / MEMORY VISUALIZATION
  ------------------------------------------------------- */

  function initInteractiveDiagrams() {
    $$("[data-diagram]").forEach(diagram => {
      const parts = $$(
        "[data-diagram-part]",
        diagram
      );

      const info = $(
        "[data-diagram-info]",
        diagram
      );

      if (!parts.length) return;

      parts.forEach(part => {
        part.setAttribute("tabindex", "0");
        part.setAttribute("role", "button");

        const activate = () => {
          parts.forEach(p =>
            p.classList.remove("is-selected")
          );

          part.classList.add("is-selected");

          const key =
            part.dataset.diagramPart;

          const source =
            diagram.querySelector(
              `[data-diagram-description="${CSS.escape(key)}"]`
            );

          if (info && source) {
            info.innerHTML = source.innerHTML;
            info.classList.add("is-visible");
          }
        };

        part.addEventListener("click", activate);

        part.addEventListener("keydown", event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        });
      });

      parts[0]?.classList.add("is-selected");
    });
  }

  /* -------------------------------------------------------
     COPY BUTTONS
  ------------------------------------------------------- */

  function initCopyButtons() {
    $$("[data-copy]").forEach(button => {
      button.addEventListener("click", async () => {
        const selector =
          button.dataset.copy;

        const target = selector
          ? document.querySelector(selector)
          : button.previousElementSibling;

        if (!target) return;

        const text =
          target.innerText ||
          target.textContent ||
          "";

        try {
          await navigator.clipboard.writeText(text);

          const original =
            button.textContent;

          button.textContent = "COPIED";

          button.classList.add("is-copied");

          setTimeout(() => {
            button.textContent = original;
            button.classList.remove("is-copied");
          }, 1400);
        } catch {
          fallbackCopy(text, button);
        }
      });
    });
  }

  function fallbackCopy(text, button) {
    const textarea =
      document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    try {
      document.execCommand("copy");

      const original =
        button.textContent;

      button.textContent = "COPIED";

      setTimeout(() => {
        button.textContent = original;
      }, 1400);
    } finally {
      textarea.remove();
    }
  }

  /* -------------------------------------------------------
     CODE BLOCK LINE NUMBERS
  ------------------------------------------------------- */

  function initCodeBlocks() {
    $$("pre[data-line-numbers]").forEach(pre => {
      const code = $("code", pre);

      if (!code || code.dataset.numbered) return;

      const lines =
        code.innerHTML.split("\n");

      code.innerHTML = lines
        .map(
          (line, index) =>
            `<span class="code-line"><span class="line-number">${String(
              index + 1
            ).padStart(2, "0")}</span><span class="line-content">${line || " "}</span></span>`
        )
        .join("");

      code.dataset.numbered = "true";
    });
  }

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  function initSearch() {
    const input =
      $("[data-search]") ||
      $(".site-search input");

    if (!input) return;

    const searchable = $$(
      "[data-searchable], article, .chapter-block, .concept"
    );

    if (!searchable.length) return;

    let emptyMessage =
      $("[data-search-empty]");

    if (!emptyMessage) {
      emptyMessage =
        document.createElement("p");

      emptyMessage.dataset.searchEmpty = "";
      emptyMessage.textContent =
        "NO MATCHES. TRY A DIFFERENT TERM.";
      emptyMessage.hidden = true;

      input.parentElement?.appendChild(
        emptyMessage
      );
    }

    input.addEventListener("input", () => {
      const query =
        input.value
          .trim()
          .toLowerCase();

      if (!query) {
        searchable.forEach(el => {
          el.hidden = false;
          el.classList.remove("search-match");
        });

        emptyMessage.hidden = true;
        return;
      }

      let matches = 0;

      searchable.forEach(el => {
        const text =
          el.textContent.toLowerCase();

        const match =
          text.includes(query);

        el.hidden = !match;
        el.classList.toggle(
          "search-match",
          match
        );

        if (match) matches++;
      });

      emptyMessage.hidden = matches !== 0;
    });

    document.addEventListener("keydown", event => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    });
  }

  /* -------------------------------------------------------
     TOOLTIP / INFO LABELS
  ------------------------------------------------------- */

  function initTooltips() {
    $$("[data-tooltip]").forEach(element => {
      element.setAttribute("tabindex", "0");

      let tooltip;

      const show = () => {
        if (tooltip) return;

        tooltip =
          document.createElement("div");

        tooltip.className = "editorial-tooltip";
        tooltip.textContent =
          element.dataset.tooltip;

        document.body.appendChild(tooltip);

        const rect =
          element.getBoundingClientRect();

        tooltip.style.left =
          `${rect.left + window.scrollX}px`;

        tooltip.style.top =
          `${rect.bottom + window.scrollY + 8}px`;

        requestAnimationFrame(() => {
          tooltip.classList.add("is-visible");
        });
      };

      const hide = () => {
        if (!tooltip) return;

        tooltip.classList.remove("is-visible");

        setTimeout(() => {
          tooltip?.remove();
          tooltip = null;
        }, 150);
      };

      element.addEventListener("mouseenter", show);
      element.addEventListener("mouseleave", hide);

      element.addEventListener("focus", show);
      element.addEventListener("blur", hide);
    });
  }

  /* -------------------------------------------------------
     RANDOM FACT / MARGIN NOTES
  ------------------------------------------------------- */

  function initFactButtons() {
    $$("[data-random-fact]").forEach(button => {
      const target =
        button.dataset.target
          ? document.querySelector(
              button.dataset.target
            )
          : button.nextElementSibling;

      if (!target) return;

      const facts =
        $$("[data-fact]", target);

      if (!facts.length) return;

      let current = -1;

      button.addEventListener("click", () => {
        current =
          (current + 1) % facts.length;

        facts.forEach((fact, index) => {
          fact.hidden = index !== current;
        });
      });
    });
  }

  /* -------------------------------------------------------
     READING TIME
  ------------------------------------------------------- */

  function calculateReadingTime() {
    const article =
      $("main") ||
      $("article");

    const target =
      article ||
      document.body;

    const text =
      target.innerText || "";

    const words =
      text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    const minutes =
      Math.max(1, Math.ceil(words / 210));

    $$("[data-reading-time]").forEach(el => {
      el.textContent =
        `${minutes} MIN READ`;
    });
  }

  /* -------------------------------------------------------
     CLOCK / SYSTEM STATUS
  ------------------------------------------------------- */

  function initClock() {
    $$("[data-clock]").forEach(clock => {
      const update = () => {
        const now = new Date();

        clock.textContent =
          now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          });
      };

      update();

      setInterval(update, 1000);
    });
  }

  /* -------------------------------------------------------
     BACK TO TOP
  ------------------------------------------------------- */

  function initBackToTop() {
    const button =
      $("[data-back-top]") ||
      $(".back-to-top");

    if (!button) return;

    const update = () => {
      button.classList.toggle(
        "is-visible",
        window.scrollY > window.innerHeight * 0.6
      );
    };

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: state.reducedMotion
          ? "auto"
          : "smooth"
      });
    });

    update();
  }

  /* -------------------------------------------------------
     EXTERNAL PAGE NAVIGATION
  ------------------------------------------------------- */

  function initPageLinks() {
    $$("[data-page]").forEach(link => {
      link.addEventListener("click", event => {
        const page =
          link.dataset.page;

        if (!page) return;

        event.preventDefault();

        window.location.href = page;
      });
    });
  }

  /* -------------------------------------------------------
     PRINT / KEYBOARD SHORTCUTS
  ------------------------------------------------------- */

  function initKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
      if (
        event.key.toLowerCase() === "p" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTyping(event.target)
      ) {
        window.print();
      }
    });
  }

  function isTyping(element) {
    if (!element) return false;

    const tag =
      element.tagName?.toLowerCase();

    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      element.isContentEditable
    );
  }

  /* -------------------------------------------------------
     HORIZONTAL SCROLL STRIPS
  ------------------------------------------------------- */

  function initHorizontalStrips() {
    $$("[data-horizontal-scroll]").forEach(strip => {
      let dragging = false;
      let startX = 0;
      let startScroll = 0;

      strip.addEventListener("pointerdown", event => {
        dragging = true;
        startX = event.clientX;
        startScroll = strip.scrollLeft;

        strip.classList.add("is-dragging");

        try {
          strip.setPointerCapture(event.pointerId);
        } catch {}
      });

      strip.addEventListener("pointermove", event => {
        if (!dragging) return;

        const distance =
          event.clientX - startX;

        strip.scrollLeft =
          startScroll - distance;
      });

      const stop = () => {
        dragging = false;
        strip.classList.remove("is-dragging");
      };

      strip.addEventListener(
        "pointerup",
        stop
      );

      strip.addEventListener(
        "pointercancel",
        stop
      );

      strip.addEventListener(
        "pointerleave",
        event => {
          if (!event.buttons) stop();
        }
      );
    });
  }

  /* -------------------------------------------------------
     HOVER DEPTH / EDITORIAL MICRO-INTERACTION
  ------------------------------------------------------- */

  function initHoverCoordinates() {
    if (state.reducedMotion) return;

    $$("[data-hover-depth]").forEach(element => {
      element.addEventListener(
        "pointermove",
        event => {
          const rect =
            element.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateX =
            (0.5 - y) * 2;

          const rotateY =
            (x - 0.5) * 2;

          element.style.setProperty(
            "--hover-x",
            `${x * 100}%`
          );

          element.style.setProperty(
            "--hover-y",
            `${y * 100}%`
          );

          element.style.setProperty(
            "--rotate-x",
            `${rotateX}deg`
          );

          element.style.setProperty(
            "--rotate-y",
            `${rotateY}deg`
          );
        }
      );

      element.addEventListener(
        "pointerleave",
        () => {
          element.style.setProperty(
            "--hover-x",
            "50%"
          );

          element.style.setProperty(
            "--hover-y",
            "50%"
          );

          element.style.setProperty(
            "--rotate-x",
            "0deg"
          );

          element.style.setProperty(
            "--rotate-y",
            "0deg"
          );
        }
      );
    });
  }

  /* -------------------------------------------------------
     FOOTER YEAR
  ------------------------------------------------------- */

  function initYear() {
    $$("[data-year]").forEach(el => {
      el.textContent =
        new Date().getFullYear();
    });
  }

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  function init() {
    if (state.initialized) return;

    state.initialized = true;

    createScrollProgress();
    initReveal();
    initAnchors();
    initSectionTracking();
    initMenu();
    initAccordions();
    initTabs();
    initInteractiveDiagrams();
    initCopyButtons();
    initCodeBlocks();
    initSearch();
    initTooltips();
    initFactButtons();
    calculateReadingTime();
    initClock();
    initBackToTop();
    initPageLinks();
    initKeyboardShortcuts();
    initHorizontalStrips();
    initHoverCoordinates();
    initYear();

    body.classList.add("js-ready");
  }

  /* -------------------------------------------------------
     BOOT
  ------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
