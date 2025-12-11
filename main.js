document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  if (body.classList.contains("index-page")) initIndexPage();
  if (body.classList.contains("source-page")) initSourcePage();
  if (body.classList.contains("true-source-page")) initTrueSourcePage();
});

/* Shared impact pulses */
function impactFlashSequence(flashEl) {
  if (!flashEl) return;
  const hits = [0, 120, 260, 360, 520];
  hits.forEach(time => {
    setTimeout(() => {
      flashEl.classList.add("pop");
      setTimeout(() => flashEl.classList.remove("pop"), 40);
    }, time);
  });
}

/* ────────────────────────────────────────────────
   INDEX LOGIC
   ──────────────────────────────────────────────── */
function initIndexPage() {
  const intro       = document.getElementById("intro");
  const introInner  = document.querySelector(".intro-inner");
  const site        = document.getElementById("site");
  const headline    = document.getElementById("headline");
  const loading     = document.getElementById("loading-block");
  const terminal    = document.getElementById("terminal");
  const flash       = document.getElementById("flash");
  const helloTextEl = document.getElementById("hello-text");

  const helloString = "Hello World!";

  /* Boot lines */
  const bootLines = [
    "[IN] Starting introspective sweep...",
    "[IN] Loading narrative stack...",
    "[SC] Scanning for active identities...",
    "[SC] Found: ego.default (uptime: long)",
    "[AN] Evaluating ego.default...",
    "[WR] ego.default exhibits rigid patterns",
    "[SG] Sending SIGTERM...",
    "[SG] Escalating...",
    "[SG] Sending SIGKILL...",
    "[OK] ego.default terminated",
    "[GC] Flushing cached reactions...",
    "[GC] Clearing residues...",
    "[OK] Emotional cleanup complete",
    "[IM] Collecting stale self-images...",
    "[IM] Pruning judgments...",
    "[OK] Outdated roles unmounted",
    "[EX] Detaching expectations...",
    "[EX] Dropping dependencies...",
    "[OK] Validation subsystem offline",
    "[VO] Rewriting monologue schema...",
    "[OK] Observer layer calibrated",
    "[DR] Removing abandoned ambitions...",
    "[OK] Kernel cleaned",
    "[VA] Sorting core values...",
    "[OK] Alignment successful",
    "[PN] Initializing persona.next...",
    "[OK] persona.next seeded",
    "[RT] Updating expression routes...",
    "[OK] Output path stable",
    "[VR] Checking for leftovers...",
    "[OK] Identity space clean",
    "[AU] Authenticity verified",
    "[CR] Activating improvisational engine...",
    "[OK] Cognitive sync complete",
    "[RD] persona.next online",
    "[DN] Boot sequence complete"
  ];

  /* Boot print loop */
  let bootIndex = 0;
  const bootInterval = setInterval(() => {
    const line = document.createElement("div");
    line.textContent = bootLines[bootIndex];
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;

    bootIndex = (bootIndex + 1) % bootLines.length;
  }, 120);

  /* Sequence timing */
  setTimeout(() => {
    loading.classList.add("hidden");
    intro.classList.add("stage-2");
    flashHeadline("PERSONA.NEXT ONLINE");
  }, 5200);

  setTimeout(() => {
    flashHeadline("IDENTITY REWRITE COMPLETE");
  }, 7200);

  setTimeout(() => {
    intro.classList.add("v-roll");
    flashHeadline("ENTER");
    impactFlashSequence(flash);
    setTimeout(() => intro.classList.remove("v-roll"), 200);
  }, 8300);

  setTimeout(() => {
    intro.classList.remove("stage-2");
    intro.style.background = "#000";
    introInner.style.opacity = "0";
  }, 8900);

  setTimeout(() => {
    clearInterval(bootInterval);
    site.classList.add("revealed");
    intro.classList.add("fade-out");
    typeHello();
  }, 9300);

  intro.addEventListener("transitionend", e => {
    if (e.propertyName === "opacity" && intro.classList.contains("fade-out")) {
      intro.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  function flashHeadline(text) {
    headline.textContent = text;
    headline.classList.add("flash");
    setTimeout(() => headline.classList.remove("flash"), 160);
  }

  function typeHello() {
    let i = 0;
    function step() {
      if (i <= helloString.length) {
        helloTextEl.textContent = helloString.slice(0, i);
        i++;
        setTimeout(step, 90);
      }
    }
    step();
  }
}

/* ────────────────────────────────────────────────
   SOURCE PAGE LOGIC
   ──────────────────────────────────────────────── */
function initSourcePage() {
  const target = document.getElementById("type-body");
  const panel  = document.querySelector(".terminal-panel");
  if (!target || !panel) return;

  const text =
`repo: queitmo
domain: quietmo.dev

entrypoint: index.html
source view: source.html

This build contains:
- verbose boot log
- identity rewrite sequence
- flash-driven transition
- typewriter landing screen

Static, client-side only.
No frameworks. No tracking.`;

  let i = 0;
  const speed = 30;
  (function type() {
    if (i <= text.length) {
      target.textContent = text.slice(0, i++);
      setTimeout(type, speed);
    }
  })();

  panel.addEventListener("click", () => {
    window.location.href = "trueSource.html";
  });
}

/* ────────────────────────────────────────────────
   TRUE SOURCE PAGE LOGIC
   ──────────────────────────────────────────────── */
function initTrueSourcePage() {
  const flash   = document.getElementById("flash");
  const content = document.getElementById("content");
  const target  = document.getElementById("type-body");

  impactFlashSequence(flash);

  const text =
`Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Build: trueSource.html
Mode: inspection
Notes:
- Demonstration output
- Static file, no backend
- Mirrors quietmo.dev landing behavior`;

  setTimeout(() => {
    content.style.opacity = "1";
    content.style.filter = "blur(0)";
    content.style.pointerEvents = "auto";

    let i = 0;
    const speed = 30;
    (function type() {
      if (i <= text.length) {
        target.textContent = text.slice(0, i++);
        setTimeout(type, speed);
      }
    })();
  }, 700);
}