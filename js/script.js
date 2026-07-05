/* ==========================================================================
   PROJECT DATA
   ---------------------------------------------------------------------
   This is the ONLY place you need to edit to add, remove, or change
   projects. Filter buttons above the grid are generated automatically
   from the `tags` you list on each project — no HTML editing needed.
   The FIRST project in this array is shown as the featured, larger card.

   Schema:
   {
     title:       "Project Name",
     desc:        "One or two sentence description.",
     tags:        ["Python", "Machine Learning"],
     repo:        "https://github.com/you/repo",     // link to code
     demo:        "https://your-demo-link.com"       // optional — omit or set to "" to hide
   }
   ========================================================================== */
const PROJECTS = [
  {
    // NOTE: point this at your actual repository URL once you confirm the exact name.
    title: "Network Intrusion Detection",
    desc: "A machine learning system that classifies network traffic as normal or malicious, trained on labeled flow data to flag intrusion patterns in real time.",
    tags: ["Python", "Machine Learning", "Security"],
    repo: "https://github.com/shay-coder",
    demo: ""
  },
  {
    title: "Keyword Spotting",
    desc: "A real time audio keyword detection system, exploring signal processing and lightweight pattern matching suited to embedded style inference.",
    tags: ["Python", "Machine Learning", "Audio"],
    repo: "https://github.com/shay-coder/Keyword-Spotting",
    demo: ""
  },
  {
    // NOTE: point this at your actual repository URL once you confirm the exact name.
    title: "Language Identifier",
    desc: "A classifier that predicts the spoken or written language of a given sample, built around feature extraction and a trained language classification model.",
    tags: ["Python", "Machine Learning", "NLP"],
    repo: "https://github.com/shay-coder",
    demo: ""
  },
  {
    title: "COVID-19 Data Exploration",
    desc: "Exploratory data analysis of COVID-19 case data, cleaning, aggregating, and visualizing trends to surface patterns in the raw numbers.",
    tags: ["Python", "Data Analysis"],
    repo: "https://github.com/shay-coder/Data-Exploration-of-Covid-Data-Set",
    demo: ""
  },
  {
    title: "Babylonian Method",
    desc: "An implementation of the ancient Babylonian method for computing square roots, a small, precise exercise in iterative numerical approximation.",
    tags: ["C++", "Algorithms"],
    repo: "https://github.com/shay-coder/Babylonian-Method",
    demo: ""
  }
  // Add more project objects here, following the schema above.
];

/* ==========================================================================
   RENDER PROJECTS + FILTERS
   ========================================================================== */
const grid = document.getElementById("projectsGrid");
const filterBar = document.getElementById("filterBar");

function renderProjects(list, allowFeatured) {
  grid.innerHTML = list.map((p, i) => {
    const isFeatured = allowFeatured && i === 0;
    return `
    <article class="project-card${isFeatured ? " featured" : ""}" data-tags="${p.tags.join("|")}" style="animation-delay:${i * 50}ms">
      ${isFeatured ? '<span class="featured-badge">Featured</span>' : ""}
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
      </div>
      <div class="project-links">
        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">Code ↗</a>` : ""}
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Demo ↗</a>` : ""}
      </div>
    </article>
  `;
  }).join("");
}

function renderFilters() {
  const tagSet = new Set();
  PROJECTS.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  const tags = ["All", ...Array.from(tagSet).sort()];

  filterBar.innerHTML = tags.map((t, i) => `
    <button class="filter-btn${i === 0 ? " active" : ""}" data-tag="${t}" role="tab" aria-selected="${i === 0}">
      ${t}
    </button>
  `).join("");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filterBar.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const tag = btn.dataset.tag;
    if (tag === "All") {
      renderProjects(PROJECTS, true);
    } else {
      renderProjects(PROJECTS.filter(p => p.tags.includes(tag)), false);
    }
  });
}

renderFilters();
renderProjects(PROJECTS, true);

/* ==========================================================================
   HERO NETWORK GRAPH
   A small layered node graph (input -> hidden -> output), styled after a
   neural network's forward pass — echoing both "machine learning" and the
   network traffic behind the intrusion detection project. Signal pulses
   travel along the edges on a loop. Ambient and decorative only.
   ========================================================================== */
(function drawNetworkGraph() {
  const svg = document.getElementById("networkSvg");
  if (!svg) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 420, H = 420;
  const layers = [
    { count: 4, x: 60,  cls: "node-input" },
    { count: 6, x: 210, cls: "node-hidden" },
    { count: 3, x: 360, cls: "node-output" }
  ];

  const nodes = layers.map(layer => {
    const gap = H / (layer.count + 1);
    const pts = [];
    for (let i = 1; i <= layer.count; i++) {
      pts.push({ x: layer.x, y: gap * i, cls: layer.cls });
    }
    return pts;
  });

  let edgesSvg = "";
  const edgeList = [];
  for (let l = 0; l < nodes.length - 1; l++) {
    nodes[l].forEach(a => {
      nodes[l + 1].forEach(b => {
        edgesSvg += `<line class="edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
        edgeList.push({ a, b });
      });
    });
  }

  const nodesSvg = nodes.flat().map(n =>
    `<circle class="${n.cls}" cx="${n.x}" cy="${n.y}" r="6" />`
  ).join("");

  let pulsesSvg = "";
  if (!reduceMotion) {
    // Send a handful of pulses along random edges, staggered, looping.
    const pulseCount = 9;
    for (let i = 0; i < pulseCount; i++) {
      const edge = edgeList[Math.floor(Math.random() * edgeList.length)];
      const dur = 2.4 + Math.random() * 1.6;
      const delay = Math.random() * 4;
      pulsesSvg += `
        <circle class="pulse" r="3" opacity="0">
          <animateMotion path="M${edge.a.x},${edge.a.y} L${edge.b.x},${edge.b.y}"
            dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1"
            dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
        </circle>`;
    }
  }

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = edgesSvg + nodesSvg + pulsesSvg;
})();

/* ==========================================================================
   SCROLL REVEAL
   Fades + rises each .reveal section into place the first time it enters
   the viewport. Runs once per element, then stops observing it.
   ========================================================================== */
(function scrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach(t => t.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => observer.observe(t));
})();

/* ==========================================================================
   SCROLLSPY
   Highlights the nav link matching whichever section is currently in view.
   ========================================================================== */
(function scrollspy() {
  const sections = document.querySelectorAll("main .section, main .hero");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const linkFor = (id) => Array.from(navLinks).find(a => a.getAttribute("href") === `#${id}`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("active"));
        const link = linkFor(entry.target.id);
        if (link) link.classList.add("active");
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => { if (s.id) observer.observe(s); });
})();

/* ==========================================================================
   NAV: mobile toggle + footer year
   ========================================================================== */
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

navToggle.addEventListener("click", () => {
  const isOpen = navMobile.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMobile.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navMobile.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
