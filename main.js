document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  if (body.classList.contains("index-page")) {
    initIndexPage();
  }

  if (body.classList.contains("source-page")) {
    initSourcePage();
  }

  if (body.classList.contains("true-source-page")) {
    initTrueSourcePage();
  }
});

/* Shared impact flash sequence (index + trueSource) */
function impactFlashSequence(flashEl) {
  if (!flashEl) return;
  const hits = [0, 120, 260, 360, 520];
  hits.forEach((t) => {
    setTimeout(() => {
      flashEl.classList.add("pop");
      setTimeout(() => flashEl.classList.remove("pop"), 40);
    }, t);
  });
}

/* ────────────────────────────────────────────────
   INDEX PAGE LOGIC
   ──────────────────────────────────────────────── */
function initIndexPage() {
  const intro      = document.getElementById("intro");
  const introInner = document.querySelector(".intro-inner");
  const site       = document.getElementById("site");
  const headline   = document.getElementById("headline");
  const loading    = document.getElementById("loading-block");
  const terminal   = document.getElementById("terminal");
  const flash      = document.getElementById("flash");
  const helloTextEl = document.getElementById("hello-text");

  if (!intro || !site || !headline || !loading || !terminal || !flash || !helloTextEl) {
    return;
  }

  const helloString = "Hello World!";

  const bootLines = [
    "[IN] Starting introspective sweep...",
    "[IN] Loading narrative stack...",
    "[SC] Scanning for active identities...",
    "[SC] Found: ego.default (uptime: long)",
    "[AN] Evaluating ego.default for inconsistencies...",
    "[WR] ego.default exhibits rigid pattern sets",
    "[SG] Sending SIGTERM to ego.default...",
    "[SG] No response. Escalating...",
    "[SG] Sending SIGKILL...",
    "[OK] ego.default terminated (signal 9)",
    "[GC] Detecting residual impulses...",
    "[GC] Flushing cached reactions...",
    "[GC] Clearing behavioral residues...",
    "[OK] Emotional subroutine cleanup complete",
    "[IM] Collecting stale self-images...",
    "[IM] Pruning recursive self-judgments...",
    "[OK] Outdated roles unmounted",
    "[EX] Detaching inherited expectations...",
    "[EX] Dropping validation dependencies...",
    "[OK] Validation subsystem offline",
    "[VO] Rewriting internal monologue schema...",
    "[VO] Installing observer-mode driver...",
    "[OK] Observer layer calibrated",
    "[DR] Removing abandoned ambitions...",
    "[DR] Unlinking obsolete desires...",
    "[OK] Motivational kernel cleaned",
    "[VA] Reorganizing narrative priorities...",
    "[VA] Sorting core values...",
    "[OK] Value alignment successful",
    "[PN] Initializing persona.next...",
    "[PN] Generating adaptive identity framework...",
    "[PN] Spawning behavior interfaces...",
    "[OK] persona.next seeded",
    "[RT] Mapping emotion → action channels...",
    "[RT] Installing honesty filter (ENABLED)...",
    "[RT] Removing performance mask...",
    "[OK] Expression routing updated",
    "[IO] Linking persona.next to output channel...",
    "[IO] Establishing direct expression pipeline...",
    "[OK] Output path stable",
    "[VR] Checking for leftover personas...",
    "[VR] No lingering identities detected",
    "[OK] Identity space clean",
    "[AU] Computing authenticity signature...",
    "[OK] Authenticity verified",
    "[AU] Projection layer disabled",
    "[CR] Warming cognitive cores...",
    "[CR] Activating intuitive processes...",
    "[CR] Booting improvisational engine...",
    "[OK] Cognitive systems synchronized",
    "[HL] Emotional stability within range",
    "[HL] Self-awareness resolution: high",
    "[OK] Baseline integrity confirmed",
    "[RD] persona.next online",
    "[RD] Operating without ego.default",
    "[DN] Boot sequence complete"
  ];

  let bootIndex = 0;
  function pushBootLine() {
    const line = document.createElement("div");
    line.textContent = bootLines[bootIndex];
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    bootIndex++;
    if (bootIndex >= bootLines.length) bootIndex = 0;
  }

  const bootInterval = setInterval(pushBootLine, 120);

  // Loading → Static CRT
  setTimeout(() => {
    loading.classList.add("hidden");
    intro.classList.add("stage-2");
    headline.textContent = "PERSONA.NEXT ONLINE";
    headline.classList.add("flash");
    setTimeout(() => headline.classList.remove("flash"), 160);
  }, 5200);

  // Identity rewrite
  setTimeout(() => {
    headline.textContent = "IDENTITY REWRITE COMPLETE";
    headline.classList.add("flash");
    setTimeout(() => headline.classList.remove("flash"), 160);
  }, 7200);

  // Final sequence: ENTER + flashes + roll
  setTimeout(() => {
    intro.classList.add("v-roll");
    headline.textContent = "ENTER";
    headline.classList.add("flash");
    setTimeout(() => headline.classList.remove("flash"), 200);
    impactFlashSequence(flash);
    setTimeout(() => intro.classList.remove("v-roll"), 200);
  }, 8300);

  // Cut to pure black
  setTimeout(() => {
    intro.classList.remove("stage-2");
    intro.style.background = "#000";
    introInner.style.opacity = "0";
  }, 8900);

  // Fade main site in, fade intro out
  setTimeout(() => {
    clearInterval(bootInterval);
    site.classList.add("revealed");
    intro.classList.add("fade-out");

    // Typewriter: Hello World!
    let i = 0;
    function typeHello() {
      if (i <= helloString.length) {
        helloTextEl.textContent = helloString.slice(0, i);
        i++;
        setTimeout(typeHello, 90);
      }
    }
    typeHello();
  }, 9300);

  intro.addEventListener("transitionend", (e) => {
    if (e.propertyName === "opacity" && intro.classList.contains("fade-out")) {
      intro.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

/* ────────────────────────────────────────────────
   SOURCE PAGE LOGIC (source.html)
   ──────────────────────────────────────────────── */
function initSourcePage() {
  const target = document.getElementById("type-body");
  const panel = document.querySelector(".terminal-panel");
  if (!target || !panel) return;

  const text =
`repo: queitmo
domain: quietmo.dev

entrypoint: index.html
source view: source.html

This build contains:
- intro overlay with verbose boot log
- persona.next identity rewrite sequence
- flash-driven transition into main scene
- typewriter "Hello World!" landing

Static, client-side only.
No frameworks. No tracking.
Just a clean surface and a booting self.`;

  let i = 0;
  const speed = 30; // ms per character

  function typeNext() {
    if (i <= text.length) {
      target.textContent = text.slice(0, i);
      i++;
      setTimeout(typeNext, speed);
    }
  }

  typeNext();

  // Click/touch on terminal -> trueSource.html
  panel.addEventListener("click", function () {
    window.location.href = "trueSource.html";
  });
}

/* ────────────────────────────────────────────────
   TRUE SOURCE PAGE LOGIC (trueSource.html)
   ──────────────────────────────────────────────── */
function initTrueSourcePage() {
  const flash   = document.getElementById("flash");
  const content = document.getElementById("content");
  const target  = document.getElementById("type-body");

  if (!flash || !content || !target) return;

  const text =
`Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Build: trueSource.html
Mode: inspection
Notes:
- Simulated output for demonstration only.
- Static file, no real backend.
- Source of quietmo.dev landing behavior.`;

  // Run flashes immediately on load (same pattern as index)
  impactFlashSequence(flash);

  // Reveal terminal just after last flash hit
  const revealDelay = 700; // > 520 + 40
  setTimeout(() => {
    content.style.opacity = "1";
    content.style.filter = "blur(0)";
    content.style.pointerEvents = "auto";

    // Typewriter starts as content fades in
    let i = 0;
    const speed = 30;
    function typeNext() {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i++;
        setTimeout(typeNext, speed);
      }
    }
    typeNext();
  }, revealDelay);
}