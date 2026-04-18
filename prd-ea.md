## Visão Geral do Produto
- Descrição concisa  
  Aplicação web para rastrear carteiras de criptomoedas por moeda e endereço, listar todas as transações de entrada/saída, identificar contraparte (nome de carteira/exchange quando possível) e enviar alertas configuráveis por e-mail, push (web/mobile) ou WhatsApp. Usuário pode filtrar por tipo (in/out), moeda, valores e receber histórico e notificações em tempo real.

- Público-alvo  
  Traders, gestores de tesouraria, pesquisadores de blockchain, analistas de compliance, entusiastas cripto que monitoram carteiras próprias ou de terceiros (observabilidade pública on‑chain).

- Proposta de valor única  
  Combina rastreamento multi-chain em tempo real, identificação contextual de contrapartes (exchanges/wallets conhecidas) e um sistema de alertas multimodal altamente configurável com regras por moeda, tipo (entrada/saída) e thresholds, entregando sinais acionáveis por canais preferidos (email, push, WhatsApp).

## Requisitos Funcionais
- Liste todos os requisitos principais

  1. Cadastro de usuário e autenticação segura (MFA).
  2. Adicionar/gerenciar carteiras: selecionar blockchain, inserir endereço, nomear etiqueta.
  3. Suporte multi-chain (inicial: Ethereum, Bitcoin, BSC, Solana; extensível).
  4. Exibir histórico completo de transações da carteira (hash, timestamp, tipo in/out, valor bruto, token, taxa, saldo antes/depois).
  5. Normalização de transações entre chains/tokens (conversão para moeda fiat opcional).
  6. Identificação/rotulação de contrapartes (nome da carteira/corretora quando disponível).
  7. Configuração de alertas por carteira: canal (email, push web/mobile, WhatsApp), tipo (entrada/saída/both), valor mínimo, token, regras de agregação (debounce/batching).
  8. Envio de notificações confiáveis com retries, deduplicação e logs.
  9. Centro de notificações na UI com histórico e ações rápidas (marcar como lida, silenciar).
  10. Filtros e buscas por endereço, token, hash, data, valor.
  11. Painel (dashboard) com visão agregada: carteiras monitoradas, notificações recentes, saldo total por moeda/fiat.
  12. Webhooks e API para integrações externas (push de alertas).
  13. Preferências e limites de polling/streaming por usuário (para controle de custos).
  14. Exportar histórico (CSV/JSON).
  15. Logs e auditoria de alertas disparados.
  16. Suporte a preferências de privacidade (ocultar valores, anonimizar endereços).
  17. Gestão de etiquetas/endpoints conhecidos (address book) com listagem de exchanges e entidades.
  18. Suporte a rate-limiting e proteção contra abuso (CAPTCHA, limits).
  19. Painel admin para ver métricas, filas de notificação e health checks.
  20. Suporte a preferências de acessibilidade (prefers-reduced-motion, contraste).

- Priorize usando MoSCoW

  Must have
  - Autenticação segura com MFA.
  - Adicionar/gerenciar carteiras por blockchain e endereço.
  - Exibição histórica de transações por carteira (hash, data, tipo, valor).
  - Notificações por e-mail, push web/mobile.
  - Filtragem por in/out, token e valor.
  - Integrações com APIs de blockchain (ex: Etherscan, Alchemy/Moralis/QuickNode) para puxar transações.
  - Identificação básica de contrapartes usando listas públicas de exchanges e heurísticas.
  - Centro de notificações na UI.
  - Export CSV/JSON.
  - Logs de alertas e retries.

  Should have
  - Notificações via WhatsApp (Twilio/WhatsApp Business API).
  - Suporte multi-chain extensível (Bitcoin, Solana, BSC).
  - Webhooks/API para integração com sistemas externos.
  - Conversão fiat (com API de preços) e thresholds baseados em fiat.
  - Preferências de deduping e batching de notificações.
  - Painel admin e health checks.

  Could have
  - Integração com provedores de enriquecimento (Nansen, Chainalysis) para rotulação avançada.
  - Mobile app nativo com push via FCM/APNs.
  - Etiquetamento colaborativo e crowdsourced das contrapartes.
  - Visualizações de fluxo de fundos (sankey simplificado).
  - Integração com Liveness / alerts via Telegram/Slack.
  - Geolocalização heurística de exchanges.

  Won't have (para MVP)
  - Indexador on‑chain proprietário completo (rodar nós completos) — usar provedores.
  - Suporte a smart-contract analytics complexos (por exemplo, decoding avançado de contratos múltiplos) — post‑MVP.
  - Serviços de compliance de alto nível (investigações automatizadas com cadeia de custódia legal).

## Histórias de Usuário
- Formato: Como [tipo de usuário], eu quero [ação] para [benefício]

  1. Como usuário, eu quero adicionar um endereço de carteira e selecionar a moeda para que eu possa começar a monitorar suas transações.
  2. Como usuário, eu quero ver todas as transações de entrada e saída de uma carteira para auditar movimentações.
  3. Como analista, eu quero receber alertas por e-mail quando houver uma saída acima de X USD de uma carteira monitorada para reagir rapidamente.
  4. Como trader, eu quero configurar alertas somente para entradas (in) para saber quando fundos chegam.
  5. Como gestor, eu quero que cada transação mostre onde foi enviada (nome da exchange/carteira se conhecido) para avaliar contraparte.
  6. Como usuário móvel, eu quero receber push notifications em tempo real para não perder movs importantes.
  7. Como usuário, eu quero filtrar o histórico por token e por período para facilitar auditoria.
  8. Como integrador, eu quero receber webhooks quando um alerta ocorrer para acionar sistemas automatizados.
  9. Como admin, eu quero ver métricas de fila e de envio para monitorar performance do sistema de notificações.
  10. Como usuário preocupado com privacidade, eu quero ocultar valores e endereços na interface pública.

## Estrutura de Páginas/Seções
- Hierarquia de navegação

  - Header global: Logo | Busca global (Cmd/Ctrl+K) | Notifications icon | Perfil (avatar)  
  - Barra lateral (esquerda): Dashboard | Carteiras | Alertas | Histórico / Feed | Etiquetas / Address Book | Integrações | Configurações  
  - Principal (conteúdo): páginas conforme seleção da barra lateral.

- Wireframes em texto para cada página principal

  1. Dashboard ("/dashboard")  
     - Top: Painel resumo com cards (Total de carteiras monitoradas, Alertas recentes, Valor total por moeda, Última atividade).  
     - Meio: Gráfico de atividade recente (últimas 24h / 7d) e lista das carteiras pinnadas.  
     - Rodapé: Quick actions: +Adicionar carteira, Criar alerta, Importar lista.

  2. Carteiras ("/wallets") — lista e visão geral  
     - Search + filtros (moeda, tag, ativo/inativo).  
     - Lista em tabela/tiles: Nome da carteira (apelido), endereço truncado, moedas+saldo, últimas 3 transações (mini), botão Detalhes/Alertas.  
     - Ação rápida: silenciar/notificar/editar.

  3. Detalhe da Carteira ("/wallets/:id")  
     - Header: Nome da carteira, endereço completo (copy), cadeia, botão “Criar alerta” e “Exportar”.  
     - Left column: Saldo por token (com opção fiat), gráfico de saldo ao longo do tempo.  
     - Right column: Feed de transações (in/out) paginado com filtros (in/out, token, mínimo). Cada item mostra hash (link explorer), timestamp, valor, taxa, contraparte (nome + endereço se conhecido), botão “Marcar / adicionar etiqueta”.  
     - Animação ao receber nova transação: highlight da linha + badge “novo”.

  4. Alertas ("/alerts")  
     - Lista de regras de alerta por carteira/token. Cada card: tipo (in/out), canal(s), threshold, status (ativo/silenciado).  
     - Botão “Novo alerta” abre modal wizard (selecionar carteira -> tipo -> canais -> thresholds -> policies de batching).  
     - Testar alerta (botão para enviar notificação de exemplo).

  5. Notificações / Centro de Alertas ("/notifications")  
     - Timeline de notificações recebidas com filtros por canal, carteira e status.  
     - Ações: marcar lidas, abrir transação, silenciar carteira, exportar.

  6. Integrações ("/integrations")  
     - Configurar provedores de blockchain (API keys: Alchemy, QuickNode, Moralis, Etherscan).  
     - Configurar canais de envio (SendGrid, Twilio/WhatsApp, FCM, Web Push).  
     - Webhooks: keys e endpoints com logs.

  7. Address Book / Etiquetas ("/labels")  
     - Lista de endereços rotulados (exchange, serviço, contrato). Botões editar / confirmar proveniência.

  8. Configurações ("/settings")  
     - Perfil, Billing, Preferências de notificações globais, Segurança (MFA), Privacidade (ocultar valores), Limites de polling.

## Design e Interações
- Paleta de cores sugerida  
  - Primária: Deep Teal #006D6A (confiabilidade / cripto-tech)  
  - Secundária: Gradient teal → indigo (para gráficos)  
  - Accent (sucesso): Mint Green #2FE6A6  
  - Accent (aviso): Warm Amber #FFB545  
  - Fundo: Dark slate / off-white alternável (modo escuro/ claro)  
  - Neutros: #0F1724 (texto escuro), #F7FAFC (fundo claro), #E6EEF2 (borders)

- Tipografia  
  - Títulos: Inter / Space Grotesk (sem serifa, legível, moderno).  
  - Corpo: Inter Regular 16px, Line-height 1.4.  
  - Monospace para hashes/endereços: JetBrains Mono ou Roboto Mono (12-13px).

- Animações e microinterações (detalhadas com implementação técnica)
  1. Transição entre páginas (layout)  
     - Técnica: Framer Motion AnimatePresence para React/Next.js.  
     - Variantes: initial { opacity: 0, y: 10 }, animate { opacity:1, y: 0 }, exit { opacity: 0, y: -10 }  
     - Transition: type: "spring", stiffness: 100, damping: 14, duration fallback 0.4s.  
     - Implementação: envolver <main> com <AnimatePresence> e usar layoutId para elementos persistentes (ex: cartão de carteira) para morphing suave.

  2. Nova transação (linha de feed) — highlight e pulse
     - Técnica: CSS keyframes + Framer Motion or GSAP for timeline.  
     - Behavior: ao inserir nova transação, aplicar animação de introdução: background-color animado de #E6FFF5 -> transparent por 2.5s + slight scale (1.02 -> 1).  
     - Framer Motion variant: initial { opacity: 0, x: 20 }, animate { opacity: 1, x: 0, backgroundColor: ["#E6FFF5", "transparent"] }, transition: { duration: 1.8, ease: "easeOut" }  
     - Accessibility: respeitar prefers-reduced-motion (desabilitar animação e usar simples highlight estático).

  3. Toast de notificação (in-app)  
     - Técnica: Framer Motion + aria-live region.  
     - Enter: slide from top-right (x: 20 -> 0) + fade, duration 300ms, ease: cubic-bezier(.2,.9,.3,1).  
     - Exit: fade + slide x: 0 -> 20, duration 200ms.  
     - Dismiss: swipe to dismiss no mobile (drag="x" with dragConstraints and onDragEnd threshold).

  4. Modal wizard (criar alerta)  
     - Técnica: Framer Motion modal scale + backdrop fade.  
     - Initial: scale 0.96, opacity 0. Backdrop opacity 0 -> 0.5. Transition: duration 240ms, ease: easeOut.  
     - Wizard step transitions: slide horizontally with shared layout to maintain context.

  5. Dashboard metric counters (number animations)  
     - Técnica: lightweight JS tween (GSAP or react-spring) animando numeric value to target on mount.  
     - Duration: 800–1200ms with easeOut.

  6. Button microinteractions  
     - Technique: CSS transform + Framer Motion whileTap and whileHover. Hover: translateY -2px, box-shadow grow; whileTap: scale 0.98, short 120ms.

  7. Search/Filter instant feedback  
     - Technique: debounced animated list updates with layout animation (Framer Motion's AnimateSharedLayout or layout prop) to smoothly reorder items.

  8. Lottie for onboarding / empty states  
     - Technique: Lottie Web (react-lottie-player) com autoplay looped small illustrations; fallback static SVG if prefers-reduced-motion.

  9. Complex timeline animations (visualização de fluxo de fundos)  
     - Técnica: GSAP timelines para animar path stroke, staggering nodes; usar SVG with strokeDashoffset for flow animation.

  10. High-frequency event batching UX  
     - Quando múltiplas transações chegam, usar microinteraction que agrega (badge + “5 novas transações”) com expand/accordion animado (height auto animation via Framer Motion).

- Bibliotecas recomendadas  
  - Framer Motion: para animações declarativas React (page transitions, list reorders).  
  - GSAP: para timelines SVG complexos e sequências com fine control (morphing).  
  - Lottie (bodymovin): para animações vetoriais complexas (onboarding/empty states).  
  - react-use-gesture + @use-gesture for gestures (drag to dismiss).  
  - CSS variables + prefers-reduced-motion detection para acessibilidade.  
  - Tailwind CSS + Headless UI (componentes acessíveis) ou design system customizado.  
  - Intersection Observer para lazy-loading de items longos e triggering animations on view.

## Considerações Técnicas
- Stack tecnológica sugerida
  - Frontend: React + Next.js (SSR/SSG híbrido), TypeScript, Tailwind CSS, Framer Motion, react-query / SWR para data fetching.  
  - Backend: Node.js + TypeScript, NestJS or Express, GraphQL (Apollo) ou REST (Fastify).  
  - Database: PostgreSQL (relacional para usuários, alert rules, labels), Redis (caching, rate limiting, pub/sub).  
  - Queue / Workers: BullMQ (Redis) para processamento de eventos e envio de notificações.  
  - Realtime: WebSockets via socket.io or server-sent events (SSE) para updates em tempo real. Alternativa: utilizar Push providers (Alchemy, Moralis Streams, QuickNode Streams) para streaming on‑chain.  
  - Storage: S3 para exports/logs.  
  - Monitoring: Sentry, Prometheus + Grafana, logs estruturados (Elastic/Datadog).  
  - Deploy: Kubernetes ou Vercel (frontend) + Cloud run/containers para backend.

- Integrações necessárias
  - Provedores de dados on-chain (escolher 2+ como fallback): Alchemy, Infura, QuickNode, Moralis, Etherscan API (para Ethereum), Blockchair (multi-chain), Solana RPC providers.  
  - Price feeds: CoinGecko / CoinMarketCap API para conversões fiat.  
  - Enriquecimento/labels: listas públicas de endereços (exchanges) + opcional parceiros pagos (Nansen, Chainalysis) para identificação avançada.  
  - Notificações:  
    - Email: SendGrid, Postmark, Amazon SES.  
    - WhatsApp: Twilio / WhatsApp Business API (via provider) com fallback SMS.  
    - Push web/mobile: Firebase Cloud Messaging (FCM) para mobile, Web Push (Service Workers) para browser.  
  - Webhooks/API: endpoints para recepção e envio de alertas integráveis.  
  - Auth: Auth0 / NextAuth / chave JWT + MFA (TOTP/Authenticator) e suporte a SSO para enterprise.

- Requisitos de performance
  - Tempo de entrega das notificações crítico (meta: <10s para eventos em streaming; <60s para polling).  
  - Caching: cache de endereço -> metadata (labels) em Redis (TTL configurável).  
  - Polling vs streaming: onde possível usar streaming (webhooks/providers). Polling interval configurável por usuário com limites mínimos no free tier (ex: 60s) e menor para planos pagos.  
  - Escalabilidade: workers horizontais para processar bursts de eventos on‑chain (exchanges e grandes wallets geram spikes).  
  - Rate limits e backoff: implementar retry exponential backoff para API providers e limitações de envio para canais (WhatsApp/Twilio).  
  - Throughput: sistema deve suportar dezenas de milhares de wallets monitoradas; dimensionar filas e workers conforme SLAs.  
  - Idempotência: processar eventos usando event hash de transação para impedir duplicação de alertas.  
  - Segurança: TLS obrigatório, criptografia em repouso para dados sensíveis, rotação de keys, secrets no Vault (HashiCorp).  
  - Auditoria: manter logs de eventos e envios por 90 dias (configurável) para troubleshooting.

## Roadmap Sugerido
- MVP (Fase 1)
  - Autenticação básica com email + senha e MFA.
  - Página Dashboard, adicionar carteiras (Ethereum + Bitcoin), listagem de transações via provedores (Etherscan/Blockchair).
  - Feed de transações por carteira com filtros in/out e botão Export CSV.
  - Sistema de alertas básico: e-mail + web push, por carteira e tipo (in/out), threshold por valor.
  - Notificações em tempo quase real usando provider de streaming (Alchemy/Moralis) com fallback polling.
  - Center de notificações in-app.
  - Logs de envio simples e retries.
  - Integrações iniciais: SendGrid, FCM, Alchemy/Etherscan.
  - Design system básico + animações principais (page transitions, new-transaction highlight, toasts) implementadas com Framer Motion.
  - Infra: PostgreSQL, Redis, BullMQ, Node backend.

- Melhorias futuras (Fase 2)
  - Adição de mais chains (BSC, Solana, Polygon) e normalização multi-token.
  - WhatsApp via Twilio e webhooks para integrações externas.
  - Identificação avançada de contrapartes com listas públicas enriquecidas e integração opcional com provedores pagos.
  - Dashboard avançado com conversão fiat, gráficos de fluxo e análise básica (sankey).
  - Regras avançadas de alerta (agregação, deduping, windows de tempo, thresholds baseados em fiat).
  - Mobile app nativo (React Native/Flutter) com push via APNs/FCM.
  - Painel admin e auto-scaling de workers, alertas de saúde.
  - Export e retenção configurável, roles/permissions enterprise.

- Visão de longo prazo (Fase 3)
  - Indexador próprio/on‑chain crawler para latência ultra baixa e independência de provedores externos; suporte a queries customizadas e analytics avançado.  
  - Integrações de compliance e investigação (parcerias com Chainalysis/Nansen) para rotulação automatizada e detecção de padrões suspeitos.  
  - Marketplace de etiquetas colaborativas e modelos de enrichment (crowdsourced + premium).  
  - Funcionalidades cooperativas: compartilhar “watchlists” entre equipes, alertas condicionais cross-wallet (ex: se Wallet A transferir >X para Exchange Y dentro de 24h).  
  - Modelos pagos com SLAs (tempo de notificação, volume de polling) e integração SSO/SCIM para grandes clientes.  
  - Módulo de automação (webhooks + actions) para executar playbooks (ex: liquidar posição, acionar bot) com logs e reversibilidade.