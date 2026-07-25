# 🌍 Amaraltour - Agência de Viagens

[![Netlify Status](https://api.netlify.com/api/v1/badges/seu-badge-id/deploy-status)](https://amaraltour.netlify.app)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

> Website moderno e responsivo para agência de viagens com sistema de administração integrado.

[🔗 Ver site ao vivo](https://amaraltour.netlify.app) | [📱 Demo do Admin](#)

## 🎯 Sobre o Projeto

Site institucional desenvolvido para a Amaraltour, agência de viagens de Recife-PE, com foco em experiência do usuário e conversão de leads.

### ✨ Funcionalidades

- 🎨 Design moderno e responsivo
- 🔐 Painel administrativo com autenticação
- 📦 Sistema de gestão de viagens dinâmico
- 🌐 SEO otimizado (sitemap, robots.txt, meta tags)
- ⚡ Performance otimizada (lazy loading, animations)
- 📱 PWA ready (Web App Manifest)
- 🔄 Integração com WhatsApp

### 🛠️ Tecnologias Utilizadas

**Frontend:**

- HTML5 semântico
- CSS3 (Flexbox, Grid, Animations)
- JavaScript ES6+ (Async/Await, Fetch API)
- Intersection Observer API

**Backend/Deploy:**

- Netlify (Hosting + Functions)
- Netlify Blobs (Cloud Storage)
- Serverless Functions (Node.js)

**SEO & Analytics:**

- Google Search Console
- Schema.org structured data
- Open Graph meta tags

## 🚀 Como Executar

### Pré-requisitos

- Navegador moderno
- Editor de código (recomendado: VS Code)

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/amaraltour.git
cd amaraltour
```

2. Abra o projeto

```bash
# Se tiver Live Server no VS Code
code .
# Ou abra index.html diretamente no navegador
```

3. Para rodar localmente com as funções Netlify (opcional):

```bash
npm install netlify-cli -g
netlify dev
```

## 📁 Estrutura do Projeto

amaraltour/
├── assets/
│ └── icons/ # Favicons e ícones
├── imgs/ # Imagens do site
├── paginas-informacoes/ # Páginas secundárias
├── netlify/
│ └── functions/ # Serverless functions
│ └── auth.js # Autenticação admin
├── index.html # Página principal
├── admin.html # Painel administrativo
├── styles.css # Estilos globais
├── script.js # JavaScript principal
├── site.webmanifest # PWA manifest
├── robots.txt # SEO robots
└── sitemap.xml # SEO sitemap

## 🔐 Painel Administrativo

O sistema possui um painel admin protegido por autenticação SHA-256 via Netlify Functions.

**Funcionalidades do Admin:**

- ✅ Adicionar novas viagens
- ✅ Editar viagens existentes
- ✅ Remover viagens
- ✅ Gerenciar status (disponível/esgotado)
- ✅ Upload de imagens

**Acesso:** `/admin.html` (protegido por senha)

## 📊 Performance

- ✅ Lighthouse Score: 90+ (Performance)
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.0s
- ✅ Lazy loading de imagens
- ✅ Minificação de assets

## 🎨 Features Destacadas

### 1. Sistema de Storage Híbrido

```javascript
// Funciona com Netlify Blobs (produção) ou localStorage (dev)
if (window.storage) {
  await window.storage.set("key", data);
} else {
  localStorage.setItem("key", data);
}
```

### 2. Animações Suaves com Intersection Observer

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
    }
  });
});
```

### 3. Autenticação Segura

- Hash SHA-256 client-side
- Validação server-side via Netlify Functions
- Variáveis de ambiente para secrets

## 🌐 Deploy

O projeto está configurado para deploy automático no Netlify:

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente:
   - `ADMIN_PASSWORD_HASH`: Hash SHA-256 da senha admin
3. Deploy automático a cada push na branch `main`

## 📈 Melhorias Futuras

- [ ] Migrar para React/Next.js
- [ ] Implementar testes automatizados (Jest/Cypress)
- [ ] Adicionar sistema de reservas online
- [ ] Integração com gateway de pagamento
- [ ] Dashboard com analytics em tempo real
- [ ] Sistema de reviews/avaliações
- [ ] Multi-idioma (PT/EN/ES)

## 📝 Licença

Este projeto é privado e desenvolvido para uso exclusivo da Amaraltour.

## 👤 Autor

**Seu Nome**

- GitHub: [@LucasFerreiradeFreitaso](https://github.com/LucasFerreiradeFreitas)
- LinkedIn: [Seu Nome](https://linkedin.com/in/lucas-ferreira-freitas/)

## 🙏 Agradecimentos

- Amaraltour pela confiança no projeto
- Comunidade dev pela inspiração
- Netlify pela infraestrutura

---

⭐ **Se este projeto te ajudou de alguma forma, considere dar uma estrela!**
