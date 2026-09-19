/* ===================================================================
   RoshniOS — vanilla JS. No framework.
   =================================================================== */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- links ---------- */
  const LINKS = {
    github: "https://github.com/Roshni0109",
    linkedin: "https://www.linkedin.com/in/roshnimultani/",
    hf: "https://huggingface.co/spaces/Rosss01/ai-recruiter",
    email: "roshnimultani0103@gmail.com",
    resume: "assets/Roshni_Multani_Resume.pdf"
  };

  /* ===================================================================
     8-BIT SOUND (Web Audio API)
     =================================================================== */
  const Sound = (function () {
    let ctx = null;
    let muted = store.get("roshnios_muted", "0") === "1";
    function init() {
      if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
      if (ctx && ctx.state === "suspended") ctx.resume();
    }
    function blip(freq, dur, type, vol) {
      if (!ctx || muted) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.14, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    }
    return {
      init,
      isMuted: () => muted,
      toggle() { muted = !muted; store.set("roshnios_muted", muted ? "1" : "0"); if (!muted) { init(); blip(660, 0.05, "square"); } return muted; },
      open() { blip(320, 0.07, "square"); setTimeout(() => blip(560, 0.09, "square"), 55); },
      close() { blip(440, 0.06, "square"); setTimeout(() => blip(220, 0.09, "square"), 50); },
      click() { blip(720, 0.03, "square", 0.07); },
      error() { blip(150, 0.12, "sawtooth"); setTimeout(() => blip(110, 0.16, "sawtooth"), 100); },
      trash() { blip(300, 0.05, "square"); setTimeout(() => blip(200, 0.06, "square"), 45); setTimeout(() => blip(110, 0.12, "square"), 95); },
      think() { blip(500, 0.05, "triangle", 0.09); setTimeout(() => blip(720, 0.06, "triangle", 0.09), 70); },
      boot() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.16, "square", 0.12), i * 120)); }
    };
  })();

  /* ===================================================================
     PIXEL ART  (SVG rectangles)
     =================================================================== */
  const C = { I: "#2b2b3a", D: "#fdf6ff", T: "#63c5c0", TD: "#3f9e99", P: "#ff6b9d",
    Y: "#ffd23f", L: "#e4d8ff", G: "#7ed957", O: "#ffa64d", B: "#0a66c2" };

  function svg(rects, vb) {
    vb = vb || 16;
    const body = rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"/>`).join("");
    return `<svg viewBox="0 0 ${vb} ${vb}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  const ICONS = {
    readme: svg([[3,1,10,1,C.I],[3,14,10,1,C.I],[3,1,1,14,C.I],[12,1,1,14,C.I],[4,2,8,12,C.D],
      [5,4,6,1,C.I],[5,6,6,1,C.I],[5,8,6,1,C.I],[5,10,4,1,C.I]]),
    airecruiter: svg([[4,5,3,3,C.T],[3,8,5,4,C.T],[8,2,6,1,C.I],[8,8,6,1,C.I],[8,2,1,6,C.I],[13,2,1,6,C.I],
      [9,3,4,4,C.L],[13,8,2,2,C.I],[14,10,2,2,C.I]]),
    churn: svg([[2,2,1,12,C.I],[2,13,12,1,C.I],[4,4,2,2,C.P],[7,6,2,2,C.P],[10,9,2,2,C.P],[12,11,2,2,C.P],[12,9,2,1,C.P],[13,10,1,3,C.P]]),
    genai: svg([[2,3,12,7,C.T],[4,10,2,2,C.T],[4,5,8,1,C.D],[4,7,6,1,C.D],[12,1,1,3,C.Y],[11,2,3,1,C.Y]]),
    leadagent: svg([[4,1,2,2,C.P],[8,1,2,2,C.Y],[11,1,2,2,C.G],[2,4,12,2,C.I],[4,6,8,2,C.L],[6,8,4,2,C.L],[7,10,2,3,C.I],[7,13,2,2,C.T]]),
    resume: svg([[3,1,10,1,C.I],[3,10,10,1,C.I],[3,1,1,10,C.I],[12,1,1,10,C.I],[4,2,8,8,C.D],
      [5,3,6,1,C.I],[5,5,6,1,C.I],[5,7,4,1,C.I],[7,11,2,3,C.P],[5,13,6,1,C.P],[6,14,4,1,C.P]]),
    contact: svg([[2,4,12,1,C.I],[2,11,12,1,C.I],[2,4,1,8,C.I],[13,4,1,8,C.I],[3,5,10,6,C.D],
      [3,5,10,1,C.P],[4,6,8,1,C.P],[5,7,6,1,C.P],[6,8,4,1,C.P]]),
    skills: svg([[6,6,4,4,C.I],[7,3,2,2,C.I],[7,11,2,2,C.I],[3,7,2,2,C.I],[11,7,2,2,C.I],[7,7,2,2,C.D],[11,2,3,3,C.P]]),
    experience: svg([[6,3,4,2,C.I],[3,5,10,1,C.I],[3,12,10,1,C.I],[3,5,1,8,C.I],[12,5,1,8,C.I],[4,6,8,6,C.O],[7,8,2,2,C.I]]),
    github: svg([[4,3,8,7,C.I],[3,2,3,3,C.I],[10,2,3,3,C.I],[5,6,2,2,C.D],[9,6,2,2,C.D],[7,10,2,4,C.I],[5,12,2,2,C.I],[9,12,2,2,C.I]]),
    linkedin: svg([[2,2,12,12,C.B],[4,4,2,2,C.D],[4,7,2,5,C.D],[7,7,2,5,C.D],[9,7,3,5,C.D],[7,6,5,2,C.D]]),
    hf: svg([[3,3,10,10,C.Y],[1,8,2,3,C.Y],[13,8,2,3,C.Y],[5,6,2,2,C.I],[9,6,2,2,C.I],[5,9,6,1,C.I],[4,8,1,1,C.I],[11,8,1,1,C.I]])
  };

  /* ---- clouds ---- */
  const CLOUD = `<svg width="90" height="46" viewBox="0 0 45 23" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" opacity="0.82">
    <rect x="6" y="11" width="33" height="8"/><rect x="12" y="6" width="16" height="9"/><rect x="20" y="9" width="13" height="7"/><rect x="3" y="14" width="6" height="4"/></g></svg>`;

  /* ---- sparkles ---- */
  const STAR = `<svg width="14" height="14" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff">
    <rect x="3" y="0" width="1" height="7"/><rect x="0" y="3" width="7" height="1"/></g></svg>`;

  /* ---- pixel girl ---- */
  function character() {
    const HAIR = "#4a3120", SKIN = "#f3c9a3", SKINSH = "#e3b389", GL = "#20202e", LENS = "#bfe9ff",
      SW = "#63c5c0", SWSH = "#3f9e99", SK = "#3a3a56", SHOE = "#20202e", BOW = "#ff9ec7", CHK = "#f2a7a0";
    const r = [
      [8,4,16,20,HAIR],[6,8,2,12,HAIR],[24,8,2,12,HAIR],[10,2,12,2,HAIR],
      [11,8,10,12,SKIN],[11,18,10,2,SKINSH],
      [9,6,14,3,HAIR],[9,9,2,8,HAIR],[21,9,2,8,HAIR],
      [21,5,4,3,BOW],[22,4,2,1,BOW],
      [11,11,4,3,LENS],[17,11,4,3,LENS],
      [11,11,4,1,GL],[11,13,4,1,GL],[11,11,1,3,GL],[14,11,1,3,GL],
      [17,11,4,1,GL],[17,13,4,1,GL],[17,11,1,3,GL],[20,11,1,3,GL],[15,12,2,1,GL],
      [11,15,2,2,CHK],[19,15,2,2,CHK],[15,16,2,1,SKINSH],
      [14,20,4,2,SKINSH],
      [8,22,16,12,SW],[8,22,16,2,SWSH],[8,29,16,2,SWSH],
      [5,23,3,10,SW],[24,23,3,10,SW],[5,32,3,3,SKIN],[24,32,3,3,SKIN],
      [7,34,18,5,SK],[7,34,18,1,"#2b2b44"],
      [11,39,3,4,SKIN],[18,39,3,4,SKIN],
      [10,43,5,3,SHOE],[17,43,5,3,SHOE]
    ];
    const rectStr = r.map(x => `<rect x="${x[0]}" y="${x[1]}" width="${x[2]}" height="${x[3]}" fill="${x[4]}"/>`).join("");
    return `<svg viewBox="0 0 32 46" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rectStr}
      <g class="blink"><rect x="12" y="12" width="1.4" height="1.4" fill="${GL}"/><rect x="18" y="12" width="1.4" height="1.4" fill="${GL}"/></g></svg>`;
  }

  /* ===================================================================
     CONTENT
     =================================================================== */
  const btn = (label, href, opt) => {
    opt = opt || {};
    const cls = "btn" + (opt.primary ? " btn-primary" : "");
    const attr = opt.download ? ` download` : ` target="_blank" rel="noopener"`;
    if (opt.action) return `<button class="${cls}" data-act="${opt.action}">${label}</button>`;
    return `<a class="${cls}" href="${href}"${attr}>${label}</a>`;
  };

  const PROJECTS = [
    {
      id: "airecruiter", name: "AI Recruiter", icon: "airecruiter", live: true,
      title: "AI Recruiter — Candidate ↔ JD Matching",
      tags: ["LIVE", "ML", "Semantic Matching", "Streamlit", "HF Spaces", "Fairness"],
      html: `
        <h1>AI Recruiter</h1>
        <p class="muted">Candidate ↔ job-description matching · 2025 → live prototype</p>
        <p><strong>Overview.</strong> A recruiter-facing tool that ranks candidates against a job description by real fit — not keyword overlap — and shows its working.</p>
        <h2>the problem</h2>
        <p>First-pass screening is slow and inconsistent. Keyword filters miss strong candidates who phrase things differently, and reward résumé stuffing.</p>
        <h2>what I built</h2>
        <ul>
          <li>Text preprocessing + embedding-based semantic similarity between résumé and JD</li>
          <li>Configurable weighting across skills, experience and education so a recruiter can tune what matters for a role</li>
          <li>A per-candidate score breakdown instead of one opaque number</li>
          <li>Groundwork for a bias &amp; fairness layer — checking scores don't swing on proxies for gender or background</li>
        </ul>
        <h2>result</h2>
        <p>Shortens the path to a first shortlist and keeps the ranking explainable enough to defend in a hiring review. This is the public prototype of the candidate–JD matching system I'm now taking to production at MPOnline.</p>
        <div class="btnrow">${btn("▶ Try it live", LINKS.hf, { primary: true })}${btn("GitHub →", LINKS.github)}</div>`
    },
    {
      id: "churn", name: "Churn ANN", icon: "churn",
      title: "ANN-Based Customer Churn Prediction",
      tags: ["Deep Learning", "Keras / TF", "Classification", "Streamlit"],
      html: `
        <h1>Customer Churn<br/>Prediction (ANN)</h1>
        <p class="muted">Deep learning · classification · 2026</p>
        <p><strong>Overview.</strong> A churn model wrapped in something a retention team can actually use.</p>
        <h2>the problem</h2>
        <p>The business usually learns a customer churned <em>after</em> they've gone. By then the intervention options are worse and more expensive.</p>
        <h2>what I built</h2>
        <ul>
          <li>Full pipeline: data cleaning, missing-value handling, categorical encoding, feature scaling</li>
          <li>A dense artificial neural network for binary churn classification</li>
          <li>Evaluation on accuracy, precision, recall, F1 and ROC-AUC — not just accuracy, since the classes are imbalanced</li>
          <li>A Streamlit form: enter customer details, get a clear churn / not-churn call with a probability</li>
        </ul>
        <h2>result</h2>
        <p>Turns a model output into a decision — who to call this week — for a non-technical retention team.</p>
        <div class="btnrow">${btn("GitHub →", LINKS.github)}</div>`
    },
    {
      id: "genai", name: "GenAI Finance", icon: "genai",
      title: "GenAI Financial Chatbot",
      tags: ["LLM APIs", "Claude + GPT", "Flask", "Pandas", "Caching"],
      html: `
        <h1>GenAI Financial<br/>Chatbot</h1>
        <p class="muted">LLM-powered analytics platform · 2025</p>
        <p><strong>Overview.</strong> A conversational analytics layer over financial data, for people who don't read spreadsheets.</p>
        <h2>the problem</h2>
        <p>Every "what happened in Q3?" question goes through an analyst. Stakeholders wait; analysts context-switch all day.</p>
        <h2>what I built</h2>
        <ul>
          <li>Conversational system integrating LLM APIs (Claude, GPT) with structured financial datasets</li>
          <li>Pandas / NumPy preprocessing pipelines to hand the model clean, well-shaped context</li>
          <li>Prompt design + response caching for accurate and cost-effective output on repeated questions</li>
          <li>Plain-language summaries of complex tables — "revenue rose 8%, driven mostly by…"</li>
        </ul>
        <h2>stack</h2>
        <p>Python · Flask · LLM APIs</p>
        <h2>result</h2>
        <p>Self-serve answers for stakeholders, and a noticeably lower cost per query once caching absorbed the repeats.</p>
        <div class="btnrow">${btn("GitHub →", LINKS.github)}</div>`
    },
    {
      id: "leadagent", name: "Lead Agent", icon: "leadagent",
      title: "Lead Qualification Agent",
      tags: ["Python", "n8n", "REST APIs", "ETL", "Agentic"],
      html: `
        <h1>Lead Qualification<br/>Agent</h1>
        <p class="muted">Agentic automation &amp; ETL · 2026</p>
        <p><strong>Overview.</strong> An automated pipeline that captures, cleans, scores and routes inbound B2B leads.</p>
        <h2>the problem</h2>
        <p>Sales reps manually triage every inbound lead. High-value prospects sit in the same queue as spam, and follow-up is slow enough to lose deals.</p>
        <h2>what I built</h2>
        <ul>
          <li>ETL pipeline in Python + n8n: capture → cleanse → score → route</li>
          <li>Multiple REST API integrations for multi-source enrichment and aggregation</li>
          <li>Rule-based scoring on business and analytical signals to segment and prioritise</li>
          <li>Automatic routing so the best leads land in front of a human first</li>
        </ul>
        <h2>stack</h2>
        <p>Python · n8n · REST APIs</p>
        <h2>result</h2>
        <p>Cuts manual review effort and shortens time-to-first-touch for the leads that matter.</p>
        <div class="btnrow">${btn("GitHub →", LINKS.github)}</div>`
    }
  ];
  const P = id => PROJECTS.find(p => p.id === id);

  const STATIC_WINS = {
    readme: {
      title: "README.txt", icon: "readme", w: 460,
      html: `
        <h1>README.txt</h1>
        <p>Full-stack engineer with hands-on experience building production-grade AI systems and LLM-powered applications. I own features end-to-end across backend, frontend and the AI layer — pairing Python / JavaScript depth with product sense about where AI actually adds value.</p>
        <h2>whoami</h2>
        <p>Roshni Multani — based in Bhopal, MP, India. Currently a Software Development &amp; AI Intern at MPOnline Ltd, and an MCA student at LNCT. I taught myself to build the way most people learn to cook: by ruining a lot of dishes first.</p>
        <h2>what I care about</h2>
        <ul>
          <li><strong>Ship the rough v0.1.</strong> A prototype in the world beats a perfect one on paper.</li>
          <li><strong>Prompts are software.</strong> Versioned, tested, refactored — it pays back quickly.</li>
          <li><strong>Measure the boring things</strong>, then leave room for taste.</li>
        </ul>
        <h2>currently</h2>
        <p>Open to internships, freelance &amp; AI-product collaborations. Reply time is usually within a day — two if the chai runs out.</p>
        <div class="btnrow">${btn("Email", "mailto:" + LINKS.email)}${btn("LinkedIn →", LINKS.linkedin)}${btn("GitHub →", LINKS.github)}</div>`
    },
    experience: {
      title: "experience.log", icon: "experience", w: 470,
      html: `
        <h1>experience.log</h1>
        <ul class="timeline">
          <li><span class="yr">2026 — PRESENT</span><strong>MPOnline Ltd — Software Development &amp; AI Intern</strong><br/>Bhopal, MP, India<br/><br/>
            6-month software development + AI internship. Building full-stack features end-to-end with .NET, React and Next.js. Leading build of a live ML-based candidate–JD matching system: translating business requirements into a working pipeline (data preprocessing, feature engineering, model integration) and coordinating with cross-functional engineering teams to ship it into production.</li>
          <li><span class="yr">2024 — 2026</span><strong>Independent AI / ML project work</strong><br/><br/>
            The apps in "Selected Work" — built solo, from problem statement to working demo. NLP, deep learning, LLM apps and agentic automation.</li>
        </ul>`
    },
    skills: {
      title: "skills.cfg", icon: "skills", w: 470,
      html: `
        <h1>skills.cfg</h1>
        <h2>AI &amp; LLM engineering</h2>
        <p>LLM APIs &amp; integration (OpenAI GPT-4 / 3.5, Anthropic Claude) · LangChain (chains, agents, LCEL) · n8n automation · RAG pipelines · prompt engineering · agent frameworks · production safety &amp; reliability metrics</p>
        <h2>NLP concepts</h2>
        <p>Text preprocessing · tokenization · embeddings · semantic similarity · sentence transformers · transformer fine-tuning (DistilBERT / BERT) · intent classification</p>
        <h2>machine learning concepts</h2>
        <p>Regression · classification · artificial neural networks · feature engineering &amp; scaling · performance metrics (accuracy, precision, recall, F1, ROC-AUC)</p>
        <h2>full-stack</h2>
        <p>Python (Flask, FastAPI) · .NET · React · Next.js · JavaScript (ES6+) · TypeScript · REST API design · ETL pipelines</p>
        <h2>data &amp; databases</h2>
        <p>SQL · MySQL · MongoDB · data modeling · Pandas · NumPy</p>
        <h2>tools</h2>
        <p>Git / GitHub · VS Code · Firebase · cloud integrations</p>
        <hr class="divider"/>
        <h2>education</h2>
        <ul class="timeline">
          <li><span class="yr">2023 — 2025</span><strong>Master of Computer Applications (MCA)</strong><br/>LNCT, Bhopal</li>
          <li><span class="yr">MAR 2025 — APR 2026</span><strong>Credit-Linked Program in AI &amp; Machine Learning</strong><br/>IIT Guwahati (Daksh Gurukul)</li>
          <li><span class="yr">2020 — 2023</span><strong>Bachelor of Computer Applications (BCA)</strong><br/>LNCT University, Bhopal</li>
        </ul>
        <h2>certifications</h2>
        <ul>
          <li>Generative AI Mastermind — Outskill</li>
          <li>GenAI for Financial Analysis — BCG</li>
          <li>Cloud Computing — IBM</li>
        </ul>`
    },
    resume: {
      title: "Resume.pdf", icon: "resume", w: 420,
      html: `
        <h1>Résumé</h1>
        <p class="muted">Full-stack + AI engineer · Bhopal, MP, India</p>
        <div class="btnrow">${btn("Open PDF", LINKS.resume, { primary: true })}${btn("Download", LINKS.resume, { download: true })}</div>
        <h2>snapshot</h2>
        <ul>
          <li>Current — Software Development &amp; AI Intern, MPOnline Ltd</li>
          <li>MCA — LNCT, Bhopal (2023–25)</li>
          <li>AI &amp; ML program — IIT Guwahati / Daksh Gurukul (2025–26)</li>
          <li>4 shipped AI / ML projects · 1 live</li>
          <li>Certs — Outskill, BCG, IBM</li>
        </ul>`
    },
    contact: {
      title: "contact.card", icon: "contact", w: 400,
      html: `
        <h1>say hi</h1>
        <p><strong>${LINKS.email}</strong></p>
        <div class="btnrow">
          ${btn("Email", "mailto:" + LINKS.email, { primary: true })}
          ${btn("Copy email", null, { action: "copyEmail" })}
        </div>
        <div class="btnrow">
          ${btn("LinkedIn →", LINKS.linkedin)}
          ${btn("GitHub →", LINKS.github)}
          ${btn("Hugging Face →", LINKS.hf)}
        </div>
        <hr class="divider"/>
        <p class="muted">Based in Bhopal, MP, India · Asia / Kolkata · open to internships, freelance &amp; AI-product collaborations.</p>`
    },
    rejected: {
      title: "Rejected Concepts", icon: null, w: 460,
      html: `
        <h1>Rejected Concepts</h1>
        <p class="muted">Half-built ideas and abandoned taglines — mostly from an ongoing rabbit hole into AI safety &amp; reliability. None of this is on the résumé. That's the point.</p>
        <h2>parked experiments</h2>
        <ul>
          <li><strong>Refusal-rate dashboard</strong> — track how often a deployed assistant refuses, and why. Shelved until I have a cleaner taxonomy of "good refusal" vs "annoying over-refusal".</li>
          <li><strong>Prompt-injection canary</strong> — plant known injection strings in retrieved docs, alarm if the model obeys them. Prototype worked; needs a real eval set.</li>
          <li><strong>Confidence ≠ correctness</strong> — measuring the calibration gap on a fine-tuned text classifier. Paused: needs more labelled data.</li>
          <li><strong>Small-model honesty</strong> — does a 7B model admit "I don't know" as gracefully as a frontier model? Notes only, for now.</li>
        </ul>
        <h2>tagline graveyard</h2>
        <ul>
          <li>"AI that doesn't lie to your boss"</li>
          <li>"prompts with commitment issues"</li>
          <li>"ship first, align later (kidding)"</li>
        </ul>`
    },
    about: {
      title: "About RoshniOS", icon: null, w: 430,
      html: `
        <h1>About RoshniOS</h1>
        <p>A hand-built pixel-art desktop. No framework — just HTML, CSS and vanilla JavaScript. The sounds are synthesised live with the Web Audio API; every sprite is drawn from SVG rectangles.</p>
        <ul>
          <li>Type: Press Start 2P + VT323</li>
          <li>Draggable, stackable, resizable-ish windows</li>
          <li>Boot screen, custom cursor, 8-bit SFX</li>
          <li>There's an easter egg in the trash</li>
        </ul>
        <p class="muted">Case studies summarise real project work; a few figures are illustrative — ask Roshni for specifics.</p>`
    }
  };

  /* ===================================================================
     WINDOW MANAGER
     =================================================================== */
  const winMount = $("#windows");
  const openWins = new Map();
  let zTop = 100;

  function focusWin(w) { w.style.display = "flex"; w.style.zIndex = ++zTop; markDock(); }

  function closeWin(id) {
    const w = openWins.get(id);
    if (!w) return;
    w.remove(); openWins.delete(id); Sound.close(); markDock();
  }
  function closeAll() { [...openWins.keys()].forEach(closeWin); }

  function openWindow(id, cfg) {
    if (openWins.has(id)) { focusWin(openWins.get(id)); return; }
    const w = el("div", "win");
    w.dataset.id = id;
    w.style.width = (cfg.w || 440) + "px";
    const off = openWins.size * 26;
    w.style.left = Math.max(8, Math.min(120 + off, window.innerWidth - 280)) + "px";
    w.style.top = Math.max(36, Math.min(70 + off, window.innerHeight - 180)) + "px";
    w.innerHTML =
      `<div class="win-bar">
        <span class="win-lights">
          <button class="tl tl-close" aria-label="Close window">x</button>
          <button class="tl tl-min" aria-label="Minimize window">-</button>
          <button class="tl tl-max" aria-label="Maximize window">+</button>
        </span>
        ${cfg.icon && ICONS[cfg.icon] ? `<span class="win-ico">${ICONS[cfg.icon]}</span>` : ""}
        <span class="win-title">${cfg.title}</span>
      </div>
      <div class="win-body" tabindex="-1">${cfg.html}</div>`;
    winMount.appendChild(w);
    openWins.set(id, w);
    focusWin(w);
    Sound.open();

    w.querySelector(".tl-close").onclick = e => { e.stopPropagation(); closeWin(id); };
    w.querySelector(".tl-min").onclick = e => { e.stopPropagation(); w.style.display = "none"; Sound.close(); markDock(); };
    w.querySelector(".tl-max").onclick = e => { e.stopPropagation(); w.classList.toggle("max"); Sound.click(); };
    w.addEventListener("pointerdown", () => focusWin(w));
    w.querySelectorAll("[data-act]").forEach(b => b.onclick = () => runAction(b.dataset.act));
    w.querySelectorAll(".btn").forEach(b => b.addEventListener("click", () => Sound.click()));
    dragify(w, w.querySelector(".win-bar"));
    w.querySelector(".win-body").focus();
  }

  function openProject(p) {
    openWindow(p.id, { title: p.title.replace(/<br\/?>/g, " "), icon: p.icon, w: 460, html: p.html });
  }

  function runAction(a) {
    if (a === "copyEmail") {
      const done = () => { Sound.click(); toast("email copied ✓"); };
      if (navigator.clipboard) navigator.clipboard.writeText(LINKS.email).then(done, done);
      else done();
    }
  }

  /* ---- dragging ---- */
  function dragify(w, handle) {
    let sx, sy, ox, oy, dragging = false;
    handle.addEventListener("pointerdown", e => {
      if (e.target.closest(".tl")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = w.getBoundingClientRect();
      ox = r.left; oy = r.top;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", e => {
      if (!dragging) return;
      let nx = ox + (e.clientX - sx);
      let ny = oy + (e.clientY - sy);
      nx = Math.max(-w.offsetWidth + 80, Math.min(nx, window.innerWidth - 80));
      ny = Math.max(30, Math.min(ny, window.innerHeight - 44));
      w.style.left = nx + "px"; w.style.top = ny + "px";
    });
    handle.addEventListener("pointerup", e => { dragging = false; try { handle.releasePointerCapture(e.pointerId); } catch (x) {} });
  }

  /* ---- toast ---- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = el("div");
      toastEl.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2000;background:#2b2b3a;color:#fdf6ff;font-family:'Press Start 2P',monospace;font-size:8px;padding:10px 14px;border:2px solid #fff;box-shadow:4px 4px 0 rgba(0,0,0,.3)";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => (toastEl.style.display = "none"), 1600);
  }

  /* ===================================================================
     DESKTOP: icons, dock, sky, character
     =================================================================== */
  const DESKTOP_ICONS = [
    { key: "readme", label: "README.txt", open: () => openWindow("readme", STATIC_WINS.readme) },
    ...PROJECTS.map(p => ({ key: p.icon, label: p.name, live: !!p.live, open: () => openProject(p) })),
    { key: "experience", label: "experience", open: () => openWindow("experience", STATIC_WINS.experience) },
    { key: "skills", label: "skills.cfg", open: () => openWindow("skills", STATIC_WINS.skills) },
    { key: "resume", label: "Resume.pdf", open: () => openWindow("resume", STATIC_WINS.resume) },
    { key: "contact", label: "contact", open: () => openWindow("contact", STATIC_WINS.contact) }
  ];

  function buildIcons() {
    const box = $("#icons");
    DESKTOP_ICONS.forEach(it => {
      const b = el("button", "icon" + (it.live ? " live" : ""));
      b.innerHTML = `<span class="icon-art">${ICONS[it.key]}</span><span class="icon-label">${it.label}${it.live ? '<em class="live-dot">live</em>' : ""}</span>`;
      b.addEventListener("click", () => {
        $$(".icon").forEach(i => i.classList.remove("sel"));
        b.classList.add("sel");
        Sound.click();
        it.open();
      });
      box.appendChild(b);
    });
  }
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const DOCK = [
    { key: "readme", act: () => openWindow("readme", STATIC_WINS.readme), win: "readme" },
    { key: "airecruiter", act: () => openProject(P("airecruiter")), win: "airecruiter" },
    { key: "genai", act: () => openProject(P("genai")), win: "genai" },
    { sep: true },
    { key: "github", act: () => openExt(LINKS.github) },
    { key: "linkedin", act: () => openExt(LINKS.linkedin) },
    { key: "hf", act: () => openExt(LINKS.hf) },
    { sep: true },
    { key: "resume", act: () => openWindow("resume", STATIC_WINS.resume), win: "resume" }
  ];
  function openExt(u) { Sound.click(); window.open(u, "_blank", "noopener"); }

  function buildDock() {
    const d = $("#dock");
    DOCK.forEach(it => {
      if (it.sep) { const s = el("span", "dock-sep"); d.appendChild(s); return; }
      const b = el("button", "dock-item");
      b.innerHTML = ICONS[it.key];
      b.title = it.key;
      if (it.win) b.dataset.win = it.win;
      b.addEventListener("click", it.act);
      d.appendChild(b);
    });
  }
  function markDock() {
    $$(".dock-item[data-win]").forEach(b => {
      const w = openWins.get(b.dataset.win);
      b.dataset.open = w && w.style.display !== "none" ? "1" : "";
    });
  }

  function buildSky() {
    const sky = $("#sky");
    const n = window.matchMedia("(max-width:720px)").matches ? 3 : 5;
    for (let i = 0; i < n; i++) {
      const c = el("div", "cloud");
      c.innerHTML = CLOUD;
      const scale = 0.55 + Math.random() * 0.9;
      c.style.top = (5 + Math.random() * 46) + "%";
      c.style.transform = `scale(${scale})`;
      const dur = 42 + Math.random() * 46;
      c.style.animationDuration = dur + "s";
      c.style.animationDelay = -(Math.random() * dur) + "s";
      c.style.opacity = 0.5 + Math.random() * 0.4;
      sky.appendChild(c);
    }
    const sn = window.matchMedia("(max-width:720px)").matches ? 3 : 6;
    for (let i = 0; i < sn; i++) {
      const s = el("div", "star");
      s.innerHTML = STAR;
      s.style.left = (8 + Math.random() * 60) + "%";
      s.style.top = (8 + Math.random() * 55) + "%";
      s.style.animationDuration = (2 + Math.random() * 2.2) + "s";
      s.style.animationDelay = -(Math.random() * 3) + "s";
      sky.appendChild(s);
    }
  }

  /* ===================================================================
     MENU BAR
     =================================================================== */
  function fmtClock() {
    try {
      const now = new Date();
      const t = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
      $("#clock").textContent = t;
    } catch (e) { $("#clock").textContent = new Date().toTimeString().slice(0, 5); }
  }

  const dropdown = $("#dropdown");
  function menuData() {
    return {
      rosh: [
        ["About This Portfolio", () => openWindow("about", STATIC_WINS.about)],
        "-",
        [Sound.isMuted() ? "Sound: OFF — turn on" : "Sound: ON — mute", () => { setSound(Sound.toggle()); }],
        ["Shut Down / Reboot", () => location.reload()]
      ],
      file: [
        ["Open Résumé (PDF)", () => window.open(LINKS.resume, "_blank")],
        ["Email Roshni", () => (location.href = "mailto:" + LINKS.email)],
        ["Copy Email", () => runAction("copyEmail")]
      ],
      view: [
        ["Next Wallpaper", nextWall],
        ["Clean Up Icons", () => { Sound.click(); toast("tidy ✓"); }],
        "-",
        ["Close All Windows", closeAll]
      ],
      help: [
        ["How this works", () => openWindow("about", STATIC_WINS.about)],
        ["Esc = close focused window", () => toast("try it")],
        "-",
        ["Built by hand · no framework", () => openExt(LINKS.github)]
      ]
    };
  }

  function openMenu(item) {
    const key = item.dataset.menu;
    const data = menuData()[key];
    if (!data) return;
    dropdown.innerHTML = "";
    data.forEach(row => {
      if (row === "-") { dropdown.appendChild(el("hr")); return; }
      const b = el("button");
      b.textContent = row[0];
      b.onclick = () => { closeMenu(); Sound.click(); row[1](); };
      dropdown.appendChild(b);
    });
    dropdown.style.left = item.offsetLeft + "px";
    dropdown.hidden = false;
    $$(".menu-item").forEach(m => m.classList.toggle("open", m === item));
  }
  function closeMenu() {
    dropdown.hidden = true;
    $$(".menu-item").forEach(m => m.classList.remove("open"));
  }
  $$(".menu-item").forEach(m => {
    m.addEventListener("click", e => {
      e.stopPropagation();
      if (m.classList.contains("open")) closeMenu();
      else openMenu(m);
    });
  });
  $("#menuLogo").addEventListener("click", () => openWindow("about", STATIC_WINS.about));

  /* ---- sound toggle ---- */
  function setSound(muted) {
    $("#soundToggle").textContent = muted ? "🔇" : "🔊";
  }
  $("#soundToggle").addEventListener("click", () => { setSound(Sound.toggle()); });

  /* ---- wallpaper ---- */
  const WALLS = [
    "linear-gradient(160deg,#ffd9ec 0%,#ffe4d6 45%,#e6dcff 100%)",
    "linear-gradient(160deg,#d6f5ff 0%,#e6dcff 50%,#ffe0f0 100%)",
    "linear-gradient(160deg,#e8ffe0 0%,#fff6d6 50%,#ffe0e8 100%)",
    "linear-gradient(160deg,#2b2b3a 0%,#3a3a56 60%,#5a4a6e 100%)"
  ];
  function applyWall(i) { document.body.style.background = WALLS[i % WALLS.length]; }
  function nextWall() {
    let i = (parseInt(store.get("roshnios_wp", "0"), 10) + 1) % WALLS.length;
    store.set("roshnios_wp", String(i));
    applyWall(i);
    Sound.click();
  }
  applyWall(parseInt(store.get("roshnios_wp", "0"), 10) || 0);

  /* ===================================================================
     CONTEXT MENU
     =================================================================== */
  const ctx = $("#ctxmenu");
  const CTX_ITEMS = [
    ["Next Wallpaper", nextWall],
    ["About This Portfolio", () => openWindow("about", STATIC_WINS.about)],
    ["Open Résumé", () => window.open(LINKS.resume, "_blank")],
    ["Close All Windows", closeAll]
  ];
  $("#desktop").addEventListener("contextmenu", e => {
    if (e.target.closest(".win") || e.target.closest(".icon") || e.target.closest(".trash")) return;
    e.preventDefault();
    ctx.innerHTML = "";
    CTX_ITEMS.forEach(row => {
      const b = el("button");
      b.textContent = row[0];
      b.onclick = () => { ctx.hidden = true; Sound.click(); row[1](); };
      ctx.appendChild(b);
    });
    ctx.style.left = Math.min(e.clientX, window.innerWidth - 190) + "px";
    ctx.style.top = Math.min(e.clientY, window.innerHeight - 160) + "px";
    ctx.hidden = false;
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".menubar")) closeMenu();
    if (!e.target.closest("#ctxmenu")) ctx.hidden = true;
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeMenu(); ctx.hidden = true;
      let top = null, z = -1;
      openWins.forEach(w => { if (w.style.display !== "none" && +w.style.zIndex > z) { z = +w.style.zIndex; top = w; } });
      if (top) closeWin(top.dataset.id);
    }
  });

  /* ===================================================================
     TRASH  (easter egg)
     =================================================================== */
  const trash = $("#trash");
  trash.addEventListener("click", () => { Sound.trash(); openWindow("rejected", STATIC_WINS.rejected); });
  trash.addEventListener("mouseenter", () => trash.classList.add("hot"));
  trash.addEventListener("mouseleave", () => trash.classList.remove("hot"));

  /* ===================================================================
     CHARACTER
     =================================================================== */
  function buildCharacter() {
    const c = $("#character");
    c.innerHTML = character();
    c.style.pointerEvents = "auto";
    c.style.cursor = "inherit";
    c.title = "psst — click me for a thought";
    c.addEventListener("click", () => showThought());
    positionHint();
  }

  /* ---- thought bubble: a few things she's mulling over, shuffled per visit ---- */
  const THOUGHTS = [
    "a good prompt is just a spec I forgot to write down anywhere else.",
    "if a model refuses politely, is that alignment — or just customer service?",
    "somewhere a GPU is doing linear algebra to justify my chai budget.",
    "semantic search fixed my ctrl+F trust issues.",
    "shipped a v0.1 once with a bug so honest it felt like a feature.",
    "debugging a hallucination at 2am is a very specific kind of tired."
  ];
  let thoughtTimer;
  function positionThought() {
    const cr = $("#character").getBoundingClientRect();
    $("#thought").style.bottom = Math.round(window.innerHeight - cr.top + 14) + "px";
  }
  function positionHint() {
    const cr = $("#character").getBoundingClientRect();
    const h = $("#thinkHint");
    if (!h) return;
    h.style.left = Math.round(cr.right - 16) + "px";
    h.style.top = Math.round(cr.top - 6) + "px";
  }
  function dismissHint() {
    const h = $("#thinkHint");
    if (h) h.classList.add("gone");
  }
  function pickThoughtIndex() {
    const last = parseInt(store.get("roshnios_thought", "-1"), 10);
    if (THOUGHTS.length < 2) return 0;
    let i;
    do { i = Math.floor(Math.random() * THOUGHTS.length); } while (i === last);
    store.set("roshnios_thought", String(i));
    return i;
  }
  function showThought() {
    const box = $("#thought");
    $("#thoughtText").textContent = THOUGHTS[pickThoughtIndex()];
    positionThought();
    box.hidden = false;
    box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop");
    Sound.think();
    dismissHint();
    clearTimeout(thoughtTimer);
    thoughtTimer = setTimeout(hideThought, 9000);
  }
  function hideThought() {
    $("#thought").hidden = true;
    clearTimeout(thoughtTimer);
  }
  $("#thoughtNext").addEventListener("click", e => { e.stopPropagation(); Sound.click(); showThought(); });
  $("#thoughtClose").addEventListener("click", e => { e.stopPropagation(); hideThought(); });
  window.addEventListener("resize", () => {
    if (!$("#thought").hidden) positionThought();
    positionHint();
  });

  /* ---- status chip ---- */
  $("#statusChip").addEventListener("click", () => { Sound.click(); openWindow("contact", STATIC_WINS.contact); });

  /* ===================================================================
     BOOT
     =================================================================== */
  function buildBootLog() {
    const lines = [
      "> mounting /dev/chai .............. ok",
      "> loading pixel_assets.pak ........ ok",
      "> starting sound_chip (8-bit) ..... ok",
      "> fetching projects [4] ........... ok",
      "> calibrating pixel cursor ........ ok",
      "> user: roshni — welcome"
    ];
    const box = $("#bootLog");
    lines.forEach(l => { const s = el("span"); s.textContent = l; box.appendChild(s); });
  }

  function enter() {
    Sound.init();
    Sound.boot();
    const b = $("#boot");
    b.classList.add("hide");
    setTimeout(() => b.remove(), 550);
    $("#desktop").classList.add("show");
    store.set("roshnios_visited", "1");
    setTimeout(showThought, 1000);
  }

  /* ===================================================================
     INIT
     =================================================================== */
  buildBootLog();
  buildSky();
  buildIcons();
  buildDock();
  buildCharacter();
  setSound(Sound.isMuted());
  fmtClock();
  setInterval(fmtClock, 15000);
  markDock();
  setTimeout(dismissHint, 12000); // stop nagging if she's never clicked

  $("#bootEnter").addEventListener("click", enter);

  // if already visited this session-ish, still require the click (audio needs a gesture)
  if (store.get("roshnios_visited") === "1") {
    $("#bootEnter").textContent = "▶ CLICK TO ENTER";
  }
})();
