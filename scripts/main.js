/* Project K.I.L.O.S. - Shared Scripts */

/* ============================================================
   1. TAILWIND CONFIG (design tokens: colors, spacing, fonts)
   Unchanged from before — must run BEFORE Tailwind CDN scans
   the page's classes:
     1. <script src="...tailwindcss..."></script>
     2. <script src="scripts/main.js"></script>
     3. rest of the page
   ============================================================ */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary-fixed": "#a0f4c8",
        "surface": "#fcf9f8",
        "primary-container": "#2d6a4f",
        "surface-container": "#f0eded",
        "on-secondary-fixed-variant": "#005236",
        "surface-tint": "#2c694e",
        "surface-dim": "#dcd9d9",
        "on-error-container": "#93000a",
        "error-container": "#ffdad6",
        "on-primary-fixed": "#002114",
        "on-secondary": "#ffffff",
        "secondary-container": "#a0f4c8",
        "primary": "#0f5238",
        "secondary": "#0e6c4a",
        "on-surface-variant": "#404943",
        "on-secondary-fixed": "#002113",
        "inverse-primary": "#95d4b3",
        "outline-variant": "#bfc9c1",
        "surface-variant": "#e5e2e1",
        "background": "#fcf9f8",
        "on-error": "#ffffff",
        "inverse-on-surface": "#f3f0ef",
        "on-tertiary-container": "#d5dccd",
        "tertiary-fixed": "#dee5d6",
        "on-tertiary-fixed-variant": "#42493e",
        "on-surface": "#1b1b1b",
        "on-secondary-container": "#19724f",
        "surface-container-low": "#f6f3f2",
        "primary-fixed": "#b1f0ce",
        "on-tertiary": "#ffffff",
        "inverse-surface": "#313030",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#171d14",
        "outline": "#707973",
        "on-primary-container": "#a8e7c5",
        "error": "#ba1a1a",
        "tertiary": "#42493f",
        "tertiary-fixed-dim": "#c2c9bb",
        "primary-fixed-dim": "#95d4b3",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#eae7e7",
        "surface-bright": "#fcf9f8",
        "on-primary-fixed-variant": "#0e5138",
        "tertiary-container": "#5a6156",
        "surface-container-highest": "#e5e2e1",
        "on-background": "#1b1b1b",
        "secondary-fixed-dim": "#85d7ad",
        "warning": "#d32f2f"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        gutter: "16px",
        "container-margin": "24px",
        "stack-md": "24px",
        "stack-sm": "12px",
        "stack-lg": "48px",
        base: "8px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Lexend"],
        "data-display": ["Lexend"],
        "headline-md": ["Lexend"],
        "body-lg": ["Lexend"],
        "label-caps": ["Inter"],
        "body-md": ["Lexend"],
        "headline-lg": ["Lexend"]
      },
      fontSize: {
        "headline-lg-mobile": ["26px", { lineHeight: "32px", fontWeight: "700" }],
        "data-display": ["48px", { lineHeight: "56px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-caps": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  }
};

/* ============================================================
   2. ROUTER
   One shell (index.html), four <template> blocks (one per page).
   Navigating writes a hash (#/, #/about, #/tracker, #/emergency)
   instead of loading a new document — the browser never reloads,
   so #site-header / #site-bottom-nav stay mounted
   and only #page-content's innerHTML is swapped.

   Hash routing (rather than pushState + fetch) is deliberate here:
   it needs zero server config to work on any static host, and it
   also works when the file is opened directly (file://) since
   there's no fetch() of a second document involved.
   ============================================================ */
const ROUTES = {
  "/": { page: "home", title: "Project K.I.L.O.S. - Home", template: "tpl-home" },
  "/about": { page: "about", title: "About Hypertension - K.I.L.O.S.", template: "tpl-about" },
  "/tracker": { page: "tracker", title: "BP Tracker - K.I.L.O.S.", template: "tpl-tracker" },
  "/emergency": { page: "emergency", title: "Emergency Plan - K.I.L.O.S.", template: "tpl-emergency" }
};

function currentPath() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1); // drop leading "#"
  return ROUTES[path] ? path : "/";
}

function render() {
  const path = currentPath();
  const route = ROUTES[path];
  const mount = document.getElementById("page-content");
  const tpl = document.getElementById(route.template);
  if (!mount || !tpl) return;

  mount.innerHTML = "";
  mount.appendChild(tpl.content.cloneNode(true));
  document.title = route.title;
  document.body.dataset.page = route.page;

  // Header/bottom-nav are re-rendered (not re-mounted) so their
  // active-link highlight updates to match the new page.
  renderHeader();
  renderBottomNav();

  // Re-run per-page behavior. Cloning a <template> gives fresh DOM
  // nodes with no listeners, so this must happen on every render,
  // not just once on load.
  if (route.page === "tracker") initBpForm();

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

window.addEventListener("hashchange", render);

/* ============================================================
   3. SHARED CHROME (header, bottom nav, footer)
   Same templates as before, just pointed at hash routes instead
   of separate .html files, and re-invokable (render() calls
   renderHeader/renderBottomNav again on every navigation).
   ============================================================ */
(function () {
  const NAV_ITEMS = [
    { key: "home", label: "Home", icon: "home", path: "/" },
    { key: "about", label: "About Hypertension", icon: "menu_book", path: "/about" },
    { key: "tracker", label: "BP Tracker", icon: "monitor_heart", path: "/tracker" },
    { key: "emergency", label: "Emergency Plan", icon: "emergency_share", path: "/emergency" }
  ];

  // Bottom nav keeps its own shorter labels/order, matching the original.
  const BOTTOM_NAV_ITEMS = [
    { key: "home", label: "Home", icon: "home", path: "/" },
    { key: "about", label: "About", icon: "menu_book", path: "/about" },
    { key: "tracker", label: "Tracker", icon: "monitor_heart", path: "/tracker" },
    { key: "emergency", label: "Emergency", icon: "emergency_share", path: "/emergency" }
  ];

  window.renderHeader = function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const currentPage = document.body.dataset.page || "home";

    const links = NAV_ITEMS.map((item) => {
      const active = item.key === currentPage;
      const activeClasses = "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed font-bold";
      const inactiveClasses = "text-on-surface-variant dark:text-surface-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim";
      return `<a class="font-label-caps text-label-caps ${active ? activeClasses : inactiveClasses} transition-colors py-2" href="#${item.path}">${item.label}</a>`;
    }).join("\n      ");

    mount.innerHTML = `
<header class="md:sticky md:top-0 w-full z-50 flex justify-between items-center px-container-margin py-4 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline">
  <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed" href="#/">K.I.L.O.S.</a>
  <nav class="hidden md:flex gap-6 items-center ml-auto">
      ${links}
  </nav>
  <div class="flex items-center gap-4 text-primary dark:text-primary-fixed ml-6">
    <button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"></button>
  </div>
</header>`;
  };

  window.renderBottomNav = function renderBottomNav() {
    const mount = document.getElementById("site-bottom-nav");
    if (!mount) return;
    const currentPage = document.body.dataset.page || "home";

    const links = BOTTOM_NAV_ITEMS.map((item) => {
      const active = item.key === currentPage;
      const activeClasses = "bg-secondary-container dark:bg-primary-container text-on-secondary-container dark:text-on-primary-container";
      const inactiveClasses = "text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-tertiary-container";
      return `
  <a class="flex flex-col items-center justify-center ${active ? activeClasses : inactiveClasses} rounded-full px-4 py-1 transition-transform active:scale-90 duration-150" href="#${item.path}">
    <span class="material-symbols-outlined mb-1"${active ? ' data-weight="fill"' : ""}>${item.icon}</span>
    <span class="font-label-caps text-label-caps text-[10px] leading-tight">${item.label}</span>
  </a>`;
    }).join("");

    mount.innerHTML = `
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface dark:bg-surface-container-low border-t border-outline-variant shadow-lg">${links}
</nav>`;
  };

  window.renderFooter = function renderFooter() {
    // Footer removed from the site — kept as a no-op so nothing
    // breaks if something still calls it.
  };

  // Footer chrome never changes between routes, so it only needs to
  // render once (unlike header/bottom-nav, which re-render on every
  // navigation to update the active-link highlight).
  document.addEventListener("DOMContentLoaded", function () {
    render(); // initial paint of #page-content + header/bottom-nav
  });
})();

/* ============================================================
   4. WELCOME MODAL (name capture + localStorage, first visit only)
   Lives in the shell markup, so this only needs to run once on
   load — it does not depend on which route is showing.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("welcome-modal-overlay");
  if (!overlay) return;

  const input = document.getElementById("user-name-input");
  const okBtn = document.getElementById("modal-ok-btn");
  const skipBtn = document.getElementById("modal-skip-btn");

  if (!localStorage.getItem("hasVisited")) {
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    overlay.classList.add("hidden");
    localStorage.setItem("hasVisited", "true");
  }

  okBtn.addEventListener("click", () => {
    const name = input.value.trim();
    if (name) {
      localStorage.setItem("userName", name);
    }
    closeModal();
  });

  skipBtn.addEventListener("click", closeModal);
});

/* ============================================================
   5. BP TRACKER FORM (visual stub only — does not persist yet)
   TODO: replace with real localStorage-backed logging + dynamic
   history list per the Development Plan, Milestone 5.

   Called from render() every time the tracker template is
   cloned in, since a fresh clone has no event listeners attached.
   ============================================================ */
function initBpForm() {
  const greeting = document.querySelector("[data-greeting]");
  if (greeting) {
    const name = localStorage.getItem("userName");
    greeting.textContent = name ? `Magandang araw, ${name}!` : "Magandang araw!";
  }

  const form = document.getElementById("bpForm");
  if (!form) return;

  const successState = document.getElementById("successState");
  const resetBtn = document.getElementById("resetForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Simulate saving
    setTimeout(() => {
      successState.classList.remove("hidden");
    }, 300);
  });

  resetBtn.addEventListener("click", () => {
    successState.classList.add("hidden");
    form.reset();
  });
}