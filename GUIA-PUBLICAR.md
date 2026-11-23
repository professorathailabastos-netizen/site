# 🚀 Guia para colocar o site no ar

Siga na ordem. Leva cerca de 20 minutos.
Quando aparecer "✅ Confira", pare e confirme.

---

## PARTE 1 — Subir o site para o GitHub

Você já tem conta no GitHub. Agora precisamos colocar os arquivos lá.

### 1.1 Criar o repositório
1. Entre em **github.com** e faça login
2. Clique no **+** no canto superior direito → **New repository**
3. Preencha:
   - **Repository name:** `anesia-cauacu`
   - Marque **Public** (importante: o plano gratuito do Netlify exige público)
   - **NÃO** marque "Add a README file"
4. Clique em **Create repository**

✅ Confira: você vai ver uma página com instruções de "quick setup". Ignore.

### 1.2 Enviar os arquivos
Na página do repositório novo:

1. Clique no link **"uploading an existing file"** (no meio da página)
2. **Arraste a pasta inteira do projeto** para a área de upload
   - A pasta é: `Meu primeiro projeto`
   - Arraste **o conteúdo de dentro dela** (index.html, doacoes.html, css, js, admin, conteudo, assets, netlify.toml e 404.html)
   - ⚠️ Não arraste a pasta em si, e sim os arquivos/pastas de dentro
3. Espere carregar tudo
4. Em "Commit changes", escreva: `Site inicial`
5. Clique em **Commit changes**

✅ Confira: o repositório deve mostrar `index.html`, `doacoes.html`, `css/`, `js/`, `admin/`, `conteudo/`, `assets/`

---

## PARTE 2 — Publicar no Netlify

### 2.1 Criar conta
1. Entre em **netlify.com**
2. Clique em **Sign up**
3. Escolha **GitHub** (mais rápido, conecta direto)
4. Autorize o Netlify

### 2.2 Conectar o site
1. No painel, clique em **Add new site** → **Import an existing project**
2. Escolha **GitHub**
3. Autorize e selecione o repositório `anesia-cauacu`
4. Na tela de configuração:
   - **Branch to deploy:** `main`
   - **Build command:** deixe **vazio**
   - **Publish directory:** `.` (um ponto)
5. Clique em **Deploy site**

✅ Confira: em 1 ou 2 minutos aparece "Published".
Clique no endereço (algo como `random-name-123.netlify.app`) e o site deve abrir.

---

## PARTE 3 — Ativar o painel de edição

Este passo é o que permite você editar pelo navegador.

### 3.1 Ativar Identity
1. No Netlify, dentro do seu site, vá em **Site configuration** (ou **Site settings**)
2. No menu lateral, clique em **Identity**
3. Clique em **Enable Identity**

### 3.2 Ativar Git Gateway
1. Ainda em **Identity**, desça até **Services**
2. Clique em **Enable Git Gateway**
3. Confirme

### 3.3 Convidar você mesma
1. Em **Identity**, clique em **Invite users**
2. Digite **o e-mail da sua conta Google** (o mesmo do GitHub)
3. Clique em **Send**

✅ Confira: você recebe um e-mail do Netlify com um link "Accept the invite".

### 3.4 Aceitar o convite
1. Abra o e-mail no celular ou computador
2. Clique em **Accept the invite**
3. Vai abrir uma tela pedindo senha — **crie uma senha** e guarde
4. Pronto, você agora é usuária do painel

---

## PARTE 4 — Testar o painel

1. No endereço do site, acrescente `/admin`
   Exemplo: `https://seu-site.netlify.app/admin`
2. Faça login com o e-mail e a senha que criou
3. Você verá três menus:
   - **Página inicial**
   - **Página de doações**
   - **Página Seja Multiplicador**
   - **Configurações do site**
4. Clique em **Página inicial** → **Todos os textos da home**
5. Mude um texto qualquer
6. Clique em **Publish** (canto superior direito)
7. Espere 30 segundos e recarregue o site

✅ Confira: a mudança deve aparecer no site.

---

## PARTE 5 — Conectar o domínio anesiacauacu.com.br

### 5.1 Adicionar o domínio no Netlify
1. No site, vá em **Domain management** (ou **Domain settings**)
2. Clique em **Add a domain**
3. Digite `anesiacauacu.com.br`
4. Clique em **Verify** → **Add domain**

### 5.2 Anotar os servidores do Netlify
O Netlify vai mostrar algo como:

```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

**Anote esses 4 endereços.** Você vai precisar deles no próximo passo.

### 5.3 Alterar no Registro.br
1. Entre em **registro.br** e faça login
2. Clique no domínio `anesiacauacu.com.br`
3. Procure **"Alterar servidores DNS"** (ou "DNS")
4. Selecione **"Usar outros servidores DNS"**
5. Apague o que estiver lá e coloque os 4 do Netlify
6. Salve

### 5.4 Esperar
O domínio começa a funcionar em **1 a 24 horas**.
O Netlify mostra o status em **Domain management**.

✅ Confira: quando aparecer "Netlify DNS" com um ✓ verde, está funcionando.
Teste abrindo `anesiacauacu.com.br` no navegador.

### 5.5 Ativar o cadeado (HTTPS)
1. Em **Domain management**, procure **HTTPS**
2. Clique em **Verify DNS configuration**
3. Clique em **Provision certificate**

Pronto: seu site fica com o cadeado de seguro.

---

## Depois de tudo no ar

### Como editar no dia a dia
1. Acesse `anesiacauacu.com.br/admin`
2. Entre com seu e-mail e senha
3. Escolha a página
4. Edite o texto
5. Clique em **Publish**
6. Espere 30 segundos e recarregue o site

### Se algo der errado
- **Site não abre:** confira em netlify.com se o último deploy deu "Published"
- **Painel não abre:** confira se Identity e Git Gateway estão ativos
- **Mudança não aparece:** espere 1 minuto e recarregue com Ctrl+F5
- **Qualquer outro erro:** chame o Packia com o print da tela

### O que NÃO editar pelo painel
Cores, fontes, tamanho dos textos e posição das seções.
Se precisar mudar isso, chame o Packia.

---

## Resumo dos acessos

| O que | Onde |
|---|---|
| Site publicado | anesiacauacu.com.br |
| Painel de edição | anesiacauacu.com.br/admin |
| Código do site | github.com/SEU-USUARIO/anesia-cauacu |
| Hospedagem | app.netlify.com |
| Domínio | registro.br |
