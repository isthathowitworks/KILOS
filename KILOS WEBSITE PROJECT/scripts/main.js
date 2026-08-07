/* Project K.I.L.O.S. - Shared Scripts */

/* ============================================================
   1. TAILWIND CONFIG (design tokens: colors, spacing, fonts)
   This must run BEFORE Tailwind CDN scans the page's classes,
   so in every page keep the order:
     1. <script src="...tailwindcss..."></script>
     2. <script src=".../scripts/main.js"></script>
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
   2. SHARED NAVIGATION (header, bottom nav, footer)
   Single source of truth for every page's chrome, so nav never
   drifts out of alignment again — edit the templates below and
   every page picks up the change automatically.

   Each page just needs:
     <body data-page="home|about|emergency|tracker">
     <div id="site-header"></div>   ... in place of <header>
     <div id="site-footer"></div>   ... in place of <footer>
     <div id="site-bottom-nav"></div> ... in place of the mobile nav
   ============================================================ */
(function () {
  const NAV_ITEMS = [
    { key: "home", label: "Home", icon: "home", target: "home" },
    { key: "about", label: "About Hypertension", icon: "menu_book", target: "about" },
    { key: "emergency", label: "Emergency Plan", icon: "emergency_share", target: "emergency" },
    { key: "tracker", label: "BP Tracker", icon: "monitor_heart", target: "tracker" }
  ];

  // Bottom nav shows a shorter label + different order/icon weight than the
  // desktop nav, matching the original per-page markup.
  const BOTTOM_NAV_ITEMS = [
    { key: "home", label: "Home", icon: "home", target: "home" },
    { key: "about", label: "Education", icon: "menu_book", target: "about" },
    { key: "tracker", label: "Tracker", icon: "monitor_heart", target: "tracker" },
    { key: "emergency", label: "Emergency", icon: "emergency_share", target: "emergency" }
  ];

  function isInNavigationFolder() {
    return window.location.pathname.includes("/navigation/");
  }

  function hrefFor(target) {
    const inNav = isInNavigationFolder();
    if (target === "home") return inNav ? "../index.html" : "index.html";
    const file = {
      about: "abouthypertension.html",
      emergency: "emergencyplan.html",
      tracker: "bptracker.html"
    }[target];
    return inNav ? file : "navigation/" + file;
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const currentPage = document.body.dataset.page || "";

    const links = NAV_ITEMS.map((item) => {
      const active = item.target === currentPage;
      const activeClasses = "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed font-bold";
      const inactiveClasses = "text-on-surface-variant dark:text-surface-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim";
      return `<a class="font-label-caps text-label-caps ${active ? activeClasses : inactiveClasses} transition-colors py-2" href="${hrefFor(item.target)}">${item.label}</a>`;
    }).join("\n      ");

    mount.innerHTML = `
<header class="sticky top-0 w-full z-50 flex justify-between items-center px-container-margin py-4 max-w-[1140px] mx-auto bg-surface dark:bg-background border-b border-outline-variant dark:border-outline">
  <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed" href="${hrefFor("home")}">K.I.L.O.S.</a>
  <nav class="hidden md:flex gap-6 items-center ml-auto">
      ${links}
  </nav>
  <div class="flex items-center gap-4 text-primary dark:text-primary-fixed ml-6">
    <button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"></button>
  </div>
</header>`;
  }

  function renderBottomNav() {
    const mount = document.getElementById("site-bottom-nav");
    if (!mount) return;
    const currentPage = document.body.dataset.page || "";

    const links = BOTTOM_NAV_ITEMS.map((item) => {
      const active = item.target === currentPage;
      const activeClasses = "bg-secondary-container dark:bg-primary-container text-on-secondary-container dark:text-on-primary-container";
      const inactiveClasses = "text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-tertiary-container";
      return `
  <a class="flex flex-col items-center justify-center ${active ? activeClasses : inactiveClasses} rounded-full px-4 py-1 transition-transform active:scale-90 duration-150" href="${hrefFor(item.target)}">
    <span class="material-symbols-outlined mb-1"${active ? ' data-weight="fill"' : ""}>${item.icon}</span>
    <span class="font-label-caps text-label-caps text-[10px] leading-tight">${item.label}</span>
  </a>`;
    }).join("");

    mount.innerHTML = `
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface dark:bg-surface-container-low border-t border-outline-variant shadow-lg rounded-t-xl">${links}
</nav>`;
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    mount.innerHTML = `
<footer class="w-full px-container-margin py-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md max-w-[1140px] mx-auto bg-surface-container dark:bg-surface-container-highest border-t border-outline-variant mt-auto">
  <div class="flex flex-col items-center md:items-start gap-2">
    <span class="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">K.I.L.O.S.</span>
    <span class="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant text-center md:text-left">© 2024 Project K.I.L.O.S. - Alagaan ang Puso para sa Magandang Bukas.</span>
  </div>
  <div class="flex flex-col md:flex-row gap-4 items-center">
    <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-opacity duration-200" href="#">Contact Barangay Health Center</a>
    <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-opacity duration-200" href="#">Privacy Policy</a>
    <a class="font-label-caps text-label-caps text-error font-bold hover:text-error transition-opacity duration-200" href="#">Emergency Hotline: 911</a>
  </div>
</footer>`;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderBottomNav();
    renderFooter();
  });
})();

/* ============================================================
   3. WELCOME MODAL (name capture + localStorage, first visit only)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("welcome-modal-overlay");
  if (!overlay) return; // page doesn't have the modal, skip safely

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
   4. BP TRACKER FORM (visual stub only — does not persist yet)
   TODO: replace with real localStorage-backed logging + dynamic
   history list per the Development Plan, Milestone 5.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bpForm");
  if (!form) return; // page doesn't have the tracker form, skip safely

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
});