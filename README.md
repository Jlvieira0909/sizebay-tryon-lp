<div align="center">

# 👗 Sizebay Try-On — Landing Page

**Página-ponte que abre o provador virtual automaticamente e devolve o usuário de onde ele veio.**

Serve como destino para QR codes, links de campanha e integrações que precisam levar alguém direto ao Try-On, sem uma loja em volta.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[**🔗 Ver a página**](https://sizebay-tryon-lp.vercel.app)

</div>

---

## 📖 Sobre o projeto

Normalmente o provador virtual é acionado por um botão dentro da página de produto de uma loja. Mas há casos em que não existe página de produto: um QR code impresso numa vitrine, um link de campanha, um post nas redes sociais, uma demo em evento.

Essa landing page cobre esse cenário. Ela não tem conteúdo próprio — a única coisa que faz é carregar o script do Try-On, esperar o botão aparecer, clicá-lo por conta própria e, quando o usuário fecha o provador, oferecer duas saídas: testar de novo ou voltar para a página de origem.

## 🔄 Os três estados

```
loading                          active                          finished
   │                                │                                │
spinner + nome do produto     "em andamento..."          ┌─ Testar novamente
                                                          └─ Voltar à página anterior
   │                                │                                │
   └── botão do script apareceu ────┘                                │
       → clique automático                                           │
                                    └── iframe fechou ───────────────┘
```

A detecção usa polling a cada 500 ms:

1. **`loading`** — procura o botão dentro de `#szb-tryon-anchor`. Quando encontra, clica.
2. **`active`** — verifica se o `<iframe>` do provador existe. Marca que ele abriu.
3. **`finished`** — o iframe existia e desapareceu, logo o usuário fechou. Mostra as opções.

> A âncora `#szb-tryon-anchor` fica invisível (`opacity: 0`, `pointerEvents: none`). Ela existe apenas para o script ter onde injetar o botão — quem clica é a página, não o usuário.

## 🔗 Parâmetros de URL

A página é configurada pela query string, o que permite gerar um link diferente por produto sem alterar código:

| Parâmetro | Descrição | Padrão |
| --------- | --------- | ------ |
| `title` | Nome do produto exibido na tela de carregamento | `Produto` |
| `sourceUrl` | Destino do botão "Voltar à página anterior" | `/` |

**Exemplo**

```
https://sizebay-tryon-lp.vercel.app/?title=Camiseta%20Oversized&sourceUrl=https://loja.com/camiseta-oversized
```

## ✨ Funcionalidades

- 🤖 **Abertura automática** — nenhum clique necessário para começar
- 🏷️ **Nome do produto na tela de carregamento** via `title`
- 🔁 **Testar novamente** sem recarregar a página
- ↩️ **Volta para a origem** via `sourceUrl`
- 📱 **Layout responsivo** e centralizado, pensado para mobile (o caso principal de QR code)
- ⏳ **Suspense boundary** — `useSearchParams` exige, e o fallback dá um estado de carregamento decente

## 🛠️ Stack

| Tecnologia | Versão | Uso |
| ---------- | ------ | --- |
| [Next.js](https://nextjs.org/) | 16 | Framework React (App Router, `next/script`) |
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização utilitária |

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm, yarn, pnpm ou bun

### Instalação e execução

```bash
git clone https://github.com/Jlvieira0909/sizebay-tryon-lp.git
cd sizebay-tryon-lp
npm install

npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servir o build
npm run lint     # ESLint
```

Abra [http://localhost:3000](http://localhost:3000).

## 📁 Estrutura

```
sizebay-tryon-lp/
├── app/
│   ├── page.tsx      # máquina de estados + âncora + carregamento do script
│   ├── layout.tsx
│   └── globals.css
├── next.config.ts
└── tsconfig.json
```

## ⚙️ Configuração

O tenant está fixo no código, em `app/page.tsx`:

```tsx
<Script
  src="https://static.sizebay.technology/1039/to_prescript.js"
  strategy="afterInteractive"
/>
```

Para apontar para outro tenant, troque o `1039` na URL.

## ⚠️ Observações de implementação

- **A detecção é por polling, não por evento.** O script não expõe callbacks de abertura e fechamento, então a página observa o DOM. Se o provador mudar a estrutura do iframe ou dos seletores do botão, a detecção precisa ser ajustada.
- **A busca do botão usa três seletores** (`> div`, `button`, `a`) dentro da âncora, cobrindo as variações que o script pode renderizar.
- **O intervalo de busca do botão é limpo no unmount**; o de fechamento se encerra ao detectar o fim.

## 🌐 Deploy

Hospedado na [Vercel](https://vercel.com/): **[sizebay-tryon-lp.vercel.app](https://sizebay-tryon-lp.vercel.app)**

---

<div align="center">

Feito com ❤️ por [João Luiz Vieira](https://github.com/Jlvieira0909)

</div>
