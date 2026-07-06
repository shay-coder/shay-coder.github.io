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

const supportsHoverTilt = window.matchMedia("(hover: hover)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      <div class="card-glare"></div>
    </article>
  `;
  }).join("");

  if (supportsHoverTilt) attachCardTilt();
}

/* Mouse-tracked 3D tilt + moving glare highlight for each project card. */
function attachCardTilt() {
  grid.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 14;
      const rotX = (0.5 - py) * 10;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
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
(function initHero3D() {
  const container = document.getElementById("heroVisual");
  if (!container) return;

  // Graceful fallback: if the Three.js CDN didn't load (offline, blocked,
  // etc.), the CSS radial-gradient already set on #heroVisual stays as-is.
  if (typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const lightCyan = new THREE.PointLight(0x67e8f9, 1.1, 20);
    lightCyan.position.set(3, 3, 5);
    scene.add(lightCyan);
    const lightAmber = new THREE.PointLight(0xfbbf24, 0.9, 20);
    lightAmber.position.set(-3, -2, 4);
    scene.add(lightAmber);
    const rimLight = new THREE.PointLight(0xffffff, 0.7, 20);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const group = new THREE.Group();
    scene.add(group);

    // A slowly counter-rotating wireframe shell around the network, for a
    // "robotic containment core" feel.
    const shellGeo = new THREE.IcosahedronGeometry(3.1, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x12172b, wireframe: true, transparent: true, opacity: 0.12 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // Three layers, styled after a neural network's forward pass — the
    // same motif as the intrusion-detection and ML work this site shows.
    const layerDefs = [
      { count: 4, x: -2.3, color: 0x67e8f9 },
      { count: 6, x: 0,    color: 0xa78bfa },
      { count: 3, x: 2.3,  color: 0xfbbf24 }
    ];

    const layerNodes = layerDefs.map(def => {
      const nodes = [];
      for (let i = 0; i < def.count; i++) {
        const y = (i - (def.count - 1) / 2) * 0.85;
        const z = (Math.random() - 0.5) * 0.6;
        const geo = new THREE.SphereGeometry(0.16, 20, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x14171f,
          roughness: 0.3,
          metalness: 0.65,
          emissive: def.color,
          emissiveIntensity: 0.55
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(def.x, y, z);
        group.add(mesh);
        nodes.push({ position: mesh.position, color: def.color });
      }
      return nodes;
    });

    // Edges, colored as a gradient between each pair of endpoint nodes.
    const edgeList = [];
    const c1 = new THREE.Color();
    const c2 = new THREE.Color();
    for (let l = 0; l < layerNodes.length - 1; l++) {
      layerNodes[l].forEach(a => {
        layerNodes[l + 1].forEach(b => {
          c1.set(a.color);
          c2.set(b.color);
          c1.multiplyScalar(0.8);
          c2.multiplyScalar(0.8);
          const positions = new Float32Array([
            a.position.x, a.position.y, a.position.z,
            b.position.x, b.position.y, b.position.z
          ]);
          const colors = new Float32Array([c1.r, c1.g, c1.b, c2.r, c2.g, c2.b]);
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3 });
          group.add(new THREE.Line(geo, mat));
          edgeList.push({ a: a.position, b: b.position, color: a.color });
        });
      });
    }

    // Glowing signal pulses traveling along random edges, on a loop.
    const pulses = [];
    if (!reduceMotion) {
      const pulseCount = 14;
      for (let i = 0; i < pulseCount; i++) {
        const edge = edgeList[Math.floor(Math.random() * edgeList.length)];
        const geo = new THREE.SphereGeometry(0.06, 10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: edge.color, transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        pulses.push({ mesh, edge, t: Math.random(), speed: 0.15 + Math.random() * 0.15 });
      }
    }

    // Mouse-driven parallax tilt, layered on top of a slow constant spin.
    let autoRotY = 0;
    let curTiltX = 0, curTiltY = 0;
    let targetTiltX = 0, targetTiltY = 0;

    if (!reduceMotion) {
      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        targetTiltY = (px - 0.5) * 0.9;
        targetTiltX = (py - 0.5) * -0.6;
      });
      container.addEventListener("mouseleave", () => {
        targetTiltX = 0;
        targetTiltY = 0;
      });
    }

    const clock = new THREE.Clock();

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.1);

      if (!reduceMotion) {
        autoRotY += delta * 0.18;
        curTiltX += (targetTiltX - curTiltX) * 0.05;
        curTiltY += (targetTiltY - curTiltY) * 0.05;
        group.rotation.x = curTiltX;
        group.rotation.y = autoRotY + curTiltY;

        shell.rotation.y -= delta * 0.07;
        shell.rotation.x += delta * 0.035;

        pulses.forEach(p => {
          p.t += delta * p.speed;
          if (p.t > 1) p.t -= 1;
          p.mesh.position.lerpVectors(p.edge.a, p.edge.b, p.t);
        });
      }

      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  } catch (err) {
    // WebGL unsupported or another render error — fall back to the CSS
    // gradient already set on #heroVisual, no broken UI either way.
    console.warn("3D hero scene unavailable, using fallback background.", err);
  }
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
