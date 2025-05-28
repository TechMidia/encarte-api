# Encarte API

API para geração de encartes promocionais de supermercados.

## Principais funcionalidades

- Cadastro de usuários/mercados
- Criação de encartes e upload para Amazon S3
- Consulta e gerenciamento de planos de assinatura
- Busca e remoção de fundo de imagens de produtos
- Integração fácil com n8n e WhatsApp

## Instalação

1. Clone o repositório
2. Instale as dependências:  
   `npm install`
3. Configure o arquivo `.env` (veja o exemplo em `.env.example`)
4. Inicie a API:  
   `npm start`

## Endpoints principais

- `POST /api/cadastrar-usuario`
- `GET  /plano/verificar-plano?telefone=...`
- `GET  /api/imagem-produto?produto=...`
- `POST /criar-encarte`

## Créditos

Desenvolvido por TechMidia Agência e OpenAI GPT-4o.
