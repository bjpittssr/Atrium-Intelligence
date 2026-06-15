const API_BASE = "/api/visiondeck/balancemi";
const CONTRACT_URL = "balancemi-payload-contract.json";
const MODE = "READ_ONLY_COCKPIT";
const messages = [
  "Small controlled wins compound into freedom.",
  "Clarity first. Pressure second. Action with proof.",
  "Preventative maintenance beats failure.",
  "Protect health. Protect family. Build the system.",
  "No guesses. Receipts or hold."
];
const state = { contract: null, last: null };
function $(id){ return document.getElementById(id); }
function setProof(label, payload){ state.last = { t: new Date().toISOString(), label, payload }; $("proofBox").textContent = JSON.stringify(state.last, null, 2); }
function term(line){ const box = $("terminalLog"); box.textContent += `> ${line}
`; box.scrollTop = box.scrollHeight; }
function tick(){ const now = new Date(); $("dateText").textContent = now.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"2-digit",year:"numeric"}); $("clockText").textContent = now.toLocaleTimeString(); }
function rotateMessage(){ const i = Math.floor(Date.now()/15000)%messages.length; $("inspireText").textContent = messages[i]; $("feedMessage").textContent = messages[i]; }
async function jfetch(url, options={}){ const res = await fetch(url, { cache:"no-store", ...options }); const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = { raw:text }; } if(!res.ok){ throw new Error(`${res.status} ${JSON.stringify(data).slice(0,220)}`); } return data; }
function payload(){ const tags = ($("taskTags").value || "").split(",").map(v=>v.trim()).filter(Boolean); const domain = $("domainOverride").value || null; return { title: $("taskTitle").value.trim(), notes: $("taskNotes").value.trim(), deadline: $("dueDate").value || null, est_hours: Number($("estHours").value || 0.5), base_urgency: Number($("baseUrgency").value || 0.5), domain, tags, source: "VISIONDECK_UI" }; }
function contractFindAction(words){ const hits=[]; function walk(x,path=[]){ if(!x) return; if(typeof x === "string"){ const low=x.toLowerCase(); if(words.every(w=>low.includes(w))) hits.push(x); } else if(Array.isArray(x)) x.forEach((v,i)=>walk(v,path.concat(i))); else if(typeof x === "object") Object.entries(x).forEach(([k,v])=>walk(v,path.concat(k))); } walk(state.contract); return hits[0] || null; }
async function loadContract(){ try{ state.contract = await jfetch(CONTRACT_URL); term("payload contract loaded"); } catch(e){ term("payload contract unavailable: " + e.message); state.contract = {}; } }
function domainsFromEnvelope(data){ const d = data?.data?.domains || data?.domains || data?.data?.domain_names || data?.domain_names || []; return Array.isArray(d) ? d : []; }
async function refreshToday(){ try{ const data = await jfetch(`${API_BASE}/domains`); const domains = domainsFromEnvelope(data); $("domainChips").innerHTML = domains.slice(0,14).map(d=>`<span class="chip">${String(d)}</span>`).join(""); $("balanceSummary").textContent = domains.length ? `${domains.length} active domains loaded. Classifier registry visible.` : "Endpoint returned no domain list."; $("balanceScore").textContent = domains.length ? domains.length : "--"; setProof("domains_loaded", { endpoint:`${API_BASE}/domains`, domains }); term("overview refreshed"); } catch(e){ setProof("domains_error", { error:e.message }); term("domains error: "+e.message); } }
async function categorize(){ const body = payload(); try{ const data = await jfetch(`${API_BASE}/categorize`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title:body.title, notes:body.notes, source:body.source})}); setProof("categorize", data); const c = data?.data || data; if(c.primary_domain) $("todayFocus").textContent = c.primary_domain; term(`categorized ${body.title || "task"}`); } catch(e){ setProof("categorize_error", {error:e.message, body}); term("categorize error: "+e.message); } }
async function submitTask(){ const body = payload(); try{ const data = await jfetch(`${API_BASE}/intake/manual`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)}); setProof("manual_intake", data); term("manual intake accepted"); } catch(e){ setProof("manual_intake_error", {error:e.message, body}); term("manual intake error: "+e.message); } }
async function previewBrief(){ const hit = contractFindAction(["preview"]); const endpoint = hit && hit.startsWith("/") ? hit : null; if(!endpoint){ setProof("preview_brief", {result:"HOLD", reason:"no preview endpoint discovered in payload contract"}); term("preview brief held: no discovered endpoint"); return; } try{ const data = await jfetch(endpoint, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({available_hours:4,max_items:6,mode:"today"})}); setProof("preview_brief", data); term("brief preview complete"); } catch(e){ setProof("preview_brief_error", {endpoint,error:e.message}); term("brief preview error: "+e.message); } }
async function stageBrief(){ const hit = contractFindAction(["stage"]); const endpoint = hit && hit.startsWith("/") ? hit : null; if(!endpoint){ setProof("stage_brief", {result:"HOLD", reason:"no stage endpoint discovered in payload contract"}); term("stage brief held: no discovered endpoint"); return; } try{ const data = await jfetch(endpoint, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({})}); setProof("stage_brief", data); term("stage brief complete"); } catch(e){ setProof("stage_brief_error", {endpoint,error:e.message}); term("stage brief error: "+e.message); } }
async function refreshRelay(){ const hit = contractFindAction(["relay"]); const endpoint = hit && hit.startsWith("/") ? hit : null; if(!endpoint){ setProof("refresh_relay", {result:"HOLD", reason:"no relay endpoint discovered in payload contract"}); term("relay held: no discovered endpoint"); return; } try{ const data = await jfetch(endpoint); setProof("refresh_relay", data); term("relay refreshed"); } catch(e){ setProof("refresh_relay_error", {endpoint,error:e.message}); term("relay error: "+e.message); } }
function clearForm(){ $("taskTitle").value=""; $("taskNotes").value=""; $("taskTags").value=""; $("domainOverride").value=""; setProof("clear", {result:"PASS"}); }
function bind(){ document.querySelectorAll(".dock-tab").forEach(b=>b.addEventListener("click",()=>{ document.querySelectorAll(".dock-tab").forEach(x=>x.classList.remove("active")); b.classList.add("active"); const panel=b.dataset.panel; const target=document.querySelector(`[data-section="${panel}"]`); if(target) target.scrollIntoView({behavior:"smooth",block:"start"}); })); $("refreshTodayBtn").addEventListener("click", refreshToday); $("categorizeBtn").addEventListener("click", categorize); $("submitTaskBtn").addEventListener("click", submitTask); $("clearBtn").addEventListener("click", clearForm); $("previewBriefBtn").addEventListener("click", previewBrief); $("stageBriefBtn").addEventListener("click", stageBrief); $("refreshRelayBtn").addEventListener("click", refreshRelay); $("copyProofBtn").addEventListener("click",()=>navigator.clipboard?.writeText($("proofBox").textContent)); }
async function boot(){ bind(); tick(); rotateMessage(); setInterval(tick,1000); setInterval(rotateMessage,5000); term("VISIONDECK READ_ONLY_COCKPIT"); term("command execution denied for release"); term("autocomplete visual mode only"); term("endpoint discovery: /api/visiondeck/balancemi"); await loadContract(); await refreshToday(); }
boot();


/* === VISIONDECK_SAFE_CHIP_NORMALIZER_R1C_START === */
(function VisionDeckSafeChipNormalizerR1C(){
  "use strict";

  /*
    SAFETY LAW:
    - Never rewrite DIV/body/section/panel/container textContent.
    - Only touch leaf-level chip/button nodes.
    - Only replace exact "[object Object]" leaks or known explicit domain labels.
    - Never run command execution. READ_ONLY_COCKPIT remains unchanged.
  */

  const READ_ONLY_COCKPIT = true;

  const chips = [
    ["MEDICATION_HEALTH", "Health", "♡"],
    ["FAMILY", "Family", "♨"],
    ["CAREER_DEV", "Work", "▣"],
    ["SPOUSE", "Spouse", "♙"],
    ["FINANCE", "Finance", "$"],
    ["SCHEDULE", "Schedule", "▦"],
    ["GOD", "God", "✝"],
    ["CAREER", "Career", "☆"],
    ["MAINTENANCE", "Home", "⌂"],
    ["LEGAL", "Legal", "⚖"],
    ["VYBZ", "VYBZ", "♫"],
    ["PET_CARE", "Pets", "🐾"],
    ["PERSONAL_CARE", "Care", "♡"],
    ["HEOS", "HEOS", "⌁"],
    ["BUSINESS", "Business", "◆"]
  ];

  function textOf(el){
    return (el && el.textContent ? el.textContent : "").trim();
  }

  function isSafeLeaf(el){
    if (!el || el.nodeType !== 1) return false;
    if (!["BUTTON", "SPAN", "A"].includes(el.tagName)) return false;
    if (el.children && el.children.length > 2) return false;
    const txt = textOf(el);
    if (!txt || txt.length > 48) return false;
    return true;
  }

  function findDomainByText(txt){
    const compact = txt.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    return chips.find(([key, label]) => compact === key || compact === label.toUpperCase() || compact.includes(key));
  }

  function normalize(){
    let objectLeakIndex = 0;

    document.querySelectorAll("button, span, a").forEach((el) => {
      if (!isSafeLeaf(el)) return;

      const txt = textOf(el);
      const cls = (el.className || "").toString().toLowerCase();
      const explicitChip = cls.includes("domain") || cls.includes("chip") || cls.includes("tag") || el.dataset.domainLabel || el.dataset.vdDomainChip;

      let item = null;
      if (/^\[object\s+object\]$/i.test(txt)) {
        item = chips[objectLeakIndex % chips.length];
        objectLeakIndex += 1;
      } else if (explicitChip) {
        item = findDomainByText(txt);
      }

      if (!item) return;

      const [, label, icon] = item;
      el.classList.add("domain-chip");
      el.dataset.vdDomainChip = "true";
      el.dataset.domainLabel = label;
      el.setAttribute("aria-label", "BalanceMi domain: " + label);
      el.textContent = icon + " " + label;
    });

    document.documentElement.dataset.visiondeckMode = READ_ONLY_COCKPIT ? "READ_ONLY_COCKPIT" : "UNKNOWN";
    document.documentElement.dataset.visiondeckDomHotfix = "PROD_H_R3B_R1C";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalize, { once: true });
  } else {
    normalize();
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      normalize();
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
/* === VISIONDECK_SAFE_CHIP_NORMALIZER_R1C_END === */


/* === VISIONDECK_DOCK_DRILLDOWN_R1G_START === */
(function VisionDeckDockDrilldownR1G(){
  "use strict";

  const PANEL_HINTS = {
    week: ["Calendar / Activity Description", "Minimal calendar load view", "Office governors"],
    intake: ["Manual Entries / Corrections", "Task Title", "Submit Task"],
    calendar: ["Calendar / Activity Description", "Minimal calendar load view", "MON"],
    terminal: ["Command Terminal", "CRT read-only cockpit", "READ_ONLY_COCKPIT"],
    proof: ["Proof Drawer", "Last action", "domains_loaded"],
    meridian: ["Meridian Learning API", "Learning platform placeholder"],
    oha: ["OHA", "OpenSky HALO Academy", "Model integration placeholder"]
  };

  const PANEL_COPY = {
    today: {
      title: "Today Command",
      sub: "Main BalanceMi surface remains primary. Use the dock for drilldown detail.",
      cards: [
        ["Main screen", "BalanceMi overview, balance score, and immediate priority windows stay visible."],
        ["Dock behavior", "Open a tile to focus supporting data. Main surface blurs so the selected lane owns attention."]
      ]
    },
    week: {
      title: "Week Load",
      sub: "Weekly pressure, office governors, and capacity windows.",
      cards: [
        ["Purpose", "Inspect weekly load without letting the detail panel consume the main surface."],
        ["Signal", "Office days and protected recovery windows should stay obvious."]
      ]
    },
    intake: {
      title: "Manual Entries / Corrections",
      sub: "Operator entry lane. Same endpoint policy remains intact.",
      cards: [
        ["Action", "Create or correct a BalanceMi item through the existing manual intake pathway."],
        ["Guard", "No new endpoints. No route mutation. No terminal command execution."]
      ]
    },
    calendar: {
      title: "Calendar Blocks",
      sub: "Calendar/activity description and block-level context.",
      cards: [
        ["View", "Review day blocks and scheduling pressure."],
        ["Rule", "Calendar detail belongs in the drilldown drawer when not part of the immediate command picture."]
      ]
    },
    terminal: {
      title: "Command Terminal",
      sub: "CRT read-only cockpit. Visual command memory only.",
      cards: [
        ["Mode", "READ_ONLY_COCKPIT"],
        ["Boundary", "No command execution from the browser surface."]
      ]
    },
    proof: {
      title: "Proof Drawer",
      sub: "Audit receipts, payload traces, and last-action evidence.",
      cards: [
        ["Purpose", "Proof lives in the drawer so the main cockpit stays clean."],
        ["Rule", "Receipts over vibes. Evidence over guesses."]
      ]
    },
    meridian: {
      title: "Meridian Learning API",
      sub: "Learning platform placeholder for post-release integration.",
      cards: [
        ["Future lane", "Meridian attaches after GitHub release path is clean."],
        ["Boundary", "Placeholder only. No fake calls."]
      ]
    },
    oha: {
      title: "OHA — OpenSky HALO Academy",
      sub: "Model academy integration placeholder.",
      cards: [
        ["Future lane", "OHA attaches after the public release surface is stable."],
        ["Boundary", "No model routing from this UI candidate."]
      ]
    }
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function elementHasHints(el, hints) {
    const hay = normalizeText(el && el.innerText);
    return hints.some((hint) => hay.includes(normalizeText(hint)));
  }

  function findPanelForKey(key) {
    const hints = PANEL_HINTS[key] || [];
    if (!hints.length) return null;

    const candidates = Array.from(document.querySelectorAll(
      ".panel, .split-row, .placeholder-grid, .operator-feed, section, article"
    ));

    let best = null;
    let bestScore = 0;

    for (const el of candidates) {
      if (el.closest(".dock-drawer")) continue;
      const text = normalizeText(el.innerText);
      let score = 0;
      for (const hint of hints) {
        if (text.includes(normalizeText(hint))) score += 1;
      }
      if (score > bestScore) {
        best = el;
        bestScore = score;
      }
    }

    return bestScore > 0 ? best : null;
  }

  function createDrawer() {
    let drawer = document.querySelector(".dock-drawer");
    if (drawer) return drawer;

    drawer = document.createElement("aside");
    drawer.className = "dock-drawer";
    drawer.setAttribute("aria-label", "VisionDeck dock drilldown");
    drawer.setAttribute("data-open", "false");

    const header = document.createElement("div");
    header.className = "dock-drawer__header";

    const titleWrap = document.createElement("div");

    const kicker = document.createElement("span");
    kicker.className = "dock-drawer__kicker";
    kicker.textContent = "DOCK DRILLDOWN";

    const title = document.createElement("h2");
    title.className = "dock-drawer__title";
    title.textContent = "VisionDeck Detail";

    const sub = document.createElement("div");
    sub.className = "dock-drawer__sub";
    sub.textContent = "Selected lane focus view.";

    titleWrap.append(kicker, title, sub);

    const close = document.createElement("button");
    close.className = "dock-drawer__close";
    close.type = "button";
    close.textContent = "Close";
    close.addEventListener("click", closeDrawer);

    header.append(titleWrap, close);

    const body = document.createElement("div");
    body.className = "dock-drawer__body";

    drawer.append(header, body);
    document.body.appendChild(drawer);
    return drawer;
  }

  function renderFallback(body, key) {
    const copy = PANEL_COPY[key] || PANEL_COPY.today;
    const wrap = document.createElement("div");
    wrap.className = "vd-drilldown-home";

    for (const [title, text] of copy.cards) {
      const card = document.createElement("div");
      card.className = "vd-drilldown-card";
      const strong = document.createElement("strong");
      strong.textContent = title;
      const p = document.createElement("p");
      p.textContent = text;
      card.append(strong, p);
      wrap.appendChild(card);
    }

    body.appendChild(wrap);
  }

  function setDrawerText(drawer, key) {
    const copy = PANEL_COPY[key] || PANEL_COPY.today;
    const title = drawer.querySelector(".dock-drawer__title");
    const sub = drawer.querySelector(".dock-drawer__sub");
    if (title) title.textContent = copy.title;
    if (sub) sub.textContent = copy.sub;
  }

  function setActiveDock(key) {
    const tabs = Array.from(document.querySelectorAll(".dock-tab"));
    for (const tab of tabs) {
      const isActive = tab.getAttribute("data-panel") === key;
      tab.dataset.drawerActive = isActive ? "true" : "false";
      if (isActive) tab.classList.add("active");
      else tab.classList.remove("active");
    }
  }

  function closeDrawer() {
    const drawer = document.querySelector(".dock-drawer");
    if (drawer) drawer.setAttribute("data-open", "false");
    document.body.classList.remove("vd-drawer-open");
    for (const tab of document.querySelectorAll(".dock-tab")) {
      tab.dataset.drawerActive = "false";
    }
    const today = document.querySelector('.dock-tab[data-panel="today"]');
    if (today) today.classList.add("active");
  }

  function openDrawer(key) {
    if (key === "today") {
      closeDrawer();
      return;
    }

    const drawer = createDrawer();
    const body = drawer.querySelector(".dock-drawer__body");
    if (!body) return;

    setDrawerText(drawer, key);
    body.replaceChildren();

    const panel = findPanelForKey(key);
    if (panel) {
      const clone = panel.cloneNode(true);
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      clone.querySelectorAll("button, input, textarea, select").forEach((el) => {
        if (key !== "intake") {
          el.setAttribute("disabled", "true");
          el.setAttribute("aria-disabled", "true");
        }
      });
      body.appendChild(clone);
    } else {
      renderFallback(body, key);
    }

    drawer.setAttribute("data-open", "true");
    document.body.classList.add("vd-drawer-open");
    setActiveDock(key);
  }

  function bindDock() {
    createDrawer();

    const tabs = Array.from(document.querySelectorAll(".dock-tab"));
    tabs.forEach((tab) => {
      const key = tab.getAttribute("data-panel") || "today";
      if (tab.dataset.vdDrawerBound === "true") return;
      tab.dataset.vdDrawerBound = "true";
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        openDrawer(key);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer();
    });
  }

  ready(bindDock);
})();
/* === VISIONDECK_DOCK_DRILLDOWN_R1G_END === */


/* === VISIONDECK_VISUAL_CORRECTION_R1H_START === */
(function VisionDeckVisualCorrectionR1H(){
  "use strict";

  const LOCAL_QUOTES = [
    "Clarity first. Pressure second. Action with proof.",
    "Small controlled wins compound into freedom.",
    "No guesses. Receipts or hold.",
    "Preventative maintenance beats failure.",
    "Protect health. Protect family. Build the system.",
    "The cockpit stays clean when the drilldown has a home.",
    "Precision is kindness to your future self.",
    "The right interface lowers the tax on discipline.",
    "Ship the proof, then polish the myth.",
    "A calm system creates decisive motion."
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function dayIndex() {
    const now = new Date();
    const seed = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
    return Math.abs(Math.floor(seed)) % LOCAL_QUOTES.length;
  }

  function setText(el, value) {
    if (el && el.textContent !== value) el.textContent = value;
  }

  function applyQuoteOfDay() {
    const quote = LOCAL_QUOTES[dayIndex()];
    document.querySelectorAll(".inspire-card .micro").forEach((el) => setText(el, "QUOTE OF THE DAY"));
    const inspire = document.getElementById("inspireText");
    if (inspire) setText(inspire, quote);
  }

  function removeRedundantMastheadSubline() {
    document.querySelectorAll(".brand-subline").forEach((el) => {
      el.setAttribute("aria-hidden", "true");
      el.replaceChildren();
    });
  }

  function removeHeroPhrase() {
    document.querySelectorAll(".hero-panel .panel-head h1, .panel-head h1").forEach((el) => {
      if ((el.textContent || "").trim() === "Today / End of Week / Within 2 Weeks") {
        el.classList.add("visually-hidden");
        setText(el, "BalanceMi Overview");
      }
    });
  }

  function markDockReservoirPanels() {
    document.querySelectorAll(".vd-main > .split-row, .vd-main > .placeholder-grid, .vd-main > .operator-feed").forEach((el) => {
      el.setAttribute("data-dock-reservoir", "true");
      el.setAttribute("aria-hidden", "true");
    });
  }

  function applyAll() {
    applyQuoteOfDay();
    removeRedundantMastheadSubline();
    removeHeroPhrase();
    markDockReservoirPanels();
  }

  ready(() => {
    applyAll();
    window.setInterval(applyQuoteOfDay, 4000);
  });
})();
/* === VISIONDECK_VISUAL_CORRECTION_R1H_END === */


/* === VISIONDECK_FINAL_TRIM_R1M_START === */
(() => {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const quotes = [
    "A calm system makes better decisions.",
    "Clarity first. Pressure second. Action with proof.",
    "Protect the core. Ship the clean edge.",
    "Small controlled wins compound into freedom.",
    "No guesses. Receipts or hold.",
    "Build what reduces drag tomorrow.",
    "Strong systems make soft days survivable.",
    "The dashboard should reveal, not shout.",
    "Precision is kindness to your future self.",
    "Maintenance beats failure."
  ];

  const localDayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
    return Math.floor(diff / 86400000);
  };

  const setText = (el, value) => {
    if (!el) return;
    el.replaceChildren(document.createTextNode(value));
  };

  const findManualPanel = () => {
    const candidates = Array.from(document.querySelectorAll("section, .panel, article"));
    return candidates.find((el) => {
      const head = el.querySelector("h1, h2, h3, .panel-title");
      const raw = head ? (head.textContent || "") : "";
      return /Manual\s+Entries\s*\/\s*Corrections/i.test(raw);
    });
  };

  const ensureDrawer = (nav) => {
    let drawer = document.getElementById("vdDockDrawer");
    if (drawer) return drawer;

    drawer = document.createElement("aside");
    drawer.id = "vdDockDrawer";
    drawer.className = "vd-dock-drawer";
    drawer.setAttribute("aria-label", "VisionDeck dock drilldown");
    drawer.setAttribute("aria-hidden", "true");

    const head = document.createElement("div");
    head.className = "vd-drawer-head";

    const titleWrap = document.createElement("div");
    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    setText(eyebrow, "INTAKE DRILLDOWN");

    const h2 = document.createElement("h2");
    setText(h2, "Manual Entries / Corrections");

    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(h2);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "vd-drawer-close";
    close.setAttribute("aria-label", "Close intake drawer");
    setText(close, "CLOSE");

    const body = document.createElement("div");
    body.className = "vd-drawer-body";

    head.appendChild(titleWrap);
    head.appendChild(close);
    drawer.appendChild(head);
    drawer.appendChild(body);

    nav.insertAdjacentElement("afterend", drawer);
    close.addEventListener("click", () => closeDrawer(drawer));

    return drawer;
  };

  const openDrawer = (drawer) => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("dock-focus-open");
  };

  const closeDrawer = (drawer) => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("dock-focus-open");
  };

  onReady(() => {
    const quoteLabel = document.querySelector(".inspire-card .micro");
    const quoteText = document.querySelector("#inspireText, .inspire-card strong");
    setText(quoteLabel, "QUOTE OF THE DAY");
    setText(quoteText, quotes[localDayIndex() % quotes.length]);

    const nav = document.querySelector(".left-dock");
    const intakeBtn = nav ? nav.querySelector('[data-panel="intake"]') : null;
    const manualPanel = findManualPanel();

    if (!nav || !intakeBtn || !manualPanel) return;

    const drawer = ensureDrawer(nav);
    const drawerBody = drawer.querySelector(".vd-drawer-body");

    if (drawerBody && !drawerBody.contains(manualPanel)) {
      manualPanel.classList.add("manual-entry-panel");
      drawerBody.appendChild(manualPanel);
      document.body.classList.add("vd-manual-docked");
    }

    intakeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openDrawer(drawer);
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer(drawer);
    });
  });
})();
/* === VISIONDECK_FINAL_TRIM_R1M_END === */

