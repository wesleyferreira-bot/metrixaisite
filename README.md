# Metrix AI — Site de reposicionamento

Landing page do reposicionamento da Metrix: de "analytics / BI / Data Lake" para
**Inteligência Operacional** — uma empresa de IA aplicada à operação.

A ideia central: a Metrix não vende dados, vende **colaboradores digitais**
(agentes de IA). O **SDR Agent AI** é a porta de entrada; os demais agentes
(Analytics, Attribution, Integration, BI e Executive) são o upsell, todos
sustentados pelo mesmo núcleo — o **Metrix AI Core**.

## Estrutura da página
1. **Hero** — "Sua empresa não precisa de mais um chatbot. Precisa de um colaborador digital." + animação Lead → SDR → CRM → … → CEO.
2. **Não somos um chatbot** — comparação visual chatbot × SDR Agent AI.
3. **Como funciona (cena viva)** — palco animado com núcleo central: 5 cenas
   em loop (Recebe · Entende · Negocia · Executa · Aprende), com partículas
   fluindo dos canais, sinapses acendendo, chat negociando em tempo real,
   checklist executando nos sistemas e dashboard de aprendizado. Etapas
   clicáveis com barra de progresso. Debug: `?hiw=N` (1–5) congela numa cena.
4. **Soluções (3 produtos)** — SDR Agent + CRM com IA (carro-chefe),
   Automação & Sistemas, Dados & Atribuição.
5. **Economia > Faturamento** — "O lucro está escondido na operação."
6. **Infraestrutura** — Metrix AI Core com todos os sistemas em órbita.
7. **Prova** — números animados de impacto.
8. **Soluções que entregamos** — lista sóbria e explicativa, por frente de
   trabalho: atendimento e vendas com IA, integrações e automação, Web
   Analytics, atribuição, banco de dados/Data Lake, BI e inteligência executiva.
9. **CTA final** + rodapé com os slogans do reposicionamento.

## Como rodar
Site estático, sem build. Abra `index.html` no navegador, ou sirva a pasta:

```bash
cd metrix-site
python3 -m http.server 8080
# http://localhost:8080
```

## Arquivos
- `index.html` — marcação e conteúdo (PT-BR).
- `styles.css` — tema escuro, responsivo, animações (respeita `prefers-reduced-motion`).
- `script.js` — reveal on scroll, animação do fluxo, órbita do Core, contadores.
