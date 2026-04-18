Aqui está o PRD atualizado e estruturado, agora com a arquitetura multi-chain nativa e um stack tecnológico desenhado para alta eficiência, rápida implementação e estabilidade.

---

# Documento de Requisitos de Produto (PRD)

**Nome do Projeto:** [A Definir - ex: OmniTracker / MultiWatch]
**Visão:** O aplicativo definitivo para rastreamento de capital "smart money", permitindo que os usuários monitorem endereços públicos em múltiplas blockchains simultaneamente, com identificação clara das partes e alertas em tempo real.
**Fase:** MVP Multi-Chain

## 1. Escopo Multi-Chain Suportado no MVP
Para cobrir o fluxo de capital atual, o sistema suportará três arquiteturas principais:
* **Redes EVM (Account-based):** Ethereum, Binance Smart Chain (BSC), Polygon, Arbitrum. (Monitoramento de moedas nativas e tokens ERC-20).
* **Ecossistema Solana:** Alta velocidade, com foco pesado em filtragem de *dust/spam* de tokens SPL.
* **Rede Bitcoin (UTXO):** Monitoramento de entradas/saídas baseadas no modelo Unspent Transaction Output.

## 2. Histórias de Usuário (User Stories)
* **Como usuário**, quero colar um endereço de carteira e o sistema deve detectar automaticamente a rede correta (ou me dar opções caso seja EVM compatível).
* **Como usuário**, quero ver o nome da entidade dona da carteira (ex: "Binance: Cold Storage", "Wintermute Trading") em vez de apenas o hash criptográfico.
* **Como usuário**, quero definir regras condicionais para meus alertas (ex: "Avisar no WhatsApp apenas se a saída for maior que $5.000").
* **Como usuário**, quero receber o alerta de forma clara, sabendo a moeda (Token), a rede (Chain) e a direção (In/Out).

## 3. Funcionalidades Principais (Core Features)

### 3.1. Validação e Gestão de Carteiras
* **Regex Engine:** Validação imediata no input (ex: endereços que começam com `0x` para EVM, chaves base58 para Solana, `bc1` para Bitcoin).
* **Agrupamento:** Capacidade de colocar várias carteiras em uma "Pasta" (ex: "Hackers", "Baleias do ETH").

### 3.2. Motor de Identificação (Tagging System)
* Integração com APIs de inteligência (como Arkham ou Moralis) para enriquecer o payload da transação com o nome da corretora, protocolo DeFi ou fundo institucional correspondente.

### 3.3. Sistema de Filtros Antispam
* **Threshold Value (Filtro de Poeira):** Bloqueio automático de notificações para transações de tokens sem liquidez ou valores inferiores a um limite estabelecido pelo usuário, essencial para redes como Solana e Polygon.

---

## 4. Arquitetura e Stack Tecnológico

A infraestrutura foi pensada para ser robusta, conteinerizada e pronta para lidar com o disparo constante de webhooks das redes blockchain, otimizando os custos de mensageria.

| Componente | Tecnologia Escolhida | Justificativa e Função |
| :--- | :--- | :--- |
| **Infraestrutura** | Docker | Todo o ambiente de backend, banco de dados e automação deve ser isolado em containers para rápida implantação e manutenção de servidores. |
| **Orquestração de Dados** | n8n | Atuará como o motor lógico ("cérebro"). Recebe os webhooks brutos das blockchains, filtra os dados, consulta o banco de dados e roteia a mensagem para o usuário. |
| **Banco de Dados** | PostgreSQL | Perfeito para dados relacionais. Armazenará as tabelas de Usuários, Redes, Carteiras Monitoradas (Watchlist) e Regras de Notificação de forma íntegra. |
| **Dados On-Chain** | Tatum ou Moralis | Provedores de nó que oferecem Webhooks unificados para redes EVM, UTXO (Bitcoin) e Solana na mesma API. |
| **Mensageria Automática** | API Oficial do WhatsApp (Meta) | Conexão direta utilizando a Graph API para disparar templates pré-aprovados, garantindo entrega instantânea e evitando bloqueios de contas. |
| **Notificações App** | Firebase Cloud Messaging | Para disparar alertas via Push diretamente no celular. |

---

## 5. Fluxo de Execução do Sistema (Backend Logic)

1.  **Gatilho:** Uma transação ocorre na blockchain envolvendo uma carteira monitorada.
2.  **Webhook:** O provedor (ex: Moralis) dispara um webhook JSON em milissegundos para o endpoint do seu backend.
3.  **Processamento (n8n):** O fluxo intercepta o JSON, limpa os dados brutos (convertendo gwei/satoshi para valores decimais) e identifica o tipo do token.
4.  **Consulta (PostgreSQL):** O sistema checa no banco de dados quem é o usuário que está monitorando aquele endereço e quais são as regras dele (Ex: "Apenas saídas > $1000").
5.  **Enriquecimento:** O sistema consulta a API de Tagging para traduzir os hashes de origem/destino em nomes legíveis.
6.  **Disparo:** O payload formatado é enviado para a Meta Graph API, que entrega a mensagem no WhatsApp do usuário com o layout estruturado.

## 6. Riscos Técnicos e Mitigações

* **Picos de Webhooks (Gargalo de Rede):** Durante grandes quedas ou altas do mercado, o volume de transações dispara.
    * *Mitigação:* Configurar filas no n8n ou utilizar um message broker (como RabbitMQ ou Redis) antes de gravar no PostgreSQL para não sobrecarregar o banco.
* **Custos da API Oficial do Meta:** Notificações disparadas por empresas no WhatsApp têm um custo por janela de 24h.
    * *Mitigação:* Estabelecer limites claros de alertas na camada gratuita do app e oferecer pacotes premium para usuários que precisam de monitoramento ilícito ou de altíssima frequência.
