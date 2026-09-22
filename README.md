# Metrix AI — site (ai.metrixconsultoria.com)

Site estático, sem build no servidor. Publicado na VPS Hostinger (nginx) a partir deste repositório.

## Páginas

| Endereço | Arquivo | Papel |
|---|---|---|
| `/` | `index.html` | Home: apresenta a Metrix e distribui para as três frentes |
| `/sdr-ia/` | `sdr-ia/index.html` | Atendimento & SDR com IA, com os 3 planos (destino das campanhas de SDR) |
| `/departamento-de-ia/` | `departamento-de-ia/index.html` | Departamento de IA (4 camadas, calculadora, animação do núcleo) |
| `/workshop-ia/` | `workshop-ia/index.html` | Workshop de IA de 27/10: lotes automáticos e checkout no Stripe |
| `/workshop-ia/obrigado/` | `workshop-ia/obrigado/index.html` | Confirmação do pagamento (não indexada) |
| `/api-oficial/` | `api-oficial/index.html` | Página da campanha de Pesquisa sobre API oficial do WhatsApp |

Ficam **fora** deste repositório e continuam no diretório extra da VPS: `/cadastro/`, `privacidade.html`,
`termos.html` e `exclusao-de-dados.html`.

## Como editar

1. Conteúdo das páginas: `_build/pages/*.html`. Cabeçalho, testeira e rodapé: `_build/partials/`.
2. Rode `python3 _build/build.py` — ele gera os `index.html` acima (não edite os gerados à mão).
3. Commit no `main` e, na VPS: `sudo bash /opt/metrixaisite/redeploy.sh`.

## Configuração (topo de `assets/mx.js`)

- `WA` — número do SDR que recebe os 4 assuntos do botão de WhatsApp (hoje 11 99150-2676).
- `WA_EMPRESA` — empresa dona desse número no AI Connect (hoje a WB.P, onde está a Bea). O clique de anúncio é
  registrado nela, porque o gatilho que casa clique e lead procura na empresa da conversa.
- `GTM_ID` / `PIXEL_ID` — preencher para ligar o Google Tag Manager e o Pixel da Meta.
- `LOTES` e `ADICIONAL` — só para exibição. **O preço cobrado vem da edge function `workshop-checkout`**;
  mudou lote ou preço, mude nos dois lugares.

## Integrações

- Formulários → edge function `site-lead` (Supabase `orxznqmpelrtciiqltfz`) → tabela `metrix.site_leads`, e abre o
  WhatsApp com os dados. O encaminhamento para o CRM entra na própria função.
- Workshop → edge function `workshop-checkout` (quote / create / confirm / reconcile) → Stripe Checkout →
  tabela `metrix.workshop_inscricoes`. Rotina `workshop-reconcile` (pg_cron, a cada 10 min) confirma pagamentos
  que não voltaram pela página de obrigado.
- Eventos no `dataLayer`: `clique_whatsapp` (assunto, origem), `envio_formulario` (interesse), `inicio_checkout`,
  `compra_workshop` (valor, lote, participantes), `clique_testeira`, `clique_cta`.
- Mensagens pré-preenchidas do WhatsApp começam com “Vim pelo site da Metrix AI” (gatilho do roteiro Metrix no
  SDR).
- Visita vinda de anúncio (com UTM, gclid, gbraid, wbraid ou fbclid) é registrada uma vez por sessão na edge
  function `wa-track`, que devolve um código curto. A mensagem do WhatsApp termina com `#m-<código>` e o gatilho
  `metrix.casa_clique_de_anuncio` copia UTM, ids de clique e página de entrada para o lead. Se o código ainda não
  voltou na hora do clique, a mensagem termina com `[ref:<8 últimos caracteres do gclid>]`.

## Conferência rápida

- `?mx_hoje=2026-10-10` na página do workshop simula outra data (só exibição).
- `?interesse=workshop` pré-seleciona o assunto nos formulários.
