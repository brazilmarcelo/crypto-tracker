# Deploy na VPS - Documentação (Portainer & Docker Swarm)

Esta documentação descreve o processo de migração do projeto Next.js (Crypto Tracker) para a VPS utilizando Docker Swarm e Traefik.

## 1. Otimização do Build (Next.js)
- **Standalone Mode:** O arquivo `next.config.js` foi alterado para incluir `output: "standalone"`. Isso gera uma versão super enxuta do Next.js sem depender das pastas originais, ideal para containers menores e mais rápidos.
- **Dockerfile Multi-Stage:** Criado um `Dockerfile` oficial e otimizado com 3 etapas:
  - `deps`: Instala os pacotes do Node.js.
  - `builder`: Roda o Prisma Generate e o Build do Next.js.
  - `runner`: Pega só o que importa (o código compilado) e roda.
  - *Correção Crítica:* Foi adicionado `openssl` na base da imagem Alpine, pois o Prisma exige a biblioteca `libssl` para se comunicar com o banco de dados.

## 2. Docker Hub e Automação
- A imagem deve ser gerada focada na arquitetura da VPS (Hetzner, amd64).
- Comando de Build e Push:
  `docker buildx build --platform linux/amd64 -t aiude/crypto-tracker:latest --push .`
- *Nota de Segurança:* O Dockerfile **não** carrega e nem expõe arquivos locais `.env`. A imagem final não contém senhas.

## 3. Portainer (Stack Configuration)
- O arquivo de modelo `docker.yaml` foi criado para rodar direto no Portainer.
- O ambiente é controlado pelo Traefik (Labels no docker.yaml) que fornece o certificado SSL (HTTPS) automático.
- **Banco de Dados (Importante):** Devido ao Docker Swarm e à rede `network_public`, se a URL do banco estiver configurada como `@postgres:5432`, o Swarm pode rotear o tráfego para qualquer outro banco de dados de outras Stacks na mesma rede. Por isso, usamos o **IP Externo (ou gateway) da VPS** no `DATABASE_URL` para garantir conexão direta e segura com o banco do projeto.

## 4. Reset e Recuperação de Senha
- Caso perca acesso, as senhas do NextAuth utilizam `Bcrypt`.
- Podem ser geradas localmente (usando o comando `node -e "require('bcryptjs').hash('Senha123', 10).then(console.log)"`) e injetadas diretamente na coluna `passwordHash` do PostgreSQL (ex: DBeaver).

*(Atualizado na migração para a Hetzner - 2026)*
