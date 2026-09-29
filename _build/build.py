#!/usr/bin/env python3
"""Gera as páginas estáticas do site ai.metrixconsultoria.com a partir de _build/pages + _build/partials.

Uso:  python3 _build/build.py
As páginas geradas são HTML puro (o servidor não roda build). Edite o conteúdo em _build/pages/,
o cabeçalho/rodapé em _build/partials/ e rode de novo. Não edite os index.html gerados à mão."""
import json, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
B = ROOT / "_build"
V = datetime.datetime.now().strftime("%Y%m%d%H%M")
FAVICON = (B / "partials/_favicon.txt").read_text().strip()
HEAD = (B / "partials/head.html").read_text()
FOOT = (B / "partials/footer.html").read_text()
OG_BASE = "https://orxznqmpelrtciiqltfz.supabase.co/storage/v1/object/public/site-publico/og/"

INTERESSES = [("sdr_ia", "Atendimento e SDR com IA"), ("departamento_ia", "Departamento de IA"),
              ("workshop", "Workshop de IA — 27/10"), ("suporte", "Já sou cliente — suporte")]

def contato(interesse, pagina, titulo, texto, volume=False):
    opts = "\n".join(f'            <option value="{v}"{" selected" if v == interesse else ""}>{r}</option>' for v, r in INTERESSES)
    vol = ""
    if volume:
        vol = '''        <label class="mx-field"><span>Atendimentos por mês no WhatsApp <em>(opcional)</em></span>
          <select class="mx-select" name="volume"><option value="">Selecione</option><option>Até 300</option><option>300 a 1.000</option><option>1.000 a 5.000</option><option>Mais de 5.000</option></select>
        </label>
'''
    return f'''  <section class="section" id="contato">
    <div class="mx-contact">
      <div class="reveal">
        <span class="eyebrow">Fale com a gente</span>
        <h2 class="section__title">{titulo}</h2>
        <p class="section__lead">{texto}</p>
        <ul class="mx-list mx-list--light" style="margin-top:22px">
          <li>Resposta em segundos pelo WhatsApp, 24 horas</li>
          <li>Diagnóstico sem compromisso</li>
          <li>Seus dados usados só para este contato</li>
        </ul>
        <div class="mx-actions" style="margin-top:26px">
          <a class="btn btn--wa" href="#contato" data-mx-wa="{interesse}" data-mx-origem="contato"><i class="mx-ic mx-ic--wa" aria-hidden="true"></i>Chamar no WhatsApp</a>
        </div>
      </div>
      <div class="mx-form-card reveal">
        <h3>Prefere que a gente chame você?</h3>
        <p class="mx-small">Leva 30 segundos. A conversa continua no WhatsApp.</p>
        <form class="mx-form" data-mx-form="{pagina}" novalidate>
          <label class="mx-field">Sobre o que você quer falar?
            <select class="mx-select" name="interesse" required>
{opts}
            </select>
          </label>
          <div class="mx-row">
            <label class="mx-field">Nome<input class="mx-input" name="nome" autocomplete="name" required /></label>
            <label class="mx-field">Empresa<input class="mx-input" name="empresa" autocomplete="organization" /></label>
          </div>
          <div class="mx-row">
            <label class="mx-field">WhatsApp com DDD<input class="mx-input" name="whatsapp" inputmode="tel" autocomplete="tel" placeholder="(11) 90000-0000" required /></label>
            <label class="mx-field"><span>E-mail <em>(opcional)</em></span><input class="mx-input" name="email" type="email" autocomplete="email" /></label>
          </div>
{vol}          <label class="mx-field"><span>Mensagem <em>(opcional)</em></span><textarea class="mx-textarea" name="mensagem" rows="3" placeholder="Conte rapidamente o que você precisa"></textarea></label>
          <div class="mx-hp" aria-hidden="true"><label>Não preencha<input name="website" tabindex="-1" autocomplete="off" /></label></div>
          <button class="btn btn--primary" type="submit">Enviar e abrir o WhatsApp</button>
          <div class="mx-form__msg" role="status" aria-live="polite"></div>
          <p class="mx-small">Seus dados são usados só para este contato. <a href="/privacidade.html">Política de privacidade</a>.</p>
        </form>
      </div>
    </div>
  </section>'''

ORG = {"@context": "https://schema.org", "@type": "Organization", "name": "Metrix AI — Metrix Consultoria",
       "url": "https://ai.metrixconsultoria.com/", "description": "Atendimento, SDR e Departamento de IA para empresas.",
       "address": {"@type": "PostalAddress", "streetAddress": "Alameda Terracota, 185, sala 708", "addressLocality": "São Caetano do Sul",
                   "addressRegion": "SP", "postalCode": "09531-190", "addressCountry": "BR"}}
EVENT = {"@context": "https://schema.org", "@type": "Event", "name": "Workshop de IA para Empresários",
         "description": "Workshop presencial e básico para empresários: Claude, Lovable e Codex na prática, agentes, skills, automações e mesas de aplicação.",
         "startDate": "2026-10-27T09:00:00-03:00", "endDate": "2026-10-27T19:30:00-03:00",
         "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode", "eventStatus": "https://schema.org/EventScheduled",
         "location": {"@type": "Place", "name": "São Caetano do Sul/SP",
                      "address": {"@type": "PostalAddress", "streetAddress": "Alameda Terracota", "addressLocality": "São Caetano do Sul",
                                  "addressRegion": "SP", "addressCountry": "BR"}},
         "image": [OG_BASE + "workshop.jpg"],
         "organizer": {"@type": "Organization", "name": "Metrix AI", "url": "https://ai.metrixconsultoria.com/"},
         "performer": [{"@type": "Person", "name": n} for n in ["Wesley Coelho", "Clóvis Souza", "Alex Pinhol", "Beatriz Castro", "Juliana Cavalcanti"]],
         "offers": {"@type": "Offer", "url": "https://ai.metrixconsultoria.com/workshop-ia/", "price": "849", "priceCurrency": "BRL",
                    "availability": "https://schema.org/InStock", "validFrom": "2026-09-22T00:00:00-03:00"}}

PAGES = [
    dict(src="home.html", out="index.html", page="home", interesse="sdr_ia", path="/",
         title="Metrix AI — Atendimento, SDR e Departamento de IA para empresas",
         og="IA que atende, vende e organiza a sua empresa",
         desc="A Metrix monta times de atendimento e SDR com IA no WhatsApp, Instagram e ligação, e o Departamento de IA com dados, automações e relatórios. Workshop de IA em 27/10.",
         img="home.jpg", jsonld=ORG,
         contato=("sdr_ia", "home", "Vamos colocar a IA para trabalhar na sua empresa?", "Conte o que você precisa. Se quiser, teste agora o nosso SDR com IA no WhatsApp — é o mesmo atendimento que os seus clientes vão ter.", True)),
    dict(src="sdr.html", out="sdr-ia/index.html", page="sdr-ia", interesse="sdr_ia", path="/sdr-ia/", cur="SDR",
         title="Atendimento e SDR com IA no WhatsApp | Metrix AI",
         og="Seu time de atendimento e SDR com IA, montado pela Metrix",
         desc="IA que responde em segundos, qualifica, agenda a reunião e manda o convite. WhatsApp, Instagram e ligação. Planos a partir de R$ 997/mês.",
         img="sdr.jpg",
         contato=("sdr_ia", "sdr-ia", "Quer ver o SDR funcionando no seu caso?", "Converse com o nosso SDR agora ou deixe seus dados que a gente chama você para um diagnóstico.", True)),
    dict(src="departamento.html", out="departamento-de-ia/index.html", page="departamento-ia", interesse="departamento_ia", path="/departamento-de-ia/", cur="DEPTO",
         title="Departamento de IA para empresas | Metrix AI",
         og="Um Departamento de IA inteiro, sem montar um do zero",
         desc="Dados em um só lugar, IAs conectadas aos seus sistemas, automações rodando e relatórios pedidos por mensagem. Financeiro, RH, vendas e marketing.",
         img="departamento.jpg",
         contato=("departamento_ia", "departamento-ia", "Por onde começar na sua empresa?", "Conte como funciona a sua operação hoje. No diagnóstico, mostramos onde a IA dá mais retorno primeiro.", False)),
    dict(src="workshop.html", out="workshop-ia/index.html", page="workshop", interesse="workshop", path="/workshop-ia/", cur="WS",
         title="Workshop de IA para Empresários — 27/10 em São Caetano do Sul | Metrix AI",
         og="Workshop de IA para Empresários — 27/10, São Caetano do Sul",
         desc="Um dia presencial para entender e aplicar IA no seu negócio: Claude, Lovable, Codex, agentes, automações e mini consultoria. Inscrição vale para 2 pessoas.",
         img="workshop.jpg", jsonld=EVENT, contato=None),
    dict(src="obrigado.html", out="workshop-ia/obrigado/index.html", page="workshop-obrigado", interesse="workshop", path="/workshop-ia/obrigado/", cur="WS",
         title="Inscrição no Workshop de IA | Metrix AI", og="Workshop de IA para Empresários — 27/10",
         desc="Confirmação da inscrição no Workshop de IA para Empresários.", img="workshop.jpg", robots="noindex", contato=None, contato_href="/#contato"),
    dict(src="api-oficial.html", out="api-oficial/index.html", page="api-oficial", interesse="sdr_ia", path="/api-oficial/",
         title="API Oficial do WhatsApp para empresas | Metrix AI",
         og="API oficial do WhatsApp configurada para a sua empresa",
         desc="Número da sua empresa na API oficial do WhatsApp, configurado pela Metrix: conta na Meta, modelos, vários atendentes e IA opcional.",
         img="sdr.jpg",
         contato=("sdr_ia", "api-oficial", "Pronto para ter um WhatsApp oficial?", "Fale com um especialista e entenda o melhor caminho para o seu número.", True)),
]

def build():
    for p in PAGES:
        body = (B / "pages" / p["src"]).read_text()
        if p.get("contato"):
            body = body.replace("{{CONTATO_BLOCK}}", contato(*p["contato"]))
        else:
            body = body.replace("{{CONTATO_BLOCK}}", "")
        cur = p.get("cur", "")
        head = HEAD
        rep = {
            "{{TITLE}}": p["title"], "{{DESC}}": p["desc"], "{{PATH}}": p["path"], "{{OG_TITLE}}": p["og"],
            "{{OG_IMAGE}}": f'<meta property="og:image" content="{OG_BASE}{p["img"]}" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />\n',
            "{{ROBOTS}}": '<meta name="robots" content="noindex" />\n' if p.get("robots") else "",
            "{{FAVICON}}": FAVICON, "{{V}}": V, "{{PAGE}}": p["page"], "{{INTERESSE}}": p["interesse"],
            "{{CUR_SDR}}": ' aria-current="page"' if cur == "SDR" else "",
            "{{CUR_DEPTO}}": ' aria-current="page"' if cur == "DEPTO" else "",
            "{{CUR_WS}}": ' aria-current="page"' if cur == "WS" else "",
            "{{CONTATO}}": p.get("contato_href", "#contato"),
            "{{JSONLD}}": ('<script type="application/ld+json">' + json.dumps(p["jsonld"], ensure_ascii=False) + "</script>\n") if p.get("jsonld") else "",
        }
        for k, v in rep.items():
            head = head.replace(k, v)
        foot = FOOT.replace("{{V}}", V)
        html = head + "\n" + body + "\n" + foot
        assert "{{" not in html, (p["out"], html[html.index("{{"):html.index("{{") + 40])
        out = ROOT / p["out"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print(f"ok {p['out']:40s} {len(html):>7} bytes")
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in PAGES:
        if p.get("robots"): continue
        sitemap.append(f"  <url><loc>https://ai.metrixconsultoria.com{p['path']}</loc></url>")
    sitemap.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sitemap) + "\n")
    (ROOT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /_build/\nDisallow: /workshop-ia/obrigado/\nSitemap: https://ai.metrixconsultoria.com/sitemap.xml\n")
    print("ok sitemap.xml robots.txt")

if __name__ == "__main__":
    build()
