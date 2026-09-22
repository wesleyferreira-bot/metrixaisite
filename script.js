/* ===================== Metrix AI — interações ===================== */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Nav: sombra ao rolar + menu mobile ---- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Fluxo do hero: acende nós em sequência, em loop ---- */
  var flow = document.querySelector(".flow");
  if (flow && !reduceMotion) {
    var nodes = Array.prototype.slice.call(flow.querySelectorAll(".flow__node"));
    var links = Array.prototype.slice.call(flow.querySelectorAll(".flow__link"));
    var step = 0;
    function tick() {
      if (step < nodes.length) {
        nodes[step].classList.add("on");
        if (step > 0 && links[step - 1]) links[step - 1].classList.add("on");
        step++;
      } else {
        // reinicia o ciclo
        setTimeout(function () {
          nodes.forEach(function (n) { n.classList.remove("on"); });
          links.forEach(function (l) { l.classList.remove("on"); });
          step = 0;
        }, 2600);
      }
    }
    var flowTimer = setInterval(tick, 620);
    tick();
    // pausa quando fora de vista para poupar CPU
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && !flowTimer) flowTimer = setInterval(tick, 620);
          else if (!e.isIntersecting && flowTimer) { clearInterval(flowTimer); flowTimer = null; }
        });
      }, { threshold: 0.1 }).observe(flow);
    }
  } else if (flow) {
    flow.querySelectorAll(".flow__node").forEach(function (n) { n.classList.add("on"); });
  }

  /* ---- Core: distribui os sistemas em órbita ---- */
  var systems = [
    "CRM", "ERP", "Google", "Meta", "Power BI", "Sheets", "SAP", "Oracle",
    "HubSpot", "Pipedrive", "Tiny", "Bling", "Omie", "Conta Azul",
    "Nuvemshop", "Shopify", "RD Station", "WhatsApp", "Telefone", "Email"
  ];
  var orbit = document.getElementById("coreOrbit");
  var core = document.querySelector(".core");
  if (orbit && core) {
    var n = systems.length;
    // dois anéis para não sobrepor rótulos
    var pins = systems.map(function (name, i) {
      var pin = document.createElement("span");
      pin.className = "core__pin";
      pin.style.setProperty("--a", (360 / n) * i + "deg");
      pin.style.setProperty("--d", (i * 0.16) + "s");
      pin.textContent = name;
      orbit.appendChild(pin);
      return pin;
    });
    function placeOrbit() {
      var size = core.getBoundingClientRect().width || 480;
      // raios menores em telas pequenas para os rótulos não vazarem
      var factor = size < 420 ? 0.42 : 0.48;
      var outer = size * factor; // raio em px
      var inner = size * (factor - 0.08);
      pins.forEach(function (pin, i) {
        pin.style.setProperty("--r", (i % 2 === 0 ? inner : outer) + "px");
      });
    }
    placeOrbit();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(placeOrbit, 120);
    });
  }

  /* ---- Contadores das estatísticas ---- */
  var counters = document.querySelectorAll(".stat__num");
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-to")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = prefix + to + suffix; return; }
    var start = null, dur = 1400;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(to * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ================= Como funciona: cena viva ================= */
  var stageWrap = document.getElementById("hiwStage");
  var hiwRoot = document.querySelector(".hiw");
  if (stageWrap && hiwRoot) {
    var NSVG = "http://www.w3.org/2000/svg";
    function sEl(tag, attrs) {
      var e = document.createElementNS(NSVG, tag);
      if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }
    var hsvg = stageWrap.querySelector("svg");
    var CORE = { x: 360, y: 272, r: 62 };
    var CHANNELS = [
      { ico: "🔌", name: "API",       x: 196, y: 46  },
      { ico: "💬", name: "WhatsApp",  x: 122, y: 134 },
      { ico: "📸", name: "Instagram", x: 92,  y: 224 },
      { ico: "🌐", name: "Site",      x: 86,  y: 314 },
      { ico: "📞", name: "Telefone",  x: 108, y: 404 },
      { ico: "✉️", name: "Email",     x: 156, y: 490 }
    ];
    var SYSTEMS = [
      { ico: "🗂️", name: "CRM",        x: 592, y: 110 },
      { ico: "📦", name: "ERP",        x: 630, y: 206 },
      { ico: "📄", name: "Documentos", x: 620, y: 302 },
      { ico: "🗄️", name: "Data Lake",  x: 616, y: 398 },
      { ico: "💰", name: "Financeiro", x: 570, y: 490 }
    ];

    var hdefs = sEl("defs");
    hdefs.innerHTML =
      '<radialGradient id="hiwCoreG" cx="50%" cy="36%">' +
      '<stop offset="0%" stop-color="#2a3a7a"/><stop offset="100%" stop-color="#0a0c1a"/>' +
      "</radialGradient>";
    hsvg.appendChild(hdefs);

    var gLinesL = sEl("g", { class: "hiw-lines" });
    var gLinesR = sEl("g", { class: "hiw-lines" });
    var gParts = sEl("g");
    var gChan = sEl("g", { class: "hiw-side" });
    var gSys = sEl("g", { class: "hiw-side" });
    var gCore = sEl("g", { class: "hiw-core" });
    [gLinesL, gLinesR, gParts, gChan, gSys, gCore].forEach(function (g) { hsvg.appendChild(g); });

    function mkRoute(n, i, grp) {
      var dx = CORE.x - n.x, dy = CORE.y - n.y;
      var len = Math.hypot(dx, dy);
      var s = (i % 2 ? 1 : -1) * len * 0.10;
      var mx = (n.x + CORE.x) / 2 - (dy / len) * s;
      var my = (n.y + CORE.y) / 2 + (dx / len) * s;
      var p = sEl("path", {
        d: "M" + n.x + " " + n.y + " Q" + mx + " " + my + " " + CORE.x + " " + CORE.y,
        class: "hiw-line"
      });
      grp.appendChild(p);
      return p;
    }
    function mkNode(n, grp) {
      var w = Math.max(66, n.name.length * 7.6 + 46), h = 34;
      var g = sEl("g", { class: "hiw-node" });
      g.appendChild(sEl("rect", { x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: 10 }));
      var ti = sEl("text", { x: n.x - w / 2 + 11, y: n.y + 5 });
      ti.textContent = n.ico;
      var tl = sEl("text", { x: n.x - w / 2 + 33, y: n.y + 4.5, class: "hiw-node__lbl" });
      tl.textContent = n.name;
      g.appendChild(ti); g.appendChild(tl);
      grp.appendChild(g);
      return g;
    }
    var chR = CHANNELS.map(function (n, i) { return mkRoute(n, i, gLinesL); });
    var sysR = SYSTEMS.map(function (n, i) { return mkRoute(n, i, gLinesR); });
    var chNodes = CHANNELS.map(function (n) { return mkNode(n, gChan); });
    var sysNodes = SYSTEMS.map(function (n) { return mkNode(n, gSys); });

    // núcleo: anel rotativo, onda de energia, esfera, sinapses, texto
    gCore.appendChild(sEl("circle", { cx: CORE.x, cy: CORE.y, r: CORE.r + 24, class: "hiw-core__ring" }));
    gCore.appendChild(sEl("circle", { cx: CORE.x, cy: CORE.y, r: CORE.r, class: "hiw-core__burst" }));
    gCore.appendChild(sEl("circle", { cx: CORE.x, cy: CORE.y, r: CORE.r, class: "hiw-core__ball" }));
    var gSyn = sEl("g", { class: "hiw-syn" });
    var synPts = [];
    for (var si = 0; si < 9; si++) {
      var rad = 16 + ((si * 19) % 34);
      synPts.push([
        CORE.x + Math.cos(si * 2.3 + 1) * rad,
        CORE.y + Math.sin(si * 1.9 + 2) * rad
      ]);
    }
    var synLines = [];
    for (var sj = 0; sj < 9; sj++) {
      var a = synPts[sj], b = synPts[(sj + 3) % 9];
      var l = sEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
      gSyn.appendChild(l); synLines.push(l);
      var c = sEl("circle", { cx: a[0], cy: a[1], r: 2.2 });
      gSyn.appendChild(c); synLines.push(c);
    }
    gCore.appendChild(gSyn);
    var ct1 = sEl("text", { x: CORE.x, y: CORE.y - 1, "text-anchor": "middle", class: "hiw-core__t1" });
    ct1.textContent = "METRIX";
    var ct2 = sEl("text", { x: CORE.x, y: CORE.y + 19, "text-anchor": "middle", class: "hiw-core__t2" });
    ct2.textContent = "AI";
    gCore.appendChild(ct1); gCore.appendChild(ct2);

    // ---- infra de animação ----
    var hParts = [], hTos = [], hIvs = [], hRaf = null;
    var hCur = 0, hPlaying = false;
    var hAnim = !reduceMotion;
    function hTo(fn, ms) { hTos.push(setTimeout(fn, ms)); }
    function hIv(fn, ms) { hIvs.push(setInterval(fn, ms)); }
    function hClear() {
      hTos.forEach(clearTimeout); hIvs.forEach(clearInterval);
      hTos = []; hIvs = [];
      hParts.forEach(function (p) { p.el.remove(); });
      hParts = [];
    }
    function hDot(pathEl, opts) {
      opts = opts || {};
      var el = sEl("circle", { r: opts.r || 3.4, class: "hiw-dot" + (opts.v ? " hiw-dot--vio" : "") });
      gParts.appendChild(el);
      hParts.push({
        el: el, path: pathEl, len: pathEl.getTotalLength(),
        born: performance.now(), dur: opts.dur || 1500,
        rev: opts.rev, round: opts.round
      });
      if (!hRaf) hRaf = requestAnimationFrame(hTick);
    }
    function hTick(now) {
      for (var i = hParts.length - 1; i >= 0; i--) {
        var p = hParts[i], k = (now - p.born) / p.dur;
        if (k >= 1) { p.el.remove(); hParts.splice(i, 1); continue; }
        var t = p.round ? (k < 0.5 ? k * 2 : 2 - k * 2) : k;
        if (p.rev) t = 1 - t;
        var pt = p.path.getPointAtLength(t * p.len);
        p.el.setAttribute("cx", pt.x); p.el.setAttribute("cy", pt.y);
      }
      hRaf = hParts.length ? requestAnimationFrame(hTick) : null;
    }
    function hFlash(g) {
      g.classList.add("hl");
      hTo(function () { g.classList.remove("hl"); }, 950);
    }

    var stepEls = Array.prototype.slice.call(hiwRoot.querySelectorAll(".hiw-step"));
    var capT = document.getElementById("hiwCapT");
    var capS = document.getElementById("hiwCapS");
    var chatEl = document.getElementById("hiwChat");
    var execEl = document.getElementById("hiwExec");
    var learnEl = document.getElementById("hiwLearn");
    function hStatus(txt) {
      capS.classList.remove("sw");
      void capS.offsetWidth;
      capS.textContent = txt;
      capS.classList.add("sw");
    }
    function hSides(chanOn, sysOn) {
      gChan.classList.toggle("dim", !chanOn);
      gLinesL.classList.toggle("dim", !chanOn);
      gSys.classList.toggle("dim", !sysOn);
      gLinesR.classList.toggle("dim", !sysOn);
    }
    function hResetOverlays() {
      chatEl.classList.remove("on");
      execEl.classList.remove("on");
      learnEl.classList.remove("on");
      learnEl.querySelectorAll(".hiw-alert").forEach(function (a) { a.classList.remove("in"); });
      stageWrap.classList.remove("mode-learn");
      gCore.classList.remove("burst");
      synLines.forEach(function (l) { l.classList.remove("on"); });
    }

    // ---- cenas ----
    var scenes = [
      { // 1 · Recebe
        dur: 8600,
        t: "1 · Recebe — o lead entra por qualquer canal",
        run: function (anim) {
          hSides(true, false);
          var ph = ["API conectada, lead capturado…", "WhatsApp transmitindo dados…",
            "Instagram transmitindo dados…", "Site enviando lead…",
            "Telefone registrando ligação…", "Email capturado…"];
          if (!anim) { hStatus("Todos os canais desaguam no mesmo cérebro."); return; }
          var i = 0;
          var cyc = function () {
            var ci = i % 6;
            hStatus(ph[ci]);
            hFlash(chNodes[ci]);
            hDot(chR[ci], { dur: 1300 });
            i++;
          };
          cyc();
          hIv(cyc, 1360);
          hIv(function () { hDot(chR[(Math.random() * 6) | 0], { dur: 1600, r: 2.6 }); }, 480);
        }
      },
      { // 2 · Entende
        dur: 10200,
        t: "2 · Entende — a IA acende e consulta tudo",
        run: function (anim) {
          hSides(false, true);
          gCore.classList.add("burst");
          if (!anim) {
            synLines.forEach(function (l) { l.classList.add("on"); });
            hStatus("Consulta CRM, ERP, documentos e Data Lake. Enriquece o lead.");
            return;
          }
          synLines.forEach(function (l, i) {
            hTo(function () { l.classList.add("on"); }, 150 + i * 110);
          });
          var ph = ["Consultando seu CRM…", "Consultando o ERP…", "Lendo documentos e propostas…",
            "Varrendo o Data Lake…", "Cruzando o histórico do cliente…", "Enriquecendo os dados do lead…"];
          var i = 0;
          var cyc = function () {
            var pi = i % 6;
            hStatus(ph[pi]);
            if (pi < 5) {
              hFlash(sysNodes[pi]);
              hDot(sysR[pi], { round: true, rev: true, dur: 1700, v: true });
            } else {
              sysNodes.forEach(hFlash);
              sysR.forEach(function (r) { hDot(r, { round: true, rev: true, dur: 1700, v: true }); });
            }
            i++;
          };
          cyc();
          hIv(cyc, 1560);
        }
      },
      { // 3 · Negocia
        dur: 12400,
        t: "3 · Negocia — conversa de verdade, com objetivo",
        run: function (anim) {
          hSides(false, false);
          chatEl.classList.add("on");
          chatEl.innerHTML = '<div class="hiw-chat__badges">💬 WhatsApp · 📸 Instagram · 🌐 Chat do site</div>';
          var seq = [
            { k: "lead", txt: "Gostei, mas achei caro 🤔", at: 300 },
            { k: "typing", at: 900, rm: 2100 },
            { k: "ai", txt: "Entendo! Posso te mostrar quanto isso retorna em 30 dias, com seus números. Topa?", at: 2100 },
            { k: "lead", txt: "Topo, quero ver", at: 3700 },
            { k: "typing", at: 4300, rm: 5500 },
            { k: "ai", txt: "Fechado! Amanhã às 14h te apresento tudo. Já deixo a proposta pronta 😉", at: 5500 },
            { k: "chip", txt: "✓ Reunião agendada · qui 14:00", at: 7300 },
            { k: "chip", txt: "✓ CRM atualizado automaticamente", at: 8600 }
          ];
          function addMsg(m) {
            var el = document.createElement("div");
            if (m.k === "chip") { el.className = "hiw-chip"; el.textContent = m.txt; }
            else if (m.k === "typing") {
              el.className = "hiw-bubble hiw-bubble--ai hiw-bubble--typing";
              el.innerHTML = "<i></i><i></i><i></i>";
            } else {
              el.className = "hiw-bubble hiw-bubble--" + (m.k === "ai" ? "ai" : "lead");
              el.textContent = m.txt;
            }
            chatEl.appendChild(el);
            return el;
          }
          if (!anim) {
            seq.forEach(function (m) {
              if (m.k === "typing") return;
              addMsg(m).classList.add("in");
            });
            hStatus("Quebra objeções, qualifica, agenda e vende.");
            return;
          }
          seq.forEach(function (m) {
            hTo(function () {
              var el = addMsg(m);
              requestAnimationFrame(function () { el.classList.add("in"); });
              if (m.rm) hTo(function () { el.remove(); }, m.rm - m.at);
            }, m.at);
          });
          var ph = ["Quebrando objeção no WhatsApp…", "Qualificando o lead…",
            "Negociando condição…", "Agendando reunião…", "Registrando tudo no CRM…"];
          var i = 0;
          hIv(function () { hStatus(ph[i % 5]); i++; }, 2300);
          hStatus(ph[0]); i = 1;
          hIv(function () { hDot(chR[1 + ((Math.random() * 3) | 0)], { dur: 1800, r: 2.6 }); }, 900);
        }
      },
      { // 4 · Executa
        dur: 11600,
        t: "4 · Executa — age nos seus sistemas, sem mão humana",
        run: function (anim) {
          hSides(false, true);
          execEl.classList.add("on");
          execEl.innerHTML = "";
          var items = [
            { txt: "Pedido criado no ERP", n: 1 },
            { txt: "CRM atualizado: etapa, valor e histórico", n: 0 },
            { txt: "Proposta emitida e enviada", n: 2 },
            { txt: "Cobrança lançada no Financeiro", n: 4 },
            { txt: "Contrato enviado para assinatura", n: 2 },
            { txt: "Tudo sincronizado via APIs", n: -1 }
          ];
          items.forEach(function (it, i) {
            var el = document.createElement("div");
            el.className = "hiw-exec__item";
            el.innerHTML = '<span class="hiw-exec__chk">✓</span>' + it.txt;
            execEl.appendChild(el);
            if (!anim) { el.classList.add("in"); return; }
            hTo(function () {
              el.classList.add("in");
              hStatus(it.txt);
              if (it.n < 0) {
                sysNodes.forEach(hFlash);
                sysR.forEach(function (r) { hDot(r, { rev: true, dur: 1300 }); });
              } else {
                hFlash(sysNodes[it.n]);
                hDot(sysR[it.n], { rev: true, dur: 1300 });
              }
            }, 500 + i * 1650);
          });
          if (!anim) hStatus("Da conversa à operação: pedido, proposta, contrato, cobrança.");
        }
      },
      { // 5 · Aprende
        dur: 10200,
        t: "5 · Aprende — cada interação vira inteligência de gestão",
        run: function (anim) {
          hSides(false, false);
          learnEl.classList.add("on");
          stageWrap.classList.add("mode-learn");
          var alerts = learnEl.querySelectorAll(".hiw-alert");
          if (!anim) {
            alerts.forEach(function (a) { a.classList.add("in"); });
            hStatus("Dashboards, alertas e relatórios. Sempre evoluindo.");
            return;
          }
          hTo(function () { alerts[0].classList.add("in"); }, 1400);
          hTo(function () { alerts[1].classList.add("in"); }, 3200);
          var ph = ["Atualizando dashboards…", "Gerando alertas inteligentes…",
            "Criando relatório semanal…", "Recalculando previsões…", "Evoluindo a cada conversa…"];
          var i = 0;
          hIv(function () { hStatus(ph[i % 5]); i++; }, 1900);
          hStatus(ph[0]); i = 1;
          hIv(function () {
            var r = sysR[[0, 3][(Math.random() * 2) | 0]];
            hDot(r, { round: true, rev: true, dur: 1900, v: true, r: 2.8 });
          }, 1300);
        }
      }
    ];

    function hGoto(i) {
      hCur = i;
      hClear();
      hResetOverlays();
      stepEls.forEach(function (s, j) {
        s.classList.toggle("active", j === i);
        var bar = s.querySelector(".hiw-step__bar span");
        bar.style.transition = "none";
        bar.style.width = "0";
      });
      capT.textContent = scenes[i].t;
      scenes[i].run(hAnim);
      if (hAnim && hPlaying) {
        var bar = stepEls[i].querySelector(".hiw-step__bar span");
        void bar.offsetWidth;
        bar.style.transition = "width " + scenes[i].dur + "ms linear";
        bar.style.width = "100%";
        hTo(function () { hGoto((hCur + 1) % scenes.length); }, scenes[i].dur);
      }
    }
    stepEls.forEach(function (s, i) {
      s.querySelector(".hiw-step__btn").addEventListener("click", function () { hGoto(i); });
    });

    if (!hAnim) hiwRoot.classList.add("static");
    var hDbg = /[?&]hiw=(\d)/.exec(location.search);
    if (hDbg) {
      hGoto(Math.min(4, Math.max(0, +hDbg[1] - 1)));
      setTimeout(function () {
        stageWrap.scrollIntoView({ block: "center", behavior: "instant" });
      }, 60);
    } else if (hAnim && "IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && !hPlaying) { hPlaying = true; hGoto(hCur); }
          else if (!e.isIntersecting && hPlaying) { hPlaying = false; hClear(); }
        });
      }, { threshold: 0.25 }).observe(stageWrap);
      hGoto(0); hClear(); // estado inicial estático até entrar na tela
      scenes[0].run(false);
    } else {
      hGoto(0);
    }
  }
})();
