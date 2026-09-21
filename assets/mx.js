/* ===================== Metrix AI — site v2 =====================
   Testeira do workshop · botão de WhatsApp com 4 assuntos · formulários (grava no banco + abre o WhatsApp)
   · medição (dataLayer, GTM e Pixel opcionais) · lotes e checkout do Workshop de IA · página de obrigado.
   Configuração em CFG. O preço cobrado é sempre calculado no servidor (edge workshop-checkout). */
(function () {
  "use strict";

  var CFG = {
    WA: "5511991502676",              // número do SDR (o mesmo para os 4 assuntos)
    GTM_ID: "",                        // ex.: "GTM-XXXXXXX" — preencher para ligar o Google Tag Manager
    PIXEL_ID: "",                      // ex.: "123456789012345" — preencher para ligar o Pixel da Meta
    API: "https://orxznqmpelrtciiqltfz.supabase.co/functions/v1/",
    EVENTO_INICIO: "2026-10-27T09:00:00-03:00",
    EVENTO_FIM: "2026-10-27T19:30:00-03:00",
    LOTES: [
      { lote: 1, nome: "1º lote", inicio: "2026-09-22T00:00:00-03:00", fim: "2026-10-04T00:00:00-03:00", centavos: 84900 },
      { lote: 2, nome: "2º lote", inicio: "2026-10-04T00:00:00-03:00", fim: "2026-10-16T00:00:00-03:00", centavos: 94900 },
      { lote: 3, nome: "3º lote", inicio: "2026-10-16T00:00:00-03:00", fim: "2026-10-27T00:00:00-03:00", centavos: 124800 }
    ],
    ADICIONAL: 28900,
    ASSUNTOS: {
      sdr_ia:          { ico: "💬", rotulo: "Atendimento e SDR com IA", desc: "IA que atende, qualifica e agenda", msg: "Olá! Vim pelo site da Metrix AI e quero conhecer o SDR com IA." },
      departamento_ia: { ico: "🧠", rotulo: "Departamento de IA", desc: "Dados, IAs, automações e relatórios", msg: "Olá! Vim pelo site da Metrix AI e quero saber sobre o Departamento de IA." },
      workshop:        { ico: "🎟️", rotulo: "Workshop de IA — 27/10", desc: "Inscrições, lotes e programação", msg: "Olá! Vim pelo site da Metrix AI e quero saber sobre o Workshop de IA de 27/10." },
      suporte:         { ico: "🛟", rotulo: "Já sou cliente — suporte", desc: "Ajuda com a plataforma ou o seu agente", msg: "Olá! Sou cliente da Metrix AI e preciso de suporte." }
    },
    ORDEM: ["sdr_ia", "departamento_ia", "workshop", "suporte"]
  };
  window.MX_CFG = CFG;

  var PAGE = document.body.getAttribute("data-mx-page") || "site";
  var PRIMARY = document.body.getAttribute("data-mx-interesse") || "sdr_ia";
  var q = new URLSearchParams(location.search);

  /* ------------------------------------------------------------------ medição */
  window.dataLayer = window.dataLayer || [];
  if (CFG.GTM_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s); j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i; f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", CFG.GTM_ID);
  }
  if (CFG.PIXEL_ID) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", CFG.PIXEL_ID); window.fbq("track", "PageView");
  }
  var FB_MAP = { clique_whatsapp: "Contact", envio_formulario: "Lead", inicio_checkout: "InitiateCheckout", compra_workshop: "Purchase" };
  function track(ev, p) {
    p = p || {};
    var data = { event: ev, pagina: PAGE };
    for (var k in p) data[k] = p[k];
    try { window.dataLayer.push(data); } catch (e) {}
    try {
      if (window.fbq && FB_MAP[ev]) {
        var fp = {};
        if (p.valor) { fp.value = p.valor; fp.currency = "BRL"; }
        if (p.assunto || p.interesse) fp.content_category = p.assunto || p.interesse;
        window.fbq("track", FB_MAP[ev], fp, p.event_id ? { eventID: p.event_id } : undefined);
      }
    } catch (e) {}
  }
  window.mxTrack = track;

  /* ------------------------------------------------------------------ UTM e ids de clique */
  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];
  (function guarda() {
    try {
      var tem = KEYS.some(function (k) { return q.get(k); });
      if (tem) {
        KEYS.forEach(function (k) { var v = q.get(k); if (v) sessionStorage.setItem("mx_" + k, v.slice(0, 200)); else sessionStorage.removeItem("mx_" + k); });
        sessionStorage.setItem("mx_landing", location.pathname);
      }
      if (!sessionStorage.getItem("mx_landing")) sessionStorage.setItem("mx_landing", location.pathname);
      if (!sessionStorage.getItem("mx_ref") && document.referrer && document.referrer.indexOf(location.host) === -1) sessionStorage.setItem("mx_ref", document.referrer.slice(0, 200));
    } catch (e) {}
  })();
  function utm() {
    var o = {};
    KEYS.concat(["landing", "ref"]).forEach(function (k) {
      var v = null;
      try { v = sessionStorage.getItem("mx_" + k); } catch (e) {}
      if (!v && KEYS.indexOf(k) >= 0) v = q.get(k);
      if (v) o[k] = v;
    });
    return o;
  }
  function refTag() { var u = utm(); var g = u.gclid || u.gbraid || u.wbraid; return g ? " [ref:" + g.slice(-8) + "]" : ""; }
  function waLink(text) { return "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(text + refTag()); }
  function msgDe(assunto, extra) { var a = CFG.ASSUNTOS[assunto] || CFG.ASSUNTOS.sdr_ia; return a.msg + (extra ? " " + extra : ""); }
  function abre(url) {
    var w = null;
    try { w = window.open(url, "_blank"); } catch (e) {}
    if (w) { try { w.opener = null; } catch (e) {} } else { location.href = url; }
  }

  /* ------------------------------------------------------------------ datas, lotes e dinheiro */
  var OFFSET = 0;                                   // diferença entre o relógio do visitante e o do servidor
  try { OFFSET = +sessionStorage.getItem("mx_offset") || 0; } catch (e) {}
  function agora() {
    var f = q.get("mx_hoje");                       // só para conferir a página em outra data: ?mx_hoje=2026-10-05
    if (f) { var t = Date.parse(f.length === 10 ? f + "T12:00:00-03:00" : f); if (!isNaN(t)) return t; }
    return Date.now() + OFFSET;
  }
  function loteEm(t) {
    var L = CFG.LOTES;
    if (t < Date.parse(L[0].inicio)) return L[0];
    for (var i = 0; i < L.length; i++) if (t >= Date.parse(L[i].inicio) && t < Date.parse(L[i].fim)) return L[i];
    return null;
  }
  function proximoDe(l) { if (!l) return null; var i = CFG.LOTES.indexOf(l); return CFG.LOTES[i + 1] || null; }
  function brl(c) { return (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: c % 100 ? 2 : 0, maximumFractionDigits: 2 }); }
  function ddmm(iso) { var d = new Date(Date.parse(iso) - 3 * 3600000); return String(d.getUTCDate()).padStart(2, "0") + "/" + String(d.getUTCMonth() + 1).padStart(2, "0"); }
  function ultimoDia(l) { return ddmm(new Date(Date.parse(l.fim) - 1000).toISOString()); }
  function falta(ms) {
    ms = Math.max(0, ms);
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
    return { d: d, h: h, m: m, s: s };
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  /* ------------------------------------------------------------------ testeira */
  function testeira() {
    var el = document.getElementById("mx-topbar");
    if (!el) return;
    var t = agora(), l = loteEm(t);
    if (!l || t >= Date.parse(CFG.EVENTO_INICIO)) { el.hidden = true; return; }
    var href = PAGE === "workshop" ? "#ingressos" : "/workshop-ia/#ingressos";
    el.innerHTML =
      '<div class="mx-topbar__in">' +
      '<span class="mx-topbar__tag">Workshop de IA · 27/10</span>' +
      '<span class="mx-topbar__txt"><span class="mx-topbar__long">Presencial em São Caetano do Sul · </span><strong>' + l.nome + ':</strong> ' +
      '<span class="mx-topbar__price">' + brl(l.centavos) + '</span> <span class="mx-topbar__long">para 2 pessoas</span><span class="mx-topbar__short">(2 pessoas)</span></span>' +
      '<span class="mx-topbar__count" data-mx-short-count></span>' +
      '<a class="mx-topbar__cta" href="' + href + '" data-mx-evt="testeira">Garantir vaga →</a></div>';
    el.hidden = false;
    var c = el.querySelector("[data-mx-short-count]");
    function tick() {
      var f = falta(Date.parse(l.fim) - agora());
      c.textContent = proximoDe(l) ? "o preço sobe em " + f.d + "d " + pad(f.h) + "h " + pad(f.m) + "min" : "últimos dias: " + f.d + "d " + pad(f.h) + "h";
    }
    tick(); setInterval(tick, 30000);
    el.querySelector("[data-mx-evt]").addEventListener("click", function () { track("clique_testeira", { lote: l.lote }); });
  }

  /* ------------------------------------------------------------------ botão de WhatsApp */
  function widget() {
    if (document.querySelector(".mx-wa")) return;
    var ordem = [PRIMARY];
    CFG.ORDEM.forEach(function (k) { if (ordem.indexOf(k) < 0 && k !== "suporte") ordem.push(k); });
    if (ordem.indexOf("suporte") < 0) ordem.push("suporte");
    var ops = ordem.map(function (k) {
      var a = CFG.ASSUNTOS[k];
      return '<a class="mx-wa__opt" href="' + waLink(a.msg) + '" target="_blank" rel="noopener" data-assunto="' + k + '">' +
        '<i aria-hidden="true">' + a.ico + '</i><span><b>' + a.rotulo + '</b><small>' + a.desc + '</small></span>' +
        '<span class="mx-ic mx-ic--arrow" aria-hidden="true"></span></a>';
    }).join("");
    var w = document.createElement("div");
    w.className = "mx-wa";
    w.innerHTML =
      '<div class="mx-wa__panel" id="mxWaPanel" role="dialog" aria-labelledby="mxWaTitle">' +
      '<div class="mx-wa__head"><span class="mx-logo" aria-hidden="true"></span><div><b id="mxWaTitle">Metrix AI</b><small>Responde em segundos, 24h</small></div>' +
      '<button class="mx-wa__close" type="button" aria-label="Fechar">×</button></div>' +
      '<div class="mx-wa__body"><p class="mx-wa__intro">Sobre o que você quer falar? Escolha e a conversa abre no WhatsApp.</p>' + ops + '</div>' +
      '<div class="mx-wa__foot">WhatsApp oficial da Metrix</div></div>' +
      '<button class="mx-wa__btn" type="button" aria-expanded="false" aria-controls="mxWaPanel" aria-label="Falar com a Metrix no WhatsApp">' +
      '<span class="mx-wa__circle"><i class="mx-ic mx-ic--wa" aria-hidden="true"></i></span><span class="mx-wa__label">Fale com a Metrix</span></button>';
    document.body.appendChild(w);
    var btn = w.querySelector(".mx-wa__btn");
    function set(open) {
      w.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (open) { track("abre_menu_whatsapp", {}); var first = w.querySelector(".mx-wa__opt"); if (first) setTimeout(function () { first.focus(); }, 50); }
    }
    btn.addEventListener("click", function () { set(!w.classList.contains("open")); });
    w.querySelector(".mx-wa__close").addEventListener("click", function () { set(false); btn.focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && w.classList.contains("open")) { set(false); btn.focus(); } });
    document.addEventListener("click", function (e) { if (w.classList.contains("open") && !w.contains(e.target) && !e.target.closest("[data-mx-wa-open]")) set(false); });
    w.querySelectorAll(".mx-wa__opt").forEach(function (a) {
      a.addEventListener("click", function () { a.href = waLink(CFG.ASSUNTOS[a.getAttribute("data-assunto")].msg); track("clique_whatsapp", { assunto: a.getAttribute("data-assunto"), origem: "botao_flutuante" }); setTimeout(function () { set(false); }, 150); });
    });
    document.querySelectorAll("[data-mx-wa-open]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); set(true); });
    });
  }

  /* CTAs da página: <a data-mx-wa="sdr_ia" data-mx-extra="plano SDR"> */
  function ctas() {
    document.querySelectorAll("[data-mx-wa]").forEach(function (a) {
      var assunto = a.getAttribute("data-mx-wa"), extra = a.getAttribute("data-mx-extra") || "";
      a.setAttribute("href", waLink(msgDe(assunto, extra)));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
      a.addEventListener("click", function () {
        a.setAttribute("href", waLink(msgDe(assunto, extra)));
        track("clique_whatsapp", { assunto: assunto, origem: a.getAttribute("data-mx-origem") || "cta", extra: extra });
      });
    });
  }

  /* ------------------------------------------------------------------ formulários */
  function mascara(el) {
    el.addEventListener("input", function () {
      var d = el.value.replace(/\D/g, "").slice(0, 13);
      if (d.startsWith("55") && d.length > 11) d = d.slice(2);
      var r = d;
      if (d.length > 2) r = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 7) r = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6, 11);
      el.value = r;
    });
  }
  function marca(form, campos) {
    form.querySelectorAll("[aria-invalid]").forEach(function (e) { e.removeAttribute("aria-invalid"); });
    campos.forEach(function (n) { var e = form.querySelector('[name="' + n + '"]'); if (e) e.setAttribute("aria-invalid", "true"); });
    var first = campos.length && form.querySelector('[name="' + campos[0] + '"]');
    if (first && first.focus) first.focus();
  }
  function forms() {
    document.querySelectorAll("form[data-mx-form]").forEach(function (f) {
      var pagina = f.getAttribute("data-mx-form");
      var tel = f.querySelector('[name="whatsapp"]'); if (tel) mascara(tel);
      var sel = f.querySelector('[name="interesse"]');
      var pre = q.get("interesse");
      if (sel && pre && CFG.ASSUNTOS[pre]) sel.value = pre;
      var out = f.querySelector(".mx-form__msg");
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var fd = new FormData(f), d = {};
        fd.forEach(function (v, k) { d[k] = String(v).trim(); });
        var erros = [];
        if (!CFG.ASSUNTOS[d.interesse]) erros.push("interesse");
        if (!d.nome || d.nome.length < 2) erros.push("nome");
        var dig = (d.whatsapp || "").replace(/\D/g, "");
        if (dig.length < 10 || dig.length > 13) erros.push("whatsapp");
        if (d.email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email)) erros.push("email");
        if (erros.length) {
          marca(f, erros);
          out.className = "mx-form__msg err";
          out.textContent = erros.indexOf("whatsapp") >= 0 ? "Confira o WhatsApp com DDD." : "Preencha os campos destacados.";
          return;
        }
        marca(f, []);
        var payload = { interesse: d.interesse, nome: d.nome, empresa: d.empresa || "", whatsapp: dig, email: d.email || "",
          mensagem: d.mensagem || "", volume: d.volume || "", pagina: pagina, website: d.website || "", utm: utm() };
        try {
          fetch(CFG.API + "site-lead", { method: "POST", mode: "cors", keepalive: true,
            headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(payload) }).catch(function () {});
        } catch (e) {}
        track("envio_formulario", { interesse: d.interesse });
        var linhas = [msgDe(d.interesse), "Nome: " + d.nome];
        if (d.empresa) linhas.push("Empresa: " + d.empresa);
        if (d.volume) linhas.push("Atendimentos por mês: " + d.volume);
        if (d.mensagem) linhas.push("Mensagem: " + d.mensagem);
        var url = waLink(linhas.join("\n"));
        out.className = "mx-form__msg ok";
        out.innerHTML = "Recebemos seus dados. A conversa abriu no WhatsApp — é só enviar a mensagem. Não abriu? <a href='" + url + "' target='_blank' rel='noopener'>Clique aqui</a>.";
        abre(url);
      });
    });
  }

  /* ------------------------------------------------------------------ conversa animada */
  function conversas() {
    document.querySelectorAll("[data-mx-chat]").forEach(function (box) {
      var itens = Array.prototype.slice.call(box.children);
      var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var tos = [], rodando = false;
      function limpa() { tos.forEach(clearTimeout); tos = []; itens.forEach(function (e) { e.classList.remove("in"); if (e.hasAttribute("data-rm")) e.style.display = "none"; }); }
      function roda() {
        limpa();
        var fim = 0;
        itens.forEach(function (e) {
          var at = +e.getAttribute("data-at") || 0, rm = e.getAttribute("data-rm");
          fim = Math.max(fim, at, rm ? +rm : 0);
          tos.push(setTimeout(function () { e.style.display = ""; requestAnimationFrame(function () { e.classList.add("in"); }); }, at));
          if (rm) tos.push(setTimeout(function () { e.style.display = "none"; }, +rm));
        });
        tos.push(setTimeout(roda, fim + 6000));
      }
      if (reduz || !("IntersectionObserver" in window)) { itens.forEach(function (e) { if (e.hasAttribute("data-rm")) e.style.display = "none"; else e.classList.add("in"); }); return; }
      limpa();
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting && !rodando) { rodando = true; roda(); }
          else if (!en.isIntersecting && rodando) { rodando = false; limpa(); itens.forEach(function (e) { if (!e.hasAttribute("data-rm")) e.classList.add("in"); }); }
        });
      }, { threshold: 0.3 }).observe(box);
    });
  }

  /* ------------------------------------------------------------------ camadas do Departamento de IA */
  function camadas() {
    var stack = document.querySelector("[data-mx-layers]");
    if (!stack) return;
    var bts = Array.prototype.slice.call(stack.querySelectorAll(".mx-layer"));
    var det = document.querySelector("[data-mx-layer-detail]");
    var i = 0, auto = true, tmr;
    function mostra(n) {
      bts.forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-l") === String(n)); b.setAttribute("aria-pressed", String(b.getAttribute("data-l") === String(n))); });
      var tpl = document.getElementById("mx-layer-" + n);
      if (tpl && det) det.innerHTML = tpl.innerHTML;
    }
    bts.forEach(function (b) { b.addEventListener("click", function () { auto = false; clearInterval(tmr); mostra(b.getAttribute("data-l")); }); });
    mostra(1);
    tmr = setInterval(function () { if (!auto) return; i = (i % 4) + 1; mostra(i); }, 5200);
  }

  /* ------------------------------------------------------------------ calculadora */
  function calculadora() {
    var box = document.querySelector("[data-mx-calc]");
    if (!box) return;
    var p = box.querySelector("#calcPessoas"), h = box.querySelector("#calcHoras"), c = box.querySelector("#calcCusto");
    var outMes = box.querySelector("[data-calc-mes]"), outAno = box.querySelector("[data-calc-ano]"), outHoras = box.querySelector("[data-calc-horas]");
    function num(e) { return Math.max(0, parseFloat(String(e.value).replace(",", ".")) || 0); }
    function calc() {
      var horasMes = num(p) * num(h) * 4.33;
      var custo = horasMes * num(c);
      outHoras.textContent = Math.round(horasMes).toLocaleString("pt-BR") + " horas por mês";
      outMes.textContent = brl(Math.round(custo) * 100);
      outAno.textContent = brl(Math.round(custo * 12) * 100) + " por ano";
    }
    [p, h, c].forEach(function (e) { e.addEventListener("input", calc); });
    calc();
    box.querySelector("[data-calc-cta]").addEventListener("click", function () { track("calculadora_cta", { valor_mes: Math.round(num(p) * num(h) * 4.33 * num(c)) }); });
  }

  /* ------------------------------------------------------------------ workshop: lotes e checkout */
  function workshopLotes() {
    var t = agora(), l = loteEm(t), prox = proximoDe(l);
    document.querySelectorAll("[data-mx-lote-nome]").forEach(function (e) { e.textContent = l ? l.nome : "Vendas encerradas"; });
    document.querySelectorAll("[data-mx-lote-preco]").forEach(function (e) { e.textContent = l ? brl(l.centavos) : "—"; });
    document.querySelectorAll("[data-mx-lote-ate]").forEach(function (e) { e.textContent = l ? ultimoDia(l) : ""; });
    document.querySelectorAll("[data-mx-lote-prox]").forEach(function (e) {
      e.textContent = prox ? "Depois de " + ultimoDia(l) + ", o " + prox.nome + " sobe para " + brl(prox.centavos) + "." : (l ? "Último lote: as vendas online fecham em " + ultimoDia(l) + "." : "");
    });
    document.querySelectorAll(".mx-lot").forEach(function (card) {
      var L = CFG.LOTES[+card.getAttribute("data-lote") - 1], st = card.querySelector(".mx-lot__state");
      card.classList.remove("is-now", "is-past", "is-next");
      if (t >= Date.parse(L.fim)) { card.classList.add("is-past"); st.textContent = "Encerrado"; }
      else if (l && l.lote === L.lote) { card.classList.add("is-now"); st.textContent = "Lote atual"; }
      else { card.classList.add("is-next"); st.textContent = "A partir de " + ddmm(L.inicio); }
    });
    var cnt = document.querySelectorAll("[data-mx-count]");
    if (cnt.length && l) {
      var tick = function () {
        var f = falta(Date.parse(l.fim) - agora());
        cnt.forEach(function (c) {
          c.innerHTML = "<div><b>" + f.d + "</b><span>dias</span></div><div><b>" + pad(f.h) + "</b><span>horas</span></div><div><b>" + pad(f.m) + "</b><span>min</span></div><div><b>" + pad(f.s) + "</b><span>seg</span></div>";
        });
      };
      tick(); setInterval(tick, 1000);
    }
    return l;
  }
  function workshop() {
    if (PAGE !== "workshop") return;
    var l = workshopLotes();
    if (q.get("checkout") === "cancelado") { var n = document.getElementById("mxCancelado"); if (n) n.hidden = false; }
    var f = document.getElementById("mxBuy");
    if (!f) return;
    if (!l) {
      var fechado = document.getElementById("mxFechado");
      if (fechado) { fechado.hidden = false; f.hidden = true; }
      return;
    }
    var tel = f.querySelector('[name="whatsapp"]'); if (tel) mascara(tel);
    var acomp = document.getElementById("mxAcomp");
    function pessoas() { var r = f.querySelector('[name="participantes"]:checked'); return r ? +r.value : 2; }
    function resumo() {
      var n = pessoas(), extras = n - 2, total = l.centavos + extras * CFG.ADICIONAL;
      document.querySelectorAll("[data-sum-lote]").forEach(function (e) { e.textContent = l.nome + " · 2 pessoas"; });
      document.querySelectorAll("[data-sum-base]").forEach(function (e) { e.textContent = brl(l.centavos); });
      document.querySelectorAll("[data-sum-extra-row]").forEach(function (e) { e.hidden = extras === 0; });
      document.querySelectorAll("[data-sum-extra-lbl]").forEach(function (e) { e.textContent = extras + (extras === 1 ? " pessoa adicional" : " pessoas adicionais"); });
      document.querySelectorAll("[data-sum-extra]").forEach(function (e) { e.textContent = brl(extras * CFG.ADICIONAL); });
      document.querySelectorAll("[data-sum-total]").forEach(function (e) { e.textContent = brl(total); });
      document.querySelectorAll("[data-sum-pessoas]").forEach(function (e) { e.textContent = n + " pessoas"; });
      document.querySelectorAll("[data-seg-preco]").forEach(function (e) { var k = +e.getAttribute("data-seg-preco"); e.textContent = brl(l.centavos + (k - 2) * CFG.ADICIONAL); });
      if (acomp) acomp.querySelectorAll("[data-acomp]").forEach(function (e) { e.hidden = +e.getAttribute("data-acomp") > n - 1; });
      return total;
    }
    f.querySelectorAll('[name="participantes"]').forEach(function (r) { r.addEventListener("change", resumo); });
    resumo();
    var out = f.querySelector(".mx-form__msg"), btn = f.querySelector('button[type="submit"]'), txt = btn.innerHTML;
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fd = new FormData(f), d = {};
      fd.forEach(function (v, k) { d[k] = String(v).trim(); });
      var erros = [];
      if (!d.nome || d.nome.length < 3) erros.push("nome");
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email || "")) erros.push("email");
      var dig = (d.whatsapp || "").replace(/\D/g, "");
      if (dig.length < 10 || dig.length > 13) erros.push("whatsapp");
      if (!f.querySelector('[name="aceite"]').checked) erros.push("aceite");
      if (erros.length) {
        marca(f, erros);
        out.className = "mx-form__msg err";
        out.textContent = erros.indexOf("aceite") >= 0 && erros.length === 1 ? "Para seguir, marque que concorda com os termos." : "Confira os campos destacados.";
        return;
      }
      marca(f, []);
      var n = pessoas(), total = resumo();
      var acompanhantes = [];
      ["acomp1", "acomp2", "acomp3"].forEach(function (k, i) { if (i < n - 1 && d[k]) acompanhantes.push(d[k]); });
      btn.disabled = true; btn.innerHTML = "Abrindo o pagamento seguro…";
      out.className = "mx-form__msg"; out.textContent = "";
      fetch(CFG.API + "workshop-checkout", {
        method: "POST", mode: "cors", headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ action: "create", nome: d.nome, email: d.email, whatsapp: dig, empresa: d.empresa || "", cargo: d.cargo || "",
          participantes: n, acompanhantes: acompanhantes, aceite: true, utm: utm() })
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j && res.j.url) {
            track("inicio_checkout", { valor: (res.j.total_centavos || total) / 100, lote: res.j.lote, participantes: n });
            setTimeout(function () { location.href = res.j.url; }, 300);   // dá tempo das tags registrarem o evento
            return;
          }
          throw res.j || {};
        })
        .catch(function (err) {
          btn.disabled = false; btn.innerHTML = txt;
          var det = (err && err.detail) || "Não conseguimos abrir o pagamento agora.";
          if (err && err.error === "dados_invalidos" && err.campos) { marca(f, err.campos); det = "Confira os campos destacados."; }
          out.className = "mx-form__msg err";
          out.innerHTML = det + " Se preferir, <a href='" + waLink(msgDe("workshop", "Quero me inscrever.")) + "' target='_blank' rel='noopener'>finalize pelo WhatsApp</a>.";
        });
    });
    // confere com o relógio do servidor (se o do visitante estiver errado, o preço exibido acompanha o servidor)
    if (!q.get("mx_hoje")) {
      fetch(CFG.API + "workshop-checkout?action=quote").then(function (r) { return r.json(); }).then(function (s) {
        if (!s || !s.agora) return;
        var off = Date.parse(s.agora) - Date.now();
        if (Math.abs(off) > 60000 && s.lote && l && s.lote !== l.lote) {
          try { sessionStorage.setItem("mx_offset", String(off)); } catch (e) {}
          location.reload();
        }
      }).catch(function () {});
    }
  }

  /* ------------------------------------------------------------------ obrigado */
  function ics() {
    var linhas = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Metrix AI//Workshop//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:workshop-ia-20261027@ai.metrixconsultoria.com", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
      "DTSTART:20261027T120000Z", "DTEND:20261027T223000Z", "SUMMARY:Workshop de IA para Empresários — Metrix",
      "LOCATION:Alameda Terracota — Cerâmica\\, São Caetano do Sul/SP",
      "DESCRIPTION:Credenciamento e coffee break às 9h. Início às 9h30. Endereço completo e orientações de chegada enviados pelo WhatsApp.",
      "URL:https://ai.metrixconsultoria.com/workshop-ia/", "END:VEVENT", "END:VCALENDAR"];
    return linhas.join("\r\n");
  }
  function obrigado() {
    if (PAGE !== "workshop-obrigado") return;
    var sid = q.get("session_id") || "";
    var boxes = { carregando: "mxLoading", pago: "mxPago", pendente: "mxPendente", erro: "mxErro" };
    function mostra(k) { for (var b in boxes) { var e = document.getElementById(boxes[b]); if (e) e.hidden = b !== k; } }
    var cal = document.getElementById("mxIcs");
    if (cal) cal.addEventListener("click", function (e) {
      e.preventDefault();
      var blob = new Blob([ics()], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "workshop-ia-metrix-27-10.ics";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sid)) { mostra("erro"); return; }
    var tentativas = 0;
    function confere() {
      tentativas++;
      fetch(CFG.API + "workshop-checkout", { method: "POST", mode: "cors", headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ action: "confirm", session_id: sid }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.status === "pago") {
            document.querySelectorAll("[data-ok-nome]").forEach(function (e) { e.textContent = j.primeiro_nome || ""; });
            document.querySelectorAll("[data-ok-pessoas]").forEach(function (e) { e.textContent = j.participantes + " pessoas"; });
            document.querySelectorAll("[data-ok-lote]").forEach(function (e) { e.textContent = j.lote + "º lote"; });
            document.querySelectorAll("[data-ok-total]").forEach(function (e) { e.textContent = brl(j.total_centavos); });
            var acomp = document.getElementById("mxAcompWa");
            if (acomp) acomp.href = waLink("Olá! Comprei o Workshop de IA de 27/10 (" + j.participantes + " pessoas). Os nomes dos acompanhantes são: ");
            mostra("pago");
            var chave = "mx_compra_" + sid.slice(-12), ja = false;
            try { ja = !!localStorage.getItem(chave); localStorage.setItem(chave, "1"); } catch (e) {}
            if (!ja) track("compra_workshop", { valor: j.total_centavos / 100, lote: j.lote, participantes: j.participantes, transaction_id: sid.slice(-16), event_id: "wk_" + sid.slice(-16) });
          } else if (j.status === "pendente" && tentativas < 8) {
            mostra("pendente"); setTimeout(confere, 5000);
          } else if (j.status === "pendente") {
            mostra("pendente");
          } else { mostra("erro"); }
        })
        .catch(function () { if (tentativas < 3) setTimeout(confere, 3000); else mostra("erro"); });
    }
    mostra("carregando");
    confere();
  }

  /* ------------------------------------------------------------------ links internos com evento */
  function eventos() {
    document.querySelectorAll("[data-mx-evt]").forEach(function (a) {
      if (a.closest("#mx-topbar")) return;
      a.addEventListener("click", function () { track("clique_cta", { destino: a.getAttribute("data-mx-evt") }); });
    });
  }

  function init() {
    testeira(); widget(); ctas(); forms(); conversas(); camadas(); calculadora();
    if (PAGE !== "workshop" && document.querySelector("[data-mx-lote-preco],[data-mx-count],.mx-lot")) workshopLotes();
    workshop(); obrigado(); eventos();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
