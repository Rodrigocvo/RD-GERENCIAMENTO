# Guia de Hospedagem - RD Gerenciamento

Este projeto foi construído com React + Vite + Tailwind CSS. Abaixo estão as opções para você colocar seu site no ar:

## 1. Hospedagem no AI Studio (Recomendado para Testes)
- Clique no botão **Share** no canto superior direito.
- Seu app será publicado em uma URL do Google Cloud Run automaticamente.

## 2. Hospedagem na Vercel (Recomendado para Produção)
- Envie seu código para um repositório no **GitHub**.
- No site da [Vercel](https://vercel.com), importe o repositório.
- O arquivo `vercel.json` incluído já configura o roteamento para você.

## 3. Hospedagem no Netlify
- Envie para o GitHub.
- Conecte ao Netlify.
- Comando de Build: `npm run build`
- Diretório de Saída: `dist`

## 4. Hospedagem Própria (Docker)
Se você tiver um servidor VPS (DigitalOcean, Linode, AWS):
1. Certifique-se de ter o Docker instalado.
2. Execute:
   ```bash
   docker build -t rd-gerenciamento .
   docker run -p 80:80 rd-gerenciamento
   ```

## 5. Como gerar os arquivos manualmente
Se quiser apenas os arquivos estáticos para subir via FTP:
- Execute `npm run build` no seu terminal local.
- A pasta `dist` será criada com tudo o que você precisa.
