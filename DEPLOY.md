# GlicoBem - Guia de Deploy

## 📱 PWA (Progressive Web App)

Esta aplicação está configurada como uma PWA completa com:

### ✅ Recursos PWA Implementados
- **Manifest.json** - Configuração completa da aplicação
- **Service Worker** - Cache offline e sincronização em background
- **Ícones PWA** - Ícones para diferentes tamanhos de tela
- **Meta tags** - Configuração para iOS e Android
- **Cache Strategy** - Cache first com fallback para network
- **Offline Support** - Funciona sem conexão com internet
- **Install Prompt** - Pode ser instalada como app nativo

### 🔧 Configurações PWA
- **Nome**: GlicoBem: Receitas para Diabéticos
- **Nome Curto**: GlicoBem
- **Tema**: #10b981 (Verde)
- **Display**: Standalone (tela cheia)
- **Orientação**: Portrait
- **Idioma**: pt-BR

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Repositório Git (GitHub, GitLab, Bitbucket)
3. Variável de ambiente `GEMINI_API_KEY`

### Passos para Deploy

#### 1. Preparar o Repositório
```bash
# Fazer commit de todas as alterações
git add .
git commit -m "Configuração PWA e deploy Vercel"
git push origin main
```

#### 2. Configurar no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe seu repositório
4. Configure as variáveis de ambiente:
   - `GEMINI_API_KEY`: Sua chave da API do Google Gemini

#### 3. Configurações Automáticas
O arquivo `vercel.json` já está configurado com:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- Redirecionamentos para SPA
- Headers de segurança
- Cache otimizado

#### 4. Deploy
O deploy acontece automaticamente após a configuração.

### 🔒 Variáveis de Ambiente

No painel do Vercel, adicione:
```
GEMINI_API_KEY=sua_chave_aqui
```

### 📊 Otimizações Implementadas

#### Build Otimizado
- **Minificação**: Terser para JS/CSS
- **Tree Shaking**: Remoção de código não utilizado
- **Code Splitting**: Chunks separados para vendor e Gemini
- **Compressão**: Gzip automático no Vercel

#### Performance
- **Cache Headers**: Cache longo para assets estáticos
- **Service Worker**: Cache inteligente
- **Lazy Loading**: Carregamento sob demanda
- **Bundle Analysis**: Script para análise de tamanho

#### Segurança
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Proteção contra XSS
- **Frame Options**: Proteção contra clickjacking
- **HTTPS**: Forçado automaticamente no Vercel

## 🧪 Testes Locais

### Testar PWA Localmente
```bash
# Build da aplicação
npm run build

# Servir localmente
npm run preview
```

### Testar Service Worker
1. Abra as DevTools (F12)
2. Vá para a aba "Application"
3. Verifique "Service Workers" e "Manifest"
4. Teste offline na aba "Network"

### Testar Instalação PWA
1. Abra a aplicação no Chrome/Edge
2. Procure pelo ícone de "Instalar" na barra de endereços
3. Ou use o menu "Instalar aplicativo"

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Samsung Internet 12+

### Dispositivos
- ✅ Android 7+
- ✅ iOS 13+
- ✅ Desktop (Windows, macOS, Linux)

## 🔍 Monitoramento

### Métricas Importantes
- **Lighthouse Score**: Deve ser 90+ em todas as categorias
- **Core Web Vitals**: LCP, FID, CLS otimizados
- **PWA Score**: 100% no Lighthouse
- **Performance**: Carregamento < 3s

### Ferramentas de Análise
- Vercel Analytics (automático)
- Google PageSpeed Insights
- Lighthouse CI
- Web.dev Measure

## 🆘 Troubleshooting

### Problemas Comuns

#### Service Worker não registra
- Verifique se está servindo via HTTPS
- Confirme que o arquivo `sw.js` está acessível
- Limpe o cache do navegador

#### PWA não instala
- Verifique o manifest.json
- Confirme que tem ícones válidos
- Teste em modo incógnito

#### Build falha no Vercel
- Verifique as variáveis de ambiente
- Confirme que todas as dependências estão no package.json
- Verifique os logs de build no painel do Vercel

### Comandos Úteis
```bash
# Limpar cache e reinstalar
npm run clean
npm install

# Verificar tipos TypeScript
npm run type-check

# Build com análise
npm run build:analyze

# Servir build local
npm run serve
```

## 📞 Suporte

Para problemas técnicos:
1. Verifique os logs do Vercel
2. Teste localmente primeiro
3. Confirme variáveis de ambiente
4. Verifique compatibilidade do navegador

---

**Status**: ✅ Pronto para produção  
**Última atualização**: Janeiro 2025  
**Versão PWA**: 1.0.0